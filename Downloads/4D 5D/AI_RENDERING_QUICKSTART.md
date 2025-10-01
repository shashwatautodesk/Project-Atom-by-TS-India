# ⚡ AI Rendering Quick Start

Get up and running with AI-powered realistic rendering in **5 minutes**!

---

## 🎯 3-Step Setup

### Step 1: Get API Key (2 minutes)

1. Go to **https://platform.stability.ai/**
2. Sign up (free tier available)
3. Navigate to **API Keys** → **Generate New Key**
4. Copy your key (starts with `sk-...`)

### Step 2: Configure (1 minute)

Add to your `.env` file:

```env
STABILITY_API_KEY=sk-your-stability-api-key-here
```

### Step 3: Restart (1 minute)

```bash
npm run dev:all
```

✅ **Done!** The purple **"AI Render"** button is now active.

---

## 🚀 How to Use

### In the Viewer:

1. **Load a 3D model**
2. **Position your camera** for the best angle
3. Click **"AI Render"** (purple button with sparkles ✨)
4. Click **"Capture Screenshot"**
5. **Select a style**:
   - 📸 Photorealistic (recommended)
   - 🎬 Cinematic
   - 🌟 Modern Minimal
   - 💎 Luxury
   - ☀️ Bright Daytime
   - 🌅 Golden Hour
   - 🌙 Night Scene
6. (Optional) Add custom prompt
7. Click **"Generate AI Render"**
8. Wait 15-30 seconds ⏳
9. **Download** your photorealistic rendering!

---

## 💡 Pro Tips

### Best Camera Angles
- Slightly from above (architectural view)
- Show context and surroundings
- Avoid extreme close-ups

### Best Styles
- **Exteriors** → Bright Daytime or Golden Hour
- **Interiors** → Photorealistic or Luxury
- **Hero Shots** → Cinematic

### Custom Prompts Examples
```
"with landscaping and people"
"modern glass facade"
"warm interior lighting"
"urban plaza setting"
```

---

## 💰 Costs

- **Free Tier**: 25 credits/month ≈ **300 renders**
- **Each Render**: ~0.08 credits (~$0.003)
- **Paid Plans**: $10/month ≈ 12,500 renders

---

## 🔥 Common Issues

### "AI rendering requires STABILITY_API_KEY"
→ Add API key to `.env` and restart server

### "Failed to generate render"
→ Check API key is valid and you have credits

### Poor quality output
→ Try different style or adjust camera angle

---

## 📖 Need More Help?

Read the full guide: **AI_RENDERING_GUIDE.md**

---

**That's it! Start creating stunning photorealistic renderings! 🎨✨**

