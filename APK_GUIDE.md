# How to Build the ShootSync APK

Since this is a React Web Application, we use **Capacitor** to wrap it into a native Android App.

### Prerequisites
1. **Node.js** installed on your computer.
2. **Android Studio** installed (for the final build step).

### Step 1: Initialize the Project
Open your terminal in this project folder and run:

```bash
# 1. Initialize package.json (if you haven't)
npm init -y

# 2. Install dependencies (Vite is recommended for bundling)
npm install react react-dom lucide-react recharts html2canvas jspdf @google/genai
npm install -D vite @vitejs/plugin-react typescript

# 3. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### Step 2: Build the Web Assets
You need to bundle the React code into a static folder (`dist`) that the phone can load.

Create a file named `vite.config.ts` in the root:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

Then run:
```bash
npx vite build
```

### Step 3: Create the Android Project
```bash
npx cap add android
npx cap sync
```

### Step 4: Build the APK
```bash
npx cap open android
```
1. This will open **Android Studio**.
2. Wait for Gradle sync to finish.
3. Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
4. Once done, click **locate** to find your `app-debug.apk` file.

### Note on Icons & Splash Screen
To change the app icon from the default Capacitor logo:
1. Replace the icons in `android/app/src/main/res/mipmap-*` folders.
2. Or use the `cordova-res` tool to auto-generate them.
