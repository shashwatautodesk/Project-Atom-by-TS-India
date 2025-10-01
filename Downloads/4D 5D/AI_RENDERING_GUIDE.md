# 🎨 AI Realistic Rendering Guide

## Overview

Project Atom includes an **AI-powered realistic rendering feature** that transforms your 3D model screenshots into photorealistic architectural visualizations using **Stability AI (Stable Diffusion XL)**.

This feature uses cutting-edge generative AI to:
- Convert technical 3D views into professional architectural renderings
- Apply different lighting and atmospheric styles
- Generate marketing-ready visualizations
- Create photorealistic presentations

---

## 🚀 Quick Start

### 1. **Get Stability AI API Key**
   
1. Visit [Stability AI Platform](https://platform.stability.ai/)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Generate a new API key
5. Copy the key (it starts with `sk-...`)

### 2. **Configure Your Application**

Add your Stability AI API key to the `.env` file:

```env
# Autodesk Platform Services
APS_CLIENT_ID=your_aps_client_id
APS_CLIENT_SECRET=your_aps_client_secret

# Stability AI (for AI Rendering)
STABILITY_API_KEY=sk-your-stability-api-key-here
```

### 3. **Install Dependencies**

The AI feature requires the `form-data` package (already included):

```bash
npm install
```

### 4. **Restart the Server**

```bash
npm run dev:all
```

---

## 📖 How to Use

### Step 1: Capture Your View

1. **Load a 3D model** in the viewer
2. **Position the camera** to your desired angle
3. Click the **"AI Render"** button (purple/pink gradient button with sparkles icon)
4. Click **"Capture Screenshot"**

The application will capture a high-resolution (1920x1080) screenshot of your current view.

### Step 2: Choose a Style

Select from **7 professional rendering styles**:

| Style | Description | Best For |
|-------|-------------|----------|
| **Photorealistic** | Professional architectural photography, natural lighting | General presentations |
| **Cinematic** | Dramatic lighting, moody atmosphere | Hero shots, covers |
| **Modern Minimal** | Clean lines, bright natural light | Contemporary designs |
| **Luxury** | Elegant materials, warm lighting | High-end interiors |
| **Bright Daytime** | Sunny day, blue sky | Exterior views |
| **Golden Hour** | Sunset lighting, warm tones | Atmospheric shots |
| **Night Scene** | Artificial lighting, ambient glow | Evening visualizations |

### Step 3: Customize (Optional)

Add your own **custom enhancement prompt** to further refine the output:

**Examples:**
- `"with lush landscaping and people walking"`
- `"modern glass facade with reflections"`
- `"warm interior lighting with furniture"`
- `"surrounded by trees and greenery"`

### Step 4: Generate AI Render

1. Click **"Generate AI Render"**
2. Wait 15-30 seconds for AI processing
3. View the **before/after comparison**
4. Download both original and AI-enhanced images

---

## 🎯 Use Cases

### 1. **Client Presentations**
- Transform technical BIM models into photorealistic renderings
- Create professional marketing materials
- Generate multiple style variations quickly

### 2. **Design Reviews**
- Visualize how the final building will look
- Test different lighting scenarios
- Explore atmospheric variations

### 3. **Marketing & Sales**
- Create compelling project imagery
- Generate social media content
- Produce brochures and presentations

### 4. **Concept Exploration**
- Quickly iterate on different visual styles
- Test material finishes and lighting
- Explore day/night scenarios

---

## 🎨 Pro Tips

### Getting the Best Results

1. **Camera Angle**
   - Use architectural angles (slightly from above)
   - Avoid extreme perspectives
   - Show context and surroundings

2. **Model Preparation**
   - Ensure the view is clean and well-framed
   - Include some context (not too zoomed in)
   - Avoid purely top-down or side views

3. **Style Selection**
   - **Exteriors**: Use "Bright Daytime" or "Golden Hour"
   - **Interiors**: Use "Photorealistic" or "Luxury"
   - **Hero Shots**: Use "Cinematic"

4. **Custom Prompts**
   - Be specific but concise
   - Mention materials: "glass", "concrete", "wood"
   - Add context: "people", "landscaping", "urban setting"
   - Describe lighting: "soft ambient light", "dramatic shadows"

### Example Prompt Combinations

**Modern Office Building:**
```
Style: Photorealistic
Prompt: modern glass and steel office building, blue sky, professional photography, people walking, urban plaza
```

**Residential Interior:**
```
Style: Luxury
Prompt: modern interior design, warm lighting, furniture, hardwood floors, large windows with natural light
```

**Stadium at Night:**
```
Style: Night Scene
Prompt: illuminated sports stadium, dramatic lighting, crowd atmosphere, professional sports photography
```

---

## ⚙️ Technical Details

### API Endpoint

**POST** `/api/ai/render`

**Request Body:**
```json
{
  "image": "data:image/png;base64,...",
  "prompt": "photorealistic architectural render...",
  "style": "photorealistic"
}
```

**Response:**
```json
{
  "success": true,
  "renderedImage": "data:image/png;base64,..."
}
```

### AI Model

- **Engine**: Stable Diffusion XL 1024 v1.0
- **Method**: Image-to-image transformation
- **Image Strength**: 0.35 (preserves 65% of original structure)
- **CFG Scale**: 7 (balanced creativity vs. accuracy)
- **Steps**: 30 (high quality)
- **Resolution**: 1920x1080

### Processing Time

- **Average**: 15-30 seconds
- **Factors**: Server load, image complexity, API region
- **Timeout**: 60 seconds

---

## 💰 Pricing & Credits

### Stability AI Pricing

Stability AI charges based on **credits**:
- **Stable Diffusion XL**: ~0.08 credits per image
- **Free Tier**: 25 credits/month (≈ 300 images)
- **Paid Plans**: Starting at $10/month (≈ 12,500 images)

Visit [Stability AI Pricing](https://platform.stability.ai/pricing) for current rates.

### Cost Optimization

- Each render costs approximately **$0.003** (less than a penny!)
- Generate multiple variations to find the best one
- Download and archive your favorites

---

## 🔧 Troubleshooting

### Error: "AI rendering requires STABILITY_API_KEY in .env file"

**Solution:** Add your Stability AI API key to `.env`:
```env
STABILITY_API_KEY=sk-your-key-here
```
Restart the server.

### Error: "AI rendering failed. Please check your Stability AI API key and credits"

**Possible Causes:**
1. **Invalid API Key**: Verify your key is correct
2. **No Credits**: Check your account balance at [platform.stability.ai](https://platform.stability.ai)
3. **Network Issues**: Check your internet connection
4. **Rate Limiting**: Wait a few minutes and retry

**Solution:**
- Verify API key in `.env`
- Check credit balance
- Ensure `form-data` package is installed: `npm install form-data`

### Render Quality Issues

**Problem:** Output doesn't look good

**Solutions:**
- Try a different style preset
- Adjust your camera angle in the 3D viewer
- Add more specific custom prompts
- Ensure the original screenshot has good composition

### Long Processing Time

**Problem:** Taking longer than 30 seconds

**Solutions:**
- Check your internet connection
- Stability AI servers might be busy (retry later)
- Verify the screenshot size is reasonable

---

## 🎓 Advanced Usage

### Custom Negative Prompts

While not exposed in the UI, you can modify the backend to add negative prompts:

```javascript
formData.append('text_prompts[1][text]', 'blurry, low quality, distorted');
formData.append('text_prompts[1][weight]', '-1');
```

### Batch Rendering

Generate multiple views programmatically:

1. Capture screenshots from different angles
2. Store them in an array
3. Call the AI render API for each
4. Create a contact sheet of results

### Style Transfer Experiments

Modify `image_strength` in `server.js` (line 691):

- **0.2-0.3**: More AI creative interpretation
- **0.4-0.5**: Balanced (default: 0.35)
- **0.6-0.8**: Keeps more of the original

---

## 🌟 Feature Roadmap

Upcoming enhancements:

- [ ] **Batch Processing**: Render multiple views at once
- [ ] **Style Presets**: Save custom style configurations
- [ ] **Resolution Options**: 4K, 8K output
- [ ] **Alternative AI Models**: DALL-E 3, Midjourney integration
- [ ] **Video Rendering**: Animated walkthroughs
- [ ] **Material Suggestions**: AI-recommended finishes

---

## 📚 Resources

### Documentation
- [Stability AI API Docs](https://platform.stability.ai/docs)
- [Stable Diffusion Guide](https://stablediffusionweb.com/prompts)
- [Prompt Engineering](https://prompthero.com/stable-diffusion-prompts)

### Community
- [r/StableDiffusion](https://reddit.com/r/StableDiffusion)
- [Stability AI Discord](https://discord.gg/stablediffusion)

### Tools
- [Prompt Generator](https://promptomania.com/stable-diffusion-prompt-builder/)
- [Style Reference Library](https://lexica.art/)

---

## 🤝 Support

For issues or questions:
- **Technical Issues**: Check console logs (F12)
- **API Problems**: Contact [Stability AI Support](https://platform.stability.ai/support)
- **Feature Requests**: Contact shashwat.bahrdwaj@autodesk.com

---

## 📄 License & Credits

**AI Rendering Feature:**
- Powered by **Stability AI** (Stable Diffusion XL)
- Developed by **Autodesk India Technical Sales**

**Project Atom:**
- Built on **Autodesk Platform Services**
- © 2025 Autodesk, Inc. All rights reserved.

---

**Happy Rendering! 🎨✨**

Transform your 3D models into stunning photorealistic visualizations with the power of AI!

