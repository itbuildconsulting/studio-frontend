import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "../config";
import { createRule, updateRule } from "../api/crm";
import {
  AutomationRule, EmailTemplate, TriggerType, DelayUnit,
  triggerConfig, categoryConfig, delayUnitLabel, parseTriggerConfig,
} from "../data/crm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: AutomationRule | null;
  templates: EmailTemplate[];
  onSaved: () => void;
}

type FormState = {
  name: string;
  description: string;
  trigger_type: TriggerType;
  template_id: string;
  delay_value: number;
  delay_unit: DelayUnit;
  active: boolean;
  // trigger_config fields
  cfg_days: number;
  cfg_threshold: number;
  cfg_min_days: number;
  cfg_days_after_expiry: number;
  // push notification
  push_enabled: boolean;
  push_title: string;
  push_body: string;
  push_url: string;
};

const EMPTY: FormState = {
  name: "", description: "", trigger_type: "welcome", template_id: "",
  delay_value: 1, delay_unit: "hours", active: true,
  cfg_days: 7, cfg_threshold: 2, cfg_min_days: 14, cfg_days_after_expiry: 30,
  push_enabled: false, push_title: "", push_body: "", push_url: "",
};

function buildTriggerConfig(trigger: TriggerType, form: FormState): Record<string, unknown> | null {
  if (trigger === "plan_expiring")    return { days: form.cfg_days };
  if (trigger === "credits_low")      return { threshold: form.cfg_threshold };
  if (trigger === "student_inactive") return { min_days: form.cfg_min_days };
  if (trigger === "win_back")         return { days_after_expiry: form.cfg_days_after_expiry };
  return null;
}

const RuleFormDialog = ({ open, onOpenChange, rule, templates, onSaved }: Props) => {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (rule) {
      const cfg = parseTriggerConfig(rule.trigger_config);
      setForm({
        name:          rule.name,
        description:   rule.description ?? "",
        trigger_type:  rule.trigger_type,
        template_id:   String(rule.template_id),
        delay_value:   rule.delay_value,
        delay_unit:    rule.delay_unit,
        active:        rule.active,
        cfg_days:              Number(cfg.days)              || 7,
        cfg_threshold:         Number(cfg.threshold)         || 2,
        cfg_min_days:          Number(cfg.min_days)          || 14,
        cfg_days_after_expiry: Number(cfg.days_after_expiry) || 30,
        push_enabled: !!rule.push_title,
        push_title:   rule.push_title ?? "",
        push_body:    rule.push_body  ?? "",
        push_url:     (rule as any).push_url ?? "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, rule]);

  const set = (key: keyof FormState, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.template_id) {
      toast({ title: "Nome e template são obrigatórios", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const pushTitle = form.push_enabled && form.push_title.trim() ? form.push_title.trim() : null;
      const pushBody  = form.push_enabled && form.push_body.trim()  ? form.push_body.trim()  : null;
      const pushUrl   = form.push_enabled && form.push_url.trim()   ? form.push_url.trim()   : null;

      const payload = {
        name:           form.name,
        description:    form.description || undefined,
        trigger_type:   form.trigger_type,
        trigger_config: buildTriggerConfig(form.trigger_type, form),
        template_id:    Number(form.template_id),
        delay_value:    form.trigger_type === "post_class" ? form.delay_value : 0,
        delay_unit:     form.trigger_type === "post_class" ? form.delay_unit  : "hours",
        push_title:     pushTitle,
        push_body:      pushBody,
        push_url:       pushUrl,
        ...(rule ? { active: form.active } : {}),
      };

      if (rule) {
        await updateRule(rule.id, payload);
        toast({ title: "Regra atualizada com sucesso" });
      } else {
        await createRule(payload);
        toast({ title: "Regra criada com sucesso" });
      }
      onSaved();
      onOpenChange(false);
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : "Erro ao salvar regra", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const trigger        = triggerConfig[form.trigger_type];
  const activeTemplates = templates.filter((t) => t.active);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{rule ? "Editar Regra" : "Nova Regra de Automação"}</DialogTitle>
          <DialogDescription>
            Defina o gatilho, o template de e-mail e o momento do disparo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Identificação */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nome da regra <span className="text-destructive">*</span></Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="Ex: Boas-vindas ao novo aluno" />
            </div>
            <div className="space-y-1.5">
              <Label>Descrição (opcional)</Label>
              <Input value={form.description} onChange={(e) => set("description", e.target.value)}
                placeholder="Contexto desta regra" />
            </div>
          </div>

          <Separator />

          {/* Gatilho */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Gatilho</h4>
            <div className="space-y-1.5">
              <Label>Tipo de gatilho</Label>
              <Select value={form.trigger_type} onValueChange={(v) => set("trigger_type", v as TriggerType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.entries(triggerConfig) as [TriggerType, typeof triggerConfig[TriggerType]][]).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>
                      {cfg.emoji} {cfg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">{trigger.description}</p>
            </div>

            {form.trigger_type === "plan_expiring" && (
              <div className="space-y-1.5">
                <Label>Dias antes do vencimento</Label>
                <Input type="number" min={1} value={form.cfg_days}
                  onChange={(e) => set("cfg_days", Number.parseInt(e.target.value) || 1)} className="w-24" />
              </div>
            )}
            {form.trigger_type === "credits_low" && (
              <div className="space-y-1.5">
                <Label>Alertar quando créditos ativos &lt;</Label>
                <Input type="number" min={1} value={form.cfg_threshold}
                  onChange={(e) => set("cfg_threshold", Number.parseInt(e.target.value) || 1)} className="w-24" />
              </div>
            )}
            {form.trigger_type === "student_inactive" && (
              <div className="space-y-1.5">
                <Label>Dias sem check-in</Label>
                <Input type="number" min={1} value={form.cfg_min_days}
                  onChange={(e) => set("cfg_min_days", Number.parseInt(e.target.value) || 1)} className="w-24" />
              </div>
            )}
            {form.trigger_type === "win_back" && (
              <div className="space-y-1.5">
                <Label>Dias após expiração do crédito</Label>
                <Input type="number" min={1} value={form.cfg_days_after_expiry}
                  onChange={(e) => set("cfg_days_after_expiry", Number.parseInt(e.target.value) || 1)} className="w-24" />
              </div>
            )}
            {form.trigger_type === "post_class" && (
              <div className="space-y-1.5">
                <Label>Enviar após a aula</Label>
                <div className="flex gap-2">
                  <Input type="number" min={0} value={form.delay_value}
                    onChange={(e) => set("delay_value", Number.parseInt(e.target.value) || 0)} className="w-20" />
                  <Select value={form.delay_unit} onValueChange={(v) => set("delay_unit", v as DelayUnit)}>
                    <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.entries(delayUnitLabel) as [DelayUnit, string][]).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Template de e-mail */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Template de e-mail</h4>
            <div className="space-y-1.5">
              <Label>Template <span className="text-destructive">*</span></Label>
              <Select value={form.template_id} onValueChange={(v) => set("template_id", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template ativo" />
                </SelectTrigger>
                <SelectContent>
                  {activeTemplates.length === 0 ? (
                    <SelectItem value="__none" disabled>Nenhum template ativo</SelectItem>
                  ) : (
                    activeTemplates.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {categoryConfig[t.category].emoji} {t.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {form.template_id && (
                <p className="text-[11px] text-muted-foreground">
                  Assunto: {templates.find((t) => String(t.id) === form.template_id)?.subject}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Push notification */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Switch
                checked={form.push_enabled}
                onCheckedChange={(v) => set("push_enabled", v)}
              />
              <div>
                <h4 className="text-sm font-semibold">Push notification</h4>
                <p className="text-[11px] text-muted-foreground">
                  Envia também uma notificação para o app do aluno
                </p>
              </div>
            </div>
            {form.push_enabled && (
              <div className="space-y-3 pl-1">
                <div className="space-y-1.5">
                  <Label>Título <span className="text-destructive">*</span></Label>
                  <Input
                    maxLength={100}
                    placeholder="ex: Seu plano está vencendo!"
                    value={form.push_title}
                    onChange={(e) => set("push_title", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Mensagem <span className="text-destructive">*</span></Label>
                  <Textarea
                    rows={2}
                    maxLength={250}
                    placeholder="ex: Renove agora e continue treinando sem parar."
                    value={form.push_body}
                    onChange={(e) => set("push_body", e.target.value)}
                  />
                  <p className="text-[11px] text-muted-foreground text-right">
                    {form.push_body.length}/250
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Variáveis: <code className="bg-muted px-1 rounded">{"{{nome}}"}</code> <code className="bg-muted px-1 rounded">{"{{email}}"}</code> — substituídas por aluno no disparo
                </p>
                <div className="space-y-1.5">
                  <Label>Link ao tocar (opcional)</Label>
                  <Input
                    placeholder="ex: meuapp://tela/renovar"
                    value={form.push_url}
                    onChange={(e) => set("push_url", e.target.value)}
                    maxLength={500}
                  />
                  <p className="text-[11px] text-muted-foreground">Deep link para abrir uma tela do app ao tocar</p>
                </div>
              </div>
            )}
          </div>

          {/* Status (edit only) */}
          {rule && (
            <>
              <Separator />
              <div className="flex items-center gap-3">
                <Switch checked={form.active} onCheckedChange={(v) => set("active", v)} />
                <Label>{form.active ? "Regra ativa" : "Regra inativa"}</Label>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Salvando..." : rule ? "Salvar alterações" : "Criar regra"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RuleFormDialog;
