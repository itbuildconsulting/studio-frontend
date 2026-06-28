import { forwardRef } from "react";
import { formatDuration } from "@/utils/formatDuration";
import {
    ShareCardFrame,
    ShareCardHeader,
    HeroStat,
    StatGrid,
    StatItem,
    PersonalRecordsLine,
    ShareCardFooter,
    cardThemes,
    CardVariant,
} from "./ShareCardKit";
import { IconClock, IconGauge, IconRotate, IconBolt, IconFlame } from "./shareIcons";

type Activity = {
    date?: string;
    startTime?: string;
    endTime?: string;
    distanceKm?: number | string;
    avgSpeedKmh?: number | string;
    maxSpeedKmh?: number | string;
    avgCadenceRpm?: number | string;
    avgPowerW?: number | string;
    caloriesKcal?: number | string;
    movingTimeS?: number | string;
};

type PersonalRecords = {
    speed?: boolean;
    cadence?: boolean;
    power?: boolean;
    distance?: boolean;
} | null;

type ActivityShareCardProps = {
    activity: Activity;
    personalRecords?: PersonalRecords;
    variant?: CardVariant;
};

function formatDateLabel(dateStr?: string) {
    if (!dateStr) return "";
    const d = new Date(`${dateStr}T00:00:00`);
    const label = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
    return label.replace(".", "");
}

const ActivityShareCard = forwardRef<HTMLDivElement, ActivityShareCardProps>(
    ({ activity, personalRecords, variant = "dark" }, ref) => {
        const records: string[] = [];
        if (personalRecords?.distance) records.push("Maior distância");
        if (personalRecords?.speed) records.push("Velocidade máxima");
        if (personalRecords?.power) records.push("Potência máxima");
        if (personalRecords?.cadence) records.push("Cadência máxima");

        const distance = Number(activity.distanceKm) || 0;
        const iconColor = cardThemes[variant].accent;

        return (
            <div ref={ref}>
                <ShareCardFrame variant={variant}>
                    <ShareCardHeader variant={variant} eyebrow="Resumo da Aula" dateLabel={formatDateLabel(activity.date)} />

                    <HeroStat variant={variant} value={distance.toFixed(1)} unit="km" label="Distância percorrida" />

                    <StatGrid>
                        <StatItem
                            variant={variant}
                            icon={<IconClock size={20} color={iconColor} />}
                            value={formatDuration(activity.movingTimeS)}
                            label="Tempo em movimento"
                        />
                        <StatItem
                            variant={variant}
                            icon={<IconFlame size={20} color={iconColor} />}
                            value={`${Math.round(Number(activity.caloriesKcal) || 0)} kcal`}
                            label="Calorias"
                        />
                        <StatItem
                            variant={variant}
                            icon={<IconGauge size={20} color={iconColor} />}
                            value={`${activity.avgSpeedKmh ?? "—"} km/h`}
                            label="Velocidade média"
                        />
                        <StatItem
                            variant={variant}
                            icon={<IconGauge size={20} color={iconColor} />}
                            value={`${activity.maxSpeedKmh ?? "—"} km/h`}
                            label="Velocidade máxima"
                        />
                        <StatItem
                            variant={variant}
                            icon={<IconRotate size={20} color={iconColor} />}
                            value={`${activity.avgCadenceRpm ?? "—"} rpm`}
                            label="Cadência média"
                        />
                        <StatItem
                            variant={variant}
                            icon={<IconBolt size={20} color={iconColor} />}
                            value={`${activity.avgPowerW ?? "—"} W`}
                            label="Potência média"
                        />
                    </StatGrid>

                    <PersonalRecordsLine variant={variant} records={records} />

                    <ShareCardFooter
                        variant={variant}
                        generatedAt={`Aula de ${activity.startTime ?? ""}${activity.endTime ? ` às ${activity.endTime}` : ""}`}
                    />
                </ShareCardFrame>
            </div>
        );
    }
);

ActivityShareCard.displayName = "ActivityShareCard";

export default ActivityShareCard;
