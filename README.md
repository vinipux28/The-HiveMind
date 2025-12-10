# 🧠 HiveMind: Connect. Conquer. Thrive.

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![PostgreSQL](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)
![Status](https://img.shields.io/badge/status-active-success.svg?style=for-the-badge)

**HiveMind** is an AI-powered "Life RPG" and social platform designed to turn personal struggles into actionable, gamified quests. By combining peer-to-peer support with an intelligent AI companion, HiveMind transforms the isolation of self-improvement into a collaborative, engaging journey.

---

## 🎥 Platform Demo

See HiveMind in action. Watch as the AI generates a personalized roadmap, creates quests, and verifies real-world activities using computer vision.

<video src="https://github.com/user-attachments/assets/bd14fdf3-b604-4dec-ac87-3a469728987e" controls="controls" width="100%">
  Your browser does not support the video tag.
</video>

---

## 🌟 Mission Statement

Our mission is to foster a community where shared experience becomes a catalyst for **positive change**. We move beyond passive communication by integrating an active **AI Agent** that guides users through their personal battles, verifying their progress and connecting them with the right people at the right time.

---

## 🔑 Key Features

### 🤖 AI Life Coach & Quest Generation
The heart of HiveMind is an intelligent agent that analyzes user context to generate specific, manageable paths forward.
* **Dynamic Roadmaps:** Breaks down overwhelming life goals into 4-week actionable plans.
* **Custom Quests:** Generates specific daily tasks ("Quests") and larger goals ("Milestones").
* **Smart Matching:** Suggests connections with other users who have high profile similarity, ensuring relevance in peer support.

### 📸 AI Verification Engine ("The Judge")
We solve the problem of accountability through multimodal AI.
* **Proof-of-Completion:** Users upload images or videos to prove they completed a task (e.g., a photo of a run tracking app).
* **Automated Validation:** The AI analyzes the media content to verify the task was actually completed before awarding XP.

### 🎮 Gamification & Progression
* **XP & Leveling:** Users earn Experience Points (XP) for every verified action, leveling up their profile.
* **Community Leaderboards:** Track progress against friends and the wider community.
---

## 🛠 Prerequisites

To run HiveMind on your **local machine**, you need to have the following core technologies installed:

| Technology | Purpose |
| :--- | :--- |
| **Node.js** | Backend application server and package management. |
| **Python** | AI/Machine Learning components and core logic. |
| **PostgreSQL** | Primary relational database for user, quest, and proof data. |

Additionally, you will need to install the specific **Node.js and Python libraries** as listed in the project's `package.json` and `requirements.txt` files, respectively.

---

## ⚙️ Installation (Local Host Setup)

Follow these steps to set up and run the HiveMind project locally.

### 1. Database Setup (PostgreSQL)

1.  **Install PostgreSQL:** Download and install the appropriate version for your operating system from the [official PostgreSQL website](https://www.postgresql.org/download/).
2.  **Create Database:** Use the `psql` command-line tool or a GUI client (like pgAdmin) to create the project database.
    ```bash
    CREATE DATABASE hivemind_db;
    ```
3.  **Configuration:** Update the database connection settings in the appropriate configuration file (e.g., a `.env` file) to match your local PostgreSQL credentials (username, password, and database name `hivemind_db`).

### 2. Backend Setup (Node.js)

1.  **Install Node.js:** Ensure you have **Node.js (LTS recommended)** installed.
2.  **Navigate to Backend Directory:** Open your terminal and change the directory to the project's backend folder.
3.  **Install Dependencies:** Install all required Node.js libraries.
    ```bash
    npm install
    ```
4.  **Run Backend Server:** Start the Node.js server.
    ```bash
    npm start
    ```

### 3. AI/ML Setup (Python)

1.  **Install Python:** Ensure you have **Python 3.x** installed.
2.  **Navigate to Python Directory:** Change the directory to the folder containing your AI/Python components.
3.  **Create Virtual Environment (Recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate # On Linux/macOS
    # .\venv\Scripts\activate # On Windows
    ```
4.  **Install Dependencies:** Install all required Python libraries.
    ```bash
    pip install -r requirements.txt
    ```
5.  **Run Python AI Service:** Start the service, which may run as a separate process or be called by the Node.js backend.
    ```bash
    python ai_service.py # Replace with the actual startup file name
    ```

### 4. Accessing HiveMind

Once all services are running, you should be able to access the HiveMind application in your web browser, typically at:

> 🌐 **`http://localhost:3000`** (or the port specified in your Node.js configuration)

---

## 🧑‍💻 Team

The development of HiveMind is a collaborative effort by the following dedicated team members:

| Name | Role | GitHub |
| :--- | :--- | :--- |
| **Oleksandur Vinichenko** | Front-End and Back-End Developer | @vinipux28 |
| **Yuan Tomov** | AI/ML Specialist, Back-End Developer | @YVTomov22 |
| **Tsvetan Zhekov** | AI/ML Specialist, Back-End Developer | @TPZhekov22 |
| **Kaloyan Petrov** | UX/UI Designer. Frontend Developer | @KSPetrov22 |
| **Anton Babev** | QA, UX/UI Designer | @AKBabev22 |
