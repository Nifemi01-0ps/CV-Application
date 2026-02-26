import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "./WorkCv.css";

function WorkCvForm() {
  const [isEditing, setIsEditing] = useState(true);
  const cvRef = useRef(); // Printable ref

  const [cvData, setCvData] = useState({
    personalInfo: { name: "", phone: "", email: "", location: "" },
    education: [{ id: 1, degree: "", institution: "", from: "", to: "" }],
    workExperience: [
      { id: 1, role: "", company: "", from: "", to: "", description: "" },
    ],
    skills: [{ id: 1, name: "" }],
    certifications: [{ id: 1, title: "", issuer: "", from: "", to: "" }],
    volunteering: [{ id: 1, role: "", description: "", from: "", to: "" }],
    awards: [{ id: 1, title: "", from: "", to: "" }],
    academicSupport: [{ id: 1, role: "", description: "", from: "", to: "" }],
  });

  // ===== Helper functions =====
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

  const hasContent = (section, fields) =>
    section.some((item) =>
      fields.some((field) => item[field]?.trim() !== "")
    );

  // Format month-year for preview
  const formatMonthYear = (value) => {
    if (!value) return "";
    const [year, month] = value.split("-");
    const monthName = new Date(year, month - 1).toLocaleString("default", { month: "short" });
    return `${monthName} ${year}`;
  };

  // PDF Export
  const handlePrint = useReactToPrint({
    contentRef: cvRef,
    documentTitle: `${cvData.personalInfo.name || "CV"}_Resume`,
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .cv-preview {
          font-family: "Inter", sans-serif;
        }
        .cv-preview h1, .cv-preview h2 {
          font-family: "Fraunces", serif;
        }
      }
    `,
  });

  // Editing view
  if (isEditing) {
    return (
      <div className="cv-form-wrapper">
        <form className="cv-form" onSubmit={(e) => e.preventDefault()}>
          {/* Personal Info */}
          <section>
            <h2>Personal Information</h2>
            {["name", "phone", "email", "location"].map((field) => {
              const placeholders = {
                name: 'Raphael Edafe',
                phone: '+2349034483597',
                email: 'raphaeledafe@yahoo.com',
                location: 'Abuja, Nigeria',
              };
              return (
                <div key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
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

          {/* Education */}
          <section>
            <h2>Education</h2>
            {cvData.education.map((edu, i) => (
              <div key={edu.id}>
                <input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    updateSection("education", i, "degree", e.target.value)
                  }
                />
                <input
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) =>
                    updateSection("education", i, "institution", e.target.value)
                  }
                />
                <input
                  type="month"
                  value={edu.from}
                  onChange={(e) =>
                    updateSection("education", i, "from", e.target.value)
                  }
                />
                <input
                  type="month"
                  value={edu.to}
                  onChange={(e) =>
                    updateSection("education", i, "to", e.target.value)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addItem("education", {
                  id: Date.now(),
                  degree: "",
                  institution: "",
                  from: "",
                  to: "",
                })
              }
            >
              Add Education
            </button>
          </section>

          {/* Work Experience */}
          <section>
            <h2>Work Experience</h2>
            {cvData.workExperience.map((work, i) => (
              <div key={work.id}>
                <input
                  placeholder="Role"
                  value={work.role}
                  onChange={(e) =>
                    updateSection("workExperience", i, "role", e.target.value)
                  }
                />
                <input
                  placeholder="Company"
                  value={work.company}
                  onChange={(e) =>
                    updateSection("workExperience", i, "company", e.target.value)
                  }
                />
                <input
                  type="month"
                  value={work.from}
                  onChange={(e) =>
                    updateSection("workExperience", i, "from", e.target.value)
                  }
                />
                <input
                  type="month"
                  value={work.to}
                  onChange={(e) =>
                    updateSection("workExperience", i, "to", e.target.value)
                  }
                />
                <textarea
                  placeholder="Description"
                  value={work.description}
                  onChange={(e) =>
                    updateSection(
                      "workExperience",
                      i,
                      "description",
                      e.target.value
                    )
                  }
                />
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
                  description: "",
                })
              }
            >
              Add Work Experience
            </button>
          </section>

          {/* Optional Sections */}
          {[
            { key: "skills", title: "Skills", fields: ["name"] },
            { key: "certifications", title: "Certifications", fields: ["title", "issuer", "from", "to"] },
            { key: "volunteering", title: "Volunteering", fields: ["role", "description", "from", "to"] },
            { key: "awards", title: "Awards", fields: ["title", "from", "to"] },
            { key: "academicSupport", title: "Academic Support", fields: ["role", "description", "from", "to"] },
          ].map((section) => (
            <section key={section.key}>
              <h2>{section.title} (Optional)</h2>
              {cvData[section.key].map((item, i) => (
                <div key={item.id}>
                  {section.fields.map((field) => (
                    <input
                      key={field}
                      type={field === "from" || field === "to" ? "month" : "text"}
                      placeholder={field}
                      value={item[field]}
                      onChange={(e) =>
                        updateSection(section.key, i, field, e.target.value)
                      }
                    />
                  ))}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  addItem(section.key, {
                    id: Date.now(),
                    ...Object.fromEntries(section.fields.map((f) => [f, ""])),
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

  // ===== Preview view =====
  return (
    <div>
      <div className="cv-preview" ref={cvRef}>
        <h1>{cvData.personalInfo.name}</h1>
        <p className="details">
          {cvData.personalInfo.phone} || {cvData.personalInfo.email} ||{" "}
          {cvData.personalInfo.location}
        </p>

        {/* Render sections */}
        {["education", "workExperience"].map((section) =>
          hasContent(cvData[section], Object.keys(cvData[section][0]).filter(k => k !== "id")) && (
            <div key={section}>
              <h2>{section === "workExperience" ? "WORK EXPERIENCE" : "EDUCATION"}</h2>
              <hr />
              {cvData[section].map((item) => (
                <div key={item.id}>
                  {section === "workExperience" ? (
                    <p>
                      <strong>{item.role}</strong> - {item.company} ({formatMonthYear(item.from)} → {formatMonthYear(item.to)})
                    </p>
                  ) : (
                    <p>
                      <strong>{item.degree}</strong> - {item.institution} ({formatMonthYear(item.from)} → {formatMonthYear(item.to)})
                    </p>
                  )}
                  {item.description && <p>{item.description}</p>}
                </div>
              ))}
            </div>
          )
        )}

        {[
          "skills",
          "certifications",
          "volunteering",
          "awards",
          "academicSupport",
        ].map((section) =>
          hasContent(cvData[section], Object.keys(cvData[section][0]).filter(k => k !== "id")) && (
            <div key={section}>
              <h2>{section.toUpperCase()}</h2>
              <hr />
              {cvData[section].map((item) =>
                Object.entries(item).map(([key, value]) =>
                  key !== "id" && value && (key === "from" || key === "to" ? <p key={key}>{formatMonthYear(value)}</p> : <p key={key}>{value}</p>)
                )
              )}
            </div>
          )
        )}
      </div>
        <div className="preview-action">
          <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit</button>
          <button className="btn-download" onClick={handlePrint}>Download PDF</button>
        </div>
    </div>
  );
}

export default WorkCvForm;