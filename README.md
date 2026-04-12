# ⌚ WatchStore – Full Stack E-Commerce Platform

WatchStore is a modern full-stack e-commerce web application built using the **MERN stack**. It allows users to browse premium watches, manage their cart, and place orders, while providing an admin panel for managing products and orders.

---

## 🎥 Demo Video

👉 [Watch Demo](https://github.com/user-attachments/assets/374b123f-6785-46f9-b168-296177562aca)

---

## 🚀 Features

### 🛍️ User Features

* Browse a wide collection of watches
* Search and filter products
* Secure user registration and login
* Add items to cart (with sidebar cart UI)
* Place orders using integrated payment system
* View order history

### 🛠️ Admin Features

* Admin login (uses the same login form as regular users). To access admin features, update the user's role to "admin" in the database.
* Add, edit, and delete watches
* Manage product inventory
* View and manage customer orders
* Dedicated `/admin` dashboard

---

## 🧱 Tech Stack

| Layer            | Technology                      |
| ---------------- | ------------------------------- |
| Frontend         | React + Material UI (MUI)       |
| Backend          | Node.js + Express.js            |
| Database         | MongoDB + Mongoose              |
| Authentication   | bcryptjs + JSON Web Token (JWT) |
| State Management | React Context API               |
| Styling          | MUI + Custom CSS                |

---

## 📸 Screenshots

### 🏠 Home Page
![Home](https://github.com/user-attachments/assets/00005be0-9361-4c46-8210-2f0711e91944)

### 🔐 Login Page
![Login](https://github.com/user-attachments/assets/727e9655-5716-41ef-acac-d6aea6fdb90b)

### 🛍️ Product Page
![Product](https://github.com/user-attachments/assets/e7255789-32b8-47d1-871e-713deb6104d9)

### 🛒 Cart Page
![Cart](https://github.com/user-attachments/assets/6cbf629d-64a6-4bdd-9a48-b101b0c43675)

### 💳 Khalti Payment Integration  
![Khalti](https://github.com/user-attachments/assets/368d9c3b-12bd-46df-aca6-81db5eaf5b47)

### ✅ Payment Success
![Success](https://github.com/user-attachments/assets/473583e7-a07c-4cff-96f5-15250a77873e)

### ⚙️ Admin Dashboard
![Admin](https://github.com/user-attachments/assets/dbd23418-1a13-4123-9c4a-09f989043eeb)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Abhishekshak/watchstore.git
cd watchstore
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm start
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file inside the **backend** folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
KHALTI_SECRET_KEY=your_khalti_secret_key
```

---

## 📂 Project Structure

```
watchstore/
│── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
│
│── frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── App.jsx
│
│── README.md
```

---

## 💳 Payment Integration

* Integrated with Khalti payment gateway
* Orders are automatically saved after successful payment
* Users can track orders in “My Orders” section

---

## 🔒 Authentication

* Secure password hashing using bcryptjs
* JWT-based authentication
* Role-based access (User/Admin)

---

## ✨ Future Improvements

* Wishlist functionality
* Product reviews and ratings
* Advanced filtering and sorting
* Email notifications for orders
* Performance optimization

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed by **Abhishek Shakya**

---

⭐ If you like this project, don’t forget to give it a star!
