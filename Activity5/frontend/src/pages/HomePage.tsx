import React, { useState, useEffect } from 'react';
import { postsAPI } from '../utils/api';
import type { Post } from '../types';
import { gsap } from 'gsap';
import CreatePostModal from '../components/CreatePostModal';
import EditPostModal from '../components/EditPostModal';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        if (!loading && posts.length > 0) {
            gsap.fromTo(
                '.post-card',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out'
                }
            );
        }
    }, [loading, posts.length]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await postsAPI.getAll();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostCreated = () => {
        setIsCreateModalOpen(false);
        fetchPosts();
    };

    const handlePostUpdated = () => {
        setIsEditModalOpen(false);
        setSelectedPost(null);
        fetchPosts();
    };

    const handleEditPost = (post: Post) => {
        setSelectedPost(post);
        setIsEditModalOpen(true);
    };

    const handleDeletePost = async (postId: string) => {
        try {
            await postsAPI.delete(postId);
            setPosts(posts.filter(p => p._id !== postId));

            // Show success feedback with GSAP
            const successMsg = document.createElement('div');
            successMsg.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
            successMsg.textContent = 'Post deleted successfully';
            document.body.appendChild(successMsg);

            gsap.fromTo(successMsg,
                { opacity: 0, x: 100 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.3,
                    onComplete: () => {
                        setTimeout(() => {
                            gsap.to(successMsg, {
                                opacity: 0,
                                x: 100,
                                duration: 0.3,
                                onComplete: () => successMsg.remove()
                            });
                        }, 2000);
                    }
                }
            );
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

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onCreatePost={() => setIsCreateModalOpen(true)}
            />

            <div className="container mx-auto px-6 py-12 max-w-7xl">
                <h2 className="text-4xl font-bold mb-8 text-gray-200">Latest Posts</h2>

                {loading ? (
                    <LoadingSpinner />
                ) : filteredPosts.length === 0 ? (
                    <EmptyState
                        message={searchQuery ? "No posts found matching your search." : "No posts yet. Create the first one!"}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                onEdit={handleEditPost}
                                onDelete={handleDeletePost}
                            />
                        ))}
                    </div>
                )}
            </div>

            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handlePostCreated}
            />

            <EditPostModal
                isOpen={isEditModalOpen}
                post={selectedPost}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedPost(null);
                }}
                onSuccess={handlePostUpdated}
            />
        </div>
    );
};

export default HomePage;
