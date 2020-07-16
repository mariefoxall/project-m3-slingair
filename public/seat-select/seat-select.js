const flightInput = document.getElementById("flight");
const seatsDiv = document.getElementById("seats-section");
const confirmButton = document.getElementById("confirm-button");

let selection = "";

const renderSeats = (seatsArray) => {
  document.querySelector(".form-container").style.display = "block";
  const seats = {};
  seatsArray.forEach((seat) => {
    seats[seat.id] = seat;
  });
  //   console.log(seats);
  const alpha = ["A", "B", "C", "D", "E", "F"];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement("ol");
    row.classList.add("row");
    row.classList.add("fuselage");
    seatsDiv.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      const seat = document.createElement("li");

      // Two types of seats to render
      const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;
      if (seats[seatNumber].isAvailable === true) {
        seat.innerHTML = seatAvailable;
        row.appendChild(seat);
      } else {
        seat.innerHTML = seatOccupied;
        row.appendChild(seat);
      }
      // TODO: render the seat availability based on the data...
    }
  }

  let seatMap = document.forms["seats"].elements["seat"];
  seatMap.forEach((seat) => {
    seat.onclick = () => {
      selection = seat.value;
      seatMap.forEach((x) => {
        if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove("selected");
        }
      });
      document.getElementById(seat.value).classList.add("selected");
      document.getElementById("seat-number").innerText = `(${selection})`;
      confirmButton.disabled = false;
    };
  });
};

const toggleFormContent = (event) => {
  document.getElementById("default-option").disabled = true;
  const flightNumber = flightInput.value;
  console.log("toggleFormContent: ", flightNumber);
  fetch(`/flights/${flightNumber}`)
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      renderSeats(data.flight);
    });
  // TODO: contact the server to get the seating availability
  //      - only contact the server if the flight number is this format 'SA###'.
  //      - Do I need to create an error message if the number is not valid?

  // TODO: Pass the response data to renderSeats to create the appropriate seat-type.
};

const handleReservation = (event) => {
  event.preventDefault();
  reservationID = document.getElementById("userID").value;

  window.location.href = `/view-reservation?id=${reservationID}`;
};

const handleConfirmSeat = (event) => {
  event.preventDefault();
  // TODO: everything in here!
  fetch("/users", {
    method: "POST",
    body: JSON.stringify({
      flight: flightInput.value,
      givenName: document.getElementById("givenName").value,
      surname: document.getElementById("surname").value,
      email: document.getElementById("email").value,
      seat: selection,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //get data
      console.log(data);
      data.id
        ? (window.location.href = `/confirmed?id=${data.id}`)
        : alert(
            "This email address is already registered! Limit one per person."
          );
    });
};

const initialSetup = () => {
  fetch("/flightNumbers")
    .then((res) => res.json())
    .then((flightNumbers) => {
      console.log(flightNumbers);
      flightNumbers.forEach((flight) => {
        const flightNumber = document.createElement("option");
        flightNumber.innerText = `${flight}`;
        flightNumber.value = `${flight}`;
        flightInput.appendChild(flightNumber);
      });
    });
};

initialSetup();

flightInput.addEventListener("change", toggleFormContent);
