import { db } from "./firebase";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "firebase/firestore";

const COLLECTION_NAME = "tasks";

// Subscribe to tasks in real-time
export const subscribeToTasks = (callback) => {
    const baseCollection = collection(db, COLLECTION_NAME);
    
    let unsubscribeFn = null;
    let isUnsubscribed = false;

    // orderBy付きクエリを試す
    const q = query(baseCollection, orderBy("updatedAt", "desc"));

    unsubscribeFn = onSnapshot(
        q,
        (snapshot) => {
            if (isUnsubscribed) return;
            console.log("📥 Firestore snapshot received:", snapshot.size, "documents");
            const tasks = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convert Firestore Timestamp to Date object if needed, or keep as is
                updatedAt: doc.data().updatedAt?.toDate() || new Date()
            }));
            // updatedAtでソート（クライアント側でフォールバック）
            tasks.sort((a, b) => {
                const aTime = a.updatedAt?.getTime() || 0;
                const bTime = b.updatedAt?.getTime() || 0;
                return bTime - aTime; // 降順
            });
            console.log("📋 Tasks loaded:", tasks.length);
            callback(tasks);
        },
        (error) => {
            if (isUnsubscribed) return;
            
            console.error("❌ Firestore subscription error:", error);
            console.error("Error code:", error.code);
            console.error("Error message:", error.message);
            
            // インデックスエラーの場合、orderByなしで再試行
            if (error.code === 'failed-precondition' || error.code === 'unimplemented') {
                console.log("⚠️ Index error detected, retrying without orderBy...");
                const fallbackQuery = query(baseCollection);
                
                // 古いsubscriptionをクリーンアップ
                if (unsubscribeFn) {
                    unsubscribeFn();
                }
                
                // 新しいsubscriptionを作成
                unsubscribeFn = onSnapshot(
                    fallbackQuery,
                    (snapshot) => {
                        if (isUnsubscribed) return;
                        console.log("📥 Firestore snapshot (fallback) received:", snapshot.size, "documents");
                        const tasks = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                            updatedAt: doc.data().updatedAt?.toDate() || new Date()
                        }));
                        // クライアント側でソート
                        tasks.sort((a, b) => {
                            const aTime = a.updatedAt?.getTime() || 0;
                            const bTime = b.updatedAt?.getTime() || 0;
                            return bTime - aTime;
                        });
                        console.log("📋 Tasks loaded (fallback):", tasks.length);
                        callback(tasks);
                    },
                    (fallbackError) => {
                        if (isUnsubscribed) return;
                        console.error("❌ Fallback query also failed:", fallbackError);
                        callback([]);
                    }
                );
            } else {
                // その他のエラーの場合は空配列を返す
                callback([]);
            }
        }
    );

    // unsubscribe関数を返す
    return () => {
        isUnsubscribed = true;
        if (unsubscribeFn) {
            unsubscribeFn();
        }
    };
};

// Add a new task
export const addTask = async (task) => {
    try {
        const { id, updatedAt, createdAt, ...taskData } = task; // Remove temporary ID and client-side timestamps
        console.log("💾 Adding task to Firestore:", taskData);
        console.log("📝 Full task object received:", task);
        
        // Firestoreに保存するデータを準備
        const firestoreData = {
            ...taskData,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp()
        };
        
        console.log("📤 Sending to Firestore:", firestoreData);
        
        const docRef = await addDoc(collection(db, COLLECTION_NAME), firestoreData);
        console.log("✅ Task added successfully with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("❌ Error adding task:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Full error:", error);
        
        // より詳細なエラー情報を提供
        if (error.code === 'permission-denied') {
            console.error("🔒 Permission denied: Check Firestore security rules");
        } else if (error.code === 'unavailable') {
            console.error("🌐 Service unavailable: Check internet connection");
        } else if (error.code === 'failed-precondition') {
            console.error("⚠️ Failed precondition: Check Firestore indexes");
        }
        
        throw error;
    }
};

// Update an existing task
export const updateTask = async (task) => {
    try {
        const taskRef = doc(db, COLLECTION_NAME, task.id);
        const { id, updatedAt, createdAt, ...taskData } = task; // Remove client-side timestamps
        console.log("💾 Updating task in Firestore:", task.id, taskData);
        await updateDoc(taskRef, {
            ...taskData,
            updatedAt: serverTimestamp()
        });
        console.log("✅ Task updated successfully:", task.id);
    } catch (error) {
        console.error("❌ Error updating task:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        throw error;
    }
};

// Delete a task
export const deleteTask = async (taskId) => {
    try {
        console.log("🗑️ Deleting task from Firestore:", taskId);
        await deleteDoc(doc(db, COLLECTION_NAME, taskId));
        console.log("✅ Task deleted successfully:", taskId);
    } catch (error) {
        console.error("❌ Error deleting task:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        throw error;
    }
};
