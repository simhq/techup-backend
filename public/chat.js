document.getElementById("chat-form").addEventListener("submit", async function(event) {
    event.preventDefault();  // Prevent default form submission behavior
    
    const userMessage = document.getElementById("user-input").value;
    if (userMessage.trim() === "") return;  // Don't submit empty messages
    
    // Display the user's message in the chat
    displayMessage(userMessage, "user");

    try {
        // Make an API call to OpenAI (client-side)
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: userMessage,
            }),
        });

        const data = await response.json();
        const aiMessage = data.reply.trim();  // Extract the AI's response

        // Display the AI's response in the chat
        displayMessage(aiMessage, "ai");
    } catch (error) {
        console.error("Error:", error);
        displayMessage("Error occurred. Please try again.", "error");
    }

    // Clear the input field after submission
    document.getElementById("user-input").value = "";
});

// Function to display messages in the chat window
function displayMessage(message, sender) {
    const chatMessages = document.getElementById("chat-messages");
    const messageDiv = document.createElement("div");
    
    // Determine class based on who is sending the message
    messageDiv.className = sender === "user" ? "user-message" : "ai-message";
    
    // Insert the message content
    messageDiv.textContent = message;
    
    // Append the new message to the chat
    chatMessages.appendChild(messageDiv);

    // Scroll to the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
