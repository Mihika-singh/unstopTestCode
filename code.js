const readline = require('readline');

// Initialize the seat availability matrix
const coachSeats = Array.from({ length: 11 }, () => Array(7).fill(0));
const bookedSeats = new Set();

// Function to check if consecutive seats are available in a row
function checkConsecutiveSeats(row, startSeat, numSeats) {
  for (let seat = startSeat; seat < startSeat + numSeats; seat++) {
    if (coachSeats[row][seat] === 1) {
      return false;
    }
  }
  return true;
}

// Function to reserve seats for a user
function reserveSeats(numSeats) {
  const seatsBooked = [];
  for (let row = 0; row < 11; row++) {
    if (numSeats === 0) {
      break;
    }
    if (row === 10) {
      // Last row with 3 seats
      if (checkConsecutiveSeats(row, 0, numSeats)) {
        for (let seat = 0; seat < numSeats; seat++) {
          coachSeats[row][seat] = 1;
          bookedSeats.add(`${row}-${seat}`);
          seatsBooked.push([row, seat]);
          numSeats--;
        }
      }
    } else {
      // Rows with 7 seats
      for (let startSeat = 0; startSeat < 5; startSeat++) {
        if (checkConsecutiveSeats(row, startSeat, numSeats)) {
          for (let seat = startSeat; seat < startSeat + numSeats; seat++) {
            coachSeats[row][seat] = 1;
            bookedSeats.add(`${row}-${seat}`);
            seatsBooked.push([row, seat]);
            numSeats--;
            if (numSeats === 0) {
              break;
            }
          }
        }
        if (numSeats === 0) {
          break;
        }
      }
    }
  }
  return seatsBooked;
}

// Function to display the coach layout
function displayCoach() {
  console.log("Coach Layout:");
  for (let row = 0; row < 11; row++) {
    let rowSeats = row < 10 ? 7 : 3;
    let rowLayout = "";
    for (let seat = 0; seat < rowSeats; seat++) {
      const seatStatus = bookedSeats.has(`${row}-${seat}`) ? "X" : "O";
      rowLayout += seatStatus + " ";
    }
    console.log(rowLayout);
  }
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Main program loop
function runProgram() {
  displayCoach();
  rl.question("Enter the number of seats to reserve (0 to exit): ", (numSeats) => {
    numSeats = parseInt(numSeats);
    if (numSeats === 0) {
      rl.close();
      return;
    }
    if (numSeats > 7 || numSeats < 1) {
      console.log("Invalid number of seats. Please try again.");
      runProgram();
    } else {
      const seatsBooked = reserveSeats(numSeats);
      if (seatsBooked.length > 0) {
        console.log("Seats booked successfully:");
        seatsBooked.forEach((seat) => {
          console.log(`Row ${seat[0] + 1}, Seat ${seat[1] + 1}`);
        });
      } else {
        console.log("No seats available in one row. Please try again with a smaller number of seats.");
        runProgram();
      }
    }
  });
}

runProgram();
