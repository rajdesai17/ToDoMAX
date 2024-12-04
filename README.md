# Daily Todo Tracker

A minimalist daily task tracking app built with React Native and Expo. Track your daily tasks, visualize progress, and share your achievements on social media.

## Features

- 📝 Create and manage daily tasks
- ✅ Track task completion
- 📊 View daily progress statistics
- 📅 Calendar view for task history
- 📱 Share progress to social media
- 🌓 Light/Dark theme support
- 📸 Add media attachments to tasks
- 🔄 Task postponement with confirmation

## Installation Options

### Method 1: Direct APK Installation (Android Only)

1. Download the latest APK from the [Releases](../../releases) section
2. Transfer the APK to your Android device
3. On your Android device, open the APK file
4. Follow the installation prompts
5. Done! You can now use the app

### Method 2: Build it Yourself (For Developers)

#### Prerequisites

1. Install Node.js from [nodejs.org](https://nodejs.org)
2. Install Git from [git-scm.com](https://git-scm.com)
3. Install Android Studio (for Android builds)

#### Steps to Build

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/daily-todo-tracker.git
cd daily-todo-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Install EAS CLI:

```bash
npm install -g eas-cli
```

4. Build APK:

```bash
# Build Android APK
eas build -p android --profile preview

# The build will complete on Expo's servers
# Download the APK from the link provided in terminal
```

5. Install the APK on your Android device

#### Running in Development Mode

If you want to modify the code and test changes:

1. Start the development server:

```bash
npm start
```

2. Run on Android:

```bash
npm run android
```

## Troubleshooting

Common issues and solutions:

1. **Build fails**:
   - Make sure you have run `npm install`
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: 
     ```bash
     rm -rf node_modules
     npm install
     ```

2. **APK won't install**:
   - Enable "Install from Unknown Sources" in Android settings
   - Make sure you have enough storage space
   - Uninstall any previous version first

3. **Development environment issues**:
   - Make sure Android Studio is properly installed
   - Set ANDROID_HOME environment variable
   - Accept Android SDK licenses: `sdkmanager --licenses`

## Contributing

Feel free to fork this repository and make your own changes. If you find any bugs or have suggestions, please open an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React Native](https://reactnative.dev/)
- Calendar component by [react-native-calendars](https://github.com/wix/react-native-calendars)
- Icons from [Expo Vector Icons](https://icons.expo.fyi)
