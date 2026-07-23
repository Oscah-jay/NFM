# Paystack Donations Backend

A production-ready Express.js backend for secure Paystack donation processing with webhook support and modular architecture.

## Features

- ✅ Secure payment verification with Paystack
- ✅ Webhook signature validation (HMAC-SHA512)
- ✅ Modular architecture (controllers, services, middleware)
- ✅ Comprehensive error handling
- ✅ Request logging and debugging
- ✅ Support for recurring donations
- ✅ Donation statistics and tracking
- ✅ CORS configuration for frontend integration
- ✅ Environment variable management
- ✅ Production-ready security

## Project Structure

```
backend/
├── app.js                    # Main Express application
├── package.json              # Dependencies
├── .env.example              # Environment template
│
├── config/
│   ├── paystack.js          # Paystack API configuration
│   └── server.js            # Server & CORS configuration
│
├── controllers/
│   └── donationController.js # HTTP request handlers
│
├── middleware/
│   ├── errorHandler.js      # Error handling
│   ├── webhookValidator.js  # Webhook signature validation
│   └── requestLogger.js     # Request logging
│
├── services/
│   ├── paystackService.js   # Paystack API integration
│   └── donationService.js   # Donation business logic
│
├── routes/
│   ├── donationRoutes.js    # Donation API endpoints
│   └── healthRoutes.js      # Health check endpoints
│
└── utils/
    ├── logger.js            # Logging utility
    ├── webhook.js           # Webhook utilities
    ├── response.js          # Standard response format
    └── validation.js        # Input validation
```

## Quick Start

### 1. Installation

```bash
cd donation-backend
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PAYSTACK_PUBLIC_KEY=pk_test_your_key
PAYSTACK_SECRET_KEY=sk_test_your_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Get Paystack Keys

1. Visit [Paystack Dashboard](https://dashboard.paystack.com)
2. Navigate to Settings → Developer
3. Copy **Public Key** and **Secret Key**
4. Add to `.env`

### 4. Run Development Server

```bash
npm run dev
```

Server starts on `http://localhost:5000`

### 5. Verify Setup

```bash
# Health check
curl http://localhost:5000/health

# API status
curl http://localhost:5000/api/status
```

## 📚 API Endpoints

### Health Check

```bash
GET /health
GET /api/status
```

### Donations

#### Verify Payment

```bash
POST /api/donations/verify

Body:
{
  "reference": "string",
  "name": "string",
  "email": "string@example.com",
  "amount": 100,
  "purpose": "general",
  "type": "onetime",
  "anonymous": false
}

Response:
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "donation": { ... },
    "verification": { ... }
  }
}
```

#### Webhook Handler

```bash
POST /api/donations/webhook

Headers:
  X-Paystack-Signature: signature-value

Body:
{
  "event": "charge.success",
  "data": { ... }
}
```

#### Get Statistics

```bash
GET /api/donations/stats

Response:
{
  "success": true,
  "data": {
    "total": 42,
    "totalAmount": 5000,
    "averageAmount": 119.05,
    "onetimeDonations": 35,
    "recurringDonations": 7,
    "anonymousDonations": 12,
    "topPurposes": [ ... ]
  }
}
```

#### Get All Donations

```bash
GET /api/donations?type=onetime&anonymous=false

Response:
{
  "success": true,
  "data": {
    "donations": [ ... ],
    "total": 42
  }
}
```

#### Get Specific Donation

```bash
GET /api/donations/:id

Response:
{
  "success": true,
  "data": {
    "id": "DON_...",
    "reference": "...",
    "amount": 100,
    "email": "donor@example.com",
    ...
  }
}
```

## 🔐 Security Features

### Secret Key Protection
- API keys stored in environment variables only
- Never exposed in logs or responses
- Uses `.env` file with `.gitignore`

### Webhook Signature Validation
- HMAC-SHA512 cryptographic verification
- Prevents spoofed webhook events
- Validates every incoming webhook

### Input Validation & Sanitization
- Email format validation
- Amount validation (minimum amount)
- String sanitization (XSS prevention)
- Data type checking

### Error Handling
- No sensitive data in error messages
- Secure logging (production mode hides details)
- Proper HTTP status codes

### CORS Configuration
- Restricted to frontend URL
- Credentials support enabled
- Preflight request handling

## 🛠️ Development

### File Descriptions

#### config/paystack.js
Manages Paystack API credentials and endpoints. Validates configuration on startup.

#### config/server.js
Server settings, CORS configuration, environment management.

#### services/paystackService.js
Handles all Paystack API calls:
- `verifyPayment()` - Verify payment reference
- `initializeTransaction()` - Get payment URL
- `getTransactionDetails()` - Fetch transaction info

#### services/donationService.js
Business logic for donations:
- `recordDonation()` - Store donation
- `getDonationByReference()` - Find donation
- `getDonationStats()` - Get statistics
- Data storage (in-memory, replace with DB)

#### controllers/donationController.js
HTTP request handlers that call services and return responses.

#### middleware/
- `errorHandler.js` - Catches and formats errors
- `webhookValidator.js` - Validates webhook signatures
- `requestLogger.js` - Logs all requests

#### utils/
- `logger.js` - Colored console logging
- `response.js` - Standard JSON responses
- `validation.js` - Input validation functions
- `webhook.js` - Webhook signature verification

## 📊 Testing

### Test Payment Verification

```bash
curl -X POST http://localhost:5000/api/donations/verify \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "amount": 100,
    "purpose": "general",
    "type": "onetime",
    "anonymous": false
  }'
```

### Test Webhook

```bash
# Calculate HMAC-SHA512 signature
BODY='{"event":"charge.success","data":{"reference":"test"}}'
SECRET="your_secret_key"
SIGNATURE=$(echo -n "$BODY" | openssl dgst -sha512 -hmac "$SECRET" -hex | cut -d' ' -f2)

curl -X POST http://localhost:5000/api/donations/webhook \
  -H "Content-Type: application/json" \
  -H "X-Paystack-Signature: $SIGNATURE" \
  -d "$BODY"
```

## 🚀 Deployment

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set PAYSTACK_PUBLIC_KEY=pk_live_...
heroku config:set PAYSTACK_SECRET_KEY=sk_live_...
heroku config:set FRONTEND_URL=https://yourdomain.com

# Deploy
git push heroku main
```

### Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create project
railway init

# Set environment variables in dashboard

# Deploy
railway up
```

### Deploy to Render

1. Connect GitHub repository
2. Create new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

## 📝 Database Integration

Currently uses in-memory storage. To add a database:

### Option 1: MongoDB

```bash
npm install mongoose
```

See `/backend/models/` (to be created)

### Option 2: PostgreSQL

```bash
npm install pg sequelize
```

### Option 3: Firebase

```bash
npm install firebase-admin
```

## 🔧 Configuration Reference

### Environment Variables

```env
# Required
PAYSTACK_PUBLIC_KEY        # From Paystack dashboard
PAYSTACK_SECRET_KEY        # From Paystack dashboard (secret!)

# Server
PORT                       # Default: 5000
NODE_ENV                   # development or production
FRONTEND_URL              # CORS origin (http://localhost:3000)

# Optional
LOG_LEVEL                 # debug, info, warn, error
DATABASE_URL              # For database integration
SENDGRID_API_KEY          # For email notifications
EMAIL_FROM                # Sender email
```

## 📋 Checklist

- [ ] Environment variables configured
- [ ] Paystack keys set in `.env`
- [ ] `.env` added to `.gitignore`
- [ ] `npm install` completed
- [ ] `npm run dev` starts without errors
- [ ] Health check returns 200
- [ ] Test payment works
- [ ] CORS settings correct for frontend
- [ ] Webhook configured in Paystack dashboard
- [ ] Ready for production deployment

## 📞 Support

### Common Issues

**Q: "PAYSTACK_PUBLIC_KEY is not configured"**
- Add `PAYSTACK_PUBLIC_KEY` to `.env`

**Q: CORS errors from frontend**
- Check `FRONTEND_URL` in `.env` matches frontend domain
- Ensure frontend port is correct

**Q: Webhook not working**
- Verify webhook signature validation
- Check Paystack dashboard for webhook logs
- Confirm `PAYSTACK_SECRET_KEY` is correct

**Q: Payment verification fails**
- Check if reference is valid
- Verify test vs live keys
- Check Paystack API status

## 🔗 Links

- [Paystack Docs](https://paystack.com/docs)
- [Paystack API Reference](https://paystack.com/docs/api/)
- [Express.js](https://expressjs.com)

## 📄 License

MIT License