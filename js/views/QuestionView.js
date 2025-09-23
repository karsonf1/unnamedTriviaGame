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
      timerDisplay.textContent = "Time: 10";
      timerDisplay.style.color = "#B23A48"; /* accent color */
    }
  };

  const updateTimer = (seconds) => {
    if (timerDisplay) {
      timerDisplay.textContent = `Time: ${seconds}`;
      
      // Change color as time runs out
      if (seconds <= 3) {
        timerDisplay.style.color = "#dc2626"; // red
      } else if (seconds <= 5) {
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
      <div style="background: #4ade80; color: white; padding: 20px; border-radius: 12px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
        ${capitalizedAnswer}
      </div>
    `;

    questionDisplay.innerHTML = html;
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

  return { renderQuestion, updateTimer, hideTimer, showTimer, showCorrectAnswer };
})();
window.QuestionView = QuestionView;