// 日期工具函數
import { format, parseISO, isToday, isYesterday, subDays, addDays } from 'date-fns';
import { zhTW } from 'date-fns/locale';

/** 取得今天的日期字串 (YYYY-MM-DD) */
export function getTodayString(): string {
    return format(new Date(), 'yyyy-MM-dd');
}

/** 格式化日期為中文友善格式 */
export function formatDateChinese(dateStr: string): string {
    const date = parseISO(dateStr);
    if (isToday(date)) return '今天';
    if (isYesterday(date)) return '昨天';
    return format(date, 'M/d (EEE)', { locale: zhTW });
}

/** 格式化為短日期 */
export function formatShortDate(dateStr: string): string {
    return format(parseISO(dateStr), 'M/d');
}

/** 取得前 N 天的日期字串陣列 */
export function getLastNDays(n: number, fromDate?: string): string[] {
    const base = fromDate ? parseISO(fromDate) : new Date();
    const days: string[] = [];
    for (let i = n - 1; i >= 0; i--) {
        days.push(format(subDays(base, i), 'yyyy-MM-dd'));
    }
    return days;
}

/** 加一天 */
export function addOneDay(dateStr: string): string {
    return format(addDays(parseISO(dateStr), 1), 'yyyy-MM-dd');
}

/** 減一天 */
export function subOneDay(dateStr: string): string {
    return format(subDays(parseISO(dateStr), 1), 'yyyy-MM-dd');
}

/** 生成唯一 ID */
export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
