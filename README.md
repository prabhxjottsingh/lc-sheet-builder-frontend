# LC Sheet Builder - Frontend

This is the **frontend** of the **LeetCode Custom Sheet Builder**, a React-based web application styled with **Tailwind CSS** and **shadcn**. It allows users to create and manage custom problem sheets, organize problems into categories, and track progress.

---

## Features

- **Authentication**: Login and Signup functionality.
- **Dashboard**: Home page displaying user's sheets analytics.
- **Sheet Management**: Create, edit, and delete custom sheets.
- **Category Management**: Add, edit, and organize categories under sheets.
- **Real-Time Progress**: Mark problems as done and track completion status.
- **Routing**: Handled using `react-router-dom`.

---

## Tech Stack

- **Frontend Framework**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/en/main)
- **State Management**: React Hooks and Context
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Routes Overview

- **/login** : User login page.
- **/signup** : User signup page.
- **/home** : User dashboard.
- **/sheet/:sheetId** : View and manage a specific sheet's details.
- **/notauthorised** : Unauthorized access page.
- **/\*** : Redirects invalid routes to /login.

---

## Config Setup

Set up the backend URL in src/config.js:

```javascript
const config = {
  BACKEND_URL: "http://localhost:<PORT>/", // Change to your backend's running port
};

export default config;
```

## Available Scripts

- **npm run dev**: Runs the frontend in development mode on `PORT: 5173`
