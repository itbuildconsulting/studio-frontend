// ─── Types ────────────────────────────────────────────────────────────────────

export type EmailTemplateCategory = 'retention' | 'engagement' | 'revenue' | 'transactional';

export interface EmailTemplate {
  id: number;
  name: string;
  description?: string | null;
  subject: string;
  body_html: string;
  category: EmailTemplateCategory;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TriggerType =
  | 'welcome'
  | 'plan_expiring'
  | 'credits_low'
  | 'student_inactive'
  | 'birthday'
  | 'post_class'
  | 'win_back';

export type DelayUnit = 'minutes' | 'hours' | 'days';

export interface AutomationRule {
  id: number;
  name: string;
  description?: string | null;
  trigger_type: TriggerType;
  trigger_config?: string | null;
  template_id: number;
  delay_value: number;
  delay_unit: DelayUnit;
  active: boolean;
  push_title?: string | null;
  push_body?: string | null;
  push_url?: string | null;
  createdAt: string;
  updatedAt: string;
  template?: Pick<EmailTemplate, 'id' | 'name' | 'subject' | 'category'> | null;
}

export type EmailLogStatus = 'pending' | 'sent' | 'failed' | 'opened';

export interface EmailLog {
  id: number;
  user_id?: number | null;
  rule_id?: number | null;
  template_id?: number | null;
  to_email: string;
  subject: string;
  status: EmailLogStatus;
  error_message?: string | null;
  metadata?: string | null;
  sent_at?: string | null;
  opened_at?: string | null;
  createdAt: string;
  updatedAt: string;
  rule?: { id: number; name: string; trigger_type: string } | null;
  template?: { id: number; name: string; category: string } | null;
}

export interface LogStats {
  total: number;
  pending: number;
  sent: number;
  failed: number;
  opened: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const categoryConfig: Record<EmailTemplateCategory, { label: string; emoji: string }> = {
  retention:    { label: 'Retenção',     emoji: '🔄' },
  engagement:   { label: 'Engajamento',  emoji: '💪' },
  revenue:      { label: 'Receita',      emoji: '💰' },
  transactional:{ label: 'Transacional', emoji: '📧' },
};

export const triggerConfig: Record<TriggerType, { label: string; emoji: string; description: string }> = {
  welcome:          { label: 'Boas-vindas',     emoji: '👋', description: 'Ao comprar o primeiro crédito' },
  plan_expiring:    { label: 'Plano vencendo',  emoji: '⏰', description: 'X dias antes do vencimento' },
  credits_low:      { label: 'Créditos baixos', emoji: '⚠️', description: 'Quando créditos ativos caem abaixo de um limite' },
  student_inactive: { label: 'Aluno inativo',   emoji: '😴', description: 'Sem check-in por X dias' },
  birthday:         { label: 'Aniversário',     emoji: '🎂', description: 'No dia do aniversário do aluno' },
  post_class:       { label: 'Pós-aula',        emoji: '✅', description: 'Após o check-in de uma aula' },
  win_back:         { label: 'Reengajamento',   emoji: '🏆', description: 'Crédito expirado há X dias e sem crédito ativo' },
};

export const logStatusConfig: Record<
  EmailLogStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
> = {
  pending: { label: 'Pendente', variant: 'outline' },
  sent:    { label: 'Enviado',  variant: 'secondary' },
  failed:  { label: 'Falhou',   variant: 'destructive' },
  opened:  { label: 'Aberto',   variant: 'default' },
};

export const delayUnitLabel: Record<DelayUnit, string> = {
  minutes: 'Minutos',
  hours:   'Horas',
  days:    'Dias',
};

// ─── Utilities ────────────────────────────────────────────────────────────────

export function formatDateTimeBR(dateStr: string): string {
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatDateBR(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

export function parseTriggerConfig(raw?: string | null): Record<string, unknown> {
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}
