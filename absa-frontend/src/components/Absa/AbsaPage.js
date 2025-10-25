import { useState } from "react";

function AbsaPage() {
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);

  const handleAnalyze = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>ABSA Analysis</h2>
      <textarea
        rows="5"
        cols="60"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your review here..."
      />
      <br />
      <button onClick={handleAnalyze} style={{ marginTop: "10px" }}>
        Analyze
      </button>

      <h3>Results:</h3>
      <ul>
        {results.map((item, idx) => (
          <li key={idx}>
            <strong>Aspect:</strong> {item.aspect} |{" "}
            <strong>Sentiment:</strong> {item.sentiment} |{" "}
            <strong>Sentence:</strong> {item.sentence}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AbsaPage;
