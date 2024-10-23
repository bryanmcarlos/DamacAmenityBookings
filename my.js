function loadBryanBookings() {
    const url = "https://script.google.com/macros/s/AKfycbyzr9VlVCT2CzkquXtBMryGhxGZx6HOMzKDGO_6OLWleeY0fmSdXFz4nEHKFAz-vTCmpQ/exec";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const bookings = data[0].data; // Access the bookings array
            const appDiv = document.getElementById("app");
            appDiv.innerHTML = ""; // Clear any previous content

            bookings.forEach(booking => {
                // Create the card container
                const card = document.createElement("div");
                card.className = "booking-card";

                // Icon container
                const iconContainer = document.createElement("div");
                iconContainer.className = "booking-icon";
                const iconImage = document.createElement("img");
                iconImage.src = "damacBbqImage.png"; // Replace with your icon image path
                iconContainer.appendChild(iconImage);

                // Details container
                const detailsContainer = document.createElement("div");
                detailsContainer.className = "booking-details";
                detailsContainer.innerHTML = `
                    <h2>${booking.AmenityName}</h2>
                    <p><strong>Booking date:</strong> ${formatDate(booking.BookingDate)}</p>
                    <p><strong>Time slot:</strong> ${booking.TimeSlot}</p>
                    <p><strong>Service Req Number:</strong> ${booking.ServiceRequestNumber}</p>
                    <p><strong>Service Req Raised Date:</strong> ${formatDate(booking.BookingDate)}</p>
                `;

                // Status container
                const statusContainer = document.createElement("div");
                statusContainer.className = "status";
                const statusIcon = document.createElement("img");
                statusIcon.src = "DamacApprovedImage.png"; // Replace with your approved status icon
                statusContainer.appendChild(statusIcon);
                const statusText = document.createElement("span");
                statusText.textContent = booking.Status;
                statusContainer.appendChild(statusText);

                // Append all elements to the card
                card.appendChild(iconContainer);
                card.appendChild(detailsContainer);
                card.appendChild(statusContainer);

                // Append the card to the main container
                appDiv.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error loading bookings:", error);
            document.getElementById("app").textContent = "Error loading bookings.";
        });
}

// Helper function to format the date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Attach the event listener to the button
document.getElementById("btn").addEventListener("click", loadBryanBookings);
