const users = require('../data/mockDB'); 
const SanctionAgent = require('../utils/pdfGenerator');

const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

// --- DATABASE (Unchanged) ---
const LOAN_DETAILS = {
    'Personal Loan': { 
        rate: 12.0, tenure: 5, 
        info: "Unsecured loan for personal needs.",
        docStatus: "Pre-verified via Salary Account History",
        eligibility: "Based on Monthly Credit & Vintage",
        fee: "1.5% (Auto-debited)"
    },
    'Home Loan': { 
        rate: 8.35, tenure: 20, 
        info: "Lowest interest rates for purchasing a home.",
        docStatus: "Property Valuation Report on File (Digital)",
        eligibility: "Linked to Asset Value & CIBIL",
        fee: "0.5% Processing Fee"
    },
    'Education Loan': { 
        rate: 9.5, tenure: 7, 
        info: "Funding for higher education.",
        docStatus: "Admission Proof Verified (University Database)",
        eligibility: "Confirmed via Partner University ID",
        fee: "Nil for existing customers"
    },
    'Car Loan': { 
        rate: 8.75, tenure: 5, 
        info: "Up to 90% on-road funding.",
        docStatus: "Dealer Quotation Received Digitally",
        eligibility: "Pre-approved based on Savings Balance",
        fee: "₹1,500 Flat Fee"
    },
    'Gold Loan': { 
        rate: 9.0, tenure: 3, 
        info: "Instant funds against gold.",
        docStatus: "Existing Safe Deposit Holdings Checked",
        eligibility: "Against Gold Value in Bank Vault",
        fee: "0.25% Valuation Charges"
    },
    'Agriculture Loan': { 
        rate: 7.0, tenure: 5, 
        info: "Special rates for farmers.",
        docStatus: "Land Records (7/12) Retrieved via Portal",
        eligibility: "Kisan Credit Card (KCC) Limit",
        fee: "Waived"
    },
    'Business Loan': { 
        rate: 14.0, tenure: 5, 
        info: "Expand your business.",
        docStatus: "GST & Turnover Verified via API",
        eligibility: "Based on Current Account Turnover",
        fee: "2.0% Processing Fee"
    }
};

// --- 1. SALES AGENT ---
const salesNode = async (state) => {
    const { step, lastInput, userData } = state;
    const cleanInput = lastInput ? String(lastInput).trim() : '';

    // Global Reset
    if (cleanInput === 'Main Menu' || cleanInput === 'MAIN_MENU') {
        return {
            messages: [{ role: 'bot', text: "🏠 **Main Menu**\nSelect a service:", type: 'options', options: ['Apply for Loan', 'Loan Calculator', 'Talk to Agent'] }],
            step: 'MENU_SELECTION',
            dashboard: { show: true, agent: 'SALES', status: 'Main Menu', logs: ['Resetting flow...'] }
        };
    }

    if (cleanInput === 'Loan Calculator') {
        const ratesText = Object.entries(LOAN_DETAILS).map(([k, v]) => `• ${k}: ${v.rate}%`).join('\n');
        return {
            messages: [{ role: 'bot', text: `📊 **Current Interest Rates**\n\n${ratesText}\n\nSelect 'Apply for Loan' to calculate EMI.`, type: 'options', options: ['Apply for Loan', 'Main Menu'] }],
            step: 'SHOW_RATES',
            dashboard: { show: true, agent: 'SALES', status: 'Showing Rates', logs: ['Fetching rates...'] }
        };
    }

    // --- AI AGENT ACTIVATION ---
    if (cleanInput === 'Talk to Agent') {
        return {
            messages: [{ 
                role: 'bot', 
                text: "✨ **AI Assistant Activated**\n\nHello! I am here to assist you with detailed information about our banking products.\n\nYou can ask me specific questions like:\n• \"What are the charges for a Personal Loan?\"\n• \"Tell me about Home Loan eligibility.\"\n• \"Give me a brief on Gold Loans.\"\n\nHow may I help you today?", 
                type: 'text' 
            }],
            step: 'AI_CHAT_ACTIVE', 
            dashboard: { show: true, agent: 'AI_SUPPORT', status: 'Listening', logs: ['User entered AI Chat Mode'] }
        };
    }

    // --- UPDATED AI CHAT LOGIC (MORE DETAILED RESPONSES) ---
    if (step === 'AI_CHAT_ACTIVE') {
        const lowerInput = cleanInput.toLowerCase();
        let aiResponse = "I didn't quite catch that. Could you please specify which loan type you are interested in? (e.g., Home Loan, Car Loan)";
        
        // 1. Check for specific Loan Types in the user query
        const matchedLoan = Object.keys(LOAN_DETAILS).find(key => lowerInput.includes(key.toLowerCase()));

        if (matchedLoan) {
            const d = LOAN_DETAILS[matchedLoan];
            
            // Scenario A: User asks about FEES/CHARGES
            if (lowerInput.includes('fee') || lowerInput.includes('charges') || lowerInput.includes('cost')) {
                aiResponse = `💸 **${matchedLoan} - Schedule of Charges**\n\n` +
                             `The standardized processing fee for this facility is **${d.fee}**.\n` +
                             `• Please note that **18% GST** is applicable on all service charges.\n` +
                             `• Fees are usually deducted directly from the loan disbursal amount.\n` +
                             `• There are no hidden charges for pre-closure after 12 months.`;
            } 
            // Scenario B: User asks about ELIGIBILITY/DOCUMENTS
            else if (lowerInput.includes('eligibility') || lowerInput.includes('doc') || lowerInput.includes('qualify')) {
                aiResponse = `📝 **${matchedLoan} - Eligibility & KYC Guide**\n\n` +
                             `To qualify for this loan, the primary criteria is:\n👉 **${d.eligibility}**\n\n` +
                             `📂 **Document Status:**\n` +
                             `Great news! We have retrieved your records digitally:\n` +
                             `"${d.docStatus}"\n` +
                             `(This means no physical paperwork is required from your end.)`;
            } 
            // Scenario C: User asks GENERAL DETAILS (Briefing)
            else {
                aiResponse = `📘 **${matchedLoan} - Product Overview**\n\n` +
                             `${d.info}\n` +
                             `Here is a snapshot of the current offer:\n` +
                             `• **Interest Rate:** ${d.rate}% p.a. (linked to Repo Rate)\n` +
                             `• **Max Tenure:** Up to ${d.tenure} Years for flexible repayment\n` +
                             `• **Processing:** Instant Digital Approval\n\n` +
                             `Would you like to proceed with an application for this loan?`;
            }
        } 
        // 2. General Queries (Rates, Hello, Help)
        else if (lowerInput.includes('rate') || lowerInput.includes('interest')) {
            aiResponse = "📈 **Current Market Rates**\n\n" +
                         "Here are our most popular interest rates:\n" +
                         "• **Home Loan:** Starting @ 8.35% (Lowest in market)\n" +
                         "• **Personal Loan:** Starting @ 12.0% (Instant Disbursal)\n" +
                         "• **Car Loan:** Starting @ 8.75% (On-Road Funding)\n\n" +
                         "Please mention a specific loan type for more detailed info.";
        } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            aiResponse = "Hello! 👋 I am your dedicated AI Banker. I can help you compare loans, check fees, or verify your eligibility instantly. What would you like to know?";
        } else if (lowerInput.includes('human') || lowerInput.includes('person')) {
             aiResponse = "I am a fully autonomous AI agent designed to handle all your queries instantly. However, if you have a complex complaint, please visit the nearest branch for manual intervention.";
        }

        return {
            messages: [{ role: 'bot', text: aiResponse, type: 'text' }],
            step: 'AI_CHAT_ACTIVE', // Loop keeps the user in Chat Mode
            dashboard: { show: true, agent: 'AI_SUPPORT', status: 'Answering', logs: [`Query: ${cleanInput}`, `Answered: Yes`] }
        };
    }

    // Default Greeting
    if (step === 'GREETING' || step === 'MENU_SELECTION') {
        return {
            messages: [{ role: 'bot', text: "👋 **Welcome to AI-Bank**\n\nI am your Autonomous Loan Officer.", type: 'options', options: ['Apply for Loan', 'Loan Calculator', 'Talk to Agent'] }],
            step: 'WAITING_FOR_MENU_CHOICE',
            dashboard: { show: true, agent: 'SALES', status: 'Active', logs: ['Session initialized'] } 
        };
    }

    // Handle Menu
    if (step === 'HANDLE_MENU' || cleanInput === 'Apply for Loan') {
        return {
            messages: [{ role: 'bot', text: "📝 **Application Started**\n\nEnter your **PAN Card Number** (e.g., ABCDE1234F).", type: 'text' }],
            step: 'WAITING_FOR_PAN',
            dashboard: { show: true, agent: 'VERIFICATION', status: 'Pending Input', logs: ['Requesting PAN...'] }
        };
    }

    // After Verify
    if (step === 'ASK_LOAN_TYPE') {
        const monthlyDisposable = userData.salary - (userData.existingDebt * 0.05); 
        const maxLimit = Math.max(0, Math.floor(monthlyDisposable * 60));
        
        const profileDetails = 
            `👤 **Name:** ${userData.name}\n` +
            `💳 **PAN:** ${userData.pan}\n` +
            `📉 **CIBIL Score:** ${userData.creditScore}\n` +
            `💰 **Mthly Income:** ${formatCurrency(userData.salary)}\n` +
            `⚠️ **Existing Debt:** ${formatCurrency(userData.existingDebt)}\n` +
            `-----------------------------------\n` +
            `🏆 **Max Loan Eligibility:** ${formatCurrency(maxLimit)}`;

        return {
            messages: [{ 
                role: 'bot', 
                text: `✅ **KYC Verified Successfully**\n\n${profileDetails}\n\nSelect a Loan Type to proceed:`, 
                type: 'options', 
                options: Object.keys(LOAN_DETAILS) 
            }],
            step: 'WAITING_FOR_LOAN_SELECTION',
            dashboard: { show: true, agent: 'SALES', status: 'Profile Loaded', logs: [`User: ${userData.name}`, `Limit: ${maxLimit}`] }
        };
    }

    // Show Info
    if (step === 'HANDLE_SELECTION') {
        const details = LOAN_DETAILS[cleanInput];
        if (!details) return { messages: [{ role: 'bot', text: "Invalid selection.", type: 'options', options: Object.keys(LOAN_DETAILS) }], step: 'WAITING_FOR_LOAN_SELECTION' };

        return {
            loanRequest: { type: cleanInput },
            messages: [{ 
                role: 'bot', 
                text: `📘 **${cleanInput}**\n\n• Rate: **${details.rate}%**\n• Tenure: **${details.tenure} Yrs**\n• Info: ${details.info}\n\nDo you want to proceed or see details?`, 
                type: 'options', 
                options: ['Proceed', 'Know More', 'Back to Menu'] 
            }],
            step: 'WAITING_FOR_CONFIRMATION', 
            dashboard: { show: true, agent: 'SALES', status: 'Showing Info', logs: [`Fetched details for ${cleanInput}`] }
        };
    }

    // Ask Amount & Handle 'Know More'
    if (step === 'HANDLE_CONFIRMATION') {
        if (cleanInput === 'Know More') {
            const loanType = state.loanRequest.type;
            const details = LOAN_DETAILS[loanType];
            
            const detailedInfo = `ℹ️ **${loanType} - Details**\n\n` +
                                 `✅ **Document Status:**\n${details.docStatus}\n(Available in Bank Records)\n\n` +
                                 `🤝 **Eligibility Check:**\n${details.eligibility}\n\n` +
                                 `💸 **Fees:**\n${details.fee}\n\n` +
                                 `All checks passed. Ready to proceed?`;

            return {
                messages: [{ role: 'bot', text: detailedInfo, type: 'options', options: ['Proceed', 'Back to Menu'] }],
                step: 'WAITING_FOR_CONFIRMATION', 
                dashboard: { show: true, agent: 'SALES', status: 'Detailed Info', logs: [`User requested details for ${loanType}`] }
            };
        }

        if (cleanInput === 'Proceed') {
            return {
                messages: [{ role: 'bot', text: "💰 **Great!**\nHow much do you wish to borrow? (e.g., 500000)", type: 'text' }],
                step: 'WAITING_FOR_AMOUNT',
                dashboard: { show: true, agent: 'UNDERWRITING', status: 'Waiting for Amount', logs: ['User confirmed loan type'] }
            };
        } else {
             return { messages: [{ role: 'bot', text: "Cancelled.", type: 'options', options: ['Main Menu'] }], step: 'MENU_SELECTION', dashboard: { show: true, agent: 'SALES', status: 'Cancelled' } };
        }
    }

    return {};
};

// --- 2. VERIFICATION AGENT ---
const verificationNode = async (state) => {
    const userInput = state.lastInput ? state.lastInput.trim().toUpperCase() : "";
    const user = users.find(u => u.pan === userInput);

    if (user) {
        return { userData: user, step: 'ASK_LOAN_TYPE', dashboard: { show: true, agent: 'VERIFICATION', status: 'Success', logs: ['KYC Verified ✅'] } };
    } else {
        return { messages: [{ role: 'bot', text: "❌ Invalid PAN. Try again.", type: 'text' }], step: 'WAITING_FOR_PAN', dashboard: { show: true, agent: 'VERIFICATION', status: 'Failed', logs: ['PAN Not Found ❌'] } };
    }
};

// --- 3. UNDERWRITING AGENT ---
const underwritingNode = async (state) => {
    const { userData, loanRequest, lastInput } = state;
    const inputStr = lastInput ? String(lastInput) : "0";
    const cleanString = inputStr.replace(/[^0-9.]/g, ''); 
    const requestedAmount = Number(cleanString);

    if (isNaN(requestedAmount) || requestedAmount <= 0) {
         return { 
            decision: { approved: false, reason: "Please enter a valid number (e.g. 500000)." }, 
            step: 'SANCTION_PROCESS',
            dashboard: { show: true, agent: 'UNDERWRITING', status: 'Error', logs: ['Input Error: Invalid Number'] }
         };
    }

    const loanType = loanRequest ? loanRequest.type : 'Personal Loan';
    const details = LOAN_DETAILS[loanType] || LOAN_DETAILS['Personal Loan'];
    
    const maxAmount = Math.floor((userData.salary - (userData.existingDebt * 0.05)) * 60);
    const isCreditGood = userData.creditScore > 650;
    
    let isApproved = false;
    let finalAmount = 0;
    let reason = "";

    if (!isCreditGood) {
        isApproved = false; reason = "Low Credit Score (<650)";
    } else if (requestedAmount <= maxAmount) {
        isApproved = true; finalAmount = requestedAmount; 
    } else {
        isApproved = false; finalAmount = maxAmount; reason = "Limit Exceeded (Salary Mismatch)";
    }

    return {
        decision: { approved: isApproved, partial: !isApproved && isCreditGood, amount: finalAmount, requested: requestedAmount, interest: details.rate, tenure: details.tenure, loanType: loanType, reason: reason },
        step: 'SANCTION_PROCESS',
        dashboard: { show: true, agent: 'UNDERWRITING', status: 'Complete', logs: [`Max Eligibility: ${formatCurrency(maxAmount)}`, `Result: ${isApproved ? 'Approved' : 'Partial/Reject'}`] }
    };
};

// --- 4. SANCTION AGENT ---
const sanctionNode = async (state) => {
    const { decision, userData } = state;
    const pdfUrl = await SanctionAgent.generatePDF(userData, decision);
    let text = "";

    if (decision.approved) {
        text = `🎉 **Loan Approved!**\nAmount: ${formatCurrency(decision.amount)}\nROI: ${decision.interest}%`;
    } else if (decision.partial) {
        text = `⚠️ **Partial Offer**\n\nYou requested ${formatCurrency(decision.requested)}, but your limit is ${formatCurrency(decision.amount)}.\n\nWe can sanction **${formatCurrency(decision.amount)}**.`;
    } else {
        text = `❌ **Rejected**\n\nReason: ${decision.reason}`;
    }

    return {
        messages: [{ role: 'bot', text, type: 'pdf', pdfUrl: pdfUrl, options: ['Main Menu'] }],
        step: 'ENDED',
        dashboard: { show: true, agent: 'SANCTION', status: 'Generated', logs: ['Sent ✅'] }
    };
};

module.exports = { salesNode, verificationNode, underwritingNode, sanctionNode };