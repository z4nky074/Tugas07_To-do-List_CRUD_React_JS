import React, { useState, useEffect } from 'react';
import './TaskList.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Swal from 'sweetalert2';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newStatus, setNewStatus] = useState('To Do');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingPriority, setEditingPriority] = useState('Medium');
  const [editingStatus, setEditingStatus] = useState('To Do');
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Mengambil data dari localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) setTasks(JSON.parse(storedTasks));
  }, []);

  // Menyimpan data ke localStorage setiap kali tasks diperbarui
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Fungsi untuk menambah tugas baru
  const handleAddTask = () => {
    if (newTask.trim() === '') {
      setErrorMessage('Silakan isi bagian "Tambahkan tugas baru" terlebih dahulu!');
      return;
    }
    const newTaskObj = {
      id: Date.now(),
      task: newTask,
      priority: newPriority,
      status: newStatus,
      completed: false,
    };
    setTasks([...tasks, newTaskObj]);
    setNewTask('');
    setShowForm(false);
    setErrorMessage('');
  };

  // Fungsi untuk menghapus tugas
  const handleDeleteTask = (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Tugas ini akan dihapus!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
        Swal.fire('Tugas Terhapus!', 'Tugas telah berhasil dihapus.', 'success');
      }
    });
  };

  // Fungsi untuk menandai tugas selesai
  const handleToggleComplete = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  // Memulai proses edit tugas
  const startEditing = (id, task, priority, status) => {
    setEditingTaskId(id);
    setEditingText(task);
    setEditingPriority(priority);
    setEditingStatus(status);
  };

  // Menyimpan hasil edit tugas (termasuk prioritas dan status)
  const saveEdit = (id) => {
    setTasks(tasks.map((task) => 
      task.id === id 
        ? { ...task, task: editingText, priority: editingPriority, status: editingStatus } 
        : task
    ));
    setEditingTaskId(null);
    setEditingText('');
    setEditingPriority('Medium');
    setEditingStatus('To Do');
  };

  // Membatalkan proses edit
  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingText('');
    setEditingPriority('Medium');
    setEditingStatus('To Do');
  };

  // Membatalkan penambahan tugas baru
  const handleCancelForm = () => {
    setShowForm(false);
    setErrorMessage('');
  };

  // Fungsi untuk menangani Enter saat mengedit tugas, prioritas, atau status
  const handleKeyDown = (e, id, type) => {
    if (e.key === 'Enter') {
      if (type === 'task') {
        saveEdit(id); // Menyimpan saat Enter di input task
      } else if (type === 'priority') {
        saveEdit(id); // Menyimpan saat Enter di dropdown priority
      } else if (type === 'status') {
        saveEdit(id); // Menyimpan saat Enter di dropdown status
      }
    }
  };

  return (
    <div className="task-list">
      <h1>Task List</h1>
      {!showForm && (
        <button className="add-task-button" onClick={() => setShowForm(true)}>
          <i className="fas fa-plus"></i> Tambah Tugas
        </button>
      )}
      {showForm && (
        <div className="add-task-form">
          <input
            type="text"
            placeholder="Tambahkan tugas baru..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          {errorMessage && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i> {errorMessage}
            </div>
          )}
          <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <button onClick={handleAddTask}>
            <i className="fas fa-save"></i> Tambah Tugas
          </button>
          <button onClick={handleCancelForm}>
            <i className="fas fa-times"></i> Batal
          </button>
        </div>
      )}
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            {editingTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, task.id, 'task')} // Menyimpan saat Enter di task
                />
                <select
                  value={editingPriority}
                  onChange={(e) => setEditingPriority(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, task.id, 'priority')} // Menyimpan saat Enter di priority
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <select
                  value={editingStatus}
                  onChange={(e) => setEditingStatus(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, task.id, 'status')} // Menyimpan saat Enter di status
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
                <button onClick={() => saveEdit(task.id)}>
                  <i className="fas fa-save"></i>
                </button>
                <button onClick={cancelEdit}>
                  <i className="fas fa-times"></i>
                </button>
              </>
            ) : (
              <>
                <span
                  onClick={() => handleToggleComplete(task.id)}
                  className={task.completed ? 'completed' : 'task-text'}
                >
                  {task.task}
                </span>
                <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                <span className={`status ${task.status.toLowerCase().replace(' ', '-')}`} >
                  {task.status}
                </span>
                <div className={`status-circle ${task.status.toLowerCase().replace(' ', '-')}`}></div>
                <button className="edit" onClick={() => startEditing(task.id, task.task, task.priority, task.status)}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className="delete" onClick={() => handleDeleteTask(task.id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
