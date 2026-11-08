-- PostgreSQL schema for the canonical movement export.
-- Start psql from the repository root, then run:
--   \i sql/schema.sql
--   \copy container_movements FROM 'demo/container_movements.csv' CSV HEADER
CREATE TABLE IF NOT EXISTS container_movements (
    container_id VARCHAR(30) PRIMARY KEY,
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    dwell_days INTEGER NOT NULL CHECK (dwell_days >= 0),
    shipper VARCHAR(100) NOT NULL,
    shipping_agent VARCHAR(100) NOT NULL,
    container_type VARCHAR(30) NOT NULL,
    cargo_type VARCHAR(50) NOT NULL,
    delay_reason VARCHAR(100) NOT NULL,
    doc_processing_hrs NUMERIC(8,2) NOT NULL,
    demurrage_cost_eur NUMERIC(12,2) NOT NULL,
    CHECK (departure_date >= arrival_date),
    CHECK (dwell_days = departure_date - arrival_date)
);
