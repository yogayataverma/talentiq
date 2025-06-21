# TalentIQ - HR Management Dashboard

TalentIQ is a HR Management Dashboard designed to streamline recruitment, employee management, attendance tracking, and leave management.

## Features

- **Authentication:** Secure user registration and login with JWT-based authentication.
- **Recruitment:** Manage candidate information, track application statuses, and schedule interviews.
- **Employee Management:** Maintain a centralized database of employee records, including personal details, position, and department.
- **Attendance Tracking:** Monitor daily attendance, mark employees as present or absent, and view attendance records.
- **Leave Management:** Handle leave requests, approve or reject applications, and view a leave calendar.
- **Interactive Modals:** Add and edit candidates, employees, and leaves through user-friendly modals.
- **Filtering and Search:** Easily search and filter data across all modules for quick access to information.
- **Responsive Design:** A clean and modern UI that is fully responsive and works on all screen sizes.

## Live Demo

[View the live project](https://talent-iq.netlify.app/)

## Video Demo

[Watch the video demo](https://screenrec.com/share/Ttr3vlcIME)

## Tech Stack

- **Frontend:** React, CSS
- **Backend:** Node.js, Express, MongoDB

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- React
- Node.js
- MongoDB

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/yogayataverma/talentiq.git
    cd talentiq
    ```

2.  **Setup the Backend:**
    - Navigate to the `server` directory:
      ```sh
      cd server
      ```
    - Install NPM packages:
      ```sh
      npm install
      ```
    - Create a `.env` file in the `server` directory and add your MongoDB connection string and a JWT secret:
      ```env
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret
      ```
    - Start the backend server:
      ```sh
      npm run dev
      ```
    The server will be running on `http://localhost:5000`.

3.  **Setup the Frontend:**
    - Open a new terminal and navigate to the `client/TalentIQ` directory:
      ```sh
      cd client/TalentIQ
      ```
    - Install NPM packages:
      ```sh
      npm install
      ```
    - Start the frontend development server:
      ```sh
      npm run dev
      ```
    The application will be accessible at `http://localhost:5173`.

## Usage


Once both the frontend and backend servers are running, you can open your browser and navigate to the application. You can register a new user account, log in, and begin exploring the dashboard's features.
