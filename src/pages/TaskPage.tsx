// 任務打卡頁面
import { useState } from 'react';
import { Plus, Flame } from 'lucide-react';
import DatePicker from '../components/DatePicker';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import { getTodayString } from '../utils/date';
import type { Task } from '../types/types';

interface TaskPageProps {
    tasks: Task[];
    addTask: (name: string) => void;
    editTask: (id: string, name: string) => void;
    deleteTask: (id: string) => void;
    toggleTask: (taskId: string, date: string) => void;
    isTaskCompleted: (taskId: string, date: string) => boolean;
    getCompletionRate: (date: string) => number;
    getStreak: () => number;
}

export default function TaskPage({
    tasks,
    addTask,
    editTask,
    deleteTask,
    toggleTask,
    isTaskCompleted,
    getCompletionRate,
    getStreak,
}: TaskPageProps) {
    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const completionRate = getCompletionRate(selectedDate);
    const completedCount = tasks.filter(t => isTaskCompleted(t.id, selectedDate)).length;
    const streak = getStreak();

    const handleEdit = (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            setEditingTask(task);
            setModalOpen(true);
        }
    };

    const handleModalSubmit = (name: string) => {
        if (editingTask) {
            editTask(editingTask.id, name);
            setEditingTask(null);
        } else {
            addTask(name);
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setEditingTask(null);
    };

    return (
        <div className="page">
            {/* 頁面標題區 */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">每日任務</h1>
                    <p className="page-subtitle">養成好習慣，每天進步一點點</p>
                </div>
                {streak > 0 && (
                    <div className="streak-badge">
                        <Flame size={16} />
                        <span>{streak} 天</span>
                    </div>
                )}
            </div>

            {/* 日期選擇器 */}
            <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />

            {/* 進度條 */}
            <div className="progress-bar-section">
                <div className="progress-bar-header">
                    <span>{completedCount}/{tasks.length} 完成</span>
                    <span>{completionRate}%</span>
                </div>
                <div className="progress-bar-track">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${completionRate}%` }}
                    />
                </div>
            </div>

            {/* 任務列表 */}
            <div className="task-list">
                {tasks.length === 0 ? (
                    <div className="empty-state">
                        <p>還沒有任務</p>
                        <p className="text-sm opacity-60">點擊下方按鈕新增你的第一個任務</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            id={task.id}
                            name={task.name}
                            completed={isTaskCompleted(task.id, selectedDate)}
                            onToggle={() => toggleTask(task.id, selectedDate)}
                            onEdit={handleEdit}
                            onDelete={deleteTask}
                        />
                    ))
                )}
            </div>

            {/* 新增按鈕 */}
            <button
                className="fab"
                onClick={() => {
                    setEditingTask(null);
                    setModalOpen(true);
                }}
                aria-label="新增任務"
            >
                <Plus size={24} />
            </button>

            {/* 彈窗 */}
            <TaskModal
                isOpen={modalOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                initialName={editingTask?.name ?? ''}
                mode={editingTask ? 'edit' : 'add'}
            />
        </div>
    );
}
