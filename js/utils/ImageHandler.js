// Dynamic Image Handler for better scaling and display
const ImageHandler = (() => {
  
  // Enhance image display with dynamic sizing
  const enhanceImageDisplay = (img) => {
    if (!img) return;
    
    img.onload = function() {
      const container = this.parentElement;
      if (!container || !container.classList.contains('image-container')) return;
      
      // Get natural dimensions
      const naturalWidth = this.naturalWidth;
      const naturalHeight = this.naturalHeight;
      const aspectRatio = naturalWidth / naturalHeight;
      
      // Get viewport dimensions
      const maxWidth = Math.min(window.innerWidth * 0.9, 800);
      const maxHeight = Math.min(window.innerHeight * 0.7, 600);
      
      // Calculate optimal display size
      let displayWidth, displayHeight;
      
      if (aspectRatio > 1) {
        // Landscape image
        displayWidth = Math.min(naturalWidth, maxWidth);
        displayHeight = displayWidth / aspectRatio;
        
        if (displayHeight > maxHeight) {
          displayHeight = maxHeight;
          displayWidth = displayHeight * aspectRatio;
        }
      } else {
        // Portrait or square image
        displayHeight = Math.min(naturalHeight, maxHeight);
        displayWidth = displayHeight * aspectRatio;
        
        if (displayWidth > maxWidth) {
          displayWidth = maxWidth;
          displayHeight = displayWidth / aspectRatio;
        }
      }
      
      // Apply calculated dimensions to container
      container.style.width = displayWidth + 'px';
      container.style.height = displayHeight + 'px';
      container.style.display = 'flex';
      
      // Add a subtle animation
      container.style.opacity = '0';
      container.style.transform = 'scale(0.95)';
      container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'scale(1)';
      }, 50);
      
      // Store dimensions for potential future use
      this.displayWidth = displayWidth;
      this.displayHeight = displayHeight;
    };
    
    img.onerror = function() {
      const container = this.parentElement;
      if (container && container.classList.contains('image-container')) {
        container.style.display = 'none';
      }
    };
  };
  
  // Optimize all images in question display
  const optimizeQuestionImages = () => {
    const questionDisplay = document.getElementById('question-display');
    if (!questionDisplay) return;
    
    const images = questionDisplay.querySelectorAll('.image-container img');
    images.forEach(enhanceImageDisplay);
  };
  
  // Handle window resize for responsive adjustments
  const handleResize = () => {
    optimizeQuestionImages();
  };
  
  // Initialize the image handler
  const init = () => {
    // Listen for window resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 250);
    });
    
    // Create a mutation observer to handle dynamic image loading
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const images = node.querySelectorAll ? node.querySelectorAll('.image-container img') : [];
            images.forEach(enhanceImageDisplay);
            
            // Also check if the node itself is an image container
            if (node.classList && node.classList.contains('image-container')) {
              const img = node.querySelector('img');
              if (img) enhanceImageDisplay(img);
            }
          }
        });
      });
    });
    
    // Start observing
    const questionDisplay = document.getElementById('question-display');
    if (questionDisplay) {
      observer.observe(questionDisplay, {
        childList: true,
        subtree: true
      });
    }
  };
  
  return {
    init,
    enhanceImageDisplay,
    optimizeQuestionImages
  };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  ImageHandler.init();
});