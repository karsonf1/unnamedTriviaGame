// js/views/GameSettingsView.js
// Handles the game settings screen with category filtration
const GameSettingsView = (() => {
    const settingsScreen = document.getElementById("game-settings-screen");
    const categoryCheckboxes = document.getElementById("category-checkboxes");
    const questionCountSpan = document.getElementById("question-count");
    const selectAllBtn = document.getElementById("select-all-categories");
    const deselectAllBtn = document.getElementById("deselect-all-categories");
    const startFilteredGameBtn = document.getElementById("start-filtered-game");
    const settingsBackBtn = document.getElementById("settings-back-btn");

    let selectedCategories = new Set();

    const showSettingsScreen = () => {
        View.showScreen("game-settings-screen");
        renderCategoryFilters();
        updateQuestionCount();
    };

    const renderCategoryFilters = () => {
        const allTags = Model.getAllTags();
        
        if (allTags.length === 0) {
            categoryCheckboxes.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No categories available. Add some questions first!</p>';
            return;
        }

        // Initialize all categories as selected by default
        if (selectedCategories.size === 0) {
            allTags.forEach(tag => selectedCategories.add(tag));
        }

        categoryCheckboxes.innerHTML = allTags.map(tag => {
            const questionsWithTag = Model.getQuestions().filter(q => 
                (q.tags || []).includes(tag)
            ).length;
            const isSelected = selectedCategories.has(tag);
            
            return `
                <div class="category-checkbox-item ${isSelected ? 'selected' : ''}" data-tag="${tag}">
                    <input type="checkbox" class="category-checkbox" id="cat-${tag}" ${isSelected ? 'checked' : ''}>
                    <label class="category-label" for="cat-${tag}">${tag}</label>
                    <span class="category-question-count">(${questionsWithTag})</span>
                </div>
            `;
        }).join('');

        attachCategoryEventListeners();
    };

    const attachCategoryEventListeners = () => {
        // Handle individual category selection
        categoryCheckboxes.querySelectorAll('.category-checkbox-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    const checkbox = item.querySelector('.category-checkbox');
                    checkbox.checked = !checkbox.checked;
                }
                
                const tag = item.dataset.tag;
                const checkbox = item.querySelector('.category-checkbox');
                
                if (checkbox.checked) {
                    selectedCategories.add(tag);
                    item.classList.add('selected');
                } else {
                    selectedCategories.delete(tag);
                    item.classList.remove('selected');
                }
                
                updateQuestionCount();
            });
        });

        // Select All button
        selectAllBtn.addEventListener('click', () => {
            const allTags = Model.getAllTags();
            selectedCategories = new Set(allTags);
            renderCategoryFilters();
            updateQuestionCount();
        });

        // Deselect All button
        deselectAllBtn.addEventListener('click', () => {
            selectedCategories = new Set();
            renderCategoryFilters();
            updateQuestionCount();
        });

        // Start Game button
        startFilteredGameBtn.addEventListener('click', () => {
            if (selectedCategories.size === 0) {
                alert('Please select at least one category to play!');
                return;
            }
            
            const filteredQuestions = Model.getQuestionsByTags(Array.from(selectedCategories), []);
            
            if (filteredQuestions.length === 0) {
                alert('No questions found for the selected categories!');
                return;
            }

            // Start the game with filtered questions
            startGameWithFilters();
        });

        // Back button
        settingsBackBtn.addEventListener('click', () => {
            View.showScreen("home-screen");
        });
    };

    const updateQuestionCount = () => {
        if (selectedCategories.size === 0) {
            questionCountSpan.textContent = '0';
            return;
        }

        const filteredQuestions = Model.getQuestionsByTags(Array.from(selectedCategories), []);
        questionCountSpan.textContent = filteredQuestions.length;
        
        // Update the start button state
        if (filteredQuestions.length === 0) {
            startFilteredGameBtn.disabled = true;
            startFilteredGameBtn.style.opacity = '0.5';
            startFilteredGameBtn.style.cursor = 'not-allowed';
        } else {
            startFilteredGameBtn.disabled = false;
            startFilteredGameBtn.style.opacity = '1';
            startFilteredGameBtn.style.cursor = 'pointer';
        }
    };

    const startGameWithFilters = () => {
        // Store the selected filters in a way GameController can access them
        window.gameFilters = {
            includeTags: Array.from(selectedCategories),
            excludeTags: []
        };
        
        // Start the game
        View.showScreen("game-screen");
        if (window.GameController && typeof GameController.startGameWithFilters === 'function') {
            GameController.startGameWithFilters(window.gameFilters);
        } else {
            // Fallback to regular game start if filter support not implemented yet
            GameController.startGame();
        }
    };

    const getSelectedCategories = () => {
        return Array.from(selectedCategories);
    };

    const setSelectedCategories = (categories) => {
        selectedCategories = new Set(categories);
        if (settingsScreen.style.display !== 'none') {
            renderCategoryFilters();
            updateQuestionCount();
        }
    };

    return {
        showSettingsScreen,
        getSelectedCategories,
        setSelectedCategories,
        renderCategoryFilters,
        updateQuestionCount
    };
})();

window.GameSettingsView = GameSettingsView;