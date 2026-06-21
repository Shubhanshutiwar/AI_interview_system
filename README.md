Markdown
# 🚀 AI Technical Interview Screening System

A fully local, privacy-first, decoupled microservice application designed to dynamically screen candidates for technical roles using Retrieval-Augmented Generation (RAG).

This system simulates a technical interview by generating highly specific, context-aware questions based on the candidate's target role, skill set, and domain knowledge documents, utilizing a completely local open-source LLM stack.

## 🧠 System Architecture

This project is built using a decoupled architecture, separating the client interface from the heavy machine-learning inference pipeline.

### Tech Stack
* **Frontend:** Next.js, React, Tailwind CSS
* **Backend:** FastAPI, Python, Uvicorn
* **AI/ML Pipeline:** LangChain, ChromaDB (Vector Store), Sentence Transformers
* **Local LLM Engine:** Ollama (running `llama3`)

### Why Local Open-Source?
This system was specifically designed to run entirely locally without relying on external APIs (like OpenAI). This ensures:
1. **Zero Data Leakage:** Candidate resumes and proprietary technical textbooks never leave the local machine, ensuring strict GDPR/data privacy compliance.
2. **Zero API Costs:** Infinite interview generation without token-based billing.

---

## ✨ Core Features

* **Dynamic Question Generation:** Questions are not hard-coded. They are dynamically synthesized by Llama 3 based on the uploaded context and the specific role (e.g., AI/ML Engineer, Frontend Developer).
* **Retrieval-Augmented Generation (RAG):** Uses `ChromaDB` to chunk, embed, and retrieve relevant knowledge from a local `textbook.pdf` to ground the AI's questions in factual domain knowledge.
* **Resilient Next.js UI:** Features a clean, responsive interface with loading states, error handling, and safe server-side hydration.
* **RESTful FastAPI Backend:** Asynchronous Python backend that handles heavy vector computations and LLM inference without blocking the client.

---

## 🛠️ Local Setup Instructions

### Prerequisites
* **Python 3.11+** installed
* **Node.js & npm** installed
* **Ollama** installed on your machine (download at [ollama.com](https://ollama.com/))

### 1. Start the Local LLM (Ollama)
Before running the backend, ensure your local Llama 3 model is active:
```bash
# In any terminal, pull and run the model
ollama run llama3
2. Backend Setup (FastAPI + LangChain)
Open a terminal and navigate to the root directory, then into the backend folder:

Bash
cd backend

# (Optional but recommended) Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install the required ML and server dependencies
pip install fastapi uvicorn langchain-classic langchain-core langchain-community chromadb sentence-transformers pypdf python-multipart

# IMPORTANT: Ensure your reference document is present
# Place a file named 'textbook.pdf' inside the /backend directory.

# Boot the FastAPI server
python -m uvicorn main:app --reload
The backend will now be listening on http://localhost:8000.

3. Frontend Setup (Next.js)
Open a second terminal and navigate to the frontend folder:

Bash
cd frontend

# Install Node dependencies
npm install

# Start the Next.js development server
npm run dev
The frontend UI will now be available at http://localhost:3000.

💻 Usage
Open http://localhost:3000 in your browser.

Select the target role (e.g., AI/ML Engineer) from the dropdown menu.

Upload a sample resume (PDF format).

Click Start Interview.

The backend will process the context, query the local vector database, and present the first dynamic technical question.

📂 Project Structure
Plaintext
📦 pg-agi-assignment
 ┣ 📂 backend
 ┃ ┣ 📜 main.py               # FastAPI server and route definitions
 ┃ ┣ 📜 ml_pipeline.py        # LangChain RAG pipeline and Ollama integration
 ┃ ┣ 📜 textbook.pdf          # Knowledge base context file
 ┃ ┗ 📂 chroma_db             # Local vector embeddings storage (auto-generated)
 ┣ 📂 frontend
 ┃ ┣ 📂 src
 ┃ ┃ ┗ 📂 app
 ┃ ┃   ┣ 📜 layout.jsx        # Root Next.js layout (hydration safe)
 ┃ ┃   ┗ 📜 page.jsx          # Main interactive Interview UI
 ┃ ┣ 📜 package.json
 ┃ ┗ 📜 tailwind.config.js
 ┣ 📜 .gitignore              # Ignores node_modules, pycache, and vector DBs
 ┗ 📜 README.md               # System documentation

*** ### Next Steps
Once you have saved this into your `README.md` file on your computer, run those three quick git commands from earlier to push it to your GitHub repository:

```bash
git add README.md
git commit -m "Add detailed README and system architecture"
git push origin main
