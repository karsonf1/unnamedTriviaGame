const Model = (() => {
  let questions = [];

  const defaultQuestions = [
    {
        question: "Who's that Pokemon?",
        acceptableAnswers: ["Gliscor", "gliscor"],
        imageOrText: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/472.png"
    }];


  const load = () => {
    const data = localStorage.getItem("hipsterTriviaQuestions");
    if (data) {
      questions = JSON.parse(data);
    } else {
      questions = defaultQuestions;
      save(); // Save defaults to localStorage so they persist
    }
  };
  const save = () => {
    localStorage.setItem("hipsterTriviaQuestions", JSON.stringify(questions));
  };

  const addQuestion = (questionObj) => {
    questions.push(questionObj);
    save();
  };

  const getRandomQuestion = () => {
    if (questions.length === 0) return null;
    const index = Math.floor(Math.random() * questions.length);
    return questions[index];
  };

  // Expose questions array
  return { 
    load, 
    addQuestion, 
    getRandomQuestion, 
    getQuestions: () => questions};
})();
