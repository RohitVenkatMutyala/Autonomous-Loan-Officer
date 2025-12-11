const PDFDocument = require('pdfkit');

// Safe EMI Calculator (Kept exactly as you provided)
const calculateEMI = (principal, annualRate, years) => {
    const P = Number(principal) || 0;
    const R_annual = Number(annualRate) || 10;
    const N_years = Number(years) || 1;

    if (P === 0) return 0;

    const r = R_annual / 12 / 100;
    const n = N_years * 12;
    
    const numerator = P * r * Math.pow(1 + r, n);
    const denominator = Math.pow(1 + r, n) - 1;

    if (denominator === 0) return 0;
    return Math.round(numerator / denominator);
};

const generatePDF = (user, decision) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });

            // --- 1. MEMORY BUFFER SETUP (Replaces fs.createWriteStream) ---
            // This captures the PDF data in RAM instead of saving to a file
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                // Return the PDF as a Base64 string (Direct Download Link)
                resolve(`data:application/pdf;base64,${pdfData.toString('base64')}`);
            });

            // --- 2. PROFESSIONAL HEADER ---
            doc.rect(0, 0, 600, 100).fillColor('#1a237e').fill(); // Dark Blue Banner
            
            doc.fillColor('white').fontSize(24).font('Helvetica-Bold').text('AI-Bank', 50, 35);
            doc.fontSize(10).font('Helvetica').text('Digital Lending Division, Financial District, Hyderabad - 500032', 50, 65);
            
            doc.fillColor('white').fontSize(12).text('www.aiBank.com', 400, 35, { align: 'right' });
            doc.text('support@aiBank.com', 400, 55, { align: 'right' });

            // --- 3. LETTER INFO ---
            doc.fillColor('black').moveDown(6);
            
            doc.fontSize(10).font('Helvetica-Bold').text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
            doc.text(`Ref No: UBAI/${Date.now()}/LN`, { align: 'right' });
            
            doc.moveDown();
            doc.fontSize(11).text('To,');
            doc.text(user.name);
            doc.text(`PAN: ${user.pan}`);
            
            doc.moveDown(2);
            doc.fontSize(14).font('Helvetica-Bold').text('SUBJECT: IN-PRINCIPLE LOAN SANCTION LETTER', { underline: true, align: 'center' });
            doc.moveDown();

            // --- 4. GREETING & STATUS ---
            doc.fontSize(11).font('Helvetica').text('Dear Customer,');
            doc.moveDown();
            
            if (decision.approved) {
                doc.text(`We are pleased to inform you that based on your credit profile and income assessment, your application for a ${decision.loanType} has been provisionally approved.`);
            } else {
                 doc.text(`Thank you for your application. Based on your eligibility, we are pleased to offer you a pre-approved limit as detailed below.`);
            }
            doc.moveDown();

            // --- 5. KEY FACT STATEMENT (The Box) ---
            const startY = doc.y;
            
            // Draw Box
            doc.rect(50, startY, 500, 140).strokeColor('#333').stroke();
            doc.rect(50, startY, 500, 25).fillColor('#e8eaf6').fill(); // Header strip
            doc.fillColor('black').fontSize(11).font('Helvetica-Bold').text('KEY LOAN DETAILS', 60, startY + 8);
            
            // Data Rows
            const rowH = 25;
            let currentY = startY + 35;
            const emi = calculateEMI(decision.amount, decision.interest, decision.tenure);

            const drawRow = (label, value, bold = false, color = 'black') => {
                doc.font('Helvetica').fontSize(10).fillColor('#555').text(label, 70, currentY);
                doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(11).fillColor(color).text(value, 300, currentY);
                currentY += rowH;
            };

            drawRow('Sanctioned Amount', `INR ${decision.amount.toLocaleString('en-IN')}`, true, 'black');
            drawRow('Interest Rate (Floating)', `${decision.interest}% p.a.`, true, 'black');
            drawRow('Loan Tenure', `${decision.tenure} Years (${decision.tenure * 12} Months)`, false, 'black');
            drawRow('Monthly EMI (Estimated)', `INR ${emi.toLocaleString('en-IN')}`, true, '#2e7d32'); // Green Text

            doc.moveDown(5);

            // --- 6. REPAYMENT SCHEDULE TABLE ---
            doc.fontSize(12).font('Helvetica-Bold').fillColor('black').text('Repayment Illustration', 50);
            doc.fontSize(9).font('Helvetica').fillColor('#666').text('Note: This is an indicative schedule based on current interest rates.');
            doc.moveDown(0.5);

            // Table Header
            const tableTop = doc.y;
            doc.rect(50, tableTop, 500, 20).fillColor('#333').fill();
            doc.fillColor('white').font('Helvetica-Bold').fontSize(10);
            doc.text('Loan Amount', 60, tableTop + 6);
            doc.text('Tenure', 250, tableTop + 6);
            doc.text('Calculated EMI', 400, tableTop + 6);

            // Table Row
            doc.rect(50, tableTop + 20, 500, 25).strokeColor('#ddd').stroke();
            doc.fillColor('black').font('Helvetica').fontSize(11);
            doc.text(`INR ${decision.amount.toLocaleString('en-IN')}`, 60, tableTop + 28);
            doc.text(`${decision.tenure} Years`, 250, tableTop + 28);
            doc.text(`INR ${emi.toLocaleString('en-IN')}`, 400, tableTop + 28);

            // --- 7. FOOTER ---
            const bottomY = 750;
            doc.fontSize(8).fillColor('#888').text('Terms & Conditions Apply. This is a computer-generated document and does not require a physical signature.', 50, bottomY, { align: 'center', width: 500 });
            doc.text('AI-Bank | Registered Office: Mumbai, India', 50, bottomY + 12, { align: 'center', width: 500 });

            // Finalize PDF (This triggers the 'end' event above)
            doc.end();

        } catch (error) {
            console.error("PDF Gen Error:", error);
            reject(error);
        }
    });
};

module.exports = { generatePDF };