const TestStatus = ({ status }) => {
  let message = "";

  switch (status) {
    case "TEST_SCHEDULING":
      message = "Your application is received. Test scheduling in progress.";
      break;

    case "TEST_SCHEDULED":
      message = "Your test has been scheduled. Please check your email.";
      break;

    case "TEST_COMPLETED":
      message = "Test completed. Waiting for results.";
      break;

    default:
      message = "No test information available.";
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Test Status</h3>
      <p>{message}</p>
    </div>
  );
};

export default TestStatus;
