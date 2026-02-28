import { Link } from "react-router-dom";
import "./CVselector.css";

function CvSelector() {
  return (
    <div className="selector-wrapper">
      <div className="cv-content">
        <h1>Select CV Type</h1>
        <p>Please choose the version that best fits your purpose.</p>

        <div className="card-grid">
          <div className="card">
            <h2>🎓 Scholarship CV</h2>
            <p>
              Designed for academic opportunities, scholarships, and research programs. 
              Focused on education and certifications.
            </p>
            <Link to="scholarship" className="btn">View Scholarship CV</Link>
          </div>

          <div className="card">
            <h2>💼 Work CV</h2>
            <p>
              Designed for job applications and professional roles. 
              Focused on technical skills and project experience.
            </p>
            <Link to="work" className="btn">View Work CV</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CvSelector;