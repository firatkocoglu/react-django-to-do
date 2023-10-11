import { FaUserAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const register_url = 'http://localhost:8000/auth/users/';

const Register = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [resStyle, setResStyle] = useState({
    backgroundColor: '',
    color: '#fff',
    fontSize: '1.2em',
  });

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMessage(''), 3000);
  }, [message]);

  const handleChange = (e) => {
    const { name: targetName, value } = e.target;
    setUser({ ...user, [targetName]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch(register_url, {
        method: 'POST',
        body: JSON.stringify({
          username: user.name,
          password: user.password,
          email: user.email,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      let responseJson = await res.json();
      console.log(responseJson);

      if (res.status === 201) {
        setResStyle({ ...resStyle, backgroundColor: '#79AC78' });
        setUser({ name: '', email: '', password: '' });
        setMessage('Registration successful! Redirecting to Login page...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setResStyle({ ...resStyle, backgroundColor: '#C63D2F' });
        setMessage(() => {
          if (responseJson['password']) {
            return responseJson['password'][0];
          } else if (responseJson['username']) {
            return responseJson['username'][0];
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <article>
      <div className='app-container'>
        <h1>Register</h1>
        {message && (
          <div className='message' style={resStyle}>
            {message}
          </div>
        )}
        <form className='register-form' onSubmit={handleSubmit}>
          <div className='register-input'>
            <div className='input-box'>
              <label htmlFor='name'>
                <FaUserAlt />
              </label>
              <input
                type='text'
                name='name'
                id='name'
                required
                placeholder='Username'
                value={user.name}
                onChange={handleChange}
              />
            </div>
            <div className='input-box'>
              <label htmlFor='email'>
                <FaEnvelope />
              </label>
              <input
                type='email'
                name='email'
                id='email'
                required
                placeholder='Your Email'
                value={user.email}
                onChange={handleChange}
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
                required
                placeholder='Type a password'
                value={user.password}
                onChange={handleChange}
              />
            </div>
            <button type='submit' className='submit-button'>
              Register
            </button>
          </div>
          <div className='register-sign-in'>
            <p>
              Already have an account? <Link to='/login'>Sign in</Link>.
            </p>
          </div>
        </form>
      </div>
    </article>
  );
};

export default Register;
