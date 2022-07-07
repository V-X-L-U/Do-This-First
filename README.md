# DoThisFirst

## Introduction

Most of us have things to do every day. Sometimes, these tasks must be done in a certain order. **DoThisFirst** is a to-do app that supports dependent tasks i.e., tasks that need other tasks to be first completed.

## Further Documentation

[Project Documentation Google Docs](https://docs.google.com/document/d/1SXuCGoUGgN0KadoT6Q1XHq5v6ZC8O7XNdrtJbr79Fl8/edit?usp=sharing)

The project documentation contains:

- project timeline
- meeting recaps
- feature documentation
- API documentation

[UI Designs on Figma](https://www.figma.com/file/ww9P8ZKl5E3MXRU1YkCszf/DoThisFirst-UI-Designs?node-id=0%3A1)

## Installation

1. Clone the repository

   ```sh
   git clone https://github.com/V-X-L-U/Do-This-First.git
   ```

2. Install dependencies (make sure you are the root of the repository)

   ```sh
   cd frontend
   yarn install
   cd ../backend
   yarn install
   ```

## Running the App (development)

1. Request and add the `.env` to the `backend/` route.
2. Run the server (make sure you are at the root of the repository)

   ```sh
   cd backend
   yarn start
   cd ..
   ```

3. Run the client (make sure you are at the root of the repository)

   ```sh
   cd frontend
   yarn start
   ```

4. The client and server should run on port `3000` and `5000` respectively.
