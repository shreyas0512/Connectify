# CareStack

## Problem Statement
Create a mini social network. The application should have features like:-
* Users should be able to sign up/sign in, and create a profile for themselves.
* Search for other users.
* View other users' profiles & make them friends/unfriend them.
*  View a list of mutual friends between users. A mutual friend is a user who is a friend of two other users who may or may not know each other. 

# Connectify 
Connectify is a Social Network web app that allows users to signup, create accounts, search and add friends, view mutual friends, and post images with text content.

# Front-End
React is used for developing the front-end of the web-app as is required. For CSS, I have used Tailwind.css as it makes designing webpages drastically faster.
Context Api has been used in certain areas for State management as it helps to prevent prop drilling which can be quite troublesome. The files have been refactored to certain extent. I have also added comments above most functions to reduce complexity and increase readablitiy of code.

# Back-End 
Firebase has been used for all backend purposes as it is suitable for large scale applications and is relatively easier to setup compared to other backend frameworks and servers. Firebase Authentication has been used with Email and Password as the option for registration and login and ensures better safety of users.
Firebase cloud storage is used to upload and download images as per requirement. Cloud Firestore is the database being used for this web app as it is easily scalable and suited for large-scale development with ease.

# Features
The following features including the task features as well as 2 additional features have been implemented as of now
* Sign Up and Log In have been setup using Firebase Authentication after which users can create a profile for themselves.
* Searching for friends based on Name and viewing their profile and adding them by sending a friend request has been implemented.
* Shows mutual friends with any other user upon viewing their profile and shows users own list of friends when viewing own account.

## Additional Features
* Users can post images with text content and other users can view their friends posts.
* A friend recommender system has been implemented which shows the friends of our original friends with whom we have mutual connections.

# Hosted Link
https://carestack-39d4e.web.app/

# Video Demo
https://user-images.githubusercontent.com/76905421/226203563-4dab77ac-fc2e-47b0-8f6d-1149af5f2085.mp4




https://www.loom.com/share/325e01522681439bad2d7c2ea890d7da

# App Preview
![1-cs](https://user-images.githubusercontent.com/76905421/226198015-a0771c7e-8cf4-40df-9607-5d5b8c2c6ced.png)
![2-cs](https://user-images.githubusercontent.com/76905421/226198018-c998f90a-3a4c-479b-aec7-e76fc421f980.png)
![3-cs](https://user-images.githubusercontent.com/76905421/226198023-b683630d-1c4a-4530-8753-b59faa5c2033.png)
![4-cs](https://user-images.githubusercontent.com/76905421/226198027-f462f2dc-6f86-4b77-a501-884c16d10845.png)
![5-cs](https://user-images.githubusercontent.com/76905421/226198030-db6dd4c4-698e-4a40-a190-427a8b9c6532.png)
![Screenshot (1116)](https://user-images.githubusercontent.com/76905421/226199647-be56bc9b-7489-4e70-843e-9c8cf6c96380.png)
![Screenshot (1117)](https://user-images.githubusercontent.com/76905421/226199655-976de073-4c48-49a4-8a1c-8d319cb0c039.png)





<!-- GETTING STARTED -->
## To run on local machine
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
   
# Issues and Future Scope
* Currently certain error messages haven't been displayed which I plan on implementing very soon. As of now user has to check console for authentication issues etc.
* Edit profile feature hasnt been implemented. 
* Loading animations or skeletons can be implented for loading while user waits.
* Lack of responsiveness and issues with certain UI elements.


