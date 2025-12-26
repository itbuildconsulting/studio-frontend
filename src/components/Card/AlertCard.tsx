import React from 'react';

interface AlertCardProps {
    type: 'warning' | 'danger' | 'info' | 'success';
    title: string;
    message: string;
    count?: number;
    actionLabel?: string;
    onAction?: () => void;
}

const AlertCard: React.FC<AlertCardProps> = ({
    type,
    title,
    message,
    count,
    actionLabel,
    onAction
}) => {
    const configs = {
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            icon: 'text-yellow-600',
            iconBg: 'bg-yellow-100'
        },
        danger: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: 'text-red-600',
            iconBg: 'bg-red-100'
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: 'text-blue-600',
            iconBg: 'bg-blue-100'
        },
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: 'text-green-600',
            iconBg: 'bg-green-100'
        }
    };

    const config = configs[type];

    const getIcon = () => {
        switch(type) {
            case 'warning':
                return (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                );
            case 'danger':
                return (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                );
            case 'info':
                return (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
        }
    };

    return (
        <div className={`${config.bg} ${config.border} border rounded-xl p-4`}>
            <div className="flex items-start gap-3">
                <div className={`${config.iconBg} ${config.icon} p-2 rounded-lg flex-shrink-0`}>
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold ${config.text}`}>{title}</h4>
                        {count !== undefined && (
                            <span className={`${config.iconBg} ${config.text} text-xs font-bold px-2 py-0.5 rounded-full`}>
                                {count}
                            </span>
                        )}
                    </div>
                    <p className={`text-sm ${config.text} opacity-90`}>{message}</p>
                    {actionLabel && onAction && (
                        <button
                            onClick={onAction}
                            className={`mt-3 text-sm font-medium ${config.text} hover:underline`}
                        >
                            {actionLabel} →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlertCard;