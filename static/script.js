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

function addUserMessage(userInput) {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-content'
    wrapper.className += ' user-message';
    
    const message = document.createElement('h4');
    message.className= 'chat-message'
    message.className+=' user'
    message.textContent = userInput;
    
    wrapper.appendChild(message);
    chatBox.appendChild(wrapper);
}

function addLoading() {
    const loader = document.createElement('div');
    loader.className = 'bot-message loading';
    loader.innerHTML = `
      <div class="message-content">
        <div class="bot">
          <span class="material-symbols-outlined">robot_2</span>
        </div>
        <h4 class="chat-message"> Thinking... </h4>
      </div>
    `;
    chatBox.appendChild(loader);
    return loader; // Return reference to loader
}

function removeLoadingIndicator() {
    const loadingElements = document.getElementsByClassName("loading");
    if (loadingElements.length > 0) {
        loadingElements[0].remove();
    }
}

function addBotMessage(message) {
    const container = document.createElement('div');
    container.className = 'message-content';
    
    const botIcon = document.createElement('div');
    botIcon.className = 'bot';
    botIcon.innerHTML = `<span class="material-symbols-outlined">robot_2</span>`;
    
    const text = document.createElement('h4');
    text.className ='chat-message'
    text.textContent = message;
    
    container.appendChild(botIcon);
    container.appendChild(text);
    chatBox.appendChild(container);
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
    let loader = null;
    
    try {
        loader = addLoading();
        chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });

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
        if (loader) removeLoadingIndicator();
        
        requestAnimationFrame(() => {
        chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: 'smooth'
        });
        });
    }
}


