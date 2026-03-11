# 🚀 Deployment Checklist

Use this checklist to ensure a smooth deployment of your Tennis Booking web app.

## ✅ Pre-Deployment Checklist

### 1. Configuration Review
- [ ] Open `config.js`
- [ ] Verify all 3 account usernames are correct
- [ ] Verify all 3 account passwords are correct
- [ ] Verify all account IDs match the app
- [ ] Verify API token is current
- [ ] Verify amenity ID is correct
- [ ] Test API endpoints are reachable

### 2. File Verification
- [ ] `index.html` exists
- [ ] `today-bookings.html` exists
- [ ] `all-bookings.html` exists
- [ ] `styles.css` exists
- [ ] `config.js` exists
- [ ] `api-service.js` exists
- [ ] `today-bookings.js` exists
- [ ] `all-bookings.js` exists
- [ ] All files are in the same `web/` folder

### 3. Local Testing (Optional but Recommended)
- [ ] Open `index.html` in a browser
- [ ] Check browser console for errors (F12)
- [ ] Click "Today's Bookings" - does it load?
- [ ] Click "All Bookings" - does it load?
- [ ] Test refresh button
- [ ] Test filter menu (All Bookings page)
- [ ] Test security view modal
- [ ] Test on mobile device/browser size

## 🌐 Deployment Steps

### Option A: Netlify (Recommended for Beginners)

#### Step 1: Create Account
- [ ] Go to https://netlify.com
- [ ] Click "Sign Up" (can use GitHub/email)
- [ ] Complete registration

#### Step 2: Deploy
- [ ] Click "Add new site" → "Deploy manually"
- [ ] Drag and drop your `web/` folder to the upload area
- [ ] Wait for deployment to complete (~30 seconds)
- [ ] Get your URL (e.g., `https://random-name.netlify.app`)

#### Step 3: Customize (Optional)
- [ ] Click "Site settings"
- [ ] Click "Change site name"
- [ ] Choose a custom name (e.g., `tennis-bookings`)
- [ ] Your URL becomes `https://tennis-bookings.netlify.app`

#### Step 4: Add Password Protection (Recommended)
- [ ] Upgrade to Netlify Pro (optional, for password protection)
- [ ] Or implement basic auth via `_headers` file

---

### Option B: Vercel

#### Step 1: Create Account
- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub/GitLab/Email

#### Step 2: Deploy
- [ ] Click "Add New..." → "Project"
- [ ] Upload your `web/` folder
- [ ] Click "Deploy"
- [ ] Get your URL (e.g., `https://tennis-bookings.vercel.app`)

---

### Option C: GitHub Pages

#### Step 1: Create Repository
- [ ] Go to https://github.com
- [ ] Click "New repository"
- [ ] Name it `tennis-bookings`
- [ ] Make it private (recommended)
- [ ] Create repository

#### Step 2: Upload Files
- [ ] Click "uploading an existing file"
- [ ] Drag all files from `web/` folder
- [ ] Commit changes

#### Step 3: Enable GitHub Pages
- [ ] Go to Settings → Pages
- [ ] Source: Deploy from branch
- [ ] Branch: main, folder: / (root)
- [ ] Save
- [ ] Wait 1-2 minutes
- [ ] Access at `https://yourusername.github.io/tennis-bookings/`

---

### Option D: Traditional Web Hosting

#### Step 1: Connect via FTP
- [ ] Get FTP credentials from your host
- [ ] Download FileZilla or use built-in FTP
- [ ] Connect to your server

#### Step 2: Upload Files
- [ ] Navigate to `public_html` or `www` folder
- [ ] Create a subfolder (e.g., `tennis`)
- [ ] Upload all files from `web/` folder
- [ ] Set permissions to 644 for files, 755 for folders

#### Step 3: Access
- [ ] Go to `https://yourdomain.com/tennis/`
- [ ] Test all functionality

## 🔒 Post-Deployment Security

### Password Protection (Recommended)

#### For Netlify:
1. [ ] Create `_headers` file with:
   ```
   /*
     X-Frame-Options: DENY
     X-Content-Type-Options: nosniff
   ```

#### For Apache Servers:
1. [ ] Create `.htaccess` file:
   ```apache
   AuthType Basic
   AuthName "Tennis Bookings - Private"
   AuthUserFile /path/to/.htpasswd
   Require valid-user
   ```
2. [ ] Create `.htpasswd` file using online generator
3. [ ] Upload both files to your web directory

#### For Environment Variables:
- [ ] Consider moving sensitive data to server-side
- [ ] Use serverless functions for API calls
- [ ] Keep credentials out of client-side code

### Additional Security
- [ ] Enable HTTPS (most hosts provide free SSL)
- [ ] Don't share deployment URL publicly
- [ ] Consider adding login page
- [ ] Monitor access logs

## ✅ Post-Deployment Testing

### Functionality Tests
- [ ] Visit landing page (index.html)
- [ ] Click "Today's Bookings" button
- [ ] Verify bookings load (may be empty if no bookings today)
- [ ] Click "All Bookings" button
- [ ] Verify all bookings appear
- [ ] Test filter menu
- [ ] Filter by each account name
- [ ] Clear filter
- [ ] Click on a booking
- [ ] Verify detail modal opens
- [ ] Close modal
- [ ] Click "Show to Security" button
- [ ] Verify security modal opens with QR code area
- [ ] Close modal
- [ ] Click refresh button
- [ ] Verify page refreshes

### Mobile Testing
- [ ] Open on mobile browser
- [ ] Test touch interactions
- [ ] Verify responsive layout
- [ ] Test in portrait mode
- [ ] Test in landscape mode
- [ ] Try "Add to Home Screen"

### Browser Testing
- [ ] Test in Chrome
- [ ] Test in Safari
- [ ] Test in Firefox
- [ ] Test in Edge
- [ ] Check browser console for errors

### Dark Mode Testing
- [ ] Enable dark mode on device
- [ ] Verify colors switch appropriately
- [ ] Disable dark mode
- [ ] Verify light mode looks good

## 📱 Share with Family

### Sharing Checklist
- [ ] Get final deployment URL
- [ ] Test URL in incognito/private mode
- [ ] Send URL to family members
- [ ] Provide brief instructions:
  - "Today's Bookings" for quick daily view
  - "All Bookings" for full history
  - "Show to Security" at gate entrance
- [ ] Recommend adding to home screen on mobile

### Instructions to Send:
```
Hi! Here's our Tennis Booking web app:
🔗 [YOUR_URL_HERE]

📱 Quick Guide:
• "Today's Bookings" - See today's court times
• "All Bookings" - View all upcoming bookings
• Tap any booking → "Show to Security" at the gate

💡 Tip: Add to home screen for quick access!
```

## 🎉 Final Steps

- [ ] Bookmark the URL yourself
- [ ] Add to mobile home screen
- [ ] Test one complete booking flow
- [ ] Archive these deployment files
- [ ] Celebrate! 🎾

---

## 🆘 Troubleshooting

### Issue: "Bookings not loading"
**Check:**
1. Open browser console (F12)
2. Look for error messages
3. Verify API credentials in config.js
4. Check internet connection
5. Verify API endpoints are accessible

### Issue: "CORS Error"
**Solution:**
- This happens when testing locally with file://
- Must deploy to actual web server
- Or use local development server like:
  ```bash
  python -m http.server 8000
  # or
  npx serve web/
  ```

### Issue: "Page styling broken"
**Check:**
1. All files uploaded?
2. Files in same directory?
3. Clear browser cache
4. Check file paths in HTML

### Issue: "Can't filter bookings"
**Check:**
1. Click the filter icon
2. Menu should appear
3. Select account name
4. Check browser console for JS errors

### Issue: "Security view not showing"
**Check:**
1. Click on a booking card
2. Click "Show to Security" button
3. Modal should appear
4. Check browser console for errors

---

## 📞 Need Help?

1. Check README.md for detailed documentation
2. Review SUMMARY.md for overview
3. Look at QUICK_REFERENCE.txt for visual guide
4. Check browser console for errors
5. Verify all files are uploaded

---

**Last Updated:** March 11, 2026
**Version:** 1.0.0
