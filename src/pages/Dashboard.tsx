import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AddTaskInput from '../components/AddTaskInput';
import TaskDetail from '../components/TaskDetail';
import SettingsModal from '../components/SettingsModal';
import { useUIStore } from '../store/uiStore';
import { useAuth } from '../hooks/useAuth';
import { useTasks, useTaskMutations, useLists } from '../hooks/useTasks';
import TaskItem from '../components/TaskItem';
import { ChevronDown, ChevronRight, Star, MoreVertical } from 'lucide-react';
import type { Task } from '../types';

import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { filter, selectedListId, settingsOpen, setSettingsOpen } = useUIStore();
  const { tasks: dbTasks, loading } = useTasks(user?.uid, selectedListId, filter);
  const { updateTask, deleteTask } = useTaskMutations();
  const { lists } = useLists(user?.uid);

  const [tasks, setTasks] = useState(dbTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [completedExpanded, setCompletedExpanded] = useState(false);

  useEffect(() => {
    setTasks(dbTasks);
    if (selectedTask) {
      const updated = dbTasks.find(t => t.id === selectedTask.id);
      if (updated) setSelectedTask(updated);
    }
  }, [dbTasks, selectedTask?.id]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Nesting logic
  const taskTree = useMemo(() => {
    const active = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);

    const buildTree = (taskList: Task[]) => {
      const roots = taskList.filter(t => !t.parentId || !taskList.find(p => p.id === t.parentId));
      const tree: { parent: Task; children: Task[] }[] = [];
      
      roots.forEach(root => {
        const children = taskList.filter(t => t.parentId === root.id);
        tree.push({ parent: root, children });
      });
      
      return tree;
    };

    return {
      active: buildTree(active),
      completed: completed
    };
  }, [tasks]);

  const getTitle = () => {
    if (filter === 'starred') return 'Starred';
    if (selectedListId) {
      const list = lists.find(l => l.id === selectedListId);
      return list ? list.title : 'My Tasks';
    }
    return 'My Tasks';
  };

  const handleToggle = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) await updateTask({ id, completed: !task.completed });
  };

  const handleStar = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) await updateTask({ id, starred: !task.starred });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newTasks);

      const movedTask = tasks[oldIndex];
      let newOrder = 0;
      if (newIndex === 0) newOrder = newTasks[1].order - 1000;
      else if (newIndex === newTasks.length - 1) newOrder = newTasks[newTasks.length - 2].order + 1000;
      else newOrder = (newTasks[newIndex - 1].order + newTasks[newIndex + 1].order) / 2;

      try {
        await updateTask({ id: movedTask.id, order: newOrder });
      } catch (err) {
        console.error("Failed to update task order", err);
        setTasks(dbTasks);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto w-full pb-48 scrollbar-hide">
          <header className="px-6 md:px-10 py-8 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-20">
            <h1 className="text-3xl font-normal text-foreground flex items-center gap-4 tracking-tight">
              {filter === 'starred' && <Star size={28} className="text-yellow-500 fill-current" />}
              {getTitle()}
            </h1>
            <div className="flex items-center gap-2">
              <button className="p-2.5 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                <MoreVertical size={22} />
              </button>
            </div>
          </header>

          <div className="max-w-3xl mx-auto px-2 md:px-4">
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <div className="flex flex-col">
                {loading && tasks.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 border-b border-border/30 animate-pulse w-full" />
                  ))
                ) : (
                  <SortableContext 
                    items={tasks.filter(t => !t.completed).map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {taskTree.active.map(({ parent, children }) => (
                      <React.Fragment key={parent.id}>
                        <TaskItem 
                          task={parent} 
                          onToggle={handleToggle} 
                          onStar={handleStar}
                          onDelete={deleteTask} 
                          onClick={setSelectedTask}
                        />
                        {children.map(child => (
                          <TaskItem 
                            key={child.id}
                            task={child} 
                            onToggle={handleToggle} 
                            onStar={handleStar}
                            onDelete={deleteTask} 
                            onClick={setSelectedTask}
                            isSubtask
                          />
                        ))}
                      </React.Fragment>
                    ))}
                  </SortableContext>
                )}
              </div>
            </DndContext>

            {!loading && tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-center opacity-30">
                <img src="https://www.gstatic.com/images/branding/product/2x/tasks_96dp.png" alt="" className="h-24 w-24 mb-6 grayscale invert" />
                <h3 className="text-lg font-medium">No tasks yet</h3>
                <p className="text-sm max-w-[200px] mt-1">
                  Your tasks will appear here.
                </p>
              </div>
            )}

            {taskTree.completed.length > 0 && (
              <div className="mt-6 border-t border-border/30 pt-4 mb-20">
                <button 
                  onClick={() => setCompletedExpanded(!completedExpanded)}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-muted/20 rounded-xl transition-colors text-foreground font-medium text-[15px]"
                >
                  {completedExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  Completed ({taskTree.completed.length})
                </button>
                
                {completedExpanded && (
                  <div className="flex flex-col mt-2">
                    {taskTree.completed.map(task => (
                      <TaskItem 
                        key={task.id} 
                        task={task} 
                        onToggle={handleToggle} 
                        onStar={handleStar}
                        onDelete={deleteTask} 
                        onClick={setSelectedTask}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
        <AddTaskInput />
        
        {selectedTask && (
          <TaskDetail 
            task={selectedTask}
            onUpdate={(id, updates) => updateTask({ id, ...updates })}
            onDelete={deleteTask}
            onClose={() => setSelectedTask(null)}
          />
        )}

        {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
      </div>
    </div>
  );
};

export default Dashboard;
