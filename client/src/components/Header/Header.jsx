import React from 'react';
import './Header.scss';
import { useSchoolInfo } from '../../context/SchoolContext';

const Header = ({ title }) => {
    const { schoolInfo } = useSchoolInfo();

    // Fallback values in case context is loading or empty
    const name = schoolInfo?.name || "School Name";
    const motto = schoolInfo?.motto || "Education for Excellence"; 
    const estYear = schoolInfo?.establishedYear || schoolInfo?.established || "2000"; // Handle different naming conventions
    const logo = schoolInfo?.logo;

    return (
        <header className="page-header">
            <div className="header-content">
                {/* 1. The Logo */}
                <div className="logo-wrapper">
                    {logo ? (
                        <img src={logo} alt={`${name} Logo`} className="school-logo" />
                    ) : (
                        <div className="logo-placeholder">🎓</div>
                    )}
                </div>

                {/* 2. School Details */}
                <div className="text-wrapper">
                    {/* 3. The Site Name */}
                    <h1 className="school-name">{name}</h1>

                    {/* 4. The Motto */}
                    {motto && <p className="school-motto">“{motto}”</p>}

                    {/* 5. Established Year */}
                    {estYear && <span className="est-year">Est. {estYear}</span>}
                </div>
            </div>

            {/* Optional: If a specific page title is passed (e.g. "Student List") */}
            {title && (
                <div className="page-title-divider">
                    <h2>{title}</h2>
                </div>
            )}
        </header>
    );
}

export default Header;