import React from 'react';

interface KPICardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
        label?: string;
    };
    loading?: boolean;
    backgroundColor?: string;
    iconColor?: string;
    minHeight?: string;
}

const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    icon,
    trend,
    loading = false,
    backgroundColor = '#ffffff',
    minHeight = '146px',
    iconColor = 'var(--primary)',
}) => {
    if (loading) {
        return (
            <div 
                className="rounded-2xl p-6 shadow-sm border border-gray-100"
                style={{ backgroundColor }}
            >
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor, minHeight }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {value}
                    </h3>
                </div>
                {icon && (
                    <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${iconColor}15` }}
                    >
                        <div style={{ color: iconColor }}>
                            {icon}
                        </div>
                    </div>
                )}
            </div>

            {trend && (
                <div className="flex items-center gap-2">
                    <span
                        className={`text-sm font-semibold ${
                            trend.isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </span>
                    {trend.label && (
                        <span className="text-xs text-gray-500">{trend.label}</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default KPICard;