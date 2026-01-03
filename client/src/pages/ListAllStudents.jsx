import React, { useState, useEffect, useMemo } from "react";
import "./ListAllStudents.scss";

import {
    InitialStudentForm,
    GenderOptions,
    ClassLabels,
    ClassOptions,
    StudentTableColumns,
} from "../utils/studentConstants.js";
import { api } from "../utils/api";
import NavBar from "../components/NavBar";

export default function ListAllStudents() {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [filters, setFilters] = useState({
        batchCategory: "",
        classGrade: "",
        version: "",
        group: "",
        gender: "",
        religion: "",
        residentialStatus: "",
        isUsingTransport: "",
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            // Text Search

            const query = searchTerm.toLowerCase().trim();

            const matchesSearch =
                !query ||
                [
                    student.userId?.name,
                    student.userId?.email,
                    student.userId?.mobile,
                    student.nameBN,
                    student.fatherName,
                    student.fatherNameBN,
                    student.motherName,
                    student.motherNameBN,
                ].some((field) => field?.toLowerCase().includes(query));

            // Drop-down filters
            // Batch Filter Logic
            let matchesBatch = true;
            if (filters.batchCategory) {
                const allowedClasses = ClassOptions[filters.batchCategory] || [];
                matchesBatch = allowedClasses.includes(student.classGrade);
            }
            // Other Filters
            const matchesClass = filters.classGrade
                ? student.classGrade === filters.classGrade
                : true;
            const matchesVersion = filters.version
                ? student.version === filters.version
                : true;
            const matchesGroup = filters.group
                ? student.group === filters.group
                : true;
            const matchesGender = filters.gender
                ? student.gender === filters.gender
                : true;
            const matchesReligion = filters.religion
                ? student.religion === filters.religion
                : true;
            const matchesResidentialStatus = filters.residentialStatus
                ? student.residentialStatus === filters.residentialStatus
                : true;

            // Transport Boolean Conversion
            let matchesTransport = true;
            if (filters.isUsingTransport !== "") {
                const isTrue = filters.isUsingTransport === "true";
                matchesTransport = student.isUsingTransport === isTrue;
            }

            // Match both Drop-Down and Search

            return (
                matchesSearch &&
                matchesBatch &&
                matchesClass &&
                matchesVersion &&
                matchesGroup &&
                matchesGender &&
                matchesReligion &&
                matchesResidentialStatus &&
                matchesTransport
            );
        });
    }, [students, searchTerm, filters]);

    const fetchStudents = async (forceRefresh = false) => {
        setLoading(true);
        try {
            // Recalling from cached version.
            const cachedData = localStorage.getItem("cached_students");
            if (cachedData && !forceRefresh) {
                setStudents(JSON.parse(cachedData));
                setLoading(false);
                return;
            }
            // Fetching and cached.
            const response = await api.get("api/students/all");
            if (!response.ok) {
                throw new Error("Failed to fetch students");
            }
            const data = await response.json();
            setStudents(data.students);
            localStorage.setItem("cached_students", JSON.stringify(data.students));
        } catch (error) {
            console.error("Fetch Students Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Clear filter
    const clearFilters = () => {
        setFilters({
            batchCategory: "",
            classGrade: "",
            version: "",
            group: "",
            gender: "",
            religion: "",
            residentialStatus: "",
            isUsingTransport: "",
        });
        setSearchTerm("");
    };

    // Searching and Filtering using useMemo hook.

    return (
        <>
            <div className="student-list-dashboard">
                <NavBar />
                <h2>Student List</h2>
                <div className="search-tools">
                    <div className="button">
                        <button onClick={clearFilters}>Clear Filters</button> <br /> <br />
                        <button onClick={() => fetchStudents(true)} disabled={loading}>
                            {loading ? "Refreshing..." : "↻ Refresh Data"}
                        </button>
                    </div>
                    <div className="search-section">
                        <br />

                        <input
                            type="text"
                            placeholder="🔍 Search by Names and Contacts"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                {
                    // FILTER DASHBOARD
                }

                <div className="filter-settings">

                    <select
                        name="batchCategory"
                        value={filters.batchCategory}
                        onChange={handleFilterChange}
                    >
                        <option value="">Batches</option>
                        {Object.keys(ClassOptions).map((cat) => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                    <select
                        name="classGrade"
                        value={filters.classGrade}
                        onChange={handleFilterChange}
                    >
                        <option value="">Classes</option>
                        {Object.entries(ClassLabels).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <select
                        name="version"
                        value={filters.version}
                        onChange={handleFilterChange}
                    >
                        <option value="">Versions</option>
                        <option value="Bangla">Bangla</option>
                        <option value="English">English</option>
                    </select>
                    <select name="group" value={filters.group} onChange={handleFilterChange}>
                        <option value="">Groups</option>
                        <option value="Science">Science</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Arts">Arts</option>
                        <option value="N/A">General</option>
                    </select>
                    <select
                        name="gender"
                        value={filters.gender}
                        onChange={handleFilterChange}
                    >
                        <option value="">Genders</option>
                        {GenderOptions.map((gender) => (
                            <option key={gender} value={gender}>
                                {gender}
                            </option>
                        ))}
                    </select>
                    <select
                        name="residentialStatus"
                        value={filters.residentialStatus}
                        onChange={handleFilterChange}
                    >
                        <option value="">Residential Status</option>
                        <option value="Residential">Residential</option>
                        <option value="Non-Residential">Non-Residential</option>
                        <option value="Day-Care">Day-Care</option>
                    </select>
                    <select
                        name="isUsingTransport"
                        value={filters.isUsingTransport}
                        onChange={handleFilterChange}
                    >
                        <option value="">Transport</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                {
                    // LISTING STUDENTS
                }

                {students.length > 0 ? (
                    <div className="student-list">


                        {filteredStudents.length > 1 ? (
                            <p> Found {filteredStudents.length} students.</p>
                        ) : (<p>Found {filteredStudents.length} student.</p>)}



                        <table className="student-table">
                            <thead>
                                <tr>
                                    {StudentTableColumns.map((col) => (
                                        <th key={col.key}>{col.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <tr key={student._id}>
                                            <td>
                                                <strong>{student.userId?.name}</strong>
                                                {student.nameBN && <div>{student.nameBN}</div>}
                                            </td>

                                            <td>{student.userId?.mobile}</td>

                                            <td>
                                                {ClassLabels[student.classGrade]}
                                                {student.group !== "N/A" && (
                                                    <span> ({student.group})</span>
                                                )}
                                            </td>

                                            <td>{student.version}</td>

                                            <td>{student.gender}</td>
                                            <td>
                                                {student.residentialStatus}
                                                {student.isUsingTransport && (
                                                    <>
                                                        <br /> <strong>Transport</strong>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <>
                                        <tr>
                                            <td colSpan={StudentTableColumns.length}>
                                                No student match these filters.
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
}
