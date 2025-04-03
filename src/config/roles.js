const roles = ["superadmin", "admin"];

const types = ["customer", "vendor", "admin"];

const paymentStatus = [
  "processing",
  "confirmed",
  "cancelled",
  "failed",
  "verifying",
  "paid",
  "unpaid",
];
const bookingStatus = ["confirmed", "processing", "cancelled", "dispute"];

module.exports = {
  roles,
  types,
  paymentStatus,
  bookingStatus,
};
