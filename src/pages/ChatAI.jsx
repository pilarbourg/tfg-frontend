import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import ChatSidebar from "../components/ChatSidebar";

function ChatAI() {
  const [dbStatus, setDbStatus] = useState("ok");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: (
        <>
          <strong>Atlas Research Assistant</strong> has been initialized. This
          system is configured with a curated index of peer-reviewed Parkinson's
          neuro-metabolic literature and clinical datasets sourced from{" "}
          <strong>PubMed</strong>. Knowledge is strictly limited to this
          research database. Ask a question to get started.
        </>
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newUserMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.answer, sources: data.sources },
      ]);
    } catch (error) {
      setDbStatus("error");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        width: "100%",
        top: 0,
        left: 0,
      }}
    >
      <div className="fab-container">
        <div className="fab-label">
          <span className="fab-label-text">How to use</span>
          <span className="fab-arrow">→</span>
        </div>
        <Link to="/About" title="About this Project" className="fab-button">
          ?
        </Link>
      </div>

      <div className="grain-overlay" />

      <Header />

      <div className="atlas-container-chatai">
        <ChatSidebar />

        <div className="right-col">
          <div className="atlas-chat-wrapper">
            <header className="atlas-chat-header">
              <div
                className="status-indicator"
                style={{
                  background: dbStatus === "error" ? "#ff4444" : undefined,
                  boxShadow:
                    dbStatus === "error" ? "0 0 8px #ff4444" : undefined,
                  animation: dbStatus === "error" ? "none" : undefined,
                }}
              />
              <h1>
                Atlas <span>Research Assistant</span>
              </h1>
              <span className="model-badge">
                Llama 3{" "}
                <img src="src/assets/ollama.png" alt="icon" width="20" />
              </span>
            </header>

            <div className="atlas-chat-window">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}-message`}>
                  <div className="message-content">{msg.content}</div>
                  {msg.sources && (
                    <ul className="sources-list">
                      {msg.sources.map((s, i) => (
                        <li key={i}>
                          {s.title} ({s.url})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="message ai-message">Atlas is thinking...</div>
              )}
            </div>

            <div className="atlas-input-area">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask Atlas about research..."
                className="atlas-input"
              />
              <button className="atlas-send-btn" onClick={handleSendMessage}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ChatAI;
