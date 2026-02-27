import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "./WorkCv.css";

function WorkCvForm() {
  const [isEditing, setIsEditing] = useState(true);
  const cvRef = useRef();

  const [cvData, setCvData] = useState({
    personalInfo: { name: "", phone: "", email: "", location: "" },
    education: [{ id: 1, degree: "", institution: "", from: "", to: "", grade: "" }],
    workExperience: [
      { id: 1, role: "", company: "", from: "", to: "", points: [""] },
    ],
    skills: [{ id: 1, name: "", points: [""] }],
    certifications: [{ id: 1, title: "", issuer: "", from: "", to: "" }],
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
      updated[workIndex] = { ...updated[workIndex], points: points.length ? points : [""] };
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
      updated[skillIndex] = { ...updated[skillIndex], points: points.length ? points : [""] };
      return { ...prev, skills: updated };
    });
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
    const monthName = new Date(year, month - 1).toLocaleString("default", { month: "short" });
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

  const sectionFieldLabels = {
    certifications: { title: "Certification Title", issuer: "Issuing Organization", from: "Start Date", to: "End Date" },
    volunteering: { role: "Role", description: "Description", from: "Start Date", to: "End Date" },
    awards: { title: "Award Title", from: "Date Awarded (From)", to: "Date Awarded (To)" },
    academicSupport: { role: "Role", description: "Description", from: "Start Date", to: "End Date" },
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
          {/* Personal Information */}
          <section>
            <h2>Personal Information</h2>
            {['name', 'phone', 'email', 'location'].map((field) => {
              const placeholders = {
                name: 'Raphael Edafe',
                phone: '+2349034483597',
                email: 'raphaeledafe@yahoo.com',
                location: 'Abuja, Nigeria',
              };
              return (
                <div key={field}>
                  <label htmlFor={`personal-${field}`}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    id={`personal-${field}`}
                    name={`personalInfo_${field}`}
                    type={field === 'email' ? 'email' : 'text'}
                    value={cvData.personalInfo[field]}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, [field]: e.target.value },
                      })
                    }
                    placeholder={placeholders[field]}
                  />
                </div>
              );
            })}
          </section>

          {/* Education */}
          <section>
            <h2>Education</h2>
            {cvData.education.map((edu, i) => (
              <div key={edu.id}>
                <div>
                  <label htmlFor={`edu-degree-${i}`}>Degree / Qualification</label>
                  <input
                    id={`edu-degree-${i}`}
                    name={`education_${i}_degree`}
                    placeholder="Bachelor of Science in Computer Science"
                    value={edu.degree}
                    onChange={(e) => updateSection('education', i, 'degree', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor={`edu-institution-${i}`}>Institution</label>
                  <input
                    id={`edu-institution-${i}`}
                    name={`education_${i}_institution`}
                    placeholder="University of Lagos"
                    value={edu.institution}
                    onChange={(e) => updateSection('education', i, 'institution', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor={`edu-from-${i}`}>Start Date</label>
                  <input
                    id={`edu-from-${i}`}
                    name={`education_${i}_from`}
                    type="month"
                    value={edu.from}
                    onChange={(e) => updateSection('education', i, 'from', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor={`edu-to-${i}`}>End Date</label>
                  <input
                    id={`edu-to-${i}`}
                    name={`education_${i}_to`}
                    type="month"
                    value={edu.to}
                    onChange={(e) => updateSection('education', i, 'to', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor={`edu-grade-${i}`}>Grade / Class of Degree</label>
                  <input
                    id={`edu-grade-${i}`}
                    name={`education_${i}_grade`}
                    type="text"
                    placeholder="First Class, 4.52"
                    value={edu.grade}
                    onChange={(e) => updateSection('education', i, 'grade', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addItem('education', { id: Date.now(), degree: '', institution: '', from: '', to: '', grade: '' })
              }
            >
              Add Education
            </button>
          </section>

          {/* Work Experience */}
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
                    onChange={(e) => updateSection('workExperience', i, 'role', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor={`work-company-${i}`}>Company / Organization</label>
                  <input
                    id={`work-company-${i}`}
                    name={`workExperience_${i}_company`}
                    placeholder="Acme Corp"
                    value={work.company}
                    onChange={(e) => updateSection('workExperience', i, 'company', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor={`work-from-${i}`}>Start Date</label>
                  <input
                    id={`work-from-${i}`}
                    name={`workExperience_${i}_from`}
                    type="month"
                    value={work.from}
                    onChange={(e) => updateSection('workExperience', i, 'from', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor={`work-to-${i}`}>End Date</label>
                  <input
                    id={`work-to-${i}`}
                    name={`workExperience_${i}_to`}
                    type="month"
                    value={work.to}
                    onChange={(e) => updateSection('workExperience', i, 'to', e.target.value)}
                  />
                </div>

                {/* Responsibilities / Achievements */}
                <div className="work-points">
                  <label>Responsibilities / Achievements</label>
                  {work.points.map((point, pi) => (
                    <div key={pi} className="work-point-row">
                      <input
                        id={`work-point-${i}-${pi}`}
                        name={`workExperience_${i}_point_${pi}`}
                        type="text"
                        placeholder={`Point ${pi + 1}: e.g. Led a team of 5 engineers...`}
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
                addItem('workExperience', { id: Date.now(), role: '', company: '', from: '', to: '', points: [''] })
              }
            >
              Add Work Experience
            </button>
          </section>

          {/* Skills — separate from generic optional sections to support bullet points */}
          <section>
            <h2>Skills (Optional)</h2>
            {cvData.skills.map((skill, i) => (
              <div key={skill.id} className="work-experience-entry">
                <div>
                  <label htmlFor={`skills-name-${i}`}>Skill Name</label>
                  <input
                    id={`skills-name-${i}`}
                    name={`skills_${i}_name`}
                    placeholder="e.g. Programming Languages"
                    value={skill.name}
                    onChange={(e) => updateSection('skills', i, 'name', e.target.value)}
                  />
                </div>
                <div className="skill-points">
                  {skill.points.map((point, pi) => (
                    <div key={pi} className="skill-point-row">
                      <input
                        id={`skill-point-${i}-${pi}`}
                        name={`skills_${i}_point_${pi}`}
                        type="text"
                        placeholder={`e.g. Python, JavaScript, C++`}
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
                addItem('skills', { id: Date.now(), name: '', points: [''] })
              }
            >
              Add Skill
            </button>
          </section>

          {/* Remaining Optional Sections */}
          {[
            { key: 'certifications', title: 'Certifications', fields: ['title', 'issuer', 'from', 'to'] },
            { key: 'volunteering', title: 'Volunteering', fields: ['role', 'description', 'from', 'to'] },
            { key: 'awards', title: 'Awards', fields: ['title', 'from', 'to'] },
            { key: 'academicSupport', title: 'Academic Support', fields: ['role', 'description', 'from', 'to'] },
          ].map((section) => (
            <section key={section.key}>
              <h2>{section.title} (Optional)</h2>
              {cvData[section.key].map((item, i) => (
                <div key={item.id}>
                  {section.fields.map((field) => {
                    const inputId = `${section.key}-${field}-${i}`;
                    const labelText =
                      sectionFieldLabels[section.key]?.[field] ||
                      field.charAt(0).toUpperCase() + field.slice(1);
                    return (
                      <div key={field}>
                        <label htmlFor={inputId}>{labelText}</label>
                        <input
                          id={inputId}
                          name={`${section.key}_${i}_${field}`}
                          type={field === 'from' || field === 'to' ? 'month' : 'text'}
                          placeholder={labelText}
                          value={item[field]}
                          onChange={(e) => updateSection(section.key, i, field, e.target.value)}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  addItem(section.key, {
                    id: Date.now(),
                    ...Object.fromEntries(section.fields.map((f) => [f, ''])),
                  })
                }
              >
                Add {section.title}
              </button>
            </section>
          ))}

          <div className="form-button">
            <button type="button" onClick={() => setIsEditing(false)}>
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
          {cvData.personalInfo.phone} || {cvData.personalInfo.email} || {cvData.personalInfo.location}
        </p>

        {/* Education preview */}
        {hasContent(cvData.education, ['degree', 'institution', 'from', 'to', 'grade']) && (
          <div>
            <h2>EDUCATION</h2>
            <hr />
            {cvData.education.map((item) => (
              <div key={item.id}>
                <p>
                  <strong>{item.degree}</strong>
                  {item.institution && ` — ${item.institution}`}
                  {(item.from || item.to) && (
                    <span> ({formatMonthYear(item.from)} → {formatMonthYear(item.to)})</span>
                  )}
                </p>
                {item.grade && <p className="edu-grade">Grade: {item.grade}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Work Experience preview */}
        {hasContent(cvData.workExperience, ['role', 'company', 'from', 'to', 'points']) && (
          <div>
            <h2>WORK EXPERIENCE</h2>
            <hr />
            {cvData.workExperience.map((item) => (
              <div key={item.id} className="work-preview-entry">
                <p>
                  <strong>{item.role}</strong>
                  {item.company && ` — ${item.company}`}
                  {(item.from || item.to) && (
                    <span> ({formatMonthYear(item.from)} → {formatMonthYear(item.to)})</span>
                  )}
                </p>
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

        {/* Skills preview — handled separately to support bullet points */}
        {hasContent(cvData.skills, ['name', 'points']) && (
          <div>
            <h2>SKILLS</h2>
            <hr />
            {cvData.skills.map((item) => (
              <div key={item.id} className="work-preview-entry">
                {item.name && <p><strong>{item.name}</strong></p>}
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
          { key: 'certifications', titleField: 'title', subtitleField: 'issuer', descField: null },
          { key: 'volunteering', titleField: 'role', subtitleField: null, descField: 'description' },
          { key: 'awards', titleField: 'title', subtitleField: null, descField: null },
          { key: 'academicSupport', titleField: 'role', subtitleField: null, descField: 'description' },
        ].map(({ key, titleField, subtitleField, descField }) =>
          hasContent(cvData[key], Object.keys(cvData[key][0]).filter((k) => k !== 'id')) && (
            <div key={key}>
              <h2>{key.toUpperCase()}</h2>
              <hr />
              {cvData[key].map((item) => (
                <div key={item.id} className="optional-preview-entry">
                  <div className="optional-preview-header">
                    <span className="optional-preview-title">
                      <strong>{item[titleField]}</strong>
                      {subtitleField && item[subtitleField] && ` — ${item[subtitleField]}`}
                    </span>
                    {(item.from || item.to) && (
                      <span className="optional-preview-date">
                        {formatMonthYear(item.from)}{item.from && item.to ? ' – ' : ''}{formatMonthYear(item.to)}
                      </span>
                    )}
                  </div>
                  {descField && item[descField] && (
                    <p className="optional-preview-desc">{item[descField]}</p>
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
        <button className="btn-download" onClick={handlePrint}>
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default WorkCvForm;