// Dashboard 總覽頁面
import { Flame, Target, TrendingDown, Calendar } from 'lucide-react';
import ProgressRing from '../components/ProgressRing';
import WeightChart from '../components/WeightChart';
import StatCard from '../components/StatCard';
import { getTodayString, getLastNDays } from '../utils/date';
import type { Task, WeightRecord } from '../types/types';

interface DashboardPageProps {
    tasks: Task[];
    weightRecords: WeightRecord[];
    getCompletionRate: (date: string) => number;
    isTaskCompleted: (taskId: string, date: string) => boolean;
    getStreak: () => number;
}

export default function DashboardPage({
    tasks,
    weightRecords,
    getCompletionRate,
    isTaskCompleted,
    getStreak,
}: DashboardPageProps) {
    const today = getTodayString();
    const todayRate = getCompletionRate(today);
    const streak = getStreak();

    // 本週（最近 7 天）平均完成率
    const last7Days = getLastNDays(7);
    const weeklyAvg = last7Days.length > 0
        ? Math.round(last7Days.reduce((sum, d) => sum + getCompletionRate(d), 0) / last7Days.length)
        : 0;

    // 體重變化統計
    const sortedWeights = [...weightRecords].sort((a, b) => a.date.localeCompare(b.date));
    const latestWeight = sortedWeights.length > 0 ? sortedWeights[sortedWeights.length - 1].weight : null;
    const firstWeight = sortedWeights.length > 0 ? sortedWeights[0].weight : null;
    const totalChange = latestWeight !== null && firstWeight !== null
        ? +(latestWeight - firstWeight).toFixed(1)
        : null;

    // 本週每日完成狀態（用於顯示小方格）
    const weekGrid = last7Days.map(date => ({
        date,
        rate: getCompletionRate(date),
        day: new Date(date).toLocaleDateString('zh-TW', { weekday: 'short' }),
    }));

    return (
        <div className="page">
            {/* 頁面標題 */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">你的進度一目瞭然</p>
                </div>
            </div>

            {/* 今日完成率環形圖 */}
            <div className="dashboard-ring-section">
                <ProgressRing percentage={todayRate} size={140} strokeWidth={10} label="今日完成率" />
            </div>

            {/* 統計卡片 */}
            <div className="stat-grid">
                <StatCard
                    icon={<Flame size={20} />}
                    label="連續打卡"
                    value={`${streak} 天`}
                    color="#f59e0b"
                />
                <StatCard
                    icon={<Target size={20} />}
                    label="本週平均"
                    value={`${weeklyAvg}%`}
                    color="#60a5fa"
                />
                <StatCard
                    icon={<TrendingDown size={20} />}
                    label="累計變化"
                    value={totalChange !== null ? `${totalChange > 0 ? '+' : ''}${totalChange} kg` : '—'}
                    color="#22c55e"
                />
                <StatCard
                    icon={<Calendar size={20} />}
                    label="總紀錄天數"
                    value={`${weightRecords.length} 天`}
                    color="#a78bfa"
                />
            </div>

            {/* 本週打卡格 */}
            <div className="week-grid-section">
                <h3 className="section-title">本週打卡</h3>
                <div className="week-grid">
                    {weekGrid.map(item => (
                        <div key={item.date} className="week-grid-item">
                            <div
                                className={`week-grid-cell ${item.rate >= 70 ? 'high' : item.rate > 0 ? 'partial' : 'empty'
                                    }`}
                            />
                            <span className="week-grid-day">{item.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 體重趨勢圖 */}
            <div className="chart-section">
                <h3 className="section-title">體重趨勢</h3>
                <div className="chart-legend">
                    <span className="legend-item">
                        <span className="legend-dot blue" /> 實際體重
                    </span>
                    <span className="legend-item">
                        <span className="legend-dot green" /> 移動平均
                    </span>
                </div>
                <WeightChart data={sortedWeights} />
            </div>

            {/* 每日任務明細 */}
            {tasks.length > 0 && (
                <div className="daily-detail-section">
                    <h3 className="section-title">今日任務</h3>
                    <div className="daily-detail-list">
                        {tasks.map(task => {
                            const done = isTaskCompleted(task.id, today);
                            return (
                                <div key={task.id} className={`daily-detail-item ${done ? 'done' : ''}`}>
                                    <div className={`daily-detail-dot ${done ? 'filled' : ''}`} />
                                    <span>{task.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
