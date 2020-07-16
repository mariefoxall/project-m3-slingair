const url = new URL(window.location.href);

const id = url.searchParams.get("id");

fetch(`/users/${id}`)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const flightSpan = document.getElementById("flight");
    flightSpan.innerText = `${data.user.flight}`;
    const nameSpan = document.getElementById("name");
    nameSpan.innerText = `${data.user.givenName} ${data.user.surname}`;
    const seatSpan = document.getElementById("seat");
    seatSpan.innerText = `${data.user.seat}`;
    const emailSpan = document.getElementById("email");
    emailSpan.innerText = `${data.user.email}`;
  });
