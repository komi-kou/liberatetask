// API設定
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// 共通のfetch関数（認証ヘッダーなどが必要な場合）
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            // 認証トークンが必要な場合
            // 'Authorization': `Bearer ${getAuthToken()}`,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};

// タスク一覧を取得（ポーリング方式）
let pollingInterval = null;
let currentCallback = null;

export const subscribeToTasks = (callback) => {
    currentCallback = callback;
    
    // 初回取得
    fetchTasks();
    
    // 定期的にポーリング（例：5秒ごと）
    pollingInterval = setInterval(() => {
        fetchTasks();
    }, 5000);
    
    // クリーンアップ関数を返す
    return () => {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
        }
        currentCallback = null;
    };
};

// タスク一覧を取得
const fetchTasks = async () => {
    try {
        const tasks = await apiRequest('/tasks');
        // APIのレスポンス形式に応じて調整
        // 例: tasks.data や tasks.tasks など
        const formattedTasks = Array.isArray(tasks) ? tasks : tasks.data || tasks.tasks || [];
        if (currentCallback) {
            currentCallback(formattedTasks);
        }
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        // エラー時もコールバックを呼び出して空配列を返す
        if (currentCallback) {
            currentCallback([]);
        }
    }
};

// 新しいタスクを追加
export const addTask = async (task) => {
    try {
        const { id, ...taskData } = task; // 一時IDを削除
        const response = await apiRequest('/tasks', {
            method: 'POST',
            body: JSON.stringify({
                ...taskData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }),
        });
        return response;
    } catch (error) {
        console.error('Error adding task:', error);
        throw error;
    }
};

// タスクを更新
export const updateTask = async (task) => {
    try {
        const { id, ...taskData } = task;
        const response = await apiRequest(`/tasks/${id}`, {
            method: 'PUT', // または PATCH
            body: JSON.stringify({
                ...taskData,
                updatedAt: new Date().toISOString(),
            }),
        });
        return response;
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
};

// タスクを削除
export const deleteTask = async (taskId) => {
    try {
        await apiRequest(`/tasks/${taskId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};

