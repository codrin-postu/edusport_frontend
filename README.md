# Frontend - Next.js App

This is the frontend of the project, built with Next.js and Dockerized for local development.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- Node.js v24.6 (optional if using Docker only)

## Setup and Run Locally

1. **Clone the repository:**
    ```bash
    git clone <frontend-repo-url>
    cd frontend
    ```

2. **Build and start the Docker container:**
    ```bash
    docker-compose up --build
    ```

3. **Open your browser:**
    ```
    http://localhost:3000
    ```
4. **Stop the container:**
    ```bash
    docker-compose down
    ```

## Notes

- The frontend runs in development mode (`npm run dev`) inside Docker.
- Code changes are reflected automatically due to volume mounting.
