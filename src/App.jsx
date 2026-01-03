import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TaskBoard from './components/TaskBoard';
import TaskForm from './components/TaskForm';
import { subscribeToTasks, addTask, updateTask, deleteTask } from './lib/firestore';

function App() {
    const [tasks, setTasks] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Subscribe to Firestore updates
    useEffect(() => {
        console.log("🔄 Setting up Firestore subscription...");
        try {
            const unsubscribe = subscribeToTasks((updatedTasks) => {
                console.log("📊 Tasks state updated:", updatedTasks.length, "tasks");
                setTasks(updatedTasks);
            });
            console.log("✅ Firestore subscription established");
            return () => {
                console.log("🔌 Unsubscribing from Firestore");
                unsubscribe();
            };
        } catch (error) {
            console.error("❌ Failed to set up Firestore subscription:", error);
        }
    }, []);

    const handleAddTask = () => {
        setEditingTask(null);
        setIsFormOpen(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const handleSaveTask = async (taskData) => {
        console.log("💾 handleSaveTask called with:", taskData);
        try {
            if (taskData._delete) {
                console.log("🗑️ Deleting task:", taskData.id);
                await deleteTask(taskData.id);
                setIsFormOpen(false);
                return;
            }

            if (taskData.id) {
                console.log("✏️ Updating task:", taskData.id);
                await updateTask(taskData);
            } else {
                console.log("➕ Adding new task");
                await addTask(taskData);
            }
            console.log("✅ Task save completed successfully");
            setIsFormOpen(false);
        } catch (error) {
            console.error("❌ Error saving task:", error);
            console.error("Full error object:", error);
            
            // エラーメッセージを日本語で表示
            let errorMessage = "タスクの保存に失敗しました。";
            if (error.code === 'permission-denied') {
                errorMessage += "\n\n原因: Firestoreのセキュリティルールで書き込みが許可されていません。\nFirebaseコンソールでセキュリティルールを確認してください。";
            } else if (error.code === 'unavailable') {
                errorMessage += "\n\n原因: インターネット接続を確認してください。";
            } else if (error.code === 'failed-precondition') {
                errorMessage += "\n\n原因: Firestoreのインデックスが必要です。\nコンソールに表示されたリンクからインデックスを作成してください。";
            } else if (error.message) {
                errorMessage += `\n\nエラー詳細: ${error.message}`;
            } else if (error.code) {
                errorMessage += `\n\nエラーコード: ${error.code}`;
            }
            
            alert(errorMessage);
            // エラー時はフォームを開いたままにする（ユーザーが再試行できるように）
        }
    };

    return (
        <Layout>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">タスク一覧</h2>
                    <p className="text-slate-500 text-sm">チームの進捗状況を一目で確認</p>
                </div>
                <button
                    onClick={handleAddTask}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    タスク追加
                </button>
            </div>

            <TaskBoard
                tasks={tasks}
                onEdit={handleEditTask}
            />

            <TaskForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSaveTask}
                initialData={editingTask}
            />
        </Layout>
    );
}

export default App;
