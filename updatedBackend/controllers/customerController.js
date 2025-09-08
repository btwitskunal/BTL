const { pool } = require('../utils/db');

// Initialize customer_data table if it doesn't exist
async function initializeCustomerTable() {
  try {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS customer_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        CUSTOMER_NUMBER VARCHAR(50) NOT NULL,
        CUSTOMER_NAME VARCHAR(255) NOT NULL,
        TERRITORY_CODE VARCHAR(50),
        T_ZONE VARCHAR(50),
        ZONE VARCHAR(50),
        STATE VARCHAR(100),
        REGION VARCHAR(100),
        DISTIRCT VARCHAR(100),
        TALUKA VARCHAR(100),
        CITY VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_customer_number (CUSTOMER_NUMBER),
        INDEX idx_customer_name (CUSTOMER_NAME),
        INDEX idx_state (STATE),
        INDEX idx_city (CITY)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    
    await pool.execute(createTableSQL);
    console.log('Customer data table initialized successfully');
  } catch (error) {
    console.error('Failed to initialize customer data table:', error);
  }
}

// Initialize the table on startup
initializeCustomerTable();

exports.getUniqueFieldValues = async (req, res) => {
  try {
    const { field } = req.query;
    if (!field) {
      return res.status(400).json({ error: 'Field parameter is required' });
    }
    // Sanitize field name to prevent SQL injection (allow only alphanumeric and underscore)
    if (!/^\w+$/.test(field)) {
      return res.status(400).json({ error: 'Invalid field name' });
    }
    const [rows] = await pool.execute(`SELECT DISTINCT \`${field}\` FROM customer_data WHERE \`${field}\` IS NOT NULL AND \`${field}\` != '' ORDER BY \`${field}\``);
    const values = rows.map(row => row[field]);
    res.json({ values });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch unique field values', details: err.message });
  }
};

exports.searchCustomers = async (req, res) => {
  try {
    // Build query string for all selected filters
    const filters = req.query;
    const allowedFields = [
      'CUSTOMER_NAME', 'STATE', 'CITY', 'REGION', 'ZONE', 'T_ZONE', 
      'DISTIRCT', 'TALUKA', 'TERRITORY_CODE'
    ];
    
    let whereConditions = [];
    let queryParams = [];
    
    for (const [field, values] of Object.entries(filters)) {
      if (allowedFields.includes(field) && values) {
        const valueArray = Array.isArray(values) ? values : values.split(',');
        if (valueArray.length > 0) {
          const placeholders = valueArray.map(() => '?').join(',');
          whereConditions.push(`\`${field}\` IN (${placeholders})`);
          queryParams.push(...valueArray);
        }
      }
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const sqlQuery = `SELECT CUSTOMER_NUMBER, CUSTOMER_NAME, TALUKA, T_ZONE, ZONE, REGION, DISTIRCT, CITY, TERRITORY_CODE, STATE FROM customer_data ${whereClause} ORDER BY CUSTOMER_NAME ASC`;
    
    const [rows] = await pool.execute(sqlQuery, queryParams);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search customers', details: err.message });
  }
};

exports.getCustomerBySapId = async (req, res) => {
  try {
    const { sapId } = req.params;
    if (!sapId) {
      return res.status(400).json({ error: 'Customer Number (SAP ID) is required' });
    }
    
    const [rows] = await pool.execute('SELECT * FROM customer_data WHERE CUSTOMER_NUMBER = ?', [sapId]);
    
    if (rows && rows.length > 0) {
      const customerData = rows[0];
      const result = {
        customer_number: customerData.CUSTOMER_NUMBER,
        customer_name: customerData.CUSTOMER_NAME,
        territory_code: customerData.TERRITORY_CODE,
        t_zone: customerData.T_ZONE,
        zone: customerData.ZONE,
        state: customerData.STATE,
        region: customerData.REGION,
        district: customerData.DISTIRCT,
        taluka: customerData.TALUKA,
        city: customerData.CITY,
      };
      res.json(result);
    } else {
      res.status(404).json({ message: 'Customer not found for the given Customer Number' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer data', details: err.message });
  }
};

// Additional customer API endpoints from Fetch_data service
exports.getCustomerByField = async (req, res) => {
  const { field, value } = req.query;

  // Whitelist of allowed columns to prevent SQL injection on column names
  const allowedFields = [
    'CUSTOMER_NAME',
    'TALUKA',
    'T_ZONE',
    'ZONE',
    'REGION',
    'DISTIRCT',
    'CITY',
    'TERRITORY_CODE',
    'STATE',
  ];

  if (!field || !value) {
    return res.status(400).json({ error: 'Both "field" and "value" query parameters are required.' });
  }

  if (!allowedFields.includes(field)) {
    return res.status(400).json({ error: `Invalid search field. Allowed fields are: ${allowedFields.join(', ')}` });
  }

  try {
    const sqlQuery = `SELECT CUSTOMER_NUMBER, CUSTOMER_NAME, TALUKA, T_ZONE, ZONE, REGION, DISTIRCT, CITY, TERRITORY_CODE, STATE FROM customer_data WHERE \`${field}\` = ? ORDER BY CUSTOMER_NAME ASC`;
    const [rows] = await pool.execute(sqlQuery, [value]);
    res.json(rows);
  } catch (error) {
    console.error(`Database query for customers by ${field} failed:`, error);
    res.status(500).json({ error: 'Failed to fetch customer data.' });
  }
};

exports.getCustomerUploadedData = async (req, res) => {
  const { customerNumber } = req.params;

  if (!customerNumber) {
    return res.status(400).json({ error: 'Customer Number is required.' });
  }

  try {
    // First, let's check what columns exist in the uploaded_data table
    const [columns] = await pool.execute('DESCRIBE uploaded_data');
    console.log('Available columns in uploaded_data:', columns.map(col => col.Field));
    
    // Find the customer number column (it might be named differently)
    const customerColumn = columns.find(col => 
      col.Field.toLowerCase().includes('customer') || 
      col.Field.toLowerCase().includes('sap') ||
      col.Field.toLowerCase().includes('number')
    );
    
    if (!customerColumn) {
      return res.status(500).json({ 
        error: 'No customer number column found in uploaded_data table',
        available_columns: columns.map(col => col.Field)
      });
    }
    
    console.log('Using customer column:', customerColumn.Field);
    
    // Use the correct column name for customer number
    const sqlQuery = `SELECT element, attribute, uom FROM uploaded_data WHERE \`${customerColumn.Field}\` = ?`;
    console.log('Executing query:', sqlQuery, 'with customer number:', customerNumber);
    
    const [rows] = await pool.execute(sqlQuery, [customerNumber]);
    console.log('Query result:', rows);
    
    res.json({
      customer_number: customerNumber,
      customer_column_used: customerColumn.Field,
      uploaded_data: rows
    });
  } catch (error) {
    console.error('Detailed error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    res.status(500).json({ 
      error: 'Failed to fetch uploaded data from the database.',
      details: error.message,
      code: error.code
    });
  }
};

exports.testDatabase = async (req, res) => {
  try {
    // Test connection
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    
    // List all tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Available tables:', tables);
    
    // Check if uploaded_data table exists
    const [uploadedDataExists] = await connection.query("SHOW TABLES LIKE 'uploaded_data'");
    console.log('uploaded_data table exists:', uploadedDataExists.length > 0);
    
    // If table exists, show its structure
    if (uploadedDataExists.length > 0) {
      const [columns] = await connection.query('DESCRIBE uploaded_data');
      console.log('uploaded_data table structure:', columns);
    }
    
    connection.release();
    
    res.json({
      status: 'Database connection successful',
      tables: tables.map(t => Object.values(t)[0]),
      uploaded_data_exists: uploadedDataExists.length > 0,
      uploaded_data_structure: uploadedDataExists.length > 0 ? await pool.execute('DESCRIBE uploaded_data').then(([cols]) => cols) : null
    });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({ 
      error: 'Database test failed',
      details: error.message,
      code: error.code
    });
  }
};