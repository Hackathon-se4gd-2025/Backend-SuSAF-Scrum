# 📌 SuSAF Scrum API

## 📖 Overview
This API manages **Projects, Sprints, and Items** in a Scrum-based workflow.

---

## 🔹 Project Endpoints (`/projects`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/projects` | Create a new project |
| **GET** | `/projects` | Retrieve all projects |
| **GET** | `/projects/:id` | Retrieve a project by ID |
| **PUT** | `/projects/:id` | Update a project |
| **DELETE** | `/projects/:id` | Delete a project |
| **GET** | `/projects/:id/items` | Retrieve all **items** within a project |
| **GET** | `/projects/:id/sprints` | Retrieve all **sprints** within a project |

---

## 🔹 Sprint Endpoints (`/sprints`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/sprints` | Create a new sprint |
| **GET** | `/sprints` | Retrieve all sprints |
| **GET** | `/sprints/:id` | Retrieve a sprint by ID |
| **PUT** | `/sprints/:id` | Update a sprint |
| **DELETE** | `/sprints/:id` | Delete a sprint |
| **GET** | `/sprints/:id/items` | Retrieve all **items** within a sprint |

---

## 🔹 Item Endpoints (`/items`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/items` | Create a new item |
| **GET** | `/items` | Retrieve all items |
| **GET** | `/items/:id` | Retrieve an item by ID |
| **PUT** | `/items/:id` | Update an item |
| **DELETE** | `/items/:id` | Delete an item |

---

## 🚀 Getting Started

### 🛠 Install Dependencies
Run the following command to install required dependencies:
```sh
npm install

### 🛠 run the project
npm run start