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

## Quick Start - Using Expo Go (Easiest)

1. Install Expo Go on your device:
   - [iOS App Store](https://apps.apple.com/app/apple-store/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Open this link on your device:
   ```
   exp://exp.host/@your-expo-username/daily-todo-tracker
   ```
   Or scan the QR code from the repository (add QR code image here)

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/daily-todo-tracker.git
cd daily-todo-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npx expo start
```

4. Run on your device:
   - Open Expo Go on your device
   - Scan the QR code from terminal
   - Or run on simulator/emulator:

     ```bash
     npx expo run:ios
     # or
     npx expo run:android
     ```

## Building Your Own Copy (No App Store Required)

1. Install EAS CLI:

```bash
npm install -g eas-cli
```

2. Login to your Expo account:

```bash
eas login
```

3. Configure the build:

```bash
eas build:configure
```

4. Build for your platform:

```bash
# For Android APK (can be installed directly)
eas build -p android --profile preview

# For iOS (requires Apple Developer account)
eas build -p ios --profile preview
```

5. Once the build is complete:
   - For Android: Download the APK and install directly on your device
   - For iOS: Install using TestFlight or register your device for development

## Sharing with Friends

### Android Users
- Share the APK file directly
- Or share the GitHub repository link for them to build their own copy

### iOS Users
- Share the Expo Go link
- Or help them build using their Apple ID
- Or add their device to your Apple Developer account

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- Calendar component by [react-native-calendars](https://github.com/wix/react-native-calendars)
- Icons from [Expo Vector Icons](https://icons.expo.fyi)
