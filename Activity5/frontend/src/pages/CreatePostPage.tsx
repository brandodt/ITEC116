import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../utils/api';
import gsap from 'gsap';

const CreatePostPage: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Animate form entrance
        gsap.fromTo(
            '.create-form',
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.2)' }
        );
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError('');

            const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

            await postsAPI.create({
                title,
                content,
                tags: tagArray.length > 0 ? tagArray : undefined,
            });

            // Animate success before navigation
            gsap.to('.create-form', {
                scale: 0.95,
                opacity: 0.8,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                onComplete: () => { void navigate('/'); }
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <nav className="bg-secondary border-b border-gray-700 py-4 px-6">
                <div className="container mx-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="text-primary hover:underline"
                    >
                        ← Cancel
                    </button>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8 max-w-4xl">
                <h1 className="page-title text-4xl font-bold mb-8">Create New Post</h1>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-900/30 border-l-4 border-red-600">
                        <p className="text-sm text-light">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="card create-form">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter post title"
                            required
                            disabled={loading}
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
                            disabled={loading}
                            rows={15}
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
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="primary-button w-full"
                        disabled={loading}
                    >
                        {loading ? 'Publishing...' : 'Publish Post'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePostPage;
