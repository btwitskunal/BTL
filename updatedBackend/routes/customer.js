const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// GET /api/customers/test-db (must come before /:sapId route)
router.get('/test-db', customerController.testDatabase);

// GET /api/customers/fields?field=FIELD_NAME
router.get('/fields', customerController.getUniqueFieldValues);

// GET /api/customers/search?STATE=Delhi,Haryana&CITY=Gurgaon,Delhi
router.get('/search', customerController.searchCustomers);

// GET /api/customers/search-by-field?field=STATE&value=Maharashtra
router.get('/search-by-field', customerController.getCustomerByField);

// GET /api/customers/:customerNumber/uploaded-data
router.get('/:customerNumber/uploaded-data', customerController.getCustomerUploadedData);

// GET /api/customers/:sapId (must come last to avoid conflicts)
router.get('/:sapId', customerController.getCustomerBySapId);

module.exports = router; 