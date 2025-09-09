const View = (() => {
  const questionDisplay = document.getElementById("question-display");
  const allQuestionsList = document.getElementById("all-questions-list");

  const renderQuestion = (questionObj) => {
    if (!questionObj) {
      questionDisplay.innerHTML = "<p>No questions yet. Add some!</p>";
      return;
    }

    let content = `<p><strong>Question:</strong> ${questionObj.question}</p>`;

    if (questionObj.imageOrText) {
      if (questionObj.imageOrText.match(/^https?:\/\//)) {
        content += `<img src="${questionObj.imageOrText}" alt="Question Image" style="max-width:300px;" />`;
      } else {
        content += `<p>${questionObj.imageOrText}</p>`;
      }
    }

    questionDisplay.innerHTML = content;
  };

  const renderAllQuestions = (questions) => {
    if (questions.length === 0) {
      allQuestionsList.innerHTML = "<p>No questions saved yet.</p>";
      return;
    }

    allQuestionsList.innerHTML = questions
      .map(
        (q, i) =>
          `<div style="border:1px solid #ccc; margin-bottom:8px; padding:8px;">
            <strong>Q${i + 1}:</strong> ${q.question}<br/>
            Acceptable Answers: ${q.acceptableAnswers.join(", ")}<br/>
            ${
              q.imageOrText
                ? q.imageOrText.match(/^https?:\/\//)
                  ? `<img src="${q.imageOrText}" alt="Image" style="max-width:150px;"/>`
                  : `<p>${q.imageOrText}</p>`
                : ""
            }
          </div>`
      )
      .join("");
  };

  return { renderQuestion, renderAllQuestions };
})();
