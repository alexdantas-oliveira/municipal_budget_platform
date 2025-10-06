-- Location: supabase/migrations/20250918191227_proposal_tracking_system.sql
-- Schema Analysis: Only users table exists with columns: id, nome, ativo, email, papel, cpf_cnpj, criado_em, updated_at, auth_user_id, tipo_usuario
-- Integration Type: addition - adding new proposal tracking tables
-- Dependencies: references existing users table

-- 1. Types and Core Tables
CREATE TYPE public.proposal_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'em_execucao');
CREATE TYPE public.execution_status_enum AS ENUM ('em_andamento', 'atrasada', 'concluida');

-- Create user_profiles table as intermediary for PostgREST compatibility
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    nome TEXT NOT NULL,
    papel TEXT DEFAULT 'citizen',
    tipo_usuario TEXT DEFAULT 'citizen',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create proposals table
CREATE TABLE public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    localidade TEXT NOT NULL,
    orcamento_aprovado DECIMAL(15,2),
    categoria TEXT,
    status public.proposal_status DEFAULT 'draft'::public.proposal_status,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMPTZ
);

-- Create execution_status table for tracking proposal execution
CREATE TABLE public.execution_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposta_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE,
    percentual_fisico DECIMAL(5,2) DEFAULT 0.00 CHECK (percentual_fisico >= 0 AND percentual_fisico <= 100),
    percentual_financeiro DECIMAL(5,2) DEFAULT 0.00 CHECK (percentual_financeiro >= 0 AND percentual_financeiro <= 100),
    status_execucao public.execution_status_enum DEFAULT 'em_andamento'::public.execution_status_enum,
    comentarios_internos TEXT,
    atualizado_em TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    atualizado_por UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Essential Indexes
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_proposals_created_by ON public.proposals(created_by);
CREATE INDEX idx_proposals_status ON public.proposals(status);
CREATE INDEX idx_proposals_localidade ON public.proposals(localidade);
CREATE INDEX idx_execution_status_proposta_id ON public.execution_status(proposta_id);
CREATE INDEX idx_execution_status_updated_at ON public.execution_status(atualizado_em);

-- 3. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.execution_status ENABLE ROW LEVEL SECURITY;

-- 4. Functions for role-based access
CREATE OR REPLACE FUNCTION public.has_role_from_users(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id::TEXT = current_setting('request.jwt.claims', true)::json->>'sub'
    AND (u.papel = required_role OR u.tipo_usuario = required_role)
)
$$;

-- 5. RLS Policies

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (user_id::TEXT = current_setting('request.jwt.claims', true)::json->>'sub')
WITH CHECK (user_id::TEXT = current_setting('request.jwt.claims', true)::json->>'sub');

-- Pattern 4: Public Read, Private Write for proposals
CREATE POLICY "public_can_read_proposals"
ON public.proposals
FOR SELECT
TO public
USING (status = 'approved'::public.proposal_status OR status = 'em_execucao'::public.proposal_status);

CREATE POLICY "authenticated_users_manage_proposals"
ON public.proposals
FOR ALL
TO authenticated
USING (
    created_by::TEXT = (
        SELECT up.id::TEXT FROM public.user_profiles up 
        WHERE up.user_id::TEXT = current_setting('request.jwt.claims', true)::json->>'sub' 
        LIMIT 1
    )
    OR public.has_role_from_users('gestor')
    OR public.has_role_from_users('admin')
)
WITH CHECK (
    created_by::TEXT = (
        SELECT up.id::TEXT FROM public.user_profiles up 
        WHERE up.user_id::TEXT = current_setting('request.jwt.claims', true)::json->>'sub' 
        LIMIT 1
    )
    OR public.has_role_from_users('gestor')
    OR public.has_role_from_users('admin')
);

-- Pattern 4: Public read for execution status, managers can update
CREATE POLICY "public_can_read_execution_status"
ON public.execution_status
FOR SELECT
TO public
USING (true);

CREATE POLICY "managers_can_update_execution_status"
ON public.execution_status
FOR ALL
TO authenticated
USING (
    public.has_role_from_users('gestor')
    OR public.has_role_from_users('admin')
)
WITH CHECK (
    public.has_role_from_users('gestor')
    OR public.has_role_from_users('admin')
);

-- 6. Functions for automatic profile synchronization
CREATE OR REPLACE FUNCTION public.sync_user_profile()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, nome, papel, tipo_usuario)
  VALUES (NEW.id, NEW.email, NEW.nome, NEW.papel, NEW.tipo_usuario)
  ON CONFLICT (user_id) DO UPDATE SET
    email = NEW.email,
    nome = NEW.nome,
    papel = NEW.papel,
    tipo_usuario = NEW.tipo_usuario,
    updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- Trigger for user profile synchronization
CREATE TRIGGER on_user_updated
  AFTER INSERT OR UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_profile();

-- 7. Mock Data for testing
DO $$
DECLARE
    admin_profile_id UUID := gen_random_uuid();
    gestor_profile_id UUID := gen_random_uuid();
    citizen_profile_id UUID := gen_random_uuid();
    proposal1_id UUID := gen_random_uuid();
    proposal2_id UUID := gen_random_uuid();
    proposal3_id UUID := gen_random_uuid();
BEGIN
    -- Sync existing users to user_profiles
    INSERT INTO public.user_profiles (id, user_id, email, nome, papel, tipo_usuario)
    SELECT 
        gen_random_uuid(),
        u.id,
        COALESCE(u.email, 'test@example.com'),
        COALESCE(u.nome, 'Test User'),
        COALESCE(u.papel, 'citizen'),
        COALESCE(u.tipo_usuario, 'citizen')
    FROM public.users u
    WHERE NOT EXISTS (
        SELECT 1 FROM public.user_profiles up WHERE up.user_id = u.id
    );

    -- Get existing user profile IDs
    SELECT id INTO admin_profile_id FROM public.user_profiles WHERE papel = 'admin' LIMIT 1;
    SELECT id INTO gestor_profile_id FROM public.user_profiles WHERE papel = 'gestor' LIMIT 1;
    SELECT id INTO citizen_profile_id FROM public.user_profiles WHERE papel = 'citizen' OR papel IS NULL LIMIT 1;

    -- If no users found, create sample profiles
    IF admin_profile_id IS NULL THEN
        admin_profile_id := gen_random_uuid();
        INSERT INTO public.user_profiles (id, user_id, email, nome, papel, tipo_usuario)
        VALUES (admin_profile_id, gen_random_uuid()::TEXT, 'admin@municipio.gov.br', 'Administrador Sistema', 'admin', 'admin');
    END IF;

    IF gestor_profile_id IS NULL THEN
        gestor_profile_id := gen_random_uuid();
        INSERT INTO public.user_profiles (id, user_id, email, nome, papel, tipo_usuario)
        VALUES (gestor_profile_id, gen_random_uuid()::TEXT, 'gestor@municipio.gov.br', 'Gestor Municipal', 'gestor', 'gestor');
    END IF;

    IF citizen_profile_id IS NULL THEN
        citizen_profile_id := gen_random_uuid();
        INSERT INTO public.user_profiles (id, user_id, email, nome, papel, tipo_usuario)
        VALUES (citizen_profile_id, gen_random_uuid()::TEXT, 'cidadao@email.com', 'João Silva', 'citizen', 'citizen');
    END IF;

    -- Create sample proposals
    INSERT INTO public.proposals (id, titulo, descricao, localidade, orcamento_aprovado, categoria, status, created_by, approved_by, approved_at)
    VALUES
        (proposal1_id, 'Revitalização da Praça Central', 'Reforma completa da praça central com novos equipamentos de lazer e paisagismo', 'Centro', 150000.00, 'Infraestrutura', 'em_execucao'::public.proposal_status, citizen_profile_id, admin_profile_id, CURRENT_TIMESTAMP - interval '30 days'),
        (proposal2_id, 'Construção de Ciclovias na Av. Principal', 'Implementação de 5km de ciclovia na avenida principal da cidade', 'Zona Norte', 250000.00, 'Mobilidade', 'em_execucao'::public.proposal_status, citizen_profile_id, gestor_profile_id, CURRENT_TIMESTAMP - interval '15 days'),
        (proposal3_id, 'Programa de Educação Ambiental nas Escolas', 'Implementação de programa educativo sobre sustentabilidade em 10 escolas municipais', 'Citywide', 75000.00, 'Educação', 'em_execucao'::public.proposal_status, citizen_profile_id, admin_profile_id, CURRENT_TIMESTAMP - interval '45 days');

    -- Create execution status for approved proposals
    INSERT INTO public.execution_status (proposta_id, percentual_fisico, percentual_financeiro, status_execucao, comentarios_internos, atualizado_por)
    VALUES
        (proposal1_id, 75.50, 68.30, 'em_andamento'::public.execution_status_enum, 'Obras na fase final. Equipamentos chegam na próxima semana.', gestor_profile_id),
        (proposal2_id, 45.20, 52.10, 'em_andamento'::public.execution_status_enum, 'Primeira etapa concluída. Iniciando segunda fase na próxima segunda.', gestor_profile_id),
        (proposal3_id, 90.00, 85.75, 'em_andamento'::public.execution_status_enum, 'Programa implementado em 9 escolas. Última escola será concluída esta semana.', admin_profile_id);

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating mock data: %', SQLERRM;
END $$;