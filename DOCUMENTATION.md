
# TourMate Egypt Deployment Guide

TourMate Egypt is a fully client-side Single Page Application (SPA) built with React. It doesn't require a backend server for its core functionality, making it very easy to deploy.

You can host this application on any static hosting provider. Here are the steps for a few popular options:

## General Deployment Steps

The core of the deployment process involves serving the `index.html` file and its associated JavaScript bundle (created by a build tool like Vite or Create React App) as a static site. Since this project is provided as standalone `.tsx` files, you would typically use a build tool to compile and bundle them first.

Assuming you have a `dist` or `build` folder after running a build command (`npm run build`), you would upload the contents of that folder to your hosting provider.

### 1. Vercel

Vercel is a zero-configuration deployment platform that is highly recommended for React applications.

1.  **Push to a Git Repository:** Push your project code to a GitHub, GitLab, or Bitbucket repository.
2.  **Import Project in Vercel:** Sign up or log in to your Vercel account. Click "Add New..." -> "Project".
3.  **Connect Your Git Repository:** Vercel will ask you to connect your Git provider. Select the repository you just pushed.
4.  **Configure and Deploy:** Vercel automatically detects that it's a React project (using a tool like Vite). It will pre-fill the build commands.
    *   **Framework Preset:** Should be auto-detected (e.g., Vite).
    *   **Build Command:** `npm run build` or `yarn build`.
    *   **Output Directory:** `dist` or `build`.
5.  **Add Environment Variables:** If the application requires an API key (like for Gemini), you must add it in the "Environment Variables" section of your project settings on Vercel. For this project, a `process.env.API_KEY` is mentioned in the code guidelines, so you would add a variable named `API_KEY` with your actual key.
6.  **Deploy:** Click the "Deploy" button. Vercel will build and deploy your site, providing you with a public URL.

### 2. Netlify

Netlify is another excellent platform for deploying static sites and SPAs.

1.  **Push to a Git Repository:** As with Vercel, your code should be in a Git repository.
2.  **Add New Site:** Log in to your Netlify account and click "Add new site" -> "Import an existing project".
3.  **Connect to Git Provider:** Connect to GitHub, GitLab, or Bitbucket and choose your project's repository.
4.  **Set Build Settings:**
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist` (or `build`)
5.  **Add Environment Variables:** Go to your site's settings -> "Build & deploy" -> "Environment" to add your `API_KEY`.
6.  **Deploy Site:** Click "Deploy site". Netlify will handle the rest.

### 3. GitHub Pages

You can host your site for free directly from your GitHub repository.

1.  **Install `gh-pages`:** Run `npm install gh-pages --save-dev`.
2.  **Update `package.json`:**
    *   Add a `"homepage"` property: `"homepage": "https://<your-username>.github.io/<your-repo-name>"`.
    *   Add deployment scripts:
        ```json
        "scripts": {
          "predeploy": "npm run build",
          "deploy": "gh-pages -d build"
        }
        ```
3.  **Deploy:** Run `npm run deploy`. This will build your app and push the contents of the `build` folder to a special `gh-pages` branch in your repository.
4.  **Configure Repository Settings:** Go to your repository's "Settings" tab, then click on "Pages" in the sidebar. Set the source to the `gh-pages` branch. Your site will be live at the URL specified in the `homepage` property.

### 4. Basic Web Server (e.g., Nginx, Apache)

If you have your own server:

1.  **Build the Project:** Run `npm run build` locally.
2.  **Upload Files:** Copy the contents of the `build` or `dist` directory to your server's web root (e.g., `/var/www/html`).
3.  **Configure Server for SPAs:** You must configure your web server to redirect all routing requests to `index.html`. This allows React Router (if used) to handle the routing on the client side.
    *   **Nginx Example:**
        ```nginx
        server {
          listen 80;
          server_name yourdomain.com;
          root /var/www/html;
          index index.html;

          location / {
            try_files $uri /index.html;
          }
        }
        ```
This ensures that refreshing the page on a deep link (e.g., `yourdomain.com/details/123`) doesn't result in a 404 error from the server.
