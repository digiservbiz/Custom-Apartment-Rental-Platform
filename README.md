# Custom Apartment Rental Platform

This project is a web-based apartment rental platform connecting apartment owners, agents, and renters in a coastal city. The system aims to streamline apartment listing, availability checks via WhatsApp, booking, payments with commission fees, manual KYC for owners and agents, and moderated renter reviews.

## Key Features

### User Roles & Authentication
- **Owners and Agents:** Must complete manual KYC verification before managing apartments.
- **Renters:** Can register/login using email/password, Google, or Facebook.
- Role-based access control for Owners, Agents, Renters, and Admin.

### Apartment Listings
- Owners/Agents can create, edit, and delete apartments.
- Apartments include location, photos, price per night/day, max guests, and description.
- Only one manager per apartment (owner or agent) at a time.
- Apartment status: Available, Rented, Pending Confirmation.

### WhatsApp Availability Check
- The system sends individual WhatsApp messages to owners/agents per apartment to ask for availability when renters search.
- Owners/agents reply with "Yes [ApartmentID]" or "No [ApartmentID]".
- The system parses replies to update apartment availability.
- If no reply is received within a specified time window, the status is set to "Pending Confirmation".

### Booking & Payment
- Renters can book apartments directly online.
- Support for multiple payment methods, including offline options.
- Payments trigger a commission fee deduction (editable by the admin).
- Booking status updates based on payment completion.
- Apartments are marked as unavailable once booked.

### Notifications
- Send booking confirmations and updates via email and WhatsApp to renters and owners/agents.

### Reviews
- Renters can submit reviews after their stays.
- Reviews require admin moderation before being displayed publicly.

### Admin Panel
- Manage users, apartments, bookings, KYC approvals, commissions, and reviews.
- View reports and manage the commission fee percentage.

## Technical Requirements

- **Backend:** RESTful API using Node.js/Express.
- **Database:** PostgreSQL or MySQL.
- **Frontend:** React for a responsive UI.
- **Authentication:** JWT with role-based access control.
- **WhatsApp Integration:** Use WhatsApp Business API or Twilio API to send/receive availability queries.
- **Payments:** Integrate Stripe or PayPal with commission handling.
- **Notifications:** Email (SendGrid/Mailgun) and WhatsApp.
- **Security:** Secure KYC document upload and storage, and data protection best practices.

## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- PostgreSQL or MySQL

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/custom-apartment-rental-platform.git
   ```
2. Navigate to the project directory:
   ```bash
   cd custom-apartment-rental-platform
   ```
3. Install backend dependencies:
   ```bash
   npm install
   ```
4. Navigate to the client directory and install frontend dependencies:
   ```bash
   cd client
   npm install
   ```
5. Set up your environment variables by creating a `.env` file in the root directory.

### Running the Application
- To start the backend server: `npm start`
- To start the frontend development server: `cd client && npm start`

## API Endpoints

(To be documented as the API is developed)

## Deployment

(Instructions to be added)

## Contributing

(Guidelines for contributing to the project)

## License

This project is licensed under the MIT License.
