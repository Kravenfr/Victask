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

    let q = query(
      collection(db, 'tasks'), 
      where('userId', '==', userId),
      orderBy('order', 'asc')
    );

    if (filter === 'starred') {
      q = query(q, where('starred', '==', true));
    } else if (listId) {
      q = query(q, where('listId', '==', listId));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      
      setTasks(tasksData);
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
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TaskList[];
      setLists(listsData);
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
