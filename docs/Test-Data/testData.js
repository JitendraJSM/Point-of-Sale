// ---------- 1. Customer ----------
// 1.1. Create a customer
const customerNew = {
  name: "Tech Office Solutions", // required not unique
  email: "procurement@techoffice.com",
  phone: "+91-9876543220", // required, unique
  address: "789 Business Hub, Bangalore",
  pendingBalance: "pendingBalanceTest",
  creditLimit: "creditLimitTest",
  transactions: "transactionsTest",
};
// {
//     "name": "Tech Office Solutions",    // required not unique
//     "email": "procurement@techoffice.com",
//     "phone": "+91-9876543220",          // required, unique
//     "address": "789 Business Hub, Bangalore",
//     "pendingBalance": "pendingBalanceTest",
//     "creditLimit": "creditLimitTest",
//     "transactions": "transactionsTest",
// }

// ---------- 2. Vendor ----------
// 2.1. Create a customer
const vendorNew = {
  name: "Tech Office Solutions", // required not unique
  email: "procurement@techoffice.com",
  phone: "+91-9876543220", // required, unique
  address: "789 Business Hub, Bangalore",
  pendingBalance: "pendingBalanceTest",
  creditLimit: "creditLimitTest",
  transactions: "transactionsTest",
  suppliedProducts: [
    {
      product: "testObjectIdofProduct1",
      lastPurchasePrice: "testPrice1",
      lastPurchaseDate: "testDate1",
    },
    {
      product: "testObjectIdofProduct2",
      lastPurchasePrice: "testPrice2",
      lastPurchaseDate: "testDate2",
    },
    {
      product: "testObjectIdofProduct3",
      lastPurchasePrice: "testPrice3",
      lastPurchaseDate: "testDate3",
    },
  ],
};
// {
//     "name": "Tech Office Solutions",    // required not unique
//     "email": "procurement@techoffice.com",
//     "phone": "+91-9876543220",          // required, unique
//     "address": "789 Business Hub, Bangalore",
//     "pendingBalance": "pendingBalanceTest",
//     "creditLimit": "creditLimitTest",
//     "transactions": "transactionsTest",
//     "suppliedProducts": [
//       {
//         "product": "testObjectIdofProduct1",
//         "lastPurchasePrice": "testPrice1",
//         "lastPurchaseDate": "testDate1",
//       },
//       {
//         "product": "testObjectIdofProduct2",
//         "lastPurchasePrice": "testPrice2",
//         "lastPurchaseDate": "testDate2",
//       },
//       {
//         "product": "testObjectIdofProduct3",
//         "lastPurchasePrice": "testPrice3",
//         "lastPurchaseDate": "testDate3",
//       },
//     ],
// }

// ---------- 2. Products ----------
// 2.1. Create a product
const productNew = {
  name: "test Product Name", // required, unique
  description: "test Product description",
  category: "test Category",
  sku: "testSKU123",
  unitPurchasePrice: 150, // required not unique
  unitSellingPrice: 250,
  stock: {
    current: "50",
    minimum: "10",
    maximum: "100",
  },
  unit: "pcs",
};
// {
//   "name": "test Product Name",               // required not unique
//   "description": "test Product description",
//   "category": "test Category",
//   "sku": "testSKU123",
//   "unitPurchasePrice": 150,  // required not unique
//   "unitSellingPrice": 250,
//   "stock": {
//     "current": "50",
//     "minimum": "10",
//     "maximum": "100",
//   },
//   "unit": "pcs",
// };
