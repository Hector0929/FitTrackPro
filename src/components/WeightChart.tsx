// 體重折線圖元件
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import type { WeightRecord } from '../types/types';
import { formatShortDate } from '../utils/date';

interface WeightChartProps {
    data: WeightRecord[];
}

export default function WeightChart({ data }: WeightChartProps) {
    if (data.length === 0) {
        return (
            <div className="chart-empty">
                <p>尚無體重紀錄</p>
                <p className="text-sm opacity-60">開始記錄你的體重變化吧！</p>
            </div>
        );
    }

    const chartData = data.map(d => ({
        date: formatShortDate(d.date),
        weight: d.weight,
        fullDate: d.date,
    }));

    // 計算趨勢線（簡單移動平均）
    const trendData = chartData.map((item, index) => {
        const windowSize = Math.min(7, index + 1);
        const slice = chartData.slice(Math.max(0, index - windowSize + 1), index + 1);
        const avg = slice.reduce((sum, s) => sum + s.weight, 0) / slice.length;
        return { ...item, trend: +avg.toFixed(1) };
    });

    // 計算 Y 軸範圍
    const weights = data.map(d => d.weight);
    const minWeight = Math.floor(Math.min(...weights) - 1);
    const maxWeight = Math.ceil(Math.max(...weights) + 1);
    const avgWeight = +(weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1);

    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                        dataKey="date"
                        stroke="rgba(255,255,255,0.3)"
                        fontSize={11}
                        tickLine={false}
                    />
                    <YAxis
                        domain={[minWeight, maxWeight]}
                        stroke="rgba(255,255,255,0.3)"
                        fontSize={11}
                        tickLine={false}
                        unit="kg"
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'rgba(30,30,40,0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '13px',
                        }}
                        formatter={(value: number, name: string) => [
                            `${value} kg`,
                            name === 'weight' ? '體重' : '趨勢',
                        ]}
                    />
                    <ReferenceLine
                        y={avgWeight}
                        stroke="rgba(255,255,255,0.15)"
                        strokeDasharray="5 5"
                        label={{
                            value: `平均 ${avgWeight}`,
                            position: 'right',
                            fill: 'rgba(255,255,255,0.3)',
                            fontSize: 10,
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#60a5fa"
                        strokeWidth={2}
                        dot={{ fill: '#60a5fa', stroke: '#1e1e2e', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#93c5fd' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="trend"
                        stroke="#22c55e"
                        strokeWidth={2}
                        strokeDasharray="6 3"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
