# Zunuo - Modern To-Do List

A beautiful, functional, and responsive to-do list application built with vanilla JavaScript, HTML, and CSS.

![Zunuo App](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- ✅ **Add, Complete, and Delete Tasks** - Full CRUD functionality
- ⏰ **Due Dates & Times** - Set when tasks should be completed
- 🔔 **Smart Reminders** - Browser notifications (At time, 5/15/30 mins before)
- ⚠️ **Overdue Detection** - Automatic highlighting of past-due tasks
- 🎨 **Color-Coded Urgency** - Visual indicators (Green → Yellow → Red)
- 🔍 **Advanced Filtering** - All, Overdue, Today, This Week, Completed
- 📊 **Enhanced Statistics** - Track Total, Overdue, and Done tasks
- 💾 **Local Storage** - Tasks and times persist across browser sessions
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- ⌨️ **Keyboard Shortcuts** - Enhanced productivity
- 🎭 **Premium Design** - Glassmorphism effects with smooth animations

## 🚀 Demo

Simply open `index.html` in your browser to start using Zunuo!

## 📸 Screenshots

### Main Interface
Clean, modern interface with glassmorphism design and gradient accents.

### Task Management
Easily add, complete, and delete tasks with smooth animations.

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **Local Storage API** - Data persistence

## 🎨 Design Highlights

- **Color Scheme**: Purple-to-indigo gradient theme
- **Typography**: Inter font family from Google Fonts
- **Effects**: Glassmorphism, backdrop blur, smooth transitions
- **Animations**: Fade-in, slide-in, and custom checkbox animations

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/zunuo-todo-list.git
```

2. Navigate to the project directory:
```bash
cd zunuo-todo-list
```

3. Open `index.html` in your browser:
```bash
# On Windows
start index.html

# On macOS
open index.html

# On Linux
xdg-open index.html
```

## 💻 Usage

### Adding Tasks
1. Type your task in the input field
2. Press Enter or click the "Add Task" button

### Completing Tasks
- Click the checkbox next to any task to mark it as complete
- Completed tasks show with a strikethrough

### Deleting Tasks
- Hover over a task to reveal the delete button
- Click the X icon to remove the task

### Filtering Tasks
- **All**: Shows all tasks (default)
- **Completed**: Shows only completed tasks

### Clearing Completed Tasks
- Click "Clear Completed" to remove all finished tasks at once

### Keyboard Shortcuts
- `Enter` - Submit new task
- `Escape` - Clear input field
- `Ctrl/Cmd + K` - Focus input field

## 📁 Project Structure

```
zunuo-todo-list/
├── index.html          # Main HTML file
├── style.css           # Stylesheet with design system
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## 🎯 Key Features Explained

### Local Storage Persistence
Tasks are automatically saved to your browser's local storage, so they persist even after closing the browser.

### Responsive Design
The app adapts seamlessly to different screen sizes:
- Desktop (1280px+): Full layout with spacious design
- Tablet (768px): Adjusted spacing and font sizes
- Mobile (480px): Stacked layout with touch-optimized controls

### Accessibility
- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast text
- Respects `prefers-reduced-motion` setting

## 🔧 Customization

You can easily customize the app by modifying the CSS variables in `style.css`:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
    --bg-dark: #0F0F1E;
    --text-primary: #FFFFFF;
    /* ... more variables */
}
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

Created with ❤️ by [Your Name]

## 🙏 Acknowledgments

- Design inspiration from modern UI/UX trends
- Inter font by Google Fonts
- Icons created with SVG

## 📞 Contact

For questions or feedback, please open an issue on GitHub.

---

**Enjoy organizing your tasks with Zunuo!** ✨
