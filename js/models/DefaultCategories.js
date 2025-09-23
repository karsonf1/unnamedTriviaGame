// js/models/DefaultCategories.js
// Adds sample questions across multiple categories for testing

(function addDefaultCategories() {
  // Only add if we don't already have diverse categories
  const existingTags = Model.getAllTags();
  
  // If we already have multiple non-pokemon categories, skip
  const nonPokemonTags = existingTags.filter(tag => tag !== 'pokemon');
  if (nonPokemonTags.length >= 5) {
    console.log('Default categories already exist, skipping...');
    return;
  }

  console.log('Adding default category questions...');

  // History questions
  Model.addQuestion({
    question: "What year did World War II end?",
    acceptableAnswers: ["1945"],
    imageOrText: "",
    tags: ["history"]
  });

  // Science questions
  Model.addQuestion({
    question: "What is the chemical symbol for gold?",
    acceptableAnswers: ["au"],
    imageOrText: "",
    tags: ["science"]
  });

  // Geography questions
  Model.addQuestion({
    question: "What is the capital of Australia?",
    acceptableAnswers: ["canberra"],
    imageOrText: "",
    tags: ["geography"]
  });

  // Sports questions
  Model.addQuestion({
    question: "How many players are on a basketball team on the court at one time?",
    acceptableAnswers: ["5", "five"],
    imageOrText: "",
    tags: ["sports"]
  });

  // Movies questions
  Model.addQuestion({
    question: "Who directed the movie 'Jaws'?",
    acceptableAnswers: ["steven spielberg", "spielberg"],
    imageOrText: "",
    tags: ["movies"]
  });

  // Music questions
  Model.addQuestion({
    question: "Which band released the album 'Abbey Road'?",
    acceptableAnswers: ["the beatles", "beatles"],
    imageOrText: "",
    tags: ["music"]
  });

  // Food questions
  Model.addQuestion({
    question: "What spice is derived from the Crocus flower?",
    acceptableAnswers: ["saffron"],
    imageOrText: "",
    tags: ["food"]
  });

  // Technology questions
  Model.addQuestion({
    question: "What does 'HTML' stand for?",
    acceptableAnswers: ["hypertext markup language"],
    imageOrText: "",
    tags: ["technology"]
  });

  // Literature questions
  Model.addQuestion({
    question: "Who wrote 'To Kill a Mockingbird'?",
    acceptableAnswers: ["harper lee"],
    imageOrText: "",
    tags: ["literature"]
  });

  // Art questions
  Model.addQuestion({
    question: "Who painted 'The Starry Night'?",
    acceptableAnswers: ["vincent van gogh", "van gogh"],
    imageOrText: "",
    tags: ["art"]
  });

  // Multi-tag examples to demonstrate cross-category functionality
  Model.addQuestion({
    question: "What was Elvis Presley's favorite food?",
    acceptableAnswers: ["peanut butter and banana sandwich", "peanut butter banana sandwich"],
    imageOrText: "",
    tags: ["music", "food", "entertainment"]
  });

  Model.addQuestion({
    question: "Which actor starred in both 'The Matrix' and 'John Wick'?",
    acceptableAnswers: ["keanu reeves"],
    imageOrText: "",
    tags: ["movies", "entertainment", "actors"]
  });

  Model.addQuestion({
    question: "What sport does Serena Williams play?",
    acceptableAnswers: ["tennis"],
    imageOrText: "",
    tags: ["sports", "entertainment"]
  });

  console.log('Default category questions added successfully!');
})();