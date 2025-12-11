// server/agents/state.js
const { Annotation } = require("@langchain/langgraph");

// This is the "Memory" of our workflow
const AgentState = Annotation.Root({
  messages: Annotation({ reducer: (x, y) => x.concat(y) }), // Chat history
  step: Annotation(),          // Current step: 'GREETING', 'VERIFICATION', 'SELECTION', etc.
  userData: Annotation(),      // Stores the user object found in DB
  loanRequest: Annotation(),   // Stores { type: 'Home Loan', amount: ... }
  decision: Annotation(),      // Stores { approved: boolean, reason: ... }
  pdfUrl: Annotation(),        // Stores the generated PDF link
  lastInput: Annotation()      // The last thing the user typed
});

module.exports = { AgentState };