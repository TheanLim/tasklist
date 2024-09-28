'use client'
import { SearchContext } from '@/context/SearchContext';
import { useContext, useEffect, useState } from 'react';
import Task from '../components/Task';
import TaskInputModal from '../components/TaskInputModal';

const Home = () => {
  const { searchQuery } = useContext(SearchContext);
  const [tasks, setTasks] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const sortTasks = (tasks) => {
    sortTasks.sort((a, b) => b.latestUpdateTime - a.latestUpdateTime);
  }

  useEffect(() => {
    // Load tasks from localStorage on component mount
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  // Function to update tasks in state and local storage
  const updateTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deleteTasks = taskIds => {
    const updatedTasks = tasks.filter(task => !taskIds.includes(task.id));
    updateTasks(updatedTasks);
  };

  const handleEditOrNewTask = (editOrNewTask) => {
    const unaffectedTasks = tasks.filter(task => task.id !== editOrNewTask.id);
    editOrNewTask = { ...editOrNewTask, latestUpdateTime: new Date().getTime() }
    updateTasks([...unaffectedTasks, editOrNewTask]);
  }

  // Function to filter tasks based on selected tag
  let filteredTasks = selectedTag
    ? tasks.filter(task => task.tags.includes(selectedTag))
    : tasks;

  // Function to filter tasks based on selected status
  filteredTasks = selectedStatus
    ? filteredTasks.filter(task => task.status === selectedStatus)
    : filteredTasks;

  // Filter tasks using task title/details/tags based on the searchQuery
  if (searchQuery !== "") {
    let lowerCaseQuery = searchQuery.toLowerCase();

    // Extract include tags (e.g., [tag]) and exclude tags (e.g., -[tag])
    let includeTags = (lowerCaseQuery.match(/\[([^\]]+)\]/g) || []).map(tag => tag.slice(1, -1));
    let excludeTags = (lowerCaseQuery.match(/\-\[([^\]]+)\]/g) || []).map(tag => tag.slice(2, -1));

    // Remove exclude tags from includeTags list if they exist there
    includeTags = includeTags.filter(tag => !excludeTags.includes(tag));

    // Extract keywords (outside brackets)
    let searchKeywords = lowerCaseQuery.replace(/\[([^\]]+)\]/g, " ").replace(/\-\[([^\]]+)\]/g, " ").match(/\b\w+\b/g) || [];

    // Initialize arrays for AND matches and OR matches with ranking
    let andMatches = [];
    let orMatches = [];

    // Filter tasks
    filteredTasks.forEach(task => {
      // Convert task fields to lowercase for case-insensitive search
      let taskTitle = task.title?.toLowerCase() || ""; // Optional chaining for task title
      let taskDetails = task.details?.toLowerCase() || ""; // Optional chaining for task details
      let taskTags = task.tags?.map(tag => tag.toLowerCase()) || []; // Optional chaining for task tags

      // Count the number of keyword matches in title and details
      let keywordMatches = searchKeywords.reduce((count, keyword) => {
        return count + (taskTitle.includes(keyword) || taskDetails.includes(keyword) ? 1 : 0);
      }, 0);

      // Count the number of tag matches in taskTags
      let tagMatches = includeTags.reduce((count, tag) => {
        return count + (taskTags.includes(tag) ? 1 : 0);
      }, 0);

      // Check if task does NOT include any of the excludeTags
      let excludeTagMatch = excludeTags.every(tag => !taskTags.includes(tag));

      // Only process the task if it passes the exclude tag check
      if (excludeTagMatch) {
        let totalMatches = keywordMatches + tagMatches;

        // Only add tasks that have at least one match
        if (totalMatches > 0) {
          // AND logic: Check if all keywords and tags match
          let allKeywordsMatch = searchKeywords.every(keyword =>
            taskTitle.includes(keyword) || taskDetails.includes(keyword)
          );
          let allTagsMatch = includeTags.every(tag => taskTags.includes(tag));

          // If all keywords and tags match (AND match)
          if (allKeywordsMatch && allTagsMatch) {
            andMatches.push({ task, totalMatches });
          }
          // Otherwise, check if at least some keywords or tags match (OR match)
          else if (keywordMatches > 0 || tagMatches > 0) {
            orMatches.push({ task, totalMatches });
          }
        }
      }
    });

    // Sort AND matches by the total number of matches in descending order
    andMatches.sort((a, b) => b.totalMatches - a.totalMatches);

    // Sort OR matches by the total number of matches in descending order
    orMatches.sort((a, b) => b.totalMatches - a.totalMatches);

    // Combine results: AND matches first, then OR matches
    filteredTasks = [...andMatches.map(item => item.task), ...orMatches.map(item => item.task)];

    // If no matches, return an empty array
    if (filteredTasks.length === 0) {
      filteredTasks = [];
    }
  }

  return (
    <div className=' to-primary'>
      {/* Tag buttons */}
      <div className='flex gap-1 m-2'>
        <button className={`btn ${selectedTag === null ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setSelectedTag(null)}>All</button>
        {Object.entries(
          tasks
            .flatMap(task => task.tags)
            .reduce((tagCounts, tag) => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
              return tagCounts;
            }, {})
        )
          .sort((a, b) => b[1] - a[1]) // Sort by tag count in descending order
          .map(([tag, count]) => (
            <button
              key={tag}
              className={`btn ${selectedTag === tag ? 'btn-primary' : 'btn-ghost'} btn-sm`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag} ({count})
            </button>
          ))
        }
      </div>

      {/* Status buttons */}
      <div className='flex gap-1 m-2'>
        <button className={`btn ${selectedStatus === null ? 'btn-accent' : 'btn-ghost'} btn-sm`} onClick={() => setSelectedStatus(null)}>All</button>
        <button className={`btn ${selectedStatus === 'pending' ? 'btn-accent' : 'btn-ghost'} btn-sm`} onClick={() => setSelectedStatus('pending')}>Pending</button>
        <button className={`btn ${selectedStatus === 'completed' ? 'btn-accent' : 'btn-ghost'} btn-sm`} onClick={() => setSelectedStatus('completed')}>Completed</button>
      </div>

      <button className='btn btn-sm btn-error m-2'
        onClick={() => { deleteTasks(filteredTasks.map(task => task.id)) }}
      >
        Delete Tasks in View
      </button>


      {/* Task list */}
      <div className='flex items-center justify-center flex-wrap min-w-[18rem] max-w-4xl gap-2 p-4 mx-auto'>
        <div className='ml-auto sticky top-2 right-0 z-10'>
          <TaskInputModal btnTxt={'NEW TASK'} handleEditTask={handleEditOrNewTask} />
        </div>
        {filteredTasks.map(task => (
          <Task
            key={task.id}
            taskId={task.id}
            taskTitle={task.title}
            taskDetails={task.details}
            taskTags={task.tags}
            taskStatus={task.status}
            handleDelete={deleteTasks}
            handleClickTag={setSelectedTag}
            handleEditTask={handleEditOrNewTask}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;