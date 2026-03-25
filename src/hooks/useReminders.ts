import { useEffect } from 'react';
import type { Task } from '../types';
import { sendNotification } from '../lib/notifications';

export function useReminders(tasks: Task[]) {
  useEffect(() => {
    // Check for tasks due today that are not completed
    const checkReminders = () => {
      const today = new Date().toISOString().split('T')[0];
      const dueToday = tasks.filter(t => t.dueDate === today && !t.completed);
      
      if (dueToday.length > 0) {
        // Only notify once per session or use a more robust way to track shown notifications
        const lastNotified = localStorage.getItem('last_notified_date');
        if (lastNotified !== today) {
          sendNotification('Victask: Tasks Due Today', {
            body: `You have ${dueToday.length} tasks due today.`,
          });
          localStorage.setItem('last_notified_date', today);
        }
      }
    };

    // Run check once on mount/tasks change
    if (tasks.length > 0) {
      checkReminders();
    }
    
    // Optional: set interval to check (e.g., every hour)
    const interval = setInterval(checkReminders, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [tasks]);
}
