// 底部導航列元件
import { ClipboardCheck, Scale, LayoutDashboard } from 'lucide-react';
import type { TabType } from '../types/types';

interface TabBarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const tabs: { key: TabType; label: string; icon: typeof ClipboardCheck }[] = [
    { key: 'tasks', label: '任務', icon: ClipboardCheck },
    { key: 'weight', label: '體重', icon: Scale },
    { key: 'dashboard', label: '總覽', icon: LayoutDashboard },
];

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
    return (
        <nav className="tab-bar">
            {tabs.map(({ key, label, icon: Icon }) => (
                <button
                    key={key}
                    onClick={() => onTabChange(key)}
                    className={`tab-item ${activeTab === key ? 'active' : ''}`}
                >
                    <Icon size={20} strokeWidth={activeTab === key ? 2.5 : 1.5} />
                    <span>{label}</span>
                </button>
            ))}
        </nav>
    );
}
