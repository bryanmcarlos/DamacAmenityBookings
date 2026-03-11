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

// Show security view modal
function showSecurityView(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    const modal = document.getElementById('securityModal');
    const content = document.getElementById('securityContent');
    
    content.innerHTML = `
        <div class="security-qr">
            <h2>🎾 Tennis Court Booking</h2>
            
            <div class="qr-code">
                <svg width="250" height="250" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="white"/>
                    <text x="50" y="50" text-anchor="middle" font-size="8" fill="black">
                        QR Code for
                    </text>
                    <text x="50" y="60" text-anchor="middle" font-size="6" fill="black">
                        ${booking.serviceRequestNumber}
                    </text>
                </svg>
            </div>
            
            <div class="security-details">
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
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">${booking.status}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">${booking.slotType}</span>
                </div>
            </div>
            
            <p style="margin-top: 20px; color: var(--text-secondary); font-size: 14px;">
                Show this screen to security at the tennis court entrance
            </p>
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
