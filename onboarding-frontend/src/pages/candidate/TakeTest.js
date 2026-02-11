const TakeTest = ({ application, onFinish }) => {
  const finishTest = () => {
    application.status = "Test Cleared";
    onFinish();
  };

  return (
    <div>
      <p>Test Date: {application.test.date}</p>
      <a href={application.test.link}>Take Test</a>
      <br /><br />
      <button onClick={finishTest}>Mark Test Completed</button>
    </div>
  );
};

export default TakeTest;
