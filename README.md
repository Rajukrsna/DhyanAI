# HealthTrackPro - A Holistic Health and Wellness Application

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Rajukrsna/HealthTrackPro1/blob/main/LICENSE)

## Table of Contents
- [Inspiration](#inspiration)
- [Project Objectives](#project-objectives)
- [Architecture Overview](#architecture-overview)
  - [High-Level Architecture Diagram](#high-level-architecture-diagram)
  - [Component Diagram](#component-diagram)
  - [Network Topology](#network-topology)
- [Technical Documentation](#technical-documentation)
  
  - [Explanation of Key Components and Modules](#explanation-of-key-components-and-modules)
  - [API Documentation](#api-documentation)
  - [Setup and Usage Instructions](#setup-and-usage-instructions)

---

## Inspiration
DhyanAI was inspired by the need for a combination of scientific and traditional application that empowers individuals to track their habits, understand their nutrition and their goal of calorie intake per day, get health symptom analysis from AI, receive Yoga recommendations , personalized health advice for the same. Our goal is to help users make informed choices about their health through data-driven insights and AI-powered suggestions.

---

## Project Objectives
1. Develop a **holistic health and wellness application** focused on tracking user habits and analyzing nutrient intake.
2. Integrate **AI-based recommendations** for nutrition, wellness practices, yoga Recommendation and to cure health symptoms.

---

## Architecture Overview

### High-Level Architecture Diagram
- **Frontend**: 
  - User Interface built with HTML, CSS, JavaScript, Bootstrap, and Chart.js to visualize health data.
- **Backend**: 
  - Node.js/Express server for handling requests, analyzing data, and connecting to external APIs.
- **Database**: 
  - MongoDB (NoSQL) hosted on AWS for secure and scalable data storage.
- **AI Model**: 
  - **Cohere AI model**: Used for health symptom analysis and personalized recommendations.
  - **Stability Diffusion AI model**:Used for Generating the yoga pose the user desires.
  - **AWS Bedrock**: for accessing the foundation models that AWS offers.
- **Lambda Functions**: 
  - AWS Lambda handles serverless execution of tasks like data processing and user request handling in the backend.

### Component Diagram
- **Frontend Components**:
  - Register, Login, Habit Tracking, Nutritional Analysis, Health Issue/symptom Input, HealthAI chatbot.
- **Backend Components**:
  - User Authentication, Data Processing, API Integration, and Database Communication, Report generation, AI Image Generation.
- **Data Storage**:
  - MongoDB database hosted on AWS for secure and efficient management of user health data.

### Network Topology
- **User Device**:
  - Connects securely via HTTPS to the frontend, which communicates with the backend server.
- **Backend on AWS**:
  - Hosts the application server, managing all data requests from the AI Model and interactions through AWS Lambda functions.
- **Database**:
  - Deployed on AWS to ensure scalability, reliability, and security of user data.

---
### Setup and Usage Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Rajukrsna/HealthTrackPro1.git
   
   cd HealthTrackPro1

2. **Install the necessary Dependencies and start running it at the localhost:3000**

