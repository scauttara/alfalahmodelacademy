import { useSchoolInfo } from '../context/SchoolContext';
import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer/Footer';

import './LandingPage.scss';
import { Link } from 'react-router-dom'; // Assuming you use react-router-dom

export default function LandingPage() {
    const { schoolInfo, loading } = useSchoolInfo();

    if (loading) {
        return <div className="loading-screen">Loading...</div>;
    }

    if (!schoolInfo) {
        return (
            <div className="landing-page error-state">
                <NavBar />
                <div className="empty-content">
                    <h2>School Information Not Setup</h2>
                    <p>Please configure the school settings in the admin panel.</p>
                </div>
                <Footer />
            </div>
        );
    }

    // Fallback image if no heroImage is provided
    const bgImage = schoolInfo.heroImage || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop';

    return (
        <div className="landing-page">
            <NavBar />

            {/* Hero Section */}
            <header 
                className="hero-section" 
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${bgImage})` }}
            >
                <div className="hero-content">
                    {schoolInfo.logo && <img src={schoolInfo.logo} alt="School Logo" className="hero-logo" />}
                    <h1>{schoolInfo.name}</h1>
                    <p className="motto">{schoolInfo.motto}</p>
                    
                    {schoolInfo.actionLink && (
                        <a href={schoolInfo.actionLink} className="cta-button">
                            {schoolInfo.actionLabel || "Learn More"}
                        </a>
                    )}
                </div>
            </header>

            <main>
                {/* Intro / Quote Section */}
                <section className="intro-section">
                    <div className="container">
                        <div className="intro-card">
                            <span className="established-badge">Est. {schoolInfo.establishedYear}</span>
                            <h2>Message from Us</h2>
                            <blockquote className="school-quote">
                                "{schoolInfo.quote || "Empowering the next generation with knowledge and character."}"
                            </blockquote>
                        </div>
                    </div>
                </section>

                {/* Info Grid */}
                <section className="info-grid-section">
                    <div className="container">
                        <div className="info-card">
                            <i className="icon-location">📍</i>
                            <h3>Visit Us</h3>
                            <p>{schoolInfo.address || "Address not set"}</p>
                        </div>

                        <div className="info-card">
                            <i className="icon-phone">📞</i>
                            <h3>Contact</h3>
                            <p>{schoolInfo.mobile}</p>
                            <p>{schoolInfo.email}</p>
                        </div>

                        <div className="info-card">
                            <i className="icon-web">🌐</i>
                            <h3>Online</h3>
                            <p>
                                <a href={schoolInfo.website} target="_blank" rel="noopener noreferrer">
                                    {schoolInfo.website ? "Visit Website" : "No website link"}
                                </a>
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}