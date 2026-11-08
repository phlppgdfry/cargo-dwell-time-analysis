# Business requirements

## Problem and scope

An analyst needs to investigate how long containers stay in the yard and which
delay reasons deserve investigation. The demonstrator uses 500 synthetic
movements from the original workbook. It does not connect to an operating terminal.

## Required outcomes

- Calculate mean dwell, share above five days, documentation hours and sample
  demurrage from the same filtered movement rows.
- Filter by shipping agent, arrival year, search text and delayed-container reason.
- Inspect monthly trends and individual records; export the current selection.
- Model documentation improvements separately from observed sample metrics.
- Reproduce the unfiltered results with PostgreSQL queries and an explicit schema.

## Acceptance criteria

The full selection contains 500 records, averages 5.982 dwell days and totals
€199,900 sample demurrage. CSV and JSON match the workbook. No annual savings,
real stakeholder interviews or realised operational gains are inferred from the
synthetic sample. Empty filters remain usable and the interface works on mobile.

## Businesscase assumptions

The historical 6.4-day baseline, €2.1M annual cost and 25% improvement target are
illustrative planning assumptions. Validating an actual investment requires
representative operational data, stakeholder discovery and a controlled pilot.
