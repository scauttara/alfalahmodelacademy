import React, { useState, useEffect } from "react";
import { api } from "../utils/api.js";
import "./CreateStudent.scss";
import NavBar from "../components/NavBar/NavBar.jsx";
import { InitialStudentForm, ClassLabels, ClassOptions } from '../utils/studentConstants.js'

// Added props for Reusability
const CreateStudent = ({ studentToEdit = null, onClose = null, onSuccess = null }) => {
    const [formData, setFormData] = useState(InitialStudentForm);
    const [batchCategory, setBatchCategory] = useState("");
    const [message, setMessage] = useState("");
    const [statusType, setStatusType] = useState("");

    // 1. Detect Edit Mode & Populate Data
    useEffect(() => {
        if (studentToEdit) {
            // Map the nested object (from ListAllStudents) to flat form structure
            const mappedData = {
                ...InitialStudentForm, // defaults
                ...studentToEdit,      // student fields
                // Flatten User fields
                name: studentToEdit.userId?.name || "",
                mobile: studentToEdit.userId?.mobile || "",
                email: studentToEdit.userId?.email || "",
            };
            setFormData(mappedData);

            // Auto-select the Batch Category based on the classGrade
            const foundBatch = Object.keys(ClassOptions).find(key => 
                ClassOptions[key].includes(studentToEdit.classGrade)
            );
            if (foundBatch) {
                setBatchCategory(foundBatch.charAt(0).toUpperCase() + foundBatch.slice(1));
            }
        }
    }, [studentToEdit]);

    const getClassOptions = () => {
        const key = batchCategory ? batchCategory.toLowerCase() : "";
        return ClassOptions[key] || [];
    };

    const handleBatchChange = (e) => {
        setBatchCategory(e.target.value);
        setFormData((prev) => ({ ...prev, classGrade: "" }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === "checkbox" ? checked : value;
        
        setFormData((prev) => {
            const newData = { ...prev, [name]: inputValue };
            // Logic for Groups
            if (name === "classGrade") {
                const groupClasses = ["9", "10", "11", "12"];
                if (!groupClasses.includes(value)) newData.group = "N/A";
            }
            // Logic for Transport
            if (name === "residentialStatus" && value !== "Day-Care") {
                newData.isUsingTransport = false;
            }
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Processing...");
        setStatusType("info");

        try {
            let response;
            
            // 2. Logic Switch: Create vs Update
            if (studentToEdit) {
                // UPDATE EXISTING
                response = await api.put(`api/students/update/${studentToEdit._id}`, formData);
            } else {
                // CREATE NEW
                response = await api.post("api/students/create", formData);
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Operation failed");
            }

            setMessage(studentToEdit ? "Updated Successfully!" : `Success! Student ${data.user.name} created.`);
            setStatusType("success");

            if (studentToEdit) {
                // If in modal mode, notify parent and close after a delay
                if (onSuccess) onSuccess(); 
                setTimeout(() => { if (onClose) onClose(); }, 1500);
            } else {
                // If in create mode, just reset
                setFormData(InitialStudentForm);
                setBatchCategory("");
            }

        } catch (error) {
            setMessage(`Error: ${error.message}`);
            setStatusType("error");
            console.error(error);
        }
    };

    const showGroupOptions = ["9", "10", "11", "12"].includes(formData.classGrade);

    // 3. Conditional Layout (Is this a page or a modal?)
    const isModal = !!studentToEdit; 

    return (
        <div className={isModal ? "create-student-modal-content" : "create-user"}>
            {!isModal && <NavBar />} {/* Hide NavBar if inside a modal */}
            
            <div className="header-row" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h2>{isModal ? "Edit Student Profile" : "Register New Student"}</h2>
                {isModal && <button type="button" onClick={onClose} style={{background:'red', padding:'5px 10px'}}>X</button>}
            </div>

            {message && <p className={`message ${statusType}`}>{message}</p>}

            <form
                onSubmit={handleSubmit}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
            >
                {/* --- Left Column: Basic User Info --- */}
                <div className="column">
                    <h3>Basic Information</h3>
                    <div className="form-group">
                        <label>Student Name (English) *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Mobile No. (Login ID) *</label>
                        <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
                    </div>

                    <h4>Personal Information</h4>
                    <div className="form-group">
                        <label>শিক্ষার্থীর নাম (বাংলা)</label>
                        <input type="text" name="nameBN" value={formData.nameBN} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Email (Optional)</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Father's Name</label>
                        <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>বাবার নাম (বাংলা)</label>
                        <input type="text" name="fatherNameBN" value={formData.fatherNameBN} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Mother's Name</label>
                        <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>মায়ের নাম (বাংলা)</label>
                        <input type="text" name="motherNameBN" value={formData.motherNameBN} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Religion</label>
                        <select name="religion" value={formData.religion} onChange={handleChange} required>
                            <option value="">Select Religion</option>
                            <option value="Islam">Islam</option>
                            <option value="Hinduism">Hinduism</option>
                            <option value="Christianity">Christianity</option>
                            <option value="Buddhism">Buddhism</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                {/* --- Right Column: Academic Info --- */}
                <div className="column">
                    <h3>Academic Profile</h3>
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Birth Certificate No.</label>
                        <input type="text" name="birthCertificateNo" value={formData.birthCertificateNo} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                         <label>Father's NID</label>
                        <input type="text" name="fatherNID" value={formData.fatherNID} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Mother's NID</label>
                        <input type="text" name="motherNID" value={formData.motherNID} onChange={handleChange} />
                    </div>

                    {/* Batch Selection */}
                    <div className="form-group" style={{ background: "#f8f9fa", padding: "10px", borderRadius: "5px", marginBottom: "15px" }}>
                        <label style={{ marginBottom: "5px", display: "block", fontWeight: "bold" }}>Select Batch</label>
                        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                            {Object.keys(ClassOptions).map(cat => (
                                <label key={cat} style={{ cursor: "pointer", textTransform: 'capitalize' }}>
                                    <input type="radio" name="batchCat" value={cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        checked={batchCategory.toLowerCase() === cat.toLowerCase()}
                                        onChange={handleBatchChange} />{""}
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Class *</label>
                        <select name="classGrade" value={formData.classGrade} onChange={handleChange} required disabled={!batchCategory} style={{ backgroundColor: !batchCategory ? "#f0f0f0" : "white" }}>
                            <option value="">{!batchCategory ? "Select Batch First" : "Select Class"}</option>
                            {getClassOptions().map((cls) => (
                                <option key={cls} value={cls}>{ClassLabels[cls]}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Version *</label>
                        <select name="version" value={formData.version} onChange={handleChange} required>
                            <option value="">Select Version</option>
                            <option value="Bangla">Bangla</option>
                            <option value="English">English</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Group</label>
                        <select name="group" value={formData.group} onChange={handleChange} disabled={!showGroupOptions} style={{ backgroundColor: !showGroupOptions ? "#f0f0f0" : "white" }}>
                            {showGroupOptions ? (
                                <>
                                    <option value="">Select Group</option>
                                    <option value="Science">Science</option>
                                    <option value="Commerce">Commerce</option>
                                    <option value="Arts">Arts</option>
                                </>
                            ) : (<option value="N/A">N/A (General)</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Residential Status</label>
                        <select name="residentialStatus" value={formData.residentialStatus} onChange={handleChange}>
                            <option value="">Select Status</option>
                            <option value="Non-Residential">Non-Residential</option>
                            <option value="Residential">Residential</option>
                            <option value="Day-Care">Day-Care</option>
                        </select>
                    </div>
                    {formData.residentialStatus === "Day-Care" && (
                        <div className="form-group">
                            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                                <input type="checkbox" name="isUsingTransport" checked={formData.isUsingTransport} onChange={handleChange} style={{ width: "20px", height: "20px" }} />
                                <span>Request School Transport?</span>
                            </label>
                        </div>
                    )}
                </div>

                <button type="submit" style={{ gridColumn: "span 2", marginTop: "10px" }}>
                    {isModal ? "Update Profile" : "Create Student Profile"}
                </button>
            </form>
        </div>
    );
};

export default CreateStudent;