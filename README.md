&lt;div class=&quot;hero-icon&quot; align=&quot;center&quot;&gt;
  &lt;img src=&quot;https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg&quot; width=&quot;100&quot; /&gt;
&lt;/div&gt;

&lt;h1 align=&quot;center&quot;&gt;
Quick Commerce MVP Platform
&lt;/h1&gt;
&lt;h4 align=&quot;center&quot;&gt;A hyperlocal quick commerce platform connecting local stores with customers for ultra-fast delivery.&lt;/h4&gt;
&lt;h4 align=&quot;center&quot;&gt;Developed with the software and tools below.&lt;/h4&gt;
&lt;div class=&quot;badges&quot; align=&quot;center&quot;&gt;
  &lt;img src=&quot;https://img.shields.io/badge/Framework-React_v19.1-blue&quot; alt=&quot;React v19.1&quot;&gt;
  &lt;img src=&quot;https://img.shields.io/badge/UI_Library-Mantine_v7.17-blueviolet&quot; alt=&quot;Mantine v7.17&quot;&gt;
  &lt;img src=&quot;https://img.shields.io/badge/Frontend-Vite_v6.2,_React_Router_v7.5,_Axios_v1.8-red&quot; alt=&quot;Frontend Stack&quot;&gt;
  &lt;img src=&quot;https://img.shields.io/badge/Backend-Node.js_v20+,_Express_v4.18-339933&quot; alt=&quot;Backend Stack&quot;&gt;
  &lt;img src=&quot;https://img.shields.io/badge/Database-MongoDB_(Mongoose_v8.13)-4DB33D&quot; alt=&quot;Database&quot;&gt;
&lt;/div&gt;
&lt;div class=&quot;badges&quot; align=&quot;center&quot;&gt;
  &lt;img src=&quot;https://img.shields.io/github/last-commit/coslynx/dillidash-marketplace-platform?style=flat-square&amp;color=5D6D7E&quot; alt=&quot;git-last-commit&quot; /&gt;
  &lt;img src=&quot;https://img.shields.io/github/commit-activity/m/coslynx/dillidash-marketplace-platform?style=flat-square&amp;color=5D6D7E&quot; alt=&quot;GitHub commit activity&quot; /&gt;
  &lt;img src=&quot;https://img.shields.io/github/languages/top/coslynx/dillidash-marketplace-platform?style=flat-square&amp;color=5D6D7E&quot; alt=&quot;GitHub top language&quot; /&gt;
&lt;/div&gt;

## 📑 Table of Contents
- 📍 Overview
- 📦 Features
- 📂 Structure
- 💻 Installation
- 🏗️ Usage
- 🌐 Hosting
- 📜 API Documentation
- 📄 License
- 👏 Authors

## 📍 Overview
This repository contains the Minimum Viable Product (MVP) for a **Quick Commerce Platform**. The platform aims to aggregate millions of small neighborhood stores across India, enabling them to sell online and providing customers with ultra-fast delivery at potentially cheaper prices than traditional e-commerce platforms. This MVP focuses on establishing the core marketplace functionality: store discovery via pincode, browsing products from a selected local store, and placing a guest order via Cash on Delivery (COD). It utilizes a modern tech stack including React (with Mantine UI) for the frontend, Node.js with Express for the backend, and MongoDB (via Mongoose) for the database.

## 📦 Features
|    | Feature               | Description                                                                                                                               |
|----|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| ⚙️  | **Architecture**      | Monolithic backend (Node.js/Express) with API routes, services, and models. Single Page Application (SPA) frontend (React/Vite) using component-based structure. |
| 📄 | **Documentation**     | This README provides an overview, setup guide, usage instructions, and API details for the MVP. Code includes JSDoc comments.           |
| 🔗 | **Dependencies**      | Frontend: `react`, `react-dom`, `@mantine/core`, `@mantine/form`, `react-router-dom`, `axios`. Backend: `express`, `mongoose`, `cors`, `dotenv`. Dev: `vite`, `nodemon`. |
| 🧩 | **Modularity**        | Separate `frontend` and `backend` directories. Frontend uses component structure (`components`, `pages`, `services`, `context`). Backend organizes by `models`, `routes`, `utils`. |
| 📍 | **Store Discovery**   | Users can search for nearby stores by entering their 6-digit Indian pincode.                                                            |
| 🛍️  | **Product Browsing**  | Users can view a list of products (name, price, category) offered by a selected store.                                                  |
| 🛒 | **Shopping Cart**     | Client-side cart management allowing users to add/remove items and update quantities from a single store per order.                       |
| 👤 | **Guest Checkout**    | Users can place orders without creating an account by providing name, phone number, and delivery address.                               |
| 💵 | **Cash on Delivery**  | The MVP solely supports Cash on Delivery (COD) as the payment method.                                                                   |
| 🧑‍💼 | **Store Admin View**  | Basic dashboard for registered stores to view incoming orders and their listed products (read-only for MVP).                           |
| ↔️  | **API Integration**   | Frontend communicates with the backend via a RESTful API for fetching stores/products and placing orders.                               |
| 💾 | **Data Persistence**  | MongoDB (via Mongoose) stores information about stores, their embedded products, and customer orders.                                     |

## 📂 Structure
```text
{
  ".env": "# Environment variables (DB connection, ports, API URL)",
  "backend": {
    "package.json": "# Backend Node.js dependencies and scripts",
    "server.js": "# Express server setup, middleware, DB connection, route mounting",
    "models": {
      "Order.js": "# Mongoose schema and model for Orders",
      "Store.js": "# Mongoose schema and model for Stores (with embedded Products)"
    },
    "utils": {
      "backendUtils.js": "# Backend helper functions, custom error class, async wrapper",
      "errorHandler.js": "# Global error handling middleware (Placeholder)"
    },
    "routes": {
        "orders.js": "# Express router for order-related endpoints",
        "stores.js": "# Express router for store and product related endpoints"
    }
  },
  "frontend": {
    "package.json": "# Frontend React dependencies and scripts",
    "vite.config.js": "# Vite configuration (React plugin, dev server proxy)",
    "public": {
      "favicon.ico": "# Application icon",
      "index.html": "# Main HTML entry point"
    },
    "src": {
      "main.jsx": "# React application entry point, provider setup",
      "App.jsx": "# Root component, routing setup (React Router)",
      "components": {
        "CartView.jsx": "# Displays items in the cart",
        "CheckoutForm.jsx": "# Form for guest checkout details",
        "ProductList.jsx": "# Displays products for a store",
        "StoreAdminDashboard.jsx": "# UI for store owners (view orders/products)",
        "StoreList.jsx": "# Displays list of stores found",
        "StoreSearch.jsx": "# Input component for pincode search"
      },
      "context": {
        "CartContext.jsx": "# React Context for managing cart state"
      },
      "pages": {
        "CheckoutPage.jsx": "# Page orchestrating the checkout flow",
        "HomePage.jsx": "# Main landing page with store search",
        "StoreAdminPage.jsx": "# Page container for the store admin dashboard",
        "StorePage.jsx": "# Page displaying single store details and products"
      },
      "services": {
        "apiService.js": "# Centralized frontend API call functions (using Axios)"
      },
      "utils": {
        "helpers.js": "# Shared frontend utility functions (e.g., formatting)"
      }
    }
  },
  "README.md": "# This documentation file",
  "commands.json": "# Convenience command aliases (Optional)",
  "startup.sh": "# Script to start both dev servers (Optional)",
  ".gitignore": "# Specifies files/directories ignored by Git"
}
```

## 💻 Installation
  > [!WARNING]
  > ### 🔧 Prerequisites
  > - **Node.js**: Version `20.0.0` or higher (check with `node -v`).
  > - **npm** or **yarn**: Package manager (check with `npm -v` or `yarn -v`).
  > - **Git**: Version control system (check with `git --version`).
  > - **MongoDB Atlas Account**: A free MongoDB Atlas account is required for the database. You'll need the connection string.

  ### 🚀 Setup Instructions
  1.  **Clone the Repository:**
      ```bash
      git clone https://github.com/coslynx/dillidash-marketplace-platform.git
      cd dillidash-marketplace-platform
      ```
  2.  **Install Backend Dependencies:**
      ```bash
      npm install --prefix backend
      # or: cd backend && npm install && cd ..
      ```
  3.  **Install Frontend Dependencies:**
      ```bash
      npm install --prefix frontend
      # or: cd frontend && npm install && cd ..
      ```
  4.  **Configure Environment Variables:**
      *   Navigate to the project root directory (`dillidash-marketplace-platform`).
      *   Create a `.env` file by copying the example (if one is provided) or creating it manually.
          ```bash
          # Example if .env.example exists:
          # cp .env.example .env
          # Otherwise, create .env manually
          ```
      *   Edit the `.env` file and add the following variables:
          ```dotenv
          # Backend Server Configuration
          PORT=3001

          # MongoDB Atlas Connection String
          # Replace <username>, <password>, <cluster-url>, and <database-name>
          MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

          # Frontend API Base URL (for development)
          VITE_API_BASE_URL=http://localhost:3001

          # Optional: Node Environment (development or production)
          # NODE_ENV=development
          ```
      > [!IMPORTANT]
      > Replace the MongoDB URI placeholders with your actual Atlas credentials and database name. **Do not commit the `.env` file to Git.** Ensure `.env` is listed in your `.gitignore` file.

## 🏗️ Usage
### 🏃‍♂️ Running the MVP

  > [!TIP]
  > Ensure your MongoDB Atlas cluster is active and the IP address of your development machine is whitelisted in Atlas network access settings if necessary.

  1.  **Start the Backend Server:** Open a terminal in the project root directory.
      ```bash
      npm run dev --prefix backend
      ```
      This uses `nodemon` to automatically restart the server on file changes. The backend will typically run on `http://localhost:3001` (or the `PORT` specified in `.env`).

  2.  **Start the Frontend Development Server:** Open a *second* terminal in the project root directory.
      ```bash
      npm run dev --prefix frontend
      ```
      This uses `vite` to start the React development server, usually accessible at `http://localhost:5173` (Vite will indicate the actual port). Vite's proxy (configured in `frontend/vite.config.js`) will handle API requests to the backend.

  3.  **Access the Application:**
      *   Open your web browser and navigate to the frontend URL provided by Vite (e.g., `http://localhost:5173`).
      *   The backend API is accessible at the URL specified by `VITE_API_BASE_URL` (e.g., `http://localhost:3001`).

### ⚙️ Configuration
Key configuration is managed through the `.env` file in the project root:
*   `PORT`: The port number the backend Express server listens on (Default: `3001`).
*   `MONGODB_URI`: The connection string for your MongoDB Atlas database. **Crucial for database connectivity.**
*   `VITE_API_BASE_URL`: The base URL for the backend API, used by the frontend's `apiService.js` to make requests (Default: `http://localhost:3001` for development).
*   `NODE_ENV`: Set to `production` when deploying, influences error handling verbosity in the backend (Defaults to `development` if not set).

### 📚 Examples
*   **Searching Stores:** Navigate to the home page (`/`) and enter a valid 6-digit Indian pincode (e.g., `110001`) into the search bar and click "Search". The `StoreList` component should update with nearby stores if found.
*   **Viewing Products:** Click on a store card from the search results. You will be navigated to the store page (`/store/:storeId`) where the `ProductList` component displays available products.
*   **Adding to Cart:** On the store page, click the "Add to Cart" button on product cards.
*   **Checkout:** Navigate to the checkout page (`/checkout`). If the cart has items, the `CartView` and `CheckoutForm` will be displayed. Fill in the guest details (Name, Phone, Address) and click "Place Order".

## 🌐 Hosting
### 🚀 Deployment Instructions
This MVP can be deployed to various platforms. Below are general guidelines for platforms like Render or Vercel.

**Recommended Setup:** Deploy the frontend and backend as separate services.

**Backend (Node.js/Express) on Render:**
1.  Connect your Git repository to Render.
2.  Create a new "Web Service".
3.  Configure the service:
    *   **Environment:** Node
    *   **Build Command:** `npm install --prefix backend` (or just `npm install` if running from `backend` root)
    *   **Start Command:** `npm start --prefix backend` (or `node backend/server.js` if needed)
    *   **Root Directory (Optional):** Set to `backend` if needed, otherwise adjust commands.
4.  Add Environment Variables in Render's dashboard:
    *   `NODE_ENV`: `production`
    *   `PORT`: Render provides this automatically, but use `3001` or similar if needed internally.
    *   `MONGODB_URI`: Your production MongoDB Atlas connection string.
    *   Potentially `VITE_API_BASE_URL` (if backend needs to know frontend URL for CORS, though `cors()` middleware is open by default in MVP).

**Frontend (React/Vite) on Vercel/Netlify/Render Static:**
1.  Connect your Git repository.
2.  Configure the build settings:
    *   **Framework Preset:** Vite
    *   **Build Command:** `npm run build --prefix frontend`
    *   **Publish Directory:** `frontend/dist`
    *   **Root Directory (Optional):** Set to `frontend` if needed.
3.  Add Environment Variables:
    *   `VITE_API_BASE_URL`: The **public URL of your deployed backend service** (e.g., `https://your-backend-app.onrender.com`).

### 🔑 Environment Variables (Production)
Ensure these are set in your hosting provider's environment settings:
*   `NODE_ENV`: `production` (for backend)
*   `PORT`: Often set automatically by the provider (for backend).
*   `MONGODB_URI`: Production database connection string (for backend).
*   `VITE_API_BASE_URL`: Public URL of the deployed backend (for frontend build).

## 📜 API Documentation
### 🔍 Endpoints
Base URL: (Set by `VITE_API_BASE_URL` for frontend, e.g., `http://localhost:3001`)

*   **`GET /api/stores?pincode={pincode}`**
    *   Description: Fetch active stores matching the provided 6-digit pincode.
    *   Query Parameters:
        *   `pincode` (string, required): The 6-digit Indian pincode.
    *   Response: `200 OK` - Array of `Store` objects. `[]` if none found.
        ```json
        [
          {
            "_id": "...",
            "name": "Local Kirana Store",
            "address": { "city": "Delhi", "pincode": "110001" },
            "categories": ["Grocery"],
            "isActive": true,
            "createdAt": "...",
            "updatedAt": "..."
          }
        ]
        ```
    *   Error Responses: `400 Bad Request` (Invalid pincode).

*   **`GET /api/stores/{storeId}`**
    *   Description: Fetch details for a single active store.
    *   Path Parameters:
        *   `storeId` (string, required): MongoDB ObjectId of the store.
    *   Response: `200 OK` - Single `Store` object (may include embedded products depending on backend implementation).
        ```json
        {
          "_id": "...",
          "name": "Local Kirana Store",
          "address": { "street": "123 Main St", "city": "Delhi", "pincode": "110001" },
          "contactPhone": "9876543210",
          "categories": ["Grocery"],
          "products": [ { "name": "Milk", "price": 30 }, { "name": "Bread", "price": 25 } ],
          "isActive": true,
          "createdAt": "...",
          "updatedAt": "..."
        }
        ```
    *   Error Responses: `400 Bad Request` (Invalid storeId format), `404 Not Found`.

*   **`GET /api/stores/{storeId}/products`**
    *   Description: Fetch only the products for a specific store.
    *   Path Parameters:
        *   `storeId` (string, required): MongoDB ObjectId of the store.
    *   Response: `200 OK` - Array of `Product` objects.
        ```json
        [
          { "name": "Milk", "category": "Dairy", "price": 30 },
          { "name": "Bread", "category": "Bakery", "price": 25 }
        ]
        ```
    *   Error Responses: `400 Bad Request` (Invalid storeId format), `404 Not Found`.

*   **`POST /api/orders`**
    *   Description: Place a new guest order (Cash on Delivery).
    *   Body: `OrderPayload` object.
        ```json
        {
          "storeId": "store_object_id",
          "customerDetails": {
            "name": "Test Customer",
            "phone": "9988776655",
            "address": "123 Test Lane, Test City - 110001"
          },
          "items": [
            { "productId": "prod_id_string_1", "name": "Milk", "price": 30, "quantity": 2 },
            { "productId": "prod_id_string_2", "name": "Bread", "price": 25, "quantity": 1 }
          ]
        }
        ```
    *   Response: `201 Created` - The created `Order` object.
        ```json
        {
          "_id": "...",
          "storeId": "...",
          "customerDetails": { ... },
          "items": [ ... ],
          "status": "placed",
          "totalAmount": 85.00,
          "createdAt": "...",
          "updatedAt": "..."
        }
        ```
    *   Error Responses: `400 Bad Request` (Invalid input data, missing fields, validation errors from Mongoose).

*   **`GET /api/stores/{storeId}/orders`**
    *   Description: Fetch orders placed for a specific store (for Store Admin).
    *   Path Parameters:
        *   `storeId` (string, required): MongoDB ObjectId of the store.
    *   Response: `200 OK` - Array of `Order` objects for that store.
        ```json
        [
          {
            "_id": "...",
            "storeId": "...",
            "customerDetails": { ... },
            "items": [ ... ],
            "status": "placed",
            "totalAmount": 85.00,
            "createdAt": "...",
            "updatedAt": "..."
          },
          // ... other orders
        ]
        ```
    *   Error Responses: `400 Bad Request` (Invalid storeId format), `404 Not Found`. (Note: Authorization not implemented in MVP).

### 🔒 Authentication
*   The current MVP does **not** implement user authentication or authorization.
*   All API endpoints are public, except potentially the store admin endpoints which lack explicit protection in this version.
*   Checkout is performed as a guest.

### 📝 Examples
```bash
# Fetch stores near pincode 110001
curl "http://localhost:3001/api/stores?pincode=110001"

# Fetch details for store with ID 60b8d295f1d2a1001c8e4abc (replace with actual ID)
curl "http://localhost:3001/api/stores/60b8d295f1d2a1001c8e4abc"

# Fetch products for store with ID 60b8d295f1d2a1001c8e4abc
curl "http://localhost:3001/api/stores/60b8d295f1d2a1001c8e4abc/products"

# Place a new order
curl -X POST http://localhost:3001/api/orders \
     -H "Content-Type: application/json" \
     -d '{
           "storeId": "60b8d295f1d2a1001c8e4abc",
           "customerDetails": {
             "name": "Ravi Kumar",
             "phone": "9123456789",
             "address": "Apt 4B, Test Apartments, Near Test Landmark, Test City - 110001"
           },
           "items": [
             { "productId": "milk_1l", "name": "Amul Taaza Milk 1L", "price": 55, "quantity": 2 },
             { "productId": "bread_brown", "name": "Brown Bread", "price": 40, "quantity": 1 }
           ]
         }'

# Fetch orders for store ID 60b8d295f1d2a1001c8e4abc (for admin view)
curl "http://localhost:3001/api/stores/60b8d295f1d2a1001c8e4abc/orders"

```

> [!NOTE]
> ## 📜 License & Attribution
>
> ### 📄 License
> This Minimum Viable Product (MVP) is licensed under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) license.
>
> ### 🤖 AI-Generated MVP
> This MVP was entirely generated using artificial intelligence through [CosLynx.com](https://coslynx.com).
>
> No human was directly involved in the coding process of the repository: dillidash-marketplace-platform
>
> ### 📞 Contact
> For any questions or concerns regarding this AI-generated MVP, please contact CosLynx at:
> - Website: [CosLynx.com](https://coslynx.com)
> - Twitter: [@CosLynxAI](https://x.com/CosLynxAI)

&lt;p align=&quot;center&quot;&gt;
  &lt;h1 align=&quot;center&quot;&gt;🌐 CosLynx.com&lt;/h1&gt;
&lt;/p&gt;
&lt;p align=&quot;center&quot;&gt;
  &lt;em&gt;Create Your Custom MVP in Minutes With CosLynxAI!&lt;/em&gt;
&lt;/p&gt;
&lt;div class=&quot;badges&quot; align=&quot;center&quot;&gt;
&lt;img src=&quot;https://img.shields.io/badge/Developers-Drix10,_Kais_Radwan-red&quot; alt=&quot;&quot;&gt;
&lt;img src=&quot;https://img.shields.io/badge/Website-CosLynx.com-blue&quot; alt=&quot;&quot;&gt;
&lt;img src=&quot;https://img.shields.io/badge/Backed_by-Google,_Microsoft_&amp;_Amazon_for_Startups-red&quot; alt=&quot;&quot;&gt;
&lt;img src=&quot;https://img.shields.io/badge/Finalist-Backdrop_Build_v4,_v6-black&quot; alt=&quot;&quot;&gt;
&lt;/div&gt;