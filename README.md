# carestack
# Connectify 
Connectify is a Social Network web app that allows users to signup, create accounts, search and add friends, view mutual friends, and post images with text content.

# Front-End
React is used for developing the front-end of the web-app as is required. For CSS, I have used Tailwind.css as it makes designing webpages drastically faster.
Context Api has been used in certain areas for State management as it helps to prevent prop drilling which can be quite troublesome. The files have been refactored to certain extent. I have also added comments above most functions to reduce complexity and increase readablitiy of code.

# Back-End 
Firebase has been used for all backend purposes as it is suitable for large scale applications and is relatively easier to setup compared to other backend frameworks and servers. Firebase Authentication has been used with Email and Password as the option for registration and login and ensures better safety of users.
Firebase cloud storage is used to upload and download images as per requirement. Cloud Firestore is the database being used for this web app as it is easily scalable and suited for large-scale development with ease.


<!-- GETTING STARTED -->
# Getting Started
## Dependencies

* react: 18.2.0
* react-dom : 18.2.0
* firebase : 9.17.2
* react-router-dom : 6.9.0
* tailwindcss : 3.2.7
## Installation

1. Clone the repo
   ```sh
   git clone -b posts https://github.com/shreyas0512/carestack
   ```
2. Install NPM packages
   ```sh
   npm i
   ```
3. Start the Development Server
   ```sh
   npm run dev
   ```
