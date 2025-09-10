// js/views/QuestionListView.js
const QuestionListView = (() => {
  const allQuestionsList = document.getElementById("all-questions-list");
  const tagList = document.getElementById("tag-list");
  let allQuestions = [];

  // Render category/tag buttons
  function renderCategoryButtons(tags) {
    tagList.innerHTML = tags.map(tag => `<button class="tag-btn" data-tag="${tag}">${tag}</button>`).join(" ");
    // Add click listeners
    tagList.querySelectorAll(".tag-btn").forEach(btn => {
      btn.onclick = () => renderQuestionsByTag(btn.dataset.tag);
    });
  }

  // Render questions for a given tag/category
  function renderQuestionsByTag(tag) {
    const questions = allQuestions.filter(q => (q.tags || []).includes(tag));
    if (tag === "pokemon") {
      // Show grid of images only
      allQuestionsList.innerHTML = `<div id="pokemon-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:12px;width:100%;">` +
        questions.map((q, i) =>
          `<div class="pokemon-img-box" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px #0001;padding:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;" data-idx="${i}">
            <img src="${q.imageOrText}" alt="Pokemon" style="max-width:80px;max-height:80px;object-fit:contain;"/>
          </div>`
        ).join("") + `</div>`;
      // Add click listeners for preview
      allQuestionsList.querySelectorAll(".pokemon-img-box").forEach((box, i) => {
        box.onclick = () => showQuestionPreview(questions[i]);
      });
    } else {
      // Default: show all questions in list
      allQuestionsList.innerHTML = questions.length === 0
        ? "<p>No questions in this category.</p>"
        : questions.map((q, i) =>
          `<div style="border:1px solid #ccc; margin-bottom:8px; padding:8px;cursor:pointer;" data-idx="${i}">
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
        ).join("");
      // Add click listeners for preview
      allQuestionsList.querySelectorAll("[data-idx]").forEach((box, i) => {
        box.onclick = () => showQuestionPreview(questions[i]);
      });
    }
  }

  // Show preview of a question as in the game
  function showQuestionPreview(questionObj) {
    // Reuse the game screen and QuestionView
    if (window.View && window.QuestionView) {
      window.View.showScreen("game");
      window.QuestionView.renderQuestion(questionObj);
      // Optionally hide answer input/submit for preview
      document.getElementById("user-answer").style.display = "none";
      document.getElementById("submit-answer-btn").style.display = "none";
      document.getElementById("feedback").style.display = "none";
    }
  }

  // Restore game screen to normal (show answer input, etc)
  function restoreGameScreen() {
    document.getElementById("user-answer").style.display = "";
    document.getElementById("submit-answer-btn").style.display = "";
    document.getElementById("feedback").style.display = "";
  }

  // Main entry: render all categories/tags
  function renderAdminView(questions) {
    allQuestions = questions;
    // Get all unique tags
    const tags = Array.from(new Set(questions.flatMap(q => q.tags || [])));
    renderCategoryButtons(tags);
    allQuestionsList.innerHTML = "<p>Select a category to view questions.</p>";
    restoreGameScreen();
  }

  return { renderAdminView, renderQuestionsByTag };
})();
window.QuestionListView = QuestionListView;