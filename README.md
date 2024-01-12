# Poll

Ask people to vote on single-choice/multiple-choice options.

## Setup

Create a `.env.local` file to override the default configuration given in `.env`.
Take note of the port you specify for the express server, you will need it both for development and deployment.

Run `npm install` in the main directory to install all packages for both server and client.

## Development

Run `npm run dev` in the main directory to start server and client in watch mode.
Access the frontend via the server URL `localhost:{{EXPRESS_PORT}}` which serves as proxy for the vue-cli dev-server.

## Deployment

### Docker

Deploy the docker image defined in [`Dockerfile`](Dockerfile).
Remember to set the environment variable `MONITOR_PASSWORD` to a secure password.
The image exposes the express server on port 2567.

## Server monitoring

The server exposes the [Colyseus Monitoring Panel](https://docs.colyseus.io/tools/monitor/) under `URL:PORT/colyseus`.
Use `admin` and your local `MONITOR_PASSWORD` to login.
