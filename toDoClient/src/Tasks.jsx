import { useState, useEffect, useCallback } from 'react';
import SingleTask from './SingleTask.jsx';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const url = 'http://localhost:8000/api/tasks/';

const Tasks = ({ isLogged }) => {
  Tasks.propTypes = {
    isLogged: PropTypes.string,
  };

  const navigate = useNavigate();

  const [task, setTask] = useState('');
  const [data, setData] = useState([]);

  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);

  const handleChange = (e) => {
    const input_value = e.target.value;
    setTask(input_value);
  };

  const submitTask = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${isLogged}`,
        },
        body: JSON.stringify({
          task: task,
        }),
      });

      let responseJson = await res.json();
      console.log(responseJson);
      if (res.status === 201) {
        setTask('');
        fetchTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTasks = useCallback(async () => {
    try {
      let res = await fetch(url, {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${isLogged}`,
        },
      });

      let responseJson = await res.json();

      if (res.status === 200) {
        setData(responseJson);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getTasks = (date) => {
    const tasks = data.filter((task) => task.due === date);

    if (tasks.length === 0) {
      return <p className='task-paragraph'>No tasks found.</p>;
    }

    return tasks.map((task) => {
      return (
        <SingleTask
          singleTask={task}
          key={task.id}
          isLogged={isLogged}
          fetchTasks={fetchTasks}
        />
      );
    });
  };

  useEffect(() => {
    if (!isLogged) return navigate('/login');
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className='app-container'>
      <div className='tasks'>
        <h1>Tasks</h1>
        <hr />
        <div className='task-list'>
          <div
            className='list-header'
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <h5
              style={{
                textAlign: 'left',
                marginLeft: '1.5em',
              }}
            >
              {date === today ? 'Today' : date}
            </h5>
            <input
              type='date'
              name='date'
              id='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <ul>{getTasks(date)}</ul>
        </div>
      </div>
      <div className='new-task' style={{ marginTop: '40px' }}>
        <form className='new-task-form' onSubmit={submitTask}>
          <input
            type='text'
            className='input-task'
            placeholder='Type new task'
            name='task'
            value={task}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
          <button type='submit' className='submit-button'>
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default Tasks;
