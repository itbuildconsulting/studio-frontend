import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
        label?: string;
    };
    loading?: boolean;
    color?: string;
    subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    loading = false,
    color = '#003d58',
    subtitle
}) => {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
                    {trend && <div className="h-3 bg-gray-200 rounded w-2/3"></div>}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                    {subtitle && (
                        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
                {icon && (
                    <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${color}15` }}
                    >
                        <div style={{ color }}>
                            {icon}
                        </div>
                    </div>
                )}
            </div>

            {trend && (
                <div className="flex items-center gap-2 mt-3">
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

export default StatCard;