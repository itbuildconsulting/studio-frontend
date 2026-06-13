import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "../config";
import { createTemplate, updateTemplate } from "../api/crm";
import { EmailTemplate, categoryConfig, EmailTemplateCategory } from "../data/crm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: EmailTemplate | null;
  onSaved: () => void;
}

const EMPTY = {
  name: "", description: "", subject: "", body_html: "",
  category: "transactional" as EmailTemplateCategory, active: true,
};

const TemplateFormDialog = ({ open, onOpenChange, template, onSaved }: Props) => {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        template
          ? {
              name: template.name,
              description: template.description ?? "",
              subject: template.subject,
              body_html: template.body_html,
              category: template.category,
              active: template.active,
            }
          : EMPTY,
      );
    }
  }, [open, template]);

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.subject.trim() || !form.body_html.trim()) {
      toast({ title: "Preencha os campos obrigatórios", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (template) {
        await updateTemplate(template.id, form);
        toast({ title: "Template atualizado com sucesso" });
      } else {
        await createTemplate(form);
        toast({ title: "Template criado com sucesso" });
      }
      onSaved();
      onOpenChange(false);
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : "Erro ao salvar template", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template ? "Editar Template" : "Novo Template de E-mail"}</DialogTitle>
          <DialogDescription>
            Use {"{{nome}}"} e {"{{email}}"} para personalizar a mensagem com os dados do aluno.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Nome do template <span className="text-destructive">*</span></Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="Ex: Boas-vindas ao novo aluno" />
            </div>
            <div className="space-y-1.5">
              <Label>Categoria <span className="text-destructive">*</span></Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.entries(categoryConfig) as [EmailTemplateCategory, { label: string; emoji: string }][]).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>
                      {cfg.emoji} {cfg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {template && (
              <div className="space-y-1.5">
                <Label>Status</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch checked={form.active} onCheckedChange={(v) => set("active", v)} />
                  <span className="text-sm text-muted-foreground">{form.active ? "Ativo" : "Inativo"}</span>
                </div>
              </div>
            )}
            <div className="col-span-2 space-y-1.5">
              <Label>Descrição (opcional)</Label>
              <Input value={form.description} onChange={(e) => set("description", e.target.value)}
                placeholder="Breve descrição do uso deste template" />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Assunto do e-mail <span className="text-destructive">*</span></Label>
              <Input value={form.subject} onChange={(e) => set("subject", e.target.value)}
                placeholder="Ex: Olá {{nome}}, bem-vindo ao estúdio!" />
              <p className="text-[11px] text-muted-foreground">Variáveis: {"{{nome}}"}, {"{{email}}"}</p>
            </div>
            <div className="space-y-1.5">
              <Label>Corpo do e-mail (HTML) <span className="text-destructive">*</span></Label>
              <Textarea
                value={form.body_html}
                onChange={(e) => set("body_html", e.target.value)}
                rows={10}
                className="font-mono text-xs"
                placeholder={"<p>Olá {{nome}},</p>\n<p>Seja bem-vindo!</p>"}
              />
              <p className="text-[11px] text-muted-foreground">
                HTML básico aceito. Variáveis: {"{{nome}}"}, {"{{email}}"}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Salvando..." : template ? "Salvar alterações" : "Criar template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateFormDialog;
