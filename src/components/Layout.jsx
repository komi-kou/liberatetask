import React from 'react';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        TeamTasks
                    </h1>
                    <button className="text-sm text-slate-500 hover:text-slate-800">
                        Profile
                    </button>
                </div>
            </header>
            <main className="max-w-3xl mx-auto px-4 py-6">
                {children}
            </main>
        </div>
    );
}
