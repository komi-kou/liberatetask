import React from 'react';
import TaskCard from './TaskCard';

const columns = [
    { id: 'todo', title: '未着手' },
    { id: 'in-progress', title: '進行中' },
    { id: 'done', title: '完了' },
];

export default function TaskBoard({ tasks, onEdit, onDelete }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((col) => (
                <div key={col.id} className="flex flex-col">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                        {col.title}
                        <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full">
                            {tasks.filter(t => t.status === col.id).length}
                        </span>
                    </h2>
                    <div className="flex-1 bg-slate-50/50 rounded-xl min-h-[200px]">
                        {tasks.filter(t => t.status === col.id).map((task) => (
                            <div key={task.id} onClick={() => onEdit(task)}>
                                <TaskCard task={task} />
                            </div>
                        ))}
                        {tasks.filter(t => t.status === col.id).length === 0 && (
                            <div className="h-full flex items-center justify-center text-slate-300 text-sm italic p-4 border-2 border-dashed border-slate-100 rounded-xl">
                                タスクなし
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
