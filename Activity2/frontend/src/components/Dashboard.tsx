import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { notesAPI } from '../utils/api';
import type { Note } from '../types';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import { gsap } from 'gsap';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editNote, setEditNote] = useState<Note | null>(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    useEffect(() => {
        // Page animations
        gsap.fromTo(
            '.dashboard-title',
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        );

        gsap.fromTo(
            '.dashboard-subtitle',
            { opacity: 0 },
            { opacity: 1, duration: 1, delay: 0.5, ease: 'power2.out' }
        );
    }, []);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedNotes = await notesAPI.getAll();
            setNotes(fetchedNotes);
        } catch (err: any) {
            setError('Failed to load notes. Please try again.');
            console.error('Error fetching notes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = async (data: { title: string; content: string }) => {
        try {
            setActionLoading(true);
            const newNote = await notesAPI.create(data);
            setNotes([newNote, ...notes]);
        } catch (err: any) {
            setError('Failed to create note. Please try again.');
            console.error('Error creating note:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateNote = async (data: { title: string; content: string }) => {
        if (!editNote) return;

        try {
            setActionLoading(true);
            const updatedNote = await notesAPI.update(editNote._id, data);
            setNotes(notes.map(note =>
                note._id === editNote._id ? updatedNote : note
            ));
            setEditNote(null);
        } catch (err: any) {
            setError('Failed to update note. Please try again.');
            console.error('Error updating note:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteNote = async (id: string) => {
        try {
            setActionLoading(true);
            await notesAPI.delete(id);
            setNotes(notes.filter(note => note._id !== id));
        } catch (err: any) {
            setError('Failed to delete note. Please try again.');
            console.error('Error deleting note:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleEdit = (note: Note) => {
        setEditNote(note);
    };

    const handleCancelEdit = () => {
        setEditNote(null);
    };

    return (
        <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
                    <div>
                        <h1 className="dashboard-title page-title">Personal Notes</h1>
                        <p className="dashboard-subtitle text-light mt-2">
                            Welcome back, {user?.name}! Organize your thoughts and ideas.
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                    >
                        Sign Out
                    </button>
                </header>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-900/30 border-l-4 border-red-600">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-light">{error}</p>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-400 hover:text-red-300"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Note Form Card */}
                    <div className="card">
                        <h2 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "var(--color-primary)" }}>
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            {editNote ? 'Edit Note' : 'Create New Note'}
                        </h2>
                        <NoteForm
                            onSubmit={editNote ? handleUpdateNote : handleCreateNote}
                            editNote={editNote}
                            onCancel={handleCancelEdit}
                            loading={actionLoading}
                        />
                    </div>

                    {/* Notes List Card */}
                    <div className="card lg:col-span-2">
                        <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
                            <span className="flex items-center" style={{ color: "var(--color-primary)" }}>
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                Your Notes ({notes.length})
                            </span>
                            <button
                                onClick={fetchNotes}
                                disabled={loading}
                                className="p-2 hover:bg-gray-700 rounded transition-colors"
                                title="Refresh notes"
                            >
                                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </h2>

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="w-10 h-10 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
                            </div>
                        ) : (
                            <div className="custom-scrollbar max-h-[600px] overflow-y-auto">
                                <NoteList
                                    notes={notes}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteNote}
                                    loading={actionLoading}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <footer className="mt-8 text-center text-sm text-light">
                    <p>© {new Date().getFullYear()} Personal Notes. Keep your thoughts organized.</p>
                </footer>
            </div>
        </div>
    );
};

export default Dashboard;