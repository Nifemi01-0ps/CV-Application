import { Link } from "react-router-dom";
import "./CVselector.css";
import emailIcon from "../assets/email-box.svg";

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
            <h2>💼 Resume</h2>
            <p>
              Designed for job applications and professional roles. 
              Focused on technical skills and project experience.
            </p>
            <Link to="work" className="btn">View Work CV</Link>
          </div>
        </div>
        <footer>
            <div className="contact-detail">
              <h5>Contact me</h5>
              <p>Have a project in mind? Contact me through the handles below to get started on building a solution that meets your goals</p> 
              <div className="contact-details">
                <a href="mailto: raphaeledafesnr@gmail.com">
                  <img srcSet={emailIcon} alt="email-icon" srcset="" />
                </a>
                <a href="https://github.com/Nifemi01-0ps" target="_blank">
                   <i class="devicon-github-original"></i>
               </a>
               <a href="https://www.linkedin.com/in/raphael-edafe-87593a265/" target="_blank">
                   <i class="devicon-linkedin-plain"></i>
               </a>
                <a href="https://x.com/AFCEdafe" target="_blank">
                   <i class="devicon-twitter-original"></i>
               </a>
              </div>
            </div>
        </footer>
      </div>
    </div>
  );
}

export default CvSelector;