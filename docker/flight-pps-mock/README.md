
# Flight PPS/PSS Mock API (Docker)

A minimal mock REST API to test flight-booking endpoints:
- Search flights: `GET /flights?from=MAA&to=DEL&date=YYYY-MM-DD`
- Create booking (PNR): `POST /bookings`
- Retrieve booking: `GET /bookings/:pnr`
- Cancel booking: `DELETE /bookings/:pnr`
- Payment: `POST /payments`
- Health: `GET /health`

## Build & Run with Docker

```bash
# From the project root:
docker build -t flight-pps-mock:latest .
docker run -it --rm -p 8080:8080 flight-pps-mock:latest
