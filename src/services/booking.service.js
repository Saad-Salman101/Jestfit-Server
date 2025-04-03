const httpStatus = require("http-status");
const { Booking, Location } = require("../models");
const ApiError = require("../utils/APIError");
const { default: mongoose } = require("mongoose");
const { paymentStatus } = require("../config/roles");

/**
 * Create a Booking
 * @param {Object} BookingBody
 * @returns {Promise<Booking>}
 */
const createBooking = async (body) => {
  const result = await Booking.insertMany(body);
  return result;
};

/**
 * Query for Booking
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBooking = async (filter, options) => {
  const result = await Booking.paginate(
    filter,
    options
    // [
    //     { path: "locationID" },
    //     { path: "fieldID" },
    //     { path: "customerID" }
    // ]
  );
  return result;
};

/**
 * Get Booking by id
 * @param {ObjectId} id
 * @returns {Promise<Booking>}
 */
const getBookingById = async (id) => {
  const result = await Booking.findById(id);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  return result;
};

/**
 * Get Booking by email
 * @param {string} email
 * @returns {Promise<Booking>}
 */

/**
 * Update Booking by id
 * @param {ObjectId} BookingId
 * @param {Object} updateBody
 * @returns {Promise<Booking>}
 */
const updateBookingById = async (id, updateBody) => {
  const check = await getBookingById(id);
  if (!check) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  }
  const result = await Booking.findByIdAndUpdate(id, updateBody, { new: true });
  return result;
};

const updateBookings = async (filter, body) => {
  const result = await Booking.updateMany(filter, { $set: body }, { new: true });
  return result;
};

/**
 * Delete Booking by id
 * @param {ObjectId} BookingId
 * @returns {Promise<Booking>}
 */
const deleteBookingById = async (BookingId) => {
  const location = await getBookingById(BookingId);
  const result = await Booking.findByIdAndDelete(location.id);
  return result;
};

const getBookingsByOrderID = async (orderID) => {
  const result = await Booking.find({ orderID }).populate("fieldID").populate("locationID");
  return result;
};

const getStatistics = async (vendorId) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Helper function to get statistics for a given time period
    const getStatsForPeriod = async (startDate) => {
      const bookings = await Booking.find({
        vendorID: vendorId,
        createdAt: { $gte: startDate },
      });

      const totalPrice = bookings.reduce((sum, booking) => sum + booking.price, 0);
      const totalOrders = bookings.length;
      const cancelledOrders = bookings.filter((booking) => booking.deletedAt !== null).length;
      const totalCancelledPrice = bookings
        .filter((booking) => booking.deletedAt !== null)
        .reduce((sum, booking) => sum + booking.price, 0);

      return { totalPrice, totalOrders, cancelledOrders, totalCancelledPrice };
    };

    // Function to get overall statistics for all bookings
    const getOverallStats = async () => {
      const allBookings = await Booking.find({ vendorID: vendorId });

      const totalPrice = allBookings.reduce((sum, booking) => sum + booking.price, 0);
      const totalOrders = allBookings.length;
      const cancelledOrders = allBookings.filter(
        (booking) => booking.deletedAt !== null
      ).length;
      const totalCancelledPrice = allBookings
        .filter((booking) => booking.deletedAt !== null)
        .reduce((sum, booking) => sum + booking.price, 0);

      return { totalPrice, totalOrders, cancelledOrders, totalCancelledPrice };
    };

    // Get statistics for day, month, year, and overall
    const dayStats = await getStatsForPeriod(startOfDay);
    const monthStats = await getStatsForPeriod(startOfMonth);
    const yearStats = await getStatsForPeriod(startOfYear);
    const overallStats = await getOverallStats();

    return {
      day: dayStats,
      month: monthStats,
      year: yearStats,
      overall: overallStats,
    };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error;
  }
};

// const addBookings = async (bookingsArray) => {
//   const conflicts = [];
//   const savedBookings = [];
//   let message = "";

//   for (const bookingData of bookingsArray) {
//     const { date, fieldID, slotID, from, to, expiresAt } = bookingData;

//     // Check for conflicting bookings in the database
//     var existingBookings = await Booking.find({
//       date: date,
//       fieldID: fieldID,
//       slotID: slotID,
//       $or: [
//         { from: { $lt: to }, to: { $gt: from } }, // Check time overlap
//       ],
//     });
//   }
//   if (existingBookings.length > 0) {
//     // If conflicts exist, add them to the conflicts array
//     message = "Booking exists";
//     conflicts.push({ bookingData, conflictingBookings: existingBookings });
//   } else {
//     message = "Bookings Created Successfully";
//     // If no conflict, save the booking
//     const orderData = {
//       paymentStatus: "unpaid",
//       bookingStatus: "processing",
//       customerID: req.body.cartData[0].customerID,
//       image: "N/A",
//       amount: parseFloat(req.body.amount),
//     };
//     const order = await orderService.createOrder(orderData);
//     const body = bookingData.map((item, index) => {
//       delete item._id;
//       return {
//         locationID: item.locationID.id,
//         customerName: req.body.name,
//         fieldID: item.fieldID,
//         price: item.price,
//         to: item.to,
//         from: item.from,
//         date: addFiveHours(item.date),
//         slotID: item.slotID,
//         orderID: order.id,
//         amount: req.body.amount,
//         image: req.fileData ? req.fileData : "FastBooking",
//       };
//     });
//     const result = await bookingService.createBooking(body);

//     savedBookings.push(result);
//   }

//   return {
//     conflicts,
//     savedBookings,
//     message,
//   };
// };

// const addBookings = async (bookingsArray) => {
//   const conflicts = [];
//   let message = "Bookings Created Successfully";

//   // Check for conflicts in all bookings before any creation
//   for (const bookingData of bookingsArray) {
//     const { date, fieldID, slotID, from, to } = bookingData;

//     // Find any conflicting bookings
//     const existingBookings = await Booking.find({
//       date: date,
//       fieldID: fieldID,
//       slotID: slotID,
//       $or: [
//         { from: { $lt: to }, to: { $gt: from } }, // Check time overlap
//       ],
//     });

//     if (existingBookings.length > 0) {
//       // If conflicts exist, add them to the conflicts array and set the message
//       message = "Conflicting bookings exist";
//       conflicts.push({ bookingData, conflictingBookings: existingBookings });
//     }
//   }

//   // If there are conflicts, return without creating order or bookings
//   if (conflicts.length > 0) {
//     return {
//       conflicts,
//       savedBookings: [],
//       message,
//     };
//   }

//   // No conflicts found, create the order once
//   const orderData = {
//     paymentStatus: "unpaid",
//     bookingStatus: "processing",
//     customerID: bookingsArray[0].customerID,
//     image: "N/A",
//     amount: bookingsArray.reduce((sum, item) => sum + item.price, 0), // Sum price
//   };
//   const order = await orderService.createOrder(orderData);

//   // Prepare booking entries with order ID and necessary details
//   const bookingDataArray = bookingsArray.map((item) => {
//     item.slotID = item._id;
//     item.expiresAt = order.createdAt;
//     delete item._id;
//     return {
//       ...item,
//       orderID: order.id,
//       date: item.date, // Adjust date as needed
//       image: item.image || "FastBooking",
//     };
//   });

//   // Save all bookings together in a single operation
//   const savedBookings = await createBooking(bookingDataArray);

//   return {
//     conflicts,
//     savedBookings,
//     message,
//   };
// };

const getTodayBookingsGrouped = async (vendorID) => {
  console.log(new Date(new Date().setHours(5, 0, 0, 0)), "<==== time");
  try {
    const result = await Location.aggregate([
      {
        $match: {
          vendorID: new mongoose.Types.ObjectId(vendorID),
        },
      },
      // Lookup fields within each location
      {
        $lookup: {
          from: "fields",
          localField: "_id",
          foreignField: "locationID",
          as: "fields",
        },
      },
      {
        $unwind: {
          path: "$fields",
          preserveNullAndEmptyArrays: true, // Ensure locations without fields are still included
        },
      },
      // Lookup bookings for each field, filtered by today's date
      {
        $lookup: {
          from: "bookings",
          localField: "fields._id",
          foreignField: "fieldID",
          as: "fields.bookings",
          pipeline: [
            {
              $match: {
                vendorID: new mongoose.Types.ObjectId(vendorID),
                date: new Date(new Date().setHours(5, 0, 0, 0)), // Only bookings for today
              },
            },
            // Lookup orders inside bookings
            {
              $lookup: {
                from: "orders",
                localField: "orderID",
                foreignField: "_id",
                as: "orderDetails",
              },
            },
            {
              $unwind: {
                path: "$orderDetails",
                preserveNullAndEmptyArrays: true, // Preserve bookings without orders
              },
            },
            // Lookup customers inside orders
            {
              $lookup: {
                from: "users",
                localField: "orderDetails.customerID",
                foreignField: "_id",
                as: "orderDetails.customerDetails",
              },
            },
            {
              $unwind: {
                path: "$orderDetails.customerDetails",
                preserveNullAndEmptyArrays: true, // Preserve orders without customers
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: "$_id", // Group by location ID
          locationDetails: { $first: "$$ROOT" }, // Preserve location details
          fields: { $push: "$fields" }, // Accumulate fields into an array
        },
      },
      {
        $project: {
          locationDetails: {
            images: 1,
            name: 1,
            _id: 1, // Include the location's name and ID
            vendorID: 1, // Include the vendorID
          },
          fields: {
            _id: 1,
            name: 1,
            description: 1,
            bookings: {
              _id: 1,
              orderID: 1,
              date: 1,
              slotID: 1,
              to: 1,
              from: 1,
              orderDetails: {
                _id: 1,
                customerID: 1,
                customerName: 1,
                customerEmail: 1,
                customerContactNumber: 1,
                paymentStatus: 1,
                customerDetails: {
                  _id: 1,
                  name: 1,
                  email: 1,
                },
              },
            },
          },
        },
      },
      {
        $project: {
          location: {
            images: "$locationDetails.images",
            name: "$locationDetails.name",
            vendorID: "$locationDetails.vendorID",
            fields: "$fields",
          },
        },
      },
    ]);

    console.log(result); // Check the result structure
    return result;
  } catch (error) {
    console.error("Error fetching locations with bookings:", error);
    throw error;
  }
};

const findBooking = async (params) => {
  console.log(params, "=== params");
  return await Booking.find(params);
};

module.exports = {
  updateBookings,
  // addBookings,
  createBooking,
  queryBooking,
  getBookingById,
  updateBookingById,
  deleteBookingById,
  getBookingsByOrderID,
  getStatistics,
  findBooking,
  getTodayBookingsGrouped,
};
