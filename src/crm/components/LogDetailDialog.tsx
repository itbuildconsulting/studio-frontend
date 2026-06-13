import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EmailLog, logStatusConfig, formatDateTimeBR } from "../data/crm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: EmailLog | null;
}

const LogDetailDialog = ({ open, onOpenChange, log }: Props) => {
  if (!log) return null;

  const statusCfg = logStatusConfig[log.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Detalhes do E-mail</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Destinatário</p>
              <p className="text-sm font-medium truncate">{log.to_email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge variant={statusCfg.variant} className="text-[10px] mt-0.5">
                {statusCfg.label}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Criado em</p>
              <p className="text-sm">{formatDateTimeBR(log.createdAt)}</p>
            </div>
            {log.sent_at && (
              <div>
                <p className="text-xs text-muted-foreground">Enviado em</p>
                <p className="text-sm">{formatDateTimeBR(log.sent_at)}</p>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <p className="text-xs text-muted-foreground mb-1">Assunto</p>
            <p className="text-sm font-semibold">{log.subject}</p>
          </div>

          {(log.rule || log.template) && (
            <div className="grid grid-cols-2 gap-3">
              {log.rule && (
                <div>
                  <p className="text-xs text-muted-foreground">Regra</p>
                  <p className="text-sm">{log.rule.name}</p>
                </div>
              )}
              {log.template && (
                <div>
                  <p className="text-xs text-muted-foreground">Template</p>
                  <p className="text-sm">{log.template.name}</p>
                </div>
              )}
            </div>
          )}

          {log.error_message && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Erro</p>
                <div className="rounded bg-destructive/10 border border-destructive/20 p-2">
                  <p className="text-xs text-destructive font-mono">{log.error_message}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogDetailDialog;
