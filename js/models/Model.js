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

  return { load, save, addQuestion, getRandomQuestion, getQuestions };
})();
