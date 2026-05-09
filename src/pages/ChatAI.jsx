import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import ChatSidebar from "../components/ChatSidebar";

function TypingIndicator() {
  return (
    <div className="message ai-message typing-indicator-bubble">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </div>
  );
}

function SourcesList({ sources }) {
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 3;
  const visible = expanded ? sources : sources.slice(0, LIMIT);
  const hasMore = sources.length > LIMIT;

  return (
    <div className="sources-container">
      <span className="sources-label">
        {sources.length} source{sources.length !== 1 ? "s" : ""}
      </span>
      <div className="sources-list">
        {visible.map((s, i) => (
          <SourceChip key={i} s={s} i={i} />
        ))}
      </div>
      {hasMore && (
        <button
          className="sources-toggle"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? (
            <>Show less <span className="toggle-arrow">↑</span></>
          ) : (
            <>Show {sources.length - LIMIT} more <span className="toggle-arrow">↓</span></>
          )}
        </button>
      )}
    </div>
  );
}

function SourceChip({ s, i }) {
  const handleClick = () => {
    const url = s.url.startsWith("http") ? s.url : `https://doi.org/${s.url}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <button onClick={handleClick} className="source-chip">
      <span className="source-index">{i + 1}</span>
      <div className="source-text">
        <div className="source-title">{s.title}</div>
        <div className="source-url">
          {s.url.startsWith("http") ? s.url : `doi.org/${s.url}`}
        </div>
      </div>
      <svg
        className="source-icon"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M2 10L10 2M10 2H5M10 2v5" />
      </svg>
    </button>
  );
}

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
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userQuery = input;
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: userQuery }]);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessageAdded = false;
      let pendingSources = null;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const rawChunk = decoder.decode(value, { stream: true });
        const lines = rawChunk.split("\n");

        for (const line of lines) {
          if (!line.trim()) continue;
          let parsed;
          try {
            parsed = JSON.parse(line);
          } catch {
            continue;
          }

          if (parsed.type === "sources") {
            pendingSources = parsed.data; // store, apply after stream ends
          } else if (parsed.type === "text") {
            if (!aiMessageAdded) {
              setIsLoading(false);
              setMessages((prev) => [
                ...prev,
                { role: "ai", content: parsed.data, sources: [] },
              ]);
              aiMessageAdded = true;
            } else {
              setMessages((prev) => {
                const next = [...prev];
                const last = { ...next[next.length - 1] };
                last.content = (last.content || "") + parsed.data;
                next[next.length - 1] = last;
                return next;
              });
            }
          }
        }
      }

      if (pendingSources && pendingSources.length > 0) {
        setTimeout(() => {
          setMessages((prev) => {
            const next = [...prev];
            const last = { ...next[next.length - 1] };
            if (last.role === "ai") {
              last.sources = pendingSources;
              next[next.length - 1] = last;
            }
            return next;
          });
        }, 400);
      }
    } catch (error) {
      setDbStatus("error");
      console.error("Streaming Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Something went wrong. Please try again.",
          sources: [],
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{ position: "absolute", width: "100%", top: 0, left: 0 }}
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
                  {msg.content && (
                    <div className="message-content">{msg.content}</div>
                  )}
                  {msg.sources && msg.sources.length > 0 && (
                    <SourcesList sources={msg.sources} />
                  )}
                </div>
              ))}

              {isLoading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            <div className="atlas-input-area">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSendMessage()
                }
                placeholder="Ask Atlas about research..."
                className="atlas-input"
                disabled={isLoading}
              />
              <button
                className="atlas-send-btn"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
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
