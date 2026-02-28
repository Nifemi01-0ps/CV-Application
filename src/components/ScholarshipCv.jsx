import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "./WorkCv.css";

function ScholarshipCvForm() {
  const [isEditing, setIsEditing] = useState(true);
  const cvRef = useRef();
  const [skillInput, setSkillInput] = useState("");

  const [cvData, setCvData] = useState({
    personalInfo: { name: "", phone: "", email: "", location: "" },
    professionalSummary: "",
    researchInterests: "",
    education: [
      {
        id: 1,
        institution: "",
        location: "",
        degree: "",
        from: "",
        to: "",
        grade: "",
        gpa: "",
        thesis: "",
      },
    ],
    researchExperience: [
      { id: 1, role: "", institution: "", from: "", to: "", points: [""] },
    ],
    industrialExperience: [
      { id: 1, role: "", organization: "", from: "", to: "", points: [""] },
    ],
    certifications: [
      { id: 1, title: "", organization: "", year: "", points: [""] },
    ],
    leadership: [{ id: 1, role: "", organization: "", points: [""] }],
    skills: [],
  });

  const updateSection = (section, index, field, value) => {
    setCvData((prev) => {
      const updated = [...prev[section]];
      updated[index][field] = value;
      return { ...prev, [section]: updated };
    });
  };

  const addItem = (section, newItem) => {
    setCvData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  const removeItem = (section, index) => {
    setCvData((prev) => {
      const updated = prev[section].filter((_, i) => i !== index);
      return { ...prev, [section]: updated.length ? updated : prev[section] };
    });
  };

  const updatePoint = (section, index, pointIndex, value) => {
    setCvData((prev) => {
      const updated = [...prev[section]];
      const points = [...updated[index].points];
      points[pointIndex] = value;
      updated[index] = { ...updated[index], points };
      return { ...prev, [section]: updated };
    });
  };

  const addPoint = (section, index) => {
    setCvData((prev) => {
      const updated = [...prev[section]];
      updated[index] = {
        ...updated[index],
        points: [...updated[index].points, ""],
      };
      return { ...prev, [section]: updated };
    });
  };

  const removePoint = (section, index, pointIndex) => {
    setCvData((prev) => {
      const updated = [...prev[section]];
      const points = updated[index].points.filter((_, i) => i !== pointIndex);
      updated[index] = {
        ...updated[index],
        points: points.length ? points : [""],
      };
      return { ...prev, [section]: updated };
    });
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    setCvData((prev) => ({
      ...prev,
      skills: [...prev.skills, { id: Date.now(), name: trimmed }],
    }));
    setSkillInput("");
  };

  const removeSkill = (id) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  const hasContent = (section, fields) =>
    section.some((item) =>
      fields.some((field) => {
        const val = item[field];
        if (Array.isArray(val)) return val.some((v) => v.trim() !== "");
        return val?.trim() !== "";
      })
    );

  const formatMonthYear = (value) => {
    if (!value) return "";
    const [year, month] = value.split("-");
    const monthName = new Date(year, month - 1).toLocaleString("default", {
      month: "short",
    });
    return `${monthName} ${year}`;
  };

  const handlePrint = useReactToPrint({
    contentRef: cvRef,
    documentTitle: `${cvData.personalInfo.name || "Scholarship"}_CV`,
  });

  const personalInfoLabels = {
    name: "Full Name",
    phone: "Phone Number",
    email: "Email Address",
    location: "Location",
  };

  const personalInfoPlaceholders = {
    name: "Raphael Edafe",
    phone: "+2349034483597",
    email: "raphaeledafesnr@gmail.com",
    location: "Abuja, Nigeria",
  };

  /* EDIT MODE */
  if (isEditing) {
    return (
      <div className="cv-form-wrapper">
        <form
          id="scholarship-cv-form"
          name="scholarshipCvForm"
          className="cv-form"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Personal Info */}
          <section>
            <h2>Personal Information</h2>
            {["name", "phone", "email", "location"].map((field) => (
              <div key={field} className="field-group">
                <label htmlFor={`personal-${field}`}>
                  {personalInfoLabels[field]}
                </label>
                <input
                  id={`personal-${field}`}
                  name={`personalInfo_${field}`}
                  type={field === "email" ? "email" : "text"}
                  placeholder={personalInfoPlaceholders[field]}
                  value={cvData.personalInfo[field]}
                  onChange={(e) =>
                    setCvData({
                      ...cvData,
                      personalInfo: {
                        ...cvData.personalInfo,
                        [field]: e.target.value,
                      },
                    })
                  }
                />
              </div>
            ))}
          </section>

          {/* Professional Summary */}
          <section>
            <h2>Professional Summary</h2>
            <div className="field-group">
              <label htmlFor="professional-summary">Summary</label>
              <textarea
                id="professional-summary"
                name="professionalSummary"
                placeholder="Brief overview of your background, skills, and what you're applying for..."
                value={cvData.professionalSummary}
                onChange={(e) =>
                  setCvData({ ...cvData, professionalSummary: e.target.value })
                }
              />
            </div>
          </section>

          {/* Research Interests */}
          <section>
            <h2>Research Interests</h2>
            <div className="field-group">
              <label htmlFor="research-interests">Interests</label>
              <input
                id="research-interests"
                name="researchInterests"
                placeholder="e.g. Sustainable Agriculture || Precision Agriculture || Agribusiness"
                value={cvData.researchInterests}
                onChange={(e) =>
                  setCvData({ ...cvData, researchInterests: e.target.value })
                }
              />
            </div>
          </section>

          {/* Education */}
          <section>
            <h2>Education</h2>
            {cvData.education.map((edu, i) => (
              <div key={edu.id} className="entry-card">
                <div className="entry-card-header">
                  <span>Entry {i + 1}</span>
                  {cvData.education.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-entry"
                      onClick={() => removeItem("education", i)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor={`edu-institution-${i}`}>Institution</label>
                  <input
                    id={`edu-institution-${i}`}
                    value={edu.institution}
                    placeholder="University of Ilorin"
                    onChange={(e) =>
                      updateSection("education", i, "institution", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label htmlFor={`edu-location-${i}`}>Location</label>
                  <input
                    id={`edu-location-${i}`}
                    value={edu.location}
                    placeholder="Nigeria"
                    onChange={(e) =>
                      updateSection("education", i, "location", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label htmlFor={`edu-degree-${i}`}>Degree / Qualification</label>
                  <input
                    id={`edu-degree-${i}`}
                    value={edu.degree}
                    placeholder="Bachelor of Agriculture (B.Agric)"
                    onChange={(e) =>
                      updateSection("education", i, "degree", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label htmlFor={`edu-from-${i}`}>Start Date</label>
                  <input
                    id={`edu-from-${i}`}
                    type="month"
                    value={edu.from}
                    onChange={(e) =>
                      updateSection("education", i, "from", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label htmlFor={`edu-to-${i}`}>End Date</label>
                  <input
                    id={`edu-to-${i}`}
                    type="month"
                    value={edu.to}
                    onChange={(e) =>
                      updateSection("education", i, "to", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label htmlFor={`edu-grade-${i}`}>Final Grade</label>
                  <input
                    id={`edu-grade-${i}`}
                    value={edu.grade}
                    placeholder="Second Class Upper"
                    onChange={(e) =>
                      updateSection("education", i, "grade", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label htmlFor={`edu-gpa-${i}`}>
                    GPA: {Number(edu.gpa).toFixed(1)} / 5.0
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    id={`edu-gpa-${i}`}
                    value={edu.gpa}
                    onChange={(e) =>
                      updateSection("education", i, "gpa", Number(e.target.value))
                    }
                  />
                </div>

                <div className="field-group">
                  <label htmlFor={`edu-thesis-${i}`}>Thesis Title (Optional)</label>
                  <input
                    id={`edu-thesis-${i}`}
                    value={edu.thesis}
                    placeholder="Effect of Peri-urban Poultry Production..."
                    onChange={(e) =>
                      updateSection("education", i, "thesis", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn-add-entry"
              onClick={() =>
                addItem("education", {
                  id: Date.now(),
                  institution: "",
                  location: "",
                  degree: "",
                  from: "",
                  to: "",
                  grade: "",
                  gpa: 1,
                  thesis: "",
                })
              }
            >
              + Add Education
            </button>
          </section>

          {/* Research Experience */}
          <section>
            <h2>Research Experience</h2>
            {cvData.researchExperience.map((exp, i) => (
              <div key={exp.id} className="entry-card">
                <div className="entry-card-header">
                  <span>Entry {i + 1}</span>
                  {cvData.researchExperience.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-entry"
                      onClick={() => removeItem("researchExperience", i)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor={`research-role-${i}`}>Role / Title</label>
                  <input
                    id={`research-role-${i}`}
                    name={`researchExperience_${i}_role`}
                    placeholder="Research Assistant"
                    value={exp.role}
                    onChange={(e) =>
                      updateSection("researchExperience", i, "role", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label htmlFor={`research-institution-${i}`}>
                    Institution / Department
                  </label>
                  <input
                    id={`research-institution-${i}`}
                    name={`researchExperience_${i}_institution`}
                    placeholder="Department of Agricultural Economics"
                    value={exp.institution}
                    onChange={(e) =>
                      updateSection("researchExperience", i, "institution", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label htmlFor={`research-from-${i}`}>Start Date</label>
                  <input
                    id={`research-from-${i}`}
                    name={`researchExperience_${i}_from`}
                    type="month"
                    value={exp.from}
                    onChange={(e) =>
                      updateSection("researchExperience", i, "from", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label htmlFor={`research-to-${i}`}>End Date</label>
                  <input
                    id={`research-to-${i}`}
                    name={`researchExperience_${i}_to`}
                    type="month"
                    value={exp.to}
                    onChange={(e) =>
                      updateSection("researchExperience", i, "to", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label>Key Responsibilities / Achievements</label>
                  {exp.points.map((point, pi) => (
                    <div key={pi} className="point-row">
                      <input
                        id={`research-point-${i}-${pi}`}
                        name={`researchExperience_${i}_point_${pi}`}
                        placeholder={`Point ${pi + 1}`}
                        value={point}
                        onChange={(e) =>
                          updatePoint("researchExperience", i, pi, e.target.value)
                        }
                      />
                      {exp.points.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-point"
                          onClick={() => removePoint("researchExperience", i, pi)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn-add-point"
                    onClick={() => addPoint("researchExperience", i)}
                  >
                    + Add Point
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn-add-entry"
              onClick={() =>
                addItem("researchExperience", {
                  id: Date.now(),
                  role: "",
                  institution: "",
                  from: "",
                  to: "",
                  points: [""],
                })
              }
            >
              + Add Research Experience
            </button>
          </section>

          {/* Industrial Experience */}
          <section>
            <h2>Industrial Experience</h2>
            {cvData.industrialExperience.map((exp, i) => (
              <div key={exp.id} className="entry-card">
                <div className="entry-card-header">
                  <span>Entry {i + 1}</span>
                  {cvData.industrialExperience.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-entry"
                      onClick={() => removeItem("industrialExperience", i)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor={`industrial-role-${i}`}>Role / Job Title</label>
                  <input
                    id={`industrial-role-${i}`}
                    name={`industrialExperience_${i}_role`}
                    placeholder="Industrial Trainee"
                    value={exp.role}
                    onChange={(e) =>
                      updateSection("industrialExperience", i, "role", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label htmlFor={`industrial-org-${i}`}>Organization / Company</label>
                  <input
                    id={`industrial-org-${i}`}
                    name={`industrialExperience_${i}_organization`}
                    placeholder="T and K Feed Mill, Ilorin"
                    value={exp.organization}
                    onChange={(e) =>
                      updateSection("industrialExperience", i, "organization", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label htmlFor={`industrial-from-${i}`}>Start Date</label>
                  <input
                    id={`industrial-from-${i}`}
                    name={`industrialExperience_${i}_from`}
                    type="month"
                    value={exp.from}
                    onChange={(e) =>
                      updateSection("industrialExperience", i, "from", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label htmlFor={`industrial-to-${i}`}>End Date</label>
                  <input
                    id={`industrial-to-${i}`}
                    name={`industrialExperience_${i}_to`}
                    type="month"
                    value={exp.to}
                    onChange={(e) =>
                      updateSection("industrialExperience", i, "to", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label>Key Responsibilities / Achievements</label>
                  {exp.points.map((point, pi) => (
                    <div key={pi} className="point-row">
                      <input
                        id={`industrial-point-${i}-${pi}`}
                        name={`industrialExperience_${i}_point_${pi}`}
                        placeholder={`Point ${pi + 1}`}
                        value={point}
                        onChange={(e) =>
                          updatePoint("industrialExperience", i, pi, e.target.value)
                        }
                      />
                      {exp.points.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-point"
                          onClick={() => removePoint("industrialExperience", i, pi)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn-add-point"
                    onClick={() => addPoint("industrialExperience", i)}
                  >
                    + Add Point
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn-add-entry"
              onClick={() =>
                addItem("industrialExperience", {
                  id: Date.now(),
                  role: "",
                  organization: "",
                  from: "",
                  to: "",
                  points: [""],
                })
              }
            >
              + Add Industrial Experience
            </button>
          </section>

          {/* Certifications */}
          <section>
            <h2>Certifications</h2>
            {cvData.certifications.map((cert, i) => (
              <div key={cert.id} className="entry-card">
                <div className="entry-card-header">
                  <span>Entry {i + 1}</span>
                  {cvData.certifications.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-entry"
                      onClick={() => removeItem("certifications", i)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor={`cert-title-${i}`}>Certification Title</label>
                  <input
                    id={`cert-title-${i}`}
                    name={`certifications_${i}_title`}
                    placeholder="Certificate of Participation"
                    value={cert.title}
                    onChange={(e) =>
                      updateSection("certifications", i, "title", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label htmlFor={`cert-org-${i}`}>Issuing Organization</label>
                  <input
                    id={`cert-org-${i}`}
                    name={`certifications_${i}_organization`}
                    placeholder="Nigeria Association of Agricultural Student"
                    value={cert.organization}
                    onChange={(e) =>
                      updateSection("certifications", i, "organization", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label htmlFor={`cert-year-${i}`}>Year</label>
                  <input
                    id={`cert-year-${i}`}
                    name={`certifications_${i}_year`}
                    type="month"
                    value={cert.year}
                    onChange={(e) =>
                      updateSection("certifications", i, "year", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label>Additional Details (Optional)</label>
                  {cert.points.map((point, pi) => (
                    <div key={pi} className="point-row">
                      <input
                        id={`cert-point-${i}-${pi}`}
                        name={`certifications_${i}_point_${pi}`}
                        placeholder={`Detail ${pi + 1}`}
                        value={point}
                        onChange={(e) =>
                          updatePoint("certifications", i, pi, e.target.value)
                        }
                      />
                      {cert.points.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-point"
                          onClick={() => removePoint("certifications", i, pi)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn-add-point"
                    onClick={() => addPoint("certifications", i)}
                  >
                    + Add Detail
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn-add-entry"
              onClick={() =>
                addItem("certifications", {
                  id: Date.now(),
                  title: "",
                  organization: "",
                  year: "",
                  points: [""],
                })
              }
            >
              + Add Certification
            </button>
          </section>

          {/* Leadership */}
          <section>
            <h2>Volunteering &amp; Leadership</h2>
            {cvData.leadership.map((lead, i) => (
              <div key={lead.id} className="entry-card">
                <div className="entry-card-header">
                  <span>Entry {i + 1}</span>
                  {cvData.leadership.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-entry"
                      onClick={() => removeItem("leadership", i)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor={`leadership-role-${i}`}>Role / Position</label>
                  <input
                    id={`leadership-role-${i}`}
                    name={`leadership_${i}_role`}
                    placeholder="Community Development Service"
                    value={lead.role}
                    onChange={(e) =>
                      updateSection("leadership", i, "role", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label htmlFor={`leadership-org-${i}`}>Organization / Program</label>
                  <input
                    id={`leadership-org-${i}`}
                    name={`leadership_${i}_organization`}
                    placeholder="National Youth Service Corps (NYSC)"
                    value={lead.organization}
                    onChange={(e) =>
                      updateSection("leadership", i, "organization", e.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label>Key Contributions</label>
                  {lead.points.map((point, pi) => (
                    <div key={pi} className="point-row">
                      <input
                        id={`leadership-point-${i}-${pi}`}
                        name={`leadership_${i}_point_${pi}`}
                        placeholder={`Point ${pi + 1}`}
                        value={point}
                        onChange={(e) =>
                          updatePoint("leadership", i, pi, e.target.value)
                        }
                      />
                      {lead.points.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-point"
                          onClick={() => removePoint("leadership", i, pi)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn-add-point"
                    onClick={() => addPoint("leadership", i)}
                  >
                    + Add Point
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn-add-entry"
              onClick={() =>
                addItem("leadership", {
                  id: Date.now(),
                  role: "",
                  organization: "",
                  points: [""],
                })
              }
            >
              + Add Leadership Role
            </button>
          </section>

          {/* Skills */}
          <section>
            <h2>Skills</h2>
            <div className="skill-input-row">
              <input
                id="skill-input"
                type="text"
                placeholder="Type a skill and press Add or Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <button type="button" className="btn-add-point" onClick={addSkill}>
                + Add
              </button>
            </div>
            {cvData.skills.length > 0 && (
              <div className="skill-chips">
                {cvData.skills.map((s) => (
                  <span key={s.id} className="skill-chip">
                    {s.name}
                    <button
                      type="button"
                      className="skill-chip-remove"
                      onClick={() => removeSkill(s.id)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          <div className="form-actions">
            <button
              type="button"
              className="btn-preview"
              onClick={() => setIsEditing(false)}
            >
              Save &amp; Preview →
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* PREVIEW */
  return (
    <div className="preview-wrapper">
      <div className="cv-preview" ref={cvRef}>

        {/* Header */}
        <div className="cv-header">
          <h1 className="cv-name">{cvData.personalInfo.name}</h1>
          <div className="cv-contact">
            {[
              cvData.personalInfo.phone,
              cvData.personalInfo.email,
              cvData.personalInfo.location,
            ]
              .filter(Boolean)
              .map((item, i, arr) => (
                <span key={i}>
                  {item}
                  {i < arr.length - 1 && (
                    <span className="cv-divider"> || </span>
                  )}
                </span>
              ))}
          </div>
        </div>

        {/* Professional Summary */}
        {cvData.professionalSummary.trim() && (
          <div className="cv-section">
            <h2 className="cv-section-title">Professional Summary</h2>
            <hr />
            <p className="cv-summary">{cvData.professionalSummary}</p>
          </div>
        )}

        {/* Research Interests */}
        {cvData.researchInterests.trim() && (
          <div className="cv-section">
            <h2 className="cv-section-title">Research Interests</h2>
            <hr />
            <p className="cv-interests">{cvData.researchInterests}</p>
          </div>
        )}

        {/* Education */}
        {hasContent(cvData.education, ["institution", "degree", "from", "to"]) && (
          <div className="cv-section">
            <h2 className="cv-section-title">Education</h2>
            <hr />
            {cvData.education.map((edu) => (
              <div key={edu.id} className="cv-entry">
                <div className="cv-entry-header">
                  <div>
                    <span className="cv-role">{edu.institution}</span>
                    {edu.location && (
                      <span className="cv-org">
                        , {edu.location}.{" "}
                        {formatMonthYear(edu.from)}
                        {edu.to ? ` – ${formatMonthYear(edu.to)}` : " – Present"}
                      </span>
                    )}
                  </div>
                  {(edu.from || edu.to) && (
                    <span className="cv-date"></span>
                  )}
                </div>
                {edu.degree && <p className="edu-degree">{edu.degree}</p>}
                {(edu.grade || edu.gpa) && (
                  <p className="edu-meta">
                    {edu.grade && <span>Final Grade: {edu.grade}</span>}
                    {edu.grade && edu.gpa && (
                      <span className="edu-sep"> &nbsp;·&nbsp; </span>
                    )}
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </p>
                )}
                {edu.thesis && <p className="edu-thesis">Thesis: {edu.thesis}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Research Experience */}
        {hasContent(cvData.researchExperience, ["role", "institution", "points"]) && (
          <div className="cv-section">
            <h2 className="cv-section-title">Research Experience</h2>
            <hr />
            {cvData.researchExperience.map((exp) => (
              <div key={exp.id} className="cv-entry">
                <div className="cv-entry-header">
                  <div>
                    <span className="cv-role">{exp.role}</span>
                    {exp.institution && (
                      <span className="cv-org"> — {exp.institution}</span>
                    )}
                  </div>
                  {(exp.from || exp.to) && (
                    <span className="cv-date">
                      {formatMonthYear(exp.from)}
                      {exp.to ? ` – ${formatMonthYear(exp.to)}` : " – Present"}
                    </span>
                  )}
                </div>
                {exp.points.some((p) => p.trim() !== "") && (
                  <ul className="cv-points">
                    {exp.points
                      .filter((p) => p.trim() !== "")
                      .map((p, pi) => (
                        <li key={pi}>{p}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Industrial Experience */}
        {hasContent(cvData.industrialExperience, ["role", "organization", "points"]) && (
          <div className="cv-section">
            <h2 className="cv-section-title">Industrial Experience</h2>
            <hr />
            {cvData.industrialExperience.map((exp) => (
              <div key={exp.id} className="cv-entry">
                <div className="cv-entry-header">
                  <div>
                    <span className="cv-role">{exp.role}</span>
                    {exp.organization && (
                      <span className="cv-org"> — {exp.organization}</span>
                    )}
                  </div>
                  {(exp.from || exp.to) && (
                    <span className="cv-date">
                      {formatMonthYear(exp.from)}
                      {exp.to ? ` – ${formatMonthYear(exp.to)}` : " – Present"}
                    </span>
                  )}
                </div>
                {exp.points.some((p) => p.trim() !== "") && (
                  <ul className="cv-points">
                    {exp.points
                      .filter((p) => p.trim() !== "")
                      .map((p, pi) => (
                        <li key={pi}>{p}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {hasContent(cvData.certifications, ["title", "organization", "year"]) && (
          <div className="cv-section">
            <h2 className="cv-section-title">Certifications</h2>
            <hr />
            {cvData.certifications.map((cert) => (
              <div key={cert.id} className="cv-entry">
                <div className="cv-entry-header">
                  <div>
                    <span className="cv-role">{cert.title}</span>
                    {cert.organization && (
                      <span className="cv-org"> — {cert.organization}</span>
                    )}
                  </div>
                  {cert.year && (
                    <span className="cv-date">{formatMonthYear(cert.year)}</span>
                  )}
                </div>
                {cert.points.some((p) => p.trim() !== "") && (
                  <ul className="cv-points">
                    {cert.points
                      .filter((p) => p.trim() !== "")
                      .map((p, pi) => (
                        <li key={pi}>{p}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Leadership */}
        {hasContent(cvData.leadership, ["role", "organization", "points"]) && (
          <div className="cv-section">
            <h2 className="cv-section-title">Volunteering &amp; Leadership</h2>
            <hr />
            {cvData.leadership.map((lead) => (
              <div key={lead.id} className="cv-entry">
                <div className="cv-entry-header">
                  <div>
                    <span className="cv-role">{lead.role}</span>
                    {lead.organization && (
                      <span className="cv-org"> — {lead.organization}</span>
                    )}
                  </div>
                </div>
                {lead.points.some((p) => p.trim() !== "") && (
                  <ul className="cv-points">
                    {lead.points
                      .filter((p) => p.trim() !== "")
                      .map((p, pi) => (
                        <li key={pi}>{p}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {cvData.skills.length > 0 && (
          <div className="cv-section">
            <h2 className="cv-section-title">Skills &amp; Competencies</h2>
            <hr />
            <ul className="cv-skills-list">
              {cvData.skills.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScholarshipCvForm;