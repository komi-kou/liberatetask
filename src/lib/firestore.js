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
    const q = query(collection(db, COLLECTION_NAME), orderBy("updatedAt", "desc"));

    return onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore Timestamp to Date object if needed, or keep as is
            updatedAt: doc.data().updatedAt?.toDate() || new Date()
        }));
        callback(tasks);
    });
};

// Add a new task
export const addTask = async (task) => {
    try {
        const { id, ...taskData } = task; // Remove temporary ID if present
        await addDoc(collection(db, COLLECTION_NAME), {
            ...taskData,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding task: ", error);
        throw error;
    }
};

// Update an existing task
export const updateTask = async (task) => {
    try {
        const taskRef = doc(db, COLLECTION_NAME, task.id);
        const { id, ...taskData } = task;
        await updateDoc(taskRef, {
            ...taskData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating task: ", error);
        throw error;
    }
};

// Delete a task
export const deleteTask = async (taskId) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, taskId));
    } catch (error) {
        console.error("Error deleting task: ", error);
        throw error;
    }
};
