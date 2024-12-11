# Railway Management System like IRCTC

## REST APIs for railway ticket booking system built with Node.js, Express, and MySQL and hosted on google cloud run and google cloud sql. This system handles concurrent bookings, user authentication, and admin operations securely.

URL - https://irctc-tickets-314787054684.asia-south1.run.app/ deployed on google cloud and DB on google cloud SQL
## Project Setup

1. Clone the Repository - git clone <repository-url>
2. Install Dependencies - npm install
3. Database Setup - DB is hosted on Google Cloud SQL and the credentials are stored in the `.env` file . sharing credentials for this assignment ony
Bookings Table-![image](https://github.com/user-attachments/assets/104d2644-a438-4319-afbe-fb3b299013ac)
Trains Table - ![image](https://github.com/user-attachments/assets/4b4dc7fd-ffb4-4999-9e3c-33a71ba5fefc)

   DB SCHEMA -
   CREATE TABLE users (
   id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   email VARCHAR(255) NOT NULL UNIQUE,
   password VARCHAR(255) NOT NULL,
   role ENUM('user', 'admin') NOT NULL
   );

CREATE TABLE trains (
id INT AUTO_INCREMENT PRIMARY KEY,
train_number VARCHAR(50) NOT NULL,
train_name VARCHAR(255) NOT NULL,
source_station VARCHAR(255) NOT NULL,
destination_station VARCHAR(255) NOT NULL,
total_seats INT NOT NULL,
train_date DATE NOT NULL,
UNIQUE(train_number, train_date)
);

CREATE TABLE bookings (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
train_id INT NOT NULL,
booking_date DATE NOT NULL,
seat_number INT NOT NULL,
status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
FOREIGN KEY (user_id) REFERENCES users(id),
FOREIGN KEY (train_id) REFERENCES trains(id)
);

4. ENV -Create a `.env` file in the root directory:
   I Have pushed the `.env` file to the repository for this assignment only.

env
DB_HOST=35.200.175.155  

DB_USER=root  

DB_PASSWORD= UHUWGHBEUYBEYU@@*@*U&^%$*U*&^%$*&^%$*&^%$fa56615123

DB_NAME=irctc_db  

JWT_SECRET=duiandihguhgueg78h832y8273huh82h89h422dewjiuhfuh873h7G87Girctcdb
duiandihguhgueg78h832y8273huh82h89h42DEEEDDfuh873h7G87G783g87g378783g87g37irctcdbduiandihguhgueg78h832y8273huh82h89h422dewjiuhfuh873h7G87G783g87g3788&&^%$Tirctcdb
duiandihguhgueg78h832y8273huh82h89h422dewjiuhfuh873h7G87G783g87g378&@T&*@T*&^%$GHGdjuh*&H*&H&^%$*UG*&BUIB*U&^%$@@CCE*&^%$G*&G*GG&^%$F*H&^%$*&^%$GBUIGH*UH&^%$D@G&GDDDDDDDDDDDDDDDDDD&^%$
duiandihguhgueg78h832y8273huh82h89h422dewjiuhfuh873h7G87Girctcdb
duiandihguhgueg78h832y8273huh82h89h42DEEEDDfuh873h7G87G783g87g378783g87g37irctcdbduiandihguhgueg78h832y8273huh82h89h422dewjiuhfuh873h7G87G783g87g3788&&^%$Tirctc  

ADMIN_API_KEY=ndiahnuihd983h89hu7g9G*&G8*HF*djIHSD*@HHIFJHH  

PORT=3000  

ALLOWED_ORIGINS= * 

5. Running the Application - npm start

## API Endpoints

POST /api/auth/register
- Register new user
- Body: { name, email, password }

POST /api/auth/login
- Login user
- Body: { email, password }
- Returns: JWT token


Train Routes

POST /api/trains/add (Admin only)

- Add new train
- Headers: X-API-KEY
- Body: { trainNumber, trainName, sourceStation, destinationStation, totalSeats, trainDate }

GET /api/trains/availability

- Check train availability
- Query: { sourceStation, destinationStation }


### Booking Routes

POST /api/bookings/book (Auth required)

- Book a seat
- Headers: Authorization: Bearer <token>
- Body: { trainId, bookingDate }

GET /api/bookings/:bookingId (Auth required)

- Get booking details
- Headers: Authorization: Bearer <token>

## for testing the concurrent booking i have made the testconcurrent.js file

## Assumptions & Limitations

1. Booking System

   - One user can make multiple bookings
   - Seat numbers are assigned sequentially
   - Bookings are date-specific
   - No waiting list functionality

2. Authentication

   - Tokens do not expire
   - No refresh token mechanism

3. Train Management
   - Simple route system (direct routes only)
   - Fixed seat capacity
   - Trains are only available on a particular date ie 2024-12-15

