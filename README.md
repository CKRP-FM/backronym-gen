# Juno Project 4: Backronym Generator

**View live site [here](https://backronymgen.netlify.app/).**

## Overview

Backronym Generator is a web application that allows users to create a ‘backronym’ from an initial chosen word. A backronym is an acronym deliberately formed from a phrase whose initial letters spell out a particular word or words, either to create a memorable name or as a fanciful explanation of a word’s origin (i.e. “Biodiversity Serving Our Nation, or BISON”). The application also allows users to view the frequency of a given word over the course of history using the Google Ngram API and Chart JS.

## Features

- User authentication with Firebase and session persistence (user stays logged in if same session)
- Protected routes to redirect user to login page if they are not logged in
- Anonymous login (demo mode)
- Error page (for any path without another route)
- CRUD (Create, Read, Update, Delete) functionalities for saved words
- Display gallery board featuring all saved words, users can only delete their own posts
- Firebase Realtime Database to store saved backronyms and user account information
- Ability to 'like' saved backronyms, using local storage to prevent the feature from being spammed (user can only like a specific word once when on the same page and same session)
- Axios API calls to draw data from Datamuse API and Google Ngram API (Datamuse API is used to generate random words and suggest words that typically follow previous ones, Google Ngram is used to visualize the frequency of a given word)
- Ngram page allows users to search for the frequency of a saved backronym or any other word/phrase and visualize it with Chart.js
- Profanity filtering using PurgoMalum RESTful API
- Loading states for API calls
- Screen reader specific labels for better accessibility
- Responsive down to 320px / mobile friendly design
- Animations to improve user experience (e.g. liked filled heart)

## Technologies Used

- React (Router, useState, useEffect, useContext, useRef, props, components, pages)
- Firebase (User Authentication, Realtime Database)
- Data drawn from Datamuse API, Google Ngram API, PurgoMalum API
- Chart.js
- HTML
- Sass

## Possible improvements

- Unlike functionality
- Prevent the user from liking the same word twice in profile page and in gallery page
- Refine the word choices suggested
- Ability to display multiple words/phrases on the ngram chart at once
- Convert graph data to % values
- Ability for user to reset their passwords
- Ability for user to set private/ public saved backronyms
- Autocomplete on user input search field

## Preview

![Screenshot of the backronym generator app](./assets/screenshots/home.jpg 'Home Page')
![Screenshot of the backronym generator app](./assets/screenshots/gallery.jpg 'Gallery Page')
![Screenshot of the backronym generator app](./assets/screenshots/ngram-page.jpg 'Ngram Page')
![Screenshot of the backronym generator app](./assets/screenshots/profile.jpg 'Profile Page')
![Screenshot of the backronym generator app](./assets/screenshots/login.jpg 'Login Page')
![Screenshot of the backronym generator app](./assets/screenshots/error.jpg 'Error Page')
