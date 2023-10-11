import { FaUserAlt, FaLock } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const login_url = 'http://localhost:8000/api/token/';

const Login = ({ setIsLogged }) => {
  Login.propTypes = {
    setIsLogged: PropTypes.string,
  };

  const [message, setMessage] = useState('');
  const [user, setUser] = useState({ name: '', password: '' });
  const [resStyle, setResStyle] = useState({
    backgroundColor: '',
    color: '#fff',
    fontSize: '1.2em',
  });

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMessage(''), 1000);
  }, [message]);

  const handleChange = (e) => {
    const { name: targetName, value } = e.target;
    setUser({ ...user, [targetName]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.name || !user.password) {
      return;
    }
    //Post login credentials
    try {
      let res = await fetch(login_url, {
        method: 'POST',
        body: JSON.stringify({
          username: user.name,
          password: user.password,
        }),
        headers: {
          'Content-type': 'application/json',
        },
      });

      let responseJson = await res.json();
      const access_token = responseJson.access;
      const refresh_token = responseJson.refresh;

      window.localStorage.setItem('access_token', access_token);
      window.localStorage.setItem('refresh_token', refresh_token);

      if (res.status === 200) {
        setResStyle({ ...resStyle, backgroundColor: '#79AC78' });
        setMessage('Login successful!');
        setTimeout(() => {
          setIsLogged(window.localStorage.getItem('access_token'));
          navigate('/tasks');
        }, 1000);
      } else {
        setResStyle({ ...resStyle, backgroundColor: '#C63D2F' });
        setMessage(responseJson.detail + '.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <article>
      <div className='app-container'>
        <h1>Login</h1>
        {message && (
          <div style={resStyle} className='message'>
            {message}
          </div>
        )}
        <form action='' className='login-form' onSubmit={handleSubmit}>
          <div className='login-input'>
            <div className='input-box'>
              <label htmlFor='name'>
                <FaUserAlt />
              </label>
              <input
                type='text'
                name='name'
                id='name'
                placeholder='Your Username'
                value={user.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className='input-box'>
              <label htmlFor='password'>
                <FaLock />
              </label>
              <input
                type='password'
                name='password'
                id='password'
                placeholder='Your Password'
                value={user.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type='submit' className='submit-button'>
              Login
            </button>
            <div className='forgot-password'>
              <p>
                Don&apos;t have an account? <Link to='/register'>Register</Link>
              </p>
            </div>
            <div className='forgot-password'>
              <Link to='/login'>Forgot password?</Link>
            </div>
          </div>
        </form>
      </div>
    </article>
  );
};

export default Login;
