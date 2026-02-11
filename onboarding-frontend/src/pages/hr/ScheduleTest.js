const ScheduleTest = ({ application, onClose }) => {
  const schedule = () => {
    application.status = "Test Scheduled";
    application.test = {
      date: "20 Feb 2026",
      link: "https://test-platform.com/mock-test"
    };
    onClose();
  };

  return (
    <div style={{ border: "2px solid black", padding: 10 }}>
      <h3>Schedule Test</h3>
      <p>Candidate: {application.name}</p>
      <button onClick={schedule}>Confirm Test</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default ScheduleTest;
