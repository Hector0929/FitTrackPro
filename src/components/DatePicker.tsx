// 日期選擇器元件
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateChinese, getTodayString } from '../utils/date';

interface DatePickerProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
}

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
    const today = getTodayString();
    const isToday = selectedDate === today;

    const goBack = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - 1);
        onDateChange(d.toISOString().split('T')[0]);
    };

    const goForward = () => {
        if (!isToday) {
            const d = new Date(selectedDate);
            d.setDate(d.getDate() + 1);
            onDateChange(d.toISOString().split('T')[0]);
        }
    };

    const goToToday = () => {
        onDateChange(today);
    };

    return (
        <div className="date-picker">
            <button onClick={goBack} className="date-nav-btn" aria-label="前一天">
                <ChevronLeft size={20} />
            </button>
            <button onClick={goToToday} className="date-display">
                <span className="date-text">{formatDateChinese(selectedDate)}</span>
                {!isToday && <span className="date-full">{selectedDate}</span>}
            </button>
            <button
                onClick={goForward}
                className={`date-nav-btn ${isToday ? 'opacity-30 cursor-not-allowed' : ''}`}
                disabled={isToday}
                aria-label="後一天"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
