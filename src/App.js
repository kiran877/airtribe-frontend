import React, { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState({
    notStarted: [
      { id: 1, description: "Second round interview" },
      { id: 2, description: "Internship in airtribe" },
      { id: 3, description: "Full time employee" }
    ],
    inProgress: [
      { id: 4, description: "Interview In progress" },
      { id: 5, description: "Project In progress" }
    ],
    completed: [
      { id: 6, description: "Application Completed" },
      { id: 7, description: "Project Completed" }
    ]
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const addTask = (status) => {
    const description = prompt("Enter task description:");
    if (description) {
      const newTask = { id: Date.now(), description };
      setTasks(prevTasks => ({
        ...prevTasks,
        [status]: [...prevTasks[status], newTask]
      }));
    }
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  const dragStart = (event, status, taskId) => {
    event.dataTransfer.setData("text/plain", JSON.stringify({ status, taskId }));
  };

  const drop = (event, newStatus) => {
    event.preventDefault();
    const { status, taskId } = JSON.parse(event.dataTransfer.getData("text/plain"));
    const updatedTasks = { ...tasks };
    const taskIndex = updatedTasks[status].findIndex(task => task.id === taskId);
    const task = updatedTasks[status].splice(taskIndex, 1)[0];
    task.id = Date.now();
    updatedTasks[newStatus].push(task);
    setTasks(updatedTasks);
  };

  const showDetail = (task) => {
    setSelectedTask(task);
  };

  const saveTask = () => {
    setSelectedTask(null);
  };

  const deleteTask = () => {
    if (!selectedTask) {
      console.error("No task selected for deletion.");
      setErrorMessage("No task selected for deletion.");
      return;
    }

    const { status } = selectedTask;
    if (!status || !tasks[status]) {
      console.error("Invalid task status or task list.");
      setErrorMessage("Invalid task status or task list.");
      return;
    }

    const updatedTasks = { ...tasks };
    const index = updatedTasks[status].findIndex(task => task.id === selectedTask.id);
    if (index !== -1) {
      updatedTasks[status].splice(index, 1);
      setSelectedTask(null);
      setErrorMessage("");
      setTasks(updatedTasks);
    } else {
      setErrorMessage("Task not found for deletion.");
    }
  };

  const taskCounts = {
    notStarted: tasks.notStarted.length,
    inProgress: tasks.inProgress.length,
    completed: tasks.completed.length
  };

  return (
    <div className="container">
      <div className="status">
        <h2>
          <label className="status-label not-started">Not started</label>
          <span style={{ color: '#B9B9B7' }}>{taskCounts.notStarted}</span>
          <span className="icon-container">
            <i className="fas fa-ellipsis-h"></i>
            <i className="fas fa-plus"></i>
          </span>
        </h2>
        <div className="tasks" id="notStarted" onDrop={(e) => drop(e, 'notStarted')} onDragOver={(e) => allowDrop(e)}>
          {tasks.notStarted.map(task => (
            <div className="task" key={task.id} draggable={true} onDragStart={(e) => dragStart(e, 'notStarted', task.id)} onClick={() => showDetail(task)}>
              <p>{task.description}</p>
            </div>
          ))}
        </div>
        <button onClick={() => addTask('notStarted')}><span>+ New</span></button>
      </div>

      <div className="status">
        <h2>
          <label className="status-label in-progress">In progress</label>
          <span style={{ color: '#B9B9B7' }}>{taskCounts.inProgress}</span>
          <span className="icon-container">
            <i className="fas fa-ellipsis-h"></i>
            <i className="fas fa-plus"></i>
          </span>
        </h2>
        <div className="tasks" id="inProgress" onDrop={(e) => drop(e, 'inProgress')} onDragOver={(e) => allowDrop(e)}>
          {tasks.inProgress.map(task => (
            <div className="task" key={task.id} draggable={true} onDragStart={(e) => dragStart(e, 'inProgress', task.id)} onClick={() => showDetail(task)}>
              <p>{task.description}</p>
            </div>
          ))}
        </div>
        <button onClick={() => addTask('inProgress')}><span>+ New</span></button>
      </div>

      <div className="status">
        <h2>
          <label className="status-label completed">Completed</label>
          <span style={{ color: '#B9B9B7' }}>{taskCounts.completed}</span>
          <span className="icon-container">
            <i className="fas fa-ellipsis-h"></i>
            <i className="fas fa-plus"></i>
          </span>
        </h2>
        <div className="tasks" id="completed" onDrop={(e) => drop(e, 'completed')} onDragOver={(e) => allowDrop(e)}>
          {tasks.completed.map(task => (
            <div className="task" key={task.id} draggable={true} onDragStart={(e) => dragStart(e, 'completed', task.id)} onClick={() => showDetail(task)}>
              <p>{task.description}</p>
            </div>
          ))}
        </div>
        <button onClick={() => addTask('completed')}><span>+ New</span></button>
      </div>
    </div>
  );
}

export default App;
