const axios = require("axios");

const bookSeat = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/bookings/book",
      {
        trainNumber: "523",
        bookingDate: "2024-12-15",
      },
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InVzZXIiLCJpYXQiOjE3MzMxOTk3MzN9.z9lxOz1IuVoFQ0hlJ1SH1b1PDzigoxMIWh_8zYqLOC0",
        },
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
};

// adjust the number of concurrent requests as per your need
for (let i = 0; i < 90; i++) {
  bookSeat();
}
