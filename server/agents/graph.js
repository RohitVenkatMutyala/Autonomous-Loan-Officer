const { StateGraph, START, END } = require("@langchain/langgraph");
const { AgentState } = require("./state");
const { salesNode, verificationNode, underwritingNode, sanctionNode } = require("./nodes");

const workflow = new StateGraph(AgentState)
    .addNode("Sales", salesNode)
    .addNode("Verification", verificationNode)
    .addNode("Underwriting", underwritingNode)
    .addNode("Sanction", sanctionNode)
    .addEdge(START, "Sales")

    .addConditionalEdges("Sales", (state) => {
        // --- STOP EXECUTION (Wait for User) ---
        if (state.step === 'WAITING_FOR_MENU_CHOICE') return END; 
        if (state.step === 'WAITING_FOR_PAN') return END;
        if (state.step === 'WAITING_FOR_LOAN_SELECTION') return END;
        if (state.step === 'WAITING_FOR_CONFIRMATION') return END; 
        if (state.step === 'WAITING_FOR_AMOUNT') return END;
        
        // --- STATIC STOPS ---
        if (state.step === 'MENU_SELECTION') return END; 
        if (state.step === 'SHOW_RATES') return END; 
        if (state.step === 'HUMAN_HANDOFF') return END; // <--- This fixes the "Talk to Agent" loop

        // --- TRANSITIONS ---
        if (state.step === 'HANDLE_MENU') return "Sales";
        if (state.step === 'VERIFY_INPUT') return "Verification";
        if (state.step === 'PROCESS_LOAN') return "Underwriting";
        
        return END;
    })

    .addConditionalEdges("Verification", (state) => {
        if (state.step === 'ASK_LOAN_TYPE') return "Sales"; 
        return "Sales"; 
    })

    .addEdge("Underwriting", "Sanction")
    .addEdge("Sanction", END);

const appGraph = workflow.compile({ recursionLimit: 50 });

module.exports = appGraph;