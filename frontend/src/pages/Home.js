import React, { useState } from 'react';
import '../App.css';
import image from "../images/utd_background.jpg";
import { useHistory } from 'react-router-dom';
import Modal from '../components/TutorList/AvailabilityModal/Modal';

const Home = props => {
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);

    return (
        <React.Fragment>
            {showModal && <Modal onCancel={() => { setShowModal(false); }}>
                <div className='' style={{ overflowY: 'auto' }}>
                    <h4>About</h4>
                    <span>UTutoring Dallas is a web application that allows UTD students to schedule appointments with tutors that also attend UTD.</span>

                    <h4 className='mt-4'>Scheduling Appointments</h4>
                    <span>Once you have signed up as a student, you can view the tutors on the platform. From there, you can schedule an appointment with a tutor by clicking "Schedule an appointment" on his card. You can schedule an appointment with a tutor up to 7 days in advance.</span>

                    <h4 className='mt-4'>Becoming a Tutor</h4>
                    <span>Once you have signed up as student, you will have the option to become a tutor. You'll need to provide a quick summary of yourself, your preferred subjects to teach, and your availability throughout the week. When students schedule appointments with you, you'll receive an email notification.</span>
                </div>
            </Modal>}
            <div className="Home" style={{ backgroundImage: `url(${image})` }}>
                <div className='container box shadow' style={{ marginTop: '32dvh' }}>
                    <div className='row'>
                        <div className='col-md-12'>
                            <h1>UTutoring Dallas</h1>
                            <h2>For UTD students by UTD students</h2>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-4'>
                            <button className='btn btn-warning col-12' onClick={() => { history.push('/signup') }}>Register</button>
                        </div>
                        <div className='col-md-4 mt-1'>
                            <button className='btn btn-warning col-12' onClick={() => { history.push('/login') }}>Login</button>
                        </div>
                        <div className='col-md-4 mt-1'>
                            <button className='btn btn-warning col-12' onClick={() => { setShowModal(true); }}>Learn More</button>
                        </div>

                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Home;