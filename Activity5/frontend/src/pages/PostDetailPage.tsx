import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postsAPI, commentsAPI } from '../utils/api';
import type { Post, Comment } from '../types';
import { gsap } from 'gsap';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import CommentItem from '../components/CommentItem';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import EditPostModal from '../components/EditPostModal';
import ConfirmModal from '../components/ConfirmModal';
import { ArrowLeft } from 'react-feather';


const PostDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentContent, setCommentContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (id) {
            fetchPostAndComments();
        }
    }, [id]);

    useEffect(() => {
        if (post) {
            gsap.fromTo(
                '.post-detail',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
            );
        }
    }, [post]);

    useEffect(() => {
        if (comments.length > 0) {
            gsap.fromTo(
                '.comment-item',
                { opacity: 0, x: -20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out'
                }
            );
        }
    }, [comments.length]);

    const fetchPostAndComments = async () => {
        try {
            setLoading(true);
            const [postData, commentsData] = await Promise.all([
                postsAPI.getOne(id!),
                commentsAPI.getByPost(id!),
            ]);
            setPost(postData);
            setComments(commentsData);
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim() || !user) return;

        try {
            await commentsAPI.create(id!, { content: commentContent });
            setCommentContent('');
            fetchPostAndComments();
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleDeletePost = () => {
        setShowDeleteConfirm(false);
        performDelete();
    };

    const performDelete = async () => {
        try {
            await postsAPI.delete(post!._id);

            // Animate before navigation
            gsap.to('.post-detail', {
                opacity: 0,
                y: -30,
                duration: 0.3,
                onComplete: () => { void navigate('/'); }
            });
        } catch (error) {
            console.error('Error deleting post:', error);

            // Show error feedback
            const errorMsg = document.createElement('div');
            errorMsg.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
            errorMsg.textContent = 'Failed to delete post';
            document.body.appendChild(errorMsg);

            gsap.fromTo(errorMsg,
                { opacity: 0, x: 100 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.3,
                    onComplete: () => {
                        setTimeout(() => {
                            gsap.to(errorMsg, {
                                opacity: 0,
                                x: 100,
                                duration: 0.3,
                                onComplete: () => errorMsg.remove()
                            });
                        }, 2000);
                    }
                }
            );
        }
    };

    const handlePostUpdated = () => {
        setIsEditModalOpen(false);
        fetchPostAndComments();
    };

    // Truncate long author names
    const truncateName = (name: string, maxLength: number = 30) => {
        if (!name) return 'Unknown Author';
        return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-[#0a0a0a]">
                <Navbar />
                <div className="container mx-auto px-6 py-12 max-w-4xl">
                    <EmptyState message="Post not found" />
                </div>
            </div>
        );
    }

    // Fix: Check both _id and id fields for user matching
    const isOwner = user && post.userId && (
        user.id === post.userId.id ||
        user.id === post.userId._id ||
        user.id === (post.userId as any)?._id
    );

    // Debug log
    console.log('User:', user?.id, 'Post Owner:', post.userId?.id || post.userId?._id, 'IsOwner:', isOwner);

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar />
            <div className='mx-auto px-6 pt-4 max-w-4xl'>
                <div className='mt-4 p-2 border-primary border-2 nowrap rounded-lg w-28 cursor-pointer hover:bg-primary/10 transition-colors' onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} className='text-primary inline-block mr-5' />
                    <span className="font-bold text-primary">Back</span>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 max-w-4xl">
                {/* Post Content */}
                <article className="post-detail mb-12">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-4xl font-bold text-primary flex-1">{post.title}</h1>

                        {/* Edit/Delete buttons for owner */}
                        {isOwner && (
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                                    title="Edit post"
                                >
                                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                                    title="Delete post"
                                >
                                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-2 min-w-0">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span className="truncate" title={post.userId?.name}>
                                {truncateName(post.userId?.name || 'Unknown Author')}
                            </span>
                        </div>
                        <span className="flex-shrink-0">•</span>
                        <span className="flex-shrink-0">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-8">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm border border-primary/20"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-lg">
                        {post.content}
                    </div>
                </article>

                {/* Comments Section */}
                <div className="border-t border-gray-800 pt-8">
                    <h2 className="text-2xl font-bold text-gray-200 mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        Comments ({comments.length})
                    </h2>

                    {user && (
                        <form onSubmit={handleCommentSubmit} className="mb-8">
                            <textarea
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="w-full bg-[#151515] text-gray-200 px-4 py-3 rounded-lg border border-gray-800 focus:outline-none focus:border-primary resize-none transition-all"
                                rows={4}
                                required
                            />
                            <div className="mt-3">
                                <Button type="submit">
                                    Post Comment
                                </Button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <EmptyState message="No comments yet. Be the first to comment!" />
                        ) : (
                            comments.map((comment) => (
                                <CommentItem key={comment._id} comment={comment} />
                            ))
                        )
                        }
                    </div>
                </div>
            </div>

            <EditPostModal
                isOpen={isEditModalOpen}
                post={post}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={handlePostUpdated}
            />

            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Delete Post"
                message={`Are you sure you want to delete "${post.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeletePost}
                onCancel={() => setShowDeleteConfirm(false)}
                variant="danger"
            />
        </div>
    );
};

export default PostDetailPage;
