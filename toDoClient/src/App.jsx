import Register from './Register';
import Login from './Login';
import Tasks from './Tasks';
import Navigation from './Navigation';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [isLogged, setIsLogged] = useState(
    window.localStorage.getItem('access_token')
  );

  return (
    <section className='App'>
      <Navigation isLogged={isLogged} setIsLogged={setIsLogged} />
      {isLogged ? (
        <Tasks isLogged={isLogged} />
      ) : (
        <Login setIsLogged={setIsLogged} />
      )}
      <Routes>
        <Route path='/tasks' element={<Tasks isLogged={isLogged} />} />
        <Route path='/login' element={<Login setIsLogged={setIsLogged} />} />
        <Route path='/register' Component={Register} />
      </Routes>
    </section>
  );
}

export default App;
