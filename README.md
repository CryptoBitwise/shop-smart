# ShopSmart 🛒

**Smart Shopping Made Simple**

A beautiful, modern shopping list app built with React Native and Expo. ShopSmart helps you organize your shopping with smart templates, quick suggestions, and an intuitive interface.

## Features

- 🛒 **Quick Templates**: Pre-built shopping lists for common scenarios
- ✅ **Check/Uncheck Items**: Tap to mark items as completed
- 🗑️ **Delete Items**: Remove items you no longer need
- 📤 **Share Lists**: Share your shopping list with others
- 🧹 **Clear Checked**: Remove all completed items at once
- 📱 **Mobile Optimized**: Designed specifically for mobile devices
- 🎯 **Haptic Feedback**: Tactile feedback for better user experience
- 💾 **Persistent Storage**: Your lists are saved automatically

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **For iOS (macOS only):**

   ```bash
   cd ios && pod install && cd ..
   ```

3. **Run the app:**

   **Android:**

   ```bash
   npm run android
   ```

   **iOS:**

   ```bash
   npm run ios
   ```

## Available Templates

- **🥛 Essentials**: Basic grocery items (12 items)
- **🥬 Produce**: Fresh fruits and vegetables (10 items)
- **🍔 BBQ Party**: Everything for a BBQ (15 items)
- **🥞 Breakfast**: Morning meal items (8 items)
- **🍿 Snacks**: Quick snacks and treats (10 items)
- **🥗 Healthy**: Nutritious options (12 items)

## Usage

1. **Add Items**: Type in the input field and tap "Add" or use quick-add pills
2. **Use Templates**: Tap any template button to load a pre-made list
3. **Check Items**: Tap any item to mark it as completed
4. **Delete Items**: Tap the × button to remove an item
5. **Share List**: Use the share button to send your list to others
6. **Clear Checked**: Remove all completed items at once

## Technical Details

- **Framework**: React Native 0.72.6
- **Language**: TypeScript
- **Storage**: AsyncStorage for data persistence
- **Haptics**: React Native Haptic Feedback
- **Sharing**: React Native Share
- **Styling**: StyleSheet with modern design principles

## Project Structure

```
├── App.tsx                 # Main application component
├── index.js               # Entry point
├── package.json           # Dependencies and scripts
├── android/               # Android-specific files
└── ios/                   # iOS-specific files
```

## Development

- **Start Metro**: `npm start`
- **Run on Android**: `npm run android`
- **Run on iOS**: `npm run ios`
- **Lint**: `npm run lint`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.
