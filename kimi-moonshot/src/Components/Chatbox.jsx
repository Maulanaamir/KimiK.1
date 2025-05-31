import React, { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: "anthropic/claude-3.7-sonnet", // model ID valid
            messages: [{ role: "user", content: "Halo! Bisa bantu aku?" }],
          }),
        }
      );

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        const aiMessage = {
          role: "assistant",
          content: data.choices[0].message.content,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Kalau responnya gak sesuai harapan
        const errMsg = data.error?.message || "No response from AI.";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: errMsg },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${error.message}` },
      ]);
    }
  }

  return (
    <div>
      <div
        style={{
          height: 300,
          overflowY: "auto",
          border: "1px solid gray",
          padding: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{ textAlign: msg.role === "user" ? "right" : "left" }}
          >
            <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
