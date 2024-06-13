# Server Monitoring App

This application continuously monitors servers by pinging them in real-time and updating the database. It also generates a report for a particular day interval.

## Features

- **Real-Time Server Monitoring**: The app pings servers in real-time and updates the database with the status of each server.
- **Report Generation**: Generates a report of server status for a particular day interval.

## Future Development

- **Server Information**: Add a functionality to gather information about a given server. This would determine if the given IP is of a server, switch, or router.
- **Visual Reports**: Provide a visual representation for the generated reports.
- **Python File Optimization**: Optimize the Python file for better performance.
- **ICMP Packet Functionality**: Add a functionality to send ICMP packets to a particular server to check which ports are open, thus knowing the possible services running on them.

## Setup and Installation

Follow these steps to set up and run the application:

1. **Clone the Repository**: Clone the repository to your local machine.

```bash
git clone https://github.com/Quantumgoku/Server-Monitoring-App/
```

2.**Install Dependencies**: Navigate to both the frontend and backend directories and install the necessary dependencies
```bash
cd frontend
npm install

cd ../backend
npm install
```

3.**Create .env File**: In the backend directory, create a .env file to store your environment variables.
```bash
cd backend
touch .env
```

4.**Configure .env File**: Open the .env file and add your MongoDB connection string and JWT secret.
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret

Replace your_mongodb_connection_string with your MongoDB connection string and your_jwt_secret with your JWT secret

5. **Run the Application**: You can now run the application. In the frontend and backend directories, start the servers.
```bash
   # Start the frontend
cd frontend
npm start

# Start the backend
cd ../backend
node server.js
```
The frontend should now be running on localhost:3000 and the backend on localhost:5000.
