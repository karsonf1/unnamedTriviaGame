// Permanent Questions - These will be available across all machines
// Add your questions here, then commit them to Git to sync across devices

const PermanentQuestions = [
  {
    question: "Who is this Sith Lord?",
    acceptableAnswers: ["Darth Maul"],
    imageOrText: "https://static.wikia.nocookie.net/starwars/images/5/5f/Darth_Maul_SWSB.png",
    tags: ["entertainment", "movies", "star wars"]
  },
  
  // Add your new permanent questions below this line:
  // {
  //   question: "Your question here?",
  //   acceptableAnswers: ["answer1", "answer2", "answer3"],
  //   imageOrText: "", // URL or leave empty
  //   tags: ["tag1", "tag2"]
  // },
  
];

// Make it available globally
window.PermanentQuestions = PermanentQuestions;