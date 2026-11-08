-- PostgreSQL. Load sql/schema.sql and demo/container_movements.csv first.
-- All results use the movement sheet; workbook summary sheets are not joined.

-- 1. Monthly mean dwell, weighted naturally by individual container rows.
SELECT DATE_TRUNC('month', arrival_date)::date AS month,
       ROUND(AVG(dwell_days), 2) AS avg_dwell_days,
       COUNT(*) AS total_containers,
       COUNT(*) FILTER (WHERE dwell_days > 5) AS containers_over_threshold
FROM container_movements
GROUP BY 1 ORDER BY 1;

-- 2. Primary delay reasons among containers above the five-day threshold.
SELECT delay_reason, COUNT(*) AS container_count,
       ROUND(AVG(doc_processing_hrs), 2) AS avg_processing_hours,
       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS pct_of_delayed
FROM container_movements
WHERE dwell_days > 5
GROUP BY delay_reason ORDER BY container_count DESC;

-- 3. Arrival weekday distribution. ISO order is Monday (1) through Sunday (7).
SELECT EXTRACT(ISODOW FROM arrival_date) AS weekday,
       COUNT(*) AS arrivals,
       ROUND(AVG(dwell_days), 2) AS avg_dwell_days
FROM container_movements
GROUP BY 1 ORDER BY 1;

-- 4. Agent benchmark, directly from the movement table (no fan-out joins).
SELECT shipping_agent, COUNT(*) AS volume,
       ROUND(AVG(dwell_days), 2) AS avg_dwell_days,
       ROUND(AVG(doc_processing_hrs), 2) AS avg_doc_hours,
       SUM(demurrage_cost_eur) AS sample_demurrage_eur
FROM container_movements
GROUP BY shipping_agent ORDER BY avg_doc_hours DESC;

-- 5. Reconcile the browser's unfiltered headline KPIs.
SELECT COUNT(*) AS containers, ROUND(AVG(dwell_days), 3) AS avg_dwell_days,
       ROUND(100.0 * COUNT(*) FILTER (WHERE dwell_days > 5) / COUNT(*), 2) AS pct_over_five_days,
       ROUND(AVG(doc_processing_hrs), 2) AS avg_doc_hours,
       SUM(demurrage_cost_eur) AS sample_demurrage_eur
FROM container_movements;
