import { useState } from "react";

const PostInternship = ({ onPost }) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [ctc, setCtc] = useState("");

  const submit = (e) => {
    e.preventDefault();

    onPost({
      id: Date.now(),
      title,
      location,
      ctc,
      status: "Posted",
    });

    setTitle("");
    setLocation("");
    setCtc("");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 15 }}>
      <h3>Post New Internship</h3>

      <form onSubmit={submit}>
        <input
          placeholder="Internship Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br /><br />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <br /><br />

        <input
          placeholder="CTC (per annum)"
          value={ctc}
          onChange={(e) => setCtc(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Post Internship</button>
      </form>
    </div>
  );
};

export default PostInternship;
