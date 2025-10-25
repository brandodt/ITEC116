import React from 'react';
import type { Comment } from '../types';
import UserAvatar from './UserAvatar';

interface CommentItemProps {
    comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
    // Truncate long author names
    const truncateName = (name: string, maxLength: number = 25) => {
        if (!name) return 'Unknown User';
        return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="comment-item bg-[#151515] p-4 rounded-lg border border-gray-800">
            <div className="flex items-start gap-3">
                <UserAvatar name={comment.userId?.name || 'U'} size="md" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <p
                            className="text-gray-200 font-semibold truncate"
                            title={comment.userId?.name}
                        >
                            {truncateName(comment.userId?.name || 'Unknown User')}
                        </p>
                        <span className="text-gray-500 text-sm flex-shrink-0">
                            {formatDate(comment.createdAt)}
                        </span>
                    </div>
                    <p className="text-gray-300 break-words">{comment.content}</p>
                </div>
            </div>
        </div>
    );
};

export default CommentItem;
