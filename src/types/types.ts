// 核心資料型別定義

/** 任務定義 */
export interface Task {
    id: string;
    name: string;
    createdAt: string; // ISO 日期字串
    isActive: boolean; // 是否啟用（刪除時設為 false）
}

/** 每日打卡紀錄 - key 為 "taskId-date" */
export interface TaskRecord {
    taskId: string;
    date: string; // YYYY-MM-DD
    completed: boolean;
}

/** 體重紀錄 */
export interface WeightRecord {
    date: string; // YYYY-MM-DD
    weight: number;
}

/** 頁面標籤 */
export type TabType = 'tasks' | 'weight' | 'dashboard';
