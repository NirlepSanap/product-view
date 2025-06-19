
# 🧩 ViewCraft - Full Stack Web Builder

ViewCraft is a powerful full stack web builder that allows users to visually create, edit, and export web pages. It supports dynamic drag-and-drop components on the frontend and a Python-based backend for user management, storage, and processing.

---

## 📁 Project Structure

```
view-craft/
├── cart/
│   ├── frontend/   # React + Vite + GrapesJS (Drag & Drop Builder)
│   └── backend/    # Python Backend (FastAPI or Flask)
```

---

## 🚀 Features

### 🌐 Frontend (React + Vite)
- Drag-and-drop web page builder (GrapesJS)
- Real-time component editing
- Responsive preview modes
- Custom block plugins
- Firebase or Stripe integrations (optional)

### 🔧 Backend (Python)
- User authentication and session handling
- API endpoints to store/retrieve designs
- File export/download (e.g., HTML/CSS)
- Supports Databutton SDK, FastAPI, and cloud integrations

---
## 🌐 Live Demo

🎉 The frontend of this project is live and deployed on **Netlify**!  
👉 [Click here to view the live site](https://productviewbynirlep.netlify.app/)

This deployment allows users to experience the core features of the ViewCraft platform directly in the browser, with a fast, responsive interface built using React and Vite.

## 🛠️ Tech Stack

| Layer       | Tech                            |
|-------------|---------------------------------|
| Frontend    | React, Vite, GrapesJS           |
| Backend     | Python (FastAPI or Flask)       |
| Package Mgmt| Yarn 4 (via Corepack), pip      |
| Optional    | Firebase, Stripe, Databutton    |

---

## ⚙️ Setup Instructions

### 📦 Frontend (React)
```bash
cd cart/frontend
corepack enable
yarn install
yarn dev
```

Runs on: [http://localhost:5173](http://localhost:5173)

---

### 🐍 Backend (Python)
#### 🔁 Option 1: Using Python 3.11
```bash
cd cart/backend
python -m venv venv
venv\Scripts\activate  # On Windows
# Or source venv/bin/activate on Mac/Linux
pip install -r requirements.txt
python main.py  # Or uvicorn main:app --reload if using FastAPI
```

Runs on: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

## 🤝 Contributing

Pull requests and issues are welcome.

If you'd like to collaborate on templates, plugins, or backend APIs — feel free to fork and contribute.

---

## 📃 License

MIT License © 2025 [Nirlep Sanap](https://github.com/nirlepsanap)
