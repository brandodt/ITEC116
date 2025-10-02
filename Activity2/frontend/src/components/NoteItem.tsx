import React, { useEffect } from 'react';
import type { Note } from '../types';
import { gsap } from 'gsap';

interface NoteItemProps {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (id: string) => void;
    loading: boolean;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onEdit, onDelete, loading }) => {
    useEffect(() => {
        // Animation when note item appears
        gsap.fromTo(
            `[data-note-id="${note._id}"]`,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
    }, [note._id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            onDelete(note._id);
        }
    };

    return (
        <div
            data-note-id={note._id}
            className="card border-l-4 border-primary hover:shadow-lg transition-shadow duration-300"
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-primary truncate flex-1 mr-4">
                    {note.title}
                </h3>
                <div className="flex gap-2 flex-shrink-0">
                    <button
                        onClick={() => onEdit(note)}
                        disabled={loading}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors"
                        title="Edit note"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                        title="Delete note"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-light whitespace-pre-wrap line-clamp-4">
                    {note.content}
                </p>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Created: {formatDate(note.createdAt)}</span>
                {note.updatedAt !== note.createdAt && (
                    <span>Updated: {formatDate(note.updatedAt)}</span>
                )}
            </div>
        </div>
    );
};

export default NoteItem;