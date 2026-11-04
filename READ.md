# College Management Portal - Backend API

A robust, secure, and scalable backend REST API for a College Management System, built with Java 21, Spring Boot, and MongoDB. This system handles Student and Faculty records, Attendance tracking, Notice board announcements, and a centralized Dashboard, all protected by JWT-based Role-Based Access Control (RBAC).

## Technology Stack
*   **Java:** 21
*   **Framework:** Spring Boot 3.x
*   **Database:** MongoDB (Local Community Server)
*   **Security:** Spring Security & JWT (JSON Web Tokens)
*   **Utilities:** Lombok, Spring Boot Validation
*   **Build Tool:** Maven

## Architecture Diagram
The application follows a clean layered architecture:

```text
Client (Postman/Frontend/PowerShell)
       │
       ▼  (HTTP/REST + JWT)
[ JwtAuthFilter ] ── Validates Token & Extracts Role
       │
       ▼
[ Controllers ] ──── Routes requests, validates DTOs
       │
       ▼
[ Services ] ─────── Business logic, duplicate checks, calculations
       │
       ▼
[ Repositories ] ─── Data access layer (Spring Data MongoDB)
       │
       ▼
[ MongoDB ] ──────── NoSQL Document Storage