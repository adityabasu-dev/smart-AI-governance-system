# 🏛️ Smart AI Governance Decision Support System (DSS)

An interdisciplinary, AI-powered Smart E-Governance Decision Support System designed to automate citizen grievance triage and optimize municipal administrative workflows.

The platform combines **zero-shot natural language classification, dynamic urgency prioritization, geospatial data capture, and real-time administrative monitoring** to transform unstructured citizen complaints into actionable municipal service requests.

Built with an asynchronous **FastAPI** backend, a **React + Vite** frontend, a **BART-Large-MNLI** inference engine, and **Google Cloud Firestore**, the system enables intelligent grievance routing and priority-based administrative dispatch without requiring task-specific labeled training data.

---

## ✨ Features

### 🧠 AI-Powered Grievance Classification

- Uses the `facebook/bart-large-mnli` model for zero-shot Natural Language Inference (NLI).
- Automatically classifies citizen complaints into municipal departments:
  - 🛣️ Roadways
  - 🧹 Sanitation
  - ⚡ Electrical
  - 💧 Water Supply
- Processes natural-language complaints without requiring a custom labeled training dataset.

### 🚨 Dynamic Urgency Prioritization

- Calculates a normalized urgency score between `0.0` and `1.0`.
- Evaluates semantic keywords, hazard indicators, and sentiment-related signals.
- Prioritizes potentially dangerous incidents over routine complaints.
- Supports priority-based administrative queues rather than relying solely on submission time.

### 🗺️ Geospatial Complaint Tracking

- Captures citizen location using the browser's HTML5 Geolocation API, subject to user permission.
- Stores location data as Firestore `GeoPoint` values.
- Enables location-aware complaint monitoring and supports ward-level administrative analysis.

### 🎨 Interactive Administrative Dashboard

- Provides a centralized interface for monitoring submitted grievances.
- Displays complaint details, assigned departments, locations, and urgency scores.
- Uses real-time Firestore snapshot listeners to reflect database updates dynamically.
- Features a minimalist interface with interactive UI elements and Lucide icons.

### ⚡ Asynchronous Backend Architecture

- Uses FastAPI and Uvicorn for asynchronous API handling.
- Separates frontend presentation, API endpoints, AI inference, and database operations.
- Organizes business logic into modular services for easier maintenance and future scaling.

---

## 🏗️ System Architecture

```text
┌──────────────────────────────────────┐
│          Citizen Client              │
│          React + Vite                │
│                                      │
│  Grievance Form + Browser Geolocation│
└──────────────────┬───────────────────┘
                   │
                   │ Asynchronous REST API
                   ▼
┌──────────────────────────────────────┐
│         FastAPI Backend              │
│                                      │
│  ┌────────────────┐ ┌──────────────┐ │
│  │ BART-Large-MNLI│ │ Urgency      │ │
│  │ Zero-Shot NLI  │ │ Scoring      │ │
│  └────────┬───────┘ └──────┬───────┘ │
│           └────────┬────────┘         │
│                    ▼                  │
│          Structured Grievance         │
│               Processing              │
└────────────────────┬─────────────────┘
                     │
                     ▼
┌──────────────────────────────────────┐
│       Google Cloud Firestore         │
│                                      │
│  Grievances · GeoPoints · Priorities │
└────────────────────┬─────────────────┘
                     │
                     │ Real-Time Updates
                     ▼
┌──────────────────────────────────────┐
│       Administrative Dashboard       │
│                                      │
│  Monitoring · Triage · Dispatch      │
└──────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Category               | Technologies                       |
| ---------------------- | ---------------------------------- |
| Frontend Framework     | React 18                           |
| Build Tool             | Vite                               |
| Styling                | Tailwind CSS, PostCSS              |
| Icons                  | Lucide React                       |
| HTTP Client            | Axios / Fetch API                  |
| Backend Framework      | FastAPI                            |
| ASGI Server            | Uvicorn                            |
| Language               | Python 3.10+                       |
| NLP / Machine Learning | Hugging Face Transformers, PyTorch |
| AI Model               | `facebook/bart-large-mnli`         |
| Database               | Google Cloud Firestore             |
| Authentication         | Firebase Authentication            |
| Geolocation            | HTML5 Geolocation API              |
| Environment Management | A                                  |
| Version Control        | Git                                |

---

## 📂 Project Structure

```text
smart-AI-governance-system/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── api_v1/
│   │   │       ├── __init__.py
│   │   │       ├── admin.py
│   │   │       ├── citizen.py
│   │   │       └── endpoints.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   └── firebase_admin.py
│   │   ├── models/
│   │   │   └── __init__.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── report.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── nlp.py
│   │   ├── __init__.py
│   │   └── main.py
│   ├── .gitignore
│   ├── README.md
│   └── requirements.txt
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── config.js
    │   ├── assets/
    │   │   ├── hero.png
    │   │   ├── react.svg
    │   │   └── vite.svg
    │   ├── components/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── GrievanceForm.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── services/
    │   │   └── firebase.js
    │   ├── App.css
    │   ├── App.jsx
    │   ├── firebase.js
    │   ├── index.css
    │   └── main.jsx
    ├── .gitignore
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    └── postcss.config.js
```

*Note: The tree illustrates a suggested module organization. Adjust filenames to match the actual implementation.*

---

## ⚙️ Prerequisites

Ensure the following tools are installed:

- **Python:** 3.10 or later
- **Node.js:** 18 or later
- **npm:** Compatible with your Node.js installation
- **Git**
- **Google Cloud / Firebase project:** With Firestore configured
- **Firebase credentials:** Configured securely for the backend and frontend as appropriate

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/adityabasu-dev/smart-AI-governance-system
cd smart-AI-governance-system
```

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the environment.

**Windows — PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

**Windows — Command Prompt:**

```cmd
venv\Scripts\activate
```

**Linux / macOS:**

```bash
source venv/bin/activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory and configure the required settings.

Example:

```env
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CREDENTIALS_PATH=path/to/service-account.json
```

Adapt these variables to the configuration expected by your application.

**Security notes:**

- Never commit service-account JSON files or private credentials.
- Add `.env`, virtual environments, and credential files to `.gitignore`.
- Use environment variables or a managed secret store in production.
- Restrict Firestore access through appropriate IAM permissions and security rules.

### 4. Start the Backend Server

From the `backend/` directory, run:

```bash
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at:

- **API Base URL:** [http://localhost:8000](http://localhost:8000)
- **Interactive API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative API Documentation:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 5. Configure the Frontend

Open a separate terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Configure the frontend environment variables according to your Firebase and API setup.

For a Vite application, an example `.env` file could contain:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
```

Use the actual variable names required by your Firebase initialization code.

**Important:** Vite exposes variables prefixed with `VITE_` to client-side code. Never place Firebase Admin credentials or other server-side secrets in frontend environment variables.

### 6. Start the Frontend

```bash
npm run dev
```

The Vite development server will generally be available at:

**[http://localhost:5173](http://localhost:5173)**

Open the URL in your browser to access the application.

---

## 🔄 System Workflow

### 1. Grievance Submission

A citizen submits a complaint using the React-based grievance form. If the citizen grants permission, the browser captures their geographical coordinates.

### 2. AI-Based Department Classification

The frontend sends the complaint to the FastAPI backend through a REST API endpoint.

The NLP service uses `facebook/bart-large-mnli` to compare the complaint against candidate department labels and determine the most suitable category.

### 3. Urgency Assessment

The urgency engine evaluates configured hazard indicators, semantic keywords, and sentiment-related signals to calculate an urgency score between `0.0` and `1.0`.

High-risk complaints can be elevated in the administrative queue.

### 4. Structured Data Storage

The backend stores the processed grievance in Firestore, including relevant fields such as:

- Complaint description
- Assigned department
- Urgency score
- Submission timestamp
- Geographical coordinates
- Processing status

### 5. Real-Time Administrative Monitoring

The administrative dashboard subscribes to relevant Firestore updates and refreshes its view when grievance records change.

Operators can monitor incoming complaints and identify potentially critical incidents for further review and dispatch.

---

## 🧠 AI Triage: How It Works

The system uses **zero-shot classification through Natural Language Inference (NLI)** to classify complaints without training a dedicated classifier on a labeled grievance dataset.

Example:

**Input complaint:**

> There is a large pothole on the main road, and several vehicles are swerving to avoid it.

**Illustrative output:**

```json
{
  "department": "Roadways",
  "urgency_score": 0.85,
  "status": "pending_review"
}
```

*The output above is illustrative, not a measured model result.*

The model evaluates candidate labels against the input text. The urgency engine separately calculates a priority score using application-defined rules.

The urgency score is **not automatically a calibrated probability of danger**. Its reliability depends on the scoring logic, evaluation data, and validation process.

For safety-critical or ambiguous complaints, administrative review should remain part of the workflow.

---

## 📡 Example API Design

The following endpoints illustrate a possible REST API structure. Update them to reflect the routes implemented in your application.

| Method  | Endpoint                        | Purpose                                    |
| ------- | ------------------------------- | ------------------------------------------ |
| `POST`  | `/api/v1/citizen/grievances`    | Submit and classify a grievance            |
| `GET`   | `/api/v1/admin/grievances`      | Retrieve grievances for the dashboard      |
| `GET`   | `/api/v1/admin/grievances/{id}` | Retrieve a specific grievance              |
| `PATCH` | `/api/v1/admin/grievances/{id}` | Update status or administrative assignment |
| `GET`   | `/health`                       | Check backend health                       |

---

## 🔐 Security and Responsible AI

Because this platform processes citizen complaints and location data, security and accountability are essential.

- **Authentication:** Protect administrative functionality using Firebase Authentication or an equivalent identity provider.
- **Authorization:** Enforce role-based permissions for administrative actions.
- **Data privacy:** Request geolocation permission explicitly and collect only the data necessary for the service.
- **Credential management:** Store privileged credentials on the server and never commit them to source control.
- **Input validation:** Validate complaint payloads, coordinate ranges, and request sizes.
- **AI oversight:** Allow authorized personnel to review incorrect classifications and high-risk prioritization decisions.
- **Model evaluation:** Test classification accuracy, urgency-score behavior, and performance across varied complaint descriptions.
- **Operational reliability:** Apply rate limiting, logging, timeouts, and appropriate error handling.

AI-generated classifications and urgency scores should assist municipal personnel rather than independently determine emergency response or deny access to public services.

---

## 🚧 Future Improvements

Potential extensions include:

- [ ] Ward-level grievance heatmaps and geospatial filtering.
- [ ] Explainable AI outputs with classification confidence and supporting evidence.
- [ ] Human-in-the-loop classification correction and feedback collection.
- [ ] Automated duplicate complaint detection.
- [ ] SLA tracking and escalation notifications.
- [ ] Multilingual grievance processing for regional languages.
- [ ] Historical analytics for identifying recurring municipal issues.
- [ ] Model benchmarking and evaluation dashboards.
- [ ] Role-based access control for municipal administrators.
- [ ] Automated testing, CI/CD, and production deployment.
- [ ] Improved geospatial indexing for efficient location-based queries.

---

## 👨‍💻 Built With

**FastAPI · React · Vite · Hugging Face Transformers · PyTorch · Google Cloud Firestore · Firebase**

*Bridging citizen grievances and smarter municipal decision-making through AI-assisted governance.*
