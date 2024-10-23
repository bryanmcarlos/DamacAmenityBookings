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
                iconImage.style.width = "24px"; // Adjust the icon size
                iconImage.style.height = "24px";
                iconContainer.appendChild(iconImage);

                // Details container
                const detailsContainer = document.createElement("div");
                detailsContainer.className = "booking-details";
                detailsContainer.innerHTML = `
                    <h2>${booking.AmenityName}</h2>
                    <p><strong>Booking date</strong></p> <p class="value">${formatDate(booking.BookingDate)}</p>
                    <p><strong>Time slot</strong></p> <p class="value">${booking.TimeSlot}</p>
                    <div class="flex-row">
                        <div>
                            <p>Service Req Number</p>
                            <p class="value">${booking.ServiceRequestNumber}</p>
                        </div>
                        <div>
                            <p>Service Req</p>
                             <p>Raised Date</p>
                            <p class="value">${formatDate(booking.BookingDate, false)}</p>
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
    // Parse the date string in "YYYY-MM-DD" format
    const [year, month, day] = dateStr.split("-");
    const date = new Date(year, month - 1, day);

    const options = {
        weekday: includeWeekday ? 'short' : undefined,
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    };

    // Format the date using the specified options
    const formattedDate = date.toLocaleDateString('en-GB', options).replace(/ /g, '-');

    if (includeWeekday) {
        // If the weekday is included, format it as "Wed, 30-Oct-2024"
        const [weekday, day, month, year] = formattedDate.split('-');
        return `${weekday}, ${day}-${month}-${year}`;
    } else {
        // If the weekday is not included, format it as "30-Oct-2024"
        const [, day, month, year] = formattedDate.split('-'); // Remove the weekday part
        return `${day}-${month}-${year}`;
    }
}


// Attach the event listener to the button
document.getElementById("btn").addEventListener("click", loadBryanBookings);
