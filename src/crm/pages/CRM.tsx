import { useState, useEffect, useCallback } from "react";
import type { ComponentType, ElementType, ReactNode } from "react";
import {
  Mail, Zap, Play, Clock, Send, CheckCheck, Search, Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import TemplatesPanel from "../components/TemplatesPanel";
import RegrasPanel from "../components/RegrasPanelView";
import LogDetailDialog from "../components/LogDetailDialog";
import PushPanel from "../components/PushPanel";
import { toast } from "../config";
import {
  listTemplates, listRules, listLogs, getLogStats, runEngine, listPushTemplates,
} from "../api/crm";
import type { PushTemplate } from "../api/crm";
import {
  EmailTemplate, AutomationRule, EmailLog, LogStats,
  logStatusConfig, formatDateTimeBR,
} from "../data/crm";

const PAGE_SIZE = 50;

interface StatCardProps {
  label: string;
  value: string;
  icon: ElementType;
  gradient: string;
}

const DefaultStatCard = ({ label, value, icon: Icon, gradient }: StatCardProps) => (
  <Card>
    <CardContent className="p-4 flex items-center gap-3">
      <div className={`p-2 rounded-lg ${gradient}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const DefaultLayout = ({ children }: { children: ReactNode }) => <>{children}</>;

interface CRMPageProps {
  Layout?: ComponentType<{ children: ReactNode }>;
  StatCard?: ComponentType<StatCardProps>;
}

const CRM = ({ Layout = DefaultLayout, StatCard: StatCardComp = DefaultStatCard }: CRMPageProps) => {
  const [activeTab, setActiveTab] = useState("templates");

  const [stats, setStats]               = useState<LogStats | null>(null);
  const [templates, setTemplates]       = useState<EmailTemplate[]>([]);
  const [pushTemplates, setPushTemplates] = useState<PushTemplate[]>([]);
  const [rules, setRules]               = useState<AutomationRule[]>([]);
  const [logs, setLogs]                 = useState<EmailLog[]>([]);
  const [logsTotal, setLogsTotal]       = useState(0);
  const [logOffset, setLogOffset]       = useState(0);

  const [loadingStats, setLoadingStats]               = useState(true);
  const [loadingTemplates, setLoadingTemplates]       = useState(true);
  const [loadingPushTemplates, setLoadingPushTemplates] = useState(true);
  const [loadingRules, setLoadingRules]               = useState(true);
  const [loadingLogs, setLoadingLogs]                 = useState(false);
  const [engineRunning, setEngineRunning]             = useState(false);

  const [logStatus, setLogStatus] = useState("all");
  const [logSearch, setLogSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [logDetailOpen, setLogDetailOpen] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await getLogStats(30);
      setStats(res.data);
    } catch {
      /* silent */
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    setLoadingTemplates(true);
    try {
      const res = await listTemplates();
      setTemplates(res.data);
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : "Erro ao carregar templates", variant: "destructive" });
    } finally {
      setLoadingTemplates(false);
    }
  }, []);

  const fetchPushTemplates = useCallback(async () => {
    setLoadingPushTemplates(true);
    try {
      const res = await listPushTemplates();
      setPushTemplates(res.data);
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : "Erro ao carregar templates de push", variant: "destructive" });
    } finally {
      setLoadingPushTemplates(false);
    }
  }, []);

  const fetchRules = useCallback(async () => {
    setLoadingRules(true);
    try {
      const res = await listRules();
      setRules(res.data);
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : "Erro ao carregar regras", variant: "destructive" });
    } finally {
      setLoadingRules(false);
    }
  }, []);

  const fetchLogs = useCallback(async (offset = 0) => {
    setLoadingLogs(true);
    try {
      const res = await listLogs({
        status: logStatus !== "all" ? logStatus : undefined,
        limit:  PAGE_SIZE,
        offset,
      });
      setLogs(res.data);
      setLogsTotal(res.meta.total);
      setLogOffset(offset);
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : "Erro ao carregar logs", variant: "destructive" });
    } finally {
      setLoadingLogs(false);
    }
  }, [logStatus]);

  useEffect(() => {
    fetchStats();
    fetchTemplates();
    fetchPushTemplates();
    fetchRules();
  }, [fetchStats, fetchTemplates, fetchPushTemplates, fetchRules]);

  useEffect(() => {
    if (activeTab === "logs") fetchLogs(0);
  }, [activeTab, fetchLogs]);

  const handleRunEngine = async () => {
    setEngineRunning(true);
    try {
      const res = await runEngine();
      toast({
        title: "Engine executada",
        description: `${res.data.processed} regras avaliadas · ${res.data.queued} e-mails enfileirados`,
      });
      fetchStats();
      if (activeTab === "logs") fetchLogs(0);
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : "Erro ao executar engine", variant: "destructive" });
    } finally {
      setEngineRunning(false);
    }
  };

  const handleViewLog = (log: EmailLog) => {
    setSelectedLog(log);
    setLogDetailOpen(true);
  };

  const filteredLogs = logSearch
    ? logs.filter(
        (l) =>
          l.to_email.toLowerCase().includes(logSearch.toLowerCase()) ||
          l.subject.toLowerCase().includes(logSearch.toLowerCase()),
      )
    : logs;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Título + botão */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-foreground tracking-tight">CRM</h1>
              <Badge variant="secondary" className="text-[10px] font-bold">E-mail & Push</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Automação de e-mails para alunos
            </p>
          </div>
          <Button
            onClick={handleRunEngine}
            disabled={engineRunning}
            className="shadow-md shadow-primary/20"
          >
            <Play className="h-4 w-4 mr-2" />
            {engineRunning ? "Executando..." : "Executar Engine"}
          </Button>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCardComp
            label="Total (30 dias)"
            value={loadingStats ? "–" : String(stats?.total ?? 0)}
            icon={Mail}
            gradient="bg-gradient-to-br from-primary to-primary/70"
          />
          <StatCardComp
            label="Pendentes"
            value={loadingStats ? "–" : String(stats?.pending ?? 0)}
            icon={Clock}
            gradient="bg-gradient-to-br from-accent to-accent/70"
          />
          <StatCardComp
            label="Enviados"
            value={loadingStats ? "–" : String(stats?.sent ?? 0)}
            icon={Send}
            gradient="bg-gradient-to-br from-success to-success/70"
          />
          <StatCardComp
            label="Abertos"
            value={loadingStats ? "–" : String(stats?.opened ?? 0)}
            icon={CheckCheck}
            gradient="bg-gradient-to-br from-info to-info/70"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="templates" className="gap-1.5">
              <Mail className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="regras" className="gap-1.5">
              <Zap className="h-4 w-4" />
              Regras
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-1.5">
              <Send className="h-4 w-4" />
              Logs de Envio
            </TabsTrigger>
            <TabsTrigger value="push" className="gap-1.5">
              <Smartphone className="h-4 w-4" />
              Push Manual
            </TabsTrigger>
          </TabsList>

          {/* Templates */}
          <TabsContent value="templates" className="mt-4">
            <TemplatesPanel
              templates={templates}
              loading={loadingTemplates}
              onRefresh={fetchTemplates}
              pushTemplates={pushTemplates}
              loadingPushTemplates={loadingPushTemplates}
              onRefreshPush={fetchPushTemplates}
            />
          </TabsContent>

          {/* Regras */}
          <TabsContent value="regras" className="mt-4">
            <RegrasPanel
              rules={rules}
              templates={templates}
              loading={loadingRules}
              onRefresh={fetchRules}
            />
          </TabsContent>

          {/* Push Manual */}
          <TabsContent value="push" className="mt-4">
            <PushPanel active={activeTab === "push"} pushTemplates={pushTemplates} />
          </TabsContent>

          {/* Logs */}
          <TabsContent value="logs" className="mt-4 space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center flex-1 border border-input rounded-full px-3 h-10 gap-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                      className="bg-transparent text-sm flex-1 outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                      placeholder="Buscar por e-mail ou assunto..."
                      value={logSearch}
                      onChange={(e) => setLogSearch(e.target.value)}
                    />
                  </div>
                  <Select
                    value={logStatus}
                    onValueChange={(v) => { setLogStatus(v); setLogOffset(0); }}
                  >
                    <SelectTrigger className="w-full sm:w-[160px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {(Object.entries(logStatusConfig) as [string, { label: string }][]).map(([key, cfg]) => (
                        <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Destinatário</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Regra</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingLogs ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          Carregando...
                        </TableCell>
                      </TableRow>
                    ) : filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          Nenhum log encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log) => {
                        const statusCfg = logStatusConfig[log.status];
                        return (
                          <TableRow
                            key={log.id}
                            className="cursor-pointer"
                            onClick={() => handleViewLog(log)}
                          >
                            <TableCell className="text-sm font-medium truncate max-w-[180px]">
                              {log.to_email}
                            </TableCell>
                            <TableCell className="text-sm text-foreground truncate max-w-[220px]">
                              {log.subject}
                            </TableCell>
                            <TableCell>
                              {log.rule ? (
                                <span className="text-xs text-muted-foreground">{log.rule.name}</span>
                              ) : (
                                <span className="text-xs text-muted-foreground/40">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={statusCfg.variant} className="text-[10px]">
                                {statusCfg.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatDateTimeBR(log.createdAt)}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination */}
            {logsTotal > PAGE_SIZE && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{logsTotal} registros no total</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline" size="sm"
                    disabled={logOffset === 0 || loadingLogs}
                    onClick={() => fetchLogs(logOffset - PAGE_SIZE)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    disabled={logOffset + PAGE_SIZE >= logsTotal || loadingLogs}
                    onClick={() => fetchLogs(logOffset + PAGE_SIZE)}
                  >
                    Próximo
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <LogDetailDialog
        open={logDetailOpen}
        onOpenChange={setLogDetailOpen}
        log={selectedLog}
      />
    </Layout>
  );
};

export default CRM;
