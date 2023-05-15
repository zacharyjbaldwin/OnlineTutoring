import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../shared/context/auth-context";
import axios from "axios";
import LoadingSpinner from '../components/LoadingSpinner';
import TutorCard from '../components/TutorList/TutorCardProfile';

const Profile = props => {

    const ctx = useContext(AuthContext);
    const [user, setUser] = useState();
    const [appointments, setAppointments] = useState();
    const [isLoadingUser, setIsLoadingUser] = useState(false);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState([]);

    const getAppointments = useCallback(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/appointments?${ctx.isTutor ? 'tutorId' : 'studentId'}=${ctx.userId}`, { headers: { Authorization: `Bearer ${ctx.token}` } })
            .then(response => {
                setAppointments(response.data);
                setIsLoadingAppointments(false);
                setError(false);
            })
            .catch(() => {
                setError(true);
            });
    }, [ctx.isTutor, ctx.token, ctx.userId]);

    useEffect(() => {
        setIsLoadingUser(true);
        setIsLoadingAppointments(true);
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${ctx.userId}/favorites`, { headers: { Authorization: `Bearer ${ctx.token}` } });
                const dataArray = response.data; // return the retrieved object
                const promises = dataArray.map(async (input) => {
                    try {
                        const inputResponse = await axios.get(`${process.env.REACT_APP_API_URL}/tutors/${input}`, { headers: { Authorization: `Bearer ${ctx.token}` } });
                        return inputResponse.data;
                    } catch (error) {
                        console.error(error);
                        return null; // return null if there was an error
                    }
                });
                const results = await Promise.all(promises);
                setData(results); // filter out null values
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();


        axios.get(`${process.env.REACT_APP_API_URL}/users/${ctx.userId}`)
            .then(response => {
                setUser(response.data);
                setIsLoadingUser(false);
                setError(false);
            })
            .catch(() => {
                setError(true);
            });

        getAppointments();

        // axios.get(`${process.env.REACT_APP_API_URL}/appointments?${ctx.isTutor ? 'tutorId' : 'studentId'}=${ctx.userId}`, { headers: { Authorization: `Bearer ${ctx.token}` } })
        //     .then(response => {
        //         setAppointments(response.data);
        //         setIsLoadingAppointments(false);
        //         setError(false);
        //     })
        //     .catch(() => {
        //         setError(true);
        //     });
    }, [ctx.token, ctx.userId, ctx.isTutor, getAppointments]);

    const onCancelAppointment = (appointmentId, firstName, lastName) => {
        const cancel = window.confirm(`Are you sure you want to cancel your appointment with ${firstName} ${lastName}?`);
        if (cancel) {
            axios.delete(`${process.env.REACT_APP_API_URL}/appointments/${appointmentId}`, { headers: { Authorization: `Bearer ${ctx.token}` } })
                .then(response => {
                    getAppointments();
                })
                .catch(err => {
                    window.alert('Failed to delete appointment. Please try again later.');
                });
        }
    };

    return (
        <React.Fragment>
            {(isLoadingUser || isLoadingAppointments) && !error && <div className="row">
                <div className="col-md-12 text-center">
                    <LoadingSpinner />
                </div>
            </div>}

            {(isLoadingUser || isLoadingAppointments) && error && <div className="row">
                <div className="col-md-12 text-center">
                    <div className="alert alert-danger">
                        An error occurred. Please try again later.
                    </div>
                </div>
            </div>}

            {/* show this code here if the user is not a tutor */}
            {!isLoadingUser && user && !user.isTutor && !isLoadingAppointments && !error && <div className="row">
                <div className="col-md-3">
                    <h2>Profile</h2>
                    <p>Hello there, {`${user.firstName} ${user.lastName}.`}</p>
                    <p>You've participated in {user.hoursTutor} hours of tutoring.</p>
                    <Link to="/tutorsignup">{user.isTutor ? 'Edit your tutor details' : 'Become a tutor'}</Link>
                </div>
                <div className="col-md-4 mt-3">
                    <h2>Favorite Tutors</h2>
                    {data && data.length > 0 && <div className="list-group">

                        <div className="list-group-item">{data.map((tutor) => <TutorCard tutor={tutor} appointmentConfirmed={() => { getAppointments() }} />)}</div>

                    </div>}
                    {data && data.length === 0 && <span>No favorite tutors.</span>}

                </div>
                <div className="col-md-5 mt-3">
                    <h2>Upcoming Appointments</h2>
                    <div className="list-group">
                        {appointments.length > 0 && <div className="list-group-item">
                            {appointments.length > 0 && appointments.filter(appt => {
                                return new Date(appt.date) >= new Date();
                            }).map(appt => {
                                return <div key={appt.date} className="list-group-item">
                                    <div className="d-flex">
                                        <div className="d-flex justify-content-between" style={{ width: '100%' }}>
                                            <div className="d-flex flex-column">
                                                <strong>Appointment with {appt.tutorId.firstName} {appt.tutorId.lastName}</strong>
                                                <a className="mt-1" href={appt.meeting.url}>Launch Zoom Meeting</a>
                                            </div>
                                            <span className="text-muted">{new Date(appt.date).toLocaleString()}</span>
                                        </div>
                                        {new Date(appt.date) > new Date(new Date().setDate(new Date().getDate() + 1)) && <i onClick={() => { onCancelAppointment(appt._id, appt.tutorId.firstName, appt.tutorId.lastName) }} className="fa-solid fa-times ms-3 cursor-pointer" style={{ color: 'red', fontSize: '24px' }}></i>}
                                    </div>
                                </div>
                            })}
                        </div>}
                        {appointments.length === 0 && <span>No upcoming appointments.</span>}
                    </div>
                </div>
            </div>}

            {/* show this code is the user is a tutor */}
            {!isLoadingUser && user && user.isTutor && !isLoadingAppointments && !error && <div className="row">
                <div className="col-md-6">
                    <h2>Profile</h2>
                    <p>Hello there, {`${user.firstName} ${user.lastName}.`}</p>
                    <p>You've participated in {user.hoursTutor} hours of tutoring.</p>
                    <Link to="/tutorsignup">{user.isTutor ? 'Edit your tutor details' : 'Become a tutor'}</Link>
                </div>
                <div className="col-md-6 mt-3">
                    <h2>Upcoming Appointments</h2>
                    <div className="list-group mt-3">
                        {appointments.length > 0 && <div className="list-group-item">
                            {appointments.length > 0 && appointments.filter(appt => {
                                return new Date(appt.date) >= new Date();
                            }).map(appt => {
                                return <div key={appt.date} className="list-group-item">
                                    <div className="d-flex">
                                        <div className="d-flex justify-content-between" style={{ width: '100%' }}>
                                            <div className="d-flex flex-column">
                                                <strong>Appointment with {appt.studentId.firstName} {appt.studentId.lastName}</strong>
                                                <a className="mt-1" href={appt.meeting.url}>Launch Zoom Meeting</a>
                                            </div>
                                            <span className="text-muted">{new Date(appt.date).toLocaleString()}</span>
                                        </div>
                                        {new Date(appt.date) > new Date(new Date().setDate(new Date().getDate() + 1)) && <i onClick={() => { onCancelAppointment(appt._id, appt.studentId.firstName, appt.studentId.lastName) }} className="fa-solid fa-times ms-3 cursor-pointer" style={{ color: 'red', fontSize: '24px' }}></i>}
                                    </div>
                                </div>
                            })}
                        </div>}
                        {appointments.length === 0 && <span>No upcoming appointments.</span>}
                    </div>
                </div>
            </div>}
        </React.Fragment>
    );
};

export default Profile;