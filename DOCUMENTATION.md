
# React Native OpenCart App - Documentation

## 1. Project Overview

This is a React Native-based mobile application that serves as a front-end for an OpenCart e-commerce website. The app connects to your OpenCart store using a custom plugin, allowing you to offer a seamless mobile shopping experience to your customers. It is designed to be easily customizable and can be adapted to match your brand's identity.

## 2. Features

*   **Home Page:** A dynamic home page with a carousel, featured categories, deals, and new products.
*   **Product Catalog:** Browse products by category, search for products, and view product details.
*   **Product Options:** Support for OpenCart's product options.
*   **Shopping Cart:** A fully functional shopping cart that is synced with the OpenCart store.
*   **Wishlist:** Users can add products to their wishlist.
*   **User Authentication:** Users can register, log in, and manage their accounts.
*   **Order History:** Users can view their order history and order details.
*   **Checkout:** A seamless checkout process that is handled by a webview to your OpenCart checkout page.
*   **Social Feed:** Display your social media feed within the app.
*   **Push Notifications:** (Setup required) Engage with your customers using push notifications.

## 3. Tech Stack

*   **React Native:** A framework for building native apps using React.
*   **Redux Toolkit:** For state management.
*   **React Navigation:** For navigation between screens.
*   **TypeScript:** For type-safe code.
*   **OpenCart:** The e-commerce platform that the app connects to.

## 4. Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** Version 18 or higher.
*   **npm:** Version 7 or higher.
*   **React Native CLI:** The command-line interface for React Native.
*   **Android Studio:** For building the Android app.
*   **Xcode:** For building the iOS app.
*   **CocoaPods:** For managing iOS dependencies.

## 5. Installation

1.   **Navigate to the project directory:**
    ```bash
    cd react-native-opencart-app
    ```
2.  **Install the dependencies:**
    ```bash
    npm install
    ```
3.  **Install iOS dependencies:**
    ```bash
    cd ios && pod install && cd ..
    ```

## 4. Configuration

Before running the app, you need to configure the API endpoint for your OpenCart store.

1.  Open the `src/utils/api.ts` file.
2.  Change the `API_BASE_URL` to your OpenCart store's URL.

## 5. Running the App

1.  **Start the Metro bundler:**
    ```bash
    npx react-native start
    ```
2.  **Run on Android:**
    ```bash
    npx react-native run-android
    ```
3.  **Run on iOS:**
    ```bash
    npx react-native run-ios
    ```

## 6. Building the App for Android

1.  **Generate a signing key:**
    ```bash
    keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
    ```
2.  **Place the `my-release-key.keystore` file in the `android/app` directory.**
3.  **Edit the `~/.gradle/gradle.properties` file and add the following:**
    ```
    MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
    MYAPP_RELEASE_KEY_ALIAS=my-key-alias
    MYAPP_RELEASE_STORE_PASSWORD=your-store-password
    MYAPP_RELEASE_KEY_PASSWORD=your-key-password
    ```
4.  **Navigate to the `android` directory and run the following command:**
    ```bash
    ./gradlew assembleRelease
    ```
    The generated APK will be located at `android/app/build/outputs/apk/release/app-release.apk`.

## 7. Building the App for iOS

1.  **Open the `ios/opencartapp.xcworkspace` file in Xcode.**
2.  **Select your device or a simulator.**
3.  **Choose `Product` > `Archive` from the menu.**
4.  **Once the archive is created, you can distribute the app to the App Store.**

## 9. Changing the App Icon

### For Android

1.  Prepare your app icon in various resolutions (e.g., 48x48, 72x72, 96x96, 144x144, 192x192 pixels).
2.  Navigate to the `android/app/src/main/res` directory.
3.  Replace the `ic_launcher.png` and `ic_launcher_round.png` files in the `mipmap-hdpi`, `mipmap-mdpi`, `mipmap-xhdpi`, `mipmap-xxhdpi`, and `mipmap-xxxhdpi` folders with your new icon files.
4.  Clean and rebuild your Android project.

### For iOS

1.  Prepare your app icon in various resolutions as required by Xcode (e.g., 2x, 3x for iPhone and iPad).
2.  Open your project in Xcode (`ios/opencartapp.xcworkspace`).
3.  In the Project Navigator, select `opencartapp` (your project name) and then select `Assets.xcassets`.
4.  Locate the `AppIcon` set.
5.  Drag and drop your new icon files into the corresponding slots in the `AppIcon` set.
6.  Clean and rebuild your iOS project.

## 11. Changing the Package Name

### For Android

1.  **Change the `applicationId` in `android/app/build.gradle`:**
    Open `android/app/build.gradle` and locate the `defaultConfig` block. Change the `applicationId` to your desired package name.
    ```gradle
    defaultConfig {
        applicationId "com.yourcompany.yourappname" // Change this
        ...
    }
    ```
2.  **Rename folders and update package declarations:**
    Manually rename the package folders in `android/app/src/main/java/com/opencartapp` to match your new package name (e.g., `com/yourcompany/yourappname`).
    Then, update the `package` declaration in the following files to reflect the new package structure:
    *   `android/app/src/main/java/com/yourcompany/yourappname/MainActivity.kt`
    *   `android/app/src/main/java/com/yourcompany/yourappname/MainApplication.kt`
3.  **Update `AndroidManifest.xml`:**
    Open `android/app/src/main/AndroidManifest.xml` and update the `package` attribute in the `<manifest>` tag to your new package name.

### For iOS

1.  **Open your project in Xcode:**
    Open `ios/opencartapp.xcworkspace` in Xcode.
2.  **Change the Bundle Identifier:**
    *   In the Project Navigator, select your project (e.g., `opencartapp`).
    *   Select your target (e.g., `opencartapp`) under `TARGETS`.
    *   Go to the `General` tab.
    *   Under `Identity`, change the `Bundle Identifier` to your desired package name (e.g., `com.yourcompany.yourappname`).
3.  **Clean and rebuild your iOS project.**

## 12. OpenCart Plugin Installation

The OpenCart plugin is required for the app to connect to your OpenCart store.

1.  **Download the `mobile_app.ocmod.zip` file from the project's root directory.**
2.  **Log in to your OpenCart admin panel.**
3.  **Navigate to `Extensions` > `Installer`.**
4.  **Click the `Upload` button and select the `mobile_app.ocmod.zip` file.**
5.  **Navigate to `Extensions` > `Extensions` and select `Modules` from the dropdown.**
6.  **Find the `Mobile App` module and click the `Install` button.**
7.  **Once installed, click the `Edit` button to configure the module.**
8.  **Enable the module and save the changes.**

This documentation provides a comprehensive guide for setting up and building the React Native OpenCart app. If you have any questions or need further assistance, please refer to the project's README file or contact the developer.
