// js/views/QuestionView.js
const QuestionView = (() => {
  const questionDisplay = document.getElementById("question-display");
  const timerDisplay = document.getElementById("timer-display");

  const renderQuestion = (questionObj) => {
    if (!questionObj) {
      questionDisplay.innerHTML = "<p>No questions yet. Add some!</p>";
      return;
    }

    let html = `<p><strong>Question:</strong> ${questionObj.question}</p>`;

    if (questionObj.imageOrText) {
      if (/^https?:\/\//.test(questionObj.imageOrText)) {
        html += `
          <div class="image-container">
            <img src="${questionObj.imageOrText}" alt="Question Image" />
          </div>
        `;
      } else {
        html += `<p>${questionObj.imageOrText}</p>`;
      }
    }

    questionDisplay.innerHTML = html;
    
    // Reset timer display
    if (timerDisplay) {
      timerDisplay.textContent = "Time: 10.000s";
      timerDisplay.style.color = "#B23A48"; /* accent color */
    }
  };

  const updateTimer = (milliseconds) => {
    if (timerDisplay) {
      const seconds = (milliseconds / 1000).toFixed(3);
      timerDisplay.textContent = `Time: ${seconds}s`;
      
      // Change color as time runs out
      if (milliseconds <= 3000) {
        timerDisplay.style.color = "#dc2626"; // red
      } else if (milliseconds <= 5000) {
        timerDisplay.style.color = "#ea580c"; // orange
      } else {
        timerDisplay.style.color = "#B23A48"; // accent color default
      }
    }
  };

  const showCorrectAnswer = (questionObj) => {
    if (!questionObj || !questionObj.acceptableAnswers || questionObj.acceptableAnswers.length === 0) {
      return;
    }

    // Get the first acceptable answer and capitalize it
    const correctAnswer = questionObj.acceptableAnswers[0];
    const capitalizedAnswer = correctAnswer.charAt(0).toUpperCase() + correctAnswer.slice(1);

    let html = `<p><strong>Question:</strong> ${questionObj.question}</p>`;
    
    // Replace the image/text with the correct answer display
    html += `
      <div style="background: #4ade80; font-family: 'Times New Roman', sans-serif; color: white; padding: 20px; border-radius: 12px; text-align: center; font-size: 24px; font-weight: normal; margin: 20px 0;">
        ${capitalizedAnswer}
      </div>
    `;

    questionDisplay.innerHTML = html;
  };

  const showTimeElapsed = (timeElapsedMs, isCorrect) => {
    const seconds = (timeElapsedMs / 1000).toFixed(3);
    let message, bgColor, icon;
    
    if (isCorrect === true) {
      message = `✅ Correct! Time: ${seconds}s`;
      bgColor = "#16a34a"; // green
      icon = "✅";
    } else if (isCorrect === false) {
      message = `❌ Incorrect! Time: ${seconds}s`;
      bgColor = "#dc2626"; // red  
      icon = "❌";
    } else {
      message = `⏰ Time's up! Total: ${seconds}s`;
      bgColor = "#ea580c"; // orange
      icon = "⏰";
    }
    
    // Update timer display to show elapsed time
    if (timerDisplay) {
      timerDisplay.innerHTML = `
        <div style="background: ${bgColor}; color: white; padding: 10px 15px; border-radius: 8px; font-size: 18px; font-weight: bold;">
          ${message}
        </div>
      `;
    }
  };

  const hideTimer = () => {
    if (timerDisplay) {
      timerDisplay.style.display = "none";
    }
  };

  const showTimer = () => {
    if (timerDisplay) {
      timerDisplay.style.display = "block";
    }
  };

  return { renderQuestion, updateTimer, hideTimer, showTimer, showCorrectAnswer, showTimeElapsed };
})();
window.QuestionView = QuestionView;