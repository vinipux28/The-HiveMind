# 🧠 HiveMind: AI-Augmented Social Development Platform

**Project Overview:** A structured, gamified social media platform leveraging artificial intelligence to guide users through personal challenges via actionable milestones and peer connectivity.

---

## I. Problem Statement & Value Proposition

### 1.1 The Challenge
Contemporary digital platforms often foster isolation or comparison, lacking mechanisms for guided, practical self-improvement. Users facing complex personal challenges—from career development to behavioral change—frequently lack access to structured, affordable coaching and struggle to find highly relevant peer support.

### 1.2 The Solution: HiveMind
HiveMind transforms personal struggles into communal, measurable achievements. By utilizing **intelligent personalization** and **gamification**, the platform provides:
* **Structured Progression:** Replacing vague goals with definitive, AI-generated "Quests."
* **Validated Accountability:** Leveraging machine learning for objective proof analysis.
* **Contextualized Community:** Facilitating connections based on shared, specific life challenges.

---

## II. Core Features

* **Peer-to-Peer Mentorship:** Facilitates private and group communication between users who have categorized themselves under the same challenge tags (e.g., 'Entry-Level Coding,' 'Anxiety Management').
* **AI Coach Engine:** A proprietary chatbot that functions as a developmental guide, generating **personalized Quests** (actionable tasks) and recommending high-compatibility peer connections.
* **Gamification and Progression:** Implements a **Leaderboard System** where users earn points upon completing Quests, driving motivation through friendly competition.
* **ML-Powered Verification:** Quests require users to submit **image or video evidence**. The platform's AI validates this proof of completion before awarding points, ensuring data integrity and user accountability.

---

## III. Technology Stack & Prerequisites

HiveMind is architected using a modern, scalable component structure designed for rapid deployment and data processing.

### 3.1 Required Environment

To run this project locally, the following major dependencies must be installed and configured:

* **Node.js (LTS recommended):** Primary runtime for the server and front-end application.
* **PostgreSQL:** The secure, transactional database management system for persistent data storage.
* **Python (3.x):** Used specifically for the implementation of the AI/Machine Learning verification scripts.

---

## IV. Local Installation and Execution

Follow these instructions to set up and execute the HiveMind application environment:

### 4.1 Repository Initialization
1.  **Clone the Source:**
    ```bash
    git clone [https://github.com/YourTeam/hivemind.git](https://github.com/YourTeam/hivemind.git)
    cd hivemind
    ```
2.  **Install Dependencies:** Run the package manager in the root directory. This command is configured to install both Node.js (via `npm`) and Python dependencies (via `pip`).
    ```bash
    npm install
    pip install -r requirements.txt
    ```

### 4.2 Database Configuration
1.  Ensure your **PostgreSQL server instance** is active.
2.  Create the required database: `CREATE DATABASE hivemind;`.
3.  Set up the necessary **environment variables** (e.g., in a `.env` file) to include the correct database connection URI, host, and port.

### 4.3 Application Startup
Execute the combined development script, which starts the backend server, connects the AI modules, and launches the frontend interface concurrently:
```bash
npm run dev