// js/views/QuestionView.js
const QuestionView = (() => {
  const questionDisplay = document.getElementById("question-display");

  const renderQuestion = (questionObj) => {
    if (!questionObj) {
      questionDisplay.innerHTML = "<p>No questions yet. Add some!</p>";
      return;
    }

    let html = `<p><strong>Question:</strong> ${questionObj.question}</p>`;

    if (questionObj.imageOrText) {
      if (/^https?:\/\//.test(questionObj.imageOrText)) {
        html += `<img src="${questionObj.imageOrText}" alt="Question Image" style="max-width:300px;" />`;
      } else {
        html += `<p>${questionObj.imageOrText}</p>`;
      }
    }

    questionDisplay.innerHTML = html;
  };

  return { renderQuestion };
})();
window.QuestionView = QuestionView;