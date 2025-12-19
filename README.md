# ARESA - AI Resume Analyzer

<div align="center">
  <h2>🚀 Smart Resume Analysis Powered by AI</h2>
  <p><em>Transform your resume with intelligent insights and actionable feedback</em></p>
</div>

---

## 📋 Overview

ARESA (AI Resume Analyzer) is a cutting-edge web application that leverages advanced AI technology to provide comprehensive resume analysis and optimization suggestions. Built with modern web technologies, ARESA offers instant, data-driven feedback to help job seekers improve their resumes and increase their chances of landing interviews.

### ✨ Key Highlights

- **🧠 AI-Powered Analysis**: Uses Groq's advanced language models for intelligent resume evaluation
- **📊 Comprehensive Scoring**: Detailed scoring system (0-100) with actionable insights
- **🔄 Real-time Processing**: Instant analysis with no waiting times
- **💾 Smart History Management**: Persistent storage of all analyses with easy retrieval
- **📱 Responsive Design**: Works seamlessly across all devices and screen sizes
- **🛡️ Privacy-First**: All processing happens securely without storing personal data

## 🎯 Features

### Core Analysis Features
- **📄 Multi-format Support**: Upload PDF or DOCX files directly
- **🎯 Intelligent Scoring**: Comprehensive scoring based on content quality, structure, and industry standards
- **💪 Strengths Analysis**: Identifies key strengths and competitive advantages
- **🎯 Weakness Detection**: Pinpoints areas needing improvement
- **🚀 Actionable Recommendations**: Provides specific, implementable suggestions
- **✍️ Summary Enhancement**: AI-generated improved professional summaries

### User Experience Features
- **📚 Analysis History**: Complete history of all resume analyses with timestamps
- **🔍 Detailed View**: In-depth analysis view for each historical entry
- **🗑️ History Management**: Delete individual analyses or clear entire history
- **📊 Visual Feedback**: Color-coded scoring with intuitive visual indicators
- **⚡ Instant Navigation**: Seamless transitions between analysis and history views
- **💾 Persistent Storage**: All data saved locally across browser sessions

### Technical Features
- **🔧 Modern Architecture**: Built with Next.js 15 App Router for optimal performance
- **📦 Efficient State Management**: Zustand for lightweight, scalable state handling
- **🎨 Beautiful UI**: Modern design with Shadcn UI, Framer Motion animations, and Tailwind CSS
- **⚡ Fast Processing**: Optimized for quick analysis turnaround
- **🔒 Type Safety**: Full TypeScript implementation for reliability
- **📱 Mobile-First**: Responsive design that works on all devices

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15.0.0** - React framework with App Router for modern web applications
- **React 18.2.0** - Component-based UI library
- **TypeScript 5.0.0** - Type-safe JavaScript for better development experience

### Styling & UI
- **Tailwind CSS 3.4.0** - Utility-first CSS framework for rapid styling
- **Shadcn UI** - Reusable components built with Radix UI and Tailwind CSS
- **Framer Motion** - Production-ready motion library for React
- **PostCSS 8.4.0** - CSS processing tool
- **Autoprefixer 10.4.0** - Automatic CSS vendor prefixing

### State Management & Data
- **Zustand 5.0.9** - Lightweight state management solution
- **Local Storage** - Persistent data storage across sessions

### AI & External APIs
- **Groq SDK 0.37.0** - High-performance AI inference platform
- **Gemma 7B IT Model** - Advanced language model for text analysis

### File Processing
- **pdf-parse 1.1.1** - PDF text extraction library
- **@types/pdf-parse 1.1.4** - TypeScript definitions for PDF processing

### Development Tools
- **@types/node 20.0.0** - Node.js type definitions
- **@types/react 18.2.0** - React type definitions
- **@types/react-dom 18.2.0** - React DOM type definitions

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd aresa-ai-resume-analyzer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

   > **🔑 API Key Setup:**
   > - Get your API key from [Groq Console](https://console.groq.com/)
   > - The key should start with `gsk_`
   > - Keep this file secure and never commit it to version control

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📁 Project Architecture

```
aresa-ai-resume-analyzer/
├── 📁 app/                          # Next.js App Router pages
│   ├── 📄 layout.tsx               # Root layout with navigation
│   ├── 📄 page.tsx                 # Homepage with upload form
│   ├── 📄 globals.css              # Global Tailwind styles
│   ├── 📁 results/
│   │   └── 📄 page.tsx            # Analysis results display
│   └── 📁 history/
│       └── 📄 page.tsx            # Analysis history page
├── 📁 api/                         # API routes
│   └── 📁 analyze/
│       └── 📄 route.ts            # Resume analysis endpoint
├── 📁 lib/                         # Utility libraries
│   ├── 📄 store.ts                # Zustand state management
│   ├── 📄 groq.ts                 # Groq API integration
│   └── 📄 pdf.ts                  # PDF text extraction
├── 📁 components/                  # Reusable UI components
├── 📄 package.json                # Dependencies and scripts
├── 📄 tsconfig.json               # TypeScript configuration
├── 📄 tailwind.config.js          # Tailwind CSS config
├── 📄 next.config.js              # Next.js configuration
└── 📄 README.md                   # Project documentation
```

### Architecture Details

#### **Frontend Layer (`app/`)**
- **Modern Routing**: Next.js 15 App Router for file-based routing
- **Component Architecture**: Modular, reusable React components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript coverage for reliability

#### **API Layer (`api/`)**
- **Serverless Functions**: Next.js API routes for backend logic
- **RESTful Design**: Clean API endpoints with proper error handling
- **Security**: Input validation and secure processing

#### **Business Logic (`lib/`)**
- **AI Integration**: Groq API wrapper for resume analysis
- **File Processing**: PDF parsing and text extraction
- **State Management**: Centralized application state with Zustand

## 📡 API Documentation

### Resume Analysis Endpoint

**POST** `/api/analyze`

Analyzes a resume and returns comprehensive feedback.

#### Request Body (FormData)
- `file` (optional): PDF or DOCX file upload
- `text` (optional): Raw resume text

#### Response Format
```json
{
  "success": true,
  "score": 85,
  "strengths": [
    "Strong technical foundation with relevant certifications",
    "Clear career progression with increasing responsibilities",
    "Quantified achievements demonstrating impact"
  ],
  "weaknesses": [
    "Generic professional summary lacking specific value propositions",
    "Limited use of industry-specific keywords",
    "Missing recent professional development activities"
  ],
  "improvements": [
    "Rewrite summary with specific achievements and industry focus",
    "Incorporate relevant keywords from target job descriptions",
    "Add recent certifications or professional development",
    "Include metrics and quantifiable results"
  ],
  "rewritten_summary": "Results-driven software engineer with 5+ years of experience in full-stack development, specializing in React and Node.js ecosystems. Proven track record of delivering high-impact solutions that increased user engagement by 40% and reduced system downtime by 60%. Passionate about leveraging cutting-edge technologies to solve complex business challenges."
}
```

#### Error Response
```json
{
  "error": "Detailed error message describing the issue"
}
```

## 🎮 Usage Guide

### Getting Started
1. **Access the Application**: Open `http://localhost:3000` in your browser
2. **Upload Your Resume**: Drag and drop your PDF or DOCX file
3. **Submit for Analysis**: Click "Analyze Resume" to start processing

### Understanding Results
- **Score (0-100)**: Overall resume quality assessment
  - 80-100: Excellent resume with strong competitive advantage
  - 60-79: Good resume with room for targeted improvements
  - 0-59: Resume needs significant enhancements

- **Strengths**: What your resume does well
- **Areas for Improvement**: Specific weaknesses identified
- **Actionable Recommendations**: Concrete steps to improve your resume

### History Management
- **View History**: Click "History" in the navigation bar
- **Detailed View**: Click "View Details" on any historical analysis
- **Delete Analysis**: Remove individual analyses you no longer need
- **Clear History**: Remove all historical analyses at once

### Best Practices
- **PDF/DOCX Upload**: Ensure files are text-based (not scanned images) and under 10MB
- **Regular Analysis**: Re-analyze after making improvements
- **History Review**: Compare analyses over time to track progress

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
```

### Environment Variables
```env
GROQ_API_KEY=your_groq_api_key_here
```

### Development Guidelines
- **Code Style**: Follow TypeScript and React best practices
- **Component Structure**: Keep components small and focused
- **State Management**: Use Zustand for complex state logic
- **Error Handling**: Implement proper error boundaries and user feedback
- **Performance**: Optimize for fast loading and responsive interactions

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Setup
Ensure the following environment variables are set in production:
- `GROQ_API_KEY`: Your Groq API key

### Recommended Hosting Platforms
- **Vercel**: Optimal for Next.js applications with automatic deployments
- **Netlify**: Good alternative with excellent performance
- **Railway**: Full-stack deployment with database support
- **Docker**: Containerized deployment for enterprise environments

## 🤝 Contributing

We welcome contributions to ARESA! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** following our coding standards
4. **Test thoroughly** - ensure all existing functionality works
5. **Submit a pull request** with a clear description of changes

### Development Setup for Contributors
```bash
git clone <your-fork-url>
cd aresa-ai-resume-analyzer
npm install
cp .env.example .env.local  # Add your API keys
npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** for providing fast and reliable AI inference
- **Next.js** for the excellent React framework
- **Tailwind CSS** for the utility-first styling approach
- **Zustand** for simple and effective state management

## 📞 Support

- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join community discussions on GitHub
- **Documentation**: Check this README for detailed information

---

<div align="center">
  <p><strong>ARESA - Transform your resume, transform your career</strong></p>
  <p>Made with ❤️ using cutting-edge AI technology</p>
</div>
