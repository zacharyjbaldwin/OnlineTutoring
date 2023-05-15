import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../shared/context/auth-context';


const TutorProfile =  props => {
    const ctx = useContext(AuthContext);

    const [students, setStudents] = useState([]);
    const [appts, setAppointments] = useState();

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState('');


    useEffect(() => {
     
         setIsLoading(true);
         
            axios.get(`http://localhost:5000/api/appointments?tutorId=${ctx.userId}`, { headers: { Authorization: `Bearer ${ctx.token}` } })
                .then(response => {
                    setAppointments(response.data);
                    console.log(response.data);
                    setError('');
                    setIsLoading(false);
                    console.log(appts)
                    studentData(response.data);
                })
                .catch(error => {
                    setIsLoading(false);
                    setError('Failed to fetch data on this user.');
                });
        
               
    }, [])

   /*
   function studentData(props){
    const idList = props.map((studentid) => //studentid.studentId);
    //console.log(idList)
    //const idList2 = idList.map((ids) => ids);
    //console.log(idList2)
            axios.get(`http://localhost:5000/api/users/${studentid.studentId}`, { headers: { Authorization: `Bearer ${ctx.token}` } })
                .then(response => {
                    setStudents([response.data]);
                    console.log([response.data]);
                    setIsLoading(false);
                })
                .catch(error => {
                    setIsLoading(false);
                    setError('Failed to fetch data on this user.');
                }));
   };
   */
 
   function studentData(props){
    const idList = props.map((studentid) => studentid.studentId);
    const promises = [];
    for (let i in idList) {
    
     
    setIsLoading(true);
            axios.get(`http://localhost:5000/api/users/${idList[i]}`, { headers: { Authorization: `Bearer ${ctx.token}` } })
                .then(response => {

                    
                    students.push(response.data)

                   console.log(students)
                    
                    setIsLoading(false);
                })
                .catch(error => {
                    setIsLoading(false);
                    setError('Failed to fetch data on this user.');
                });}
                
                
   };
   
      
        return (
        <React.Fragment>
        
            <h1> Hello {ctx.firstName} {ctx.lastName}! </h1>
            <h3> Your total tutoring hours: {ctx.hoursTutor}</h3>
            <h3> Your upcoming appointments: </h3>
           <h3>{students?.map((student) => <li key={student._id}> {student.firstName} {student.lastName}</li>)}</h3>
            <h3>Your appointment with { appts?.map(appt => <li key={appt._id}>   {new Date(appt.date).toLocaleDateString() } from: { appt.from} to: {appt.to} </li>)} </h3>
            
        </React.Fragment>
    );
}
export default TutorProfile;
