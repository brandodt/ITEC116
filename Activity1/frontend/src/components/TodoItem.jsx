import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

function TodoItem({ task, toggleComplete, deleteTask, setEditTask }) {
    const itemRef = useRef(null);

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleCheckboxChange = () => {
        // Don't use the event object, just pass the current completion state
        console.log(`Toggling task ${task.id}, current completed status: ${task.completed}`);
        toggleComplete(task.id, task.completed);

        // Animate the checkbox change
        if (itemRef.current) {
            if (!task.completed) {
                // Animate when checking
                gsap.to(itemRef.current, {
                    backgroundColor: 'rgba(55, 65, 81, 0.3)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                // Animate when unchecking
                gsap.to(itemRef.current, {
                    backgroundColor: 'rgba(13, 13, 13, 1)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        }
    };

    const handleDelete = () => {
        // Animate deletion before calling the delete function
        gsap.to(itemRef.current, {
            opacity: 0,
            x: -50,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                deleteTask(task.id);
            }
        });
    };

    const handleEdit = () => {
        // Animate edit button
        gsap.to(itemRef.current, {
            scale: 1.02,
            duration: 0.2,
            ease: 'power1.out',
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                setEditTask(task);
            }
        });
    };

    // Ensure the completion status is treated as a boolean
    const isCompleted = Boolean(task.completed);

    return (
        <div
            ref={itemRef}
            className={`bg-[#222] rounded-md p-3 border border-[#333] transition-all mb-2 ${isCompleted ? 'opacity-70' : 'hover:border-primary'}`}
        >
            <div className="flex items-start">
                <div className="pt-0.5">
                    <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 rounded-sm border-gray-600 text-primary focus:ring-primary focus:ring-offset-darker"
                    />
                </div>

                <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                        <h3 className={`text-base font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-text'}`}>
                            {task.title}
                        </h3>
                        <div className="flex space-x-1 ml-2">
                            <button
                                onClick={handleEdit}
                                className="p-1 rounded-full text-light hover:text-primary hover:bg-[#333] transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-10 10a2 2 0 01-.707.707l-2 1a1 1 0 01-1.414-1.414l1-2a2 2 0 01.707-.707l10-10z" />
                                </svg>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-1 rounded-full text-light hover:text-red-500 hover:bg-[#333] transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {task.description && (
                        <p className={`mt-1 text-xs ${isCompleted ? 'text-gray-600' : 'text-light'}`}>
                            {task.description}
                        </p>
                    )}

                    <div className="mt-1 flex items-center text-xs text-gray-500">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>{formatDate(task.createdAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TodoItem;
