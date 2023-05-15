const AdminTutorCard = props => {
    return (
        <div className="list-group-item">
            <div className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center">
                    <span>{props.tutor.firstName} {props.tutor.lastName} ({props.tutor._id})</span>
                    {/* <i className="fa-regular fa-star"></i> */}
                </div>
                <div className="text-muted">{props.tutor.aboutMe || 'No about me section available.'}</div>
                <div className="text-muted">{props.tutor.email}</div>
                <div className="text-muted">
                    { props.tutor.skills.map(skill => `${skill} `) }
                </div>
                <div className="d-flex mt-2">
                    <button className="btn btn-danger">Delete Tutor</button>
                </div>
            </div>
        </div>
    );
};

export default AdminTutorCard;