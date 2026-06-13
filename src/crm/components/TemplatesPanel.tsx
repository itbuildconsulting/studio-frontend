import { useState } from "react";
import { Plus, Pencil, Trash2, Mail, Send, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { deleteTemplate, testTemplate, createPushTemplate, updatePushTemplate, deletePushTemplate } from "../api/crm";
import type { PushTemplate } from "../api/crm";
import { EmailTemplate, categoryConfig } from "../data/crm";
import TemplateFormDialog from "./TemplateFormDialog";

interface Props {
  templates: EmailTemplate[];
  loading: boolean;
  onRefresh: () => void;
  pushTemplates: PushTemplate[];
  loadingPushTemplates: boolean;
  onRefreshPush: () => void;
}

const TemplatesPanel = ({ templates, loading, onRefresh, pushTemplates, loadingPushTemplates, onRefreshPush }: Props) => {
  // Email template state
  const [formOpen, setFormOpen]           = useState(false);
  const [editing, setEditing]             = useState<EmailTemplate | null>(null);
  const [deleting, setDeleting]           = useState<EmailTemplate | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [testing, setTesting]             = useState<EmailTemplate | null>(null);
  const [testEmail, setTestEmail]         = useState("");
  const [testSending, setTestSending]     = useState(false);

  // Push template state
  const [pushFormOpen, setPushFormOpen]         = useState(false);
  const [pushEditing, setPushEditing]           = useState<PushTemplate | null>(null);
  const [pushDeleting, setPushDeleting]         = useState<PushTemplate | null>(null);
  const [pushDeleteLoading, setPushDeleteLoading] = useState(false);
  const [pushSaving, setPushSaving]             = useState(false);
  const [pushName, setPushName]                 = useState("");
  const [pushTitle, setPushTitle]               = useState("");
  const [pushBody, setPushBody]                 = useState("");
  const [pushUrl, setPushUrl]                   = useState("");

  // Email handlers
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

  // Push handlers
  const openPushNew = () => {
    setPushEditing(null);
    setPushName(""); setPushTitle(""); setPushBody(""); setPushUrl("");
    setPushFormOpen(true);
  };

  const openPushEdit = (t: PushTemplate) => {
    setPushEditing(t);
    setPushName(t.name); setPushTitle(t.title); setPushBody(t.body); setPushUrl(t.url ?? "");
    setPushFormOpen(true);
  };

  const handlePushSave = async () => {
    if (!pushName.trim() || !pushTitle.trim() || !pushBody.trim()) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    setPushSaving(true);
    try {
      const url = pushUrl.trim() || null;
      if (pushEditing) {
        await updatePushTemplate(pushEditing.id, { name: pushName, title: pushTitle, body: pushBody, url });
        toast({ title: "Template atualizado com sucesso" });
      } else {
        await createPushTemplate({ name: pushName, title: pushTitle, body: pushBody, url });
        toast({ title: "Template criado com sucesso" });
      }
      onRefreshPush();
      setPushFormOpen(false);
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : "Erro ao salvar template", variant: "destructive" });
    } finally {
      setPushSaving(false);
    }
  };

  const handlePushDelete = async () => {
    if (!pushDeleting) return;
    setPushDeleteLoading(true);
    try {
      await deletePushTemplate(pushDeleting.id);
      toast({ title: "Template removido com sucesso" });
      onRefreshPush();
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : "Erro ao remover template", variant: "destructive" });
    } finally {
      setPushDeleteLoading(false);
      setPushDeleting(null);
    }
  };

  const renderEmailList = () => {
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
          <div className="p-8 text-center text-muted-foreground">
            <Mail className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Nenhum template cadastrado</p>
            <p className="text-sm mt-1">Crie o primeiro template para usar nas regras</p>
          </div>
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

  const renderPushList = () => {
    if (loadingPushTemplates) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}><CardContent className="p-4 h-20 animate-pulse bg-muted/30" /></Card>
          ))}
        </div>
      );
    }

    if (pushTemplates.length === 0) {
      return (
        <Card>
          <div className="p-8 text-center text-muted-foreground">
            <Smartphone className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Nenhum template de push cadastrado</p>
            <p className="text-sm mt-1">Crie templates para reutilizar no envio manual</p>
          </div>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {pushTemplates.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Smartphone className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground mb-0.5">{t.name}</p>
                  <p className="text-xs text-foreground">
                    <span className="font-medium">Título:</span> {t.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{t.body}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openPushEdit(t)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setPushDeleting(t)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        <Tabs defaultValue="email">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="email" className="gap-1.5">
                <Mail className="h-4 w-4" />
                E-mail
                <Badge variant="secondary" className="text-[10px] ml-0.5">{templates.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="push" className="gap-1.5">
                <Smartphone className="h-4 w-4" />
                Push
                <Badge variant="secondary" className="text-[10px] ml-0.5">{pushTemplates.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="mt-0">
              <Button size="sm" onClick={handleNew}>
                <Plus className="h-4 w-4 mr-1" />
                Novo Template
              </Button>
            </TabsContent>
            <TabsContent value="push" className="mt-0">
              <Button size="sm" onClick={openPushNew}>
                <Plus className="h-4 w-4 mr-1" />
                Novo Template
              </Button>
            </TabsContent>
          </div>

          <TabsContent value="email" className="mt-4">
            {renderEmailList()}
          </TabsContent>

          <TabsContent value="push" className="mt-4">
            {renderPushList()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Email: Create / Edit */}
      <TemplateFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        template={editing}
        onSaved={onRefresh}
      />

      {/* Email: Test send */}
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

      {/* Email: Delete confirm */}
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

      {/* Push: Create / Edit */}
      <Dialog open={pushFormOpen} onOpenChange={(o) => { if (!o) setPushFormOpen(false); }}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>{pushEditing ? "Editar template de push" : "Novo template de push"}</DialogTitle>
            <DialogDescription>
              Templates de push são reutilizados no envio manual de notificações.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nome do template <span className="text-destructive">*</span></Label>
              <Input
                placeholder="ex: Renovação de plano"
                value={pushName}
                onChange={(e) => setPushName(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Título da notificação <span className="text-destructive">*</span></Label>
              <Input
                placeholder="ex: Olá, {{nome}}! Não perca sua vaga 🎯"
                value={pushTitle}
                onChange={(e) => setPushTitle(e.target.value)}
                maxLength={100}
              />
              <p className="text-[11px] text-muted-foreground text-right">{pushTitle.length}/100</p>
            </div>
            <div className="space-y-1.5">
              <Label>Mensagem <span className="text-destructive">*</span></Label>
              <Textarea
                rows={3}
                placeholder="ex: Renove seu plano hoje e continue treinando!"
                value={pushBody}
                onChange={(e) => setPushBody(e.target.value)}
                maxLength={250}
              />
              <p className="text-[11px] text-muted-foreground text-right">{pushBody.length}/250</p>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Variáveis disponíveis: <code className="bg-muted px-1 rounded">{"{{nome}}"}</code> <code className="bg-muted px-1 rounded">{"{{email}}"}</code>
            </p>
            <div className="space-y-1.5">
              <Label>Link ao tocar (opcional)</Label>
              <Input
                placeholder="ex: meuapp://tela/renovar"
                value={pushUrl}
                onChange={(e) => setPushUrl(e.target.value)}
                maxLength={500}
              />
              <p className="text-[11px] text-muted-foreground">Deep link para abrir uma tela específica do app</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPushFormOpen(false)} disabled={pushSaving}>
              Cancelar
            </Button>
            <Button
              onClick={handlePushSave}
              disabled={pushSaving || !pushName.trim() || !pushTitle.trim() || !pushBody.trim()}
            >
              {pushSaving ? "Salvando..." : pushEditing ? "Salvar alterações" : "Criar template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Push: Delete confirm */}
      <AlertDialog open={!!pushDeleting} onOpenChange={(o) => { if (!o) setPushDeleting(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover template?</AlertDialogTitle>
            <AlertDialogDescription>
              O template <strong>{pushDeleting?.name}</strong> será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pushDeleteLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePushDelete}
              disabled={pushDeleteLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {pushDeleteLoading ? "Removendo..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TemplatesPanel;
