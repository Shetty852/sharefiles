# 📁 ShareFiles - Secure File Sharing

A modern file sharing platform built with the MERN stack. Share files securely with unique codes and QR codes. Files auto-expire after 5 minutes for privacy.

🌐 **Live Demo:**  
- [https://filesnest.vercel.app/](https://filesnest.vercel.app/)  
👨‍💻 **Developer:** Rohan Shetty  
🔗 **GitHub:** [github.com/Shetty852/sharefiles](https://github.com/Shetty852/sharefiles)

---

## ✨ Features

- 🚀 **Drag & Drop Upload** - Easy file upload
- 📁 **Bulk Sharing** - Upload multiple files (up to 10)
- 🔐 **Secure Codes** - Unique sharing system
- ⏱️ **Auto-Expiry** - Files delete after 5 minutes
- 📱 **Responsive Design** - Works on all devices
- 📲 **QR Codes** - Easy mobile sharing
- 🌙 **Dark/Light Theme** - Beautiful UI themes

---

## 🛠️ Tech Stack

**Frontend:** React + Vite + Tailwind CSS + Framer Motion  
**Backend:** Node.js + Express + MongoDB  
**Deployment:** Frontend (Vercel) + Backend (Render)

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/Shetty852/sharefiles.git
cd sharefiles

# Setup Backend
cd backend
npm install
npm start

# Setup Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Setup

Create `.env` in backend folder:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
CORS_ORIGIN=http://localhost:5173
MAX_FILE_SIZE=20971520
FILE_EXPIRY_MINUTES=5
```

---

## 📱 How to Use

**Send Files:**
1. Upload files (drag & drop)
2. Get unique sharing code
3. Share code/link/QR with recipient

**Receive Files:**
1. Enter the unique code
2. Download files instantly
3. Files expire automatically

---

## 👨‍💻 Developer

**Rohan Shetty**  
📧 shettyrohan852@gmail.com  
🔗 [@Shetty852](https://github.com/Shetty852)

---

<div align="center">

**Made with ❤️ for secure file sharing**

⭐ Star this repo if you find it useful! ⭐

</div>
