import React, { useState, useEffect } from 'react';
import { studentService } from '../../utils/studentService';
import NavBar from '../../components/NavBar/NavBar';
const AdmissionRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const result = await studentService.getPendingRequests();
            
            if (result.success) {
                setRequests(result.data);
            } else {
                console.error(result.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRequests(); }, []);

    const handleApprove = async (studentId) => {
        if(!window.confirm("Approve this student? They will be able to login.")) return;
        try {
            const result = await studentService.approveAdmission(studentId);
            if (!result.success) throw new Error(result.error);
            alert(result.message);
            fetchRequests(); // Refresh list
        } catch (error) {
            alert(`Failed to approve: ${error.message}`);
        }
    };

    const handleReject = async (studentId) => {
        if(!window.confirm("Reject and delete this application?")) return;
        try {
            const result = await studentService.deleteStudent(studentId);
            if (!result.success) throw new Error(result.error);
            alert(result.message);
            fetchRequests();
        } catch (error) {
            alert(`Failed to reject: ${error.message}`);
        }
    };

    return (
        <div className="admission-dashboard">
            <NavBar />
            <div className="container">
                <h2>Pending Admission Requests</h2>
                {loading ? <p>Loading...</p> : (
                    <table className="request-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Class</th>
                                <th>Mobile</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(student => (
                                <tr key={student._id}>
                                    <td>{student.userId?.name}</td>
                                    <td>{student.classGrade}</td>
                                    <td>{student.userId?.mobile}</td>
                                    <td>
                                        <button className="btn-approve" onClick={() => handleApprove(student._id)}>Accept</button>
                                        <button className="btn-reject" onClick={() => handleReject(student._id)}>Reject</button>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && <tr><td colSpan="4">No pending requests.</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdmissionRequests;