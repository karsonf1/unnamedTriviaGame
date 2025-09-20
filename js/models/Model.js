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
  return { load, save, addQuestion, getRandomQuestion, getQuestions, getAllTags };
})();
window.Model = Model;

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
  if (changed && typeof window.Model.saveQuestions === 'function') {
    window.Model.saveQuestions(questions);
    console.log('Fixed string tags to arrays for all questions.');
  } else if (changed) {
    console.log('Tags fixed in memory, but Model.saveQuestions not found.');
  } else {
    console.log('No string tags found to fix.');
  }
})();