const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const appGraph = require('./agents/graph');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/pdfs', express.static(path.join(__dirname, 'public/pdfs')));

// Simple In-Memory Storage for Graph State
let threadStorage = {}; 

app.post('/api/chat', async (req, res) => {
    const { sessionId, message } = req.body;

    // 1. Initialize Thread if new
    if (!threadStorage[sessionId]) {
        threadStorage[sessionId] = {
            messages: [],
            step: 'GREETING',
            userData: null,
            lastInput: '',
            dashboard: { show: false } 
        };
    }

    let currentState = threadStorage[sessionId];

    // 2. Update State based on User Input
    if (message !== "HELLO_INIT") {
        currentState.lastInput = message;
        const cleanInput = message.trim();

        // --- GLOBAL COMMANDS ---
        if (cleanInput === 'Main Menu' || cleanInput === 'Back to Menu') {
            currentState.step = 'GREETING'; // Reset to start
            currentState.lastInput = 'MAIN_MENU'; // Force menu display
        }
        
        // --- LOGIC TRIGGERS ---
        else if (currentState.step === 'WAITING_FOR_MENU_CHOICE') {
            currentState.step = 'HANDLE_MENU';
        }
        else if (currentState.step === 'WAITING_FOR_PAN') {
            currentState.step = 'VERIFY_INPUT';
        } 
        else if (currentState.step === 'WAITING_FOR_LOAN_SELECTION') {
            currentState.step = 'HANDLE_SELECTION';
        }
        else if (currentState.step === 'WAITING_FOR_CONFIRMATION') {
            currentState.step = 'HANDLE_CONFIRMATION';
        }
        else if (currentState.step === 'WAITING_FOR_AMOUNT') {
            currentState.step = 'PROCESS_LOAN';
        }
    }

    try {
        // 3. RUN THE GRAPH
        const result = await appGraph.invoke(currentState);
        
        // 4. Update storage
        threadStorage[sessionId] = result;

        const lastMsg = result.messages[result.messages.length - 1];
        
        res.json({
            text: lastMsg.text,
            type: lastMsg.type,
            options: lastMsg.options,
            pdfUrl: lastMsg.pdfUrl,
            dashboard: result.dashboard
        });

    } catch (error) {
        console.error("Graph Execution Error:", error);
        res.status(500).json({ 
            text: "I encountered an internal error. Please try clicking 'Main Menu' to reset.", 
            type: 'text' 
        });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`LangGraph Server running on ${PORT}`));