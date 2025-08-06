# 📁 ShareFiles - Secure File Sharing Platform

**ShareFiles** is a modern, fast, and secure file sharing application built with the MERN stack by **Rohan Shetty**. Users can securely share and receive files through unique download codes and QR codes. Files auto-expire after 5 minutes to ensure privacy and security.

🔗 **GitHub Repo:** [github.com/Shetty852/sharefiles](https://github.com/Shetty852/sharefiles)  
👨‍💻 **Developer:** Rohan Shetty (shettyrohan852@gmail.com)  
🌐 **Live Demo:** (sharefiles-alpha.vercel.app)

---

## ✨ Features

- 🚀 **Drag & Drop Upload** - Intuitive file upload with visual feedback
- 📁 **Bulk File Sharing** - Upload and share multiple files at once (up to 10 files)
- 🔍 **Smart File Receiving** - Receive individual files or bulk uploads with auto-detection
- 🔐 **Secure Sharing** - Unique code-based file sharing system
- ⏱️ **Auto-Expiry** - Files automatically delete after 5 minutes for privacy
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 📲 **QR Code Generation** - Easy sharing via QR codes
- 🌙 **Theme Toggle** - Beautiful light/dark mode support
- 📊 **File Size Limit** - Supports files up to 20MB
- 🔒 **Security Features** - Rate limiting and file validation
- ⚡ **Real-time Updates** - Live countdown timer for file expiry
- 🎨 **Modern UI** - Smooth animations with Framer Motion
- 📋 **Copy to Clipboard** - Easy code sharing functionality
- 📦 **ZIP Downloads** - Bulk files packaged as ZIP archives
- 🔍 **Auto Code Detection** - Smart recognition of single vs bulk codes

---

## 🛠️ Tech Stack

### Frontend
- **React** - Modern JavaScript framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router DOM** - Client-side routing
- **React Toastify** - Beautiful toast notifications
- **React Router Hash Link** - Smooth scrolling navigation
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Multer** - File upload handling middleware
- **Archiver** - ZIP file creation for bulk downloads
- **QR Code Generator** - QR code creation for sharing
- **Unique ID Generation** - Secure unique code system
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection and abuse prevention

### Security & Configuration
- **Environment Variables** - Secure configuration management
- **File Size Validation** - 20MB upload limit
- **Auto-cleanup** - Scheduled file deletion (5-minute expiry)
- **Error Handling** - Comprehensive error management
- **File Type Validation** - Support for documents, images, videos, archives

---

## 🔢 How It Works

### Single File Sharing:
1. **Upload** - Drag & drop or click to upload a file
2. **Generate Code** - System creates a unique 6-8 character code
3. **Share** - Share the code, link, or QR code
4. **Download** - Recipient uses code to download the file
5. **Auto-Delete** - File expires and deletes after 5 minutes

### Bulk File Sharing:
1. **Bulk Upload** - Upload up to 10 files simultaneously
2. **Bulk ID** - System generates a unique bulk identifier
3. **Multiple Options** - Recipients can download individual files or entire ZIP
4. **Smart Detection** - System auto-detects single vs bulk codes
5. **Unified Interface** - Same expiry and security features

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/Shetty852/sharefiles.git

# Navigate to project directory
cd sharefiles

# Install backend dependencies
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI and configuration

# Start backend server
npm start

# Open new terminal and install frontend dependencies
cd ../frontend
npm install

# Start frontend development server
npm run dev
```

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Server Configuration
PORT=5000
CORS_ORIGIN=http://localhost:5173

# File Configuration
MAX_FILE_SIZE=20971520
FILE_EXPIRY_MINUTES=5

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5

# Security
NODE_ENV=development
JWT_SECRET=your_jwt_secret
```

---

## 📱 Usage

### For Senders:
1. **Choose Upload Type** - Single file or bulk upload
2. **Upload Files** - Drag & drop or browse files
3. **Get Codes** - Receive unique sharing codes
4. **Share** - Send codes, links, or QR codes to recipients

### For Recipients:
1. **Enter Code** - Use the unique code provided
2. **Auto-Detection** - System identifies file type automatically
3. **Download** - Get individual files or ZIP archives
4. **Quick Access** - Use QR codes for mobile convenience

---

## 🎯 API Endpoints

### File Operations
```
POST /api/v1/file/upload         # Upload single file
GET  /api/v1/file/:code          # Get file by code
GET  /api/v1/file/download/:code # Download file
```

### Bulk Operations
```
POST /api/v1/file/bulk/upload      # Upload multiple files
GET  /api/v1/file/bulk/:bulkId     # Get bulk upload info
GET  /api/v1/file/bulk/download/:bulkId # Download as ZIP
```

---

## 🛡️ Security Features

- **🔐 Unique Codes** - Cryptographically secure file codes
- **⏰ Auto-Expiry** - Files automatically delete after 5 minutes
- **🚫 Rate Limiting** - Prevents abuse and spam
- **✅ File Validation** - Supported file types and size limits
- **🔒 CORS Protection** - Cross-origin request security
- **🛡️ Input Sanitization** - Prevents malicious uploads

---

## 🎨 Features in Detail

### Bulk File Sharing
- Upload up to 10 files at once
- Individual file download or ZIP archive
- Progress tracking for each file
- Unified expiry for all files in a bulk upload

### Smart Code Detection
- Automatically identifies single vs bulk codes
- Universal receive interface
- Seamless user experience
- Error handling for invalid codes

### Theme Support
- Beautiful light and dark modes
- Consistent styling across all components
- Smooth transitions and animations
- User preference persistence

---

## 🚜 Roadmap

- ✅ **Core file sharing functionality**
- ✅ **QR code generation**
- ✅ **Theme switching (light/dark mode)**
- ✅ **Auto-expiration system**
- ✅ **Rate limiting and security**
- ✅ **20MB file size support**
- ✅ **Responsive design**
- ✅ **Real-time notifications**
- ✅ **Bulk file sharing**
- ✅ **ZIP archive downloads**
- ✅ **Smart code detection**
- 🔄 **Email notifications** (planned)
- 🔮 **File encryption** (planned)
- 🔮 **Password protection** (planned)
- 🔮 **Custom expiration times** (planned)
- 🔮 **File compression optimization** (planned)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 About the Developer

**Rohan Shetty**
- 📧 Email: shettyrohan852@gmail.com
- 🔗 GitHub: [@Shetty852](https://github.com/Shetty852)
- 💼 LinkedIn: [Connect with me](https://linkedin.com/in/rohan-shetty)

---

## 🙏 Acknowledgments

- Thanks to the open-source community for the amazing tools and libraries
- Inspired by the need for simple, secure file sharing
- Built with modern web technologies and best practices

---

<div align="center">

**Made with ❤️ by [Rohan Shetty](https://github.com/Shetty852)**

⭐ **Star this repository if you found it helpful!** ⭐

</div>
