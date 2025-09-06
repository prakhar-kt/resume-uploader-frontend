import { useState, useEffect } from "react";
import axios from "axios";

type Resume = {
  id: number;
  name: string;
  email: string;
  dob: string; // ISO date string from API
  state: string;
  gender: string;
  preferred_locations: string; // comma-separated from API
  image_path: string;
  resume_file_path: string;
};

const ResumeList = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get<Resume[]>(
          `${import.meta.env.VITE_API_URL}/resumes/allresumes`
        );
        setResumes(response.data);
      } catch (error) {
        console.error("Error fetching resumes:", error);
      }
    };
    fetchResumes();
  }, []);

  const formatGender = (g: string) =>
    g ? g.charAt(0).toUpperCase() + g.slice(1) : "";
  const formatDate = (d: string) => {
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? d : dt.toLocaleDateString();
  };

  return (
    <div className="resume-list">
      <h2>Resume List</h2>
      {resumes.length === 0 ? (
        <p>No resumes found</p>
      ) : (
        <table className="resume-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>DOB</th>
              <th>State</th>
              <th>Gender</th>
              <th>Preferred Locations</th>
              <th>Image</th>
              <th>Resume</th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((resume) => (
              <tr key={resume.id}>
                <td>{resume.id}</td>
                <td>{resume.name}</td>
                <td>{resume.email}</td>
                <td>{formatDate(resume.dob)}</td>
                <td>{resume.state}</td>
                <td>{formatGender(resume.gender)}</td>
                <td>{resume.preferred_locations}</td>
                <td>
                  {resume.image_path ? (
                    <a
                      href={resume.image_path}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={resume.image_path}
                        alt={`${resume.name}`}
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 6,
                          cursor: "zoom-in",
                        }}
                      />
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {resume.resume_file_path ? (
                    <a
                      href={resume.resume_file_path}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResumeList;
