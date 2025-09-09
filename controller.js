const Controller = (() => {
  const form = document.getElementById("submit-question-form");
  const showAllBtn = document.getElementById("show-all-btn"); // optional
  const startGameBtn = document.getElementById("start-game-btn");
  const addQuestionBtn = document.getElementById("add-question-btn");
  const gameScreen = document.getElementById("game-screen");
  const homeScreen = document.getElementById("home-screen");
  const questionFormScreen = document.getElementById("question-form-screen");

  let currentQuestion = null;

  const switchScreen = (screenToShow) => {
    homeScreen.style.display = "none";
    gameScreen.style.display = "none";
    questionFormScreen.style.display = "none";

    screenToShow.style.display = "block";
  };

  const startGame = () => {
    switchScreen(gameScreen);
    currentQuestion = Model.getRandomQuestion();
    View.renderQuestion(currentQuestion);
  };

  const init = () => {
    Model.load();

    // Button listeners
    startGameBtn.addEventListener("click", startGame);

    addQuestionBtn.addEventListener("click", () => {
      switchScreen(questionFormScreen);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const question = document.getElementById("question-text").value.trim();
      const answers = document
        .getElementById("acceptable-answers")
        .value.trim()
        .split(",")
        .map((a) => a.trim().toLowerCase());
      const imageOrText = document.getElementById("image-or-text").value.trim();

      if (!question || answers.length === 0) return;

      Model.addQuestion({ question, acceptableAnswers: answers, imageOrText });

      form.reset();
      alert("Question added!");
      switchScreen(homeScreen);
    });

    // Answer submit logic
    const answerBtn = document.getElementById("submit-answer-btn");
    const feedback = document.getElementById("feedback");
    answerBtn.addEventListener("click", () => {
      const userInput = document.getElementById("user-answer").value.trim().toLowerCase();
      if (currentQuestion && currentQuestion.acceptableAnswers.includes(userInput)) {
        feedback.textContent = "✅ Correct!";
      } else {
        feedback.textContent = "❌ Incorrect. Try again!";
      }
    });
  };

  return { init };
})();

window.onload = () => Controller.init();
