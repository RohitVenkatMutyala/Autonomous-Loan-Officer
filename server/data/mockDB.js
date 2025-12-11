// server/data/mockDB.js

const users = [
    // --- ORIGINALS (1-7) ---
    // Rule: BNK + P (Person) + Surname Initial + 4 Digits + Check Char
    { name: "Rohith Venkat", pan: "BNKPV1001A", creditScore: 850, salary: 150000, existingDebt: 0 },
    { name: "Nadavala Venu", pan: "BNKPV1002B", creditScore: 720, salary: 45000, existingDebt: 10000 },
    { name: "Dommaraju Karthik", pan: "BNKPK1003C", creditScore: 550, salary: 200000, existingDebt: 50000 },
    { name: "Fresher Dev", pan: "BNKPD1004D", creditScore: 650, salary: 25000, existingDebt: 0 },
    { name: "Heavy Spender", pan: "BNKPS1005E", creditScore: 700, salary: 80000, existingDebt: 60000 },
    { name: "Sarah Connor", pan: "BNKPC1006F", creditScore: 680, salary: 35000, existingDebt: 5000 },
    { name: "Tony Stark", pan: "BNKPS1007G", creditScore: 900, salary: 10000000, existingDebt: 0 },

    // --- HIGH INCOME & EXCELLENT CREDIT (The Whales) ---
    { name: "Priya Sharma", pan: "BNKPS2001H", creditScore: 820, salary: 250000, existingDebt: 0 },
    { name: "Amit Patel", pan: "BNKPP2002I", creditScore: 800, salary: 180000, existingDebt: 20000 },
    { name: "Sneha Gupta", pan: "BNKPG2003J", creditScore: 790, salary: 160000, existingDebt: 15000 },
    { name: "Vikram Singh", pan: "BNKPS2004K", creditScore: 850, salary: 300000, existingDebt: 0 },
    { name: "Anjali Mehta", pan: "BNKPM2005L", creditScore: 780, salary: 140000, existingDebt: 10000 },
    { name: "Rohan Das", pan: "BNKPD2006M", creditScore: 810, salary: 210000, existingDebt: 5000 },
    { name: "Kavita Reddy", pan: "BNKPR2007N", creditScore: 830, salary: 195000, existingDebt: 0 },
    { name: "Arjun Nair", pan: "BNKPN2008O", creditScore: 795, salary: 175000, existingDebt: 25000 },

    // --- MIDDLE CLASS (Good Credit, Moderate Income) ---
    { name: "Deepak Kumar", pan: "BNKPK3001P", creditScore: 750, salary: 75000, existingDebt: 12000 },
    { name: "Meera Iyer", pan: "BNKPI3002Q", creditScore: 740, salary: 68000, existingDebt: 8000 },
    { name: "Suresh Raina", pan: "BNKPR3003R", creditScore: 730, salary: 60000, existingDebt: 5000 },
    { name: "Pooja Hegde", pan: "BNKPH3004S", creditScore: 725, salary: 55000, existingDebt: 2000 },
    { name: "Manish Malhotra", pan: "BNKPM3005T", creditScore: 710, salary: 85000, existingDebt: 30000 },
    { name: "Varun Dhawan", pan: "BNKPD3006U", creditScore: 715, salary: 72000, existingDebt: 15000 },
    { name: "Kiara Advani", pan: "BNKPA3007V", creditScore: 760, salary: 90000, existingDebt: 10000 },
    { name: "Sidharth Roy", pan: "BNKPR3008W", creditScore: 705, salary: 62000, existingDebt: 18000 },
    { name: "Alia Bhatt", pan: "BNKPB3009X", creditScore: 755, salary: 95000, existingDebt: 5000 },
    { name: "Ranbir Kapoor", pan: "BNKPK3010Y", creditScore: 745, salary: 88000, existingDebt: 22000 },

    // --- ENTRY LEVEL / STUDENTS (Low Income, Thin File) ---
    { name: "Aryan Khan", pan: "BNKPK4001Z", creditScore: 680, salary: 25000, existingDebt: 0 },
    { name: "Suhana Khan", pan: "BNKPK4002A", creditScore: 690, salary: 28000, existingDebt: 1000 },
    { name: "Ibrahim Ali", pan: "BNKPA4003B", creditScore: 670, salary: 30000, existingDebt: 2000 },
    { name: "Nysa Devgan", pan: "BNKPD4004C", creditScore: 660, salary: 22000, existingDebt: 0 },
    { name: "Aarav Kumar", pan: "BNKPK4005D", creditScore: 675, salary: 32000, existingDebt: 5000 },
    { name: "Shanaya Kapoor", pan: "BNKPK4006E", creditScore: 685, salary: 26000, existingDebt: 1500 },
    { name: "Agastya Nanda", pan: "BNKPN4007F", creditScore: 665, salary: 24000, existingDebt: 0 },
    { name: "Khushi Kapoor", pan: "BNKPK4008G", creditScore: 695, salary: 29000, existingDebt: 3000 },
    { name: "Palak Tiwari", pan: "BNKPT4009H", creditScore: 655, salary: 21000, existingDebt: 0 },
    { name: "Rasha Thadani", pan: "BNKPT4010I", creditScore: 688, salary: 27000, existingDebt: 2500 },

    // --- THE RISKY LOT (Low Credit Score - Expect Rejection) ---
    { name: "Vijay Mallya", pan: "BNKPM5001J", creditScore: 500, salary: 500000, existingDebt: 1000000 },
    { name: "Nirav Modi", pan: "BNKPM5002K", creditScore: 450, salary: 0, existingDebt: 5000000 },
    { name: "Harshad Mehta", pan: "BNKPM5003L", creditScore: 580, salary: 100000, existingDebt: 80000 },
    { name: "Ketan Parekh", pan: "BNKPP5004M", creditScore: 600, salary: 120000, existingDebt: 90000 },
    { name: "Subrata Roy", pan: "BNKPR5005N", creditScore: 550, salary: 200000, existingDebt: 150000 },
    { name: "Lalit Modi", pan: "BNKPM5006O", creditScore: 520, salary: 300000, existingDebt: 250000 },
    { name: "Mehul Choksi", pan: "BNKPC5007P", creditScore: 480, salary: 150000, existingDebt: 120000 },
    { name: "Rana Kapoor", pan: "BNKPK5008Q", creditScore: 590, salary: 180000, existingDebt: 100000 },

    // --- THE DEBT TRAP (High Income, but too much debt) ---
    { name: "Hardik Pandya", pan: "BNKPP6001R", creditScore: 720, salary: 100000, existingDebt: 1500000 },
    { name: "KL Rahul", pan: "BNKPR6002S", creditScore: 710, salary: 120000, existingDebt: 2000000 },
    { name: "Rishabh Pant", pan: "BNKPP6003T", creditScore: 730, salary: 90000, existingDebt: 800000 },

    // --- BORDERLINE CASES (Scores near 650 cutoff) ---
    { name: "Shikhar Dhawan", pan: "BNKPD7001U", creditScore: 651, salary: 50000, existingDebt: 5000 },
    { name: "Ishant Sharma", pan: "BNKPS7002V", creditScore: 649, salary: 50000, existingDebt: 5000 },
    { name: "Umesh Yadav", pan: "BNKPY7003W", creditScore: 650, salary: 50000, existingDebt: 5000 },

    // --- THE FARMER ---
    { name: "Kisan Baburao", pan: "BNKPB8001X", creditScore: 700, salary: 20000, existingDebt: 0 } 
];

module.exports = users;