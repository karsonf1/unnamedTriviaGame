// js/views/QuestionEditor.js
const QuestionEditor = (() => {
  
  // Helper function to find the original index of a question in the full questions array
  const findOriginalIndex = (question, allQuestions) => {
    return allQuestions.findIndex(original => 
      original.question === question.question && 
      JSON.stringify(original.acceptableAnswers) === JSON.stringify(question.acceptableAnswers) &&
      original.imageOrText === question.imageOrText
    );
  };

  // Render edit buttons for any question
  const renderEditButtons = (question, index, allQuestions) => {
    const originalIndex = findOriginalIndex(question, allQuestions);
    return `
      <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 5px;">
        <button class="edit-question-btn" data-original-idx="${originalIndex}" style="background: #E67E22; color: white; border: none; padding: 5px 10px; border-radius: 5px; font-size: 12px; cursor: pointer;">✏️ Edit</button>
        <button class="preview-question-btn" data-idx="${index}" style="background: #2C3E50; color: white; border: none; padding: 5px 10px; border-radius: 5px; font-size: 12px; cursor: pointer;">👁️ View</button>
      </div>
    `;
  };

  // Render a complete question item with edit controls
  const renderQuestionItem = (question, index, allQuestions) => {
    const originalIndex = findOriginalIndex(question, allQuestions);
    
    return `
      <div class="question-item" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 16px; cursor: pointer; position: relative;" data-idx="${index}" data-original-idx="${originalIndex}">
        <div style="font-weight: bold; margin-bottom: 8px;">Q: ${question.question}</div>
        <div style="color: #666; font-size: 14px; margin-bottom: 8px;">
          Answer(s): ${Array.isArray(question.acceptableAnswers) ? question.acceptableAnswers.join(', ') : question.acceptableAnswers}
        </div>
        <div style="color: #888; font-size: 12px; margin-bottom: 8px;">
          Tags: ${Array.isArray(question.tags) ? question.tags.map(tag => `<span style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">${tag}</span>`).join('') : 'none'}
        </div>
        ${question.imageOrText && question.imageOrText.startsWith('http') ? 
          `<div style="margin-top: 8px;"><img src="${question.imageOrText}" alt="Question image" style="max-width: 100px; max-height: 100px; object-fit: contain;"/></div>` : 
          question.imageOrText ? 
          `<div style="margin-top: 8px; color: #666; font-style: italic;">${question.imageOrText}</div>` : 
          ''}
        ${renderEditButtons(question, index, allQuestions)}
      </div>
    `;
  };

  // Attach event listeners for edit and preview buttons
  const attachEventListeners = (container, questionsWithTag) => {
    // Preview button listeners
    container.querySelectorAll(".preview-question-btn").forEach((btn, i) => {
      btn.onclick = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        if (window.View && window.QuestionView) {
          console.log('Preview question clicked, index:', i);
          window.View.showScreen("game");
          window.QuestionView.renderQuestion(questionsWithTag[i]);
        }
      };
    });

    // Edit button listeners
    container.querySelectorAll(".edit-question-btn").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        const originalIndex = parseInt(btn.dataset.originalIdx);
        console.log('Edit question clicked, original index:', originalIndex);
        if (window.GameController && typeof window.GameController.editQuestion === 'function') {
          window.GameController.editQuestion(originalIndex);
        } else {
          console.error('GameController.editQuestion not found');
        }
      };
    });
  };

  // Main function to render questions with edit capabilities
  const renderQuestionsWithEditor = (questionsWithTag, tagToFilter, allQuestions, container) => {
    container.innerHTML = `
      <h3>${tagToFilter.charAt(0).toUpperCase() + tagToFilter.slice(1)} Questions (${questionsWithTag.length})</h3>
      <div style="display: flex; flex-direction: column; gap: 16px; padding: 20px;">
        ${questionsWithTag.map((q, i) => renderQuestionItem(q, i, allQuestions)).join('')}
      </div>
    `;
    
    attachEventListeners(container, questionsWithTag);
  };

  return {
    renderEditButtons,
    renderQuestionItem,
    attachEventListeners,
    renderQuestionsWithEditor,
    findOriginalIndex
  };
})();

// Make QuestionEditor globally accessible
window.QuestionEditor = QuestionEditor;
