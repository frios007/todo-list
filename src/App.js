import { useState } from "react";
import "./index.css";

export default function App() {
  return (
    <div className="container">
      <ToDoList />
    </div>
  );
}

function ToDoList() {
  const [taskList, setTaskList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [sort, setSort] = useState("input");
  const completedTasks = taskList.filter((task) => task.status === true).length;
  const pendingTasks = taskList.filter((task) => task.status === false).length;

  function handleShowForm() {
    setShowForm((show) => !show);
  }

  function HandleAddTask(newTaskObj) {
    setTaskList((tasks) => [...tasks, newTaskObj]);
    setShowForm(false);
  }

  function handleSetStatus(currentTask) {
    if (!currentTask.status)
      setTaskList((list) =>
        list.map((task) =>
          task.id === currentTask.id ? { ...task, status: true } : task
        )
      );

    if (currentTask.status)
      setTaskList((list) =>
        list.map((task) =>
          task.id === currentTask.id ? { ...task, status: false } : task
        )
      );
  }

  function handleDeleteTask(currentTask) {
    if (
      window.confirm(
        `Are you sure to delete this task: ${currentTask.taskTitle}`
      )
    )
      setTaskList((tasks) =>
        tasks.filter((task) => task.id !== currentTask.id)
      );
  }

  function handleClearList() {
    if (window.confirm("Do you want to delete all tasks?")) setTaskList([]);
  }

  let listCopy = taskList.slice();
  let sortedTasks;

  const priorityOrder = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  switch (sort) {
    case "input":
      sortedTasks = listCopy;
      break;
    case "priority":
      sortedTasks = listCopy
        .slice()
        .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      break;
    case "status":
      sortedTasks = listCopy
        .slice()
        .sort((a, b) => Number(a.status) - Number(b.status));
      break;
    default:
      return;
  }

  return (
    <>
      <Title />

      {sortedTasks.length === 0 && (
        <>
          <WelcomeScreen />
          {showForm && <AddTaskForm onAddTask={HandleAddTask} />}
        </>
      )}

      <AddTaskInput onShowForm={handleShowForm}>
        {showForm ? "Close Form" : "Add Task"}
      </AddTaskInput>

      {sortedTasks.length > 0 && (
        <>
          {showForm && <AddTaskForm onAddTask={HandleAddTask} />}
          <DisplayTaskList
            taskList={sortedTasks}
            onSetCompleted={handleSetStatus}
            onDeleteTask={handleDeleteTask}
          />
          <Footer
            completedTask={completedTasks}
            pendingTask={pendingTasks}
            onClearList={handleClearList}
            sort={sort}
            setSort={setSort}
          />
        </>
      )}
    </>
  );
}

function WelcomeScreen() {
  return (
    <div className="welcome-screen">
      <h1>Welcome to the ultimate To-Do List!</h1>
      <p>
        <em>Start by adding some tasks 😊</em>
      </p>
    </div>
  );
}

function Title() {
  const date = new Date();
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-EN", options).format(date);

  return (
    <div className="title-container">
      <h3>My to-do list</h3>
      <p>{formattedDate}</p>
    </div>
  );
}

function AddTaskInput({ children, onShowForm }) {
  return (
    <div className="btn-container">
      <button onClick={onShowForm}>{children}</button>
    </div>
  );
}

function AddTaskForm({ onAddTask }) {
  const [taskTitle, setTaskTitle] = useState("");
  const [due, setDue] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");

  function handleAddTask(e) {
    e.preventDefault();
    if (!taskTitle || !due || !description || !priority) return;

    const newTask = {
      taskTitle,
      due,
      description,
      priority,
      status: false,
      id: crypto.randomUUID(),
    };

    setTaskTitle("");
    setDue("");
    setDescription("");
    setPriority("Low");
    onAddTask(newTask);
  }

  return (
    <form className="form" onSubmit={handleAddTask}>
      <input
        type="text"
        placeholder="Task Tittle"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="due date"
        value={due}
        onChange={(e) => setDue(e.target.value)}
      />

      <input
        type="text"
        placeholder="task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>Select priority</label>
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value={"Low"}>Low</option>
        <option value={"Medium"}>Medium</option>
        <option value={"High"}>High</option>
      </select>

      <button type="submit">Save</button>
    </form>
  );
}

function DisplayTaskList({
  taskList,
  onSetCompleted,
  onDeleteTask,
  onEditTask,
}) {
  return (
    <ol className="task-list">
      {taskList.map((task, i) => (
        <Tasks
          tasker={task}
          key={i}
          onSetCompleted={onSetCompleted}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
        />
      ))}
    </ol>
  );
}

function Tasks({ tasker, onSetCompleted, onDeleteTask }) {
  const currentTask = tasker;

  return (
    <li className={`list-items item-priority-${tasker.priority}`}>
      <div>
        <h4>
          <em> {tasker.taskTitle}</em>
        </h4>

        <p className="description">{tasker.description}</p>

        <p className="priority">
          <strong>Priority: </strong>
          {tasker.priority}
        </p>

        <span className="due">
          <strong>Due Date: </strong>
          {tasker.due}
        </span>

        <p>
          <strong>Status: </strong>
          <span className={tasker.status ? "complete" : "pending"}>
            {tasker.status ? "Complete" : "Pending"}
          </span>
        </p>

        <div className="option-buttons">
          <button onClick={() => onSetCompleted(currentTask)}>
            {tasker.status ? "⏪" : "✅"}
          </button>
          <button onClick={() => onDeleteTask(currentTask)}>🗑️</button>
        </div>
      </div>
    </li>
  );
}

function Footer({ completedTask, pendingTask, onClearList, sort, setSort }) {
  return (
    <footer className="footer">
      <p>☑️completed tasks: {completedTask}</p>
      <p>⏳pending tasks: {pendingTask}</p>
      <div className="footer-options">
        <label>Sort tasks</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="input">Sort by Input</option>
          <option value="priority">By Priority</option>
          <option value="status">By Status</option>
        </select>
        <button onClick={onClearList}>Clear List</button>
      </div>
    </footer>
  );
}
