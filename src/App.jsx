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
        try {
            const unsubscribe = subscribeToTasks((updatedTasks) => {
                setTasks(updatedTasks);
            });
            return () => unsubscribe();
        } catch (error) {
            console.log("Firestore connection failed, using local mode");
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
        // Optimistic / Local Update first
        if (taskData._delete) {
            setTasks(prev => prev.filter(t => t.id !== taskData.id));
        } else if (taskData.id) {
            setTasks(prev => prev.map(t => t.id === taskData.id ? taskData : t));
        } else {
            const newTask = { ...taskData, id: Date.now() };
            setTasks(prev => [...prev, newTask]);
        }

        // Try Firestore
        try {
            if (taskData._delete) {
                await deleteTask(taskData.id);
                return;
            }

            if (taskData.id) {
                await updateTask(taskData);
            } else {
                await addTask(taskData);
            }
        } catch (error) {
            console.error("Failed to save to Firestore (running locally):", error);
            // Optional: Show a toast here
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
