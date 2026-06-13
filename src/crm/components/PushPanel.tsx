import { useState, useEffect, useMemo, useCallback } from "react";
import { Smartphone, Search, SendHorizonal, Users, Loader2, CheckSquare, Square, History, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "../config";
import { getPushRecipients, sendManualPush, listPushLogs, PushRecipient, PushLog, PushTemplate } from "../api/crm";

interface Props {
  active: boolean;
  pushTemplates: PushTemplate[];
}

const PushPanel = ({ active, pushTemplates }: Props) => {
  const [recipients, setRecipients] = useState<PushRecipient[]>([]);
  const [loading, setLoading]       = useState(false);

  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [title, setTitle]   = useState("");
  const [body, setBody]     = useState("");
  const [url, setUrl]       = useState("");
  const [sending, setSending] = useState(false);

  const [activeTab, setActiveTab] = useState("enviar");

  const [logs, setLogs]         = useState<PushLog[]>([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsOffset, setLogsOffset] = useState(0);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const LOG_PAGE = 20;

  useEffect(() => {
    if (!active) return;
    setLoading(true);
    getPushRecipients()
      .then((res) => setRecipients(res.data))
      .catch(() => toast({ title: "Erro ao carregar destinatários", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [active]);

  const fetchLogs = useCallback(async (offset = 0) => {
    setLoadingLogs(true);
    try {
      const res = await listPushLogs({ limit: LOG_PAGE, offset });
      setLogs(res.data);
      setLogsTotal(res.meta.total);
      setLogsOffset(offset);
    } catch {
      toast({ title: "Erro ao carregar histórico", variant: "destructive" });
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return recipients;
    const q = search.toLowerCase();
    return recipients.filter(
      (r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q),
    );
  }, [recipients, search]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.id));

  const toggleAll = () => {
    if (allFilteredSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((r) => next.delete(r.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((r) => next.add(r.id));
        return next;
      });
    }
  };

  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const handleSend = async () => {
    if (selected.size === 0) {
      toast({ title: "Selecione ao menos um aluno", variant: "destructive" });
      return;
    }
    if (!title.trim()) {
      toast({ title: "Título é obrigatório", variant: "destructive" });
      return;
    }
    if (!body.trim()) {
      toast({ title: "Mensagem é obrigatória", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const res = await sendManualPush({
        personIds: Array.from(selected),
        title:     title.trim(),
        body:      body.trim(),
        url:       url.trim() || null,
      });
      toast({
        title: "Notificações enviadas",
        description: `${res.data.sent} dispositivo(s) notificado(s)${res.data.disabled > 0 ? ` · ${res.data.disabled} token(s) desativado(s)` : ""}`,
      });
      setTitle("");
      setBody("");
      setUrl("");
      setSelected(new Set());
      setActiveTab("historico");
      fetchLogs(0);
    } catch (err: unknown) {
      toast({
        title: err instanceof Error ? err.message : "Erro ao enviar notificações",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  const statusCfg = {
    sent:    { label: "Enviado",  icon: CheckCircle2,   cls: "text-green-500" },
    partial: { label: "Parcial",  icon: AlertTriangle,  cls: "text-yellow-500" },
    failed:  { label: "Falhou",   icon: AlertCircle,    cls: "text-destructive" },
  } as const;

  const fmtDate = (d: string) =>
    new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="text-base font-bold text-foreground">Notificação Push Manual</h3>
            <p className="text-sm text-muted-foreground">
              Envie uma notificação imediata para alunos com o app instalado
            </p>
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); if (v === "historico") fetchLogs(0); }}>
        <TabsList>
          <TabsTrigger value="enviar" className="gap-1.5">
            <SendHorizonal className="h-4 w-4" />
            Enviar
          </TabsTrigger>
          <TabsTrigger value="historico" className="gap-1.5">
            <History className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        {/* ── Aba Enviar ── */}
        <TabsContent value="enviar" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Mensagem */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <SendHorizonal className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold">Mensagem</h4>
                </div>
                <Separator />
                {pushTemplates.length > 0 && (
                  <div className="space-y-1.5">
                    <Label>Usar template</Label>
                    <Select
                      value=""
                      onValueChange={(id) => {
                        const tpl = pushTemplates.find((t) => String(t.id) === id);
                        if (tpl) { setTitle(tpl.title); setBody(tpl.body); setUrl(tpl.url ?? ""); }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar template (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {pushTemplates.map((t) => (
                          <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label>Título <span className="text-destructive">*</span></Label>
                  <Input
                    maxLength={100}
                    placeholder="ex: Promoção especial para você!"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <p className="text-[11px] text-muted-foreground text-right">{title.length}/100</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Mensagem <span className="text-destructive">*</span></Label>
                  <Textarea
                    rows={4}
                    maxLength={250}
                    placeholder="ex: Renove seu plano hoje e ganhe 10% de desconto."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                  <p className="text-[11px] text-muted-foreground text-right">{body.length}/250</p>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Variáveis: <code className="bg-muted px-1 rounded">{"{{nome}}"}</code> <code className="bg-muted px-1 rounded">{"{{email}}"}</code> — substituídas individualmente para cada aluno
                </p>
                <div className="space-y-1.5">
                  <Label>Link ao tocar (opcional)</Label>
                  <Input
                    placeholder="ex: meuapp://tela/renovar"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    maxLength={500}
                  />
                  <p className="text-[11px] text-muted-foreground">Deep link para abrir uma tela do app ao tocar</p>
                </div>
                <Button
                  className="w-full"
                  onClick={handleSend}
                  disabled={sending || selected.size === 0 || !title.trim() || !body.trim()}
                >
                  {sending
                    ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Enviando...</>
                    : <><SendHorizonal className="h-4 w-4 mr-2" />Enviar para {selected.size} aluno{selected.size !== 1 ? "s" : ""}</>
                  }
                </Button>
              </CardContent>
            </Card>

            {/* Destinatários */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-semibold">Destinatários</h4>
                    <Badge variant="secondary" className="text-[10px]">
                      {recipients.length} com app
                    </Badge>
                  </div>
                  {selected.size > 0 && (
                    <span className="text-xs text-primary font-medium">{selected.size} selecionado{selected.size !== 1 ? "s" : ""}</span>
                  )}
                </div>
                <Separator />

                {recipients.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Smartphone className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Nenhum aluno com o app instalado</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center flex-1 border border-input rounded-full h-8 px-3 gap-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                        <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <input
                          className="bg-transparent text-sm flex-1 outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                          placeholder="Buscar aluno..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs shrink-0" onClick={toggleAll}>
                        {allFilteredSelected
                          ? <><CheckSquare className="h-3.5 w-3.5 mr-1" />Desmarcar</>
                          : <><Square className="h-3.5 w-3.5 mr-1" />Todos</>
                        }
                      </Button>
                    </div>

                    <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
                      {filtered.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Nenhum resultado</p>
                      ) : (
                        filtered.map((r) => (
                          <label
                            key={r.id}
                            className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <Checkbox
                              checked={selected.has(r.id)}
                              onCheckedChange={() => toggleOne(r.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{r.email}</p>
                            </div>
                            <Badge variant="outline" className="text-[10px] shrink-0">
                              {r.tokenCount} device{r.tokenCount !== 1 ? "s" : ""}
                            </Badge>
                          </label>
                        ))
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Aba Histórico ── */}
        <TabsContent value="historico" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {loadingLogs ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : logs.length === 0 ? (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  <History className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhum envio registrado ainda</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {logs.map((log) => {
                    const cfg = statusCfg[log.status];
                    const Icon = cfg.icon;
                    return (
                      <div key={log.id} className="flex items-start gap-3 px-4 py-3">
                        <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.cls}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{log.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{log.body}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {log.sent_count}/{log.recipient_count} dispositivo{log.recipient_count !== 1 ? "s" : ""}
                            {log.disabled_count > 0 && ` · ${log.disabled_count} token(s) desativado(s)`}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                          {fmtDate(log.sent_at)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {logsTotal > LOG_PAGE && (
            <div className="flex items-center justify-between text-sm text-muted-foreground mt-3">
              <span>{logsTotal} registros</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={logsOffset === 0 || loadingLogs} onClick={() => fetchLogs(logsOffset - LOG_PAGE)}>Anterior</Button>
                <Button variant="outline" size="sm" disabled={logsOffset + LOG_PAGE >= logsTotal || loadingLogs} onClick={() => fetchLogs(logsOffset + LOG_PAGE)}>Próximo</Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PushPanel;
