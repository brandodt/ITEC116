import React from 'react';
import type { Note } from '../types';
import NoteItem from './NoteItem';

interface NoteListProps {
    notes: Note[];
    onEdit: (note: Note) => void;
    onDelete: (id: string) => void;
    loading: boolean;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onEdit, onDelete, loading }) => {
    if (notes.length === 0) {
        return (
            <div className="card text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
                <p className="text-light">
                    Create your first note to get started organizing your thoughts!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {notes.map((note) => (
                <NoteItem
                    key={note._id}
                    note={note}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    loading={loading}
                />
            ))}
        </div>
    );
};

export default NoteList;