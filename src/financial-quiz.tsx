import React, { useState } from 'react';

const FinancialProductQuiz = () => {
  const [step, setStep] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    age: '',
    gender: '',
    experience: '',
    goal: ''
  });
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  // Scoring system
  const calculateScores = () => {
    let scores = {
      education: 0,
      stocksBroker: 0,
      cfd: 0,
      forex: 0,
      binaryOptions: 0
    };

    // Knowledge score (lower = more education needed)
    const knowledgeScore = 
      (answers.q1 === 'a' ? 1 : answers.q1 === 'b' ? 2 : answers.q1 === 'c' ? 3 : 4) +
      (answers.q2 === 'a' ? 1 : answers.q2 === 'b' ? 2 : answers.q2 === 'c' ? 3 : 4) +
      (answers.q8 === 'a' ? 1 : answers.q8 === 'b' ? 2 : answers.q8 === 'c' ? 3 : 4);
    
    // Risk tolerance (higher = more risky products)
    const riskScore = 
      (answers.q3 === 'a' ? 1 : answers.q3 === 'b' ? 2 : answers.q3 === 'c' ? 3 : 4) +
      (answers.q4 === 'a' ? 1 : answers.q4 === 'b' ? 2 : answers.q4 === 'c' ? 3 : 4) +
      (answers.q9 === 'a' ? 1 : answers.q9 === 'b' ? 2 : answers.q9 === 'c' ? 3 : 4) +
      (answers.q12 === 'a' ? 1 : answers.q12 === 'b' ? 2 : answers.q12 === 'c' ? 3 : 4);
    
    // Time horizon (lower = shorter time preference)
    const timeScore = 
      (answers.q5 === 'a' ? 1 : answers.q5 === 'b' ? 2 : answers.q5 === 'c' ? 3 : 4) +
      (answers.q10 === 'a' ? 1 : answers.q10 === 'b' ? 2 : answers.q10 === 'c' ? 3 : 4);
    
    // Goal orientation (higher = more return-focused vs security)
    const goalScore = 
      (answers.q6 === 'a' ? 1 : answers.q6 === 'b' ? 2 : answers.q6 === 'c' ? 3 : 4) +
      (answers.q7 === 'a' ? 1 : answers.q7 === 'b' ? 2 : answers.q7 === 'c' ? 3 : 4) +
      (answers.q11 === 'a' ? 1 : answers.q11 === 'b' ? 2 : answers.q11 === 'c' ? 3 : 4);
    
    // Trading psychology
    const psychScore = 
      (answers.q13 === 'a' ? 1 : answers.q13 === 'b' ? 2 : answers.q13 === 'c' ? 3 : 4) +
      (answers.q14 === 'a' ? 1 : answers.q14 === 'b' ? 2 : answers.q14 === 'c' ? 3 : 4) +
      (answers.q15 === 'a' ? 1 : answers.q15 === 'b' ? 2 : answers.q15 === 'c' ? 3 : 4);

    // Calculate final scores for each product
    
    // Education score - higher for low knowledge
    scores.education = Math.max(0, (10 - knowledgeScore) * 3);
    
    // Stocks Broker - balanced approach, favors long-term, lower risk
    scores.stocksBroker = 
      (timeScore >= 6 ? 10 : timeScore >= 4 ? 6 : 3) + 
      (riskScore <= 8 ? 10 : riskScore <= 12 ? 6 : 3) +
      (knowledgeScore >= 8 ? 5 : 2) +
      (goalScore <= 8 ? 5 : 2);
    
    // CFD - medium-short term, higher risk
    scores.cfd = 
      (timeScore <= 6 ? 8 : 4) + 
      (riskScore >= 8 && riskScore <= 12 ? 12 : riskScore > 12 ? 8 : 4) +
      (knowledgeScore >= 6 ? 5 : 2) +
      (goalScore >= 6 ? 5 : 2) +
      (psychScore >= 6 ? 5 : 2);
    
    // Forex - short term, high risk
    scores.forex = 
      (timeScore <= 4 ? 10 : 4) + 
      (riskScore >= 10 ? 10 : 4) +
      (knowledgeScore >= 8 ? 5 : 2) +
      (goalScore >= 8 ? 5 : 2) +
      (psychScore >= 8 ? 5 : 2);
    
    // Binary Options - very short term, highest risk
    scores.binaryOptions = 
      (timeScore <= 3 ? 12 : 3) + 
      (riskScore >= 12 ? 12 : 4) +
      (goalScore >= 10 ? 6 : 2) +
      (psychScore >= 10 ? 6 : 2);

    return scores;
  };

  const getRecommendation = () => {
    const scores = calculateScores();
    
    // Find highest scoring product
    let highestScore = 0;
    let recommendation = null;
    
    Object.entries(scores).forEach(([product, score]) => {
      if (score > highestScore) {
        highestScore = score;
        recommendation = product;
      }
    });
    
    // Add education recommendation if knowledge is low
    const needsEducation = 
      (answers.q1 === 'a' || answers.q2 === 'a' || answers.q8 === 'a');
    
    // Format the recommendation - now with personalization based on user info
    const personalizeReason = (reasons) => {
      if (personalInfo.goal) {
        switch(personalInfo.goal) {
          case 'grow-wealth':
            reasons.push("Aligned with your goal of long-term wealth growth 🌱");
            break;
          case 'passive-income':
            reasons.push("Can help generate the passive income you're looking for 💸");
            break;
          case 'quick-returns':
            reasons.push("Offers potential for the quicker returns you desire ⚡");
            break;
          case 'retirement':
            reasons.push("Supports your retirement planning objectives 🏖️");
            break;
          case 'major-purchase':
            reasons.push("Can help you save for your planned major purchase 🏡");
            break;
          case 'learn':
            reasons.push("Perfect for your goal of learning about investing 🧠");
            break;
        }
      }
      
      if (personalInfo.experience === 'beginner' && recommendation !== 'education') {
        reasons.push("Accessible even with your beginner level experience ✨");
      }
      
      if (personalInfo.experience === 'professional' && (recommendation === 'forex' || recommendation === 'cfd' || recommendation === 'binaryOptions')) {
        reasons.push("Leverages your professional financial background 🏆");
      }
      
      return reasons;
    };
    
    // Format the recommendation
    switch(recommendation) {
      case 'education':
        return {
          title: "Education Program",
          description: `${personalInfo.name ? personalInfo.name + ", based" : "Based"} on your answers, we recommend starting with our Education product. This will help you build a solid foundation in market understanding and trading principles.`,
          reasonsToChoose: personalizeReason([
            "Build foundational knowledge of financial markets 📚",
            "Learn trading strategies and risk management 🛡️",
            "Practice in a safe environment before risking real money 🔬",
            "Structured curriculum designed by industry experts 👨‍🏫"
          ]),
          secondaryRec: null
        };
      case 'stocksBroker':
        return {
          title: "Long-term Stock Investing",
          description: `${personalInfo.name ? personalInfo.name + ", your" : "Your"} profile indicates you're well-suited for traditional stock investing with a long-term approach.`,
          reasonsToChoose: personalizeReason([
            "Build wealth over time with less active management 📈",
            "Lower fees compared to active trading 💰",
            "Historically proven investment approach 🏛️",
            "More stable and predictable returns 🛡️"
          ]),
          secondaryRec: needsEducation ? "education" : null
        };
      case 'cfd':
        return {
          title: "Contract for Difference (CFD) Trading",
          description: `${personalInfo.name ? personalInfo.name + ", your" : "Your"} answers suggest you may be interested in more active trading with leverage via CFDs.`,
          reasonsToChoose: personalizeReason([
            "Trade with leverage (5-30x your investment) 💪",
            "Ability to profit in both rising and falling markets 🔄",
            "No need to own the underlying asset 🧩",
            "Access to a wide range of markets 🌎"
          ]),
          secondaryRec: needsEducation ? "education" : null
        };
      case 'forex':
        return {
          title: "Forex Trading",
          description: `${personalInfo.name ? personalInfo.name + ", your" : "Your"} risk profile and trading preferences align with Forex trading in the currency markets.`,
          reasonsToChoose: personalizeReason([
            "24-hour market with high liquidity 🕒",
            "Low entry barriers and trading costs 🚪",
            "Ability to use high leverage 📊",
            "Potential for quick profits from currency fluctuations 💱"
          ]),
          secondaryRec: needsEducation ? "education" : null
        };
      case 'binaryOptions':
        return {
          title: "Binary Options Trading",
          description: `${personalInfo.name ? personalInfo.name + ", your" : "Your"} responses indicate you might be interested in binary options trading.`,
          reasonsToChoose: personalizeReason([
            "Simple yes/no outcome ✅❌",
            "Fixed risk and reward known upfront 📊",
            "Quick results - trades can be as short as 60 seconds ⚡",
            "Potential for high percentage returns on successful trades 🚀"
          ]),
          secondaryRec: needsEducation ? "education" : null
        };
      default:
        return {
          title: "Personalized Consultation",
          description: `${personalInfo.name ? personalInfo.name + ", your" : "Your"} profile is unique and would benefit from a personalized consultation with our financial advisors.`,
          reasonsToChoose: personalizeReason([
            "Custom strategy based on your specific needs 🎯",
            "Professional guidance tailored to your goals 🧭",
            "Comprehensive approach to your financial future 🔮",
            "Access to our full range of products and services 🛒"
          ]),
          secondaryRec: null
        };
    }
  };

  // Reordered and enhanced with emojis
  const questions = [
    {
      id: 'q1',
      text: "How would you rate your understanding of financial markets? 📊",
      options: [
        { value: 'a', text: "I'm a complete beginner" },
        { value: 'b', text: "I understand the basics" },
        { value: 'c', text: "I'm knowledgeable but not an expert" },
        { value: 'd', text: "I have extensive knowledge and experience" }
      ],
      emoji: "📚"
    },
    {
      id: 'q2',
      text: "How familiar are you with financial instruments like stocks, bonds, options, and derivatives? 📈",
      options: [
        { value: 'a', text: "Not familiar at all" },
        { value: 'b', text: "Somewhat familiar with stocks and bonds" },
        { value: 'c', text: "Familiar with most common instruments" },
        { value: 'd', text: "Very familiar with a wide range of instruments" }
      ],
      emoji: "🧩"
    },
    {
      id: 'q5',
      text: "What's your primary investment time horizon? ⏳",
      options: [
        { value: 'a', text: "Less than 1 year" },
        { value: 'b', text: "1-3 years" },
        { value: 'c', text: "3-10 years" },
        { value: 'd', text: "More than 10 years" }
      ],
      emoji: "🕰️"
    },
    {
      id: 'q6',
      text: "What is your primary financial goal? 🎯",
      options: [
        { value: 'a', text: "Preserving capital and generating some income" },
        { value: 'b', text: "Growing assets steadily over time" },
        { value: 'c', text: "Achieving significant growth, accepting volatility" },
        { value: 'd', text: "Maximizing growth potential, even with high risk" }
      ],
      emoji: "🏆"
    },
    {
      id: 'q7',
      text: "How often would you ideally like to monitor or adjust your investments? 👀",
      options: [
        { value: 'a', text: "Annually or less frequently" },
        { value: 'b', text: "Quarterly or monthly" },
        { value: 'c', text: "Weekly" },
        { value: 'd', text: "Daily or multiple times per day" }
      ],
      emoji: "📱"
    },
    {
      id: 'q3',
      text: "If your investment lost 20% of its value in a month, what would you do? 📉",
      options: [
        { value: 'a', text: "Sell everything immediately to prevent further losses 😰" },
        { value: 'b', text: "Sell some positions to reduce risk 😟" },
        { value: 'c', text: "Hold and wait for recovery 😐" },
        { value: 'd', text: "Buy more to take advantage of lower prices 😏" }
      ],
      emoji: "🎢"
    },
    {
      id: 'q4',
      text: "Which statement best describes your attitude toward investment risk? 🎲",
      options: [
        { value: 'a', text: "I want to minimize risk and am willing to accept lower returns 😌" },
        { value: 'b', text: "I'm willing to accept moderate risk for moderate returns 🙂" },
        { value: 'c', text: "I'm comfortable with high risk for potentially high returns 😎" },
        { value: 'd', text: "I seek maximum returns and am willing to accept significant risk 🤩" }
      ],
      emoji: "🔥"
    },
    {
      id: 'q8',
      text: "How would you rate your understanding of leverage in trading? 💪",
      options: [
        { value: 'a', text: "I don't understand leverage" },
        { value: 'b', text: "I understand the basics but have never used it" },
        { value: 'c', text: "I understand and have some experience with leverage" },
        { value: 'd', text: "I'm very comfortable using leverage in my trading" }
      ],
      emoji: "⚖️"
    },
    {
      id: 'q9',
      text: "What percentage of your total investment portfolio would you be comfortable allocating to higher-risk products? 📊",
      options: [
        { value: 'a', text: "0-10% (very cautious 😌)" },
        { value: 'b', text: "10-25% (somewhat cautious 🙂)" },
        { value: 'c', text: "25-50% (somewhat aggressive 😎)" },
        { value: 'd', text: "More than 50% (very aggressive 🤩)" }
      ],
      emoji: "🥧"
    },
    {
      id: 'q10',
      text: "How soon do you expect to need access to the money you invest? 💰",
      options: [
        { value: 'a', text: "I may need it within 6 months" },
        { value: 'b', text: "Within 1-2 years" },
        { value: 'c', text: "Within 3-5 years" },
        { value: 'd', text: "Not for at least 5 years" }
      ],
      emoji: "🗓️"
    },
    {
      id: 'q11',
      text: "Which of these potential returns is most appealing to you? 💎",
      options: [
        { value: 'a', text: "5% annually with very low risk 😌" },
        { value: 'b', text: "8-12% annually with moderate risk 🙂" },
        { value: 'c', text: "15-25% annually with high risk 😎" },
        { value: 'd', text: "Potential for 50%+ with very high risk 🤩" }
      ],
      emoji: "💸"
    },
    {
      id: 'q12',
      text: "How do you feel about the possibility of losing money in the short term? 📉",
      options: [
        { value: 'a', text: "I'm very uncomfortable with any losses 😰" },
        { value: 'b', text: "I can tolerate small losses if recovery is likely 😟" },
        { value: 'c', text: "I understand losses happen and am generally comfortable with volatility 😐" },
        { value: 'd', text: "I'm fully prepared for significant fluctuations if long-term potential is high 😏" }
      ],
      emoji: "🎭"
    },
    {
      id: 'q13',
      text: "What best describes your decision-making in financial matters? 🧠",
      options: [
        { value: 'a', text: "I'm very methodical and research thoroughly 🔍" },
        { value: 'b', text: "I balance analysis with intuition ⚖️" },
        { value: 'c', text: "I often trust my instincts 💫" },
        { value: 'd', text: "I make quick decisions and enjoy the excitement ⚡" }
      ],
      emoji: "🤔"
    },
    {
      id: 'q14',
      text: "How would you describe your interest in financial markets? 📰",
      options: [
        { value: 'a', text: "I want to invest but don't enjoy following markets 😴" },
        { value: 'b', text: "I find markets somewhat interesting 🙂" },
        { value: 'c', text: "I actively enjoy following market developments 😊" },
        { value: 'd', text: "I'm passionate about trading and market analysis 🤩" }
      ],
      emoji: "📺"
    },
    {
      id: 'q15',
      text: "How do you feel about making frequent trading decisions? 🔄",
      options: [
        { value: 'a', text: "I prefer a set-and-forget approach 😌" },
        { value: 'b', text: "I'm comfortable with occasional adjustments 🙂" },
        { value: 'c', text: "I enjoy being actively involved 😎" },
        { value: 'd', text: "I find frequent trading stimulating and engaging 🤩" }
      ],
      emoji: "🎮"
    }
  ];

  const handleAnswerSelect = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setLoading(true);
      // Simulate processing time
      setTimeout(() => {
        setShowResult(true);
        setLoading(false);
      }, 1500);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Render welcome screen with personal info collection
  const renderIntro = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Your Financial Future Quiz! 🚀</h2>
          <p className="text-gray-600 mb-4">Let's find the perfect financial product for your needs and goals</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={personalInfo.name}
              onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
              placeholder="Your first name"
            />
          </div>
          
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
            <select
              id="age"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={personalInfo.age}
              onChange={(e) => setPersonalInfo({...personalInfo, age: e.target.value})}
            >
              <option value="">Select your age range</option>
              <option value="18-24">18-24</option>
              <option value="25-34">25-34</option>
              <option value="35-44">35-44</option>
              <option value="45-54">45-54</option>
              <option value="55-64">55-64</option>
              <option value="65+">65 or older</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              id="gender"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={personalInfo.gender}
              onChange={(e) => setPersonalInfo({...personalInfo, gender: e.target.value})}
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="nonbinary">Non-binary</option>
              <option value="other">Other</option>
              <option value="prefer-not">Prefer not to say</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">How would you describe your investment experience? 💼</label>
            <select
              id="experience"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={personalInfo.experience}
              onChange={(e) => setPersonalInfo({...personalInfo, experience: e.target.value})}
            >
              <option value="">Select your experience level</option>
              <option value="beginner">I'm just getting started</option>
              <option value="some">I've made some investments before</option>
              <option value="experienced">I'm an experienced investor</option>
              <option value="professional">I work in finance/investments</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">What's your primary financial goal right now? 🎯</label>
            <select
              id="goal"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={personalInfo.goal}
              onChange={(e) => setPersonalInfo({...personalInfo, goal: e.target.value})}
            >
              <option value="">Select your main goal</option>
              <option value="grow-wealth">Grow my wealth long-term</option>
              <option value="passive-income">Generate passive income</option>
              <option value="quick-returns">Make quicker returns</option>
              <option value="retirement">Save for retirement</option>
              <option value="major-purchase">Save for a major purchase</option>
              <option value="learn">Learn about investing</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setStep('questions')}
          disabled={!personalInfo.name || !personalInfo.age || !personalInfo.gender || !personalInfo.experience || !personalInfo.goal}
          className={`w-full py-3 px-4 rounded-md font-medium text-white ${
            !personalInfo.name || !personalInfo.age || !personalInfo.gender || !personalInfo.experience || !personalInfo.goal
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Let's Get Started! 🚀
        </button>
      </div>
    );
  };

  const renderQuestion = (question) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <div className="text-4xl mr-3">{question.emoji}</div>
          <h2 className="text-xl font-semibold">{question.text}</h2>
        </div>
        <div className="space-y-3">
          {question.options.map((option) => (
            <div 
              key={option.value}
              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                answers[question.id] === option.value 
                  ? 'bg-blue-100 border-blue-500' 
                  : 'hover:bg-gray-50 border-gray-300'
              }`}
              onClick={() => handleAnswerSelect(question.id, option.value)}
            >
              {option.text}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProgressBar = () => {
    const progress = (currentQuestion / questions.length) * 100;
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  const renderResult = () => {
    const recommendation = getRecommendation();
    const getEmoji = (rec) => {
      switch(rec) {
        case 'education': return '📚';
        case 'stocksBroker': return '📈';
        case 'cfd': return '💹';
        case 'forex': return '💱';
        case 'binaryOptions': return '🎲';
        default: return '🌟';
      }
    };
    
    // Get emotional reaction based on recommendation
    const getEmotionalMessage = () => {
      const messages = {
        education: "Knowledge is power! We're excited to help you build a strong foundation 🧠",
        stocksBroker: "Great choice for building long-term wealth with confidence 🌱",
        cfd: "Ready for some action with controlled risk? CFDs could be perfect for you! 🚀",
        forex: "The currency markets are calling your name! Fast-paced and exciting! ⚡",
        binaryOptions: "You've got the risk appetite of a true trader! Let's make those quick wins! 🔥"
      };
      
      return messages[Object.keys(messages).find(key => recommendation.title.toLowerCase().includes(key.toLowerCase()))] || "We're excited about your financial journey! 🌟";
    };
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4 text-4xl">
            {getEmoji(Object.keys(recommendation).find(key => recommendation.title.toLowerCase().includes(key.toLowerCase())))}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {personalInfo.name ? `${personalInfo.name}, Here's Your Perfect Match!` : "Your Personalized Recommendation"}
          </h2>
          <p className="text-gray-600">Based on your unique profile and goals</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <p className="text-blue-800 font-medium text-center italic">
            "{getEmotionalMessage()}"
          </p>
        </div>

        <div className="border-t border-b border-gray-200 py-6 my-6">
          <h3 className="text-xl font-bold text-blue-800 mb-3">{recommendation.title}</h3>
          <p className="text-gray-700 mb-4">{recommendation.description}</p>
          
          <h4 className="font-semibold text-gray-800 mb-2">Why this is perfect for you:</h4>
          <ul className="space-y-2">
            {recommendation.reasonsToChoose.map((reason, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {personalInfo.age && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">How this fits your profile:</h4>
            <p className="text-gray-700">
              Based on your age group ({personalInfo.age}), {personalInfo.gender === 'prefer-not' ? 'your' : personalInfo.gender === 'male' ? 'men' : personalInfo.gender === 'female' ? 'women' : 'individuals'} with similar goals often find success with our {recommendation.title.toLowerCase()} approach.
            </p>
          </div>
        )}

        {recommendation.secondaryRec === 'education' && (
          <div className="bg-yellow-50 p-4 rounded-md mb-6">
            <div className="flex items-start">
              <div className="text-2xl text-yellow-500 mr-2">📚</div>
              <p className="text-gray-700">
                We also recommend our <strong>Educational Product</strong> to help build your knowledge and confidence before diving in.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow transition-colors">
            Get Started with {recommendation.title} 🚀
          </button>
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-4">
          Our financial advisors are available to discuss your options in more detail
        </p>
      </div>
    );
  };

  const renderLoading = () => {
    // Array of emotional loading messages
    const loadingMessages = [
      { message: "Analyzing your risk tolerance...", emoji: "🔍" },
      { message: "Evaluating market opportunities...", emoji: "📊" },
      { message: "Calculating optimal strategies...", emoji: "🧮" },
      { message: "Finding your perfect financial match...", emoji: "💫" },
      { message: "Customizing recommendations just for you...", emoji: "✨" }
    ];
    
    // Show a random message from the array
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    const selectedMessage = loadingMessages[randomIndex];
    
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <div className="text-4xl mb-2">{selectedMessage.emoji}</div>
        <h2 className="text-xl font-semibold text-gray-700">{selectedMessage.message}</h2>
        <p className="text-gray-500 mt-2">
          {personalInfo.name ? `${personalInfo.name}, we're finding the perfect product for you` : 'Finding the perfect financial product for you'}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto bg-gray-50 p-6 rounded-lg">
      {step === 'intro' ? (
        renderIntro()
      ) : !showResult ? (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">
              {personalInfo.name ? `${personalInfo.name}'s Quiz` : 'Financial Profile Quiz'}
            </div>
            <div className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        
          {renderProgressBar()}
          
          {loading ? renderLoading() : renderQuestion(questions[currentQuestion])}
          
          {!loading && (
            <div className="flex justify-between mt-6">
              <button 
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-4 py-2 rounded-md ${
                  currentQuestion === 0 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ← Previous
              </button>
              
              <button 
                onClick={handleNext}
                disabled={!answers[questions[currentQuestion].id]}
                className={`px-4 py-2 rounded-md ${
                  !answers[questions[currentQuestion].id]
                    ? 'bg-blue-300 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {currentQuestion === questions.length - 1 ? 'Find My Match! 🎯' : 'Next →'}
              </button>
            </div>
          )}
        </>
      ) : (
        renderResult()
      )}
    </div>
  );
};

export default FinancialProductQuiz;