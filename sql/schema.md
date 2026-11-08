# Canonical dataset schema

`sql/schema.sql` is the executable PostgreSQL definition. Column order matches
`demo/container_movements.csv`, exported from the movement sheet in the workbook.

| Column | Type | Meaning |
|---|---|---|
| container_id | varchar(30), primary key | Synthetic unique movement ID |
| arrival_date / departure_date | date | Terminal arrival and departure |
| dwell_days | integer | Departure minus arrival; constrained in schema |
| shipper / shipping_agent | varchar(100) | Fictional case-study attribution |
| container_type / cargo_type | varchar | Equipment and commodity |
| delay_reason | varchar(100) | Primary reason, or No delay |
| doc_processing_hrs | numeric(8,2) | Documentation processing hours |
| demurrage_cost_eur | numeric(12,2) | Sample record's cost |

There are no separate agent or delay tables in this flat source export. Queries
group directly on the movement rows, avoiding duplicate joins and missing IDs.
The five-day threshold is a demo analysis rule, not a contractual demurrage tariff.

From the repository root in `psql`:

```sql
\i sql/schema.sql
\copy container_movements FROM 'demo/container_movements.csv' CSV HEADER
\i sql/queries.sql
```

Import into an empty table. For a deliberate reload, clear the demonstration
table first; the primary key rejects duplicate imports.
