# 🎨 Project Atom - Branding Guide

## 📛 Name & Taglines

### Primary Name
**Project Atom** ⚛️

### Tagline 1 (Platform)
*Powered by Autodesk Platform Services*

### Tagline 2 (Credits)
*Developed by Autodesk India Technical Sales*

---

## 🎭 Logo Design

### Concept
The **Project Atom** logo features a modern, animated atomic/molecular design representing:
- **Innovation** - Cutting-edge technology
- **Connectivity** - Integrated platform services
- **Energy** - Dynamic, powerful capabilities
- **Precision** - Technical excellence

### Visual Elements

#### 1. **Central Nucleus**
- Gradient sphere (Yellow → Orange → Blue)
- Pulsing animation (breathing effect)
- Represents the core platform

#### 2. **Orbital Rings** (3 elliptical paths)
- **Yellow Ring** (#FFD700) - Hello Yellow brand color
- **Blue Ring** (#0696D7) - Autodesk Blue
- **Teal Ring** (#00C9A7) - Autodesk Teal
- Rotated at different angles (-30°, 30°, 90°)

#### 3. **Electron Particles**
- Three animated particles orbiting the nucleus
- Yellow, Blue, and Teal colors
- Continuous circular motion (3-4s cycles)
- Represents data flow and processing

#### 4. **"A" Letter Integration**
- Subtle "A" character in nucleus
- Opacity: 30%
- Reinforces "Atom" branding

### Logo Sizes
```tsx
<Logo size="small" />   // 32x32px - Footer, compact UI
<Logo size="medium" />  // 48x48px - Header (default)
<Logo size="large" />   // 64x64px - Landing pages
```

---

## 🎨 Color Palette

### Primary Colors
| Color | Hex | Usage |
|-------|-----|-------|
| **Hello Yellow** | `#FFD700` | Primary accent, CTAs, highlights |
| **Autodesk Blue** | `#0696D7` | Analytics, data visualization |
| **Autodesk Teal** | `#00C9A7` | Secondary actions, success states |

### Background Colors
| Color | Hex | Usage |
|-------|-----|-------|
| **Autodesk Black** | `#0D0D0D` | Headers, footers, toolbars |
| **Autodesk White** | `#FFFFFF` | Main content backgrounds |
| **Autodesk Gray** | `#666666` | Secondary backgrounds, disabled states |

### Accent Colors
| Color | Hex | Usage |
|-------|-----|-------|
| **Autodesk Orange** | `#FF6B35` | Warnings, alerts |
| **Purple** | `#9D4EDD` | Special features |
| **Green** | `#06A77D` | Success states |

---

## 📝 Typography

### Application Title
```html
<h1>Project <span class="text-hello-yellow">Atom</span></h1>
```
- **"Project"** - White (#FFFFFF)
- **"Atom"** - Yellow (#FFD700)
- Font: Bold, 24px (mobile) to 32px (desktop)

### Taglines
```html
<!-- Platform -->
<p class="text-autodesk-gray-300">Powered by Autodesk Platform Services</p>

<!-- Credits -->
<p class="text-autodesk-teal">Developed by Autodesk India Technical Sales</p>
```

---

## 🖼️ Usage Examples

### Header
```
┌──────────────────────────────────────────────────┐
│  [Atom Logo]  Project Atom                       │
│               Powered by Autodesk Platform       │
│               Developed by Autodesk India TS     │
└──────────────────────────────────────────────────┘
```

### Footer
```
┌──────────────────────────────────────────────────┐
│              [Atom Logo] Project Atom            │
│         Powered by Autodesk Platform Services    │
│       Developed by Autodesk India Technical Sales│
│         © 2025 Autodesk, Inc. All rights reserved│
└──────────────────────────────────────────────────┘
```

### Browser Tab
```
Project Atom - Powered by Autodesk Platform Services
```

---

## 🎯 Brand Personality

**Project Atom embodies:**
- ⚡ **Innovation** - Leading-edge AEC technology
- 🔬 **Precision** - Technical excellence and accuracy
- 🌐 **Connectivity** - Seamless platform integration
- 🚀 **Performance** - Fast, powerful, reliable
- 💡 **Intelligence** - Smart analytics and insights

---

## 📐 Logo Technical Specs

### SVG Specifications
- **ViewBox**: 0 0 100 100
- **Aspect Ratio**: 1:1 (square)
- **Format**: Inline SVG (no external dependencies)
- **Animation**: CSS/SVG native (no JS required)

### Orbital Ring Details
```svg
<!-- Ring 1 (Yellow, -30°) -->
<ellipse rx="40" ry="15" transform="rotate(-30 50 50)" />

<!-- Ring 2 (Blue, 30°) -->
<ellipse rx="40" ry="15" transform="rotate(30 50 50)" />

<!-- Ring 3 (Teal, 90°) -->
<ellipse rx="40" ry="15" transform="rotate(90 50 50)" />
```

### Nucleus Gradient
```svg
<radialGradient id="nucleusGradient">
  <stop offset="0%" stopColor="#FFD700" />   <!-- Yellow -->
  <stop offset="50%" stopColor="#FF6B35" />  <!-- Orange -->
  <stop offset="100%" stopColor="#0696D7" /> <!-- Blue -->
</radialGradient>
```

### Animation Cycles
- **Nucleus pulse**: 2s (12px ↔ 14px radius)
- **Yellow electron**: 4s orbit
- **Blue electron**: 3s orbit
- **Teal electron**: 3.5s orbit

---

## 🚫 Don'ts

❌ **Don't** alter the logo colors  
❌ **Don't** stretch or distort the logo  
❌ **Don't** remove the animation (it's part of the brand)  
❌ **Don't** use the old "ACC 3D Viewer" name  
❌ **Don't** forget the taglines in official communications  
❌ **Don't** use generic folder icons - use Project Atom logo  

---

## ✅ Do's

✅ **Do** maintain the 1:1 aspect ratio  
✅ **Do** use approved color combinations  
✅ **Do** include both taglines in headers/footers  
✅ **Do** ensure logo is visible against backgrounds  
✅ **Do** use the animated version when possible  
✅ **Do** credit "Autodesk India Technical Sales"  

---

## 📦 Files Updated

- ✅ `index.html` - Page title
- ✅ `src/App.tsx` - Header & footer branding
- ✅ `src/components/Logo.tsx` - New animated logo component
- ✅ `README.md` - Project documentation
- ✅ All references to "ACC 3D Viewer" replaced

---

## 🎬 Animation Details

### Electron Orbits
Each electron follows an elliptical path calculated to create a 3D orbital effect:

**Yellow Electron (4s cycle):**
```
cx: 50 → 85 → 50 → 15 → 50
cy: 35 → 50 → 65 → 50 → 35
```

**Blue Electron (3s cycle):**
```
cx: 85 → 50 → 15 → 50 → 85
cy: 50 → 65 → 50 → 35 → 50
```

**Teal Electron (3.5s cycle):**
```
cx: 15 → 50 → 85 → 50 → 15
cy: 50 → 35 → 50 → 65 → 50
```

Different cycle times create a dynamic, non-repetitive pattern.

---

## 🌟 Logo Meaning

**The Atom represents:**
- ⚛️ **Atomic Level Precision** - Detailed BIM data
- 🔄 **Continuous Motion** - Real-time updates
- 🎯 **Central Core** - APS platform as foundation
- 🌐 **Orbital Connections** - Multi-discipline integration
- ⚡ **Energy & Power** - High-performance capabilities

---

## 📞 Contact

For branding questions or assets:
- **Team**: Autodesk India Technical Sales
- **Platform**: Autodesk Platform Services (APS)
- **Support**: Visit Autodesk Platform Services portal

---

**Project Atom** - Building the future of AEC, one atom at a time. ⚛️✨

