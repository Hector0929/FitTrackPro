// 任務項目元件 - 含 Checkbox 動畫
import { useState } from 'react';
import { Check, Pencil, Trash2 } from 'lucide-react';

interface TaskItemProps {
    id: string;
    name: string;
    completed: boolean;
    onToggle: () => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function TaskItem({
    id,
    name,
    completed,
    onToggle,
    onEdit,
    onDelete,
}: TaskItemProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleToggle = () => {
        setIsAnimating(true);
        onToggle();
        setTimeout(() => setIsAnimating(false), 400);
    };

    return (
        <div className={`task-item ${completed ? 'completed' : ''} ${isAnimating ? 'animating' : ''}`}>
            <button
                onClick={handleToggle}
                className={`task-checkbox ${completed ? 'checked' : ''}`}
                aria-label={completed ? '取消完成' : '完成任務'}
            >
                {completed && <Check size={14} strokeWidth={3} />}
            </button>
            <span className={`task-name ${completed ? 'line-through opacity-50' : ''}`}>
                {name}
            </span>
            <div className="task-actions">
                <button
                    onClick={() => onEdit(id)}
                    className="task-action-btn"
                    aria-label="編輯任務"
                >
                    <Pencil size={14} />
                </button>
                <button
                    onClick={() => onDelete(id)}
                    className="task-action-btn delete"
                    aria-label="刪除任務"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}
