 # CSE Motors - Vehicle Inventory Management System

A full-stack web application for managing vehicle inventory with user authentication and role-based authorization.

## Features

- User registration and authentication
- JWT-based session management
- Role-based access control (Client, Employee, Admin)
- Account management (update profile, change password)
- Inventory management (for authorized users)
- Secure password hashing with bcrypt
- Server-side and client-side validation

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Template Engine:** EJS
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcrypt, express-validator
- **Styling:** Custom CSS

## Installation

1. Clone the repository:
```bash
   git clone https://github.com/yourusername/cse-motors.git
   cd cse-motors
```

2. Install dependencies:
```bash
   npm install
```

3. Set up environment variables in `.env`:
```
   DATABASE_URL=your_postgresql_connection_string
   ACCESS_TOKEN_SECRET=your_secret_token_here
   SESSION_SECRET=your_session_secret_here
   PORT=5500
```

4. Run the application:
```bash
   npm start
```

## Deployment

Deployed on Render.com: [Your Production URL]

## Author

Your Name - [Your GitHub Profile]

## License

ISC