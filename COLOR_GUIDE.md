# 🎨 Color Palette Management Guide

## Overview
Your trivia game now has a centralized color palette system using CSS Custom Properties (CSS Variables). This allows you to quickly change the entire look of your website from one location!

## 📁 File Structure
```
assets/
├── colors.css        ← Your global color palette (edit this to change colors!)
├── main-styles.css   ← Your main styles using the color variables
└── fonts/
    └── custom-font.css
```

## 🎯 How to Change Your Site's Colors

### Quick Theme Changes
1. Open `assets/colors.css`
2. Uncomment one of the pre-built themes at the bottom:
   - **Cool Blue Theme** - Modern blue color scheme
   - **Forest Green Theme** - Natural green tones
   - **Purple Theme** - Elegant purple palette
   - **Dark Mode Theme** - Dark background with light text

### Custom Color Changes
Edit the `:root` section in `assets/colors.css`:

```css
:root {
  /* Primary Colors - These control your main theme */
  --primary-orange: #E67E22;        /* Main accent color (buttons, borders) */
  --primary-yellow: #F39C12;        /* Background color for panels */
  --primary-blue-gray: #2C3E50;     /* Text color and hover states */
  
  /* Background Colors */
  --bg-main: #ECF0F1;               /* Main page background */
  --bg-surface: #FFF;               /* Cards and input backgrounds */
  
  /* Text Colors */
  --text-primary: #111827;          /* Main text color */
  --text-secondary: #374151;        /* Secondary text */
  --text-light: #FFF;               /* White text for dark backgrounds */
}
```

## 🔧 Advanced Customization

### Adding New Colors
Add new color variables in the `:root` section:
```css
:root {
  /* Your existing colors... */
  --my-custom-color: #FF6B6B;
  --accent-secondary: #4ECDC4;
}
```

Then use them in your CSS:
```css
.my-element {
  background-color: var(--my-custom-color);
  border: 2px solid var(--accent-secondary);
}
```

### Color Categories Explained

#### Primary Colors
- `--primary-orange`: Used for buttons, borders, and main accents
- `--primary-yellow`: Background color for game panels and screens  
- `--primary-blue-gray`: Text color and hover effects

#### Interactive States
- `--hover-color`: What color elements turn when you hover over them
- `--focus-color`: Color for focused input fields
- `--border-color`: Default border color for inputs

#### Feedback Colors
- `--success-color`: Green for success messages
- `--error-color`: Red for error messages  
- `--info-color`: Blue for informational messages

## 💡 Pro Tips

### 1. Test Your Changes
- Save your changes in `colors.css`
- Refresh your browser to see the new colors
- All elements will automatically update!

### 2. Color Harmony
When choosing custom colors, use tools like:
- [Coolors.co](https://coolors.co) - Color palette generator
- [Adobe Color](https://color.adobe.com) - Professional color tools

### 3. Accessibility
Ensure good contrast between text and backgrounds:
- Dark text on light backgrounds
- Light text on dark backgrounds
- Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 4. Seasonal Themes
Create themed versions by copying the `:root` section and commenting/uncommenting:

```css
/* Spring Theme */
/*
:root {
  --primary-orange: #FF6B6B;
  --primary-yellow: #FFE66D;
  --primary-blue-gray: #4ECDC4;
}
*/

/* Halloween Theme */
/*
:root {
  --primary-orange: #FF8C00;
  --primary-yellow: #FFB84D;
  --primary-blue-gray: #2D1B37;
  --bg-main: #1A1A1A;
}
*/
```

## 🚀 What's Next?

Your site is now fully organized with:
- ✅ Centralized color management
- ✅ Easy theme switching
- ✅ Professional CSS organization
- ✅ Maintainable code structure

Just edit `assets/colors.css` whenever you want to refresh your site's look!