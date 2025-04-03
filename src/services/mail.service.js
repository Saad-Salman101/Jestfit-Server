const nodemailer = require("nodemailer");
const config = require("../config/config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.mailer.email,
    pass: config.mailer.password,
  },
  logger: true,
  debug: true,
});
// const generateBookingConfirmationEmail = (booking) => {
//   const {
//     customerID: { firstName, lastName, email, phoneNumber },
//     paymentStatus,
//     bookingStatus,
//     amount,
//     createdAt,
//     id,
//   } = booking;

//   const formattedDate = new Date(createdAt).toLocaleDateString();

//   return `
//       <div style="font-family: Arial, sans-serif; color: #333;">
//         <h2 style="color: #FF001F;">Booking Confirmation</h2>
//         <p>Dear ${firstName} ${lastName},</p>
//         <p>We are excited to confirm your booking for our playing slots! Below are the details of your booking:</p>

//         <h3 style="color: #FF001F;">Booking Details</h3>
//         <table style="width: 100%; border-collapse: collapse;">
//           <tr>
//             <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Booking ID</th>
//             <td style="border: 1px solid #ddd; padding: 8px;">${id}</td>
//           </tr>
//           <tr>
//             <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Customer Name</th>
//             <td style="border: 1px solid #ddd; padding: 8px;">${firstName} ${lastName}</td>
//           </tr>
//           <tr>
//             <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Email</th>
//             <td style="border: 1px solid #ddd; padding: 8px;">${email}</td>
//           </tr>
//           <tr>
//             <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Phone Number</th>
//             <td style="border: 1px solid #ddd; padding: 8px;">${phoneNumber}</td>
//           </tr>
//           <tr>
//             <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Amount Paid</th>
//             <td style="border: 1px solid #ddd; padding: 8px;"> PKR ${amount}</td>
//           </tr>
//           <tr>
//             <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Booking Status</th>
//             <td style="border: 1px solid #ddd; padding: 8px;">${bookingStatus}</td>
//           </tr>
//           <tr>
//             <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Payment Status</th>
//             <td style="border: 1px solid #ddd; padding: 8px;">${paymentStatus}</td>
//           </tr>
//           <tr>
//             <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Booking Date</th>
//             <td style="border: 1px solid #ddd; padding: 8px;">${formattedDate}</td>
//           </tr>
//         </table>

//         <p>If you have any questions or need to make changes to your booking, please don't hesitate to contact us.</p>
//         <p>Thank you for choosing our service, and we look forward to seeing you soon!</p>

//         <p>Best regards,</p>
//         <p>The JestFit Team</p>
//         <div style="background-color: #FF001F; color: #fff; padding: 10px; text-align: center; margin-top: 20px;">
//           <p>Contact Us: <a href="mailto:support@jestfit.com" style="color: #fff;">support@jestfit.com</a> | Phone: +123456789</p>
//           <p>Follow us on social media!</p>
//         </div>
//       </div>
//     `;
// };

function generateEmailTemplate(customer, booking, slots, totalAmount) {
  let slotRows = "";

  // Loop through each slot to generate rows for the table
  slots.forEach((slot) => {
    slotRows += `
        <tr>
        <td>${slot.locationID.name}</td>
          <td>${slot.fieldID.name}</td>
          <td>${new Date(slot.date).toLocaleDateString()}</td>
          <td>${slot.to} - ${slot.from}</td>
          <td>PKR ${slot.price}</td>
        </tr>
      `;
  });

  // Return the full HTML template
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .header { background-color: #FF001F; color: #fff; padding: 10px; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; border: 1px solid #ddd; }
            th { background-color: #FF001F; color: white; }
            .footer { margin-top: 20px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Booking Confirmation</h1>
          </div>
          <p>Dear ${customer.firstName} ${customer.lastName},</p>
          <p>Thank you for your booking! Your order has been confirmed.</p>          
          <table>
            <thead>
              <tr>
              <th>Location</th>
                <th>Field</th>
                <th>Date</th>
                <th>Time</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${slotRows} <!-- Insert dynamically generated slot rows here -->
            </tbody>
          </table>
          <p>If you have any questions or need to make changes to your booking, please don't hesitate to contact us.</p>
          <p>Thank you for choosing our service, and we look forward to seeing you soon!</p>
          <h3>Total Amount Paid: PKR ${totalAmount}</h3>
          <p>Your payment status is: <strong>${booking.paymentStatus}</strong></p>
          <p>Your booking status is: <strong>${booking.bookingStatus}</strong></p>
          <img src="${booking.image}" alt="Booking Image" style="width:100%; max-width:200px;"/>
          <div style="background-color: #FF001F; color: #fff; padding: 5px; text-align: center; margin-top: 20px;">
           <p>Contact Us: <a href="mailto:support@jestfit.com" style="color: #fff;">support@jestfit.com</a> | Phone: +123456789</p>
           <p style="color: #fff;">Follow us on social media!</p>
        </div>
        </body>
      </html>
    `;
}
const sendBookingConfirmation = async (bookings, order) => {
  const mailOptions = {
    from: '"JestFit Team" <no-reply@jestfit.com>',
    to: order.customerID.email,
    subject: "Booking Confirmation - JestFit",
    html: generateEmailTemplate(order.customerID, order, bookings, order.amount),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendBookingConfirmation };
