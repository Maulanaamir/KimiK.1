import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Ambil API key dan model dari env
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const model = import.meta.env.VITE_GOOGLE_MODEL;

  // Inisialisasi client GoogleGenAI dengan API key
  const ai = new GoogleGenAI({ apiKey });

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      // Panggil generateContent dari model yg di env
      const response = await ai.models.generateContent({
        model,
        contents: input,
      });

      // Ambil text balasan dari response
      const aiReply = response.text;

      const aiMessage = { role: "assistant", content: aiReply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `[Error]: ${error.message}` },
      ]);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid gray",
          padding: 10,
          marginBottom: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{ textAlign: msg.role === "user" ? "right" : "left" }}
          >
            <b>{msg.role === "user" ? "You" : "Gemini"}:</b> {msg.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Tulis pesan..."
        style={{ width: "80%", marginRight: 10 }}
      />
      <button onClick={sendMessage}>Kirim</button>
    </div>
  );
}
