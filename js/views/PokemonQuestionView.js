// js/views/PokemonQuestionView.js
// Renders a grid of pokemon questions and handles preview
const PokemonQuestionView = (() => {
  // Create or get the pokemon screen container
  let pokemonScreen = document.getElementById("pokemon-question-screen");
  if (!pokemonScreen) {
    pokemonScreen = document.createElement("div");
    pokemonScreen.id = "pokemon-question-screen";
    pokemonScreen.style.display = "none";
    pokemonScreen.innerHTML = `
      <h1 id="main-title">Hipster Trivia</h1>
      <div id="pokemon-grid"></div>
      <button id="pokemon-back-btn" style="margin:24px auto;display:block;">Back</button>
    `;
    document.body.appendChild(pokemonScreen);
  }

  function renderGrid(questions) {
    // Hide all other screens
    document.querySelectorAll("body > div[id$='screen']").forEach(div => div.style.display = "none");
    pokemonScreen.style.display = "block";
    // Render grid
    const grid = pokemonScreen.querySelector("#pokemon-grid");
    grid.innerHTML = questions.map((q, i) =>
      `<div class="pokemon-img-box" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px #0001;padding:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;margin:8px;" data-idx="${i}">
        <img src="${q.imageOrText}" alt="Pokemon" style="max-width:80px;max-height:80px;object-fit:contain;"/>
      </div>`
    ).join("");
    // Add click listeners for preview
    grid.querySelectorAll(".pokemon-img-box").forEach((box, i) => {
      box.onclick = () => {
        // Hide pokemon screen and show the question using QuestionView
        pokemonScreen.style.display = "none";
        if (window.View && window.QuestionView) {
          window.View.showScreen("game");
          window.QuestionView.renderQuestion(questions[i]);
        }
      };
    });
    // Back button
    const backBtn = pokemonScreen.querySelector("#pokemon-back-btn");
    backBtn.onclick = () => {
      pokemonScreen.style.display = "none";
      if (window.View) window.View.showScreen("admin");
    };
  }

  return { renderGrid };
})();
window.PokemonQuestionView = PokemonQuestionView;
