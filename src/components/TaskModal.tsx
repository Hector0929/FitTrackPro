// 新增/編輯任務彈窗
import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
    initialName?: string;
    mode: 'add' | 'edit';
}

export default function TaskModal({
    isOpen,
    onClose,
    onSubmit,
    initialName = '',
    mode,
}: TaskModalProps) {
    const [name, setName] = useState(initialName);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setName(initialName);
    }, [initialName, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name.trim());
            setName('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{mode === 'add' ? '新增任務' : '編輯任務'}</h3>
                    <button onClick={onClose} className="modal-close">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="輸入任務名稱..."
                        className="modal-input"
                        maxLength={50}
                    />
                    <button
                        type="submit"
                        className="modal-submit"
                        disabled={!name.trim()}
                    >
                        {mode === 'add' ? '新增' : '儲存'}
                    </button>
                </form>
            </div>
        </div>
    );
}
