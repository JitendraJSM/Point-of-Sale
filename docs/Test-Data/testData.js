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
// Example 1. Electronics Supplier
// {
//   "name": "electronics hub",
//   "email": "sales@electronicshub.com",
//   "phone": "+91-9876543001",
//   "address": "123 Tech Park, Mumbai",
//   "pendingBalance": 25000,
//   "transactions": [],
//   "suppliedProducts": []
// }
// Example 2. Office Supplies Vendor
// {
//   "name": "office essentials",
//   "email": "orders@officeessentials.com",
//   "phone": "+91-9876543002",
//   "address": "456 Business Center, Delhi",
//   "pendingBalance": 15000,
//   "transactions": [],
//   "suppliedProducts": []
// }
// Example 3. Computer Parts Supplier
// {
//   "name": "computer solutions",
//   "email": "info@computersolutions.com",
//   "phone": "+91-9876543003",
//   "address": "789 IT Park, Bangalore",
//   "pendingBalance": 35000,
//   "transactions": [],
//   "suppliedProducts": []
// }
// Example 4. Network Equipment Supplier
// {
//   "name": "network systems",
//   "email": "sales@networksystems.com",
//   "phone": "+91-9876543004",
//   "address": "321 Tech Hub, Hyderabad",
//   "pendingBalance": 45000,
//   "transactions": [],
//   "suppliedProducts": []
// }
// Example 5. Example Vendor Schema
// const vendorNew = {
//   "name": "Tech Office Solutions", // required, unique
//   "email": "procurement@techoffice.com",
//   "phone": "+91-9876543220", // required, unique
//   "address": "789 Business Hub, Bangalore",
//   "pendingBalance": "pendingBalanceTest",
//   "creditLimit": "creditLimitTest",
//   "transactions": "transactionsTest",
//   "suppliedProducts": [
//     {
//       "product": "testObjectIdofProduct1",
//       "lastPurchasePrice": "testPrice1",
//       "lastPurchaseDate": "testDate1"
//     },
//     {
//       "product": "testObjectIdofProduct2",
//       "lastPurchasePrice": "testPrice2",
//       "lastPurchaseDate": "testDate2"
//     },
//     {
//       "product": "testObjectIdofProduct3",
//       "lastPurchasePrice": "testPrice3",
//       "lastPurchaseDate": "testDate3"
//     },
//   ]
// }

// ---------- 3. Products ----------
// 3.1. Create a product
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
//   "name": "test Product Name",               // required, unique
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

// ---------- 4. Purchase ----------
// 4.1. Create a Purchase
const purchase = {
  billNumber: "PUR-24/25-001", // required not unique
  vendor: "Hikvision Distributors", // required, unique
  billDate: "04-03-2025", // required not unique
  inventoryDate: "24-03-2025",
  items: [
    {
      productName: "testProductName1",
      quantity: "10",
      unitPurchasePrice: "100",
      totalAmountItemWise: "1000",
    },
  ],
  totalAmountWithTax: 1058, // required not unique
  totalTaxAmount: "",
  taxBreakdown: "",
  paymentStatus: "paid",
  payments: "testObjectofPayment",
  notes: "testNotes",
};
// {
//   "billNumber": "PUR-24/25-001",               // required, unique
//   "vendor": "Hikvision Distributors",  // required not unique
//   "billDate": "04-03-2025",  // required not unique
//   "inventoryDate": "24-03-2025",
//   "items": "",
//   "totalAmountWithTax": "",  // required not unique
//   "totalTaxAmount": "",
//   "taxBreakdown": "",
//   "paymentStatus": "paid",
//   "payments": "testObjectofPayment",
//   "notes": "testNotes",
// }
