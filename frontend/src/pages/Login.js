import axios from "axios";
import { useContext, useReducer, useState } from "react";
import { AuthContext } from '../shared/context/auth-context';
import LoadingSpinner from '../components/LoadingSpinner';

const EMAIL_REGEX = /^[A-Za-z0-9\.]+@[A-Za-z0-9\.]+$/; // eslint-disable-line

const formReducer = (state, action) => {
    switch (action.type) {
        case 'EMAIL_INPUT':
            return {
                ...state,
                email: {
                    value: action.value,
                    isValid: action.value.match(EMAIL_REGEX) !== null,
                    touched: true
                },
                isValid: action.value.match(EMAIL_REGEX) !== null && state.password.isValid
            }
        case 'EMAIL_BLUR':
            return {
                ...state,
                email: { ...state.email, touched: true }
            }
        case 'PASSWORD_INPUT':
            return {
                ...state,
                password: {
                    value: action.value,
                    isValid: action.value.length >= 6,
                    touched: true
                },
                isValid: state.email.isValid && action.value.length >= 6
            }
        case 'PASSWORD_BLUR':
            return {
                ...state,
                password: { ...state.password, touched: true }
            }
        default: return state;
    }
};

const Login = props => {

    const ctx = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formState, dispatch] = useReducer(formReducer, {
        email: {
            value: '',
            isValid: false,
            touched: false
        },
        password: {
            value: '',
            isValid: false,
            touched: false
        },
        isValid: false
    });

    const onSubmit = e => {
        e.preventDefault();
        setIsLoading(true);
        axios.post(`${process.env.REACT_APP_API_URL}/login`, { email: formState.email.value, password: formState.password.value })
            .then(response => {
                setErrorMessage('');
                setIsLoading(false);
                const { userId, token, email, firstName, lastName, isAdmin, isTutor } = response.data;
                ctx.login(userId, token.split(' ')[1], email, firstName, lastName, isAdmin, isTutor);
            })
            .catch(() => {
                setErrorMessage('Failed to log in. Your credentials are invaild.');
                setIsLoading(false);
            });
    }

    return (
        <div className="col-md-4 offset-md-4">
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Login</h5>
                    <form onSubmit={onSubmit}>
                        <div className="form-group mb-3">
                            <label className="form-label">Email Address</label>
                            <input type="email"
                                id="email"
                                className={`form-control ${!formState.email.isValid && formState.email.touched ? 'is-invalid' : ''}`}
                                onChange={e => { dispatch({ type: 'EMAIL_INPUT', value: e.target.value }) }}
                                onBlur={() => { dispatch({ type: 'EMAIL_BLUR' }) }}
                            ></input>
                            {!formState.email.isValid && formState.email.touched && <small className="invalid-feedback form-text">Email address is required.</small>}
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">Password</label>
                            <input type="password"
                                id="password"
                                className={`form-control ${!formState.password.isValid && formState.password.touched ? 'is-invalid' : ''}`}
                                onChange={e => { dispatch({ type: 'PASSWORD_INPUT', value: e.target.value }) }}
                                onBlur={() => { dispatch({ type: 'PASSWORD_BLUR' }) }}
                            ></input>
                            {!formState.password.isValid && formState.password.touched && <small className="invalid-feedback form-text">Password must be at least 6 characters in length.</small>}
                        </div>
                        {isLoading && <div className="text-center">
                            <LoadingSpinner />
                        </div>}
                        {!isLoading && <button disabled={!formState.isValid} type="submit" className="btn btn-success col-12">Login</button>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;