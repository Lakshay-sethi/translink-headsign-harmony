# TransLink Bus Tracker

## Project Overview

**Live Demo**: [TransLink Bus Tracker](https://translink-tracker.vercel.app/)

This project is a real-time bus tracking application that visualizes Vancouver's TransLink bus service using GTFS (General Transit Feed Specification) data. The application allows users to:

- Track the current location of buses in real-time
- View bus route paths and stations
- Verify headsigns used for different routes
- Explore route information on an interactive map

This project was created in part using Lovable AI.

## Technical Implementation

The application is built using modern web technologies and implements the following features:

- **GTFS Integration**: Utilizes TransLink's GTFS feed to fetch real-time bus location data
- **Real-time Updates**: Implements periodic polling to update bus locations
- **Interactive Map**: Uses Leaflet for route visualization
- **Local Development**: Custom proxy server for API testing
- **Production Deployment**: Serverless functions on Vercel for API handling

### Technology Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (for data storage)
- Leaflet (for maps)
- Vercel (for deployment)

### Testing locally using your IDE

If you want to work locally using your own IDE, follow these steps:

1. **Prerequisites**:

   - Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

2. **Setup**:

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start the development server
npm run dev
```

### Local API Testing

The project includes a proxy server for local API testing. This allows you to:

- Test API endpoints locally
- Avoid CORS issues during development
- Simulate production API behavior

#### Activating the Proxy Server

To activate the proxy server locally:

1. Ensure you have the required dependencies installed:

   ```sh
   npm install
   ```

2. Create a `.env` file in the project root and add your TransLink API key:

   ```
   TRANSLINK_API_KEY=<YOUR_API_KEY>
   ```

3. Start the proxy server:

   ```sh
   node proxy-server.js
   ```

4. The proxy server will run at:
   ```
   http://localhost:3001
   ```

### Production API

In production, the application uses Vercel serverless functions to handle API requests, providing:

- Secure API key management
- Efficient request handling
- Automatic scaling

## License

This project is open-source and available under the MIT license.
