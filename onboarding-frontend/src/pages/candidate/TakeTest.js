import { useNavigate } from "react-router-dom";

const TakeTest = ({ application, onFinish }) => {

  const navigate = useNavigate();

  const finishTest = () => {
    application.status = "Test Cleared";

    if (onFinish) {
      onFinish();
    }

    navigate("/candidate");   
  };

  return (
    <div>
      <p>Test Date: {application.test.date}</p>

      <a href={application.test.link} target="_blank" rel="noreferrer">
        Take Test
      </a>

      <br /><br />

      <button onClick={finishTest}>
        Mark Test Completed
      </button>
    </div>
  );
};

export default TakeTest;
