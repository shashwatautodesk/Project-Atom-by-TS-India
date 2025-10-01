# 🚀 Quick Start Instructions

## Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure APS Credentials

1. Get your credentials from https://aps.autodesk.com/
2. Edit the `.env` file in the project root:
   ```env
   APS_CLIENT_ID=your_client_id_here
   APS_CLIENT_SECRET=your_client_secret_here
   ```

### Step 3: Run the Application
```bash
npm run dev:all
```

Then open http://localhost:3000 in your browser!

---

## What Each Command Does

| Command | Description |
|---------|-------------|
| `npm install` | Installs all dependencies |
| `npm run dev` | Starts frontend only (on port 3000) |
| `npm run dev:server` | Starts backend only (on port 3001) |
| `npm run dev:all` | Starts both frontend and backend |
| `npm run build` | Builds for production |
| `npm run preview` | Preview production build |

---

## Need More Help?

- **Detailed Setup**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Full Documentation**: See [README.md](./README.md)
- **Quick Start**: See [QUICKSTART.md](./QUICKSTART.md)

---

## Troubleshooting

**Server Status Shows Warning?**
→ Make sure `.env` file has your real APS credentials

**No Projects Showing?**
→ Verify your Autodesk account has access to ACC/BIM 360

**Translation in Progress?**
→ Wait a few minutes, then click "Check Again"

---

That's it! You're ready to view your ACC models in 3D! 🎉

