export function IconRoute({ size = 22, color = "#fff" }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6}>
            <circle cx="6" cy="19" r="2" />
            <circle cx="18" cy="5" r="2" />
            <path d="M8 19h7a4 4 0 0 0 4-4 4 4 0 0 0-4-4H9a4 4 0 0 1-4-4 4 4 0 0 1 4-4h7" strokeLinecap="round" />
        </svg>
    );
}

export function IconClock({ size = 22, color = "#fff" }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconGauge({ size = 22, color = "#fff" }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6}>
            <path d="M4 14a8 8 0 1 1 16 0" strokeLinecap="round" />
            <path d="M12 14l4-5" strokeLinecap="round" />
            <circle cx="12" cy="14" r="1.2" fill={color} />
        </svg>
    );
}

export function IconBolt({ size = 22, color = "#fff" }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6}>
            <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconRotate({ size = 22, color = "#fff" }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6}>
            <path d="M20 12a8 8 0 1 1-2.34-5.66" strokeLinecap="round" />
            <path d="M20 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconFlame({ size = 22, color = "#fff" }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6}>
            <path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c0-1.5-1-2-1-3 1.5 1 3 3.5 3 6a6 6 0 0 1-12 0c0-4 3-5 3-8 0-1.5 2-2.5 4-3z" strokeLinejoin="round" />
        </svg>
    );
}

export function IconBike({ size = 22, color = "#fff" }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6}>
            <circle cx="5.5" cy="17.5" r="3.5" />
            <circle cx="18.5" cy="17.5" r="3.5" />
            <path d="M5.5 17.5 10 8h4l3 4.5M10 8 8.5 5h-2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 12h4.5l2 5.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function IconCalendar({ size = 22, color = "#fff" }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6}>
            <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
            <path d="M16 3v4M8 3v4M3.5 10h17" strokeLinecap="round" />
        </svg>
    );
}
