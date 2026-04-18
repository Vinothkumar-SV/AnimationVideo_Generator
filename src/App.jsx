import { useState } from "react";
import "./App.css";

function App() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const generateVideo = async () => {
    if (!topic.trim()) {
      alert("Enter topic");
      return;
    }

    setLoading(true);

    const canvas = document.getElementById("videoCanvas");
    const ctx = canvas.getContext("2d");

    const stream = canvas.captureStream(30);

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm"
    });

    let chunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = topic.replace(/\s/g, "_") + ".webm";
      a.click();

      setLoading(false);
    };

    recorder.start();

    const steps = [
      "Source Code",
      "Compiler",
      "Byte Code",
      "JVM",
      "Output"
    ];

    for (let i = 0; i < steps.length; i++) {
      ctx.clearRect(0, 0, 900, 500);

      ctx.fillStyle = "#0b1020";
      ctx.fillRect(0, 0, 900, 500);

      ctx.fillStyle = "#00eaff";
      ctx.font = "bold 40px Arial";
      ctx.fillText(topic, 220, 60);

      for (let j = 0; j <= i; j++) {
        ctx.fillStyle = "#00c3ff";
        ctx.fillRect(80 + j * 150, 220, 120, 70);

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(steps[j], 95 + j * 150, 260);
      }

      for (let a = 0; a < i; a++) {
        ctx.strokeStyle = "#00ff99";
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.moveTo(200 + a * 150, 255);
        ctx.lineTo(230 + a * 150, 255);
        ctx.stroke();
      }

      await new Promise((r) => setTimeout(r, 1000));
    }

    recorder.stop();
  };

  return (
    <div className="container">
      <h1>🎬 Animated Video Generator</h1>

      <input
        type="text"
        placeholder="Enter Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <br />

      <canvas
        id="videoCanvas"
        width="900"
        height="500"
      ></canvas>

      <br />

      <button onClick={generateVideo}>
        {loading ? "Generating..." : "Generate Video"}
      </button>
    </div>
  );
}

export default App;