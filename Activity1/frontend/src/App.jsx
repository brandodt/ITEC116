import { useState, useEffect } from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import axios from 'axios'
import { gsap } from 'gsap'

const API_URL = 'http://localhost:3001/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editTask, setEditTask] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('checking')

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      setLoading(true)
      await fetchTasks()
      setConnectionStatus('connected')
    } catch (err) {
      console.error('Connection error:', err)
      setConnectionStatus('disconnected')
      setError('Could not connect to the database. Please make sure the backend server is running.')
    } finally {
      setLoading(false)
    }
  }

  // Add this utility function to normalize task objects
  const normalizeTask = (task) => {
    // Handle MongoDB _id vs id inconsistency
    if (task._id && !task.id) {
      task.id = task._id.toString();
    }
    return task;
  };

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await axios.get(API_URL)
      // Normalize the tasks to ensure id is available
      const normalizedTasks = response.data.map(normalizeTask)
      setTasks(normalizedTasks)
      setError(null)
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError('Failed to load tasks. Please try again later.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Add task with animation
  const addTask = async (task) => {
    try {
      const response = await axios.post(API_URL, task)
      // Normalize the task
      const normalizedTask = normalizeTask(response.data)

      // Add the task with animation effect
      setTasks(prev => {
        const newTasks = [normalizedTask, ...prev];
        // Animation will be handled in TodoItem via key change
        return newTasks;
      });
    } catch (err) {
      console.error('Error adding task:', err)
      setError('Failed to add task. Please try again.')
    }
  }

  const updateTask = async (id, updatedTask) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedTask)
      // Normalize the task
      const normalizedTask = normalizeTask(response.data)
      setTasks(tasks.map(task => task.id === id ? normalizedTask : task))
      setEditTask(null)
    } catch (err) {
      console.error('Error updating task:', err)
      setError('Failed to update task. Please try again.')
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      setTasks(tasks.filter(task => task.id !== id))
    } catch (err) {
      console.error('Error deleting task:', err)
      setError('Failed to delete task. Please try again.')
    }
  }

  const toggleComplete = async (id, completed) => {
    try {
      console.log(`Toggling task ${id} completion status from ${completed} to ${!completed}`);

      // First update the UI optimistically
      setTasks(tasks.map(task => {
        if (task.id === id) {
          return { ...task, completed: !completed };
        }
        return task;
      }));

      // Then update the server
      const response = await axios.put(`${API_URL}/${id}`, {
        completed: !completed
      });

      // Log the server response
      console.log('Server response for toggle:', response.data);

      // If there's any discrepancy, refresh the task list
      if (!response.data || response.data.completed !== !completed) {
        console.log('Detected state mismatch, refreshing task list');
        await fetchTasks();
      }
    } catch (err) {
      console.error('Error toggling task completion:', err);
      // Revert the optimistic update by refreshing the task list
      await fetchTasks();
    }
  }

  // const createTestTask = async () => {
  //   try {
  //     setLoading(true)
  //     const testTask = {
  //       title: `Test Task ${new Date().toLocaleTimeString()}`,
  //       description: 'This is a test task to verify MongoDB connection'
  //     }
  //     const response = await axios.post(API_URL, testTask)
  //     setTasks([response.data, ...tasks])
  //     setError(null)
  //     alert('Test task created successfully! Check your MongoDB collections now.')
  //   } catch (err) {
  //     console.error('Error creating test task:', err)
  //     setError('Failed to create test task. Please check server logs.')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // Simple animation for header when app loads
  useEffect(() => {
    gsap.fromTo(
      'header h1',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );

    gsap.fromTo(
      'header p',
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 0.5, ease: 'power2.out' }
    );
  }, []);

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col items-center mb-8">
          <h1 className="page-title">Task Manager</h1>
          <p className="text-light mt-6 text-center max-w-2xl">
            Organize your tasks, boost productivity, and never miss a deadline
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/30 border-l-4 border-red-600">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-5a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-light">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Form Card */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "var(--color-primary)" }}>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Create New Task
            </h2>
            <TodoForm
              addTask={addTask}
              editTask={editTask}
              updateTask={updateTask}
              setEditTask={setEditTask}
            />
          </div>

          {/* Task List Card */}
          <div className="card lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "var(--color-primary)" }}>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Your Tasks
            </h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-10 h-10 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
              </div>
            ) : (
              <TodoList
                tasks={tasks}
                toggleComplete={toggleComplete}
                deleteTask={deleteTask}
                setEditTask={setEditTask}
              />
            )}
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-light">
          <p>© {new Date().getFullYear()} Task Manager. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
