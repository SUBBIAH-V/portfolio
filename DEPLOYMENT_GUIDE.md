# 🚀 Deployment Guide for SUBBIAH VADIVELAN's Portfolio

Your local project has been initialized with Git and committed to your `main` branch. Follow these steps to push your portfolio to GitHub and deploy it live for free!

---

## 1. Push Code to GitHub

1. Open [GitHub New Repo](https://github.com/new) and log into your account (`SUBBIAH-V`).
2. Create a new repository named `portfolio` (keep it **Public** and do NOT check "Add a README").
3. Run the following commands in your terminal:

```bash
cd "c:\Users\DELL\OneDrive - sairamtap.edu.in\Documents\Buildgether\portfolio"
git remote add origin https://github.com/SUBBIAH-V/portfolio.git
git push -u origin main
```

---

## 2. Deploy Frontend to Vercel (Free)

1. Go to [Vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New Project** → Select your `SUBBIAH-V/portfolio` repository.
3. Set the **Root Directory** to `frontend`.
4. Click **Deploy**. Vercel will automatically build and give you a free URL (e.g., `subbiah-portfolio.vercel.app`).

---

## 3. Deploy Backend API to Render (Free)

1. Go to [Render.com](https://render.com) and sign up/log in with GitHub.
2. Click **New Web Service** → Connect your `SUBBIAH-V/portfolio` repository.
3. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
4. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas Connection String
   - `JWT_SECRET`: `supersecretjwtkey123`
5. Click **Create Web Service**.

---

## 🔁 Future Updates Workflow

Whenever you make any changes to your code in the future, just run:

```bash
git add .
git commit -m "Updated portfolio content"
git push origin main
```

Vercel and Render will automatically detect your push and re-deploy your live website within 30 seconds!
