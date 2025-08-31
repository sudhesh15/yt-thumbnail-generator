# 🎨 YouTube Thumbnail Generator  

Generate stunning, AI-powered thumbnails for your YouTube videos in seconds.  
This project uses **Gemini Imagen 3.0** for image generation and **OpenAI GPT** for intelligent prompt rewriting.  

🚀 **[Live Demo](https://yt-thumbnail-generator-production.up.railway.app/)**  

---

## ✨ Features  
- 📤 Upload your own images  
- 🤖 AI-powered thumbnail generation (Gemini Imagen 3.0)  
- ✍️ Smart prompt rewriting (OpenAI GPT)  
- 🌗 Light/Dark theme support  
- 🎨 Customization options (color schemes, text, styles, emotions)  

---

## 📋 Prerequisites  

Make sure you have the following installed:  
- [Node.js](https://nodejs.org/) (v18 or higher)  
- npm (comes with Node.js)  

---

## ⚙️ Setup  

1. **Extract and navigate to the project:**  
   ```bash
   cd your-project-folder

2. Install dependencies:

npm install


3. Set up environment variables:
Create a .env file in the root directory and add your API keys:

GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here


4. Start the application:

npm run dev


This will start both the frontend and backend servers.
The app will be available at:
👉 http://localhost:5000

🔑 Getting API Keys

Gemini API

1. Go to Google AI Studio - https://aistudio.google.com/
2. Create a new API key
3. Copy and paste it into your .env file

OpenAI API

1. Go to OpenAI Platform - https://platform.openai.com/docs/overview
2. Generate a new API key
3. Copy and paste it into your .env file

🛠 Troubleshooting

If port 5000 is already in use, the app will automatically try other ports

Ensure your API keys are valid and have the correct permissions

If you encounter dependency issues:

rm -rf node_modules
npm install

🎯 Project Highlights

This app includes:

✅ Image upload functionality

✅ AI-powered thumbnail generation

✅ Smart prompt enhancements using GPT

✅ Theme switching (light/dark mode)

✅ Flexible customization options