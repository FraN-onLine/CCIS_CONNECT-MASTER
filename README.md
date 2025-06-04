# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## XAMPP
Set up under htdocs, using xampp-control activate Apache and MYSQL
place under folder name CCIS_CONNECT-master strictly, otherwise change fetch() in Login.jsx and Signup.jsx

## BEFORE RUNNING -> 

## MYSQL 
Run this on MYSQL  

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(64) NOT NULL,
    studentID VARCHAR(10) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (  
  id INT AUTO_INCREMENT PRIMARY KEY,  
  username VARCHAR(255) NOT NULL,  
  content TEXT NOT NULL,  
  timestamp DATETIME NOT NULL  
  room VARCHAR(255) NOT NULL DEFAULT 'Dev Circle'  
  user_id int not null  
);  

CREATE TABLE IF NOT EXISTS rooms (  
  id INT AUTO_INCREMENT PRIMARY KEY,  
  name VARCHAR(255) UNIQUE NOT NULL  
);  

CREATE TABLE uploaded_files {  
  id INT AUTO_INCREMENT PRIMARY KEY,  
  filename VARCHAR(255) NOT NULL,  
  originalname VARCHAR(255) NOT NULL,  
  title VARCHAR(255) NOT NULL,  
  user_id INT NOT NULL,  
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP  
);  

CREATE TABLE contacts ( id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100), message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );


## SETUP
-> Change database info in db.php and socketServer.js 
# RUN THESE  
npm run dev  
node src/socketServer.js  
node uploadServer.mjs  

# UPDATED INSTALLED NPM
npm install vite  
npm install express multer  
npm install multer cors mysql  

#IF THIS ERROR OCCUR (SyntaxError: Cannot use import statement outside a module)
- access the package.json then change the type to this -> "type": "module", 

# ADD THIS SH+T FOR EASIER RUNNING
npm install --save-dev concurrently

at package.json add the start:all line
"scripts": {
  "dev": "vite",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "start:all": "concurrently \"npm run dev\" \"node src/ socketServer.js\" \"node uploadServer.mjs\""
},

npm run start:all

## OVERVIEW

# Landing Page
Functionalities
- Login
- Signup
- Contact (Pending)
![image](https://github.com/user-attachments/assets/897ad36e-3829-422d-89f6-abddd4527f1c)
![image](https://github.com/user-attachments/assets/7e935552-4370-4378-82e5-880911df240a)

# Main Page
Functionalities
- Change Username  
- Create/Join Rooms  
- Chat System
  
![image](https://github.com/user-attachments/assets/649c372b-3faf-420a-bae5-787a57e06936)


# Upload Page
Functionalities
- Upload
- Delete
![image](https://github.com/user-attachments/assets/50627af5-0b90-4b53-848e-536990f0c128)
