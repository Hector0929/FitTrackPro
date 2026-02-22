// SVG 環形進度圖
interface ProgressRingProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
}

export default function ProgressRing({
    percentage,
    size = 120,
    strokeWidth = 8,
    label,
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    // 根據百分比決定顏色
    const getColor = () => {
        if (percentage >= 80) return '#22c55e'; // 綠色
        if (percentage >= 50) return '#f59e0b'; // 橙色
        return '#ef4444'; // 紅色
    };

    return (
        <div className="progress-ring-container">
            <svg width={size} height={size} className="progress-ring-svg">
                {/* 背景圓 */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={strokeWidth}
                />
                {/* 進度圓 */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="progress-ring-circle"
                    style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%',
                        transition: 'stroke-dashoffset 0.6s ease-out, stroke 0.3s ease',
                    }}
                />
            </svg>
            <div className="progress-ring-text">
                <span className="progress-ring-value">{percentage}%</span>
                {label && <span className="progress-ring-label">{label}</span>}
            </div>
        </div>
    );
}
