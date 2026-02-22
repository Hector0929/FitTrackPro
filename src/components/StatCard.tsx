// 統計卡片元件
import type { ReactNode } from 'react';

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    subValue?: string;
    color?: string;
}

export default function StatCard({ icon, label, value, subValue, color }: StatCardProps) {
    return (
        <div className="stat-card" style={color ? { borderColor: color } : undefined}>
            <div className="stat-card-icon" style={color ? { color } : undefined}>
                {icon}
            </div>
            <div className="stat-card-info">
                <span className="stat-card-label">{label}</span>
                <span className="stat-card-value">{value}</span>
                {subValue && <span className="stat-card-sub">{subValue}</span>}
            </div>
        </div>
    );
}
