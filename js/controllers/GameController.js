const GameController = (() => {
  let currentQuestion = null;
  let gameTimer = null;
  let timeRemaining = 10;
  let isAnswerSubmitted = false; // Prevent multiple submissions
  let answerCheckTimeout = null; // For debouncing real-time checking

  // cache DOM elements used by multiple views
  const form = document.getElementById("submit-question-form");
  const editForm = document.getElementById("edit-question-form");
  const startGameBtn = document.getElementById("start-game-btn");
  const gameSettingsBtn = document.getElementById("game-settings-btn");
  const addQuestionBtn = document.getElementById("add-question-btn");
  const answerBtn = document.getElementById("submit-answer-btn");
  const adminBtn = document.getElementById("admin-view-btn");
  const adminBackBtn = document.getElementById("admin-back-btn");
  const editBackBtn = document.getElementById("edit-back-btn");
  const deleteQuestionBtn = document.getElementById("delete-question-btn");

  // Question editing state
  let currentEditingIndex = -1;

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
    setTimeout(() => {
      nextQuestion();
    }, 3000); // Extended to 3 seconds to read the answer
  };

  const nextQuestion = () => {
    currentQuestion = getRandomQuestionFromCurrentSet();
    isAnswerSubmitted = false; // Reset the submission flag
    if (currentQuestion) {
      View.renderQuestion(currentQuestion);
      clearAnswerInput();
      startTimer();
    } else {
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

  const startGameWithFilters = (filters) => {
    // Get filtered questions
    const filteredQuestions = Model.getQuestionsByTags(filters.includeTags || [], filters.excludeTags || []);
    
    if (filteredQuestions.length === 0) {
      alert('No questions available with the selected filters!');
      return;
    }

    // Store filtered questions for the game session
    window.currentGameQuestions = filteredQuestions;
    
    // Get a random question from the filtered set
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    currentQuestion = filteredQuestions[randomIndex];
    
    isAnswerSubmitted = false; // Reset submission flag
    View.renderQuestion(currentQuestion);
    switchScreen("game");
    QuestionView.showTimer();
    clearAnswerInput();
    startTimer();
  };

  const getRandomQuestionFromCurrentSet = () => {
    // If we have a filtered set, use it; otherwise use all questions
    const questionsToUse = window.currentGameQuestions || Model.getQuestions();
    
    if (questionsToUse.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * questionsToUse.length);
    return questionsToUse[randomIndex];
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
      setTimeout(() => {
        nextQuestion();
      }, 3000); // Extended to 3 seconds to read the answer
    } else {
      QuestionView.showCorrectAnswer(currentQuestion);
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
    const tagsInput = document.getElementById("tags-input");
    
    // Process tags with validation
    let tags = [];
    if (tagsInput && tagsInput.value.trim()) {
      tags = tagsInput.value.trim()
        .split(",")
        .map(t => t.trim().toLowerCase())
        .filter(t => t) // Remove empty tags
        .slice(0, 3); // Limit to 3 tags maximum
    }
    
    // Default to "general" if no tags provided
    if (tags.length === 0) {
      tags = ["general"];
    }

    if (!questionText || answers.length === 0) return;

    // Validate tag count
    if (tags.length > 3) {
      alert("Maximum of 3 tags allowed. Only the first 3 will be used.");
      tags = tags.slice(0, 3);
    }

    Model.addQuestion({ 
      question: questionText, 
      acceptableAnswers: answers, 
      imageOrText,
      tags: tags
    });
    
    form.reset();
    alert(`Question added with tags: ${tags.join(", ")}`);
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

  // ------------------ question editing -----------------
  const editQuestion = (questionIndex) => {
    console.log('editQuestion called with index:', questionIndex);
    currentEditingIndex = questionIndex;
    const question = Model.getQuestionByIndex(questionIndex);
    
    if (!question) {
      alert('Question not found!');
      return;
    }

    // Populate the edit form
    document.getElementById("edit-question-text").value = question.question || '';
    document.getElementById("edit-acceptable-answers").value = 
      Array.isArray(question.acceptableAnswers) ? question.acceptableAnswers.join(', ') : '';
    document.getElementById("edit-image-or-text").value = question.imageOrText || '';
    document.getElementById("edit-tags-input").value = 
      Array.isArray(question.tags) ? question.tags.join(', ') : '';

    // Update preview
    updateQuestionPreview();

    // Switch to edit screen
    switchScreen("edit-question");
  };

  const updateQuestionPreview = () => {
    const questionText = document.getElementById("edit-question-text").value.trim();
    const answers = document.getElementById("edit-acceptable-answers").value.trim();
    const imageOrText = document.getElementById("edit-image-or-text").value.trim();
    const tags = document.getElementById("edit-tags-input").value.trim();

    const previewContent = document.getElementById("preview-content");
    
    let preview = `<div style="text-align: center;">`;
    
    if (questionText) {
      preview += `<div style="font-weight: bold; font-size: 18px; margin-bottom: 15px;">${questionText}</div>`;
    }
    
    if (imageOrText && imageOrText.startsWith('http')) {
      preview += `<img src="${imageOrText}" alt="Question image" style="max-width: 200px; max-height: 200px; object-fit: contain; border-radius: 8px;" onerror="this.style.display='none'"/>`;
    } else if (imageOrText) {
      preview += `<div style="color: #666; font-style: italic; margin: 10px 0;">${imageOrText}</div>`;
    }
    
    if (answers) {
      preview += `<div style="margin-top: 15px; color: #E67E22; font-weight: bold;">Answer(s): ${answers}</div>`;
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
      preview += `<div style="margin-top: 10px;">`;
      tagArray.forEach(tag => {
        preview += `<span style="background: #E67E22; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px; margin: 2px;">${tag}</span>`;
      });
      preview += `</div>`;
    }
    
    preview += `</div>`;
    previewContent.innerHTML = preview;
  };

  const submitEditQuestion = (e) => {
    e.preventDefault();

    const questionText = document.getElementById("edit-question-text").value.trim();
    const answers = document
      .getElementById("edit-acceptable-answers")
      .value.trim()
      .split(",")
      .map(a => a.trim().toLowerCase());
    const imageOrText = document.getElementById("edit-image-or-text").value.trim();
    const tagsInput = document.getElementById("edit-tags-input");
    
    // Process tags with validation
    let tags = [];
    if (tagsInput && tagsInput.value.trim()) {
      tags = tagsInput.value.trim()
        .split(",")
        .map(t => t.trim().toLowerCase())
        .filter(t => t) // Remove empty tags
        .slice(0, 3); // Limit to 3 tags maximum
    }
    
    // Default to "general" if no tags provided
    if (tags.length === 0) {
      tags = ["general"];
    }

    if (!questionText || answers.length === 0) {
      alert('Question text and at least one answer are required!');
      return;
    }

    // Validate tag count
    if (tags.length > 3) {
      alert("Maximum of 3 tags allowed. Only the first 3 will be used.");
      tags = tags.slice(0, 3);
    }

    const success = Model.updateQuestion(currentEditingIndex, { 
      question: questionText, 
      acceptableAnswers: answers, 
      imageOrText,
      tags: tags
    });
    
    if (success) {
      alert(`Question updated successfully with tags: ${tags.join(", ")}`);
      currentEditingIndex = -1;
      switchScreen("admin");
      // Refresh the admin view to show updated question
      showAdminView();
    } else {
      alert('Failed to update question!');
    }
  };

  const deleteCurrentQuestion = () => {
    if (currentEditingIndex === -1) {
      alert('No question selected for deletion!');
      return;
    }

    const question = Model.getQuestionByIndex(currentEditingIndex);
    if (!question) {
      alert('Question not found!');
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete this question?\n\n"${question.question}"`);
    if (!confirmDelete) return;

    const success = Model.deleteQuestion(currentEditingIndex);
    if (success) {
      alert('Question deleted successfully!');
      currentEditingIndex = -1;
      switchScreen("admin");
      // Refresh the admin view
      showAdminView();
    } else {
      alert('Failed to delete question!');
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
    // Model.load() is now called automatically when Model.js loads

    startGameBtn.addEventListener("click", startGame);
    gameSettingsBtn.addEventListener("click", () => {
      stopTimer(); // Stop timer when going to settings
      QuestionView.hideTimer();
      GameSettingsView.showSettingsScreen();
    });
    addQuestionBtn.addEventListener("click", () => {
      stopTimer(); // Stop timer when leaving game
      QuestionView.hideTimer();
      switchScreen("form");
    });
    form.addEventListener("submit", submitNewQuestion);
    
    // Edit form listeners
    if (editForm) {
      editForm.addEventListener("submit", submitEditQuestion);
      
      // Real-time preview updates
      ["edit-question-text", "edit-acceptable-answers", "edit-image-or-text", "edit-tags-input"].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.addEventListener("input", updateQuestionPreview);
        }
      });
    }

    if (editBackBtn) {
      editBackBtn.addEventListener("click", () => {
        currentEditingIndex = -1;
        switchScreen("admin");
      });
    }

    if (deleteQuestionBtn) {
      deleteQuestionBtn.addEventListener("click", deleteCurrentQuestion);
    }
    
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

  return { init, editQuestion, startGameWithFilters };
})();

// Make GameController globally accessible
window.GameController = GameController;

// ------------------ bootstrap -------------------------
window.onload = () => GameController.init();
