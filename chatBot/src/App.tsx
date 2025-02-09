import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

type ChatMessage = {
  sender: "bot" | "user";
  text: string;
};

type Option = {
  label: string;
  next: string;
  action?: () => void;
};

type Step = {
  message: string;
  options?: Option[];
  end?: boolean;
};

type Steps = Record<string, Step>;

const App: React.FC = () => {
  const [showChatBot, setShowChatBot] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<string>("0");
  const [userInput, setUserInput] = useState<string>("");

  const keywordResponses: Record<string, string> = {
    hello: "Hi there! How can I assist you today?",
    account: "You can manage your account settings here.",
    loan: "Our loan services are available. How can I help you with that?",
    "thank you": "You're welcome! Let me know if you need anything else.",
    help: "I'm here to help! How can I assist you?",
  };

  const steps: Steps = {
    "0": {
      message: "Hi there! How can I assist you?",
      options: [
        { label: "Account Information", next: "2" },
        { label: "Customer Services", next: "3" },
        { label: "Loan Services", next: "4" },
      ],
    },
    "2": {
      message: `📂 **Account Information**\n\n
      - You can manage your account settings, update personal details, and check your balance.\n
      - If you need help accessing your account, you can reset your password or contact support.\n`,
      options: [
        { label: "Back", next: "0" },
        { label: "Next", next: "7" }, // Goes to "Is there any other query?"
      ],
    },
    "3": {
      message: `📞 **Customer Services**\n\n
      - Our support team is available **24/7** to assist you.\n
      - You can reach us via **phone, email, or live chat**.\n
      - We can help with **billing, technical issues, and general inquiries**.\n`,
      options: [
        { label: "Back", next: "0" },
        { label: "Next", next: "7" }, // Goes to "Is there any other query?"
      ],
    },
    "4": {
      message: `💰 **Loan Services**\n\n
      - We offer personal, home, and business loans at competitive interest rates.\n
      - Check your eligibility and apply online for a quick approval process.\n`,
      options: [
        { label: "Back", next: "0" },
        { label: "Next", next: "7" }, // Goes to "Is there any other query?"
      ],
    },
    "7": {
      message: "❓ **Is there any other query?**",
      options: [
        { label: "Yes", next: "0" }, // Goes back to Account Info, Customer Services, and Loan Services
        { label: "No", next: "8" },  // Goes to Contact Us step
      ],
    },
    "8": {
      message: `❗ **If you have any issues, please contact us.**`,
      options: [
        { label: "Contact Us", next: "9", action: () => window.open("https://www.cab.edu.np/", "_blank") },
      ],
    },
    "9": {
      message: "Redirecting to Contact Us page...",
      end: true,
    },
  };

  const handleOptionClick = (option: Option) => {
    const { label, next, action } = option;

    if (label !== "Back" && label !== "Next") {
      setChatHistory((prev) => [...prev, { sender: "user", text: label }]);
    }

    const nextStep = steps[next];
    if (nextStep) {
      setTimeout(() => {
        setChatHistory((prev) => [...prev, { sender: "bot", text: nextStep.message }]);
        setCurrentStep(next);
      }, 500);
    }

    if (action) {
      action();
    }
  };

  const handleSendMessage = () => {
    if (userInput.trim() === "") return;
  
    setChatHistory((prev) => [...prev, { sender: "user", text: userInput }]);
  
    let response = "I'm sorry, I don't understand. Can you please rephrase?";
    let matchedStep = "";
  
    // Check if the user input matches one of the options
    if (/account information/i.test(userInput)) {
      matchedStep = "2";
    } else if (/customer services/i.test(userInput)) {
      matchedStep = "3";
    } else if (/loan services/i.test(userInput)) {
      matchedStep = "4";
    } else {
      for (let keyword in keywordResponses) {
        if (userInput.toLowerCase().includes(keyword)) {
          response = keywordResponses[keyword];
          break;
        }
      }
    }
  
    if (matchedStep) {
      response = steps[matchedStep].message;
      setCurrentStep(matchedStep);
    }
  
    setChatHistory((prev) => [...prev, { sender: "bot", text: response }]);
    setUserInput("");
  };
  

  const handleRefresh = () => {
    setChatHistory([{ sender: "bot", text: steps["0"].message }]);
    setCurrentStep("0");
    setUserInput("");
  };

  useEffect(() => {
    if (showChatBot && chatHistory.length === 0) {
      setChatHistory([{ sender: "bot", text: steps["0"].message }]);
      setCurrentStep("0");
    }
  }, [showChatBot]);

  return (
    <div className="App">
      <div className="container text-center my-5">
        <h1 className="text-primary">This is a Chat Bot Page</h1>
      </div>

      <button
        className="btn btn-primary rounded-circle position-fixed"
        style={{ bottom: 20, right: 20, zIndex: 1000 }}
        onClick={() => {
          if (!showChatBot) {
            setChatHistory([{ sender: "bot", text: steps["0"].message }]);
            setCurrentStep("0");
          }
          setShowChatBot((prev) => !prev);
        }}
      >
        💬
      </button>

      {showChatBot && (
        <div className="position-fixed shadow"
          style={{
            bottom: 20,
            right: 20,
            width: 500,
            height: 700,
            background: "#ffffff",
            border: "1px solid #ccc",
            borderRadius: 12,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
  style={{
    background: "#563d7c",
    color: "#fff",
    padding: "15px 20px",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <div style={{ display: "flex", alignItems: "center" }}>
    <span
      style={{
        width: 10,
        height: 10,
        background: "green",
        borderRadius: "50%",
        marginRight: 10,
      }}
    ></span>
    <strong>Pritu Bot</strong>
  </div>
  <div>
    {/* Refresh Button */}
    <button
      className="btn btn-sm btn-warning me-2"
      onClick={handleRefresh}
    >
      🔄
    </button>
    {/* Close Button */}
    <button
      className="btn btn-sm btn-light"
      onClick={() => setShowChatBot(false)}
    >
      ✖
    </button>
  </div>
</div>
          <div style={{ flex: 1, overflowY: "auto", padding: 15 }}>
            {chatHistory.map((chat, index) => (
              <div key={index} style={{ textAlign: chat.sender === "bot" ? "left" : "right", margin: "10px 0" }}>
                <span style={{
                  display: "inline-block",
                  padding: 15,
                  borderRadius: 12,
                  backgroundColor: chat.sender === "bot" ? "#e0e0e0" : "#007bff",
                  color: chat.sender === "bot" ? "#000" : "#fff",
                  maxWidth: "80%",
                }}>
                  {chat.text}
                </span>
              </div>
            ))}
          </div>

          <div style={{ padding: 15, borderTop: "1px solid #ccc" }}>
            {steps[currentStep]?.options?.map((option, index) => (
              <button key={index} className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOptionClick(option)}>
                {option.label}
              </button>
            ))}

            <div className="d-flex mt-3">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Type your message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
              />
              <button
                className="btn btn-sm btn-primary"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
