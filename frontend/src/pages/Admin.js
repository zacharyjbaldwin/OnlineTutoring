import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminTutorCard from "../components/Admin/AdminTutorCard";

const Admin = (req, res) => {

    const [loading, setLoading] = useState(false);
    const [tutors, setTutors] = useState();

    useEffect(() => {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_URL}/tutors`).then(response => {
            setTutors(response.data.tutors);
            setLoading(false);
        })
    }, []);
    
    return (
        <React.Fragment>
            <h2>Admin panel</h2>
            {loading && <span>Loading...</span>}
            <ul className="list-group">
                {tutors && tutors.length > 0 && tutors.map(tutor => <AdminTutorCard key={tutor._id} tutor={tutor}/>)}
            </ul>
        </React.Fragment>
    );
};

export default Admin;