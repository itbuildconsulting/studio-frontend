import { forwardRef } from "react";
import { formatDuration } from "@/utils/formatDuration";
import {
    ShareCardFrame,
    ShareCardHeader,
    HeroStat,
    StatItem,
    ShareCardFooter,
    cardThemes,
    CardVariant,
} from "./ShareCardKit";
import { IconClock, IconFlame, IconRoute } from "./shareIcons";

type WeekSession = {
    date: string;
    distanceKm?: number | string;
};

type WeekSummaryShareCardProps = {
    weekStart: Date;
    weekEnd: Date;
    stats: {
        totalMovingTimeS: number;
        totalKm: number;
        totalCalories: number;
        totalSessions: number;
    };
    sessions: WeekSession[];
    variant?: CardVariant;
};

function formatRangeLabel(start: Date, end: Date) {
    const last = new Date(end);
    last.setDate(last.getDate() - 1);
    const fmt = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
    const year = last.getFullYear();
    return `${fmt(start)} – ${fmt(last)} ${year}`;
}

function formatDayLabel(dateStr: string) {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit" }).replace(".", "");
}

const WeekSummaryShareCard = forwardRef<HTMLDivElement, WeekSummaryShareCardProps>(
    ({ weekStart, weekEnd, stats, sessions, variant = "dark" }, ref) => {
        const maxDistance = Math.max(1, ...sessions.map((s) => Number(s.distanceKm) || 0));
        const orderedSessions = [...sessions].sort((a, b) => (a.date < b.date ? -1 : 1));
        const theme = cardThemes[variant];

        return (
            <div ref={ref}>
                <ShareCardFrame variant={variant}>
                    <ShareCardHeader variant={variant} eyebrow="Resumo da Semana" dateLabel={formatRangeLabel(weekStart, weekEnd)} />

                    <HeroStat variant={variant} value={stats.totalKm.toFixed(1)} unit="km" label="Pedalados nesta semana" />

                    <div style={{ display: "flex", flexDirection: "row", width: "100%", marginBottom: 16 }}>
                        <StatItem
                            variant={variant}
                            widthPct={100 / 3}
                            icon={<IconClock size={20} color={theme.accent} />}
                            value={formatDuration(stats.totalMovingTimeS)}
                            label="Tempo total"
                        />
                        <StatItem
                            variant={variant}
                            widthPct={100 / 3}
                            icon={<IconFlame size={20} color={theme.accent} />}
                            value={`${Math.round(stats.totalCalories)} kcal`}
                            label="Calorias"
                        />
                        <StatItem
                            variant={variant}
                            widthPct={100 / 3}
                            icon={<IconRoute size={20} color={theme.accent} />}
                            value={String(stats.totalSessions)}
                            label="Aulas realizadas"
                        />
                    </div>

                    <div
                        style={{
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            fontWeight: 600,
                            fontSize: 15,
                            marginBottom: 20,
                            color: theme.textSecondary,
                            letterSpacing: "1.5px",
                            textTransform: "uppercase",
                            textShadow: theme.textShadow,
                        }}
                    >
                        Aulas da semana
                    </div>

                    <div style={{ display: "block", width: "100%", marginBottom: 16 }}>
                        {orderedSessions.map((s, i) => {
                            const km = Number(s.distanceKm) || 0;
                            const pct = Math.max(6, Math.round((km / maxDistance) * 100));
                            return (
                                <div key={i} style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 16 }}>
                                    <span style={{ display: "block", flexShrink: 0, fontWeight: 600, fontSize: 17, width: 90, color: theme.textPrimary, textShadow: theme.textShadow }}>
                                        {formatDayLabel(s.date)}
                                    </span>
                                    <div style={{ flex: 1, height: 12, borderRadius: 6, background: theme.trackBg, overflow: "hidden" }}>
                                        <div
                                            style={{ height: "100%", borderRadius: 6, width: `${pct}%`, background: "linear-gradient(90deg, #4ade80, #16a34a)" }}
                                        />
                                    </div>
                                    <span style={{ display: "block", flexShrink: 0, fontWeight: 700, fontSize: 17, width: 90, textAlign: "right", color: theme.textPrimary, textShadow: theme.textShadow }}>
                                        {km.toFixed(1)} km
                                    </span>
                                </div>
                            );
                        })}
                        {!orderedSessions.length && (
                            <div style={{ display: "block", width: "100%", color: theme.textSecondary, fontSize: 17, textShadow: theme.textShadow }}>
                                Nenhuma aula registrada nesta semana
                            </div>
                        )}
                    </div>

                    <ShareCardFooter variant={variant} generatedAt={new Date().toLocaleDateString("pt-BR")} />
                </ShareCardFrame>
            </div>
        );
    }
);

WeekSummaryShareCard.displayName = "WeekSummaryShareCard";

export default WeekSummaryShareCard;
