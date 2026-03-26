# Bhada Rider App — Capacitor Android Setup Guide

## Prerequisites (Pehle yeh install karo)

1. **Node.js** — v18+ (already hai)
2. **Android Studio** — https://developer.android.com/studio
   - Install karne ke baad open karo → SDK Manager → Install:
     - Android SDK Platform 34
     - Android SDK Build-Tools
3. **Java JDK 17** — Android Studio ke saath aata hai
4. **ANDROID_HOME** environment variable set karo:
   - Windows: System Properties → Environment Variables → New:
     - Variable: ANDROID_HOME
     - Value: C:\Users\<YourName>\AppData\Local\Android\Sdk

---

## Step 1 — capacitor.config.json update karo

```json
{
  "appId": "com.bhada.rider",
  "appName": "Bhada Rider",
  "webDir": "dist",
  "server": {
    "cleartext": true
  },
  "plugins": {
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    },
    "LocalNotifications": {
      "smallIcon": "ic_stat_icon_config_sample",
      "iconColor": "#00e5a0"
    }
  }
}
```

---

## Step 2 — Project folder mein jaao aur commands chalaao

```bash
# 1. Dependencies install karo
npm install

# 2. Web app build karo (dist/ folder banega)
npm run build

# 3. Android platform add karo (ek baar hi karna hai)
npx cap add android

# 4. dist/ ka content Android project mein copy karo
npx cap sync android
```

---

## Step 3 — Android project open karo

```bash
npx cap open android
```

Yeh Android Studio mein project khol dega.

---

## Step 4 — android/app/src/main/AndroidManifest.xml mein permissions add karo

```xml
<!-- Internet -->
<uses-permission android:name="android.permission.INTERNET" />

<!-- Location (rider GPS ke liye) -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />

<!-- Notifications -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.VIBRATE" />

<!-- Wake lock (order alert ke liye screen on karna) -->
<uses-permission android:name="android.permission.WAKE_LOCK" />

<!-- Cleartext HTTP (agar server HTTP pe hai) -->
android:usesCleartextTraffic="true"   ← <application> tag mein add karo
```

---

## Step 5 — google-services.json add karo (Push Notifications ke liye)

1. Firebase Console → Project Settings → Android app add karo
   - Package name: `com.bhada.rider`
2. `google-services.json` download karo
3. File copy karo: `android/app/google-services.json`

---

## Step 6 — HTTP API calls ke liye Network Security Config

`android/app/src/main/res/xml/network_security_config.xml` file banao:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">YOUR_SERVER_IP_OR_DOMAIN</domain>
    </domain-config>
</network-security-config>
```

Phir `AndroidManifest.xml` ke `<application>` tag mein add karo:
```xml
android:networkSecurityConfig="@xml/network_security_config"
```

---

## Step 7 — APK build karo

### Debug APK (testing ke liye):
```bash
# Android Studio mein: Build → Build Bundle(s) / APK(s) → Build APK(s)
```

Ya terminal se:
```bash
cd android
./gradlew assembleDebug
```
APK milega: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (production ke liye):
```bash
cd android
./gradlew assembleRelease
```

---

## Step 8 — Har code change ke baad yeh karo

```bash
npm run build          # web app rebuild
npx cap sync android   # android mein copy karo
# Phir Android Studio se run karo
```

---

## Common Errors aur Fix

| Error | Fix |
|---|---|
| `ANDROID_HOME not set` | Environment variable set karo (Step 1) |
| `SDK location not found` | Android Studio → SDK Manager se SDK install karo |
| `Cleartext HTTP not permitted` | network_security_config.xml banao (Step 6) |
| `google-services.json missing` | Firebase se download karke android/app/ mein daalo |
| `Build failed: Gradle` | Android Studio → File → Sync Project with Gradle Files |
| `App crashes on start` | `npx cap sync` chalaao phir rebuild karo |

---

## Apna API URL check karo

`src/services/api.js` mein yeh line check karo:
```js
const BASE_URL = 'https://your-server.com/api/v1';
//               ↑ Production server URL hona chahiye
//               localhost:5000 Android pe kaam nahi karega!
```
Android emulator pe `localhost` ki jagah `10.0.2.2` use karo:
```js
const BASE_URL = 'http://10.0.2.2:5000/api/v1'; // emulator only
```