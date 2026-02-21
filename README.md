# MyFinBank 

MyFinBank is a comprehensive, full-stack banking web application built with the MERN stack (MongoDB, Express, React, Node.js). It supports role-based access for both Customers and Administrators, providing a seamless internal banking experience from account management to real-time customer support.

##  Features

### For Customers
* **Secure Authentication**: Register and log in securely.
* **Dashboard**: Overview of account balance and quick access to banking services.
* **Real-time Transactions**: Deposit and withdraw funds instantly.
* **Fund Transfers**: Transfer money securely to other MyFinBank account holders.
* **Loan Management**: Apply for loans directly from the dashboard.
* **EMI Calculator**: Calculate monthly loan repayments based on principal, interest, and tenure.
* **Investments**: Options for Fixed Deposits (FD) and Recurring Deposits (RD).
* **Live Chat Support**: Real-time socket-based chat to connect directly with bank administrators.

### For Administrators
* **User Management**: View all registered customers, and activate/deactivate user profiles.
* **Account Management**: Update customer account balances, and delete accounts (only if the balance is 0).
* **Loan Approvals**: Review pending customer loan applications and approve or deny them based on customer profiles.
* **Specific Customer Support**: A dedicated admin chat interface with a user-selection dropdown to provide private, 1-on-1 support to individual customers.

## Technology Stack

**Frontend**
* React.js
* React Router DOM (Navigation)
* Bootstrap (UI Styling)
* Socket.io-client (Real-time Chat)

**Backend**
* Node.js & Express.js
* MongoDB & Mongoose (Database & ORM)
* JSON Web Tokens (JWT Authentication)
* Socket.io (Real-time bidirectional event-based communication)

##  Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
* [Node.js](https://nodejs.org/en) installed on your machine.
* A [MongoDB](https://www.mongodb.com/) database (either a local instance or MongoDB Atlas cluster).

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/YOUR_USERNAME/myfinbank.git
   cd myfinbank
   ```

2. **Setup the Backend**
   ```sh
   cd backend
   npm install
   ```
   * Create a `.env` file in the `backend` directory and add your environment variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     ```
   * Start the backend server:
     ```sh
     npm run dev
     ```

3. **Setup the Frontend**
   ```sh
   cd ../frontend
   npm install
   ```
   * Start the React development server:
     ```sh
     npm start
     ```

4. **Open the App**
   * Visit `http://localhost:3000` (or `http://localhost:3001` depending on your setup) in your browser.

