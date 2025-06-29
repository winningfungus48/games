# Daily Word Game

A simple, daily word guessing game inspired by Wordle. Players have 6 attempts to guess a hidden 5-letter word. After each guess, the game provides visual feedback using colors: green for correct letters in the correct position, yellow for correct letters in the wrong position, and gray for incorrect letters.

## Features

- **Daily Challenges**: A new word is selected each day, the same for all players
- **Visual Feedback**: Color-coded tiles provide immediate feedback on guesses
- **Keyboard Input**: Full keyboard support with on-screen virtual keyboard
- **Mobile-Friendly**: Responsive design that works on all devices
- **Share Results**: Share your results as a spoiler-free emoji grid
- **Progress Saving**: Game state is automatically saved and restored
- **Clean UI**: Minimalist design with smooth animations

## How to Play

1. You have 6 attempts to guess a 5-letter word
2. Type your guess using the keyboard (physical or on-screen)
3. Press Enter to submit your guess
4. After each guess, tiles will show:
   - 🟩 Green: Letter is correct and in the right position
   - 🟨 Yellow: Letter is in the word but in the wrong position
   - ⬜ Gray: Letter is not in the word
5. Use the feedback to make your next guess
6. Share your results when the game ends

## Setup and Deployment

### Local Development

1. Clone or download this repository
2. Open `index.html` in your web browser
3. The game will work immediately - no build process required

### GitHub Pages Deployment

1. Create a new repository on GitHub
2. Upload all files to the repository:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
3. Go to repository Settings → Pages
4. Select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"
7. Your game will be available at `https://yourusername.github.io/repository-name`

### Custom Domain (Optional)

1. In your repository Settings → Pages
2. Enter your custom domain in the "Custom domain" field
3. Add a CNAME record pointing to `yourusername.github.io`
4. The game will be available at your custom domain

## Technical Details

- **Pure HTML/CSS/JavaScript**: No frameworks or build tools required
- **Local Storage**: Game progress is saved in the browser
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: Keyboard navigation and screen reader friendly
- **Performance**: Lightweight and fast loading

## Word List

The game includes a curated list of 5-letter words that are:
- Common English words
- Easy to spell and recognize
- Appropriate for all audiences

The daily word is determined by the day of the year, ensuring all players get the same word on the same day.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Feel free to fork this project and make improvements:
- Add more words to the word list
- Enhance the visual design
- Add new features like statistics or themes
- Improve accessibility

## License

This project is open source and available under the MIT License.

## Credits

Inspired by the popular word game Wordle. Built with modern web technologies for a smooth, engaging user experience. 