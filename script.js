document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (message) {
        displayMessage(':User  ' + message);
        input.value = '';
        // Simulate bot response
        setTimeout(() => {
            displayMessage('Bot: Thank you for your message! How can I assist you?');
        }, 1000);
    }
}

function displayMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
}

// Minimize/Expand functionality
document.getElementById('minimize-btn').addEventListener('click', function () {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'block' : 'none';
});
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const quickReplies = document.getElementById('quick-replies');
    const progressFill = document.getElementById('progress-fill');
    const resultCard = document.getElementById('result-card');
    const emailModal = document.getElementById('email-modal');
    const cancelEmailBtn = document.getElementById('cancel-email');
    const submitEmailBtn = document.getElementById('submit-email');
    
    // Conversation state
    let conversationStep = 0;
    let tileType = '';
    let area = '';
    let tileSize = '';
    let userPreferences = {};
    
    // Update progress bar
    function updateProgress(step) {
        const width = step * 25;
        progressFill.style.width = `${width}%`;
        document.querySelector('.progress-header span:last-child').textContent = `Step ${step} of 4`;
    }
    
    // Add a message to the chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
        
        // Add AI tag for bot messages
        if (!isUser) {
            const aiTag = document.createElement('div');
            aiTag.classList.add('ai-tag');
            aiTag.textContent = 'AI Powered';
            messageDiv.appendChild(aiTag);
        }
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator');
        typingDiv.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }
    
    // Remove typing indicator
    function removeTyping(typingElement) {
        typingElement.remove();
    }
    
    // Show quick replies
    function showQuickReplies(replies) {
        quickReplies.innerHTML = '';
        replies.forEach(reply => {
            const replyDiv = document.createElement('div');
            replyDiv.classList.add('quick-reply');
            replyDiv.textContent = reply;
            replyDiv.dataset.reply = reply;
            replyDiv.addEventListener('click', function() {
                handleQuickReply(reply);
            });
            quickReplies.appendChild(replyDiv);
        });
    }
    
    // Handle quick reply selection
    function handleQuickReply(reply) {
        addMessage(reply, true);
        
        // Track user preference
        if (conversationStep === 0) {
            userPreferences.tileType = reply;
        }
        
        // Simulate bot response after a short delay
        const typing = showTyping();
        setTimeout(() => {
            removeTyping(typing);
            processConversation(reply);
        }, 1000);
    }
    
    // Process conversation flow
    function processConversation(input) {
        switch(conversationStep) {
            case 0: // Tile type
                tileType = input.includes('Floor') ? 'floor' : 
                          input.includes('Wall') ? 'wall' : 'both';
                conversationStep = 1;
                updateProgress(conversationStep);
                addMessage(`Great choice! What's the total surface area you need to cover? You can enter it in Sq.Ft or Sq.M.`);
                showQuickReplies(['100 sq.ft', '25 sq.m', '15 sq.ft', 'Other size']);
                break;
                
            case 1: // Area
                area = input;
                conversationStep = 2;
                updateProgress(conversationStep);
                addMessage(`Got it. What size of tile are you planning to use?`);
                showQuickReplies(['12x12 in', '24x24 in', '6x36 in', '3x6 in', 'Custom size']);
                break;
                
            case 2: // Tile size
                tileSize = input;
                conversationStep = 3;
                updateProgress(conversationStep);
                
                // Track user preference
                userPreferences.tileSize = tileSize;
                
                // Calculate tiles
                const tiles = Math.floor(Math.random() * 50) + 50;
                const boxes = Math.ceil(tiles / 10);
                const cost = (tiles * 150).toLocaleString('en-IN'); // Price in rupees
                
                addMessage(`Based on your input, here's what you'll need:`);
                
                // Update result card
                document.querySelectorAll('.result-value')[0].textContent = tiles;
                document.querySelectorAll('.result-value')[1].textContent = boxes;
                document.querySelectorAll('.result-value')[3].textContent = `₹${cost}`;
                
                // Show result card
                setTimeout(() => {
                    resultCard.style.display = 'block';
                    resultCard.scrollIntoView({behavior: 'smooth', block: 'nearest'});
                }, 500);
                
                setTimeout(() => {
                    addMessage(`You will need approximately ${tiles} tiles (${boxes} boxes). The estimated cost is ₹${cost} including a 10% buffer for cuts and waste.`);
                    addMessage(`Would you like to see tiles that match your selection?`);
                    conversationStep = 4;
                    updateProgress(conversationStep);
                    showQuickReplies(['Yes, show me', 'Not now']);
                }, 1500);
                break;
                
            case 3: // Show products
                if (input.toLowerCase().includes('yes')) {
                    addMessage(`Here are some tiles that match your requirements:`);
                    // Scroll to products section
                    setTimeout(() => {
                        document.querySelector('.products-section').scrollIntoView({
                            behavior: 'smooth'
                        });
                    }, 1000);
                } else {
                    addMessage(`Okay, feel free to ask if you need anything else!`);
                }
                conversationStep = 0;
                updateProgress(conversationStep);
                showQuickReplies(['Floor Tiles', 'Wall Tiles', 'Start Over']);
                break;
        }
    }
    
    // Send button event
    sendBtn.addEventListener('click', function() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            
            // Track user input
            userPreferences.lastInput = message;
            
            const typing = showTyping();
            setTimeout(() => {
                removeTyping(typing);
                processConversation(message);
            }, 1000);
        }
    });
    
    // Enter key event
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });
    
    // Email results button
    document.querySelector('.email-btn').addEventListener('click', function() {
        emailModal.style.display = 'flex';
    });
    
    // Cancel email
    cancelEmailBtn.addEventListener('click', function() {
        emailModal.style.display = 'none';
    });
    
    // Submit email
    submitEmailBtn.addEventListener('click', function() {
        const email = document.getElementById('email-input').value;
        const name = document.getElementById('name-input').value;
        
        if (email && name) {
            emailModal.style.display = 'none';
            addMessage(`I've sent the results to ${email}. Check your inbox!`, false);
            
            // Scroll to latest message
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 300);
        } else {
            alert('Please enter both your name and email address.');
        }
    });
    
    // PDF generation
    document.querySelector('.pdf-btn').addEventListener('click', function() {
        addMessage(`I've generated a PDF with your tile calculation. It should download shortly.`, false);
    });
    
    // Initialize conversation
    updateProgress(conversationStep);
    
    // Initialize analytics
    setInterval(() => {
        console.log('Sending analytics:', userPreferences);
    }, 10000);
});