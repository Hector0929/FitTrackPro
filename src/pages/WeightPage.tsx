// 體重管理頁面
import { useState } from 'react';
import { TrendingDown, TrendingUp, Minus, Trash2 } from 'lucide-react';
import { getTodayString, formatDateChinese } from '../utils/date';
import type { WeightRecord } from '../types/types';

interface WeightPageProps {
    weightRecords: WeightRecord[];
    addWeight: (date: string, weight: number) => void;
    deleteWeight: (date: string) => void;
    getWeightForDate: (date: string) => number | null;
    getWeightChange: (date: string) => number | null;
}

export default function WeightPage({
    weightRecords,
    addWeight,
    deleteWeight,
    getWeightForDate,
    getWeightChange,
}: WeightPageProps) {
    const today = getTodayString();
    const [inputWeight, setInputWeight] = useState('');
    const [inputDate, setInputDate] = useState(today);

    const todayWeight = getWeightForDate(today);
    const todayChange = getWeightChange(today);

    // 最近 14 筆紀錄
    const recentRecords = [...weightRecords]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 14);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const weight = parseFloat(inputWeight);
        if (!isNaN(weight) && weight > 0 && weight < 500) {
            addWeight(inputDate, weight);
            setInputWeight('');
        }
    };

    const renderChange = (change: number | null) => {
        if (change === null) return null;
        if (change < 0) {
            return (
                <span className="weight-change down">
                    <TrendingDown size={14} />
                    {change} kg
                </span>
            );
        }
        if (change > 0) {
            return (
                <span className="weight-change up">
                    <TrendingUp size={14} />
                    +{change} kg
                </span>
            );
        }
        return (
            <span className="weight-change same">
                <Minus size={14} /> 0 kg
            </span>
        );
    };

    return (
        <div className="page">
            {/* 頁面標題 */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">體重紀錄</h1>
                    <p className="page-subtitle">持續追蹤，看見改變</p>
                </div>
            </div>

            {/* 今日體重摘要 */}
            <div className="weight-summary">
                <div className="weight-summary-main">
                    <span className="weight-summary-label">今日體重</span>
                    <span className="weight-summary-value">
                        {todayWeight !== null ? `${todayWeight} kg` : '—'}
                    </span>
                </div>
                {todayChange !== null && (
                    <div className="weight-summary-change">
                        <span className="weight-summary-label">較前次</span>
                        {renderChange(todayChange)}
                    </div>
                )}
            </div>

            {/* 體重輸入表單 */}
            <form className="weight-form" onSubmit={handleSubmit}>
                <div className="weight-form-row">
                    <input
                        type="date"
                        value={inputDate}
                        onChange={e => setInputDate(e.target.value)}
                        max={today}
                        className="weight-date-input"
                    />
                    <div className="weight-input-group">
                        <input
                            type="number"
                            value={inputWeight}
                            onChange={e => setInputWeight(e.target.value)}
                            placeholder="體重"
                            step="0.1"
                            min="20"
                            max="300"
                            className="weight-number-input"
                        />
                        <span className="weight-unit">kg</span>
                    </div>
                    <button
                        type="submit"
                        className="weight-submit-btn"
                        disabled={!inputWeight}
                    >
                        記錄
                    </button>
                </div>
            </form>

            {/* 近期紀錄 */}
            <div className="weight-history">
                <h3 className="section-title">近期紀錄</h3>
                {recentRecords.length === 0 ? (
                    <div className="empty-state">
                        <p>尚無紀錄</p>
                        <p className="text-sm opacity-60">在上方輸入你的體重開始追蹤</p>
                    </div>
                ) : (
                    <div className="weight-list">
                        {recentRecords.map(record => (
                            <div key={record.date} className="weight-record">
                                <span className="weight-record-date">
                                    {formatDateChinese(record.date)}
                                </span>
                                <div className="weight-record-right">
                                    <span className="weight-record-value">{record.weight} kg</span>
                                    {renderChange(getWeightChange(record.date))}
                                    <button
                                        onClick={() => deleteWeight(record.date)}
                                        className="weight-delete-btn"
                                        aria-label="刪除紀錄"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
