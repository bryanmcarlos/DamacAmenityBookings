function loadBryanBookings() {
    const url = "https://script.google.com/macros/s/AKfycbyzr9VlVCT2CzkquXtBMryGhxGZx6HOMzKDGO_6OLWleeY0fmSdXFz4nEHKFAz-vTCmpQ/exec";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const bookings = data[0].data;
            const appDiv = document.getElementById("app");
            appDiv.innerHTML = "";

            bookings.forEach(booking => {
                const card = document.createElement("div");
                card.className = "booking-card";

                const iconContainer = document.createElement("div");
                iconContainer.className = "booking-icon";
                const iconImage = document.createElement("img");
                iconImage.src = "icon.png";
                iconContainer.appendChild(iconImage);

                const detailsContainer = document.createElement("div");
                detailsContainer.className = "booking-details";
                detailsContainer.innerHTML = `
                    <h2>${booking.AmenityName}</h2>
                    <div class="status">
                        <img src="approvedIcon.png" alt="Approved">
                        <span>Approved</span>
                    </div>
                    <p><strong>Booking date:</strong> <span class="value">${formatDate(booking.BookingDate)}</span></p>
                    <p><strong>Time slot:</strong> <span class="value">${booking.TimeSlot}</span></p>
                    <div class="flex-row">
                        <div>
                            <p>Service Req Number:</p>
                            <p class="value">${booking.ServiceRequestNumber}</p>
                        </div>
                        <div>
                            <p>Service Req Raised Date:</p>
                            <p class="value">${formatDate(booking.BookingDate)}</p>
                        </div>
                    </div>
                `;

                card.appendChild(iconContainer);
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
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

document.getElementById("btn").addEventListener("click", loadBryanBookings);
