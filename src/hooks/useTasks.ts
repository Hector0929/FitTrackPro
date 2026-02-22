// 任務管理 Hook - Firestore 版本
import { useState, useCallback, useEffect } from 'react';
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { Task, TaskRecord } from '../types/types';
import { getTodayString } from '../utils/date';

// Firestore 紀錄包含 doc id
interface FirestoreTaskRecord extends TaskRecord {
    id: string;
}

export function useTasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskRecords, setTaskRecords] = useState<FirestoreTaskRecord[]>([]);

    // 即時監聽任務列表
    useEffect(() => {
        if (!user) return;
        const tasksRef = collection(db, 'users', user.uid, 'tasks');
        const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
            const data = snapshot.docs.map(d => ({
                id: d.id,
                ...d.data(),
            })) as Task[];
            setTasks(data);
        });
        return unsubscribe;
    }, [user]);

    // 即時監聽打卡紀錄
    useEffect(() => {
        if (!user) return;
        const recordsRef = collection(db, 'users', user.uid, 'taskRecords');
        const unsubscribe = onSnapshot(recordsRef, (snapshot) => {
            const data = snapshot.docs.map(d => ({
                id: d.id,
                ...(d.data() as TaskRecord),
            }));
            setTaskRecords(data);
        });
        return unsubscribe;
    }, [user]);

    /** 新增任務 */
    const addTask = useCallback(async (name: string) => {
        if (!user) return;
        const tasksRef = collection(db, 'users', user.uid, 'tasks');
        await addDoc(tasksRef, {
            name: name.trim(),
            createdAt: new Date().toISOString(),
            isActive: true,
        });
    }, [user]);

    /** 編輯任務名稱 */
    const editTask = useCallback(async (id: string, name: string) => {
        if (!user) return;
        const taskRef = doc(db, 'users', user.uid, 'tasks', id);
        await updateDoc(taskRef, { name: name.trim() });
    }, [user]);

    /** 刪除任務（軟刪除） */
    const deleteTask = useCallback(async (id: string) => {
        if (!user) return;
        const taskRef = doc(db, 'users', user.uid, 'tasks', id);
        await updateDoc(taskRef, { isActive: false });
    }, [user]);

    /** 切換打卡狀態 */
    const toggleTask = useCallback(async (taskId: string, date: string) => {
        if (!user) return;
        const recordsRef = collection(db, 'users', user.uid, 'taskRecords');
        const existing = taskRecords.find(
            r => r.taskId === taskId && r.date === date
        );

        if (existing) {
            const recordRef = doc(db, 'users', user.uid, 'taskRecords', existing.id);
            await updateDoc(recordRef, { completed: !existing.completed });
        } else {
            await addDoc(recordsRef, {
                taskId,
                date,
                completed: true,
            });
        }
    }, [user, taskRecords]);

    /** 取得某任務在某日的完成狀態 */
    const isTaskCompleted = useCallback(
        (taskId: string, date: string) => {
            const record = taskRecords.find(
                r => r.taskId === taskId && r.date === date
            );
            return record?.completed ?? false;
        },
        [taskRecords]
    );

    /** 取得某日的完成率 */
    const getCompletionRate = useCallback(
        (date: string) => {
            const activeTasks = tasks.filter(t => t.isActive);
            if (activeTasks.length === 0) return 0;
            const completed = activeTasks.filter(t =>
                isTaskCompleted(t.id, date)
            ).length;
            return Math.round((completed / activeTasks.length) * 100);
        },
        [tasks, isTaskCompleted]
    );

    /** 計算連續打卡天數 */
    const getStreak = useCallback(() => {
        let streak = 0;
        const today = getTodayString();
        let currentDate = today;
        const activeTasks = tasks.filter(t => t.isActive);
        if (activeTasks.length === 0) return 0;

        while (true) {
            const rate = getCompletionRate(currentDate);
            if (rate >= 70) {
                streak++;
                const d = new Date(currentDate);
                d.setDate(d.getDate() - 1);
                currentDate = d.toISOString().split('T')[0];
            } else if (currentDate === today && rate === 0) {
                const d = new Date(currentDate);
                d.setDate(d.getDate() - 1);
                currentDate = d.toISOString().split('T')[0];
            } else {
                break;
            }
        }
        return streak;
    }, [tasks, getCompletionRate]);

    const activeTasks = tasks.filter(t => t.isActive);

    return {
        tasks: activeTasks,
        allTasks: tasks,
        taskRecords,
        addTask,
        editTask,
        deleteTask,
        toggleTask,
        getRecordsForDate: (date: string) => taskRecords.filter(r => r.date === date),
        isTaskCompleted,
        getCompletionRate,
        getStreak,
    };
}
