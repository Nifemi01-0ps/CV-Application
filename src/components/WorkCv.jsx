import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import "./WorkCv.css";
import clickSound from "../assets/click.mp3";
import successSound from "../assets/success.mp3";

function WorkCvForm() {
  const [isEditing, setIsEditing] = useState(true);
  const clickRef = useRef(null);
  const successRef = useRef(null);
  useEffect(() => {
    clickRef.current = new Audio(clickSound);
    clickRef.current.volume = 0.2;
    clickRef.current.load();

    successRef.current = new Audio(successSound);
    successRef.current.volume = 0.4;
    successRef.current.load();
  }, []);
  const cvRef = useRef();
  const [step, setStep] = useState(1);
  const totalStep = 8;
  const [cvData, setCvData] = useState({
    personalInfo: { name: "", phone: "", email: "", location: "" },
    education: [{ id: 1, degree: "", institution: "", from: "", to: "", grade: "", gpa: 1 }],
    workExperience: [
      { id: 1, role: "", company: "", from: "", to: "", points: [""] },
    ],
    skills: [{ id: 1, name: "", points: [""] }],
    certifications: [{ id: 1, title: "", issuer: "", points: [''],  from: "", to: "" }],
    volunteering: [{ id: 1, role: "", description: "", from: "", to: "" }],
    awards: [{ id: 1, title: "", from: "", to: "" }],
    academicSupport: [{ id: 1, role: "", description: "", from: "", to: "" }],
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
    setCvData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  // Work Experience point helpers
  const updateWorkPoint = (workIndex, pointIndex, value) => {
    setCvData((prev) => {
      const updated = [...prev.workExperience];
      const points = [...updated[workIndex].points];
      points[pointIndex] = value;
      updated[workIndex] = { ...updated[workIndex], points };
      return { ...prev, workExperience: updated };
    });
  };

  const addWorkPoint = (workIndex) => {
    setCvData((prev) => {
      const updated = [...prev.workExperience];
      updated[workIndex] = {
        ...updated[workIndex],
        points: [...updated[workIndex].points, ""],
      };
      return { ...prev, workExperience: updated };
    });
  };

  const removeWorkPoint = (workIndex, pointIndex) => {
    setCvData((prev) => {
      const updated = [...prev.workExperience];
      const points = updated[workIndex].points.filter((_, i) => i !== pointIndex);
      updated[workIndex] = {
        ...updated[workIndex],
        points: points.length ? points : [""],
      };
      return { ...prev, workExperience: updated };
    });
  };

  // Skills point helpers
  const updateSkillPoint = (skillIndex, pointIndex, value) => {
    setCvData((prev) => {
      const updated = [...prev.skills];
      const points = [...updated[skillIndex].points];
      points[pointIndex] = value;
      updated[skillIndex] = { ...updated[skillIndex], points };
      return { ...prev, skills: updated };
    });
  };

  const addSkillPoint = (skillIndex) => {
    setCvData((prev) => {
      const updated = [...prev.skills];
      updated[skillIndex] = {
        ...updated[skillIndex],
        points: [...updated[skillIndex].points, ""],
      };
      return { ...prev, skills: updated };
    });
  };

  const removeSkillPoint = (skillIndex, pointIndex) => {
    setCvData((prev) => {
      const updated = [...prev.skills];
      const points = updated[skillIndex].points.filter((_, i) => i !== pointIndex);
      updated[skillIndex] = {
        ...updated[skillIndex],
        points: points.length ? points : [""],
      };
      return { ...prev, skills: updated };
    });
  };

  // Certification Point Helpers
  const updateCertPoint = (certIndex, pointIndex, value) => {
    setCvData((prev) => {
      const updated = [...prev.certifications];
      const points = [...updated[certIndex].points];
      points[pointIndex] = value;
      updated[certIndex] = { ...updated[certIndex], points };
      return { ...prev, certifications: updated };
    });
  };

  const addCertPoint = (certIndex) => {
    setCvData((prev) => {
      const updated = [...prev.certifications];
      updated[certIndex] = {
        ...updated[certIndex],
        points: [...updated[certIndex].points, ""],
      };
      return { ...prev, certifications: updated };
    });
  };

  const removeCertPoint = (certIndex, pointIndex) => {
    setCvData((prev) => {
      const updated = [...prev.certifications];
      const points = updated[certIndex].points.filter((_, i) => i !== pointIndex);
      updated[certIndex] = {
        ...updated[certIndex],
        points: points.length ? points : [''],
      };
      return { ...prev, certifications: updated };
    });
  };

  //  Audio Function
  const playClick = () => {
    if (clickRef.current) {
       clickRef.current.currentTime = 0;
       clickRef.current.play().catch(() => {});
    }
  };
  const playSuccess = () => {
    if (successRef.current) {
      successRef.current.currentTime = 0;
      successRef.current.play().catch(() => {});
    }
  };
  const hasContent = (section, fields) =>
    section.some((item) =>
      fields.some((field) => {
        const val = item[field];
        if (Array.isArray(val)) return val.some((v) => v?.trim() !== "");
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
    documentTitle: `${cvData.personalInfo.name || "CV"}_Resume`,
    pageStyle: `
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .cv-preview { font-family: "Inter", sans-serif; }
        .cv-preview h1, .cv-preview h2 { font-family: "Fraunces", serif; }
      }
    `,
  });

  const optionalPlaceholders = {
    certifications: {
      title: "Agroweek Training",
      issuer: "The Nigeria Association of Agricultural Student",
      from: "Start Date",
      to: "End Date",
    },
    volunteering: {
      role: "Cobes Participant",
      description: "Create Awareness to Farmer on Better Agricultural Pratices",
      from: "Start Date",
      to: "End Date",
    },
    awards: {
      title: "Best Graduating Student",
      from: "Date Awarded (From)",
      to: "Date Awarded (To)",
    },
    academicSupport: {
      role: "Role",
      description: "Description",
      from: "Start Date",
      to: "End Date",
    },
  };

  // 
  const optionalSections = [
    { key: 'volunteering', title: 'Volunteering', optional: true, fields: ['role', 'description', 'from', 'to'] },
    { key: 'awards', title: 'Awards', optional: true, fields: ['title', 'from', 'to'] },
    { key: 'academicSupport', title: 'Academic Support', optional: true, fields: ['role', 'description', 'from', 'to'] },
  ];

  const optionalPreviewConfig = {
    certifications: { titleField: 'title', subtitleField: "issuer", descField: "points" },
    volunteering: { titleField: 'role', subtitleField: null, descField: "description" },
    awards: { titleField: 'title', subtitleField: null, descField: null },
    academicSupport: { titleField: "role", subtitleField: null, descField: "description" },
  };

  if (isEditing) {
    return (
      <div className="cv-form-wrapper">
        <form
          id="cv-builder-form"
          name="cvBuilderForm"
          className="cv-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <input type="range" name="stepRange" id="step-range" min="1" max={totalStep} value={step} readOnly />

          {/* Step 1 — Personal Information */}
          {step === 1 && (
            <section>
              <h2>Personal Information</h2>
              {["name", "phone", "email", "location"].map((field) => {
                const placeholders = {
                  name: "Raphael Edafe",
                  phone: "+2349034483597",
                  email: "raphaeledafe@yahoo.com",
                  location: "Abuja, Nigeria",
                };
                return (
                  <div key={field}>
                    <label htmlFor={`personal-${field}`}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      id={`personal-${field}`}
                      name={`personalInfo_${field}`}
                      type={field === "email" ? "email" : "text"}
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
                      placeholder={placeholders[field]}
                    />
                  </div>
                );
              })}
            </section>
          )}

          {/* Step 2 — Education */}
          {step === 2 && (
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
          )}

          {/* Step 3 — Work Experience */}
          {step === 3 && (
            <section>
              <h2>Work Experience</h2>
              {cvData.workExperience.map((work, i) => (
                <div key={work.id} className="work-experience-entry">
                  <div>
                    <label htmlFor={`work-role-${i}`}>Role / Job Title</label>
                    <input
                      id={`work-role-${i}`}
                      name={`workExperience_${i}_role`}
                      placeholder="Software Engineer"
                      value={work.role}
                      onChange={(e) =>
                        updateSection("workExperience", i, "role", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor={`work-company-${i}`}>Company / Organization</label>
                    <input
                      id={`work-company-${i}`}
                      name={`workExperience_${i}_company`}
                      placeholder="Google"
                      value={work.company}
                      onChange={(e) =>
                        updateSection("workExperience", i, "company", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor={`work-from-${i}`}>Start Date</label>
                    <input
                      id={`work-from-${i}`}
                      name={`workExperience_${i}_from`}
                      type="month"
                      value={work.from}
                      onChange={(e) =>
                        updateSection("workExperience", i, "from", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor={`work-to-${i}`}>End Date</label>
                    <input
                      id={`work-to-${i}`}
                      name={`workExperience_${i}_to`}
                      type="month"
                      value={work.to}
                      onChange={(e) =>
                        updateSection("workExperience", i, "to", e.target.value)
                      }
                    />
                  </div>

                  <div className="work-points">
                    <label>Responsibilities / Achievements</label>
                    {work.points.map((point, pi) => (
                      <div key={pi} className="work-point-row">
                        <input
                          id={`work-point-${i}-${pi}`}
                          name={`workExperience_${i}_point_${pi}`}
                          type="text"
                          placeholder={`Point ${pi + 1}: e.g. Led a team of  2 Engineers`}
                          value={point}
                          onChange={(e) => updateWorkPoint(i, pi, e.target.value)}
                        />
                        {work.points.length > 1 && (
                          <button
                            type="button"
                            className="btn-remove-point"
                            onClick={() => removeWorkPoint(i, pi)}
                            title="Remove this point"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn-add-point"
                      onClick={() => addWorkPoint(i)}
                    >
                      + Add Point
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  addItem("workExperience", {
                    id: Date.now(),
                    role: "",
                    company: "",
                    from: "",
                    to: "",
                    points: [""],
                  })
                }
              >
                Add Work Experience
              </button>
            </section>
          )}

          {/* Step 4 — Skills */}
          {step === 4 && (
            <section>
              <h2>Skills (Optional)</h2>
              {cvData.skills.map((skill, i) => (
                <div key={skill.id} className="work-experience-entry">
                  <div>
                    <label htmlFor={`skills-name-${i}`}>Skill Name</label>
                    <input
                      id={`skills-name-${i}`}
                      name={`skills_${i}_name`}
                      placeholder="e.g. Microsoft"
                      value={skill.name}
                      onChange={(e) =>
                        updateSection("skills", i, "name", e.target.value)
                      }
                    />
                  </div>

                  <div className="skill-points">
                    {skill.points.map((point, pi) => (
                      <div key={pi} className="skill-point-row">
                        <input
                          id={`skill-point-${i}-${pi}`}
                          name={`skills_${i}_point_${pi}`}
                          type="text"
                          placeholder="e.g. Word, Excel, PowerPoint"
                          value={point}
                          onChange={(e) => updateSkillPoint(i, pi, e.target.value)}
                        />
                        {skill.points.length > 1 && (
                          <button
                            type="button"
                            className="btn-remove-point"
                            onClick={() => removeSkillPoint(i, pi)}
                            title="Remove this point"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn-add-point"
                      onClick={() => addSkillPoint(i)}
                    >
                      + Add Point
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  addItem("skills", { id: Date.now(), name: "", points: [""] })
                }
              >
                Add Skill
              </button>
            </section>
          )}

          {/* Step 5 — Certifications */}
          {step === 5 && (
            <section>
              <h2>Certification <span className="optional-tag">(Optional)</span></h2>
              {cvData.certifications.map((cert, i) => (
                <div key={cert.id} className="entry-card">
                  {cvData.certifications.length > 1 && (
                    <button type="button" onClick={() => removeItem("certifications", i)}>Remove</button>
                  )}
                  <div className="field-group">
                    <label htmlFor={`cert-title-${i}`}>Title</label>
                    <input
                      type="text"
                      id={`cert-title-${i}`}
                      placeholder="Agroweek Training"
                      value={cert.title}
                      onChange={(e) => updateSection('certifications', i, 'title', e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor={`cert-issuer-${i}`}>Issuer</label>
                    <input
                      type="text"
                      id={`cert-issuer-${i}`}
                      placeholder="The Nigerian Association of Agricultural Student"
                      value={cert.issuer}
                      onChange={(e) => updateSection('certifications', i, 'issuer', e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor={`cert-from-${i}`}>Start Date</label>
                    <input
                      type="month"
                      id={`cert-from-${i}`}
                      value={cert.from}
                      onChange={(e) => updateSection('certifications', i, 'from', e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor={`cert-to-${i}`}>End Date</label>
                    <input
                      type="month"
                      id={`cert-to-${i}`}
                      value={cert.to}
                      onChange={(e) => updateSection('certifications', i, 'to', e.target.value)}
                    />
                  </div>
                  <div className="work-points">
                    <label>Points</label>
                    {cert.points.map((point, pi) => (
                      <div key={pi} className="work-point-row">
                        <input
                          type="text"
                          placeholder={`Point ${pi + 1}:`}
                          value={point}
                          onChange={(e) => updateCertPoint(i, pi, e.target.value)}
                        />
                        {cert.points.length > 1 && (
                          <button
                            type="button"
                            className="btn-remove-point"
                            onClick={() => removeCertPoint(i, pi)}
                            title="Remove this point"
                          >
                            x Remove Point
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" className="btn-add-point" onClick={() => addCertPoint(i)}>
                      + Add Point
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn-add-entry"
                onClick={() => addItem('certifications', { id: Date.now(), title: '', issuer: "", points: [""], from: "", to: "" })}
              >
                + Add Certification
              </button>
            </section>
          )}

          {/* Steps 6–8 — Remaining Optional Sections */}
          {optionalSections.map((section, index) => {
            const stepNumber = index + 6;
            if (step !== stepNumber) return null;
            return (
              <section key={section.key}>
                <h2>
                  {section.title}{" "}
                  {section.optional && (
                    <span className="optional-tag">(Optional)</span>
                  )}
                </h2>
                {cvData[section.key].map((item, i) => (
                  <div key={item.id} className="entry-card">
                    {cvData[section.key].length > 1 && (
                      <button type="button" onClick={() => removeItem(section.key, i)}>Remove</button>
                    )}
                    {section.fields.map((field) => (
                      <div key={field} className="field-group">
                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        {field === 'description' ? (
                          <textarea
                            placeholder={optionalPlaceholders[section.key]?.[field] || ''}
                            value={item[field]}
                            onChange={(e) => updateSection(section.key, i, field, e.target.value)}
                          />
                        ) : (
                          <input
                            type={field === 'from' || field === 'to' ? "month" : 'text'}
                            placeholder={optionalPlaceholders[section.key]?.[field] || ''}
                            value={item[field]}
                            onChange={(e) => updateSection(section.key, i, field, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItem(section.key, {
                    id: Date.now(),
                    ...Object.fromEntries(section.fields.map((f) => [f, ''])),
                  })}
                >
                  + Add {section.title}
                </button>
              </section>
            );
          })}

          <div className="form-actions">
            {step > 1 && (
              <button type="button" className="btn-back" onClick={() => setStep(step -1)}>← Back</button>
            )}
            {step < totalStep && (
              <button type="button" className="btn-next" onClick={() => {
                playClick();
                setStep(step + 1)
              }}>Next →</button>
            )}
            {step === totalStep && (
              <button type="button" className="btn-preview" onClick={() => setIsEditing(false)}>Save & Preview →</button>
            )}
          </div>
          <div className="form-button">
            <button type="button" onClick={() => {
              playSuccess();
              setIsEditing(false);
            }}>
              Save & Preview
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Preview
  return (
    <div>
      <div className="cv-preview" ref={cvRef}>
        <h1>{cvData.personalInfo.name}</h1>
        <p className="details">
          {cvData.personalInfo.phone} || {cvData.personalInfo.email} ||{" "}
          {cvData.personalInfo.location}
        </p>

        {/* Education preview */}
        {hasContent(cvData.education, ["degree", "institution", "from", "to", "grade"]) && (
          <div>
            <h2>EDUCATION</h2>
            <hr />
            {cvData.education.map((item) => {
              const hasGpa = typeof item.gpa === "number";
              return (
                <div key={item.id}>
                  <p>
                    <strong>{item.degree}</strong>
                    {item.institution && `— ${item.institution}`}
                    {(item.from || item.to) && (
                      <span>
                        {" "}
                        ({formatMonthYear(item.from)} →{" "}
                        {formatMonthYear(item.to)})
                      </span>
                    )}
                  </p>
                  {(item.grade || hasGpa) && (
                    <p className="edu-grade">
                      {item.grade && <span>Grade: {item.grade}</span>}
                      {item.grade && hasGpa && <span> &nbsp;·&nbsp;</span>}
                      {hasGpa && <span>GPA: {item.gpa.toFixed(1)} / 5.0</span>}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Work Experience preview */}
        {hasContent(cvData.workExperience, ["role", "company", "from", "to", "points"]) && (
          <div>
            <h2>WORK EXPERIENCE</h2>
            <hr />
            {cvData.workExperience.map((item) => (
              <div key={item.id} className="work-preview-entry">
                <div className="work-preview-header">
                  <span className="work-preview-title">
                    <strong>{item.role}</strong>
                    {item.company && ` ${item.company}`}
                  </span>
                  {(item.from || item.to) && (
                    <span className="work-preview-date">
                      {formatMonthYear(item.from)}
                      {item.from && item.to ? "  " : ""}- {formatMonthYear(item.to)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills preview */}
        {hasContent(cvData.skills, ["name", "points"]) && (
          <div>
            <h2>SKILLS</h2>
            <hr />
            {cvData.skills.map((item) => (
              <div key={item.id} className="work-preview-entry">
                {item.name && (
                  <p>
                    <strong>{item.name}</strong>
                  </p>
                )}
                {item.points.some((p) => p.trim() !== "") && (
                  <ul className="work-points-list">
                    {item.points
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

        {/* Remaining optional sections preview */}
        {[
          {
            key: 'certifications',
            titleField: 'title',
            subtitleField: 'issuer',
            descField: "points",
          },
          {
            key: "volunteering",
            titleField: "role",
            subtitleField: null,
            descField: "description",
          },
          {
            key: "awards",
            titleField: "title",
            subtitleField: null,
            descField: null,
          },
          {
            key: "academicSupport",
            titleField: "role",
            subtitleField: null,
            descField: "description",
          },
        ].map(({ key, titleField, subtitleField, descField }) =>
          hasContent(
            cvData[key],
            Object.keys(cvData[key][0]).filter((k) => k !== "id")
          ) && (
            <div key={key}>
              <h2>{key.toUpperCase()}</h2>
              <hr />
              {cvData[key].map((item) => (
                <div key={item.id} className="optional-preview-entry">
                  <div className="optional-preview-header">
                    <span className="optional-preview-title">
                      <strong>{item[titleField]}</strong>
                    </span>
                    {(item.from || item.to) && (
                       <span className="optional-preview-date">
                      {formatMonthYear(item.from)}
                      {item.from && item.to ? " - " : ""}
                      {formatMonthYear(item.to)}
                    </span>
                    )}
                  </div>
                   {subtitleField && item[subtitleField] && (
                      <p className="optional-preview-desc">{item[subtitleField]}</p>
                    )}
                  {descField && item[descField] && (
                    <ul className="option-preview-list">
                      {(Array.isArray(item[descField])
                        ? item[descField].filter((line) => line.trim() !== "")
                        : item[descField].split("\n").filter((line) => line.trim() !== "")
                      ).map((line, index) => <li key={index}>{line}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>

      <div className="preview-action">
        <button className="btn-edit" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button className="btn-download" onClick={() => {
          playSuccess();
          handlePrint();
        }}>
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default WorkCvForm;