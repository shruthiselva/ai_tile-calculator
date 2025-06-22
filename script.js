document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const quickReplies = document.getElementById('quick-replies');
    const progressFill = document.getElementById('progress-fill');
    const resultCard = document.getElementById('result-card');
    const emailModal = document.getElementById('email-modal');
    const cancelEmailBtn = document.getElementById('cancel-email');
    const submitEmailBtn = document.getElementById('submit-email');

    // State variables
    let conversationStep = 0;
    let tileType = '';
    let area = '';
    let tileSize = '';
    let userPreferences = {};

    // Update progress bar UI
    function updateProgress(step) {
        const width = step * 25; // 4 steps total, 25% each
        progressFill.style.width = `${width}%`;
        const progressText = document.querySelector('.progress-header span:last-child');
        if (progressText) {
            progressText.textContent = `Step ${step} of 4`;
        }
    }

    // Display message in chat
    function displayMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        messageDiv.textContent = message;

        if (!isUser) {
            const aiTag = document.createElement('div');
            aiTag.classList.add('ai-tag');
            aiTag.textContent = 'AI Powered';
            messageDiv.appendChild(aiTag);
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show typing indicator
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator');
        typingDiv.innerHTML = `<span></span><span></span><span></span>`;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }

    // Remove typing indicator
    function removeTyping(typingElement) {
        typingElement.remove();
    }

    // Show quick replies buttons
    function showQuickReplies(replies) {
        quickReplies.innerHTML = '';
        replies.forEach(reply => {
            const replyDiv = document.createElement('div');
            replyDiv.classList.add('quick-reply');
            replyDiv.textContent = reply;
            replyDiv.dataset.reply = reply;
            replyDiv.addEventListener('click', () => {
                handleQuickReply(reply);
            });
            quickReplies.appendChild(replyDiv);
        });
    }

    // Handle quick reply click
    function handleQuickReply(reply) {
        displayMessage(reply, true);

        if (conversationStep === 0) {
            userPreferences.tileType = reply;
        }

        const typing = showTyping();
        setTimeout(() => {
            removeTyping(typing);
            processConversation(reply);
        }, 1000);
    }

    // Process conversation based on step
    function processConversation(input) {
        switch (conversationStep) {
            case 0:
                tileType = input.toLowerCase().includes('floor') ? 'floor' :
                           input.toLowerCase().includes('wall') ? 'wall' : 'both';
                conversationStep = 1;
                updateProgress(conversationStep);
                displayMessage(`Great choice! What's the total surface area you need to cover? You can enter it in Sq.Ft or Sq.M.`);
                showQuickReplies(['100 sq.ft', '25 sq.m', '15 sq.ft', 'Other size']);
                break;

            case 1:
                area = input;
                conversationStep = 2;
                updateProgress(conversationStep);
                displayMessage(`Got it. What size of tile are you planning to use?`);
                showQuickReplies(['12x12 in', '24x24 in', '6x36 in', '3x6 in', 'Custom size']);
                break;

            case 2:
                tileSize = input;
                conversationStep = 3;
                updateProgress(conversationStep);
                userPreferences.tileSize = tileSize;

                const tiles = Math.floor(Math.random() * 50) + 50; // 50 to 99 tiles
                const boxes = Math.ceil(tiles / 10);
                const cost = (tiles * 150).toLocaleString('en-IN'); // price in rupees

                displayMessage(`Based on your input, here's what you'll need:`);

                const resultValues = resultCard.querySelectorAll('.result-value');
                if (resultValues.length >= 4) {
                    resultValues[0].textContent = tiles;
                    resultValues[1].textContent = boxes;
                    resultValues[2].textContent = area;
                    resultValues[3].textContent = `₹${cost}`;
                }

                setTimeout(() => {
                    resultCard.style.display = 'block';
                    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 500);

                setTimeout(() => {
                    displayMessage(`You will need approximately ${tiles} tiles (${boxes} boxes). The estimated cost is ₹${cost} including a 10% buffer for cuts and waste.`);
                    displayMessage(`Would you like to see tiles that match your selection?`);
                    conversationStep = 4;
                    updateProgress(conversationStep);
                    showQuickReplies(['Yes, show me', 'Not now']);
                }, 1500);
                break;

            case 3:
                if (input.toLowerCase().includes('yes')) {
                    displayMessage(`Here are some tiles that match your requirements:`);
                    // You can add scrolling or product display here
                } else {
                    displayMessage(`Okay, feel free to ask if you need anything else!`);
                }
                conversationStep = 0;
                updateProgress(conversationStep);
                showQuickReplies(['Floor Tiles', 'Wall Tiles', 'Both']);
                break;
        }
    }

    // Send message handler
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            displayMessage(message, true);
            userInput.value = '';
            userPreferences.lastInput = message;

            const typing = showTyping();
            setTimeout(() => {
                removeTyping(typing);
                processConversation(message);
            }, 1000);
        }
    }

    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    // Email modal handlers
    document.querySelector('.email-btn')?.addEventListener('click', () => {
        emailModal.style.display = 'flex';
    });

    cancelEmailBtn.addEventListener('click', () => {
        emailModal.style.display = 'none';
    });

    submitEmailBtn.addEventListener('click', () => {
        const email = document.getElementById('email-input').value;
        const name = document.getElementById('name-input').value;
        if (email && name) {
            emailModal.style.display = 'none';
            displayMessage(`I've sent the results to ${email}. Check your inbox!`);
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 300);
        } else {
            alert('Please enter both your name and email address.');
        }
    });

    // Initialize UI on load
    updateProgress(conversationStep);
    showQuickReplies(['Floor Tiles', 'Wall Tiles', 'Both']);
});
