import React from 'react';

const statusColors = {
    'todo': 'bg-slate-100 text-slate-600 border-slate-200',
    'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'done': 'bg-green-50 text-green-700 border-green-200',
};

const statusLabels = {
    'todo': '未着手',
    'in-progress': '進行中',
    'done': '完了',
};

const priorityColors = {
    'high': 'bg-red-100 text-red-700 border-red-200',
    'medium': 'bg-amber-50 text-amber-700 border-amber-200',
    'low': 'bg-slate-100 text-slate-600 border-slate-200',
};

const priorityLabels = {
    'high': '高',
    'medium': '中',
    'low': '低',
};

export default function TaskCard({ task }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3 active:scale-[0.99] transition-transform touch-manipulation">
            <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${statusColors[task.status]}`}>
                        {statusLabels[task.status]}
                    </span>
                    {task.priority && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${priorityColors[task.priority] || priorityColors.medium}`}>
                            {priorityLabels[task.priority] || '中'}
                        </span>
                    )}
                </div>
                <span className="text-xs text-slate-400">{task.assignee}</span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">{task.title}</h3>
            {task.description && (
                <p className="text-sm text-slate-500 line-clamp-2 mb-2">{task.description}</p>
            )}
            {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-2 pt-2 border-t border-slate-50">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>納期: {task.dueDate}</span>
                </div>
            )}
        </div>
    );
}
