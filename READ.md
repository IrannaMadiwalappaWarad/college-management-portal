# EduDash - College Management Portal 🎓

A comprehensive, full-stack, enterprise-grade College Management System designed to streamline academic operations. Built with a robust **Spring Boot (Java 21)** backend and a responsive **HTML/CSS/JS (Bootstrap 5)** frontend, EduDash provides secure, role-based access for Administrators, Faculty, and Students.

---

## 🌟 Key Features

*   **Role-Based Access Control (RBAC):** Secure JWT authentication with dedicated dashboards for Admin, Faculty, and Students.
*   **Analytics Dashboard:** Real-time metrics and Chart.js visualization of daily attendance and active notices.
*   **Student & Faculty Management:** Complete CRUD operations with interactive Bootstrap Modals, instant search, and filtering.
*   **Smart Attendance System:** 
    *   Bulk attendance marking for Faculty.
    *   Dynamic subject selection based on Department and Semester (pre-loaded with Engineering curriculum).
    *   MongoDB compound indexing to prevent duplicate attendance records.
    *   Student portal to track attendance percentages and missed classes.
*   **Digital Notice Board:** Create, edit, and categorize announcements targeting specific audiences (All, Students, Faculty) with automatic date expiration.
*   **Modern UI/UX:** A responsive, SaaS-style interface featuring custom CSS variables, skeleton loaders, custom scrollbars, and seamless asynchronous API integration (Fetch API).

---

## 🛠️ Technology Stack

### Backend
*   **Java 21**
*   **Spring Boot 4.1.2** (Web, Security, Validation)
*   **Spring Security & JWT** (JSON Web Tokens for stateless authentication)
*   **Spring Data MongoDB**
*   **Lombok**

### Frontend
*   **HTML5, CSS3, JavaScript (ES6+)**
*   **Bootstrap 5.3** & **Bootstrap Icons**
*   **Chart.js** (Data visualization)
*   **FullCalendar.js** (Academic calendar)
*   **UI Avatars API** (Dynamic user profiles)

### Database
*   **MongoDB Community Server** (Localhost:27017)

---

## 📂 Project Structure

The project is structured as a unified Spring Boot application where the frontend is served as static resources.

```text
college-management-portal/
├── src/main/java/com/college/portal/
│   ├── config/          # Spring Security & CORS configurations
│   ├── controller/      # REST API Endpoints
│   ├── exception/       # Global Exception Handling
│   ├── model/           # MongoDB Entities (User, Student, Faculty, etc.)
│   ├── repository/      # MongoRepository Interfaces
│   ├── security/        # JWT Filters and UserDetails logic
│   └── service/         # Business Logic Layer
├── src/main/resources/
│   ├── application.properties  # DB and JWT config
│   └── static/                 # FRONTEND FILES
│       ├── index.html          # Landing Page
│       ├── login.html          # Authentication UI
│       ├── css/                # style.css, dashboard.css, responsive.css
│       ├── js/                 # api.js (fetch wrapper), auth.js, students.js...
│       └── pages/              # Admin, Faculty, and Student Dashboards & Modules
└── pom.xml                     # Maven Dependencies
```

---

## 🚀 Setup & Installation

### Prerequisites
1.  **Java Development Kit (JDK) 21** installed.
2.  **Maven** installed.
3.  **MongoDB Community Server** installed and running locally on port `27017`.

### 1. Database Setup
Ensure MongoDB is running. The application will automatically create a database named `college_management` and generate the required collections upon initial data insertion.

### 2. Configure Environment Properties
Navigate to `src/main/resources/application.properties` and verify your configuration:
```properties
spring.application.name=college-management-portal
spring.data.mongodb.uri=mongodb://localhost:27017/college_management
server.port=8080
jwt.secret=CollegePortalSuperSecretKeyForJwtValidation2023!
jwt.expiration=36000000
```

### 3. Build and Run
Open your terminal in the root project directory and run:
```bash
mvn clean install
mvn spring-boot:run
```
*Alternatively, run the `CollegeManagementPortalApplication.java` main class from your IDE (Eclipse/IntelliJ).*

### 4. Access the Application
Open your web browser and navigate to:
**[http://localhost:8080](http://localhost:8080)**

---

## 🔐 Authentication & Initial Testing

To get started, you must register a root Admin user. You can do this via Postman or PowerShell.

**Create Initial Admin (PowerShell Example):**
```powershell
$body = @{ email = "admin@college.edu"; password = "password123"; role = "ADMIN" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

**Testing Flow:**
1.  Navigate to `http://localhost:8080/login.html` and log in as `admin@college.edu`.
2.  Go to **Faculty Management** and create a Faculty member.
3.  Go to **Student Management** and create a Student.
4.  Log out, and log in with the new Faculty credentials to test the Attendance module.
5.  Log out, and log in with the Student credentials to test the Student Dashboard (using their USN).

---

## 🔮 Future Enhancements
*   **Examinations & Results Module:** The UI layout exists for these modules (`examinations.html`, `results.html`), pending backend API development.
*   **Email Notifications:** Integrate JavaMailSender to send automated emails when notices are published or attendance drops below a threshold.
*   **Profile Picture Uploads:** Implement MongoDB GridFS for storing actual user profile images instead of generated avatars.

---
*Developed as a comprehensive College Project / Portfolio piece.*