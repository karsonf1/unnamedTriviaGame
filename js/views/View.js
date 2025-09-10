const View = (() => {
  const screens = {
    home: document.getElementById("home-screen"),
    game: document.getElementById("game-screen"),
    form: document.getElementById("question-form-screen"),
    admin: document.getElementById("admin-screen"),
  };

  const showScreen = (screenName) => {
    Object.values(screens).forEach(screen => (screen.style.display = "none"));
    if (screens[screenName]) {
      // For admin, use block to allow grid layouts
      screens[screenName].style.display = screenName === "admin" ? "block" : "flex";
    }
    // Optionally clear feedback when switching screens
    const feedback = document.getElementById("feedback");
    if (feedback) feedback.textContent = "";
  };

  const renderQuestion = (questionObj) => {
    if (window.QuestionView) {
      window.QuestionView.renderQuestion(questionObj);
    }
  };

  const showFeedback = (msg) => {
    const feedback = document.getElementById("feedback");
    if (feedback) feedback.textContent = msg;
  };

  const renderTags = (tags) => {
    const tagList = document.getElementById("tag-list");
    tagList.innerHTML = tags.map(tag => `<button class="tag-btn" data-tag="${tag}">${tag}</button>`).join(" ");
  };

  return { showScreen, renderQuestion, showFeedback, renderTags };
})();