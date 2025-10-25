import React, { useState, useEffect } from 'react';

// NOTE: In the Docker setup, this file (App.jsx) is served as index.html
// by Nginx, and the React environment is assumed to be ready to render this component.

const API_BASE_URL = '/api/tasks'; // Nginx proxies /api/ to the backend

// Task Card Component
const TaskCard = ({ task, onComplete }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] flex justify-between items-start w-full">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">{task.title}</h3>
        <p className="text-sm text-gray-500">{task.description}</p>
      </div>
      <button
        onClick={() => onComplete(task.id)}
        className="ml-4 flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
      >
        Done
      </button>
    </div>
  );
};

// Main Application Component
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- API Handlers ---

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try 
    {
      // Fetches the 5 most recent incomplete tasks
      const response = await fetch(API_BASE_URL);
      if (!response.ok) 
      {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } 
    catch (err) 
    {
      console.error('Failed to fetch tasks:', err);
      setError('Could not load tasks. Please check the API connection.');
    } 
    finally 
    {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) 
    {
      setError('Task title is required.');
      return;
    }
    setLoading(true);
    setError(null);

    try 
    {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

    
      if (!response.ok) 
      {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create task.');
      }

      // Clear form and refresh list to show the latest 5 tasks
      setTitle('');
      setDescription('');
      await fetchTasks();

    } 
    catch (err) 
    {
      console.error('Failed to create task:', err);
      setError(`Creation failed: ${err.message}`);
    } 
    finally 
    {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (id) => {
    setLoading(true);
    setError(null);

    try 
    {
      const response = await fetch(`${API_BASE_URL}/${id}/complete`, {
        method: 'PATCH',
      });

      if (!response.ok) 
      {
        throw new Error(`Failed to complete task. Status: ${response.status}`);
      }

      // Refresh list to remove the completed task (which will automatically fetch a new task if one exists)
      await fetchTasks();

    } 
    catch (err) 
    {
      console.error('Failed to complete task:', err);
      setError('Failed to mark task as done.');
    } 
    finally 
    {
      setLoading(false);
    }
  };

  // Fetch tasks on initial load
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Left Panel: Add a Task Form */}
        <div className='bg-white p-8 rounded-xl shadow-2xl h-fit sticky top-8'>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-3">
            Add a Task
          </h2>
          
          <form onSubmit={handleCreateTask} className="space-y-6">
            
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Buy Groceries"
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                placeholder="e.g., Need to buy milk, bread, and eggs from the market."
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                disabled={loading}
              ></textarea>
            </div>

            {/* Error and Loading Status */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-sm">
                {error}
              </div>
            )}

            {loading && (
              <div className="flex items-center space-x-2 text-blue-600 text-sm">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>Processing...</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
              disabled={loading}
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Right Panel: Task List */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-3">
            Active Tasks (Latest {tasks.length} of 5)
          </h2>
          
          <div className="space-y-5">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleCompleteTask}
                />
              ))
            ) : (
              <div className="text-center p-12 bg-white rounded-xl shadow-lg text-gray-500 border border-dashed">
                <p className="text-lg font-medium">No tasks found!</p>
                <p className="text-sm">Start by adding a new task on the left.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
