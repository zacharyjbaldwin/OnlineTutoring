import axios from "axios";
import { useContext, useReducer, useState } from "react";
import { AuthContext } from "../shared/context/auth-context";

const SUBJECTS_REGEX = /^([A-Z]{2,4}\s[0-9]{4})(,\s?[A-Z]{2,4}\s[0-9]{4})*,?$/;
const AVAILABILITY_REGEX = /^([1-2]?[0-9][A|P]M-[1-2]?[0-9][A|P]M)(,\s?([1-2]?[0-9][A|P]M-[1-2]?[0-9][A|P]M))*,?$/;
const IMAGE_URL_REGEX = /^https?:\/\/.*[jpg|png|jpeg|JPG|PNG|JPEG]$/;
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formReducer = (state, action) => {
    switch (action.type) {
        case 'ABOUTME_INPUT':
            return {
                ...state,
                aboutme: {
                    value: action.value,
                    isValid: action.value.length > 0,
                    touched: true
                },
                isValid: action.value.length > 0
                    && state.subjects.isValid
                    && state.monday.isValid
                    && state.tuesday.isValid
                    && state.wednesday.isValid
                    && state.thursday.isValid
                    && state.friday.isValid
                    && state.saturday.isValid
                    && state.sunday.isValid 
                    && state.imgUrl.isValid
            }
        case 'ABOUTME_BLUR':
            return {
                ...state,
                aboutme: { ...state.aboutme, touched: true }
            }
        case 'SUBJECTS_INPUT':
            return {
                ...state,
                subjects: {
                    value: action.value,
                    isValid: SUBJECTS_REGEX.test(action.value.trim()),
                    touched: true
                },
                isValid: state.aboutme.isValid
                    && (SUBJECTS_REGEX.test(action.value.trim()) || action.value === '')
                    && state.monday.isValid
                    && state.tuesday.isValid
                    && state.wednesday.isValid
                    && state.thursday.isValid
                    && state.friday.isValid
                    && state.saturday.isValid
                    && state.sunday.isValid 
                    && state.imgUrl.isValid
            }
        case 'SUBJECTS_BLUR':
            return {
                ...state,
                subjects: { ...state.subjects, touched: true }
            }

        case 'MONDAY_INPUT':
            return {
                ...state,
                monday: {
                    value: action.value,
                    isValid: action.value === '' || AVAILABILITY_REGEX.test(action.value.trim()),
                    touched: true
                },
                isValid: state.aboutme.isValid
                    && state.subjects.isValid
                    && (AVAILABILITY_REGEX.test(action.value.trim()) || action.value === '')
                    && state.tuesday.isValid
                    && state.wednesday.isValid
                    && state.thursday.isValid
                    && state.friday.isValid
                    && state.saturday.isValid
                    && state.sunday.isValid 
                    && state.imgUrl.isValid
            }
        case 'MONDAY_BLUR':
            return {
                ...state,
                monday: { ...state.monday, touched: true }
            }

        case 'TUESDAY_INPUT':
            return {
                ...state,
                tuesday: {
                    value: action.value,
                    isValid: action.value === '' || AVAILABILITY_REGEX.test(action.value.trim()),
                    touched: true
                },
                isValid: state.aboutme.isValid
                    && state.subjects.isValid
                    && state.monday.isValid
                    && (AVAILABILITY_REGEX.test(action.value.trim()) || action.value === '')
                    && state.wednesday.isValid
                    && state.thursday.isValid
                    && state.friday.isValid
                    && state.saturday.isValid
                    && state.sunday.isValid 
                    && state.imgUrl.isValid
            }
        case 'TUESDAY_BLUR':
            return {
                ...state,
                tuesday: { ...state.tuesday, touched: true }
            }

        case 'WEDNESDAY_INPUT':
            return {
                ...state,
                wednesday: {
                    value: action.value,
                    isValid: action.value === '' || AVAILABILITY_REGEX.test(action.value.trim()),
                    touched: true
                },
                isValid: state.aboutme.isValid
                    && state.subjects.isValid
                    && state.monday.isValid
                    && state.tuesday.isValid
                    && (AVAILABILITY_REGEX.test(action.value.trim()) || action.value === '')
                    && state.thursday.isValid
                    && state.friday.isValid
                    && state.saturday.isValid
                    && state.sunday.isValid 
                    && state.imgUrl.isValid
            }
        case 'WEDNESDAY_BLUR':
            return {
                ...state,
                wednesday: { ...state.wednesday, touched: true }
            }
        case 'THURSDAY_INPUT':
            return {
                ...state,
                thursday: {
                    value: action.value,
                    isValid: action.value === '' || AVAILABILITY_REGEX.test(action.value.trim()),
                    touched: true
                },
                isValid: state.aboutme.isValid
                    && state.subjects.isValid
                    && state.monday.isValid
                    && state.tuesday.isValid
                    && state.wednesday.isValid
                    && (AVAILABILITY_REGEX.test(action.value.trim()) || action.value === '')
                    && state.friday.isValid
                    && state.saturday.isValid
                    && state.sunday.isValid 
                    && state.imgUrl.isValid
            }
        case 'THURSDAY_BLUR':
            return {
                ...state,
                thursday: { ...state.thursday, touched: true }
            }
        case 'FRIDAY_INPUT':
            return {
                ...state,
                friday: {
                    value: action.value,
                    isValid: action.value === '' || AVAILABILITY_REGEX.test(action.value.trim()),
                    touched: true
                },
                isValid: state.aboutme.isValid
                    && state.subjects.isValid
                    && state.monday.isValid
                    && state.tuesday.isValid
                    && state.wednesday.isValid
                    && state.thursday.isValid
                    && (AVAILABILITY_REGEX.test(action.value.trim()) || action.value === '')
                    && state.saturday.isValid
                    && state.sunday.isValid 
                    && state.imgUrl.isValid
            }
        case 'FRIDAY_BLUR':
            return {
                ...state,
                friday: { ...state.friday, touched: true }
            }
        case 'SATURDAY_INPUT':
            return {
                ...state,
                saturday: {
                    value: action.value,
                    isValid: action.value === '' || AVAILABILITY_REGEX.test(action.value.trim()),
                    touched: true
                },
                isValid: state.aboutme.isValid
                    && state.subjects.isValid
                    && state.monday.isValid
                    && state.tuesday.isValid
                    && state.wednesday.isValid
                    && state.thursday.isValid
                    && state.friday.isValid
                    && (AVAILABILITY_REGEX.test(action.value.trim()) || action.value === '')
                    && state.sunday.isValid
                    && state.imgUrl.isValid
            }
        case 'SATURDAY_BLUR':
            return {
                ...state,
                saturday: { ...state.saturday, touched: true }
            }
        case 'SUNDAY_INPUT':
            return {
                ...state,
                sunday: {
                    value: action.value,
                    isValid: action.value === '' || AVAILABILITY_REGEX.test(action.value.trim()),
                    touched: true
                },
                isValid: state.aboutme.isValid
                    && state.subjects.isValid
                    && state.monday.isValid
                    && state.tuesday.isValid
                    && state.wednesday.isValid
                    && state.thursday.isValid
                    && state.friday.isValid
                    && state.saturday.isValid 
                    && (AVAILABILITY_REGEX.test(action.value.trim()) || action.value === '')
                    && state.imgUrl.isValid
            }
        case 'SUNDAY_BLUR':
            return {
                ...state,
                sunday: { ...state.sunday, touched: true }
            }
        
        case 'IMG_URL_INPUT':
            return {
                ...state,
                imgUrl: {
                    value: action.value,
                    isValid: IMAGE_URL_REGEX.test(action.value.trim()),
                    touched: true
                },
                isValid: state.aboutme.isValid
                    && state.subjects.isValid
                    && state.monday.isValid
                    && state.tuesday.isValid
                    && state.wednesday.isValid
                    && state.thursday.isValid
                    && state.friday.isValid
                    && state.saturday.isValid 
                    && state.sunday.isValid 
                    && IMAGE_URL_REGEX.test(action.value.trim())
            }
        case 'IMG_URL_BLUR':
            return {
                ...state,
                imgUrl: { ...state.imgUrl, touched: true }
            }

        default: return state;
    }
};

const TutorSignup = props => {

    const ctx = useContext(AuthContext);
    const [error, setError] = useState(false);

    const [formState, dispatch] = useReducer(formReducer, {
        aboutme: {
            value: '',
            isValid: false,
            touched: false
        },
        subjects: {
            value: '',
            isValid: false,
            touched: false
        },
        sunday: {
            value: '',
            isValid: true,
            touched: false
        },
        monday: {
            value: '',
            isValid: true,
            touched: false
        },
        tuesday: {
            value: '',
            isValid: true,
            touched: false
        },
        wednesday: {
            value: '',
            isValid: true,
            touched: false
        },
        thursday: {
            value: '',
            isValid: true,
            touched: false
        },
        friday: {
            value: '',
            isValid: true,
            touched: false
        },
        saturday: {
            value: '',
            isValid: true,
            touched: false
        },
        imgUrl: {
            value: '',
            isValid: false,
            touched: false
        },
        isValid: false
    });

    const generateAvailabilityFields = () => {
        let fields = [];
        for (let day of DAYS) {
            fields.push(
                <div className="row mb-1" key={day.toLowerCase()}>
                    <div className="col-md-2 d-flex align-items-center">
                        <span>{day}</span>
                    </div>
                    <div className="col-md-10">
                    <input type="text"
                        id={`ava${day}`}
                        className={`form-control ${!formState[day.toLowerCase()].isValid && formState[day.toLowerCase()].touched ? 'is-invalid' : ''}`}
                        onChange={e => { dispatch({ type: `${day.toUpperCase()}_INPUT`, value: e.target.value }) }}
                        onBlur={() => { dispatch({ type: `${day.toUpperCase()}_BLUR` }) }}
                        ></input>
                        {!formState[day.toLowerCase()].isValid && formState[day.toLowerCase()].touched && <small className="invalid-feedback form-text">Please use the format provided above.</small>}
                    </div>
                </div>
            );
        }
        return fields;
    }

    const mapRange = (range) => {
        let returnRange = [];
        let startTime;
        let endTime;
        if (range === '') return null;

        const startTimeRaw = range.split('-')[0];
        if (startTimeRaw === '12AM') {
            startTime = 0;
        } else if (startTimeRaw === '12PM') {
            startTime = 12;
        } else {
            startTime = startTimeRaw.length === 4 ? +startTimeRaw.substring(0, 2) : +startTimeRaw.substring(0, 1);
            if (startTimeRaw.includes('PM')) startTime += 12;
        }

        const endTimeRaw = range.split('-')[1];
        if (endTimeRaw === '12AM') {
            endTime = 24;
        } else if (endTimeRaw === '12PM') {
            endTime = 12;
        } else {
            endTime = endTimeRaw.length === 4 ? +endTimeRaw.substring(0, 2) : +endTimeRaw.substring(0, 1);
            if (endTimeRaw.includes('PM')) endTime += 12;
        }

        if (startTime < 0 || startTime > 23) return null;
        if (endTime < 1 || endTime > 24) return null;
        if (startTime === endTime) return null;
        if (startTime > endTime) return null;

        for (let i = startTime; i < endTime; i++) {
            returnRange.push({
                from: i,
                to: i + 1
            });
        }

        return returnRange;
    };

    const onSubmit = e => {
        e.preventDefault();

        const reqBody = {
            aboutMe: formState.aboutme.value,
            skills: formState.subjects.value.split(',').map(s => s.trim()).filter(s => s !== ''),
            availability: {
                sunday: formState.sunday.value.split(',').map(range => mapRange(range)).filter(r => r !== null).flat(),
                monday: formState.monday.value.split(',').map(range => mapRange(range)).filter(r => r !== null).flat(),
                tuesday: formState.tuesday.value.split(',').map(range => mapRange(range)).filter(r => r !== null).flat(),
                wednesday: formState.wednesday.value.split(',').map(range => mapRange(range)).filter(r => r !== null).flat(),
                thursday: formState.thursday.value.split(',').map(range => mapRange(range)).filter(r => r !== null).flat(),
                friday: formState.friday.value.split(',').map(range => mapRange(range)).filter(r => r !== null).flat(),
                saturday: formState.saturday.value.split(',').map(range => mapRange(range)).filter(r => r !== null).flat()
            },
            profilePictureUrl: formState.imgUrl.value
        }

        axios.patch(`${process.env.REACT_APP_API_URL}/users`, reqBody, { headers: { Authorization: `Bearer ${ctx.token}` } })
            .then(response => {
                ctx.logout();
            })
            .catch(error => {
                setError(true);
            });
    }

    return (
        <div className="col-md-6 offset-md-3 mb-3">
            {error && <div className="alert alert-danger">An error occurred. Please try again.</div>}
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{ctx.isTutor ? 'Edit your details' : 'Tutor signup'}</h5>
                    <form onSubmit={onSubmit}>
                        <div className="form-group mb-3">
                            <label className="form-label">Please describe yourself</label>
                            <textarea type="aboutme"
                                id="aboutme"
                                rows="3"
                                className={`form-control ${!formState.aboutme.isValid && formState.aboutme.touched ? 'is-invalid' : ''}`}
                                onChange={e => { dispatch({ type: 'ABOUTME_INPUT', value: e.target.value }) }}
                                onBlur={() => { dispatch({ type: 'ABOUTME_BLUR' }) }}
                                ></textarea>
                            {!formState.aboutme.isValid && formState.aboutme.touched && <small className="invalid-feedback form-text">The about me section is required.</small>}
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">Please list the subject(s) you'd like to teach, seperated by commas </label>
                            <input type="text"
                                id="subjects"
                                className={`form-control ${!formState.subjects.isValid && formState.subjects.touched ? 'is-invalid' : ''}`}
                                onChange={e => { dispatch({ type: 'SUBJECTS_INPUT', value: e.target.value }) }}
                                onBlur={() => { dispatch({ type: 'SUBJECTS_BLUR' }) }}
                                ></input>
                            <small className="form-text">Please use this format: SUBJ #### (e.g., "CS 2305, MATH 2414, BIOL 1350")</small>
                            {!formState.subjects.isValid && formState.subjects.touched && <small className="invalid-feedback form-text">Please use the format provided above.</small>}
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">Please enter your time availabilty separated by commas (e.g., "11AM-1PM, 3PM-4PM")</label>
                            {generateAvailabilityFields()}
                            <small className="form-text">If you do not set any availability, you will not appear in the tutor list.</small>                      
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">Enter a url to your profile picture (must end in .png, .jpg, or .jpeg)</label>
                            <input type="text"
                                id="img"
                                className={`form-control ${!formState.imgUrl.isValid && formState.imgUrl.touched ? 'is-invalid' : ''}`}
                                onChange={e => { dispatch({ type: 'IMG_URL_INPUT', value: e.target.value }) }}
                                onBlur={() => { dispatch({ type: 'IMG_URL_BLUR' }) }}
                                accept="image/*"
                                ></input>
                            {!formState.imgUrl.isValid && formState.imgUrl.touched && <small className="invalid-feedback form-text">The profile picture is required.</small>}
                        </div>
                        <strong style={{color: 'red'}}>Note: Once you {ctx.isTutor ? 'apply changes' : 'sign up as a tutor'}, you will be logged out and must log in again.</strong>
                        <button disabled={!formState.isValid} type="submit" className="btn btn-success col-12 mt-2">{ctx.isTutor ? 'Apply changes' : 'Sign up'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TutorSignup;