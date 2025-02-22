const chatBox = document.getElementById("chat-box");
const userInputField = document.getElementById("user-input");
const sendButton = document.querySelector(".sendButton");

sendButton.addEventListener('click', ()=>{
    sendMessage();

})

userInputField.addEventListener("keypress", (e) => {
    console.log("enter")
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const userInput = userInputField.value.trim();
    
    if (!userInput) return; 

    addUserMessage(userInput)
    userInputField.value = "";

    addLoading()
    chatBox.scrollTop = chatBox.scrollHeight;
    
    await getBotResponse(userInput)

}

function addUserMessage(userInput){
    chatBox.innerHTML += `
        <div class="user-message">
            <div class="message-content">
                You: ${userInput}
            </div>
        </div>
    `;
}

function addLoading(){
    chatBox.innerHTML += `
        <div class="bot-message loading">
            <div class="message-content">
                MovieBot: Thinking...
            </div>
        </div>
    `;
}

function removeLoadingIndicator() {
    const loadingElements = document.getElementsByClassName(LOADING_CLASS);
    if (loadingElements.length > 0) {
        loadingElements[0].remove();
    }
}

function addBotMessage(message) {
    chatBox.innerHTML += `
        <div class="bot-message">
            <div class="message-content">
                MovieBot: ${message}
            </div>
        </div>
    `;
}

function addErrorMessage(message) {
    chatBox.innerHTML += `
        <div class="${ERROR_CLASS}">
            <div class="message-content">
                Error: ${message}
            </div>
        </div>
    `;
}


async function getBotResponse(userInput) {

    try {
        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: REQUEST_HEADERS,
            body: `user_input=${encodeURIComponent(userInput)}`
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        
        removeLoadingIndicator();
        
        if (data.response?.trim()) {
            addBotMessage(data.response);
        } else {
            throw new Error("Empty response from server");
        }

    } catch (error) {

        removeLoadingIndicator();
        addErrorMessage(error.message);

    } finally {

        chatBox.scrollTop = chatBox.scrollHeight;

    }
}


