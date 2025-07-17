// Chat page component
import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/chat?user_input=${encodeURIComponent(input)}`
    );
    const data = await res.json();
    setResponse(data.persona_reply);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Talk to Aarav 💬</h1>
      <input
        className="border px-2 py-1 mr-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Say something..."
      />
      <button
        className="bg-blue-500 text-white px-4 py-1 rounded"
        onClick={sendMessage}
      >
        Send
      </button>
      <div className="mt-4 bg-gray-100 p-4 rounded">{response}</div>
    </div>
  );
}
