import React, { useEffect, useRef } from 'react';
import TodoItem from './TodoItem';
import { gsap } from 'gsap';

function TodoList({ tasks, toggleComplete, deleteTask, setEditTask }) {
    const listRef = useRef(null);

    // Animate tasks when they change
    useEffect(() => {
        if (!listRef.current) return;

        // Create animation for task list items
        const items = listRef.current.childNodes;

        gsap.fromTo(
            items,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.5,
                ease: "power2.out"
            }
        );
    }, [tasks.length]);

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <h3 className="text-xl font-medium text-primary mb-2">No tasks yet</h3>
                <p className="text-light">Add a new task to get started on your productivity journey.</p>
            </div>
        );
    }

    return (
        <div
            ref={listRef}
            className="custom-scrollbar overflow-y-auto h-[400px]"
        >
            {tasks.map(task => (
                <TodoItem
                    key={task.id}
                    task={task}
                    toggleComplete={toggleComplete}
                    deleteTask={deleteTask}
                    setEditTask={setEditTask}
                />
            ))}
        </div>
    )
}

export default TodoList
