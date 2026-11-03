<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:FACC15,50:F97316,100:E11D48&height=300&section=header&text=VoiceKannada%20AI&fontSize=72&fontColor=ffffff&animation=fadeIn&fontAlignY=36&desc=AI%20Voice%20Assistant%20%26%20Learning%20Platform%20for%20Kannada&descSize=22&descAlignY=58" width="100%" alt="VoiceKannada AI - AI Voice Assistant and Learning Platform for Kannada"/>

<a href="https://voice-kannada.vercel.app/">
  <img src="https://readme-typing-svg.demolab.com?font=Segoe+UI&weight=700&size=22&duration=3200&pause=900&color=FACC15&center=true&vCenter=true&width=780&lines=Speak+Kannada.+Be+understood.;Listen%2C+speak%2C+and+practice+with+AI;%E0%B2%95%E0%B2%A8%E0%B3%8D%E0%B2%A8%E0%B2%A1+%E0%B2%A7%E0%B3%8D%E0%B2%B5%E0%B2%A8%E0%B2%BF+%E2%80%A2+Your+voice%2C+your+language" alt="Typing animation" />
</a>

<br/>

[![Live Demo](https://img.shields.io/badge/%F0%9F%8E%99%EF%B8%8F_Live_Demo-voice--kannada.vercel.app-FACC15?style=for-the-badge&labelColor=020617)](https://voice-kannada.vercel.app/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-F97316?style=for-the-badge&logo=vercel&logoColor=white&labelColor=020617)](https://voice-kannada.vercel.app/)
[![Installable](https://img.shields.io/badge/Mobile-Installable_Web_App-E11D48?style=for-the-badge&labelColor=020617)](https://voice-kannada.vercel.app/)

![Speech Recognition](https://img.shields.io/badge/Speech_Recognition-020617?style=flat-square&logo=googleassistant&logoColor=FACC15)
![Text to Speech](https://img.shields.io/badge/Text_to_Speech-020617?style=flat-square&logo=soundcloud&logoColor=F97316)
![Speaking Practice](https://img.shields.io/badge/Speaking_Practice-020617?style=flat-square&logo=audacity&logoColor=E11D48)
![AI Powered](https://img.shields.io/badge/AI_Powered-020617?style=flat-square&logo=openai&logoColor=white)

<br/>

**[Live Demo](https://voice-kannada.vercel.app/)** &nbsp;|&nbsp; **[Overview](#-overview)** &nbsp;|&nbsp; **[Features](#-features)** &nbsp;|&nbsp; **[Architecture](#-architecture)** &nbsp;|&nbsp; **[Quick Start](#-quick-start)** &nbsp;|&nbsp; **[Roadmap](#-roadmap)**

</div>

<br/>

---

<div align="center">

## 🎯 Overview

**ಕನ್ನಡ ಧ್ವನಿ: a voice-first way to use and learn Kannada.**

VoiceKannada AI is a web-based voice assistant and immersive language learning platform. Speak in Kannada, get it recognized, hear natural replies, and practice speaking with instant AI feedback, all from your browser or phone.

<br/>

| 😕 The problem | ✅ VoiceKannada AI |
|:---|:---|
| Most voice tools are built for English first | Built around Kannada from the start |
| Typing Kannada is slow and awkward on many devices | Just speak, and the app listens |
| Learners get no feedback on how they sound | Speaking practice with AI guidance |
| Learning apps feel like flashcards | Immersive, conversation-style practice |
| Apps need installs and setup | Open the link and start, or add it to your home screen |

</div>

<br/>

---

<div align="center">

## ✨ Features

</div>

<table align="center">
<tr>
<td width="50%" valign="top">

### 🎙️ Voice Assistant
- Speech recognition for spoken Kannada
- Natural text-to-speech replies you can hear
- Hands-free, conversation-style interaction
- Clean, dark, distraction-free interface

</td>
<td width="50%" valign="top">

### 📚 Language Learning
- Immersive learning experience
- Speaking practice with AI feedback
- Listen, repeat, and improve loop
- Built for learners and native speakers alike

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📱 Works Everywhere
- Responsive on phone, tablet, and desktop
- Installable as a web app on mobile
- No sign-up wall, open and use

</td>
<td width="50%" valign="top">

### ⚡ Fast and Modern
- Deployed on Vercel's global edge network
- Smooth, animated interface
- Optimized for quick voice round trips

</td>
</tr>
</table>

<br/>

---

<div align="center">

## 🔄 How It Works

</div>

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant UI as Web App
    participant ASR as Speech Recognition
    participant AI as AI Language Layer
    participant TTS as Text to Speech

    U->>UI: Taps mic and speaks in Kannada
    UI->>ASR: Audio stream
    ASR-->>UI: Kannada text
    UI->>AI: Text + mode (assistant or practice)
    AI-->>UI: Reply, correction, or feedback
    UI->>TTS: Reply text
    TTS-->>UI: Natural speech audio
    UI-->>U: Shows text and plays voice
```

<br/>

---

<div align="center">

## 🏗️ Architecture

</div>

```mermaid
flowchart TB
    U(["👤 User<br/>phone or desktop"])

    subgraph FE["Presentation layer  |  Vercel"]
        UI["Web app<br/>installable, responsive"]
        MIC["Mic capture<br/>and audio playback"]
        VIEW["Assistant view<br/>and practice view"]
    end

    subgraph VOICE["Voice layer"]
        ASR["Speech recognition<br/>Kannada audio to text"]
        TTS["Text to speech<br/>text to Kannada audio"]
    end

    subgraph BRAIN["Intelligence layer"]
        NLU["Language understanding"]
        ASSIST["Assistant replies"]
        COACH["Speaking coach<br/>feedback and guidance"]
    end

    U <--> UI
    UI --- MIC
    UI --- VIEW
    MIC -->|audio| ASR
    ASR -->|text| NLU
    NLU --> ASSIST
    NLU --> COACH
    ASSIST -->|reply text| TTS
    COACH -->|feedback text| TTS
    TTS -->|audio| MIC

    style U fill:#FACC15,stroke:#F97316,color:#020617
    style UI fill:#0f172a,stroke:#FACC15,color:#fff
    style MIC fill:#0f172a,stroke:#FACC15,color:#fff
    style VIEW fill:#0f172a,stroke:#FACC15,color:#fff
    style ASR fill:#7c2d12,stroke:#F97316,color:#fff
    style TTS fill:#7c2d12,stroke:#F97316,color:#fff
    style NLU fill:#881337,stroke:#E11D48,color:#fff
    style ASSIST fill:#881337,stroke:#E11D48,color:#fff
    style COACH fill:#881337,stroke:#E11D48,color:#fff
```

<br/>

<div align="center">

| Layer | Responsibility |
|:---|:---|
| **Presentation** | Responsive, installable web app that handles the mic, playback, and both assistant and practice views |
| **Voice** | Converts spoken Kannada to text and reply text back into natural speech |
| **Intelligence** | Understands the request, produces replies, and coaches speaking practice |
| **Hosting** | Vercel deployment with automatic builds from GitHub |

</div>

<br/>

### 🎓 Learning loop

```mermaid
flowchart LR
    A["🎧 Listen<br/>hear the phrase"] --> B["🎙️ Speak<br/>repeat in Kannada"]
    B --> C["🧠 Analyze<br/>AI checks your speech"]
    C --> D["💬 Feedback<br/>tips and corrections"]
    D --> E["🔁 Practice again<br/>improve each round"]
    E --> A

    style A fill:#0f172a,stroke:#FACC15,color:#fff
    style B fill:#7c2d12,stroke:#F97316,color:#fff
    style C fill:#881337,stroke:#E11D48,color:#fff
    style D fill:#7c2d12,stroke:#F97316,color:#fff
    style E fill:#0f172a,stroke:#FACC15,color:#fff
```

<br/>

---

<div align="center">

## 🧰 Tech Stack

<img src="https://skillicons.dev/icons?i=html,css,js,nodejs,vercel,github,git&theme=dark" alt="Tech stack icons"/>

</div>

<br/>

| | |
|:---|:---|
| **Frontend** | Responsive, installable web app |
| **Voice** | Speech recognition and text-to-speech for Kannada |
| **AI** | Language understanding and speaking feedback |
| **Hosting** | Vercel, deployed from GitHub |

<br/>

---

## 🚀 Quick Start

### Use it online

Open **[voice-kannada.vercel.app](https://voice-kannada.vercel.app/)**, allow microphone access, and start speaking. On a phone, use your browser's **Add to Home Screen** to install it like an app.

### Run it locally

```bash
git clone https://github.com/sathi2305/VoiceKannada-AI.git
cd VoiceKannada-AI
npm install
npm run dev
```

Then open the local address shown in your terminal.

> **Tip:** microphone access works on `localhost` and on HTTPS sites. Use a recent Chrome or Edge for the best speech support.

<br/>

---

## ☁️ Deployment

| | |
|:---|:---|
| **Live site** | [voice-kannada.vercel.app](https://voice-kannada.vercel.app/) |
| **Host** | Vercel |
| **Flow** | Push to GitHub, Vercel builds and publishes automatically |

<br/>

---

## 🗓️ Roadmap

- [x] Kannada speech recognition
- [x] Natural text-to-speech replies
- [x] Speaking practice mode
- [x] Mobile-friendly, installable experience
- [ ] Progress tracking and streaks
- [ ] More regional accents and dialects
- [ ] Offline practice mode
- [ ] More Indian languages

<br/>

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a pull request

<br/>

---

<div align="center">

### Built by [Sathiyamoorthi S](https://github.com/sathi2305)

If VoiceKannada AI helped you, consider giving it a ⭐

[![Try it live](https://img.shields.io/badge/Try_it_live-FACC15?style=for-the-badge&logo=vercel&logoColor=020617&labelColor=020617)](https://voice-kannada.vercel.app/)

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:FACC15,50:F97316,100:E11D48&height=120&section=footer" width="100%" alt="footer wave"/>

</div>
