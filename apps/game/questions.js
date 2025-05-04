// questions.js

const QUESTIONS = [
    {
        question: "What is the primary purpose of a central bank?",
        options: ["Control inflation", "Issue loans", "Tax citizens", "Print currency for exports"],
        answer: 0
    },
    {
        question: "Which is considered a safe-haven asset during economic downturns?",
        options: ["Tech Stocks", "Oil Futures", "Gold", "Junk Bonds"],
        answer: 2
    },
    {
        question: "What does GDP stand for?",
        options: ["General Domestic Pricing", "Government Debt Policy", "Gross Domestic Product", "Global Development Plan"],
        answer: 2
    },
    {
        question: "Which organization is responsible for global monetary cooperation?",
        options: ["UNESCO", "IMF", "WTO", "OPEC"],
        answer: 1
    },
    {
        question: "What is inflation?",
        options: ["Fall in GDP", "Rise in general price levels", "Increase in interest rates", "Decline in employment"],
        answer: 1
    },
    {
        question: "What is a bond?",
        options: ["Equity share", "Commodity future", "Currency exchange", "Debt investment"],
        answer: 3
    },
    {
        question: "Which country uses the yen as its currency?",
        options: ["Vietnam", "China", "Japan", "South Korea"],
        answer: 2
    },
    {
        question: "What is a bear market?",
        options: ["Market that is rising", "Market with high volume", "Market that is falling", "Market closed for holidays"],
        answer: 2
    },
    {
        question: "What does diversification help reduce?",
        options: ["Taxation", "Interest rates", "Investment risk", "Inflation"],
        answer: 2
    },
    {
        question: "Which is a leading stock index in the US?",
        options: ["FTSE 100", "S&P 500", "DAX", "Nikkei 225"],
        answer: 1
    },
    {
        question: "What is the role of the Federal Reserve in the U.S. economy?",
        options: ["Regulate trade agreements", "Manage monetary policy", "Print stock certificates", "Create fiscal budgets"],
        answer: 1
    },
    {
        question: "What does a high credit score generally indicate?",
        options: ["High debt levels", "Multiple bankruptcies", "Good creditworthiness", "Low income"],
        answer: 2
    },
    {
        question: "Which economic system is based on supply and demand with little government control?",
        options: ["Command economy", "Market economy", "Mixed economy", "Traditional economy"],
        answer: 1
    },
    {
        question: "What is the term for the total value of goods and services produced in a country?",
        options: ["FDI", "GDP", "PPP", "CPI"],
        answer: 1
    },
    {
        question: "Which of these is a type of unemployment caused by technological change?",
        options: ["Seasonal unemployment", "Structural unemployment", "Frictional unemployment", "Voluntary unemployment"],
        answer: 1
    },
    {
        question: "Which of the following would most likely cause a currency to depreciate?",
        options: ["Strong GDP growth", "High interest rates", "Trade surplus", "High inflation"],
        answer: 3
    },
    {
        question: "What is a budget deficit?",
        options: ["Balanced budget", "Spending exceeds revenue", "No taxes collected", "Revenue exceeds spending"],
        answer: 1
    },
    {
        question: "What does the Consumer Price Index (CPI) measure?",
        options: ["Inflation", "GDP growth", "Stock prices", "Employment rate"],
        answer: 0
    },
    {
        question: "Which of these is a cryptocurrency?",
        options: ["Yuan", "Euro", "Bitcoin", "Dollar"],
        answer: 2
    },
    {
        question: "What is quantitative easing?",
        options: ["Central bank buying assets to inject money", "Cutting taxes to stimulate demand", "Reducing government debt", "Raising interest rates"],
        answer: 0
    }
];


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = QUESTIONS; // Node.js
} else {
    export default QUESTIONS;   // React Native (Babel/Webpack)
}

