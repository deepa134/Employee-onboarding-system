import { applications } from "../../data/store";
import { useState } from "react";

const ApplyInternship = ({ internship, onDone }) => {
  const [name, setName] = useState("");

  const submit = () => {
    applications.push({
      id: Date.now(),
      name,
      internship,
      status: "Applied",
    });
    onDone();
  };

  return (
    <div>
      <h3>Apply – {internship.title}</h3>
      <input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
      <br /><br />
      <input type="file" />
      <br /><br />
      <button onClick={submit}>Submit Application</button>
    </div>
  );
};

export default ApplyInternship;
