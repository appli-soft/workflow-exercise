--Step 1: creating Database:
CREATE DATABASE asset_report_db;
USE asset_report_db;

--Step 2: creating tables:  
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status ENUM('active', 'suspended', 'deleted') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Step 3:Create asset_types table:
CREATE TABLE asset_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

--Step 4:Create assets table:
CREATE TABLE assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    asset_type_id INT NOT NULL,
    ticker_or_name VARCHAR(100) NOT NULL,
    quantity DECIMAL(18, 4) NOT NULL DEFAULT 0,
    current_unit_price DECIMAL(18, 4) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (asset_type_id) REFERENCES asset_types(id)
);

--Step 5:Create transactions table:
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    amount DECIMAL(18, 4) NOT NULL,
    transaction_type ENUM('buy', 'sell') NOT NULL,
    executed_at DATETIME NOT NULL,
    FOREIGN KEY (asset_id) REFERENCES assets(id)
);


--Step 6: Write the SQL query for the report:
SELECT
    u.id AS user_id,
    u.name AS user_name,
    at.name AS asset_type,
    -- Count unique assets currently held :
    (
        SELECT COUNT(DISTINCT a.id)
        FROM assets a
        WHERE a.user_id = u.id
          AND a.asset_type_id = at.id
          AND a.quantity > 0
    ) AS total_asset_count,

    -- Calculate total asset valuation
    (
        SELECT COALESCE(
            SUM(a.quantity * COALESCE(a.current_unit_price, 0)),
            0
        )
        FROM assets a
        WHERE a.user_id = u.id
          AND a.asset_type_id = at.id
          AND a.quantity > 0
    ) AS total_valuation,

    -- Find latest transaction date:
    (
        SELECT MAX(t.executed_at)
        FROM assets a
        JOIN transactions t
            ON a.id = t.asset_id
        WHERE a.user_id = u.id
          AND a.asset_type_id = at.id
    ) AS latest_transaction_date

FROM users u

CROSS JOIN asset_types at

WHERE u.status = 'active'

ORDER BY u.id, at.id;
