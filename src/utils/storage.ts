// LocalStorage 封裝工具

const STORAGE_KEYS = {
    TASKS: 'fittrack_tasks',
    TASK_RECORDS: 'fittrack_task_records',
    WEIGHT_RECORDS: 'fittrack_weight_records',
} as const;

/** 型別安全的 LocalStorage 存取 */
function getItem<T>(key: string, defaultValue: T): T {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch {
        return defaultValue;
    }
}

function setItem<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('LocalStorage 儲存失敗:', error);
    }
}

export { STORAGE_KEYS, getItem, setItem };
