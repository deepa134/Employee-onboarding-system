const internships = [
  { id: 1, title: "Java Intern", duration: "3 Months" },
  { id: 2, title: "React Intern", duration: "2 Months" },
];

const InternshipList = ({ onApply }) => {
  return (
    <div>
      <h3>Available Internships</h3>
      {internships.map((internship) => (
        <div key={internship.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <p><strong>{internship.title}</strong></p>
          <p>Duration: {internship.duration}</p>
          <button onClick={() => onApply(internship)}>Apply</button>
        </div>
      ))}
    </div>
  );
};

export default InternshipList;
