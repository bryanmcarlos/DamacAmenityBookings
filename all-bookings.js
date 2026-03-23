// All Bookings Page JavaScript

let bookings = [];
let filteredBookings = [];
let isLoading = false;
let currentFilter = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadBookings();
});

// Load bookings
async function loadBookings() {
    if (isLoading) return;
    
    isLoading = true;
    showLoading();
    
    try {
        bookings = await apiService.fetchAllBookings();
        applyFilter();
        displayBookings();
    } catch (error) {
        console.error('Error loading bookings:', error);
        showError(error.message);
    } finally {
        isLoading = false;
    }
}

// Refresh bookings
async function refreshBookings() {
    await loadBookings();
}

// Show loading state
function showLoading() {
    document.getElementById('loadingState').style.display = 'flex';
    document.getElementById('statsCard').style.display = 'none';
    document.getElementById('filterBanner').style.display = 'none';
    document.getElementById('bookingsList').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
}

// Show error state
function showError(message) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('statsCard').style.display = 'none';
    document.getElementById('filterBanner').style.display = 'none';
    document.getElementById('bookingsList').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('errorState').style.display = 'flex';
    document.getElementById('errorMessage').textContent = message;
}

// Toggle filter menu
function toggleFilterMenu() {
    const menu = document.getElementById('filterMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Select filter
function selectFilter(accountName) {
    currentFilter = accountName;
    applyFilter();
    displayBookings();
    toggleFilterMenu();
}

// Clear filter
function clearFilter() {
    currentFilter = null;
    applyFilter();
    displayBookings();
}

// Apply current filter
function applyFilter() {
    if (!currentFilter) {
        filteredBookings = [...bookings];
    } else {
        filteredBookings = bookings.filter(b => b.accountName === currentFilter);
    }
}

// Get booking stats
function getStats() {
    const today = new Date();
    const upcoming = filteredBookings.filter(b => {
        const bookingDate = apiService.parseDate(b.bookingDate);
        return bookingDate >= today;
    });
    const premium = filteredBookings.filter(b => b.isPremium);
    const confirmed = filteredBookings.filter(b => b.status.includes('Confirmed'));
    
    return {
        total: filteredBookings.length,
        upcoming: upcoming.length,
        premium: premium.length,
        confirmed: confirmed.length
    };
}

// Group bookings by date
function groupBookingsByDate() {
    const grouped = {};
    
    filteredBookings.forEach(booking => {
        if (!grouped[booking.bookingDate]) {
            grouped[booking.bookingDate] = [];
        }
        grouped[booking.bookingDate].push(booking);
    });
    
    return grouped;
}

// Get sorted dates (newest first)
function getSortedDates(grouped) {
    return Object.keys(grouped).sort((a, b) => b.localeCompare(a));
}

// Display bookings
function displayBookings() {
    document.getElementById('loadingState').style.display = 'none';
    
    if (filteredBookings.length === 0) {
        document.getElementById('emptyState').style.display = 'flex';
        document.getElementById('statsCard').style.display = 'none';
        document.getElementById('filterBanner').style.display = 'none';
        document.getElementById('bookingsList').style.display = 'none';
        return;
    }
    
    // Show stats
    displayStats();
    
    // Show filter banner if filtered
    if (currentFilter) {
        const banner = document.getElementById('filterBanner');
        banner.style.display = 'flex';
        document.getElementById('filterText').textContent = `Showing bookings for ${currentFilter}`;
    } else {
        document.getElementById('filterBanner').style.display = 'none';
    }
    
    // Display bookings list
    const grouped = groupBookingsByDate();
    const sortedDates = getSortedDates(grouped);
    
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.style.display = 'block';
    bookingsList.innerHTML = sortedDates.map(date => {
        const dateBookings = grouped[date];
        return createDateSection(date, dateBookings);
    }).join('');
    
    document.getElementById('emptyState').style.display = 'none';
}

// Display stats
function displayStats() {
    const stats = getStats();
    
    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statUpcoming').textContent = stats.upcoming;
    document.getElementById('statPremium').textContent = stats.premium;
    document.getElementById('statConfirmed').textContent = stats.confirmed;
    
    document.getElementById('statsCard').style.display = 'block';
}

// Create date section HTML
function createDateSection(date, dateBookings) {
    return `
        <div class="booking-date-section">
            <h3 class="date-header">${apiService.formatDateDisplay(date)}</h3>
            <div class="date-bookings">
                ${dateBookings.map(booking => createBookingCard(booking)).join('')}
            </div>
        </div>
    `;
}

// Create booking card HTML
function createBookingCard(booking) {
    return `
        <div class="booking-card">
            <div class="booking-card-content" onclick="showDetailView('${booking.id}')">
                <div class="booking-icon ${booking.isPremium ? 'premium' : 'regular'}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        ${booking.isPremium ? `
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        ` : `
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14" stroke="white" stroke-width="2" fill="none"/>
                        `}
                    </svg>
                </div>
                
                <div class="booking-info">
                    <div class="booking-time">${booking.timeSlot}</div>
                    <div class="booking-amenity">${booking.amenityName}</div>
                    <div class="booking-tags">
                        <span class="tag ${booking.isPremium ? 'premium' : 'regular'}">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                ${booking.isPremium ? `
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                ` : `
                                    <circle cx="12" cy="12" r="10"/>
                                `}
                            </svg>
                            ${booking.slotType}
                        </span>
                        <span class="tag confirmed">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01" stroke="white" stroke-width="1.5" fill="none"/>
                            </svg>
                            ${booking.status}
                        </span>
                    </div>
                </div>
                
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </div>
            
            <div class="booking-action" onclick="event.stopPropagation(); showSecurityView('${booking.id}')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                </svg>
                Show to Security
            </div>
        </div>
    `;
}

// Show detail view modal
function showDetailView(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    const modal = document.getElementById('detailModal');
    const content = document.getElementById('detailContent');
    
    content.innerHTML = `
        <div class="security-qr" style="padding-top: 60px;">
            <h2>Booking Details</h2>
            
            <div class="security-details" style="margin-top: 24px;">
                <div class="detail-row">
                    <span class="detail-label">Booking ID:</span>
                    <span class="detail-value">${booking.serviceRequestNumber}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${apiService.formatDateDisplay(booking.bookingDate)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${booking.timeSlot}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Court:</span>
                    <span class="detail-value">${booking.amenityName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Account:</span>
                    <span class="detail-value">${booking.accountName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${booking.accountEmail}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">${booking.status}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">${booking.slotType}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Created:</span>
                    <span class="detail-value">${booking.creationDate || 'N/A'}</span>
                </div>
            </div>
            
            <button onclick="closeDetailView(); showSecurityView('${booking.id}')" 
                    class="primary-button" style="margin-top: 24px; width: 100%;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                </svg>
                Show to Security
            </button>
        </div>
    `;
    
    modal.classList.add('show');
}

// Close detail view
function closeDetailView() {
    const modal = document.getElementById('detailModal');
    modal.classList.remove('show');
}

// Show security view modal - MATCHES iOS APP DESIGN
// Show security view modal - MATCHES iOS APP DESIGN
function showSecurityView(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    const modal = document.getElementById('securityModal');
    const content = document.getElementById('securityContent');
    
    // Formatting Helpers
    const formatBookingDate = (dateString) => {
        const date = apiService.parseDate(dateString);
        const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };
    
    const formatCreationDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = apiService.parseDate(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    
    const format12HourTimeSlot = (timeSlot) => {
        const convert = (t) => {
            let [h, m] = t.split(':').map(Number);
            const ampm = h >= 12 ? 'PM' : 'AM';
            return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
        };
        const [start, end] = timeSlot.split(' - ');
        return `${convert(start)} - ${convert(end)}`;
    };

    // Define the close logic globally so the button can see it
    window.closeSecurityModal = function() {
        modal.classList.remove('show'); // Removes the "bar" / background wrapper
        content.innerHTML = '';         // Clears the overlay
    };
    
    content.innerHTML = `
    <div class="modal-overlay" onclick="closeSecurityModal(event)">
        <button class="modal-close-btn" onclick="closeSecurityModal()">&times;</button>

        <div class="security-booking-card">
            <div class="approved-badge">
                ${booking.approvedIcon ? 
                    `<img src="${booking.approvedIcon}" alt="Approved" class="approved-icon" onerror="this.style.display='none'">` : 
                    `<svg class="approved-icon" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#7D7D7D" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>`
                }
                <span>Approved</span>
            </div>
            
            <div class="card-main-layout">
                <div class="amenity-icon-container">
                    ${booking.icon ? 
                        `<img src="${booking.icon}" alt="Amenity Icon" class="amenity-icon" onerror="this.parentElement.innerHTML='<svg class=\\'amenity-icon-fallback\\' viewBox=\\'0 0 24 24\\' fill=\\'currentColor\\'><circle cx=\\'12\\' cy=\\'12\\' r=\\'10\\'/></svg>'">` :
                        `<svg class="amenity-icon-fallback" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7v10c0 5.5 3.8 9.7 9 11 5.2-1.3 9-5.5 9-11V7l-10-5z"/>
                            <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>
                        </svg>`
                    }
                </div>
                
                <div class="booking-details-security">
                    <div class="header-row-security">
                        <h3 class="amenity-name-security">${booking.amenityName || 'Booking Details'}</h3>
                        <div class="menu-dots">⋮</div>
                    </div>
                    
                    <div class="detail-group">
                        <div class="detail-label-security">Booking date</div>
                        <div class="detail-value-security">${formatBookingDate(booking.bookingDate)}</div>
                    </div>
                    
                    <div class="detail-group">
                        <div class="detail-label-security">Time slot</div>
                        <div class="detail-value-security">${format12HourTimeSlot(booking.timeSlot)}</div>
                    </div>
                    
                    <div class="service-req-container">
                        <div class="service-req-column">
                            <div class="detail-label-security">Service Req Number</div>
                            <div class="detail-value-security">${booking.serviceRequestNumber || 'N/A'}</div>
                        </div>
                        <div class="service-req-column">
                            <div class="detail-label-security">Service Req Raised <br> Date</div>
                            <div class="detail-value-security">${formatCreationDate(booking.creationDate)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    
    modal.classList.add('show');
}

// Close security modal
window.closeSecurityModal = function(event) {
    const modal = document.getElementById('securityModal');
    const content = document.getElementById('securityContent');

    // If event exists and user clicked inside the card (not the overlay), don't close
    if (event && event.target.closest('.security-booking-card')) {
        return;
    }

    modal.classList.remove('show');
    content.innerHTML = '';
};
