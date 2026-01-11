import { useState, useEffect } from "react";
import { api } from "../utils/api";
import NavBar from "../components/NavBar/NavBar";
import "./SchoolInfoForm.scss";

const SchoolInfoForm = () => {
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [message, setMessage] = useState("");
    const [statusType, setStatusType] = useState("");


    const [formData, setFormData] = useState({
        _id: "",
        name: "",
        address: "",
        establishedYear: "",
        motto: "",
        email: "",
        quote: "",
        logo: "",
        heroImage: "",
        mobile: "",
        website: "",
        actionLabel: "",
        actionLink: ""
    });


    useEffect(() => {
        const fetchInfo = async () => {
            try {

                const response = await api.get("api/school/info");
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setFormData(data);
                        setIsEditMode(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching school info:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Processing...");
        setStatusType("info");

        // 1. Create a clean copy of the data
        const payload = { ...formData };

        // 2. If creating new (POST), REMOVE the empty _id
        if (!isEditMode) {
            delete payload._id;
        }

        try {
            let response;
            if (isEditMode) {
                // Update existing
                response = await api.put(`api/school/info/${formData._id}`, payload);
            } else {
                // Create new (Send payload WITHOUT _id)
                response = await api.post("api/school/info", payload);
            }

            const data = await response.json();

            if (!response.ok) {
                // This will now show the REAL error from the backend if it still fails
                throw new Error(data.message || "Operation failed");
            }

            // ... rest of success logic (localStorage, setMessage, etc)
            localStorage.setItem('schoolInfo', JSON.stringify(data));
            setMessage(isEditMode ? "School Info Updated Successfully!" : "School Info Created Successfully!");
            setStatusType("success");
            setTimeout(() => window.location.reload(), 1000);

        } catch (error) {
            setMessage(`Error: ${error.message}`);
            setStatusType("error");
            console.error(error);
        }
    };

    if (loading) return <div className="loading">Loading settings...</div>;

    return (
        <div className="school-info-form">
            <NavBar />
            <div className="form-container">
                <h2>{isEditMode ? "Update School Settings" : "Setup School Information"}</h2>
                {message && <p className={`message ${statusType}`}>{message}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>General Details</h3>
                        <div className="grid-2">
                            <div className="form-group">
                                <label>School Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Established Year</label>
                                <input
                                    type="number"
                                    name="establishedYear"
                                    value={formData.establishedYear}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid-2">
                            <div className="form-group">
                                <label>Contact Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Contact Mobile</label>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Branding & Web</h3>
                        <div className="form-group">
                            <label>Motto</label>
                            <input
                                type="text"
                                name="motto"
                                value={formData.motto}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Quote (for Footer/Landing)</label>
                            <textarea
                                name="quote"
                                value={formData.quote}
                                onChange={handleChange}
                                rows="2"
                            />
                        </div>
                        <div className="grid-2">
                            <div className="form-group">
                                <label>Logo URL</label>
                                <input
                                    type="text"
                                    name="logo"
                                    value={formData.logo}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Hero Image URL</label>
                                <input
                                    type="text"
                                    name="heroImage"
                                    value={formData.heroImage}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Website URL</label>
                            <input
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Call to Action (Landing Page)</h3>
                        <div className="grid-2">
                            <div className="form-group">
                                <label>Action Label (e.g., Apply Now)</label>
                                <input
                                    type="text"
                                    name="actionLabel"
                                    value={formData.actionLabel}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Action Link</label>
                                <input
                                    type="text"
                                    name="actionLink"
                                    value={formData.actionLink}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="save-btn">
                        {isEditMode ? "Update Information" : "Save Information"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SchoolInfoForm;