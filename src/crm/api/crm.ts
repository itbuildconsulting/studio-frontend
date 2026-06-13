import { callApi as conectAPI } from '../config';
import type { EmailTemplate, AutomationRule, EmailLog, LogStats } from '../data/crm';

// ─── Templates ────────────────────────────────────────────────────────────────

export async function listTemplates(): Promise<{ success: boolean; data: EmailTemplate[] }> {
  return conectAPI('/crm/templates', 'GET');
}

export async function createTemplate(
  data: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<{ success: boolean; data: EmailTemplate; message: string }> {
  return conectAPI('/crm/templates', 'POST', data);
}

export async function updateTemplate(
  id: number,
  data: Partial<Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<{ success: boolean; data: EmailTemplate; message: string }> {
  return conectAPI(`/crm/templates/${id}`, 'PUT', data);
}

export async function deleteTemplate(id: number): Promise<{ success: boolean; message: string }> {
  return conectAPI(`/crm/templates/${id}`, 'DELETE');
}

export async function testTemplate(id: number, to_email: string): Promise<{ success: boolean; message: string }> {
  return conectAPI(`/crm/templates/${id}/test`, 'POST', { to_email });
}

// ─── Rules ────────────────────────────────────────────────────────────────────

export async function listRules(): Promise<{ success: boolean; data: AutomationRule[] }> {
  return conectAPI('/crm/rules', 'GET');
}

export async function createRule(data: {
  name: string;
  description?: string;
  trigger_type: string;
  trigger_config?: Record<string, unknown> | null;
  template_id: number;
  delay_value?: number;
  delay_unit?: string;
  push_title?: string | null;
  push_body?: string | null;
  push_url?: string | null;
}): Promise<{ success: boolean; data: AutomationRule; message: string }> {
  return conectAPI('/crm/rules', 'POST', data);
}

export async function updateRule(
  id: number,
  data: Partial<{
    name: string;
    description: string;
    trigger_type: string;
    trigger_config: Record<string, unknown> | null;
    template_id: number;
    delay_value: number;
    delay_unit: string;
    active: boolean;
    push_title: string | null;
    push_body: string | null;
    push_url: string | null;
  }>,
): Promise<{ success: boolean; data: AutomationRule; message: string }> {
  return conectAPI(`/crm/rules/${id}`, 'PUT', data);
}

export async function toggleRule(id: number): Promise<{ success: boolean; data: AutomationRule; message: string }> {
  return conectAPI(`/crm/rules/${id}/toggle`, 'PATCH');
}

export async function deleteRule(id: number): Promise<{ success: boolean; message: string }> {
  return conectAPI(`/crm/rules/${id}`, 'DELETE');
}

// ─── Logs ─────────────────────────────────────────────────────────────────────

export async function listLogs(filters: {
  status?: string;
  rule_id?: number;
  limit?: number;
  offset?: number;
} = {}): Promise<{ success: boolean; data: EmailLog[]; meta: { total: number } }> {
  const params = new URLSearchParams();
  if (filters.status)  params.set('status',  filters.status);
  if (filters.rule_id) params.set('rule_id', String(filters.rule_id));
  params.set('limit',  String(filters.limit  ?? 50));
  params.set('offset', String(filters.offset ?? 0));
  return conectAPI(`/crm/logs?${params}`, 'GET');
}

export async function getLogStats(days = 30): Promise<{ success: boolean; data: LogStats }> {
  return conectAPI(`/crm/logs/stats?days=${days}`, 'GET');
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export async function runEngine(): Promise<{ success: boolean; data: { processed: number; queued: number } }> {
  return conectAPI('/crm/engine/run', 'POST');
}

// ─── Push Manual ──────────────────────────────────────────────────────────────

export interface PushRecipient {
  id: number;
  name: string;
  email: string;
  tokenCount: number;
}

export async function getPushRecipients(): Promise<{ success: boolean; data: PushRecipient[] }> {
  return conectAPI('/crm/push/recipients', 'GET');
}

export async function sendManualPush(data: {
  personIds: number[];
  title: string;
  body: string;
  url?: string | null;
}): Promise<{ success: boolean; data: { sent: number; disabled: number } }> {
  return conectAPI('/crm/push/send', 'POST', data);
}

// ─── Push Templates ───────────────────────────────────────────────────────────

export interface PushTemplate {
  id: number;
  name: string;
  title: string;
  body: string;
  url: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function listPushTemplates(): Promise<{ success: boolean; data: PushTemplate[] }> {
  return conectAPI('/crm/push/templates', 'GET');
}

export async function createPushTemplate(data: {
  name: string; title: string; body: string; url?: string | null;
}): Promise<{ success: boolean; data: PushTemplate; message: string }> {
  return conectAPI('/crm/push/templates', 'POST', data);
}

export async function updatePushTemplate(id: number, data: {
  name?: string; title?: string; body?: string; url?: string | null;
}): Promise<{ success: boolean; data: PushTemplate; message: string }> {
  return conectAPI(`/crm/push/templates/${id}`, 'PUT', data);
}

export async function deletePushTemplate(id: number): Promise<{ success: boolean; message: string }> {
  return conectAPI(`/crm/push/templates/${id}`, 'DELETE');
}

export interface PushLog {
  id: number;
  title: string;
  body: string;
  recipient_count: number;
  sent_count: number;
  disabled_count: number;
  status: 'sent' | 'partial' | 'failed';
  sent_at: string;
  createdAt: string;
}

export async function listPushLogs(params: { limit?: number; offset?: number } = {}): Promise<{
  success: boolean;
  data: PushLog[];
  meta: { total: number };
}> {
  const p = new URLSearchParams();
  p.set('limit',  String(params.limit  ?? 20));
  p.set('offset', String(params.offset ?? 0));
  return conectAPI(`/crm/push/logs?${p}`, 'GET');
}
