const GameController = (() => {
  let currentQuestion = null;
  let gameTimer = null;
  let timeRemaining = 10;
  let isAnswerSubmitted = false; // Prevent multiple submissions
  let answerCheckTimeout = null; // For debouncing real-time checking

  // cache DOM elements used by multiple views
  const form = document.getElementById("submit-question-form");
  const startGameBtn = document.getElementById("start-game-btn");
  const addQuestionBtn = document.getElementById("add-question-btn");
  const answerBtn = document.getElementById("submit-answer-btn");
  const adminBtn = document.getElementById("admin-view-btn");
  const adminBackBtn = document.getElementById("admin-back-btn");

  // ------------------ screen switching ------------------
  const switchScreen = (screenName) => {
    View.showScreen(screenName);
  };

  // ------------------ timer functions ------------------
  const startTimer = () => {
    timeRemaining = 10;
    clearInterval(gameTimer);
    
    gameTimer = setInterval(() => {
      timeRemaining--;
      QuestionView.updateTimer(timeRemaining);
      
      if (timeRemaining <= 0) {
        clearInterval(gameTimer);
        handleTimeOut();
      }
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(gameTimer);
  };

  const handleTimeOut = () => {
    QuestionView.showCorrectAnswer(currentQuestion);
    View.showFeedback("⏰ Time's up!");
    setTimeout(() => {
      nextQuestion();
    }, 3000); // Extended to 3 seconds to read the answer
  };

  const nextQuestion = () => {
    currentQuestion = Model.getRandomQuestion();
    isAnswerSubmitted = false; // Reset the submission flag
    if (currentQuestion) {
      View.renderQuestion(currentQuestion);
      clearAnswerInput();
      startTimer();
    } else {
      View.showFeedback("No more questions available!");
      stopTimer();
    }
  };

  const clearAnswerInput = () => {
    const answerInput = document.getElementById("user-answer");
    if (answerInput) {
      answerInput.value = "";
      answerInput.focus();
    }
  };

  // ------------------ game logic ------------------------
  const startGame = () => {
    currentQuestion = Model.getRandomQuestion();
    isAnswerSubmitted = false; // Reset submission flag
    View.renderQuestion(currentQuestion);
    switchScreen("game");
    QuestionView.showTimer();
    clearAnswerInput();
    startTimer();
  };

  const checkAnswerRealTime = (userInput) => {
    if (!currentQuestion || isAnswerSubmitted) return;

    const normalizedInput = userInput.trim().toLowerCase();
    
    // Check if the input matches any acceptable answer
    if (currentQuestion.acceptableAnswers.includes(normalizedInput)) {
      submitAnswer();
    }
  };

  const handleAnswerInput = (e) => {
    if (isAnswerSubmitted) return; // Prevent checking if answer already submitted
    
    // Clear previous timeout to debounce the checking
    clearTimeout(answerCheckTimeout);
    
    // Set a small delay to avoid checking on every keystroke
    answerCheckTimeout = setTimeout(() => {
      checkAnswerRealTime(e.target.value);
    }, 100); // 100ms delay for debouncing
  };

  const submitAnswer = () => {
    if (isAnswerSubmitted) return; // Prevent multiple submissions
    
    const userInput = document.getElementById("user-answer").value.trim().toLowerCase();
    if (!currentQuestion) return;

    isAnswerSubmitted = true; // Set flag to prevent multiple submissions
    stopTimer();
    clearTimeout(answerCheckTimeout); // Clear any pending checks

    if (currentQuestion.acceptableAnswers.includes(userInput)) {
      QuestionView.showCorrectAnswer(currentQuestion);
      View.showFeedback("✅ Correct!");
      setTimeout(() => {
        nextQuestion();
      }, 3000); // Extended to 3 seconds to read the answer
    } else {
      QuestionView.showCorrectAnswer(currentQuestion);
      View.showFeedback("❌ Incorrect!");
      setTimeout(() => {
        nextQuestion();
      }, 3000); // Extended to 3 seconds to read the answer
    }
  };

  // ------------------ add question form ----------------
  const submitNewQuestion = (e) => {
    e.preventDefault();

    const questionText = document.getElementById("question-text").value.trim();
    const answers = document
      .getElementById("acceptable-answers")
      .value.trim()
      .split(",")
      .map(a => a.trim().toLowerCase());
    const imageOrText = document.getElementById("image-or-text").value.trim();

    if (!questionText || answers.length === 0) return;

    Model.addQuestion({ question: questionText, acceptableAnswers: answers, imageOrText });
    form.reset();
    alert("Question added!");
    switchScreen("home");
  };

  // ------------------ admin view -----------------------
  const showAdminView = () => {
    stopTimer(); // Stop timer when leaving game
    QuestionView.hideTimer();
    const tags = Model.getAllTags();
    View.renderTags(tags);
    View.showScreen("admin");
  };

  const handleTagClick = (e) => {
    if (e.target.classList.contains("tag-btn")) {
      const tag = e.target.dataset.tag;
      console.log('GameController: handleTagClick called with tag:', tag);
      QuestionListView.renderQuestionsByTag(tag);
    }
  };

  // ------------------ keyboard handling ----------------
  const handleKeyPress = (e) => {
    // Prevent Enter key submission to avoid spam
    if (e.target.id === "user-answer" && e.key === "Enter") {
      e.preventDefault();
      // Do nothing - real-time checking will handle correct answers
    }
  };

  // ------------------ initialization -------------------
  const init = () => {
    Model.load();

    startGameBtn.addEventListener("click", startGame);
    addQuestionBtn.addEventListener("click", () => {
      stopTimer(); // Stop timer when leaving game
      QuestionView.hideTimer();
      switchScreen("form");
    });
    form.addEventListener("submit", submitNewQuestion);
    
    // Remove submit button functionality to prevent spam
    // answerBtn.addEventListener("click", submitAnswer);

    // Admin view
    adminBtn.style.display = "inline-block"; // Show for now; add real auth for production
    adminBtn.addEventListener("click", showAdminView);
    adminBackBtn.addEventListener("click", () => {
      stopTimer(); // Stop timer when going back to home
      QuestionView.hideTimer();
      switchScreen("home");
    });
    document.getElementById("tag-list").addEventListener("click", handleTagClick);
    
    // Add keyboard event listener
    document.addEventListener("keydown", handleKeyPress);
    
    // Add real-time answer checking
    const answerInput = document.getElementById("user-answer");
    if (answerInput) {
      answerInput.addEventListener("input", handleAnswerInput);
    }
  };

  return { init };
})();

// ------------------ bootstrap -------------------------
window.onload = () => GameController.init();
