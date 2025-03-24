# API Documentation

## Overview
This documentation provides detailed information about the PoS & Inventory Management System API endpoints, including request/response formats, parameters, and examples.

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All API endpoints require authentication. Authentication details will be provided in a separate security documentation.

## Common Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

## Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Endpoints

### Customer Management

#### List Customers
```
GET /customers
```

Query Parameters:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of records per page (default: 10)
- `search` (optional): Search term for customer name or email

Response:
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "_id": "customer_id",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "address": "123 Street, City",
        "balance": 1000,
        "creditLimit": 5000,
        "createdAt": "2023-01-01T00:00:00Z",
        "updatedAt": "2023-01-01T00:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pages": 10
  }
}
```

#### Create Customer
```
POST /customers
```

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Street, City",
  "creditLimit": 5000
}
```

#### Get Customer Details
```
GET /customers/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "customer": {
      "_id": "customer_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Street, City",
      "balance": 1000,
      "creditLimit": 5000,
      "transactions": [
        {
          "type": "purchase",
          "amount": 500,
          "date": "2023-01-01T00:00:00Z",
          "invoiceId": "invoice_id"
        }
      ],
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  }
}
```

### Product Management

#### List Products
```
GET /products
```

Query Parameters:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of records per page (default: 10)
- `category` (optional): Filter by category
- `search` (optional): Search term for product name or SKU

Response:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "product_id",
        "name": "Product Name",
        "description": "Product description",
        "category": "Category",
        "sku": "SKU123",
        "barcode": "123456789",
        "price": {
          "purchase": 100,
          "selling": 150
        },
        "stock": {
          "current": 50,
          "minimum": 10,
          "maximum": 100
        },
        "unit": "pcs"
      }
    ],
    "total": 100,
    "page": 1,
    "pages": 10
  }
}
```

#### Create Product
```
POST /products
```

Request Body:
```json
{
  "name": "Product Name",
  "description": "Product description",
  "category": "Category",
  "sku": "SKU123",
  "barcode": "123456789",
  "price": {
    "purchase": 100,
    "selling": 150
  },
  "stock": {
    "minimum": 10,
    "maximum": 100
  },
  "unit": "pcs"
}
```

### Sales Management

#### Create Sale
```
POST /sales
```

Request Body:
```json
{
  "customer": "customer_id",
  "items": [
    {
      "product": "product_id",
      "quantity": 2,
      "unitPrice": 150
    }
  ],
  "discount": 10
}
```

Response:
```json
{
  "success": true,
  "data": {
    "invoice": {
      "_id": "invoice_id",
      "invoiceNumber": "INV-2023-001",
      "customer": "customer_id",
      "items": [
        {
          "product": "product_id",
          "quantity": 2,
          "unitPrice": 150,
          "total": 300,
          "taxCategory": "GST",
          "taxRate": 18,
          "taxAmount": 54
        }
      ],
      "totalAmount": 300,
      "totalTaxAmount": 54,
      "discount": 10,
      "finalAmount": 344,
      "status": "pending",
      "paymentStatus": "unpaid"
    }
  }
}
```

### Purchase Management

#### Create Purchase
```
POST /purchases
```

Request Body:
```json
{
  "vendor": "vendor_id",
  "items": [
    {
      "product": "product_id",
      "quantity": 50,
      "unitPrice": 100,
      "taxCategory": "GST",
      "taxRate": 18
    }
  ]
}
```

Response:
```json
{
  "success": true,
  "data": {
    "purchase": {
      "_id": "purchase_id",
      "billNumber": "PB-2023-001",
      "vendor": "vendor_id",
      "items": [
        {
          "product": "product_id",
          "quantity": 50,
          "unitPrice": 100,
          "total": 5000,
          "taxCategory": "GST",
          "taxRate": 18,
          "taxAmount": 900
        }
      ],
      "totalAmount": 5000,
      "totalTaxAmount": 900,
      "paymentStatus": "unpaid"
    }
  }
}
```

### Financial Management

#### Get Financial Dashboard
```
GET /finance/dashboard
```

Response:
```json
{
  "success": true,
  "data": {
    "sales": {
      "today": 5000,
      "thisWeek": 25000,
      "thisMonth": 100000
    },
    "purchases": {
      "today": 3000,
      "thisWeek": 15000,
      "thisMonth": 60000
    },
    "receivables": 50000,
    "payables": 30000,
    "inventory": {
      "value": 200000,
      "items": 1000
    }
  }
}
```

## Rate Limiting
API endpoints are rate-limited to prevent abuse. The current limits are:
- 100 requests per minute for regular endpoints
- 30 requests per minute for heavy operations

## Pagination
All list endpoints support pagination with the following query parameters:
- `page`: Page number (default: 1)
- `limit`: Number of records per page (default: 10)

The response includes pagination metadata:
```json
{
  "success": true,
  "data": {
    "items": [],
    "total": 100,
    "page": 1,
    "pages": 10
  }
}
```

## Error Codes
- `AUTH_ERROR`: Authentication error
- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Resource not found
- `INSUFFICIENT_STOCK`: Product stock is insufficient
- `CREDIT_LIMIT_EXCEEDED`: Customer credit limit exceeded
- `INTERNAL_ERROR`: Internal server error

## Best Practices
1. Always include authentication token in the request header
2. Use appropriate HTTP methods for operations
3. Handle rate limiting by implementing exponential backoff
4. Implement proper error handling for all API responses
5. Use pagination for large data sets
6. Cache frequently accessed data
7. Monitor API usage and response times