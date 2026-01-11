import { useSchoolInfo } from '../../context/SchoolContext';
import './Footer.scss';

const Footer = () => {
    const { schoolInfo } = useSchoolInfo();

    // Safe check if info isn't loaded yet
    if (!schoolInfo) return null; 

    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-section brand">
                    <h3>{schoolInfo.name}</h3>
                    <p className="motto">{schoolInfo.motto}</p>
                    <p className="description">{schoolInfo.quote}</p>
                </div>

                <div className="footer-section contact">
                    <h4>Contact Us</h4>
                    <p><span>📍</span> {schoolInfo.address}</p>
                    <p><span>📞</span> {schoolInfo.mobile}</p>
                    <p><span>✉️</span> {schoolInfo.email}</p>
                </div>

                <div className="footer-section links">
                    <h4>Quick Links</h4>
                    <ul>
                        {schoolInfo.website && (
                            <li><a href={schoolInfo.website} target="_blank" rel="noreferrer">Website</a></li>
                        )}
                        {schoolInfo.actionLink && (
                            <li><a href={schoolInfo.actionLink}>Admissions</a></li>
                        )}
                        <li><a href="/login">Portal Login</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} {schoolInfo.name}. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;