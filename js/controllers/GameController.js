const GameController = (() => {
  let currentQuestion = null;

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

  // ------------------ game logic ------------------------
  const startGame = () => {
    currentQuestion = Model.getRandomQuestion();
    View.renderQuestion(currentQuestion);
    switchScreen("game");
  };

  const submitAnswer = () => {
    const userInput = document.getElementById("user-answer").value.trim().toLowerCase();
    if (!currentQuestion) return;

    if (currentQuestion.acceptableAnswers.includes(userInput)) {
      View.showFeedback("✅ Correct!");
    } else {
      View.showFeedback("❌ Incorrect. Try again!");
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
    const tags = Model.getAllTags();
    View.renderTags(tags);
    View.showScreen("admin");
    // Show all questions by default
    QuestionListView.renderAllQuestions(Model.getQuestions());
  };

  const handleTagClick = (e) => {
    if (e.target.classList.contains("tag-btn")) {
      const tag = e.target.dataset.tag;
      const filtered = Model.getQuestions([tag]);
      QuestionListView.renderAllQuestions(filtered);
    }
  };

  // ------------------ initialization -------------------
  const init = () => {
    Model.load();

    startGameBtn.addEventListener("click", startGame);
    addQuestionBtn.addEventListener("click", () => switchScreen("form"));
    form.addEventListener("submit", submitNewQuestion);
    answerBtn.addEventListener("click", submitAnswer);

    // Admin view
    adminBtn.style.display = "inline-block"; // Show for now; add real auth for production
    adminBtn.addEventListener("click", showAdminView);
    adminBackBtn.addEventListener("click", () => switchScreen("home"));
    document.getElementById("tag-list").addEventListener("click", handleTagClick);
  };

  return { init };
})();

// ------------------ bootstrap -------------------------
window.onload = () => GameController.init();
