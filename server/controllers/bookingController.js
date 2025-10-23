import Booking from "../models/Booking.js";
import Show from "../models/Show.js";



// Function to check availability of selected seats for a movie
const checkSeatsAvailability = async (showID, selectedSeats) => {
  try {
    const showData = await Show.findById(showID);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats;

    const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

    return !isAnySeatTaken;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

export const createBooking = async (req, res)=>{
  try {

    const userId = req.auth().userId;
    const {showId, selectedSeats} = req.body;
    const { origin } = req.headers;

    console.log('Booking request received:', { userId, showId, selectedSeats });

    // Check if the seat is available for the selected show
    const isAvailable = await checkSeatsAvailability(showId, selectedSeats)

    console.log('Seat availability check:', isAvailable);

    if(!isAvailable){
      return res.json({success: false, message: "Selected Seats are not available."})
    }
    // Get the show details
    const showData = await Show.findById(showId).populate('movie');

    if (!showData) {
      console.log('Show not found for ID:', showId);
      return res.json({success: false, message: "Show not found"});
    }

    console.log('Show data found:', showData._id);

// Create a new booking
    const booking = await Booking.create({
        user: userId,
        show: showId,
        amount: showData.showPrice * selectedSeats.length,
        bookedSeats: selectedSeats
})

    console.log('Booking created:', booking._id);

selectedSeats.map((seat)=>{
  showData.occupiedSeats[seat] = userId;
})

showData.markModified('occupiedSeats');

await showData.save();

console.log('Show updated with occupied seats');

//stripe Gateway Initialize



res.json({success: true, message: 'Booked successfully'})

  } catch(error){
    console.log('Booking error:', error.message);
    res.json({success: false, message: error.message})
    
  }
}

export const getOccupiedSeats = async (req, res)=>{
    try {
        const {showId} = req.params;
        const showData = await Show.findById(showId)

        const occupiedSeats = Object.keys(showData.occupiedSeats)
        res.json({success: true, occupiedSeats})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    
    }
}