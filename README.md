# Numberle - Number Guessing Game

A web-based number guessing game inspired by Wordle, built with HTML, CSS, and JavaScript.

## 🎮 Game Overview

Numberle is a number guessing game where players attempt to guess a secret 5-digit number within 6 attempts. The secret number can contain repeated digits, but **no more than 2 instances of any single digit** are allowed, making it challenging yet fair.

## 🎯 How to Play

1. **Objective**: Guess the secret 5-digit number in 6 tries or fewer
2. **Input**: Use the virtual number pad or your keyboard to enter digits
3. **Feedback**: After each guess, you'll receive color-coded feedback:
   - 🟩 **Green**: Digit is correct and in the correct position
   - 🟨 **Yellow**: Digit is in the number but in the wrong position
   - ⬜ **Gray**: Digit does not appear in the secret number

### Example Gameplay

If the secret number is `11234` and you guess `12111`:
- The first `1` would be green (correct position)
- The second `1` would be yellow (in the number but wrong position)
- The remaining digits would be gray (not in the number)

**Note**: Valid secret numbers include `11234`, `99887`, but not `11123` or `44444`.

## 🚀 Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Virtual Number Pad**: Touch-friendly number input for mobile users
- **Keyboard Support**: Full keyboard navigation and input
- **Input Validation**: Ensures guesses are exactly 5 numeric digits
- **Game Statistics**: Tracks games played, wins, current streak, and best streak
- **Local Storage**: Persists statistics between sessions
- **Modern UI**: Clean, minimalist design with smooth animations
- **Accessibility**: Keyboard navigation and screen reader friendly

## 🎨 Technical Details

### Game Logic
- **Secret Number Generation**: Uses pseudo-random number generation with validation (max 2 instances of any digit)
- **Feedback Algorithm**: Two-pass evaluation system for accurate feedback
- **State Management**: Modular JavaScript with clear separation of concerns
- **Statistics Tracking**: Comprehensive game statistics with localStorage persistence

### UI Components
- **6×5 Grid**: Displays guesses and feedback
- **Virtual Number Pad**: 0-9 buttons with action buttons (Delete, Enter)
- **Modal System**: Game results and statistics display
- **Responsive Layout**: Adapts to different screen sizes

### Color Scheme
- **Green (#10b981)**: Correct digit in correct position
- **Yellow (#f59e0b)**: Correct digit in wrong position  
- **Gray (#6b7280)**: Digit not in the number
- **Blue (#3b82f6)**: Primary action button

## 🛠️ Installation & Usage

1. **Download**: Clone or download the project files
2. **Open**: Open `index.html` in any modern web browser
3. **Play**: Start guessing numbers immediately!

No build process or dependencies required - it's pure HTML, CSS, and JavaScript.

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Game Statistics

The game tracks the following statistics:
- **Games Played**: Total number of games attempted
- **Games Won**: Number of successful guesses
- **Current Streak**: Consecutive wins
- **Best Streak**: Longest winning streak achieved

Statistics are automatically saved to localStorage and persist between browser sessions.

## 🔧 Customization

The game is easily customizable by modifying the following constants in `script.js`:
- `maxAttempts`: Number of allowed guesses (default: 6)
- `numberLength`: Length of the secret number (default: 5)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the game!

---

**Enjoy playing Numberle!** 🎲 