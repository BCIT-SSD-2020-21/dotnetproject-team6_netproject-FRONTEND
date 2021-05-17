# WishBucket

Wishbucket is live at:

https://wishbucket.netlify.app/

Front-End Project associated with WishBucket Back-End Project:  

https://github.com/fatmabadri/WishBucket-Backend

## Setup Guide
All the requirements are located in package.json and can be installed with `npm install`. This is a standard react app that can be run with `npm start`

The application uses node-sass, which seems to have conflicts with some versions of node. If the app doesn't start, `npm uninstall node-sass` followed by `npm install sass` can fix the issue. Node-sass is the version of sass shipped with create-react-app, sass is the dart version of sass.

## Usecase Description

Starting the app brings the user to the landing page, where they will be given an option to login or register. After logging in, the user will  see their dashboard where they can add, remove or update their wishlists. Clicking on a wishlist will bring the user to the wishlist page where they can add, remove or update the items of the wishlist. From there the user can share the wishlist via the share button, or simply by copying the page url.

A wishlist can have a password set. This is not a serious security measure, as the passwords are simply a part of the query url, and their only functionality is to prevent the list from being accidentally discovered by someone the list wasn't meant for.

### API Configuration

The API route used is loaded from the `REACT_APP_BASE_URL` environmental variable. An example .env file was included in the app directory. Simply remove the `_template` extension to use the default azure API server.

In order to self host the API, the backend must be configured and running, and the port provided in the environment has to much the port that the app is set to.

## Figma Wireframe

Figma URL: https://www.figma.com/file/qOWCw5hQsP4Xu5bkBxXUcq/WishBucket?node-id=0%3A1

![WFM](https://i.imgur.com/KQBOscC.jpg)
