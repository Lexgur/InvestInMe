# InvestInMe

**InvestInMe** is a crowdfunding platform inspired by GoFundMe, where users can create campaigns, donate to causes, and track fundraising progress. It’s built using **React (Vite)** on the frontend, **Node.js (Express)** for the backend, and **MySQL** as the database.

---

## 📌 Features

- 🧾 User registration and authentication
- 📢 Campaign creation with descriptions, goals, and images
- 💰 Secure donation functionality (faked)
- 📊 Real-time progress tracking for fundraising
- 🧑‍💼 User dashboard for managing campaigns and contributions
- 🔐 Server-side validation and data protection

---

## ⚙️ Tech Stack

| Layer      | Technology        |
|------------|-------------------|
| Frontend   | React + Vite      |
| Backend    | Node.js + Express |
| Database   | MySQL             |
| Styling    | SCSS / Custom CSS |
| Auth       | Express session   |
| Dev Tools  | ESLint, Prettier  |

---

## 🔧 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MySQL
- Git

### Backend Setup ((CURRENTLY THE PROJECT LACKS MIGRATIONS AND SCRIPTS FOR DATABASE CREATIONS BUT IT WILL BE ADDED, only a manual schema.sql exists))

1. Clone the repository:
   ```bash
   git clone https://github.com/Lexgur/InvestInMe
   cd investinme
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Set up your `config` file:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=investinme
   JWT_SECRET=your_jwt_secret
   ```

4. Initialize the database schema:
   ```bash
   mysql -u root -p < schema.sql
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Move to the frontend directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🧪 Linting and Code Quality

This project includes ESLint for code consistency. You can lint your code with:

```bash
npm run lint
```

For a production-grade app, consider using TypeScript with `typescript-eslint`.

---

## 📁 Project Structure

```
investinme/
├── client/              # React frontend (Vite)
│   └── src/
├── server/              # Node.js backend (Express)
│   └── route/
│   └── validation/      # Validation logic seperated
│   └── model/
│   └── middleware/
├── config/            # config for database
├── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and open a pull request with your improvements.

