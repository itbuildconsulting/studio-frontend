import { useState } from "react";
import { Plus, Pencil, Trash2, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "../config";
import { deleteTemplate, testTemplate } from "../api/crm";
import { EmailTemplate, categoryConfig } from "../data/crm";
import TemplateFormDialog from "./TemplateFormDialog";

interface Props {
  templates: EmailTemplate[];
  loading: boolean;
  onRefresh: () => void;
}

const TemplatesPanel = ({ templates, loading, onRefresh }: Props) => {
  const [formOpen, setFormOpen]           = useState(false);
  const [editing, setEditing]             = useState<EmailTemplate | null>(null);
  const [deleting, setDeleting]           = useState<EmailTemplate | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [testing, setTesting]             = useState<EmailTemplate | null>(null);
  const [testEmail, setTestEmail]         = useState("");
  const [testSending, setTestSending]     = useState(false);

  const handleEdit = (t: EmailTemplate) => { setEditing(t); setFormOpen(true); };
  const handleNew  = () => { setEditing(null); setFormOpen(true); };

  const handleOpenTest = (t: EmailTemplate) => { setTesting(t); setTestEmail(""); };

  const handleTest = async () => {
    if (!testing || !testEmail.trim()) return;
    setTestSending(true);
    try {
      const res = await testTemplate(testing.id, testEmail.trim());
      toast({ title: res.message });
      setTesting(null);
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : "Erro ao enviar teste", variant: "destructive" });
    } finally {
      setTestSending(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await deleteTemplate(deleting.id);
      toast({ title: "Template removido com sucesso" });
      onRefresh();
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : "Erro ao remover template", variant: "destructive" });
    } finally {
      setDeleteLoading(false);
      setDeleting(null);
    }
  };

  const renderList = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}><CardContent className="p-4 h-20 animate-pulse bg-muted/30" /></Card>
          ))}
        </div>
      );
    }

    if (templates.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Mail className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Nenhum template cadastrado</p>
            <p className="text-sm mt-1">Crie o primeiro template para usar nas regras</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {templates.map((t) => {
          const cat = categoryConfig[t.category];
          return (
            <Card key={t.id} className={t.active ? "" : "opacity-60"}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-0.5 shrink-0">{cat.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-bold text-foreground">{t.name}</span>
                      <Badge variant="outline" className="text-[10px]">{cat.label}</Badge>
                      {t.active
                        ? <Badge variant="default"   className="text-[10px]">Ativo</Badge>
                        : <Badge variant="secondary" className="text-[10px]">Inativo</Badge>
                      }
                    </div>
                    {t.description && (
                      <p className="text-xs text-muted-foreground mb-1">{t.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Assunto:</span>{" "}
                      {t.subject}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"
                      title="Enviar e-mail de teste"
                      onClick={() => handleOpenTest(t)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(t)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleting(t)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header bar */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="text-base font-bold text-foreground">Templates de E-mail</h3>
                <p className="text-sm text-muted-foreground">
                  Modelos reutilizados pelas regras de automação
                </p>
              </div>
            </div>
            <Button size="sm" onClick={handleNew}>
              <Plus className="h-4 w-4 mr-1" />
              Novo Template
            </Button>
          </div>
        </Card>

        {renderList()}
      </div>

      {/* Create / Edit */}
      <TemplateFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        template={editing}
        onSaved={onRefresh}
      />

      {/* Test send */}
      <Dialog open={!!testing} onOpenChange={(o) => { if (!o) setTesting(null); }}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Enviar e-mail de teste</DialogTitle>
            <DialogDescription>
              Envia <strong>{testing?.name}</strong> imediatamente com variáveis fictícias.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Destinatário</Label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTest()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTesting(null)} disabled={testSending}>
              Cancelar
            </Button>
            <Button onClick={handleTest} disabled={testSending || !testEmail.trim()}>
              <Send className="h-4 w-4 mr-2" />
              {testSending ? "Enviando..." : "Enviar teste"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => { if (!o) setDeleting(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover template?</AlertDialogTitle>
            <AlertDialogDescription>
              O template <strong>{deleting?.name}</strong> será removido permanentemente.
              Templates em uso por regras ativas não podem ser removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteLoading ? "Removendo..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TemplatesPanel;
