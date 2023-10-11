import logo from './assets/logo.png';
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Navigation = ({ isLogged, setIsLogged }) => {
  Navigation.propTypes = {
    isLogged: PropTypes.string,
    setIsLogged: PropTypes.func,
  };

  const logout_url = 'http://localhost:8000/api/logout/';
  const refresh_token = window.localStorage.getItem('refresh_token');

  const navigate = useNavigate();

  const logoutClick = async () => {
    try {
      let res = await fetch(logout_url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refresh_token }),
        authorization: `Bearer ${isLogged}`,
      });
      let responseJson = await res.json();
      console.log(responseJson);

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsLogged(false);
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar expand='lg' bg='myColor'>
      <Container>
        <Navbar.Brand as={Link} to='/'>
          <img src={logo} alt='to-do' className='logo' />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='#basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
            {isLogged ? (
              <Nav.Link
                as={Link}
                to='/logout'
                className='nav-font'
                onClick={logoutClick}
              >
                Logout
              </Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} to='/login' className='nav-font'>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to='/register' className='nav-font'>
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
