const chatBox = document.querySelector(".chat-messages");
const userInputField = document.querySelector(".user-input");
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
                <h3 class ="speaker">: You</h3>
                <h4>${userInput}</h4>
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
    const loadingElements = document.getElementsByClassName("loading");
    if (loadingElements.length > 0) {
        loadingElements[0].remove();
    }
}

function addBotMessage(message) {
    chatBox.innerHTML += `
        <div class="message-content">
            <h3 class ="speaker">MovieBot :</h3>
            <h4>${message}</h4>
        </div>
    `;
}

function addErrorMessage(message) {
    chatBox.innerHTML += `
        <div class="error-message">
            <div class="message-content">
                Error: ${message}
            </div>
        </div>
    `;
}


async function getBotResponse(userInput) {

    try {
        const response = await fetch("/get_response", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
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


