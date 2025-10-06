-- Location: supabase/migrations/20250918194330_comprehensive_rbac_system.sql
-- Schema Analysis: Building upon existing user_profiles, proposals, execution_status tables
-- Integration Type: RBAC Enhancement - Adding comprehensive role-based security
-- Dependencies: user_profiles, proposals, execution_status, users

-- ============================================
-- FASE 1: COMPREHENSIVE RBAC DATABASE SCHEMA
-- ============================================

-- 1. Enhanced Role System
DO $$
BEGIN
  -- Add enhanced role field to user_profiles if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='permissions') THEN
    ALTER TABLE public.user_profiles ADD COLUMN permissions JSONB DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='is_active') THEN
    ALTER TABLE public.user_profiles ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='last_login') THEN
    ALTER TABLE public.user_profiles ADD COLUMN last_login TIMESTAMPTZ;
  END IF;
END $$;

-- 2. Session Management Table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Activity Audit Log
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Rate Limiting Table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  attempts INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  blocked_until TIMESTAMPTZ
);

-- 5. Security Policies Table
CREATE TABLE IF NOT EXISTS public.security_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_name TEXT NOT NULL UNIQUE,
  resource_type TEXT NOT NULL,
  allowed_roles TEXT[] NOT NULL,
  conditions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ESSENTIAL INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON public.user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action ON public.rate_limits(user_id, action_type);
CREATE INDEX IF NOT EXISTS idx_security_policies_resource ON public.security_policies(resource_type);

-- ============================================
-- RBAC HELPER FUNCTIONS
-- ============================================

-- Function: Check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.papel = required_role 
    AND up.is_active = true
)
$$;

-- Function: Check multiple roles
CREATE OR REPLACE FUNCTION public.has_any_role(required_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.papel = ANY(required_roles)
    AND up.is_active = true
)
$$;

-- Function: Check if user can access proposal
CREATE OR REPLACE FUNCTION public.can_access_proposal(proposal_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid()
    AND up.is_active = true
    AND (
        -- Own proposals
        EXISTS (SELECT 1 FROM public.proposals p WHERE p.id = proposal_uuid AND p.created_by = up.id)
        OR 
        -- Admin/Manager can see all
        up.papel IN ('admin', 'gestor')
        OR
        -- Approved proposals are public for tracking
        EXISTS (SELECT 1 FROM public.proposals p WHERE p.id = proposal_uuid AND p.status IN ('approved', 'em_execucao'))
    )
)
$$;

-- Function: Check if user can edit execution status
CREATE OR REPLACE FUNCTION public.can_edit_execution(proposal_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid()
    AND up.papel IN ('admin', 'gestor')
    AND up.is_active = true
)
$$;

-- Function: Log user activity
CREATE OR REPLACE FUNCTION public.log_activity(
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT '{}'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.activity_logs (
        user_id, action, resource_type, resource_id, details
    ) VALUES (
        auth.uid(), p_action, p_resource_type, p_resource_id, p_details
    );
END;
$$;

-- Function: Check rate limit
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_action_type TEXT,
    p_max_attempts INTEGER DEFAULT 10,
    p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_attempts INTEGER;
    window_start TIMESTAMPTZ;
BEGIN
    -- Clean old windows
    DELETE FROM public.rate_limits 
    WHERE window_start < NOW() - INTERVAL '1 hour' * p_window_minutes / 60;
    
    -- Get current window attempts
    SELECT attempts, window_start INTO current_attempts, window_start
    FROM public.rate_limits
    WHERE user_id = auth.uid() AND action_type = p_action_type;
    
    IF current_attempts IS NULL THEN
        -- First attempt in window
        INSERT INTO public.rate_limits (user_id, action_type, attempts)
        VALUES (auth.uid(), p_action_type, 1);
        RETURN true;
    END IF;
    
    IF current_attempts >= p_max_attempts THEN
        -- Rate limit exceeded
        UPDATE public.rate_limits 
        SET blocked_until = NOW() + INTERVAL '1 hour'
        WHERE user_id = auth.uid() AND action_type = p_action_type;
        RETURN false;
    END IF;
    
    -- Increment attempts
    UPDATE public.rate_limits 
    SET attempts = attempts + 1, last_activity = NOW()
    WHERE user_id = auth.uid() AND action_type = p_action_type;
    
    RETURN true;
END;
$$;

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_policies ENABLE ROW LEVEL SECURITY;

-- ============================================
-- COMPREHENSIVE RLS POLICIES
-- ============================================

-- User Sessions - Users can only see their own sessions
CREATE POLICY "users_manage_own_sessions"
ON public.user_sessions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admin can view all sessions for monitoring
CREATE POLICY "admin_view_all_sessions"
ON public.user_sessions
FOR SELECT
TO authenticated
USING (public.has_role('admin'));

-- Activity Logs - Users can see their own, admins see all
CREATE POLICY "users_view_own_activity"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_role('admin'));

-- Rate Limits - Users manage their own
CREATE POLICY "users_manage_own_rate_limits"
ON public.rate_limits
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Security Policies - Only admins can manage
CREATE POLICY "admin_manage_security_policies"
ON public.security_policies
FOR ALL
TO authenticated
USING (public.has_role('admin'))
WITH CHECK (public.has_role('admin'));

-- Enhanced Proposals Policy
DROP POLICY IF EXISTS "users_manage_own_proposals" ON public.proposals;
CREATE POLICY "enhanced_proposal_access"
ON public.proposals
FOR SELECT
TO authenticated
USING (public.can_access_proposal(id));

-- Proposal creation - only citizens and entities
CREATE POLICY "citizens_create_proposals"
ON public.proposals
FOR INSERT
TO authenticated
WITH CHECK (
    public.has_any_role(ARRAY['citizen', 'entity']) 
    AND public.check_rate_limit('proposal_creation', 5, 60)
);

-- Proposal updates - creators and managers
CREATE POLICY "manage_proposals"
ON public.proposals
FOR UPDATE
TO authenticated
USING (
    created_by = auth.uid() OR public.has_any_role(ARRAY['admin', 'gestor'])
)
WITH CHECK (
    created_by = auth.uid() OR public.has_any_role(ARRAY['admin', 'gestor'])
);

-- Enhanced Execution Status Policies
DROP POLICY IF EXISTS "users_manage_own_execution_status" ON public.execution_status;

-- Public read for transparency
CREATE POLICY "public_read_execution_status"
ON public.execution_status
FOR SELECT
TO authenticated
USING (true);

-- Only managers can update execution status
CREATE POLICY "managers_update_execution_status"
ON public.execution_status
FOR ALL
TO authenticated
USING (public.can_edit_execution(proposta_id))
WITH CHECK (public.can_edit_execution(proposta_id));

-- ============================================
-- SECURITY TRIGGERS
-- ============================================

-- Trigger: Log proposal actions
CREATE OR REPLACE FUNCTION public.log_proposal_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM public.log_activity('create', 'proposal', NEW.id, 
            jsonb_build_object('title', NEW.titulo, 'category', NEW.categoria));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM public.log_activity('update', 'proposal', NEW.id,
            jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM public.log_activity('delete', 'proposal', OLD.id,
            jsonb_build_object('title', OLD.titulo));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

CREATE TRIGGER proposal_activity_log
    AFTER INSERT OR UPDATE OR DELETE ON public.proposals
    FOR EACH ROW EXECUTE FUNCTION public.log_proposal_activity();

-- Trigger: Log execution status changes
CREATE OR REPLACE FUNCTION public.log_execution_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM public.log_activity('create', 'execution_status', NEW.id,
            jsonb_build_object('proposal_id', NEW.proposta_id, 'status', NEW.status_execucao));
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM public.log_activity('update', 'execution_status', NEW.id,
            jsonb_build_object(
                'proposal_id', NEW.proposta_id,
                'old_status', OLD.status_execucao,
                'new_status', NEW.status_execucao,
                'physical_progress', NEW.percentual_fisico,
                'financial_progress', NEW.percentual_financeiro
            ));
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER execution_status_activity_log
    AFTER INSERT OR UPDATE ON public.execution_status
    FOR EACH ROW EXECUTE FUNCTION public.log_execution_activity();

-- ============================================
-- INITIAL SECURITY POLICIES DATA
-- ============================================
DO $$
BEGIN
    INSERT INTO public.security_policies (policy_name, resource_type, allowed_roles, conditions) VALUES
        ('proposal_creation', 'proposals', ARRAY['citizen', 'entity'], '{"max_per_day": 5}'),
        ('proposal_review', 'proposals', ARRAY['admin', 'gestor'], '{}'),
        ('execution_management', 'execution_status', ARRAY['admin', 'gestor'], '{}'),
        ('user_management', 'user_profiles', ARRAY['admin'], '{}'),
        ('system_configuration', 'admin_config', ARRAY['admin'], '{}')
    ON CONFLICT (policy_name) DO NOTHING;
END $$;