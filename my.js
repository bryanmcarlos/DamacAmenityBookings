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

                // Icon container and title
                const topContainer = document.createElement("div");
                topContainer.className = "top-container";

                const iconContainer = document.createElement("div");
                iconContainer.className = "icon-container";
                const iconImage = document.createElement("img");
                iconImage.src = "icon.png"; // Replace with your icon image path
                iconImage.className = "booking-icon";
                iconContainer.appendChild(iconImage);

                const detailsTitle = document.createElement("div");
                detailsTitle.className = "details-title";
                detailsTitle.innerHTML = `
                    <h3>${booking.AmenityName}</h3>
                `;

                const statusContainer = document.createElement("div");
                statusContainer.className = "status-container";
                statusContainer.innerHTML = `
                    <span class="status-icon">&#10003;</span> Approved
                `;

                const menuIcon = document.createElement("div");
                menuIcon.className = "menu-icon";
                menuIcon.innerHTML = `
                    <span>⋮</span>
                `;

                // Assemble the top section
                topContainer.appendChild(iconContainer);
                topContainer.appendChild(detailsTitle);
                topContainer.appendChild(statusContainer);
                topContainer.appendChild(menuIcon);
                card.appendChild(topContainer);

                // Details container
                const detailsContainer = document.createElement("div");
                detailsContainer.className = "booking-details";
                detailsContainer.innerHTML = `
                    <p class="field-title">Booking date: <span>${formatDate(booking.BookingDate)}</span></p>
                    <p class="field-title">Time slot: <span>${booking.TimeSlot}</span></p>
                    <p class="field-title">Service Req Number: <span>${booking.ServiceRequestNumber}</span></p>
                    <p class="field-title">Service Req Raised Date: <span>${formatRaisedDate(booking.BookingDate)}</span></p>
                `;

                card.appendChild(detailsContainer);
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
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

function formatRaisedDate(dateStr) {
    const date = new Date(dateStr);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Attach the event listener to the button
document.getElementById("btn").addEventListener("click", loadBryanBookings);
