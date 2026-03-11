// Today Bookings Page JavaScript

let bookings = [];
let isLoading = false;

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
    document.getElementById('infoBanner').style.display = 'none';
    document.getElementById('bookingsList').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
}

// Show error (fallback to empty state for now)
function showError(message) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('emptyState').style.display = 'flex';
}

// Get today's bookings
function getTodayBookings() {
    const today = apiService.getTodayString();
    return bookings.filter(booking => booking.bookingDate === today);
}

// Display bookings
function displayBookings() {
    const todayBookings = getTodayBookings();
    
    document.getElementById('loadingState').style.display = 'none';
    
    if (todayBookings.length === 0) {
        document.getElementById('emptyState').style.display = 'flex';
        document.getElementById('infoBanner').style.display = 'none';
        document.getElementById('bookingsList').style.display = 'none';
        return;
    }
    
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('infoBanner').style.display = 'flex';
    document.getElementById('bookingsList').style.display = 'block';
    
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = todayBookings.map(booking => createQuickSecurityCard(booking)).join('');
}

// Create quick security card HTML
function createQuickSecurityCard(booking) {
    return `
        <div class="quick-security-card" onclick="showSecurityView('${booking.id}')">
            <div class="card-header">
                <div class="card-title">
                    <h3>Tennis Court</h3>
                    <p>${booking.amenityName}</p>
                </div>
                <div class="card-time">
                    <div class="time-large">${booking.startTime}</div>
                    ${booking.isPremium ? `
                        <div class="premium-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                            Premium
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="card-divider"></div>
            
            <div class="card-info">
                <div class="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    ${booking.timeSlot}
                </div>
                <div class="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    ${booking.accountName}
                </div>
            </div>
            
            <div class="security-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                </svg>
                <span>Tap to Show Security</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </div>
        </div>
    `;
}

// Show security view modal - MATCHES iOS APP DESIGN
function showSecurityView(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    const modal = document.getElementById('securityModal');
    const content = document.getElementById('securityContent');
    
    // Helper functions for formatting
    function formatBookingDate(dateString) {
        const date = apiService.parseDate(dateString);
        const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options).replace(',', ',');
    }
    
    function formatCreationDate(dateString) {
        if (!dateString) return 'N/A';
        const date = apiService.parseDate(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
    
    function convertTo12Hour(time24) {
        const [hours, minutes] = time24.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
    }
    
    function format12HourTimeSlot(timeSlot) {
        const [start, end] = timeSlot.split(' - ');
        return `${convertTo12Hour(start)} - ${convertTo12Hour(end)}`;
    }
    
    content.innerHTML = `
        <div class="security-booking-card">
            <!-- Approved Badge -->
            <div class="approved-badge">
                ${booking.approvedIcon ? `<img src="${booking.approvedIcon}" alt="Approved" class="approved-icon">` : ''}
                <span>Approved</span>
            </div>
            
            <!-- Main Content -->
            <div class="booking-card-content-security">
                <!-- Icon -->
                <div class="amenity-icon-container">
                    ${booking.icon ? `<img src="${booking.icon}" alt="Amenity" class="amenity-icon">` : `
                        <svg class="amenity-icon-fallback" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                    `}
                </div>
                
                <!-- Details -->
                <div class="booking-details-security">
                    <!-- Amenity Name -->
                    <h3 class="amenity-name-security">${booking.amenityName}</h3>
                    
                    <!-- Booking Date -->
                    <div class="detail-group">
                        <div class="detail-label-security">Booking date</div>
                        <div class="detail-value-security">${formatBookingDate(booking.bookingDate)}</div>
                    </div>
                    
                    <!-- Time Slot -->
                    <div class="detail-group">
                        <div class="detail-label-security">Time slot</div>
                        <div class="detail-value-security">${format12HourTimeSlot(booking.timeSlot)}</div>
                    </div>
                    
                    <!-- Service Request Info -->
                    <div class="service-req-container">
                        <div class="service-req-column">
                            <div class="detail-label-security">Service Req Number</div>
                            <div class="detail-value-security">${booking.serviceRequestNumber}</div>
                        </div>
                        <div class="service-req-column">
                            <div class="detail-label-security">Service Req</div>
                            <div class="detail-label-security">Raised Date</div>
                            <div class="detail-value-security">${formatCreationDate(booking.creationDate)}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Three-dot menu -->
                <div class="menu-dots">⋮</div>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

// Close security view
function closeSecurityView() {
    const modal = document.getElementById('securityModal');
    modal.classList.remove('show');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('securityModal');
    if (e.target === modal) {
        closeSecurityView();
    }
});
