function UploadChat() {
  const [chatText, setChatText] = useState("");
  const [traits, setTraits] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("chat_text", chatText);
    
    const res = await fetch("http://localhost:8000/upload_chat/", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    setTraits(data.profile_traits);
  };

  return (
    <div>
      <h2>Upload Chat</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="10"
          cols="50"
          value={chatText}
          onChange={(e) => setChatText(e.target.value)}
          placeholder="Paste your chat text here..."
        />
        <br />
        <button type="submit">Analyze</button>
      </form>
      {traits && <pre>{JSON.stringify(traits, null, 2)}</pre>}
    </div>
  );
}
