```markdown
# Slotsify2

**Slotsify2** is a modern web-based slot machine game built with **React**, **TypeScript**, and **Supabase**.  
Players can sign up, log in, and enjoy spinning the reels with virtual coins — all while their progress is saved securely.

---

## Features

- **Authentication** – Sign up, log in, and log out with Supabase.
- **Slot Machine Gameplay** – Spin reels, place bets, and win based on the paytable.
- **Dynamic Paytable** – Real-time payout updates based on current bet.
- **Persistent Data** – Coins & profiles stored securely in Supabase.
- **Responsive Design** – Optimized for desktop and mobile.
- **Pixi.js Animations** – Smooth and visually appealing reel spins.

---

## Tech Stack

| Layer         | Technology |
|---------------|------------|
| **Frontend**  | React, TypeScript, TailwindCSS, Pixi.js |
| **Backend**   | Netlify Functions, Supabase |
| **Build Tool**| Vite |

---

## Installation

1️⃣ **Clone the repository**
```bash
git clone https://github.com/your-username/slotsify2.git
cd slotsify2
```

2️⃣ **Install dependencies**
```bash
npm install
```

3️⃣ **Set up environment variables**  
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

4️⃣ **Start the development server**
```bash
npm run dev
```
or if you have netlify client installed
```bash
netlify dev
```
---

## Deployment (Netlify)

1. Connect your repository to **Netlify**.
2. Set **Build Command**:  
   ```bash
   npm run build
   ```
3. Set **Publish Directory**:  
   ```
   dist
   ```
4. Add environment variables in the Netlify dashboard.

---

## Usage

1. **Sign Up** – Create an account with username, email, and password.  
2. **Log In** – Access your account and start spinning.  
3. **Play** – Place bets, spin reels, and win coins based on the paytable.  

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) – Authentication & database
- [Netlify](https://www.netlify.com/) – Serverless functions & hosting
- [Pixi.js](https://pixijs.com/) – Rendering & animations
- [TailwindCSS](https://tailwindcss.com/) – Styling framework

---

> Enjoy spinning and may the reels be in your favor!

© Ola Persson Orator
```