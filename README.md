# galaxeye-tilescope

![Project UI](assets/AOI_GalaxEye.jpg)




##  Tech Stack

- **Frontend**: React.js
- **Backend**: Express.js
- **Database**: MongoDB
- **Container Orchestration**: Docker Compose

##  Prerequisites

Before you begin, ensure you have the following installed:
- Docker
- Docker Compose
- Node.js (for local development)

##  Project Structure

```
.
├── frontend/          # React frontend application
├── backend/           # Express.js backend application
└── docker-compose.yml # Docker composition configuration
```

## 🔧 Configuration

The application is configured using Docker Compose with the following services:

1. **Frontend Service**
   - Built from the frontend directory
   - Exposed on port 3000
   - Connects to backend service
   - Environment variables:
     - `REACT_APP_API_URL`: Backend API URL

2. **Backend Service**
   - Built from the backend directory
   - Exposed on port 5000
   - Connects to MongoDB
   - Environment variables:
     - `DATABASE_URL`: MongoDB connection string

3. **MongoDB Service**
   - Uses latest MongoDB image
   - Persistent data storage using Docker volumes
   - Container name: mongo

4. **Data Population Service**
   - One-time service for initial data setup
   - Runs `populateFeatures.js` script
   - Depends on MongoDB service
   - No automatic restart
   - to load karnatakageojson data

##  Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/heykvr/GalaxEye-TileScope.git 
   ```

2. Navigate to the project directory:
   ```bash
   cd GalaxEye-TileScope
   ```

3. Start the application:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`(if run in local)


## 💾 Data Persistence

MongoDB data is persisted using a Docker volume named `mongo-data`.

##  Networking

All services are connected through a custom bridge network named `app-network`.

##  Troubleshooting

 If services fail to start, ensure all required ports are available

##  Development

For local development:

1. Install dependencies in both frontend and backend directories:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. Run services individually:
   - Frontend: `npm start` in frontend directory
   - Backend: `nodemon run dev` in backend directory
   - Database: Use Docker Compose for MongoDB only

