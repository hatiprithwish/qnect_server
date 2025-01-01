# Qnect Server

Qnect Server is a Node.js application designed for managing flowcharts. It uses Express.js for the server framework, Prisma for database management, and TypeScript for type safety.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/hatiprithwish/qnect-server.git
   cd qnect-server
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up the environment variables:

   ```sh
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration.

5. Run the Prisma migrations:
   ```sh
   npx prisma migrate dev
   ```

## Usage

### Development

To start the server in development mode:

```sh
npm run dev
```

### Production

To build and start the server in production mode:

```sh
npm run dist
npm start
```

## API Endpoints

### Health Check

- **GET** `/api/v1/health`
- **GET** `/api/v1/health/system`
- **GET** `/api/v1/health/application`

### FlowChart

- **GET** `/api/v1/flow?id=<flowId>`
- **POST** `/api/v1/flow`

## Environment Variables

- `ENV`: The environment in which the app is running (development, production, etc.)
- `PORT`: The port on which the server will run
- `SERVER_URL`: The URL of the server
- `DATABASE_URL`: The connection string for the database

## Scripts

- `npm run dev`: Start the server in development mode
- `npm run dist`: Compile TypeScript to JavaScript
- `npm start`: Start the server in production mode
- `npm run lint`: Run ESLint
- `npm run format:check`: Check code formatting with Prettier
- `npm run format:fix`: Fix code formatting with Prettier

## License

This project is licensed under the MIT License.
