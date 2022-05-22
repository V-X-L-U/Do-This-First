# DoThisFirst

## Introduction

Most of us have things to do every day. Sometimes, these tasks must be done in a certain order. **DoThisFirst** is a to-do app that supports dependent tasks i.e., tasks that need other tasks to be first completed.

## Installation

1. Clone the repository

    ``` sh
    git clone https://github.com/V-X-L-U/Do-This-First.git
    ```

2. Install dependencies (make sure you are the root of the repository)

    ``` sh
    cd frontend
    yarn install
    cd ../backend
    yarn install
    ```

## Running the App

1. Run the server (make sure you are at the root of the repository)

    ``` sh
    cd backend
    yarn start
    ```
Note (for developers): In addition, please provide your IP to be whitelisted on Mongo. Otherwise, your client will refuse to connect.

2. Run the client (make sure you are at the root of the repository)

    ``` sh
    cd frontend
    yarn start
    ```

3. The client and server should run on port `3000` and `5000` respectively.
