import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';

interface NoteFormProps {
    onSubmit: (data: { title: string; content: string }) => void;
    editNote?: { _id: string; title: string; content: string } | null;
    onCancel?: () => void;
    loading: boolean;
}

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, editNote, onCancel, loading }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (editNote) {
            setTitle(editNote.title);
            setContent(editNote.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [editNote]);

    useEffect(() => {
        // Animation when form appears
        gsap.fromTo(
            '.note-form',
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
        );
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && content.trim()) {
            onSubmit({ title: title.trim(), content: content.trim() });
        }
    };

    return (
        <div className="note-form">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                    <label htmlFor="title">Note Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter note title..."
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your note content here..."
                        rows={6}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="primary-button flex-1"
                            disabled={loading || !title.trim() || !content.trim()}
                        >
                            {loading ? 'Saving...' : editNote ? 'Update Note' : 'Create Note'}
                        </button>

                        {editNote && onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NoteForm;