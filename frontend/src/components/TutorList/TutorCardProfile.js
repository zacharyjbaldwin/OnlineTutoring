import React, { useContext, useEffect, useState } from 'react';
import Modal from './AvailabilityModal/Modal';
import LoadingSpinner from '../LoadingSpinner';
// import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../shared/context/auth-context';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIMEMAP = [
    '12AM',
    '1AM',
    '2AM',
    '3AM',
    '4AM',
    '5AM',
    '6AM',
    '7AM',
    '8AM',
    '9AM',
    '10AM',
    '11AM',
    '12PM',
    '1PM',
    '2PM',
    '3PM',
    '4PM',
    '5PM',
    '6PM',
    '7PM',
    '8PM',
    '9PM',
    '10PM',
    '11PM',
    '12AM',
];

const TutorCard = props => {

    const ctx = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tutor, setTutor] = useState();
    const [error, setError] = useState('');
    const [confirmation, setConfirmation] = useState();
    const [isFavorite, setIsFavorite] = useState(true);
    // const history = useHistory();

    const onFavorite = () => {
        // alert('501 not implemented - (.../frontend/components/TutorList/TutorCard.js)');
        axios.post(`${process.env.REACT_APP_API_URL}/favorites/${props.tutor._id}`, {}, { headers: { Authorization: `Bearer ${ctx.token}` } })
            .then(response => {
                setIsFavorite(response.data);
            })
            .catch(() => { /* do nothing */ });
    };

    useEffect(() => {
        if (showModal) {
            setIsLoading(true);
            setSelected(false);
            axios.get(`${process.env.REACT_APP_API_URL}/tutors/${props.tutor._id}`, { headers: { Authorization: `Bearer ${ctx.token}` } })
                .then(response => {
                    setTutor(response.data);
                    setError('');
                    setIsLoading(false);
                    setConfirmation();
                })
                .catch(error => {
                    setIsLoading(false);
                    setError('Failed to fetch data on this tutor. Please try again later.');
                });
        }
    }, [showModal, props.tutor._id, ctx.token])

    const onConfirmAppointment = () => {
        setIsLoading(true);
        const apptSettings = {
            tutorId: tutor._id,
            userId: ctx.userId,
            date: new Date(new Date(selected.split('-')[0]).setHours(+selected.split('-')[1], 0, 0, 0)),
            from: +selected.split('-')[1],
            to: +selected.split('-')[2]
        };

        axios.post(`${process.env.REACT_APP_API_URL}/appointments`, apptSettings, { headers: { Authorization: `Bearer ${ctx.token}` } })
            .then(response => {
                setConfirmation({
                    from: response.data.from,
                    to: response.data.to,
                    date: response.data.date
                });
                setIsLoading(false);
                setError('');
                props.appointmentConfirmed();
            })
            .catch(err => {
                setIsLoading(false);
                if (err.response.data.code === 'SCHEDULE_CONFLICT') {
                    setError('That time slot is not available. Please select another time.');
                }
            });
    };

    const onClickCheck = (e) => {
        setSelected(e.target.value);
    }

    const generateTableHeaders = () => {
        let headers = [];
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        const todayIndex = today.getDay();
        let prevDate = today;
        for (let i = todayIndex; i < todayIndex + 7; i++) {
            headers.push(<th style={{ fontSize: '14px', whiteSpace: 'nowrap' }} key={i}>{WEEKDAYS[i % 7] + (i === todayIndex ? ' (today)' : ` (${(new Date(today.setDate(prevDate.getDate()))).toLocaleDateString()})`)}</th>);
            prevDate = new Date(today.setDate(prevDate.getDate() + 1));
        }
        return headers;
    };

    const generateTableData = () => {
        let cols = [];
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        const todayIndex = today.getDay();
        let prevDate = today;
        for (let i = todayIndex; i < todayIndex + 7; i++) {
            const day = WEEKDAYS[i % 7].toLowerCase();
            cols.push(
                <td key={day} style={{whiteSpace: 'nowrap'}}>
                    {/* eslint-disable-next-line */}
                    {tutor.availability[day].length > 0 && tutor.availability[day].map(appt => {
                        let dateString = prevDate.toLocaleDateString();
                        let value = `${dateString}-${appt.from}-${appt.to}`;
                        return (
                            <div key={Math.random()} className="form-check">
                                <input className="form-check-input" type="radio" checked={value === selected} value={value} name="selectedDate" onChange={onClickCheck} />
                                <label className="form-check-label" htmlFor="selectedDate" style={{ fontSize: '14px' }}>
                                    {TIMEMAP[appt.from]} to {TIMEMAP[appt.to]}
                                </label>
                            </div>
                        );
                    })}
                    {tutor.availability[day].length === 0 && <span>No times available.</span>}
                </td>
            );
            prevDate = new Date(today.setDate(prevDate.getDate() + 1)); //eslist-disable-line
        }
        return cols;
    };

    return (
        <React.Fragment>
            {showModal && <Modal onCancel={() => { setShowModal(false); setSelected(false); }}>
                {confirmation && <div className='row text-center'>
                    <h3>Your appointment on {new Date(confirmation.date).toLocaleDateString()} at {TIMEMAP[confirmation.from]} has been confirmed!</h3>
                    <h5 className='text-muted'>You will recieve an email notification shortly.</h5>
                    <div className='row mt-3'>
                        <div className='col-md'>
                            <button className='btn btn-success col-12 mt-1' onClick={() => { setShowModal(false); }}>Close</button>
                        </div>
                    </div>

                </div>}
                {!confirmation && <div>
                    <div className='row'>
                        <div className='col-md-12'>
                            <h5>Available appointments for {props.tutor.firstName} {props.tutor.lastName} for the next 7 days</h5>
                        </div>
                    </div>
                    <div className='row'>
                        {isLoading && <div className='text-center'><LoadingSpinner /><p>This may take a moment...</p></div>}
                        {!isLoading && error && <div className='alert alert-danger'>{error}</div>}
                        {!isLoading && tutor && <div style={{overflowX: 'auto'}}><form><table className='table'>
                            <thead>
                                <tr>
                                    {generateTableHeaders()}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {generateTableData()}
                                </tr>
                            </tbody>
                        </table></form></div>}
                    </div>
                    <div className='row'>
                        <div className='col-md-6'>
                            <button className='btn btn-warning col-12 mb-1' disabled={isLoading} onClick={() => { setShowModal(false); }}>Cancel</button>
                        </div>
                        <div className='col-md-6'>
                            <button className='btn btn-success col-12' onClick={onConfirmAppointment} disabled={!selected || isLoading}>Confirm Appointment</button>
                        </div>
                    </div>
                </div>}
            </Modal>}
            <div className="card shadow" style={{ height: '100%' }}>
                
                <div className="card-body d-flex flex-column justify-content-between">
                    <div className="d-flex flex-column mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="card-title">{props.tutor.firstName} {props.tutor.lastName}</h5>
                            <i className={`fa-star ${isFavorite ? 'fa-solid' : 'fa-regular'}`} style={{ fontSize: '20px', cursor: 'pointer', color: isFavorite ? '#BF5700' : 'inherit' }} onClick={onFavorite}></i>
                        </div>
                        <span className="text-muted mb-1">{props.tutor.aboutMe}</span>
                        <span className="text-muted mb-1">
                            <strong>Skills:</strong> {props.tutor.skills.join(', ')}
                        </span>
                    </div>
                    <button className="btn btn-success col-12" onClick={() => { setShowModal(true); }}>Schedule an appointment</button>
                </div>
            </div>
        </React.Fragment>
    );
};

export default TutorCard;
