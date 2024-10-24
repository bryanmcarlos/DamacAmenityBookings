function loadBryanBookings() {
    const url = "https://script.google.com/macros/s/AKfycbyzr9VlVCT2CzkquXtBMryGhxGZx6HOMzKDGO_6OLWleeY0fmSdXFz4nEHKFAz-vTCmpQ/exec";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const bookings = data[0].data;
            const appDiv = document.getElementById("app");
            appDiv.innerHTML = "";

            bookings.forEach(booking => {
                // Create the card container
                const card = document.createElement("div");
                card.className = "booking-card";

                // Status container (aligned top right)
                const statusContainer = document.createElement("div");
                statusContainer.className = "status";
                const statusIcon = document.createElement("img");
                statusIcon.src = "approvedIcon.png";
                statusIcon.alt = "Approved";
                statusContainer.appendChild(statusIcon);
                const statusText = document.createElement("span");
                statusText.textContent = "Approved";
                statusContainer.appendChild(statusText);

                // Icon container (Only one icon with adjusted size)
                const iconContainer = document.createElement("div");
                iconContainer.className = "booking-icon";
                const iconImage = document.createElement("img");
                iconImage.src = "icon.png";
                iconImage.alt = "Amenity Icon";
                iconContainer.appendChild(iconImage);

                const menuIcon = document.createElement("div");
                    menuIcon.className = "menu-icon";
                    menuIcon.innerHTML = `
                        <span>⋮</span>
                    `;

                // Details container
                const detailsContainer = document.createElement("div");
                detailsContainer.className = "booking-details";
                detailsContainer.innerHTML = `
                    <h2>${booking.AmenityName}</h2>
                    <p style="margin-bottom: 6px;">Booking date</p>
                    <p class="valueDiv" style="margin-bottom: 24px;">${formatDate(booking.BookingDate, true)}</p>
                    <p style="margin-bottom: 6px;">Time slot</p>
                    <p class="valueDiv" style="margin-bottom: 16px;">${booking.TimeSlot}</p>
                    <div class="flex-row">
                        <div>
                            <p style="margin-bottom: 6px;">Service Req Number:</p>
                            <p class="valueDiv">${booking.ServiceRequestNumber}</p>
                        </div>
                        <div class="ServiceReqDiv">
                            <p>Service Req</p>
                            <p style="margin-bottom: 6px;">Raised Date</p>
                            <p class="valueDiv">${formatDate(booking.BookingDate, false)}</p>
                        </div>
                    </div>
                `;

                // Append all elements to the card
                card.appendChild(statusContainer);
                card.appendChild(iconContainer);
                card.appendChild(detailsContainer);

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
function formatDate(dateStr, includeWeekday = true) {
    // Parse the date string as a Date object
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    // Get the day, month, and year parts
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear();

    // Format the date with or without the weekday
    if (includeWeekday) {
        const weekday = date.toLocaleString('en-GB', { weekday: 'short' });
        return `${weekday}, ${day}-${month}-${year}`;
    } else {
        return `${day}-${month}-${year}`;
    }
}


// Attach the event listener to the button
document.getElementById("btn").addEventListener("click", loadBryanBookings);
