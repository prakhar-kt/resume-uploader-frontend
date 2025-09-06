import { useState } from "react";
import axios from "axios";

const ResumeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    state: "",
    gender: "",
    preferred_locations: [] as string[],
  });
  const [image, setImage] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const indianStates = [
    "Andhra Pradesh",
    "Karnataka",
    "Maharashtra",
    "Tamil Nadu",
    "Telangana",
    "Goa",
  ];

  const locations = ["Bangalore", "Chennai", "Mumbai", "Delhi", "Hyderabad"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (e.target.name === "image") {
      setImage(file);
    } else if (e.target.name === "resume") {
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    submitData.append("dob", formData.dob);
    submitData.append("state", formData.state);
    submitData.append("gender", formData.gender);
    formData.preferred_locations.forEach((location) => {
      submitData.append("preferred_locations", location);
    });
    if (image) submitData.append("image", image);
    if (resumeFile) submitData.append("resume_file", resumeFile);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/resumes/upload`,
        submitData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Resume uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="resume-form">
      <h2>Upload Resume</h2>
      <form onSubmit={handleSubmit} className="resume-form">
        <div className="grid">
          <div className="field">
            <label htmlFor="name" className="label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="dob" className="label">
              DOB
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="state" className="label">
              State
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="select"
              required
            >
              <option value="">Select State</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label className="label">Gender</label>
          <div className="row">
            {["male", "female", "other"].map((gender) => (
              <label
                key={gender}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={formData.gender === gender}
                  onChange={handleChange}
                  required
                />
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="label">Preferred Locations</label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "8px",
            }}
          >
            {locations.map((location) => (
              <label
                key={location}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="checkbox"
                  value={location}
                  checked={formData.preferred_locations.includes(location)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        preferred_locations: [
                          ...formData.preferred_locations,
                          location,
                        ],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        preferred_locations:
                          formData.preferred_locations.filter(
                            (loc) => loc !== location
                          ),
                      });
                    }
                  }}
                />
                {location}
              </label>
            ))}
          </div>
          {formData.preferred_locations.length > 0 && (
            <div className="chips" style={{ marginTop: "8px" }}>
              {formData.preferred_locations.map((location, index) => (
                <span key={index} className="chip">
                  {location}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        preferred_locations:
                          formData.preferred_locations.filter(
                            (_, i) => i !== index
                          ),
                      });
                    }}
                    style={{
                      marginLeft: 8,
                      background: "none",
                      border: "none",
                      color: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="field">
          <label htmlFor="image" className="label">
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            className="file"
            accept="image/*"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="resume" className="label">
            Resume
          </label>
          <input
            type="file"
            id="resume"
            name="resume"
            onChange={handleFileChange}
            className="file"
            accept=".pdf,.doc,.docx"
            required
          />
        </div>

        <button type="submit" className="btn">
          Upload
        </button>
      </form>
    </div>
  );
};

export default ResumeForm;
