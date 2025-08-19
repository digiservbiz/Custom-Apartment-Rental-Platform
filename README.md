# Custom Apartment Rental Platform

This project is a web-based apartment rental platform connecting apartment owners, agents, and renters in a coastal city. The system aims to streamline apartment listing, availability checks via WhatsApp, booking, payments with commission fees, manual KYC for owners and agents, and moderated renter reviews.

## Key Features

### User Roles & Authentication
- **Owners and Agents:** Must complete manual KYC verification before managing apartments.
- **Renters:** Can register and log in using a traditional email/password combination or via social providers like Google and Facebook.
- Role-based access control for Owners, Agents, Renters, and Admin.

### Apartment Listings
- Owners/Agents can create, edit, and delete apartments.
- Apartments include location, photos, price per night/day, max guests, and description.
- Only one manager per apartment (owner or agent) at a time.
- Apartment status: Available, Rented, Pending Confirmation.

### WhatsApp Availability Check (Simulated)
- The system sends individual WhatsApp messages to owners/agents per apartment to ask for availability when renters search.
- Owners/agents reply with "Yes [ApartmentID]" or "No [ApartmentID]".
- The system parses replies to update apartment availability.
- If no reply is received within a specified time window, the status is set to "Pending Confirmation".

### Booking & Payment (Simulated)
- Renters can book apartments directly online.
- Support for multiple payment methods, including offline options.
- Payments trigger a commission fee deduction (editable by the admin).
- Booking status updates based on payment completion.
- Apartments are marked as unavailable once booked.

### Notifications (Simulated)
- Send booking confirmations and updates via email and WhatsApp to renters and owners/agents.

### Reviews
- Renters can submit reviews after their stays.
- Reviews require admin moderation before public display.

### Admin Panel
- Manage users, apartments, bookings, KYC approvals, commissions, and reviews.
- View reports and manage the commission fee percentage.

## Technical Stack

- **Backend:** Node.js, Express, Mongoose
- **Frontend:** React, React Router, Bootstrap
- **Database:** MongoDB (or any other NoSQL/SQL database)
- **Authentication:** JWT

## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- MongoDB

### Installation
1. Clone the repository.
2. Install backend dependencies: `npm install`
3. Navigate to the client directory and install frontend dependencies: `cd client && npm install`
4. Create a `.env` file in the root directory by copying the example: `cp .env.example .env`. Then, add your values for the following variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secret for signing JWTs
   - `JWT_EXPIRE`: JWT expiration time (e.g., `30d`)
   - `JWT_COOKIE_EXPIRE`: JWT cookie expiration time (in days)
   - `CLIENT_URL`: The base URL of your frontend application (e.g., `http://localhost:3000`), used for OAuth redirects.
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID.
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret.
   - `FACEBOOK_APP_ID`: Your Facebook App ID.
   - `FACEBOOK_APP_SECRET`: Your Facebook App Secret.

### Running the Application
- To start the backend server: `npm run dev` (or `npm start`)
- To start the frontend development server: `cd client && npm start`

## API Endpoints

### Auth
- `POST /api/v1/auth/register`: Register a new user.
- `POST /api/v1/auth/login`: Login a user.
- `GET /api/v1/auth/me`: Get the logged in user.

### Apartments
- `GET /api/v1/apartments`: Get all apartments.
- `GET /api/v1/apartments/:id`: Get a single apartment.
- `POST /api/v1/apartments`: Create a new apartment.
- `PUT /api/v1/apartments/:id`: Update an apartment.
- `DELETE /api/v1/apartments/:id`: Delete an apartment.
- `POST /api/v1/apartments/:id/check-availability`: Check apartment availability.
- `GET /api/v1/apartments/myapartments`: Get apartments for the logged in user.

### Bookings
- `GET /api/v1/bookings`: Get all bookings (admin).
- `POST /api/v1/bookings`: Create a new booking.
- `GET /api/v1/bookings/mybookings`: Get bookings for the logged in user.
- `GET /api/v1/bookings/:id`: Get a single booking.

### Reviews
- `GET /api/v1/reviews`: Get all reviews.
- `GET /api/v1/apartments/:apartmentId/reviews`: Get all reviews for an apartment.
- `POST /api/v1/reviews`: Create a new review.
- `GET /api/v1/reviews/:id`: Get a single review.
- `PUT /api/v1/reviews/:id`: Update a review.
- `DELETE /api/v1/reviews/:id`: Delete a review.

### Users (Admin)
- `GET /api/v1/users`: Get all users.
- `GET /api/v1/users/:id`: Get a single user.
- `PUT /api/v1/users/:id`: Update a user.
- `DELETE /api/v1/users/:id`: Delete a user.
- `PUT /api/v1/users/:id/updatestatus`: Update a user's KYC status.

### WhatsApp (Simulated)
- `POST /api/v1/whatsapp/webhook`: Webhook for incoming WhatsApp messages.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.
