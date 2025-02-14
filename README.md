# Node.js AWS S3 File Upload & Streaming API

This is a Node.js application that provides an API for user authentication, uploading files to AWS S3, streaming media files, and managing media. The application is built using Express.js and integrates with AWS S3 for file storage and streaming.

## Features

- **User Authentication**: Register and login endpoints for user management.
- **File Upload**: Upload files (video/audio) to AWS S3.
- **Media Streaming**: Stream media files directly from AWS S3 with support for range requests.
- **Media Management**: Fetch all uploaded media files or a specific file by its ID.

## API Documentation

The API is documented using Swagger. You can access the API documentation here:  
[Swagger API Docs](https://clinikk-project-production.up.railway.app/api/v1/api-docs/#/)

## Live Deployment

- **Frontend**: [Clinikk Frontend Demo](https://clinikk-frontend-demo.vercel.app/)  
- **Backend Server**: [Clinikk Backend Server](https://clinikk-project-production.up.railway.app)

## API Endpoints



### Authentication

- **POST `/api/v1/auth/register`**: Register a new user.
- **POST `/api/v1/auth/login`**: Authenticate a user and return a JWT token.

### File Upload

- **POST `/api/v1/upload`**: Upload a file to AWS S3. Requires a valid JWT token.

### Media Streaming

- **GET `/api/v1/stream/{key}`**: Stream a file from AWS S3. Supports range requests for partial content streaming.

### Media Management

- **GET `/api/v1/media`**: Fetch all uploaded media files.
- **GET `/api/v1/media/{id}`**: Fetch a specific media file by its ID.

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (Node Package Manager)
- AWS S3 bucket with appropriate permissions
- MongoDB (for user and media metadata storage)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/harshitnitjsr/clinikk-project.git
   cd clinikk-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/your-database-name
   AWS_S3_ACCESS_KEY_ID=your-aws-access-key-id
   AWS_S3_SECRET_ACCESS_KEY=your-aws-secret-access-key
   AWS_S3_REGION=your-aws-region
   AWS_S3_BUCKET_NAME=your-s3-bucket-name
   PREURL=https://your-s3-bucket-url.com
   JWT_SECRET=your-jwt-secret-key
   ```

4. Start the server:
   ```bash
   npm start
   ```

The application will be running on `http://localhost:5000`.

## API Usage

### Register a New User

**Endpoint**: `POST /api/v1/auth/register`

### User Login

**Endpoint**: `POST /api/v1/auth/login`

### Upload a File to S3

**Endpoint**: `POST /api/v1/upload`

**Headers**:
- `Authorization: Bearer <your-jwt-token>`

**Form Data**:
- `file`: The file to upload (supports video and audio files).

### Stream a File from S3

**Endpoint**: `GET /api/v1/stream/{key}`

**Parameters**:
- `key`: The key (filename) of the file stored in S3.

**Headers** (optional):
- `Range`: The byte range for partial content streaming.

### Fetch All Media Files

**Endpoint**: `GET /api/v1/media`

### Fetch Media File by ID

**Endpoint**: `GET /api/v1/media/{id}`

**Parameters**:
- `id`: The ID of the media file.
