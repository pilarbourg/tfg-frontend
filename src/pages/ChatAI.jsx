import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import ChatSidebar from "../components/ChatSidebar";
import Footer from "../components/Footer";

const C = {
  surface: "#1D202C",
  border: "#1a2235",
  accent: "#526963",
  accent2: "#526963",
  text: "#c8d6e8",
  muted: "#4a5a72",
  bg: "#13151d",
  chatBg: "#f4f5f7",
  aiBubble: "#ffffff",
  aiText: "#1e293b",
  userBubble: "#31364B",
};

function renderWithCitations(text) {
  const parts = text.split(/(\([^)]*10\.\d{4,}[^)]*\))/g);
  return parts.map((part, i) => {
    if (/\(.*10\.\d{4,}/.test(part)) {
      const doi = part.slice(1, -1);
      const dois = doi.split(",").map((d) => d.trim());
      return (
        <span
          key={i}
          style={{
            fontSize: "0.8em",
            color: "#64748b",
            fontStyle: "italic",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.01em",
          }}
        >
          {" "}
          (
          {dois.map((d, j) => (
            <span key={j}>
              {j > 0 && ", "}
              <a
                href={`https://doi.org/${d}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#64748b", textDecoration: "underline" }}
                onClick={(e) => e.stopPropagation()}
              >
                {d}
              </a>
            </span>
          ))}
          )
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "14px 18px",
        width: "fit-content",
        background: C.aiBubble,
        border: `1px solid #e2e8f0`,
        borderRadius: "12px 12px 12px 2px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {[0, 0.2, 0.4].map((delay, i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#94a3b8",
            display: "block",
            animation: `bounce 1.2s ${delay}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}

function SourcesList({ sources }) {
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 3;
  const visible = expanded ? sources : sources.slice(0, LIMIT);
  const hasMore = sources.length > LIMIT;

  return (
    <div
      style={{
        marginTop: 12,
        paddingTop: 12,
        borderTop: `1px solid #e2e8f0`,
      }}
    >
      <span
        style={{
          display: "block",
          fontSize: 10,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#94a3b8",
          fontFamily: "'DM Mono', monospace",
          marginBottom: 8,
        }}
      >
        {sources.length} source{sources.length !== 1 ? "s" : ""}
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {visible.map((s, i) => (
          <SourceChip key={i} s={s} i={i} />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          style={{
            marginTop: 4,
            background: "none",
            border: "none",
            padding: "4px 0",
            fontSize: 12,
            fontWeight: 500,
            color: C.accent2,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontFamily: "inherit",
          }}
        >
          {expanded ? (
            <>
              Show less <span>↑</span>
            </>
          ) : (
            <>
              Show {sources.length - LIMIT} more <span>↓</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

function SourceChip({ s, i }) {
  const handleClick = () => {
    const cleanUrl = s.url.replace("_abs", "");
    const url = cleanUrl.startsWith("http")
      ? cleanUrl
      : `https://doi.org/${cleanUrl}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        background: "#D6D9DE",
        border: `1px solid #cbd5e1`,
        borderRadius: 8,
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        transition: "border-color 0.15s",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.accent2)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          background: "#C0C3C7",
          color: C.accent2,
          fontSize: 11,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {i + 1}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#1e293b",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {s.title}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#677280",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginTop: 1,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {s.url.replace("_abs", "").startsWith("http")
            ? s.url.replace("_abs", "")
            : `doi.org/${s.url.replace("_abs", "")}`}
        </div>
      </div>
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke="#94a3b8"
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
      content:
        "Atlas Research Assistant has been initialized. This system is configured with a curated index of peer-reviewed Parkinson's neuro-metabolic literature and clinical datasets sourced from PubMed. Knowledge is strictly limited to this research database. Ask a question to get started.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (messages.length <= 1) return;
    const el = chatWindowRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userQuery = input;
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: userQuery }]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat`, {
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
            pendingSources = parsed.data;
          } else if (parsed.type === "text") {
            if (!aiMessageAdded) {
              setIsLoading(false);
              setMessages((prev) => [
                ...prev,
                {
                  role: "ai",
                  content: parsed.data,
                  sources: [],
                  complete: false,
                },
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

      setMessages((prev) => {
        const next = [...prev];
        const last = { ...next[next.length - 1] };
        if (last.role === "ai") {
          last.complete = true;
          next[next.length - 1] = last;
        }
        return next;
      });

      if (pendingSources?.length > 0) {
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{ position: "absolute", width: "100%", top: 0, left: 0 }}
    >
      <div className="fab-container">
        <Link to="/About" title="About this Project" className="fab-button">
          ?
        </Link>
      </div>

      <div className="grain-overlay" />
      <Header />

      <div className="atlas-container-chatai" style={{ background: C.bg }}>
        <ChatSidebar />

        <div className="right-col" style={{ background: C.bg }}>
          <div
            style={{
              width: "90%",
              height: "70%",
              maxHeight: 1000,
              background: C.surface,
              borderRadius: 16,
              border: `1px solid ${C.border}`,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
            }}
          >
            <header
              style={{
                padding: "16px 24px",
                background: C.surface,
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: dbStatus === "error" ? "#ff4444" : "#4af0c4",
                  boxShadow:
                    dbStatus === "error"
                      ? "0 0 8px #ff4444"
                      : "0 0 8px #4af0c4",
                  animation:
                    dbStatus === "error"
                      ? "none"
                      : "heartbeat 2s infinite ease-in-out",
                }}
              />
              <h1
                style={{
                  fontSize: "1.1rem",
                  margin: 0,
                  flexGrow: 1,
                  letterSpacing: "1.25px",
                  textTransform: "uppercase",
                  color: C.muted,
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 500,
                }}
              >
                Atlas{" "}
                <span style={{ color: C.muted, opacity: 0.6 }}>
                  Research Assistant
                </span>
              </h1>
            </header>

            <div
              style={{
                flexGrow: 1,
                padding: 24,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                background: C.chatBg,
              }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    maxWidth: "85%",
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius:
                        msg.role === "user"
                          ? "12px 12px 2px 12px"
                          : "12px 12px 12px 2px",
                      background:
                        msg.role === "user" ? C.userBubble : C.aiBubble,
                      border: `1px solid ${
                        msg.role === "user" ? C.userBubble : "#e2e8f0"
                      }`,
                      color: msg.role === "user" ? "#fff" : C.aiText,
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                      boxShadow:
                        msg.role === "ai"
                          ? "0 1px 3px rgba(0,0,0,0.06)"
                          : "none",
                    }}
                  >
                    {msg.role === "ai" && msg.complete
                      ? renderWithCitations(msg.content)
                      : msg.content}
                  </div>
                  {msg.sources?.length > 0 && (
                    <SourcesList sources={msg.sources} />
                  )}
                </div>
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            <div
              style={{
                padding: 20,
                borderTop: `1px solid ${C.border}`,
                display: "flex",
                gap: 12,
                background: C.surface,
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSendMessage()
                }
                placeholder="Ask Atlas about research..."
                disabled={isLoading}
                style={{
                  flexGrow: 1,
                  padding: "12px 16px",
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  outline: "none",
                  background: C.bg,
                  color: C.text,
                  fontSize: "0.95rem",
                  fontFamily: "'Inter', sans-serif",
                  transition: "border-color 0.2s",
                  boxShadow: "inset 0 2px 16px rgba(0, 0, 0, 0.6)",
                }}
                onFocus={(e) => (e.target.style.borderColor = C.accent)}
                onBlur={(e) => (e.target.style.borderColor = C.border)}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                style={{
                  background: isLoading ? C.border : C.accent,
                  color: isLoading ? C.muted : C.bg,
                  border: "none",
                  padding: "0 16px",
                  borderRadius: 8,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="20"
                  height="20"
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

      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); box-shadow: 0 0 4px #4af0c4; }
          50% { transform: scale(1.2); box-shadow: 0 0 12px #4af0c4; }
          100% { transform: scale(1); box-shadow: 0 0 4px #4af0c4; }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
      <Footer />
    </motion.div>
  );
}

export default ChatAI;
