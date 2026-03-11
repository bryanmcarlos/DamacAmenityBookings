# Tennis Booking Web App - Deployment Guide

This directory contains the web version of the Damac Hills Tennis Booking App. These files can be deployed to any static web hosting service.

## 📁 Files Structure

```
web/
├── today-bookings.html     # Today's bookings page
├── all-bookings.html       # All bookings page
├── styles.css              # Shared styles
├── config.js               # Configuration & account details
├── api-service.js          # API service for backend communication
├── today-bookings.js       # Logic for today's bookings page
├── all-bookings.js         # Logic for all bookings page
└── README.md               # This file
```

## 🚀 Quick Deployment

### Option 1: GitHub Pages

1. Create a new repository on GitHub
2. Upload all files from the `web/` folder
3. Go to repository Settings → Pages
4. Select branch (usually `main`) and `/root` folder
5. Click Save
6. Your site will be available at `https://yourusername.github.io/repository-name/`

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `web/` folder to Netlify
3. Your site will be deployed instantly
4. You'll get a URL like `https://random-name.netlify.app`

### Option 3: Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import the repository or upload files
3. Deploy with default settings
4. You'll get a URL like `https://project-name.vercel.app`

### Option 4: Traditional Web Hosting

1. Upload all files via FTP to your web server
2. Place them in your `public_html` or `www` directory
3. Access via your domain

## 🔧 Configuration

### Update Account Information

Edit `config.js` to modify account details:

```javascript
ACCOUNTS: [
    {
        id: 'account1',
        userName: 'your-email@example.com',
        password: 'your-password',
        accountId: 'your-account-id',
        bookingUnitId: 'your-unit-id',
        displayName: 'Display Name'
    }
]
```

### Update API Configuration

Also in `config.js`:

```javascript
API: {
    host: 'digital.damacgroup.com',
    apiToken: 'your-api-token',
    amenityId: 'your-amenity-id',
    googleSheetsURL: 'your-google-sheets-url'
}
```

## 🎨 Features

### Today's Bookings Page (`today-bookings.html`)
- Shows only bookings for the current day
- Quick access cards for easy viewing
- "Show to Security" feature with QR code placeholder
- Pull-to-refresh functionality
- Mobile-friendly design

### All Bookings Page (`all-bookings.html`)
- Displays all bookings from all accounts
- Filter by account
- Booking statistics (Total, Upcoming, Premium, Confirmed)
- Grouped by date (newest first)
- Detailed view for each booking
- Security view for gate access

## 📱 Mobile Support

The app is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile phones (iOS Safari, Chrome, etc.)

## 🎨 Dark Mode

Automatic dark mode support based on system preferences.

## 🔒 Security Considerations

**⚠️ IMPORTANT:** The `config.js` file contains sensitive information including:
- Account usernames
- Account passwords
- API tokens

### Recommendations:

1. **For Private Use Only:** Only deploy to private hosting or password-protected directories
2. **Use Environment Variables:** Consider moving sensitive data to server-side environment variables
3. **Implement Authentication:** Add a login page before accessing the booking pages
4. **Use HTTPS:** Always deploy to HTTPS-enabled hosting

### Making it More Secure:

Create a `.htaccess` file (for Apache servers) to password-protect:

```apache
AuthType Basic
AuthName "Tennis Bookings"
AuthUserFile /path/to/.htpasswd
Require valid-user
```

## 🔄 Updates and Maintenance

### To update bookings:
The app automatically fetches fresh data from the API on page load and when the refresh button is clicked.

### To modify styling:
Edit `styles.css` - all CSS variables are defined at the top for easy theming.

### To add features:
- Modify the HTML files for structure
- Update the corresponding JS files for functionality
- Styles are shared across pages in `styles.css`

## 🐛 Troubleshooting

### Bookings not loading?
- Check browser console for errors
- Verify API credentials in `config.js`
- Check CORS settings (API must allow requests from your domain)

### Page not displaying correctly?
- Clear browser cache
- Check that all files are uploaded
- Verify file paths in HTML are correct

### QR Code not generating?
- The current implementation shows a placeholder
- To add real QR codes, integrate a library like `qrcode.js`

## 📊 Adding Real QR Codes

To generate actual QR codes, add this to your HTML before closing `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
```

Then modify the QR code div in the JavaScript files:

```javascript
// Instead of the SVG placeholder, use:
<div id="qrcode-${booking.id}"></div>

// Then generate it:
new QRCode(document.getElementById(`qrcode-${booking.id}`), {
    text: booking.serviceRequestNumber,
    width: 250,
    height: 250
});
```

## 📞 Support

For issues or questions:
1. Check the browser console for errors
2. Verify all configuration settings
3. Test API connectivity manually

## 📝 License

This is a private application for personal use. Do not share credentials or deploy publicly without proper security measures.

---

**Last Updated:** March 11, 2026
