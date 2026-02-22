// 主應用入口
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import TabBar from './components/TabBar';
import TaskPage from './pages/TaskPage';
import WeightPage from './pages/WeightPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import { useTasks } from './hooks/useTasks';
import { useWeight } from './hooks/useWeight';
import type { TabType } from './types/types';
import { LogOut } from 'lucide-react';

function AppContent() {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('tasks');

  // 載入中
  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-screen">
          <div className="loading-spinner" />
          <p>載入中...</p>
        </div>
      </div>
    );
  }

  // 未登入
  if (!user) {
    return (
      <div className="app-container">
        <LoginPage />
      </div>
    );
  }

  // 已登入
  return <MainApp user={user} signOut={signOut} activeTab={activeTab} setActiveTab={setActiveTab} />;
}

function MainApp({
  user,
  signOut,
  activeTab,
  setActiveTab,
}: {
  user: { displayName: string | null; photoURL: string | null };
  signOut: () => Promise<void>;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}) {
  const {
    tasks,
    addTask,
    editTask,
    deleteTask,
    toggleTask,
    isTaskCompleted,
    getCompletionRate,
    getStreak,
  } = useTasks();

  const {
    weightRecords,
    addWeight,
    deleteWeight,
    getWeightForDate,
    getWeightChange,
  } = useWeight();

  return (
    <div className="app-container">
      {/* 使用者資訊列 */}
      <div className="user-bar">
        <div className="user-info">
          {user.photoURL && (
            <img src={user.photoURL} alt="" className="user-avatar" />
          )}
          <span className="user-name">{user.displayName ?? '使用者'}</span>
        </div>
        <button onClick={signOut} className="logout-btn" aria-label="登出">
          <LogOut size={16} />
        </button>
      </div>

      <div className="app-content">
        {activeTab === 'tasks' && (
          <TaskPage
            tasks={tasks}
            addTask={addTask}
            editTask={editTask}
            deleteTask={deleteTask}
            toggleTask={toggleTask}
            isTaskCompleted={isTaskCompleted}
            getCompletionRate={getCompletionRate}
            getStreak={getStreak}
          />
        )}
        {activeTab === 'weight' && (
          <WeightPage
            weightRecords={weightRecords}
            addWeight={addWeight}
            deleteWeight={deleteWeight}
            getWeightForDate={getWeightForDate}
            getWeightChange={getWeightChange}
          />
        )}
        {activeTab === 'dashboard' && (
          <DashboardPage
            tasks={tasks}
            weightRecords={weightRecords}
            getCompletionRate={getCompletionRate}
            isTaskCompleted={isTaskCompleted}
            getStreak={getStreak}
          />
        )}
      </div>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
