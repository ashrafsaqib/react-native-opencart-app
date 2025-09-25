# API Specifications for OpenCart React Native App

This document outlines the API endpoints, request payloads, and response formats required to make the OpenCart React Native app dynamic.

---

## 1. Authentication

### 1.1. User Login

- **Endpoint:** `POST /api/login`
- **Description:** Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Body:**
```json
{
  "token": "your_jwt_token",
  "user": {
    "id": 1,
    "firstname": "John",
    "lastname": "Doe",
    "email": "user@example.com"
  }
}
```

### 1.2. User Registration

- **Endpoint:** `POST /api/register`
- **Description:** Creates a new user account.

**Request Body:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Body:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "firstname": "John",
    "lastname": "Doe",
    "email": "user@example.com"
  }
}
```

### 1.3. Forgot Password

- **Endpoint:** `POST /api/forgot-password`
- **Description:** Sends a password reset link to the user's email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response Body:**
```json
{
  "message": "Password reset link sent to your email."
}
```

### 1.4. Change Password

- **Endpoint:** `POST /api/change-password`
- **Description:** Changes the user's password.
- **Authentication:** Requires JWT token.

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Response Body:**
```json
{
  "message": "Password changed successfully."
}
```

---

## 2. Profile

### 2.1. Get User Profile

- **Endpoint:** `GET /api/profile`
- **Description:** Retrieves the profile of the authenticated user.
- **Authentication:** Requires JWT token.

**Response Body:**
```json
{
  "id": 1,
  "firstname": "John",
  "lastname": "Doe",
  "email": "user@example.com"
}
```

### 2.2. Update User Profile

- **Endpoint:** `PUT /api/profile`
- **Description:** Updates the profile of the authenticated user.
- **Authentication:** Requires JWT token.

**Request Body:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "user@example.com"
}
```

**Response Body:**
```json
{
  "message": "Profile updated successfully.",
  "user": {
    "id": 1,
    "firstname": "John",
    "lastname": "Doe",
    "email": "user@example.com"
  }
}
```

---

## 3. Products

### 3.1. Get All Products

- **Endpoint:** `GET /api/products`
- **Description:** Retrieves a list of all products. Can be filtered by category.

**Query Parameters:**
- `category_id` (optional): ID of the category to filter by.

**Response Body:**
```json
[
  {
    "id": 1,
    "name": "Product 1",
    "price": 29.99,
    "image": "https://example.com/product1.jpg",
    "sizes": ["S", "M", "L"],
    "description": "A great product."
  },
  {
    "id": 2,
    "name": "Product 2",
    "price": 39.99,
    "image": "https://example.com/product2.jpg",
    "sizes": ["M", "L", "XL"],
    "description": "Another great product."
  }
]
```

### 3.2. Get Product Details

- **Endpoint:** `GET /api/products/{id}`
- **Description:** Retrieves the details of a specific product.

**Response Body:**
```json
{
  "id": 1,
  "name": "Product 1",
  "price": 29.99,
  "images": [
    "https://example.com/product1_1.jpg",
    "https://example.com/product1_2.jpg"
  ],
  "sizes": ["S", "M", "L"],
  "description": "A great product.",
  "reviews": [
    {
      "id": 1,
      "user": "Jane Doe",
      "rating": 5,
      "comment": "Excellent product!"
    }
  ]
}
```

---

## 4. Categories

### 4.1. Get All Categories

- **Endpoint:** `GET /api/categories`
- **Description:** Retrieves a list of all product categories.

**Response Body:**
```json
[
  {
    "id": 1,
    "name": "T-shirts",
    "image": "https://example.com/tshirts.jpg"
  },
  {
    "id": 2,
    "name": "Shoes",
    "image": "https://example.com/shoes.jpg"
  }
]
```

---

## 5. Wishlist

### 5.1. Get Wishlist

- **Endpoint:** `GET /api/wishlist`
- **Description:** Retrieves the wishlist of the authenticated user.
- **Authentication:** Requires JWT token.

**Response Body:**
```json
[
  {
    "id": 1,
    "product_id": 101,
    "name": "Product 1",
    "price": 29.99,
    "image": "https://example.com/product1.jpg"
  }
]
```

### 5.2. Add to Wishlist

- **Endpoint:** `POST /api/wishlist`
- **Description:** Adds a product to the user's wishlist.
- **Authentication:** Requires JWT token.

**Request Body:**
```json
{
  "product_id": 102
}
```

**Response Body:**
```json
{
  "message": "Product added to wishlist."
}
```

### 5.3. Remove from Wishlist

- **Endpoint:** `DELETE /api/wishlist/{product_id}`
- **Description:** Removes a product from the user's wishlist.
- **Authentication:** Requires JWT token.

**Response Body:**
```json
{
  "message": "Product removed from wishlist."
}
```

---

## 6. Cart

### 6.1. Get Cart

- **Endpoint:** `GET /api/cart`
- **Description:** Retrieves the user's shopping cart.
- **Authentication:** Requires JWT token.

**Response Body:**
```json
{
  "items": [
    {
      "id": 1,
      "product_id": 101,
      "name": "Product 1",
      "price": 29.99,
      "quantity": 2,
      "image": "https://example.com/product1.jpg"
    }
  ],
  "subtotal": 59.98,
  "shipping": 5.00,
  "total": 64.98
}
```

### 6.2. Add to Cart

- **Endpoint:** `POST /api/cart`
- **Description:** Adds a product to the cart.
- **Authentication:** Requires JWT token.

**Request Body:**
```json
{
  "product_id": 102,
  "quantity": 1
}
```

**Response Body:**
```json
{
  "message": "Product added to cart."
}
```

### 6.3. Update Cart Item

- **Endpoint:** `PUT /api/cart/{product_id}`
- **Description:** Updates the quantity of a product in the cart.
- **Authentication:** Requires JWT token.

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response Body:**
```json
{
  "message": "Cart updated."
}
```

### 6.4. Remove from Cart

- **Endpoint:** `DELETE /api/cart/{product_id}`
- **Description:** Removes a product from the cart.
- **Authentication:** Requires JWT token.

**Response Body:**
```json
{
  "message": "Product removed from cart."
}
```

---

## 7. Orders

### 7.1. Get Order History

- **Endpoint:** `GET /api/orders`
- **Description:** Retrieves the user's order history.
- **Authentication:** Requires JWT token.

**Response Body:**
```json
[
  {
    "id": 1,
    "orderId": "#123456",
    "date": "2023-10-26",
    "total": 64.98,
    "status": "Delivered"
  }
]
```

### 7.2. Get Order Details

- **Endpoint:** `GET /api/orders/{id}`
- **Description:** Retrieves the details of a specific order.
- **Authentication:** Requires JWT token.

**Response Body:**
```json
{
  "id": 1,
  "orderId": "#123456",
  "date": "2023-10-26",
  "total": 64.98,
  "status": "Delivered",
  "shippingAddress": "123 Main St, Anytown, USA 12345",
  "products": [
    {
      "id": 1,
      "name": "Product 1",
      "price": 29.99,
      "quantity": 1
    },
    {
      "id": 2,
      "name": "Product 2",
      "price": 29.99,
      "quantity": 1
    }
  ],
  "subTotal": 59.98,
  "shipping": 5.00,
  "paymentMethod": "Credit Card",
  "shippingMethod": "Standard Shipping"
}
```

### 7.3. Create Order

- **Endpoint:** `POST /api/orders`
- **Description:** Creates a new order from the user's cart.
- **Authentication:** Requires JWT token.

**Request Body:**
```json
{
  "shipping_address_id": 1,
  "payment_method_id": 1
}
```

**Response Body:**
```json
{
  "message": "Order created successfully.",
  "order_id": 123
}
```

---

## 8. Home Screen

### 8.1. Get Home Screen Data

- **Endpoint:** `GET /api/home`
- **Description:** Retrieves all the data needed for the home screen.

**Response Body:**
```json
{
  "carousel": [
    { "id": "1", "image": "https://picsum.photos/id/1015/1000/600" },
    { "id": "2", "image": "https://picsum.photos/id/1016/1000/600" },
    { "id": "3", "image": "https://picsum.photos/id/1018/1000/600" }
  ],
  "deals": [
    { "id": "1", "title": "Mega Sale", "discount": "50% OFF" }
  ],
  "categories": [
    { "id": 1, "name": "T-shirts", "image": "https://example.com/tshirts.jpg" },
    { "id": 2, "name": "Shoes", "image": "https://example.com/shoes.jpg" }
  ],
  "products": [
    { "id": 1, "name": "Product 1", "price": 29.99, "image": "https://example.com/product1.jpg" }
  ]
}
```