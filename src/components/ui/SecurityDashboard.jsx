import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { usePermissions } from './AdvancedAuthGuard';

// ============================================
// SECURITY MONITORING DASHBOARD
// ============================================

const SecurityDashboard = () => {
  const { checkRole } = usePermissions();
  const [securityData, setSecurityData] = useState({
    activeSessions: 0,
    recentActivities: [],
    rateLimitViolations: [],
    securityAlerts: [],
    systemHealth: 'good'
  });
  const [loading, setLoading] = useState(true);

  const loadSecurityData = async () => {
    try {
      // Get active sessions count
      const { count: activeSessions } = await supabase?.from('user_sessions')?.select('*', { count: 'exact', head: true })?.gt('expires_at', new Date()?.toISOString());

      // Get recent security activities
      const { data: recentActivities } = await supabase?.from('activity_logs')?.select(`
          *,
          user_profiles:user_id(nome, email, papel)
        `)?.in('action', ['security_violation', 'login_failed', 'rate_limit_exceeded'])?.order('created_at', { ascending: false })?.limit(10);

      // Get rate limit violations
      const { data: rateLimitViolations } = await supabase?.from('rate_limits')?.select(`
          *,
          user_profiles:user_id(nome, email, papel)
        `)?.not('blocked_until', 'is', null)?.order('window_start', { ascending: false })?.limit(5);

      setSecurityData({
        activeSessions: activeSessions || 0,
        recentActivities: recentActivities || [],
        rateLimitViolations: rateLimitViolations || [],
        systemHealth: determineSystemHealth(recentActivities, rateLimitViolations)
      });

    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only admins can see security dashboard
  if (!checkRole('admin')) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-600">Acesso negado: Apenas administradores podem ver este dashboard.</p>
      </div>
    );
  }

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const determineSystemHealth = (activities, violations) => {
    const recentViolations = activities?.filter(a => 
      new Date(a.created_at) > new Date(Date.now() - 60 * 60 * 1000) // Last hour
    )?.length;

    if (recentViolations > 10) return 'critical';
    if (recentViolations > 5) return 'warning';
    return 'good';
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getHealthIcon = (health) => {
    switch (health) {
      case 'critical': return '🔴';
      case 'warning': return '🟡';
      default: return '🟢';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">🛡️ Dashboard de Segurança</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(securityData?.systemHealth)}`}>
          {getHealthIcon(securityData?.systemHealth)} Status: {
            securityData?.systemHealth === 'good' ? 'Saudável' :
            securityData?.systemHealth === 'warning' ? 'Atenção' : 'Crítico'
          }
        </div>
      </div>
      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="text-2xl mr-3">👥</div>
            <div>
              <p className="text-sm text-gray-600">Sessões Ativas</p>
              <p className="text-2xl font-bold">{securityData?.activeSessions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="text-2xl mr-3">⚠️</div>
            <div>
              <p className="text-sm text-gray-600">Violações (1h)</p>
              <p className="text-2xl font-bold text-red-600">
                {securityData?.recentActivities?.filter(a => 
                  new Date(a.created_at) > new Date(Date.now() - 60 * 60 * 1000)
                )?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🚫</div>
            <div>
              <p className="text-sm text-gray-600">Rate Limits Ativos</p>
              <p className="text-2xl font-bold text-orange-600">
                {securityData?.rateLimitViolations?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🔍</div>
            <div>
              <p className="text-sm text-gray-600">Eventos (24h)</p>
              <p className="text-2xl font-bold">
                {securityData?.recentActivities?.filter(a => 
                  new Date(a.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                )?.length}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Security Activities */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">🚨 Atividades de Segurança Recentes</h3>
        </div>
        <div className="divide-y">
          {securityData?.recentActivities?.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">
              ✅ Nenhuma violação de segurança recente
            </div>
          ) : (
            securityData?.recentActivities?.map((activity) => (
              <div key={activity?.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">
                        {activity?.action === 'security_violation' ? '🔒' :
                         activity?.action === 'login_failed' ? '❌' : '⏱️'}
                      </span>
                      <p className="font-medium">
                        {activity?.action === 'security_violation' ? 'Violação de Segurança' :
                         activity?.action === 'login_failed'? 'Falha de Login' : 'Limite de Taxa Excedido'}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Usuário: {activity?.user_profiles?.nome || 'Anônimo'} 
                      ({activity?.user_profiles?.email || 'N/A'})
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.created_at)?.toLocaleString('pt-BR')}
                    </p>
                    {activity?.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-blue-600 cursor-pointer">
                          Ver detalhes
                        </summary>
                        <pre className="text-xs bg-gray-50 p-2 mt-1 rounded overflow-x-auto">
                          {JSON.stringify(activity?.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    activity?.action === 'security_violation' ? 'bg-red-100 text-red-800' :
                    activity?.action === 'login_failed'? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity?.user_profiles?.papel || 'N/A'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Rate Limited Users */}
      {securityData?.rateLimitViolations?.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">🚫 Usuários com Rate Limit Ativo</h3>
          </div>
          <div className="divide-y">
            {securityData?.rateLimitViolations?.map((violation) => (
              <div key={violation?.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {violation?.user_profiles?.nome || 'Usuário Desconhecido'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {violation?.user_profiles?.email} • {violation?.action_type}
                    </p>
                    <p className="text-xs text-gray-500">
                      Bloqueado até: {new Date(violation.blocked_until)?.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      {violation?.attempts} tentativas
                    </p>
                    <p className="text-xs text-gray-500">
                      Papel: {violation?.user_profiles?.papel}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Security Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Dicas de Segurança</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Monitore regularmente tentativas de login suspeitas</li>
          <li>• Revise periodicamente as permissões de usuário</li>
          <li>• Mantenha logs de auditoria por pelo menos 90 dias</li>
          <li>• Configure alertas para atividades anômalas</li>
          <li>• Implemente autenticação multifator para administradores</li>
        </ul>
      </div>
    </div>
  );
};

export default SecurityDashboard;