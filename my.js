function loadBryanBookings(filterDate = null) {
    const url = "https://script.google.com/macros/s/AKfycbyzr9VlVCT2CzkquXtBMryGhxGZx6HOMzKDGO_6OLWleeY0fmSdXFz4nEHKFAz-vTCmpQ/exec";

    // Show the loading spinner
    const spinner = document.getElementById("loading-spinner");
    spinner.style.display = "block";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let bookings = data[0].data;

            if (filterDate) {
                bookings = bookings.filter(booking => {
                    const bookingDate = new Date(booking.BookingDate).toISOString().split('T')[0];
                    return bookingDate === filterDate -1;
                });
            }

            // Sorting bookings first by date, then by time in ascending order
            bookings.sort((a, b) => {
                const dateA = new Date(a.BookingDate);
                const dateB = new Date(b.BookingDate);
                const timeA = get24HourTime(a.TimeSlot.split(" - ")[0]);
                const timeB = get24HourTime(b.TimeSlot.split(" - ")[0]);

                return dateA - dateB || timeA - timeB; // Sort by date first, then time
            });

            const appDiv = document.getElementById("app");
            appDiv.innerHTML = "";

            bookings.forEach(booking => {
                const accountCode = getAccountCode(booking.Account);
                const card = document.createElement("div");
                card.className = "booking-card";

                const statusContainer = document.createElement("div");
                statusContainer.className = "status";
                const statusIcon = document.createElement("img");
                statusIcon.src = "approvedIcon.png";
                statusIcon.alt = "Approved";
                statusContainer.appendChild(statusIcon);
                const statusText = document.createElement("span");
                statusText.textContent = "Approved";
                statusContainer.appendChild(statusText);

                const iconContainer = document.createElement("div");
                iconContainer.className = "booking-icon";
                const iconImage = document.createElement("img");
                iconImage.src = "icon.png";
                iconImage.alt = "Amenity Icon";
                iconContainer.appendChild(iconImage);

                const menuIcon = document.createElement("div");
                menuIcon.className = "menu-icon";
                menuIcon.innerHTML = `<span>⋮</span>`;

                const detailsContainer = document.createElement("div");
                detailsContainer.className = "booking-details";
                detailsContainer.innerHTML = `
                    <h2>${booking.AmenityName}</h2>
                    <p style="margin-bottom: 6px;">Booking date</p>
                    <p class="valueDiv" style="margin-bottom: 24px;">${formatDate(booking.BookingDate, true)}</p>
                    <p style="margin-bottom: 6px;">Time slot</p>
                    <p class="valueDiv" style="margin-bottom: 16px;">${formatTimeSlot(booking.TimeSlot)}</p>
                    <div class="flex-row">
                        <div>
                            <p style="margin-bottom: 6px;">Service Req Number</p>
                            <p class="valueDiv">${booking.ServiceRequestNumber}</p>
                            <p class="valueDiv">${accountCode}</p>
                        </div>
                        <div class="ServiceReqDiv">
                            <p>Service Req</p>
                            <p style="margin-bottom: 6px;">Raised Date</p>
                            <p class="valueDiv">${formatDate(booking.CreationDate, false)}</p>
                        </div>
                    </div>
                `;

                card.appendChild(statusContainer);
                card.appendChild(iconContainer);
                card.appendChild(detailsContainer);
                appDiv.appendChild(card);
            });

            // Hide the loading spinner after loading is complete
            spinner.style.display = "none";
        })
        .catch(error => {
            console.error("Error loading bookings:", error);
            document.getElementById("app").textContent = "Error loading bookings.";
            spinner.style.display = "none"; // Hide spinner in case of error
        });
}

// Function to get the correct 24-hour time format for sorting
function get24HourTime(timeStr) {
    const [hour, minute] = timeStr.split(":").map(Number);
    return hour * 60 + minute; // Convert to total minutes for comparison
}

// Fixes the date picker issue ensuring it works with correct offsets
document.getElementById("datePicker").addEventListener("change", function() {
    const selectedDate = new Date(this.value);
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Ensure correct format
    loadBryanBookings(formattedDate);
});

// Function to format dates properly
function formatDate(dateStr, includeWeekday = true) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear();
    if (includeWeekday) {
        const weekday = date.toLocaleString('en-GB', { weekday: 'short' });
        return `${weekday}, ${day}-${month}-${year}`;
    } else {
        return `${day}-${month}-${year}`;
    }
}

// Convert time slots to 12-hour format
function formatTimeSlot(timeSlot) {
    const [startTime, endTime] = timeSlot.split(" - ");
    const start12Hour = convertTo12Hour(startTime);
    const end12Hour = convertTo12Hour(endTime);
    return `${start12Hour} - ${end12Hour}`;
}

function convertTo12Hour(time) {
    const [hour, minute] = time.split(":").map(Number);
    const amPm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${amPm}`;
}

// Get local date in "YYYY-MM-DD" format
function getLocalDate(offsetDays = 0) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().split('T')[0]; // Ensuring proper date format
}

// Map account IDs to codes
function getAccountCode(accountValue) {
    const accountMap = {
        "0011n00002WA7zxAAD": "R",
        "0010700000UJGkMAAX": "B",
        "0010700000P2RCfAAN": "J"
    };
    return accountMap[accountValue] || "Unknown"; // Return mapped value or "Unknown" if not found
}

// Hide the date picker on button clicks
function hideDatePicker() {
    document.getElementById("datePicker").style.display = "none";
}

// Attach event listeners
document.getElementById("btn").addEventListener("click", () => {
    hideDatePicker();
    loadBryanBookings();
});
document.getElementById("btn-today").addEventListener("click", () => {
    hideDatePicker();
    loadBryanBookings(getLocalDate());
});
document.getElementById("btn-tomorrow").addEventListener("click", () => {
    hideDatePicker();
    loadBryanBookings(getLocalDate(1));
});

// Show the date picker when clicking on the calendar
document.getElementById("btn").insertAdjacentHTML('afterend', '<button id="calendarBtn">📅 Select Date</button>');
document.getElementById("calendarBtn").addEventListener("click", () => {
    document.getElementById("datePicker").style.display = "block";
});
