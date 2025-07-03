# One Clue Crosswords

A web-based word puzzle game where players solve mini crosswords using just one thematic clue. All words in the grid are related to the single clue provided.

## 🎮 How to Play

1. **Read the Clue**: Start by reading the single clue at the top of the game
2. **Fill the Grid**: Click on any square in the crossword grid to start typing
3. **Navigate**: Use arrow keys or click to move between cells
4. **Complete Words**: All words in the grid are thematically related to the clue
5. **Solve the Puzzle**: Fill in all words correctly to complete the puzzle

## 🎯 Game Features

- **Single Clue System**: One vague clue that relates to all words in the puzzle
- **Interactive Grid**: Click to select cells, type letters, and navigate with arrow keys
- **Real-time Validation**: Visual feedback for correct and incorrect letters
- **Progress Tracking**: See your completion progress and solve time
- **Hint System**: Get helpful hints when stuck (limited per puzzle)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Multiple Puzzles**: Various themed puzzles to solve

## 🎨 Example Puzzles

### Fire Theme
- **Clue**: "Fire"
- **Words**: EMBER, BLAZE, SMOKE
- **Grid**: 6x6 crossword with intersecting words

### Ocean Theme  
- **Clue**: "Ocean"
- **Words**: WAVE, FISH, SALT
- **Grid**: 5x5 crossword layout

### Music Theme
- **Clue**: "Music" 
- **Words**: BEAT, SONG, TUNE
- **Grid**: 6x6 crossword pattern

## 🎮 Controls

- **Mouse**: Click on any cell to select and type
- **Arrow Keys**: Navigate between cells
- **Backspace**: Delete letter and move to previous cell
- **Enter**: Check solution
- **Space**: Not used (single letter input only)

## 🏆 Game Mechanics

- **Word Validation**: All words must be completed correctly
- **Visual Feedback**: 
  - Green: Correct letter
  - Red: Incorrect letter  
  - Blue: Active/selected cell
- **Auto-completion**: Automatically moves to next cell after typing
- **Completion Detection**: Game automatically detects when puzzle is solved

## 🛠️ Technical Details

- **Pure JavaScript**: No external dependencies
- **Responsive CSS**: Mobile-friendly design
- **Local Storage**: Game state management
- **Modular Design**: Easy to add new puzzles

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🚀 Getting Started

1. Open `index.html` in your web browser
2. The game will automatically load with a random puzzle
3. Start solving by clicking on any cell in the grid
4. Use the controls to navigate and complete the puzzle

## 🎨 Customization

### Adding New Puzzles

To add a new puzzle, edit the `puzzles` array in `script.js`:

```javascript
{
    clue: "Your Clue",
    grid: [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
    ],
    words: [
        { word: "WORD1", start: { row: 1, col: 1 }, direction: "across" },
        { word: "WORD2", start: { row: 1, col: 1 }, direction: "down" }
    ],
    hints: [
        "Hint for word 1",
        "Hint for word 2"
    ]
}
```

### Grid Layout
- `1`: Active cell where letters can be placed
- `0`: Empty cell (no input allowed)

### Word Directions
- `"across"`: Word reads left to right
- `"down"`: Word reads top to bottom

## 🎯 Tips for Players

1. **Start with the clue**: Think about all possible words related to the theme
2. **Look for intersections**: Common letters between words can help you solve
3. **Use hints wisely**: Save hints for when you're really stuck
4. **Check your work**: Use the "Check Solution" button to verify progress
5. **Practice makes perfect**: Try different puzzles to improve your skills

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to contribute by:
- Adding new puzzles
- Improving the UI/UX
- Adding new features
- Reporting bugs

---

**Enjoy solving One Clue Crosswords!** 🧩✨ 