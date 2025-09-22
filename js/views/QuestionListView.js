// js/views/QuestionListView.js
const QuestionListView = (() => {
  const allQuestionsList = document.getElementById("all-questions-list");
  const tagList = document.getElementById("tag-list");
  let allQuestions = [];

  // Render category/tag buttons with proper capitalization
  function renderCategoryButtons(tags) {
    console.log('Rendering category buttons for tags:', tags);
    
    tagList.innerHTML = tags.map(tag => {
      const displayName = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
      console.log(`Creating button for tag: "${tag}" with display: "${displayName}"`);
      return `<button class="tag-btn" data-tag="${tag}">${displayName}</button>`;
    }).join(" ");
    
    // Add click listeners
    tagList.querySelectorAll(".tag-btn").forEach(btn => {
      btn.onclick = () => {
        const tagValue = btn.dataset.tag;
        console.log('Button clicked, dataset.tag:', tagValue);
        renderQuestionsByTag(tagValue);
      };
    });
  }

  // Render questions for a selected tag/category
  function renderQuestionsByTag(selectedTag) {
    console.log('renderQuestionsByTag called with:', selectedTag);
    console.log('Type of selectedTag:', typeof selectedTag);
    
    // Ensure we have a valid string tag
    const tagToFilter = String(selectedTag || "").trim().toLowerCase();
    console.log('Filtering questions by tag:', tagToFilter);
    
    if (!tagToFilter) {
      allQuestionsList.innerHTML = `<p>No tag specified.</p>`;
      return;
    }
    
    // Re-fetch questions from Model to ensure we have the latest data
    if (window.Model && typeof window.Model.getQuestions === 'function') {
      allQuestions = window.Model.getQuestions();
      console.log('Re-fetched allQuestions from Model:', allQuestions.length, 'questions');
    }
    
    // Debug: Log the structure of questions and their tags
    console.log('All questions:', allQuestions);
    if (allQuestions.length > 0) {
      console.log('Sample question:', allQuestions[0]);
      console.log('Sample question tags:', allQuestions[0].tags);
    }
    
    // Filter questions that have this specific tag
    const questionsWithTag = allQuestions.filter(question => {
      console.log('Checking question:', question.question, 'with tags:', question.tags);
      
      if (!Array.isArray(question.tags)) {
        console.log('Question has no tags array');
        return false;
      }
      
      const hasTag = question.tags.some(tag => {
        if (typeof tag !== 'string') {
          console.log('Tag is not a string:', tag, typeof tag);
          return false;
        }
        const match = tag.trim().toLowerCase() === tagToFilter;
        console.log(`Comparing "${tag.trim().toLowerCase()}" === "${tagToFilter}":`, match);
        return match;
      });
      
      console.log('Question has matching tag:', hasTag);
      return hasTag;
    });
    
    console.log(`Found ${questionsWithTag.length} questions with tag "${tagToFilter}"`);
    
    if (questionsWithTag.length === 0) {
      allQuestionsList.innerHTML = `<p>No questions found in the "${tagToFilter}" category.</p>`;
      return;
    }
    
    // Special handling for Pokemon - show as image grid
    if (tagToFilter === 'pokemon') {
      allQuestionsList.innerHTML = `
        <h3>Pokemon Questions (${questionsWithTag.length})</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; padding: 20px;">
          ${questionsWithTag.map((q, i) => `
            <div class="pokemon-box" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center;" data-idx="${i}">
              <img src="${q.imageOrText}" alt="Pokemon" style="max-width: 80px; max-height: 80px; object-fit: contain;" onerror="this.style.display='none'"/>
            </div>
          `).join('')}
        </div>
      `;
      
      // Add click listeners for pokemon boxes
      console.log('About to add click listeners. Checking dependencies:');
      console.log('window.View exists:', !!window.View);
      console.log('window.QuestionView exists:', !!window.QuestionView);
      console.log('Number of pokemon boxes found:', allQuestionsList.querySelectorAll(".pokemon-box").length);
      
      if (window.View && window.QuestionView) {
        allQuestionsList.querySelectorAll(".pokemon-box").forEach((box, i) => {
          console.log('Adding click listener to pokemon box', i);
          box.onclick = () => {
            console.log('Pokemon box clicked, index:', i);
            console.log('Switching to game screen...');
            window.View.showScreen("game");
            console.log('Rendering question:', questionsWithTag[i]);
            window.QuestionView.renderQuestion(questionsWithTag[i]);
          };
        });
        console.log('Successfully added all click listeners');
      } else {
        console.error('Dependencies missing:');
        console.error('window.View:', window.View);
        console.error('window.QuestionView:', window.QuestionView);
      }
    } else {
      // For all other categories, show as a list with question details
      allQuestionsList.innerHTML = `
        <h3>${tagToFilter.charAt(0).toUpperCase() + tagToFilter.slice(1)} Questions (${questionsWithTag.length})</h3>
        <div style="display: flex; flex-direction: column; gap: 16px; padding: 20px;">
          ${questionsWithTag.map((q, i) => `
            <div class="question-item" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 16px; cursor: pointer;" data-idx="${i}">
              <div style="font-weight: bold; margin-bottom: 8px;">Q: ${q.question}</div>
              <div style="color: #666; font-size: 14px;">
                Answer(s): ${Array.isArray(q.acceptableAnswers) ? q.acceptableAnswers.join(', ') : q.acceptableAnswers}
              </div>
              ${q.imageOrText && q.imageOrText.startsWith('http') ? 
                `<div style="margin-top: 8px;"><img src="${q.imageOrText}" alt="Question image" style="max-width: 100px; max-height: 100px; object-fit: contain;"/></div>` : 
                ''}
            </div>
          `).join('')}
        </div>
      `;
      
      // Add click listeners for question items
      allQuestionsList.querySelectorAll(".question-item").forEach((item, i) => {
        item.onclick = () => {
          // Simply show the question using QuestionView - that's what preview is
          if (window.View && window.QuestionView) {
            window.View.showScreen("game");
            window.QuestionView.renderQuestion(questionsWithTag[i]);
          }
        };
      });
    }
  }

  // Main entry: render all categories/tags
  function renderAdminView(questions) {
    // Always repopulate allQuestions from the model
    if (window.Model && typeof window.Model.getQuestions === 'function') {
      allQuestions = window.Model.getQuestions();
      console.log('Populated allQuestions from Model:', allQuestions.length, 'questions');
    } else {
      allQuestions = questions || [];
      console.log('Populated allQuestions from argument:', allQuestions.length, 'questions');
    }
    
    // Debug: Log a sample question structure
    if (allQuestions.length > 0) {
      console.log('Sample question structure:', allQuestions[0]);
    }
    
    // Extract all unique tags from all questions
    const allTags = new Set();
    allQuestions.forEach(question => {
      if (Array.isArray(question.tags)) {
        question.tags.forEach(tag => {
          if (typeof tag === 'string' && tag.trim()) {
            allTags.add(tag.trim().toLowerCase());
          }
        });
      }
    });
    
    const uniqueTags = Array.from(allTags);
    console.log('Unique tags found:', uniqueTags);
    
    // Render category buttons
    renderCategoryButtons(uniqueTags);
    allQuestionsList.innerHTML = "<p>Select a category to view questions.</p>";
  }

  return { renderAdminView, renderQuestionsByTag };
})();
window.QuestionListView = QuestionListView;