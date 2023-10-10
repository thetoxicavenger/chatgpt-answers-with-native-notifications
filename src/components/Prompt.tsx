import React, { useState, useEffect } from "react";

const Prompt: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check for Notification API support
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    // Request permission
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }

    // Trigger notification when answer goes from falsy to truthy
    if (answer) {
      new Notification("New Answer", {
        body: answer,
      });
    }
  }, [answer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setAnswer("");
    setLoading(true);

    if (prompt.trim() === "") return;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const { answer: apiAnswer } = await response.json();

      setAnswer(apiAnswer);
      setPrompt("");
    } catch (error) {
      console.error("Error sending prompt:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your message..."
            style={{
              width: "100%",
              padding: "10px",
              paddingRight: loading ? "40px" : "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {loading && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #333",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                animation: "spin 1s linear infinite",
              }}
            ></div>
          )}
        </div>
        <button type="submit" style={{ display: "none" }}>
          Send
        </button>
      </form>
      {/* Answer section */}
      {answer && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#e6e6e6",
            color: "#333",
          }}
        >
          {answer}
        </div>
      )}
    </>
  );
};

export default Prompt;
