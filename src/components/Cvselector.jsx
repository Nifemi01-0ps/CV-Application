import { Link } from "react-router-dom";
function Cvselector() {
    return (
        <div className="card-container">
            <div className="cv-content">
                <h1>Select CV Type</h1>
                <p>Please choose the version that best fits your purpose.</p>
                <div className="card-container">
                    <div className="card">
                        <h2>🎓 Scholarship Cv</h2>
                        <p>Designed for academic opportunities, scholarships, and research programs. Focused on education and certifications.</p>
                        <Link to="/schoarship" className="btn">View Scholarship Cv</Link>
                    </div>
                    <div className="card">
                        <h2>💼 Work CV</h2>
                        <p>Designed for job applications and professional roles. Focused on technical skills and project experience.</p>
                        <Link to="/work" className="btn">View Work Cv</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Cvselector;
