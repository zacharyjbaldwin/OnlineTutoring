import axios from "axios";
import { useReducer, useState } from "react";
import { useHistory } from 'react-router-dom';
import LoadingSpinner from "../components/LoadingSpinner";

const EMAIL_REGEX = /^[A-Za-z0-9\.]+@[A-Za-z0-9\.]+$/; // eslint-disable-line
const FULLNAME =  /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/;

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
        case 'FULLNAME_INPUT':
            return {
              ...state,
              fullname: {
                  value: action.value,
                  isValid: action.value.match(FULLNAME) !== null,
                  touched: true
              },
              isValid: action.value.match(FULLNAME) !== null && state.email.isValid && state.password.isValid 
            }
        case 'FULLNAME_BLUR':
            return {
                ...state,
                fullname: { ...state.fullname, touched: true }
            }
        default: return state;
    }
};

const SignUp = props => {
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    // initial states
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
        fullname: {
          value: '',
          isValid: false,
          touched: false
        },
        isValid: false
    });

    const onSubmit = e => {
        e.preventDefault();
        setIsLoading(true);
        const reqBody = {
            email: formState.email.value,
            password: formState.password.value,
            password2: formState.password.value,
            firstName: formState.fullname.value.split(' ')[0],
            lastName: formState.fullname.value.split(' ')[1],
        }; 
        axios.post(`${process.env.REACT_APP_API_URL}/register`, reqBody)
            .then(() => {
                history.push('/login');
                setIsLoading(false);
            })
            .catch(error => {
                if (error.response.data.email === 'Email already exists') {
                    setErrorMessage('That email is already in use.');
                } else {
                    setErrorMessage('An unknown error occurred.');
                }
                setIsLoading(false);
            });
    }

    return (
        <div className="col-md-4 offset-md-4">
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Registration</h5>
                    <form onSubmit={onSubmit}>

                        <div className="form-group mb-3">
                            <label className="form-label">Full Name</label>
                            <input type="fullname"
                                id="fullname"
                                className={`form-control ${!formState.fullname.isValid && formState.fullname.touched ? 'is-invalid' : ''}`}
                                onChange={e => { dispatch({ type: 'FULLNAME_INPUT', value: e.target.value }) }}
                                onBlur={() => { dispatch({ type: 'FULLNAME_BLUR' }) }}
                                ></input>
                            {!formState.fullname.isValid && formState.fullname.touched && <small className="invalid-feedback form-text">Full name is required.</small>}
                        </div>

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
                        {!isLoading && <button disabled={!formState.isValid} type="submit" className="btn btn-success col-12">Register</button>}
                    </form>
                </div>
            </div>
        </div>
    );
};


  
export default SignUp;