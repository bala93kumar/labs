
// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ---- In-memory "database"
const flights = [
  { id: 'MAA-DEL-101', from: 'MAA', to: 'DEL', date: '2026-01-05', depTime: '08:10', arrTime: '10:30', fareINR: 4999, seatsAvailable: 9, carrier: 'AI' },
  { id: 'MAA-BOM-202', from: 'MAA', to: 'BOM', date: '2026-01-05', depTime: '12:45', arrTime: '14:40', fareINR: 4499, seatsAvailable: 5, carrier: '6E' },
  { id: 'DEL-MAA-303', from: 'DEL', to: 'MAA', date: '2026-01-05', depTime: '19:05', arrTime: '21:25', fareINR: 5299, seatsAvailable: 3, carrier: 'Vistara' }
];

const bookings = {}; // key: pnr -> booking object

// ---- Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'flight-pps-mock', timestamp: new Date().toISOString() });
});

// ---- Search flights
// Example: GET /flights?from=MAA&to=DEL&date=2026-01-05
app.get('/flights', (req, res) => {
  const { from, to, date } = req.query;
  const results = flights.filter(f =>
    (!from || f.from === from) &&
    (!to || f.to === to) &&
    (!date || f.date === date)
  );
  res.json({ count: results.length, results });
});

// ---- Create booking (PNR)
// POST /bookings
// Body: { flightId, passengers: [{firstName,lastName,gender,dob}], contact: {email, phone} }
app.post('/bookings', (req, res) => {
  const { flightId, passengers = [], contact = {} } = req.body || {};
  const flight = flights.find(f => f.id === flightId);

  if (!flight) return res.status(404).json({ error: 'FLIGHT_NOT_FOUND' });
  if (passengers.length < 1) return res.status(400).json({ error: 'NO_PASSENGERS' });
  if (flight.seatsAvailable < passengers.length) return res.status(409).json({ error: 'INSUFFICIENT_SEATS' });

  const pnr = uuidv4().slice(0, 8).toUpperCase(); // short PNR-like code
  const totalFareINR = flight.fareINR * passengers.length;

  const booking = {
    pnr,
    flightId,
    status: 'PENDING_PAYMENT',
    passengers,
    contact,
    pricing: { currency: 'INR', baseFare: flight.fareINR, paxCount: passengers.length, total: totalFareINR },
    createdAt: new Date().toISOString()
  };

  bookings[pnr] = booking;
  flight.seatsAvailable -= passengers.length;

  res.status(201).json(booking);
});

// ---- Get booking by PNR
// GET /bookings/:pnr
app.get('/bookings/:pnr', (req, res) => {
  const { pnr } = req.params;
  const booking = bookings[pnr];
  if (!booking) return res.status(404).json({ error: 'BOOKING_NOT_FOUND' });
  res.json(booking);
});

// ---- Cancel booking
// DELETE /bookings/:pnr
app.delete('/bookings/:pnr', (req, res) => {
  const { pnr } = req.params;
  const booking = bookings[pnr];
  if (!booking) return res.status(404).json({ error: 'BOOKING_NOT_FOUND' });

  booking.status = 'CANCELLED';
  booking.cancelledAt = new Date().toISOString();
  res.json({ pnr, status: booking.status });
});

// ---- Mock payment
// POST /payments
// Body: { pnr, amount, method }
// Changes booking status to CONFIRMED if amount matches
app.post('/payments', (req, res) => {
  const { pnr, amount, method = 'CARD' } = req.body || {};
  const booking = bookings[pnr];
  if (!booking) return res.status(404).json({ error: 'BOOKING_NOT_FOUND' });

  const due = booking.pricing?.total ?? 0;
  if (amount !== due) return res.status(400).json({ error: 'AMOUNT_MISMATCH', due });

  booking.status = 'CONFIRMED';
  booking.payment = { amount, method, currency: 'INR', paidAt: new Date().toISOString(), txnId: uuidv4() };

  res.json({ pnr, status: booking.status, payment: booking.payment });
});

// ---- Start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Mock flight PPS listening on port ${PORT}`));
