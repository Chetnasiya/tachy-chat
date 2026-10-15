const messageInput = document.getElementById("messageInput");
const messagesBox = document.querySelector(".messages");
const chatForm = document.getElementById("messageForm");
const pendingReplies = [];
let replyTimer = null;

const botReplies = [
    "Hello! How are you? 😊",
    "I am Tachy, your chat assistant!",
    "Tell me something interesting!",
    "Wow, that’s cool!",
    "I am always here to chat 💬"
];

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = messageInput.value.trim();
    if (!text) return;

    appendMessage(text, "sent");
    messageInput.value = "";
    messageInput.focus();
    pendingReplies.push(botReplies[Math.floor(Math.random() * botReplies.length)]);
    showTyping();

    if (replyTimer === null) scheduleReply();
});

function scheduleReply() {
    replyTimer = window.setTimeout(() => {
        appendMessage(pendingReplies.shift(), "received");

        if (pendingReplies.length > 0) {
            scheduleReply();
        } else {
            document.getElementById("typingIndicator")?.remove();
            replyTimer = null;
        }
    }, 1500);
}

function appendMessage(text, direction) {
    const message = document.createElement("div");
    message.classList.add("message", direction);

    const messageText = document.createElement("p");
    messageText.textContent = text;
    message.appendChild(messageText);
    messagesBox.appendChild(message);
    messagesBox.scrollTop = messagesBox.scrollHeight;
}

function showTyping() {
    if (document.getElementById("typingIndicator")) return;

    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("message", "received");
    typingIndicator.textContent = "Tachy is typing...";
    typingIndicator.id = "typingIndicator";
    messagesBox.appendChild(typingIndicator);
    messagesBox.scrollTop = messagesBox.scrollHeight;
}
