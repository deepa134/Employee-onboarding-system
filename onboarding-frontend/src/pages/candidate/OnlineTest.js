import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function OnlineTest() {

  const navigate = useNavigate();
  const { applicationId } = useParams();

  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const questions = [
    { id: 1, q: "2 + 3 = ?", options: ["4", "5", "6"], answer: "5" },
    { id: 2, q: "Capital of India?", options: ["Delhi", "Mumbai", "Chennai"], answer: "Delhi" },
    { id: 3, q: "5 * 6 = ?", options: ["30", "25", "20"], answer: "30" },
    { id: 4, q: "Java is ?", options: ["Language", "Database", "Browser"], answer: "Language" },
    { id: 5, q: "HTML stands for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Home Tool Markup Language"], answer: "Hyper Text Markup Language" },
    { id: 6, q: "10 / 2 = ?", options: ["2", "5", "8"], answer: "5" },
    { id: 7, q: "React is used for?", options: ["Frontend", "Backend", "Database"], answer: "Frontend" },
    { id: 8, q: "15 - 5 = ?", options: ["5", "10", "15"], answer: "10" },
    { id: 9, q: "Spring Boot is ?", options: ["Framework", "IDE", "Browser"], answer: "Framework" },
    { id: 10, q: "Which is OOP?", options: ["Java", "HTML", "CSS"], answer: "Java" },
    { id: 11, q: "Binary of 2?", options: ["10", "11", "01"], answer: "10" },
    { id: 12, q: "Largest planet?", options: ["Earth", "Mars", "Jupiter"], answer: "Jupiter" },
    { id: 13, q: "Which is database?", options: ["MySQL", "React", "Node"], answer: "MySQL" },
    { id: 14, q: "3^2 = ?", options: ["6", "9", "12"], answer: "9" },
    { id: 15, q: "CSS is used for?", options: ["Styling", "Logic", "Database"], answer: "Styling" },
  ];

  const submitTest = async () => {

    if (submitting) return;

    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all 15 questions before submitting.");
      return;
    }

    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) score++;
    });

    try {
      setSubmitting(true);

      await axios.post(
        "http://localhost:8080/api/applications/submit-test",
        null,
        { params: { applicationId, score } }
      );

      alert(`Test Submitted Successfully!\nScore: ${score}/15`);
      navigate("/candidate/dashboard");

    } catch (error) {
      alert("Error submitting test");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>

      <h2 style={{ marginBottom: "20px" }}>Online Test</h2>

      {questions.map((q) => (
        <div key={q.id} style={{ marginBottom: "18px" }}>

          <p><b>{q.id}. {q.q}</b></p>

          {q.options.map((opt) => (
            <label key={opt} style={{ display: "block", marginBottom: "5px" }}>
              <input
                type="radio"
                name={`q-${q.id}`}
                value={opt}
                checked={answers[q.id] === opt}
                onChange={() =>
                  setAnswers({ ...answers, [q.id]: opt })
                }
              />
              {" "}{opt}
            </label>
          ))}

        </div>
      ))}

      <button
        onClick={submitTest}
        disabled={submitting}
        style={{
          marginTop: "20px",
          padding: "10px 18px",
          background: submitting ? "#888" : "#000",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        {submitting ? "Submitting..." : "Submit Test"}
      </button>

    </div>
  );
}

export default OnlineTest;
