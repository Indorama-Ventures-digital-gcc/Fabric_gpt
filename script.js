
// ================================
// CONFIGURATION
// ================================

// 🔴 PASTE YOUR FABRIC PUBLISHED URL HERE
const FABRIC_AGENT_URL =
  "https://api.fabric.microsoft.com/v1/workspaces/ead04142-675e-4396-b02d-9f9cfaaf23d1/dataagents/8aa8d723-d45c-4187-9b49-bff742c141de/aiassistant/openai";

// ================================
// MAIN SEND FUNCTION
// ================================
async function sendMessage() {
  const input = document.getElementById("userInput");
  const chat = document.getElementById("chat-container");

  const userText = input.value.trim();
  if (!userText) return;

  // Show user message
  addMessage(userText, "user");
  input.value = "";

  // Show loading placeholder
  const loadingId = addMessage("Thinking…", "bot");

  try {
    // Call Fabric Data Agent
    const response = await fetch(FABRIC_AGENT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // Add Authorization header here later if required
        // "Authorization": "Bearer <token>"
      },
      body: JSON.stringify({
        input: userText
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();

    // ✅ Adjust this if your Fabric response key differs
    const agentReply =
      data.output ||
      data.response ||
      data.message ||
      "No response returned from agent.";

    // Replace loading text
    document.getElementById(loadingId).innerText = agentReply;
  } catch (error) {
    document.getElementById(loadingId).innerText =
      "⚠️ Error calling Fabric Data Agent.";
    console.error("Fabric Agent Error:", error);
  }
}

// ================================
// HELPER: ADD MESSAGE TO CHAT
// ================================
function addMessage(text, type) {
  const chat = document.getElementById("chat-container");
  const message = document.createElement("div");

  const messageId = "msg-" + Date.now() + Math.floor(Math.random() * 1000);

  message.id = messageId;
  message.className = `message ${type}`;
  message.innerText = text;

  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;

  return messageId;
}

// ================================
// OPTIONAL: ENTER KEY SUPPORT
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");

  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });
});
