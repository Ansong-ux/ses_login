-- Create fee_structure table
CREATE TABLE IF NOT EXISTS fee_structure (
    level INT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL
);

-- Insert fee data for each level
INSERT INTO fee_structure (level, amount) VALUES
(100, 5500.00),
(200, 5500.00),
(300, 6000.00),
(400, 6000.00)
ON CONFLICT (level) DO NOTHING; 