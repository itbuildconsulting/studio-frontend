import { IconBike } from "./shareIcons";

export type CardVariant = "dark" | "light";

export const cardThemes: Record<CardVariant, {
    background: string;
    logo: string;
    logoShadow: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    accentMuted: string;
    textShadow: string;
    trackBg: string;
}> = {
    dark: {
        background: "transparent",
        logo: "/images/logo_spingo_login.png",
        logoShadow: "drop-shadow(0 2px 10px rgba(0,0,0,0.6))",
        textPrimary: "#ffffff",
        textSecondary: "#dfeee8",
        accent: "#7be3a8",
        accentMuted: "#bff0d6",
        textShadow: "0 2px 18px rgba(0,0,0,0.65), 0 1px 4px rgba(0,0,0,0.85)",
        trackBg: "rgba(255,255,255,0.25)",
    },
    light: {
        background: "#ffffff",
        logo: "/images/spingo.png",
        logoShadow: "none",
        textPrimary: "#10172a",
        textSecondary: "#5d6b82",
        accent: "#16a34a",
        accentMuted: "#f23238",
        textShadow: "none",
        trackBg: "rgba(16,23,42,0.08)",
    },
};

// Estilo 100% inline neste arquivo (nada de classNames do Tailwind para
// layout) - o html-to-image clona o DOM para gerar o PNG, e classes que
// dependem do stylesheet externo (flex/grid via Tailwind) podem nao ser
// reaplicadas de forma confiavel nesse processo. Estilo inline e' sempre
// preservado porque vai no atributo do elemento, nao depende de CSS externo.

export function ShareCardFrame({ variant = "dark", children }: { variant?: CardVariant; children: React.ReactNode }) {
    const theme = cardThemes[variant];
    return (
        <div
            style={{
                width: 1080,
                height: 1920,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                paddingLeft: 64,
                paddingRight: 64,
                paddingBottom: 96,
                background: theme.background,
                fontFamily: "Arial, Helvetica, sans-serif",
                boxSizing: "border-box",
            }}
        >
            {children}
        </div>
    );
}

export function ShareCardHeader({ variant = "dark", eyebrow, dateLabel }: { variant?: CardVariant; eyebrow: string; dateLabel: string }) {
    const theme = cardThemes[variant];
    return (
        <div style={{ display: "block", width: "100%", marginBottom: 40 }}>
            <img
                src={theme.logo}
                width={150}
                height={87}
                style={{ display: "block", objectFit: "contain", filter: theme.logoShadow }}
                alt=""
            />
            <div
                style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: 15,
                    marginTop: 16,
                    color: theme.accentMuted,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    textShadow: theme.textShadow,
                }}
            >
                {eyebrow} · {dateLabel}
            </div>
        </div>
    );
}

export function HeroStat({ variant = "dark", value, unit, label }: { variant?: CardVariant; value: string; unit: string; label: string }) {
    const theme = cardThemes[variant];
    return (
        <div style={{ display: "block", width: "100%", marginBottom: 48 }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "baseline", gap: 12 }}>
                <span style={{ fontWeight: 800, fontSize: 168, lineHeight: 1, color: theme.textPrimary, textShadow: theme.textShadow }}>
                    {value}
                </span>
                <span style={{ fontWeight: 700, fontSize: 46, color: theme.accent, textShadow: theme.textShadow }}>
                    {unit}
                </span>
            </div>
            <div
                style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: 20,
                    marginTop: 12,
                    color: theme.textSecondary,
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    textShadow: theme.textShadow,
                }}
            >
                {label}
            </div>
        </div>
    );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", marginBottom: 40 }}>
            {children}
        </div>
    );
}

export function StatItem({
    variant = "dark",
    icon,
    value,
    label,
    widthPct = 50,
}: {
    variant?: CardVariant;
    icon: React.ReactNode;
    value: string;
    label: string;
    widthPct?: number;
}) {
    const theme = cardThemes[variant];
    return (
        <div style={{ display: "block", width: `${widthPct}%`, boxSizing: "border-box", paddingRight: 16, marginBottom: 32 }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", height: 28, marginBottom: 8 }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, flexShrink: 0, marginRight: 8 }}>
                    {icon}
                </span>
                <span
                    style={{
                        display: "block",
                        fontWeight: 600,
                        fontSize: 15,
                        lineHeight: "20px",
                        color: theme.textSecondary,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        textShadow: theme.textShadow,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {label}
                </span>
            </div>
            <div style={{ display: "block", width: "100%", textAlign: "left", fontWeight: 700, fontSize: 36, lineHeight: 1, color: theme.textPrimary, textShadow: theme.textShadow }}>
                {value}
            </div>
        </div>
    );
}

export function PersonalRecordsLine({ variant = "dark", records }: { variant?: CardVariant; records: string[] }) {
    if (!records.length) return null;
    const theme = cardThemes[variant];
    return (
        <div style={{ display: "block", width: "100%", textAlign: "left", fontWeight: 700, fontSize: 22, marginBottom: 32, color: theme.textPrimary, textShadow: theme.textShadow }}>
            🏆 {records.join(" · ")}
        </div>
    );
}

export function ShareCardFooter({ variant = "dark", generatedAt }: { variant?: CardVariant; generatedAt: string }) {
    const theme = cardThemes[variant];
    return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", marginTop: 48 }}>
            <span style={{ display: "flex", alignItems: "center", marginRight: 8, flexShrink: 0 }}>
                <IconBike size={18} color={theme.textSecondary} />
            </span>
            <span style={{ fontSize: 15, color: theme.textSecondary, textShadow: theme.textShadow }}>
                SpinGo · Studio Raphael Oliveira · {generatedAt}
            </span>
        </div>
    );
}
