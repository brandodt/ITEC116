import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsAPI } from '../utils/api';
import { gsap } from 'gsap';

const EditPostPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPost();
    }, [id]);

    useEffect(() => {
        // Animate form entrance
        gsap.fromTo(
            '.edit-form',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        );
    }, [loading]);

    const fetchPost = async () => {
        if (!id) return;
        
        try {
            setLoading(true);
            const post = await postsAPI.getOne(id);
            setTitle(post.title);
            setContent(post.content);
            setTags(post.tags?.join(', ') || '');
        } catch (err: any) {
            setError('Failed to load post');
            console.error('Error fetching post:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!id) return;
        
        try {
            setSaving(true);
            setError('');
            
            const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            
            await postsAPI.update(id, {
                title,
                content,
                tags: tagArray.length > 0 ? tagArray : undefined,
            });
            
            // Animate success
            gsap.to('.edit-form', {
                scale: 0.95,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                onComplete: () => { void navigate('/'); }
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update post');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <nav className="bg-card border-b border-gray-700 py-4 px-6">
                <div className="container mx-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="text-primary hover:underline transition-colors"
                    >
                        ← Back to Posts
                    </button>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8 max-w-4xl">
                <h1 className="page-title text-4xl font-bold mb-8">Edit Post</h1>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-900/30 border-l-4 border-red-600 animate-pulse">
                        <p className="text-sm text-light">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="card edit-form">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter post title"
                            required
                            disabled={saving}
                            maxLength={200}
                            className="transition-all focus:scale-[1.01]"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your post content here..."
                            required
                            disabled={saving}
                            rows={15}
                            className="transition-all focus:scale-[1.01]"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Tags (comma-separated)</label>
                        <input
                            type="text"
                            id="tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="javascript, web development, tutorial"
                            disabled={saving}
                            className="transition-all focus:scale-[1.01]"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="primary-button flex-1 transform hover:scale-[1.02] transition-all"
                            disabled={saving}
                        >
                            {saving ? 'Updating...' : 'Update Post'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-all transform hover:scale-[1.02]"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPostPage;
