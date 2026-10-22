// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

const quizQuestions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "London", correct: false },
      { text: "Berlin", correct: false },
      { text: "Paris", correct: true },
      { text: "Madrid", correct: false },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: false },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Arctic Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
    ],
  },
  {
    question: "Which of these is NOT a programming language?",
    answers: [
      { text: "Java", correct: false },
      { text: "Python", correct: false },
      { text: "Banana", correct: true },
      { text: "JavaScript", correct: false },
    ],
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: [
      { text: "Go", correct: false },
      { text: "Gd", correct: false },
      { text: "Au", correct: true },
      { text: "Ag", correct: false },
    ],
  },
];

const optionLetters = ["A", "B", "C", "D"];

// State
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;
let transitionTimeout = null;

// Screen management via pure Tailwind classes
function setScreen(activeScreen) {
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    if (screen) {
      screen.classList.remove("block");
      screen.classList.add("hidden");
    }
  });

  if (activeScreen) {
    activeScreen.classList.remove("hidden");
    activeScreen.classList.add("block");
  }
}

function startQuiz() {
  if (transitionTimeout) clearTimeout(transitionTimeout);

  currentQuestionIndex = 0;
  score = 0;

  if (scoreSpan) scoreSpan.textContent = "0";
  if (totalQuestionsSpan) totalQuestionsSpan.textContent = quizQuestions.length;
  if (maxScoreSpan) maxScoreSpan.textContent = quizQuestions.length;

  setScreen(quizScreen);
  showQuestion();
}

function showQuestion() {
  answersDisabled = false;

  const currentQuestion = quizQuestions[currentQuestionIndex];
  if (!currentQuestion) return;

  if (currentQuestionSpan) {
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
  }

  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  if (progressBar) {
    progressBar.style.width = `${progressPercent}%`;
  }

  if (questionText) {
    questionText.textContent = currentQuestion.question;
  }

  if (answersContainer) {
    answersContainer.innerHTML = "";

    currentQuestion.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className =
        "group relative flex items-center w-full p-4 rounded-xl border-2 border-[#eadbc8] bg-[#f8f0e5] text-[#333] font-medium text-left shadow-sm hover:bg-[#eadbc8]/60 hover:border-[#dac0ae] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer";

      button.dataset.correct = String(answer.correct);

      button.innerHTML = `
        <span class="badge flex items-center justify-center w-8 h-8 mr-3.5 rounded-lg bg-white border border-[#dac0ae] text-sm font-bold text-[#e86a33] group-hover:bg-[#e86a33] group-hover:text-white transition-colors duration-200 shrink-0">
          ${optionLetters[index] || index + 1}
        </span>
        <span class="flex-1 text-sm sm:text-base leading-snug">${answer.text}</span>
      `;

      button.addEventListener("click", selectAnswer);
      answersContainer.appendChild(button);
    });
  }
}

function selectAnswer(event) {
  if (answersDisabled) return;
  answersDisabled = true;

  const selectedButton = event.target.closest("button");
  if (!selectedButton || !answersContainer) return;

  const isCorrect = selectedButton.dataset.correct === "true";

  Array.from(answersContainer.children).forEach((button) => {
    const badge = button.querySelector(".badge");
    button.classList.add("pointer-events-none");

    if (button.dataset.correct === "true") {
      // Tailwind green state
      button.className =
        "pointer-events-none relative flex items-center w-full p-4 rounded-xl border-2 border-green-300 bg-green-50 text-green-800 font-medium text-left shadow-sm";
      if (badge) {
        badge.className =
          "badge flex items-center justify-center w-8 h-8 mr-3.5 rounded-lg bg-green-600 text-white text-sm font-bold shrink-0";
        badge.textContent = "✓";
      }
    } else if (button === selectedButton) {
      // Tailwind red state
      button.className =
        "pointer-events-none relative flex items-center w-full p-4 rounded-xl border-2 border-red-300 bg-red-50 text-red-800 font-medium text-left shadow-sm";
      if (badge) {
        badge.className =
          "badge flex items-center justify-center w-8 h-8 mr-3.5 rounded-lg bg-red-600 text-white text-sm font-bold shrink-0";
        badge.textContent = "✕";
      }
    }
  });

  if (isCorrect) {
    score++;
    if (scoreSpan) scoreSpan.textContent = score;
  }

  transitionTimeout = setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 1000);
}

function showResults() {
  if (progressBar) progressBar.style.width = "100%";
  setScreen(resultScreen);

  if (finalScoreSpan) finalScoreSpan.textContent = score;
  if (maxScoreSpan) maxScoreSpan.textContent = quizQuestions.length;

  const percentage = (score / quizQuestions.length) * 100;

  if (resultMessage) {
    if (percentage === 100) {
      resultMessage.textContent = "Perfect! You're a genius! 🏆";
    } else if (percentage >= 80) {
      resultMessage.textContent = "Great job! You know your stuff! 🌟";
    } else if (percentage >= 60) {
      resultMessage.textContent = "Good effort! Keep learning! 👍";
    } else if (percentage >= 40) {
      resultMessage.textContent = "Not bad! Try again to improve! 💪";
    } else {
      resultMessage.textContent = "Keep studying! You'll get better! 📚";
    }
  }
}

// Event Listeners
startButton?.addEventListener("click", startQuiz);
restartButton?.addEventListener("click", startQuiz);