import { useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo-condensed.png';
import { AuthContext } from '../../shared/context/auth-context';

const ToolBar = props => {
    const ctx = useContext(AuthContext);
    return (
        <nav className="navbar navbar-expand-lg shadow-sm" style={{ backgroundColor: '#BF5700', zIndex: 100 }}>
            <div className="container">
                <div className="d-flex align-items-center">
                    <Link to="/" className="navbar-brand">
                        <img src={logo} alt="logo"
                            height="70px" />
                    </Link>
                    <Link to="/" className="navbar-brand text-white" style={{ fontSize: '28px' }}>UTutoring Dallas</Link>
                </div>
                <button className="navbar-toggler text-white" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

                        {ctx.isLoggedIn && ctx.isAdmin && <li className='nav-link text-white cursor-pointer'>
                            <Link to="/admin" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}><i className="fa-solid fa-lock"></i> Admin</Link>
                        </li>}

                        {ctx.isLoggedIn && !ctx.isTutor && <li className='nav-link text-white cursor-pointer'>
                            <Link to="/tutors" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}><i className="fa-solid fa-graduation-cap"></i> Tutors</Link>
                        </li>}

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle text-white" style={{ fontSize: '20px' }} href="/" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fa-solid fa-user"></i> Account
                            </a>
                            <ul className="dropdown-menu dropdown-menu-start dropdown-menu-md-start">
                                {!ctx.isLoggedIn && <li><Link to="/login" className="dropdown-item">Login</Link></li>}
                                {!ctx.isLoggedIn && <li><Link to="/signup" className="dropdown-item">Sign Up</Link></li>}
                                {ctx.isLoggedIn && <li><Link to="/profile" className="dropdown-item">Profile</Link></li>}
                                {ctx.isLoggedIn && !ctx.isTutor && <li><Link to="/tutorsignup" className="dropdown-item">Tutor Signup</Link></li>}
                                {ctx.isLoggedIn && <li><span className="dropdown-item" style={{ cursor: 'pointer' }} onClick={ctx.logout}>Sign out</span></li>}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default ToolBar;