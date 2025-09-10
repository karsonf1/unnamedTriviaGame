// Admin view logic for category/tag selection and question preview
document.addEventListener("DOMContentLoaded", function() {
	const adminBtn = document.getElementById("admin-view-btn");
	if (adminBtn) {
		adminBtn.style.display = "inline-block";
		adminBtn.onclick = function() {
			if (window.View && window.Model && window.QuestionListView) {
				window.View.showScreen("admin");
				window.QuestionListView.renderAdminView(window.Model.getQuestions());
			}
		};
	}

	// Back button in admin view
	const adminBackBtn = document.getElementById("admin-back-btn");
	if (adminBackBtn) {
		adminBackBtn.onclick = function() {
			if (window.View) window.View.showScreen("home");
		};
	}
});
