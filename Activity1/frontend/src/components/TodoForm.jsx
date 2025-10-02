import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap';

function TodoForm({ addTask, editTask, updateTask, setEditTask }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [showDescription, setShowDescription] = useState(false)

    // Create refs for elements we want to animate
    const descriptionContainerRef = useRef(null)
    const formRef = useRef(null)

    // Handle edit task state
    useEffect(() => {
        if (editTask) {
            setTitle(editTask.title || '')
            setDescription(editTask.description || '')
            setShowDescription(true)

            if (descriptionContainerRef.current) {
                gsap.to(descriptionContainerRef.current, {
                    height: 'auto',
                    opacity: 1,
                    duration: 0.3,
                    display: 'block'
                });
            }
        }
    }, [editTask]);

    // Effect for showing/hiding description based on title
    useEffect(() => {
        // Skip if we're editing a task
        if (editTask) return;

        if (title.trim() && !showDescription) {
            setShowDescription(true);

            if (descriptionContainerRef.current) {
                gsap.set(descriptionContainerRef.current, { display: 'block', height: 0, opacity: 0 });
                gsap.to(descriptionContainerRef.current, {
                    height: 'auto',
                    opacity: 1,
                    duration: 0.3
                });
            }
        } else if (!title.trim() && showDescription) {
            setShowDescription(false);

            if (descriptionContainerRef.current) {
                gsap.to(descriptionContainerRef.current, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        gsap.set(descriptionContainerRef.current, { display: 'none' });
                    }
                });
            }
        }
    }, [title, showDescription, editTask]);

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!title.trim()) return

        if (editTask) {
            updateTask(editTask.id, {
                title,
                description: description.trim() || undefined
            })
        } else {
            addTask({
                title,
                description: description.trim() || undefined
            })

            // Reset form after submission
            setTitle('')
            setDescription('')

            // Hide description field explicitly
            setShowDescription(false);
            if (descriptionContainerRef.current) {
                gsap.to(descriptionContainerRef.current, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        gsap.set(descriptionContainerRef.current, { display: 'none' });
                    }
                });
            }
        }
    }

    const isButtonDisabled = !title.trim();

    return (
        <form ref={formRef} onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-400 text-sm mb-2">
                    Task Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#181818] text-white px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="What do you need to do?"
                />
            </div>

            <div
                ref={descriptionContainerRef}
                className="mb-4"
                style={{ display: showDescription ? 'block' : 'none', overflow: 'hidden' }}
            >
                <label htmlFor="description" className="block text-gray-400 text-sm mb-2">
                    Description (optional)
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#181818] text-white px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    rows="3"
                    placeholder="Add some details about this task..."
                ></textarea>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isButtonDisabled}
                    className={`px-4 py-2 bg-[#00a2ff] text-[#121212] font-medium rounded-md transition-colors ${isButtonDisabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-opacity-90'
                        }`}
                >
                    {editTask ? 'Update Task' : 'Add Task'}
                </button>
            </div>
        </form>
    )
}

export default TodoForm
