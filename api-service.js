// API Service for Damac Hills Tennis Booking
class DamacAPIService {
    constructor() {
        this.baseURL = `https://${CONFIG.API.host}/damacliving/api/v1`;
        this.tokens = new Map(); // Store tokens per account
    }
    
    // Login to get access token
    async login(account) {
        const url = `${this.baseURL}/login`;
        
        const body = {
            user_name: account.userName,
            password: account.password
        };
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-token': CONFIG.API.apiToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                throw new Error(`Login failed: ${response.status}`);
            }
            
            const data = await response.json();
            const token = data?.data?.party?.access_token;
            
            if (!token) {
                throw new Error('No access token in response');
            }
            
            // Store token for this account
            this.tokens.set(account.accountId, token);
            
            return token;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
    
    // Get cached token or login
    async getToken(account) {
        if (this.tokens.has(account.accountId)) {
            return this.tokens.get(account.accountId);
        }
        return await this.login(account);
    }
    
    // Fetch bookings for a specific account
    async fetchBookings(account) {
        try {
            const token = await this.getToken(account);
            const url = `${this.baseURL}/amenities/bookings/${account.accountId}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'api-token': CONFIG.API.apiToken,
                    'authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch bookings: ${response.status}`);
            }
            
            const data = await response.json();
            const apiBookings = data?.data?.upcoming_bookings || [];
            
            // Transform API bookings to our format
            return apiBookings.map(booking => this.transformBooking(booking, account));
            
        } catch (error) {
            console.error('Error fetching bookings:', error);
            throw error;
        }
    }
    
    // Fetch all bookings from all accounts
    async fetchAllBookings() {
        const allBookings = [];
        
        for (const account of CONFIG.ACCOUNTS) {
            try {
                const bookings = await this.fetchBookings(account);
                allBookings.push(...bookings);
            } catch (error) {
                console.error(`Error fetching bookings for ${account.displayName}:`, error);
            }
        }
        
        return allBookings;
    }
    
    // Transform API booking to app format
    transformBooking(apiBooking, account) {
        const startTime = apiBooking.start_time || '19:00';
        const endTime = apiBooking.end_time || '20:00';
        const timeSlot = `${startTime} - ${endTime}`;
        
        // Determine if premium (7 PM - 9 PM)
        const hour = parseInt(startTime.split(':')[0]);
        const isPremium = hour >= 19 && hour <= 21;
        
        return {
            id: apiBooking.fm_case_number || this.generateId(),
            accountId: account.accountId,
            accountEmail: account.userName,
            accountName: account.displayName,
            amenityName: apiBooking.amenity_name || 'D2 Sports Town - Tennis Court',
            bookingDate: apiBooking.booking_date || '',
            timeSlot: timeSlot,
            startTime: startTime,
            endTime: endTime,
            status: apiBooking.amenity_booking_status || 'Confirmed',
            creationDate: apiBooking.fm_case_creation_date || '',
            slotType: isPremium ? 'Premium' : 'Regular',
            serviceRequestNumber: apiBooking.fm_case_number || '',
            icon: apiBooking.icon || null,
            approvedIcon: apiBooking.approved_icon || null,
            isPremium: isPremium
        };
    }
    
    // Generate random ID
    generateId() {
        return 'booking_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Parse date string to Date object
    parseDate(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    }
    
    // Format date to string
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Get today's date string
    getTodayString() {
        return this.formatDate(new Date());
    }
    
    // Check if date is today
    isToday(dateString) {
        return dateString === this.getTodayString();
    }
    
    // Format date for display
    formatDateDisplay(dateString) {
        const date = this.parseDate(dateString);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
}

// Create global instance
const apiService = new DamacAPIService();
