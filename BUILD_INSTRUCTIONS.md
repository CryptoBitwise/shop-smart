# ShopList Mobile - Build Instructions

## Building APK with GitHub Actions

This project uses GitHub Actions to automatically build and release APK files. This is the recommended approach as it handles all the complex Android build environment setup.

### Prerequisites

1. **GitHub Repository**: Your code must be in a GitHub repository
2. **Git Setup**: Initialize git and push your code to GitHub

### Setup Steps

1. **Initialize Git Repository** (if not already done):

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub and create a new repository
   - Push your code to GitHub:

   ```bash
   git remote add origin https://github.com/yourusername/shop-list.git
   git push -u origin main
   ```

### Building APK

#### Method 1: Manual Build (Recommended for testing)

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select "Build APK" workflow
4. Click "Run workflow"
5. Wait for the build to complete
6. Download the APK from the "Artifacts" section

#### Method 2: Tag-based Release (Recommended for production)

1. Create a git tag:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. This will automatically trigger the release workflow
3. The APK will be attached to a GitHub release

### Workflow Features

- **Automatic Environment Setup**: Handles Node.js, Java, and Android SDK setup
- **Gradle Caching**: Speeds up subsequent builds
- **Artifact Upload**: APK files are automatically uploaded as build artifacts
- **Release Management**: Automatic release creation with tags
- **Cross-platform**: Works on any platform (Windows, Mac, Linux)

### Manual Build (Local Development)

If you need to build locally for development:

1. **Install Android Studio** and Android SDK
2. **Set up environment variables**:

   ```bash
   export ANDROID_HOME=/path/to/android/sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

3. **Build the APK**:

   ```bash
   cd android
   ./gradlew assembleRelease
   ```

### Troubleshooting

- **Gradle Wrapper Issues**: The GitHub Actions workflow handles this automatically
- **Java Version**: The workflow uses Java 17, which is compatible with React Native
- **Android SDK**: The workflow automatically installs the required SDK components

### Release Notes

When creating a release, include:

- Version number
- New features
- Bug fixes
- Installation instructions
- System requirements

### Security Notes

- The APK is signed with a debug keystore (for development)
- For production releases, consider setting up proper code signing
- The debug keystore is included in the repository for convenience

## Next Steps

1. Push your code to GitHub
2. Run the "Build APK" workflow
3. Download and test the APK
4. Create a tag for your first release
5. Share the release with users!
