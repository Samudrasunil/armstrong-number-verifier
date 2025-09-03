Numbric is a full-stack web application built with Go and React that allows users to register, log in, verify Armstrong numbers, and manage their findings. 

Features
  - User Management: A complete user registration and login system.
  - State Management: The application remembers the logged-in user across different pages using React Context.
  - Number Verification: A page to check if a number is an Armstrong number and save it to the user's personal collection.
  - Personal Dashboard: A dashboard for logged-in users, displaying total numbers found, largest number, and a list of all unique saved armstrong numbers.
  - Global Dashboard: A public dashboard that displays all registered users with extracted usernames for privacy and their collections of unique saved numbers.
  - Search Functionality: The global dashboard includes a dynamic search bar to filter the list by email or number.
  - Pagination: The Global Dashboard is equipped with backend pagination to efficiently handle large datasets, ensuring the application remains fast and responsive                          regardless of the number of users.
  - Input Validation: Validation is implemented on both the frontend for immediate user feedback and on the backend for security and data integrity.
  - API Error Responses: The backend API provides clear and appropriate success or error responses, using standard HTTP status codes to communicate the result of any action.
  - Secure Input Sanitization: The backend sanitizes user inputs, such as trimming whitespace and converting emails to lowercase, to ensure data integrity.

Technical Stack
  - Backend: Go (Golang)
  - Database: PostgreSQL
  - Frontend: React
    

Setup and Installation

Follow these steps to get your development environment set up.

1. Clone the Repository
   In terminal,run commands:
   
   git clone https://github.com/Samudrasunil/armstrong-number-verifier.git
   
   cd armstrong-number-verifier


2. Set Up the PostgreSQL Database
   You need to create a database and the required tables.
  - Open pgAdmin4.
  - Create a database named cooee_db.
    
   - Query:
     
    CREATE DATABASE cooee_db;
    
  - Connect to your new database and run the following SQL query to create the tables.
    
     Query:
    
    -Users Table
    
        CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
     );

    -Armstrong Numbers Table


        CREATE TABLE armstrong_numbers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        number BIGINT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT fk_user
            FOREIGN KEY(user_id)
            REFERENCES users(user_id)
    );

    
3. Configure the Backend (Go)

  - Navigate to the backend directory.
  - Open the database.go file and update the connStr variable with your PostgreSQL password.
  
4. Configure the Frontend (React)
   
  - Navigate to the frontend directory.
  - Install the Node.js dependencies.

Running the Application

Run the backend and frontend servers in two separate terminals.

  1. Start the Backend Server

  - In a terminal, navigate to the backend directory.
  - Run the following command:
    go run .
  - The backend server will start and be available at http://localhost:8080.

 2. Start the Frontend Server

  - In a new terminal, navigate to the frontend directory.
  - Run the following command:
    npm start
  - This will automatically open the application in your default web browser at http://localhost:3000.
