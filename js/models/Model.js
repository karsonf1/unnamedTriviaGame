const Model = (() => {
  let questions = [];

  // Seed default question(s)
  const defaultQuestions = [
    {
      question: "Who's that Pokemon?",
      acceptableAnswers: ["gliscor"], // normalize to lowercase
      imageOrText: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/472.png",
      tags: ["pokemon"] // new field for filtering later
    }
  ];

  // ------------------ persistence ----------------------
  const load = () => {
    const data = localStorage.getItem("hipsterTriviaQuestions");
    if (data) {
      questions = JSON.parse(data);
    } else {
      questions = defaultQuestions;
      save(); // persist defaults
    }
  };

  const save = () => {
    localStorage.setItem("hipsterTriviaQuestions", JSON.stringify(questions));
  };

  // ------------------ question management --------------
  const addQuestion = (questionObj) => {
    // normalize answers
    questionObj.acceptableAnswers = questionObj.acceptableAnswers.map(a => a.toLowerCase());
    // ensure tags array exists
    if (!questionObj.tags) questionObj.tags = [];
    questions.push(questionObj);
    save();
  };

  const updateQuestion = (index, questionObj) => {
    if (index >= 0 && index < questions.length) {
      // normalize answers
      questionObj.acceptableAnswers = questionObj.acceptableAnswers.map(a => a.toLowerCase());
      // ensure tags array exists
      if (!questionObj.tags) questionObj.tags = [];
      questions[index] = questionObj;
      save();
      return true;
    }
    return false;
  };

  const deleteQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      questions.splice(index, 1);
      save();
      return true;
    }
    return false;
  };

  const getQuestionByIndex = (index) => {
    if (index >= 0 && index < questions.length) {
      return { ...questions[index], index }; // Return copy with index
    }
    return null;
  };

  const getRandomQuestion = () => {
    if (questions.length === 0) return null;
    const index = Math.floor(Math.random() * questions.length);
    return questions[index];
  };

  const getQuestions = (filterTags = [], excludeTags = []) => {
    return questions.filter(q => {
      const hasInclude = filterTags.length === 0 || filterTags.some(tag => q.tags.includes(tag));
      const hasExclude = excludeTags.some(tag => q.tags.includes(tag));
      return hasInclude && !hasExclude;
    });
  };
  
  const getAllTags = () => {
    const tagSet = new Set();
    questions.forEach(q => (q.tags || []).forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet);
  }

  const getQuestionsByTags = (includeTags = [], excludeTags = []) => {
    if (includeTags.length === 0 && excludeTags.length === 0) {
      return questions;
    }
    
    return questions.filter(q => {
      const questionTags = q.tags || [];
      
      // If exclude tags are specified, make sure question doesn't have any of them
      if (excludeTags.length > 0) {
        const hasExcludedTag = excludeTags.some(tag => questionTags.includes(tag));
        if (hasExcludedTag) return false;
      }
      
      // If include tags are specified, make sure question has at least one of them
      if (includeTags.length > 0) {
        const hasIncludedTag = includeTags.some(tag => questionTags.includes(tag));
        if (!hasIncludedTag) return false;
      }
      
      return true;
    });
  }

  // Debug function to check localStorage
  const debugStorage = () => {
    const data = localStorage.getItem("hipsterTriviaQuestions");
    console.log('=== STORAGE DEBUG ===');
    console.log('LocalStorage data exists:', !!data);
    console.log('LocalStorage data length:', data?.length);
    console.log('Current questions in memory:', questions.length);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log('Parsed questions from storage:', parsed.length);
        console.log('First stored question:', parsed[0]);
      } catch (e) {
        console.error('Error parsing localStorage data:', e);
      }
    }
    console.log('Current questions in memory (first 3):');
    questions.slice(0, 3).forEach((q, i) => {
      console.log(`  ${i+1}:`, q.question, q.tags);
    });
    console.log('=== END DEBUG ===');
  };

  return { load, save, addQuestion, updateQuestion, deleteQuestion, getQuestionByIndex, getRandomQuestion, getQuestions, getAllTags, getQuestionsByTags, debugStorage };
})();
window.Model = Model;

// Load data immediately when the model is defined
Model.load();

// Migration: Convert string tags to arrays for all questions
(function fixQuestionTags() {
  if (!window.Model || typeof window.Model.getQuestions !== 'function') return;
  const questions = window.Model.getQuestions();
  let changed = false;
  questions.forEach(q => {
    if (typeof q.tags === 'string') {
      q.tags = [q.tags.trim()];
      changed = true;
    }
  });
  if (changed && typeof window.Model.save === 'function') {
    window.Model.save();
    console.log('Fixed string tags to arrays for all questions.');
  } else if (changed) {
    console.log('Tags fixed in memory, but Model.save not found.');
  } else {
    console.log('No string tags found to fix.');
  }
})();