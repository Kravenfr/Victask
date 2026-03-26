import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Task, TaskList } from '../types';
import { useEffect, useState } from 'react';

// Realtime Tasks Hook
export function useTasks(userId: string | undefined, listId: string | null, filter: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Use a single simple filter to avoid composite index requirements
    const q = query(
      collection(db, 'tasks'), 
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      
      let filteredTasks = allTasks;

      // Filter by starred if requested
      if (filter === 'starred') {
        filteredTasks = allTasks.filter(t => t.starred);
      } 
      // Filter by list unless "all-tasks" bypass or internal subtask fetch (which handles its own filtering)
      else if (filter !== 'all-tasks') {
        const currentListId = listId || 'inbox';
        filteredTasks = allTasks.filter(t => 
          t.listId === currentListId || (currentListId === 'inbox' && (!t.listId || t.listId === 'inbox'))
        );
      }
      
      // Sort in-memory
      filteredTasks.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      setTasks(filteredTasks);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error in useTasks:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, listId, filter]);

  return { tasks, loading };
}

// Realtime Lists Hook
export function useLists(userId: string | undefined) {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'lists'), 
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TaskList[];
      
      // Sort in-memory
      listsData.sort((a, b) => {
        const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return dateB - dateA; // Descending
      });

      setLists(listsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error in useLists:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { lists, loading };
}

// Task Mutations
export function useTaskMutations() {
  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    return await addDoc(collection(db, 'tasks'), {
      ...task,
      createdAt: serverTimestamp(),
    });
  };

  const updateTask = async ({ id, ...updates }: Partial<Task> & { id: string }) => {
    const taskRef = doc(db, 'tasks', id);
    return await updateDoc(taskRef, updates);
  };

  const deleteTask = async (id: string) => {
    const taskRef = doc(db, 'tasks', id);
    return await deleteDoc(taskRef);
  };

  return { addTask, updateTask, deleteTask };
}

// List Mutations
export function useListMutations() {
  const addList = async (list: Omit<TaskList, 'id' | 'createdAt'>) => {
    return await addDoc(collection(db, 'lists'), {
      ...list,
      createdAt: serverTimestamp(),
    });
  };

  const deleteList = async (id: string) => {
    const listRef = doc(db, 'lists', id);
    return await deleteDoc(listRef);
  };

  return { addList, deleteList };
}
