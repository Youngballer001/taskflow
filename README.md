# TaskFlow - Project Management Application

TaskFlow is a modern, full-stack project management application designed to help teams organize, track, and manage their projects and tasks efficiently.

## 🚀 Features

The following features are planned for TaskFlow:

- **User Management**: User registration, authentication, and profile management
- **Project Management**: Create, update, and manage projects
- **Task Management**: Create, assign, and track tasks with priorities and statuses
- **Team Collaboration**: Add team members to projects and assign tasks
- **Kanban Board**: Visual task management with drag-and-drop functionality
- **Comments & Activity**: Comment on tasks and track project activity
- **Notifications**: Real-time notifications for task updates and assignments
- **Dashboard**: Overview of projects, tasks, and team activity
- **Reports**: Generate reports on project progress and team performance

## 🛠️ Technology Stack

### Backend
- **Java 25 (LTS)**
- **Spring Boot 3.x**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** with Hibernate
- **MySQL 8**
- **Flyway** (Database Migrations)
- **Maven** (Build Tool)
- **JUnit 5 & Mockito** (Testing)

### Frontend
- **React 18**
- **JavaScript**
- **Vite** (Build Tool)
- **React Router** (Routing)
- **Axios** (HTTP Client)
- **Context API** (State Management)
- **Recharts** (Charts & Visualization)
- **React Beautiful DnD** (Drag & Drop)

### Database
- **MySQL 8**

### DevOps & Tools
- **Docker & Docker Compose**
- **Git & GitHub**
- **GitHub Actions** (CI/CD)
- **Nginx** (Production Server)

## 📁 Project Structure

```
taskflow/
├── backend/              # Spring Boot backend application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
├── frontend/             # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
├── database/             # Database scripts
├── docs/                 # Documentation
├── docker/               # Docker configuration files
├── .github/              # GitHub Actions workflows
├── docker-compose.yml    # Docker Compose configuration
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- **Java 25** (LTS)
- **Node.js 18** or higher
- **MySQL 8** or higher
- **Maven 3.8+**
- **Git**

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure the database connection in `src/main/resources/application.properties` or use environment variables.

3. Build the application:
   ```bash
   mvn clean install
   ```

4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The backend will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure the API URL.

4. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Database Setup

1. Create a MySQL database:
   ```sql
   CREATE DATABASE taskflow_db;
   ```

2. Flyway migrations will run automatically when the backend starts.

### Using Docker Compose

1. Copy `.env.example` to `.env` and configure the environment variables.

2. Run the application:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:8080`

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📚 Documentation

- [Project Overview](docs/project-overview.md)
- [System Architecture](docs/system-architecture.md)
- [Database Design](docs/database-design.md)
- [API Documentation](docs/api-documentation.md)
- [Installation Guide](docs/installation-guide.md)
- [User Guide](docs/user-guide.md)
- [Testing Guide](docs/testing-guide.md)
- [Deployment Guide](docs/deployment-guide.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Development Status

**Note**: This project structure has been created but features are not yet implemented. The structure is ready for development to begin.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ using Spring Boot and React**
