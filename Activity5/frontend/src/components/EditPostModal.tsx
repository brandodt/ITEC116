import React, { useState, useEffect } from 'react';
import { postsAPI } from '../utils/api';
import { gsap } from 'gsap';
import Button from './Button';
import type { Post } from '../types';

interface EditPostModalProps {
    isOpen: boolean;
    post: Post | null;
    onClose: () => void;
    onSuccess: () => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ isOpen, post, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
            setTags(post.tags?.join(', ') || '');
        }
    }, [post]);

    useEffect(() => {
        if (isOpen) {
            gsap.fromTo(
                '.modal-backdrop',
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );
            gsap.fromTo(
                '.modal-content',
                { opacity: 0, scale: 0.9, y: -20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' }
            );
        }
    }, [isOpen]);

    const handleClose = () => {
        gsap.to('.modal-content', {
            opacity: 0,
            scale: 0.9,
            y: -20,
            duration: 0.2,
            onComplete: onClose
        });
        gsap.to('.modal-backdrop', {
            opacity: 0,
            duration: 0.3
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!post) return;

        try {
            setLoading(true);
            setError('');

            const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

            await postsAPI.update(post._id, {
                title,
                content,
                tags: tagArray.length > 0 ? tagArray : undefined,
            });

            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update post');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !post) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="modal-backdrop absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div className="modal-content relative bg-[#1a1a1a] rounded-lg shadow-2xl w-full max-w-2xl border border-gray-800">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-primary mb-6">Edit Post</h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-600/50">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter post title"
                                required
                                disabled={loading}
                                maxLength={200}
                                className="w-full bg-[#0a0a0a] text-gray-200 px-4 py-3 rounded-lg border border-gray-800 focus:outline-none focus:border-primary transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                                Content
                            </label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your post content here..."
                                required
                                disabled={loading}
                                rows={8}
                                className="w-full bg-[#0a0a0a] text-gray-200 px-4 py-3 rounded-lg border border-gray-800 focus:outline-none focus:border-primary transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                                Tags (comma-separated)
                            </label>
                            <input
                                type="text"
                                id="tags"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="e.g. technology, coding, tutorials"
                                disabled={loading}
                                className="w-full bg-[#0a0a0a] text-gray-200 px-4 py-3 rounded-lg border border-gray-800 focus:outline-none focus:border-primary transition-all"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleClose}
                                disabled={loading}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading ? 'Updating...' : 'Update Post'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPostModal;
