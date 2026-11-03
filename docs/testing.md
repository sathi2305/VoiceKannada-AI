# Voice of Kannada — Verification & Test Plan

This document details automated and manual verification procedures for all Priority 1–6 requirements.

## 1. Automated Verification Checks

### A. TypeScript Compilation & Linting
Run:
```bash
npx tsc --noEmit
```
**Expected Result**: Exit code 0, 0 type errors.

### B. Production Frontend Build
Run:
```bash
npm run build
```
**Expected Result**: Vite builds production bundle in `dist/` with zero missing modules.

### C. Backend API Integration Tests
Execute health and chat verification via curl:
```bash
curl -s http://localhost:3000/health
curl -s http://localhost:3000/api/config/public
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"ನಮಸ್ಕಾರ","history":[],"mode":"conversation"}'
```
**Expected Result**:
- `/health` returns `status: "ok"`.
- `/api/chat` returns valid JSON with `kannada`, `transliteration`, `english`, and `grammarNotes`.

---

## 2. Interactive Feature Verification Checklist

1. **Microphone Permissions (REQ-2.1)**:
   - When launching Assistant or Speaking Practice for the first time, browser requests microphone permission.
   - If blocked, an informative notification displays guidance on allowing mic access.
2. **Push-to-Talk & Continuous Talk (REQ-1.1)**:
   - Push-and-hold button activates microphone; release immediately stops and sends.
   - Continuous talk toggle keeps microphone active for conversational exchange until explicit stop.
3. **Dual-Language Output (REQ-1.2)**:
   - Every assistant response renders Kannada script, Roman transliteration, and English translation.
4. **Speech Output & Stop Controls (REQ-4.1)**:
   - Assistant response plays audio.
   - Clicking "Stop Audio" in the top header cancels speech immediately.
5. **Curriculum & Completion Tracking (REQ-5.1 & REQ-6.1)**:
   - Clicking "Mark as Completed" on a lesson increments course progress bar and persists across browser refreshes.
6. **Grounded Speech Practice (REQ-5.2)**:
   - Speaking target phrase produces tokenized word alignment and character-level similarity calculation without fake scores.
