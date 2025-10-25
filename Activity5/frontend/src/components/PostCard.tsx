import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { Post } from '../types';
import ConfirmModal from './ConfirmModal';

interface PostCardProps {
    post: Post;
    onEdit?: (post: Post) => void;
    onDelete?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Truncate long author names
    const truncateName = (name: string, maxLength: number = 20) => {
        if (!name) return 'Unknown Author';
        return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Fix: Check both _id and id fields for user matching
    const isOwner = user && post.userId && (
        user.id === post.userId.id ||
        user.id === post.userId._id ||
        user.id === (post.userId as any)?._id
    );

    // Debug log
    console.log('User:', user?.id, 'Post Owner:', post.userId?.id || post.userId?._id, 'IsOwner:', isOwner);

    const handleCardClick = () => {
        navigate(`/post/${post._id}`);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit?.(post);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        setShowDeleteConfirm(false);
        onDelete?.(post._id);
    };

    return (
        <>
            <article
                className="post-card bg-[#151515] rounded-lg p-6 border border-gray-800 hover:border-primary transition-all cursor-pointer transform hover:scale-[1.02] relative group"
                onClick={handleCardClick}
            >
                {/* Edit/Delete buttons for owner */}
                {isOwner && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleEdit}
                            className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                            title="Edit post"
                        >
                            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete post"
                        >
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}

                <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2 pr-20">
                    {post.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate" title={post.userId?.name}>
                        {truncateName(post.userId?.name || 'Unknown Author')}
                    </span>
                    <span className="flex-shrink-0">•</span>
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="flex-shrink-0">{formatDate(post.createdAt)}</span>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {post.content}
                </p>

                {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {post.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs border border-primary/20"
                            >
                                {tag}
                            </span>
                        ))}
                        {post.tags.length > 3 && (
                            <span className="text-gray-500 text-xs py-1">
                                +{post.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </article>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Delete Post"
                message={`Are you sure you want to delete "${post.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                variant="danger"
            />
        </>
    );
};

export default PostCard;
