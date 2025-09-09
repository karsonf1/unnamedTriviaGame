// js/views/QuestionView.js
const QuestionView = (() => {
  const questionDisplay = document.getElementById("question-display");

  const renderQuestion = (questionObj) => {
    if (!questionObj) {
      questionDisplay.innerHTML = "<p>No questions yet. Add some!</p>";
      return;
    }

    let content = `<p><strong>Question:</strong> ${questionObj.question}</p>`;

    if (questionObj.imageOrText) {
      if (/^https?:\/\//.test(questionObj.imageOrText)) {
        content += `<img src="${questionObj.imageOrText}" alt="Question Image" style="max-width:300px;" />`;
      } else {
        content += `<p>${questionObj.imageOrText}</p>`;
      }
    }

    questionDisplay.innerHTML = content;
  };

  return { renderQuestion };
})();
