import { useState, useEffect, useMemo } from "react";
import { Smartphone, Search, SendHorizonal, Users, Loader2, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "../config";
import { getPushRecipients, sendManualPush, PushRecipient } from "../api/crm";

interface Props {
  active: boolean;
}

const PushPanel = ({ active }: Props) => {
  const [recipients, setRecipients] = useState<PushRecipient[]>([]);
  const [loading, setLoading]       = useState(false);

  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [title, setTitle]   = useState("");
  const [body, setBody]     = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!active) return;
    setLoading(true);
    getPushRecipients()
      .then((res) => setRecipients(res.data))
      .catch(() => toast({ title: "Erro ao carregar destinatários", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [active]);

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
      });
      toast({
        title: "Notificações enviadas",
        description: `${res.data.sent} dispositivo(s) notificado(s)${res.data.disabled > 0 ? ` · ${res.data.disabled} token(s) desativado(s)` : ""}`,
      });
      setTitle("");
      setBody("");
      setSelected(new Set());
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Mensagem */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <SendHorizonal className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Mensagem</h4>
            </div>
            <Separator />
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
                {/* Search + select all */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      className="pl-8 h-8 text-sm"
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

                {/* List */}
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
    </div>
  );
};

export default PushPanel;
