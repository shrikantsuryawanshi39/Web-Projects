const bot = document.querySelector(".chatbot-card");
const chatBody = document.getElementById("chat-body");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const aiBtn = document.querySelector(".ai-button");
const aiBtnImg = document.getElementById("ai-button-image");

let chatHistory = []; // Store conversation history

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});

function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    displayMessage("You", message);
    fetchAIResponse(message);
    userInput.value = "";
}

function displayMessage(sender, text) {
    const messageElement = document.createElement("p");

    // Format AI's response: Convert new lines, bold important words, fix bullet points
    const formattedText = text
        .replace(/\n/g, "<br>") // Convert new lines to <br>
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert **bold text** to <strong>
        // .replace(/- (.*?)(?:\n|$)/g, "• $1<br>"); // Convert bullet points

    messageElement.innerHTML = `<strong>${sender + " : " } </strong>  ${formattedText} <br> <br> <hr>`;
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
}

async function fetchAIResponse(userMessage) {
    const apiKey = "AIzaSyAzGO-5W0vzHI4uwtBnHb5f3uOZFOHyWHE";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Store user message in history
    chatHistory.push({ role: "user", parts: [{ text: userMessage }] });

    const requestBody = {
        contents: chatHistory // Send chat history
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        // console.log(data);

        let aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't find an answer.";

        // 🛠 Clean AI response formatting
        aiReply = aiReply.replace(/\*/g, ""); // Remove asterisks (*)
        aiReply = aiReply.replace(/\n/g, " "); // Replace new lines with spaces
        aiReply = aiReply.replace(/\s{2,}/g, " "); // Remove extra spaces

        // Store AI response in history
        chatHistory.push({ role: "model", parts: [{ text: aiReply }] });

        displayMessage("AI", aiReply);
    } catch (error) {
        displayMessage("AI", "Error connecting to AI.");
        console.error(error);
    }
}



//<<<<<<<<<<<<<<<<<<<==================== bot visibility when button is clicked ============================>>>>>>>>>>>>>>>>>>>>>
let show = false;
function showHideBot() {
    console.log(show);
    
    if (show === false) {
        bot.style.display = "block";
        show = true;   
       aiBtnImg.src = "/Utilities-folder/cancel-circle.svg";
       // console.log("Bot visibility", show);     
    }else if (show === true) {
        bot.style.display = "none";
        show = false;
        aiBtnImg.src = "/Utilities-folder/send btn ico/AI-setting-theme.svg";
        // console.log("bot not visible", show);     
    }
}

// event on ai btn click
aiBtn.addEventListener("click", showHideBot);