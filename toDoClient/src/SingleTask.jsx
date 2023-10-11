import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  FaRegStar,
  FaStar,
  FaPencilAlt,
  FaTrash,
  FaCheck,
} from 'react-icons/fa';

const SingleTask = ({ singleTask, isLogged, fetchTasks }) => {
  SingleTask.propTypes = {
    singleTask: PropTypes.object,
    isLogged: PropTypes.string,
    fetchTasks: PropTypes.func,
  };
  const { id, task, due, important, complete } = singleTask;

  const [isCompleted, setCompleted] = useState(complete);
  const [isImportant, setImportant] = useState(important);
  const [dueDate, setDueDate] = useState(due);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState('');

  const update_url = `http://localhost:8000/api/tasks/${id}/`;

  const completedStyle = {
    textDecoration: 'line-through',
    color: '#7D7C7C',
  };

  const handleEditedValue = (e) => {
    const edited_value = e.target.value;
    setEditedValue(edited_value);
  };

  const completeHandler = async () => {
    try {
      console.log(singleTask);
      let res = await fetch(update_url, {
        method: 'PATCH',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${isLogged}`,
        },
        body: JSON.stringify({
          complete: !isCompleted,
        }),
      });

      let responseJson = await res.json();
      console.log(responseJson);
      if (res.status === 200) {
        setCompleted(!isCompleted);
        fetchTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const importantHandler = async () => {
    try {
      let res = await fetch(update_url, {
        method: 'PATCH',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${isLogged}`,
        },
        body: JSON.stringify({
          important: !isImportant,
        }),
      });

      let responseJson = await res.json();
      console.log(responseJson);
      if (res.status === 200) {
        setImportant(!isImportant);
        fetchTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editHandler = async () => {
    if (editedValue === '') {
      setIsEditing(false);
      return;
    }

    try {
      let res = await fetch(update_url, {
        method: 'PATCH',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${isLogged}`,
        },
        body: JSON.stringify({
          task: editedValue,
        }),
      });

      let responseJson = await res.json();
      console.log(responseJson);

      if (res.status === 200) {
        setEditedValue('');
        setIsEditing(false);
        fetchTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = async () => {
    try {
      let res = await fetch(update_url, {
        method: 'DELETE',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${isLogged}`,
        },
      });

      let responseJson = await res.json();
      console.log(responseJson);
      if (res.status === 200) {
        console.log('Deleted');
        fetchTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const dueHandler = async (e) => {
    try {
      let res = await fetch(update_url, {
        method: 'PATCH',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${isLogged}`,
        },
        body: JSON.stringify({
          due: new Date(e.target.value).toISOString().split('T')[0],
        }),
      });

      let responseJson = await res.json();
      console.log(responseJson);

      if (res.status === 200) {
        setDueDate(new Date(e.target.value).toISOString().split('T')[0]);
        fetchTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <li key={id}>
      <div className='task-div'>
        <input
          type='checkbox'
          name='complete'
          id='complete'
          className='task-complete'
          value={isCompleted}
          onChange={completeHandler}
          checked={isCompleted && true}
        />
        <p
          className='task-paragraph'
          style={isCompleted ? completedStyle : null}
        >
          {isEditing ? (
            <input
              type='text'
              name='edit'
              id='edit'
              value={editedValue}
              onChange={handleEditedValue}
              style={{
                border: 'none',
                borderBottom: '1px solid',
                backgroundColor: '#f9f7f7',
              }}
            ></input>
          ) : (
            task
          )}
          <button
            type='button'
            className='single-task-button'
            onClick={importantHandler}
          >
            {isImportant ? <FaStar /> : <FaRegStar />}
          </button>
        </p>
        <div>
          <span>
            <label htmlFor='due' style={{ marginRight: '10px' }}>
              Due
            </label>
            <input
              type='date'
              name='due'
              id='due'
              value={dueDate}
              onChange={dueHandler}
            />
          </span>
        </div>
        <div className='del-edit'>
          {isEditing ? (
            <button
              type='button'
              className='single-task-button'
              onClick={editHandler}
            >
              <FaCheck />
            </button>
          ) : (
            <button
              type='button'
              className='single-task-button'
              onClick={() => setIsEditing(true)}
            >
              <FaPencilAlt />
            </button>
          )}
          <button
            type='button'
            className='single-task-button'
            onClick={deleteHandler}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </li>
  );
};

export default SingleTask;
