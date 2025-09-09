// js/views/QuestionListView.js
const QuestionListView = (() => {
  const allQuestionsList = document.getElementById("all-questions-list");

  const renderAllQuestions = (questions) => {
    if (questions.length === 0) {
      allQuestionsList.innerHTML = "<p>No questions saved yet.</p>";
      return;
    }

    allQuestionsList.innerHTML = questions
      .map(
        (q, i) => `
          <div style="border:1px solid #ccc; margin-bottom:8px; padding:8px;">
            <strong>Q${i + 1}:</strong> ${q.question}<br/>
            Acceptable Answers: ${q.acceptableAnswers.join(", ")}<br/>
            ${
              q.imageOrText
                ? /^https?:\/\//.test(q.imageOrText)
                  ? `<img src="${q.imageOrText}" alt="Image" style="max-width:150px;"/>`
                  : `<p>${q.imageOrText}</p>`
                : ""
            }
          </div>`
      )
      .join("");
  };

  return { renderAllQuestions };
})();
window.QuestionListView = QuestionListView;