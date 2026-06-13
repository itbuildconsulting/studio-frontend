import { useState } from "react";
import { Plus, Pencil, Trash2, Settings, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "../config";
import { toggleRule, deleteRule } from "../api/crm";
import {
  AutomationRule, EmailTemplate,
  triggerConfig, categoryConfig, delayUnitLabel, parseTriggerConfig,
} from "../data/crm";
import RuleFormDialog from "./RuleFormDialog";

interface Props {
  rules: AutomationRule[];
  templates: EmailTemplate[];
  loading: boolean;
  onRefresh: () => void;
}

function configSummary(rule: AutomationRule): string | null {
  const cfg = parseTriggerConfig(rule.trigger_config);
  if (rule.trigger_type === "plan_expiring")    return `${Number(cfg.days)        || 7}  dias antes do vencimento`;
  if (rule.trigger_type === "credits_low")      return `Limiar: ${Number(cfg.threshold)  || 2}  créditos`;
  if (rule.trigger_type === "student_inactive") return `Sem atividade por ${Number(cfg.min_days)    || 14} dias`;
  if (rule.trigger_type === "win_back")         return `${Number(cfg.days_after_expiry) || 30} dias após vencimento`;
  if (rule.trigger_type === "post_class")       return `${rule.delay_value} ${delayUnitLabel[rule.delay_unit]} após a aula`;
  return null;
}

const RegrasPanel = ({ rules, templates, loading, onRefresh }: Props) => {
  const [formOpen, setFormOpen]   = useState(false);
  const [editing, setEditing]     = useState<AutomationRule | null>(null);
  const [deleting, setDeleting]   = useState<AutomationRule | null>(null);
  const [toggling, setToggling]   = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleNew  = () => { setEditing(null); setFormOpen(true); };
  const handleEdit = (r: AutomationRule) => { setEditing(r); setFormOpen(true); };

  const handleToggle = async (rule: AutomationRule) => {
    setToggling(rule.id);
    try {
      await toggleRule(rule.id);
      toast({ title: rule.active ? "Regra desativada" : "Regra ativada" });
      onRefresh();
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : "Erro ao alterar regra", variant: "destructive" });
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await deleteRule(deleting.id);
      toast({ title: "Regra removida com sucesso" });
      onRefresh();
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : "Erro ao remover regra", variant: "destructive" });
    } finally {
      setDeleteLoading(false);
      setDeleting(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header bar */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="text-base font-bold text-foreground">Regras de Automação</h3>
                <p className="text-sm text-muted-foreground">
                  Configure quando cada e-mail é disparado automaticamente
                </p>
              </div>
            </div>
            <Button size="sm" onClick={handleNew}>
              <Plus className="h-4 w-4 mr-1" />
              Nova Regra
            </Button>
          </div>
        </Card>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}><CardContent className="p-4 h-24 animate-pulse bg-muted/30" /></Card>
            ))}
          </div>
        ) : rules.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Zap className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Nenhuma regra cadastrada</p>
              <p className="text-sm mt-1">Crie regras para automatizar os e-mails aos alunos</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => {
              const trigger  = triggerConfig[rule.trigger_type];
              const tmpl     = rule.template;
              const summary  = configSummary(rule);
              const cat      = tmpl ? categoryConfig[tmpl.category] : null;

              return (
                <Card key={rule.id} className={`transition-opacity ${!rule.active ? "opacity-55" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl mt-0.5 shrink-0">{trigger.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-bold text-foreground">{rule.name}</span>
                          <Badge variant="outline" className="text-[10px]">{trigger.label}</Badge>
                          {rule.active ? (
                            <Badge variant="default" className="text-[10px]">Ativo</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px]">Inativo</Badge>
                          )}
                        </div>
                        {rule.description && (
                          <p className="text-xs text-muted-foreground mb-1">{rule.description}</p>
                        )}
                        {summary && (
                          <p className="text-xs text-muted-foreground mb-1">⏱️ {summary}</p>
                        )}
                        {tmpl && (
                          <div className="mt-2 rounded bg-muted/50 border border-border px-2 py-1.5">
                            <p className="text-[11px] text-muted-foreground">
                              {cat?.emoji} Template:{" "}
                              <span className="font-semibold text-foreground">{tmpl.name}</span>
                              {" — "}
                              <span className="italic">{tmpl.subject}</span>
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(rule)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleting(rule)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={rule.active}
                          disabled={toggling === rule.id}
                          onCheckedChange={() => handleToggle(rule)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <RuleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        rule={editing}
        templates={templates}
        onSaved={onRefresh}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover regra?</AlertDialogTitle>
            <AlertDialogDescription>
              A regra <strong>{deleting?.name}</strong> será removida permanentemente.
              Os e-mails já enviados por ela serão mantidos no histórico.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteLoading}
              className="bg-destructive hover:bg-destructive/90">
              {deleteLoading ? "Removendo..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RegrasPanel;
