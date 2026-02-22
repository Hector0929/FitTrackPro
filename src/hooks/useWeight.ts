// 體重管理 Hook - Firestore 版本
import { useState, useCallback, useEffect } from 'react';
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { WeightRecord } from '../types/types';

export function useWeight() {
    const { user } = useAuth();
    const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);

    // 即時監聽體重紀錄
    useEffect(() => {
        if (!user) return;
        const recordsRef = collection(db, 'users', user.uid, 'weightRecords');
        const unsubscribe = onSnapshot(recordsRef, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                date: doc.id,
                ...doc.data(),
            })) as WeightRecord[];
            setWeightRecords(data);
        });
        return unsubscribe;
    }, [user]);

    /** 新增或更新體重紀錄（同日覆蓋，用 date 作為 doc ID） */
    const addWeight = useCallback(async (date: string, weight: number) => {
        if (!user) return;
        const recordRef = doc(db, 'users', user.uid, 'weightRecords', date);
        await setDoc(recordRef, { date, weight });
    }, [user]);

    /** 刪除體重紀錄 */
    const deleteWeight = useCallback(async (date: string) => {
        if (!user) return;
        const recordRef = doc(db, 'users', user.uid, 'weightRecords', date);
        await deleteDoc(recordRef);
    }, [user]);

    /** 取得某日的體重 */
    const getWeightForDate = useCallback(
        (date: string) => {
            return weightRecords.find(r => r.date === date)?.weight ?? null;
        },
        [weightRecords]
    );

    /** 取得最近 N 筆紀錄 */
    const getRecentRecords = useCallback(
        (count: number) => {
            const sorted = [...weightRecords].sort((a, b) =>
                b.date.localeCompare(a.date)
            );
            return sorted.slice(0, count);
        },
        [weightRecords]
    );

    /** 計算體重變化（相較前一筆） */
    const getWeightChange = useCallback(
        (date: string) => {
            const sorted = [...weightRecords].sort((a, b) =>
                a.date.localeCompare(b.date)
            );
            const currentIndex = sorted.findIndex(r => r.date === date);
            if (currentIndex <= 0) return null;
            return +(sorted[currentIndex].weight - sorted[currentIndex - 1].weight).toFixed(1);
        },
        [weightRecords]
    );

    /** 排序後的所有紀錄 */
    const sortedRecords = [...weightRecords].sort((a, b) =>
        a.date.localeCompare(b.date)
    );

    return {
        weightRecords: sortedRecords,
        addWeight,
        deleteWeight,
        getWeightForDate,
        getRecentRecords,
        getWeightChange,
    };
}
