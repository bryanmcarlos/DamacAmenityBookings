// Configuration file for Damac Hills Tennis Booking
const CONFIG = {
    API: {
        host: 'digital.damacgroup.com',
        apiToken: 'a740e9a60b62418ee08d65d53740c3346eef6edf994a0784f0def9ca13822a9b',
        amenityId: 'a5Y07000000wqfSEAQ',
        googleSheetsURL: 'https://script.google.com/macros/s/AKfycbxDmvSySLwx1HnG0HUUTXrYN-5bFOqGAK5BtWvKk3Yy6QDw7UyKOv6iy035YpYVnR-HKw/exec'
    },
    
    ACCOUNTS: [
        {
            id: 'account1',
            userName: 'jess.santiago@outlook.com',
            password: 'Staff@9090',
            accountId: '0010700000P2RCfAAN',
            bookingUnitId: 'a0x1n000006EjnwAAC',
            targetSlot: 19.00,
            fallbacks: [18.00],
            displayName: 'Jess Santiago'
        },
        {
            id: 'account2',
            userName: 'reswee@yahoo.com',
            password: 'Alyanna*1',
            accountId: '0011n00002WA7zxAAD',
            bookingUnitId: 'a0x0Y000002UQCUQA4',
            targetSlot: 20.00,
            fallbacks: [18.00],
            displayName: 'Reswee'
        },
        {
            id: 'account3',
            userName: 'bryanmcarlos@gmail.com',
            password: 'Damac@air006',
            accountId: '0010700000UJGkMAAX',
            bookingUnitId: 'a0xTY000000E88zYAC',
            targetSlot: 21.00,
            fallbacks: [18.00],
            displayName: 'Bryan Carlos'
        }
    ],
    
    // Account name mapping
    getAccountName(accountId) {
        const account = this.ACCOUNTS.find(acc => acc.accountId === accountId);
        return account ? account.displayName : 'Unknown';
    },
    
    // Get account by ID
    getAccount(accountId) {
        return this.ACCOUNTS.find(acc => acc.accountId === accountId);
    }
};
