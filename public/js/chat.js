const messageInput = document.getElementById("messageInput");
const messagesBox = document.querySelector(".messages");
const chatForm = document.getElementById("messageForm");
const clearChatButton = document.getElementById("clearChat");
const chatStatus = document.getElementById("chatStatus");
const emptyState = document.getElementById("emptyState");
const storageKey = "tachy-chat-messages";
const messages = [];
const pendingReplies = [];
let replyTimer = null;

const botReplies = [
    "Hello! How are you? 😊",
    "I am Tachy, your chat assistant!",
    "Tell me something interesting!",
    "Wow, that’s cool!",
    "I am always here to chat 💬"
];

loadMessages();

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = messageInput.value.trim();
    if (!text) return;

    addMessage(text, "sent");
    messageInput.value = "";
    messageInput.focus();
    pendingReplies.push(botReplies[Math.floor(Math.random() * botReplies.length)]);
    showTyping();

    if (replyTimer === null) scheduleReply();
});

clearChatButton.addEventListener("click", () => {
    if (messages.length === 0 && pendingReplies.length === 0) return;
    if (!window.confirm("Clear this conversation from this browser?")) return;

    if (replyTimer !== null) {
        window.clearTimeout(replyTimer);
        replyTimer = null;
    }
    pendingReplies.length = 0;
    messages.length = 0;
    document.getElementById("typingIndicator")?.remove();
    renderMessages();

    try {
        window.localStorage.removeItem(storageKey);
        chatStatus.textContent = "Conversation cleared.";
    } catch (error) {
        reportStorageError("clear", error);
    }
});

function loadMessages() {
    try {
        const savedMessages = window.localStorage.getItem(storageKey);
        if (savedMessages === null) return;

        const parsedMessages = JSON.parse(savedMessages);
        if (!Array.isArray(parsedMessages) || !parsedMessages.every(isStoredMessage)) {
            throw new Error("Saved conversation has an invalid format.");
        }

        messages.push(...parsedMessages);
        renderMessages();
    } catch (error) {
        console.error("Could not load the saved conversation:", error);
        chatStatus.textContent = "Could not load the saved conversation. You can still chat, but it may not be saved.";
    }
}

function isStoredMessage(message) {
    return message !== null
        && typeof message === "object"
        && typeof message.text === "string"
        && (message.direction === "sent" || message.direction === "received")
        && typeof message.timestamp === "string"
        && !Number.isNaN(Date.parse(message.timestamp));
}

function addMessage(text, direction) {
    messages.push({ text, direction, timestamp: new Date().toISOString() });
    renderMessages();
    saveMessages();
}

function saveMessages() {
    try {
        window.localStorage.setItem(storageKey, JSON.stringify(messages));
        chatStatus.textContent = "Messages are saved in this browser.";
    } catch (error) {
        reportStorageError("save", error);
    }
}

function reportStorageError(action, error) {
    console.error(`Could not ${action} the saved conversation:`, error);
    chatStatus.textContent = `Could not ${action} the saved conversation. Check your browser storage settings.`;
}

function renderMessages() {
    messagesBox.replaceChildren();
    emptyState.hidden = messages.length > 0;
    messagesBox.appendChild(emptyState);

    for (const item of messages) {
        appendMessage(item);
    }
    messagesBox.scrollTop = messagesBox.scrollHeight;
}

function scheduleReply() {
    replyTimer = window.setTimeout(() => {
        const reply = pendingReplies.shift();
        if (reply) addMessage(reply, "received");

        if (pendingReplies.length > 0) {
            scheduleReply();
        } else {
            document.getElementById("typingIndicator")?.remove();
            replyTimer = null;
        }
    }, 1500);
}

function appendMessage(item) {
    const message = document.createElement("div");
    message.classList.add("message", item.direction);

    const messageText = document.createElement("p");
    messageText.textContent = item.text;
    message.appendChild(messageText);

    const timestamp = document.createElement("time");
    timestamp.dateTime = item.timestamp;
    timestamp.textContent = new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit"
    }).format(new Date(item.timestamp));
    message.appendChild(timestamp);

    messagesBox.appendChild(message);
    messagesBox.scrollTop = messagesBox.scrollHeight;
}

function showTyping() {
    if (document.getElementById("typingIndicator")) return;

    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("message", "received");
    typingIndicator.textContent = "Tachy is typing…";
    typingIndicator.id = "typingIndicator";
    messagesBox.appendChild(typingIndicator);
    messagesBox.scrollTop = messagesBox.scrollHeight;
}
