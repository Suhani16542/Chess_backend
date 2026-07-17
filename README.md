# ♟ Chess Academy — Backend API

A production-ready, scalable backend built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, and **Resend** for the Chess Academy platform.

---

## 🚀 Tech Stack

| Layer         | Technology                              |
|---------------|------------------------------------------|
| Runtime       | Node.js ≥ 18                             |
| Framework     | Express.js 4                             |
| Language      | TypeScript (strict mode)                 |
| Database      | MongoDB via Mongoose 9                   |
| Validation    | Zod                                      |
| Email         | Resend                                   |
| Security      | Helmet, CORS, express-rate-limit         |
| Logging       | Morgan + custom colorized logger         |
| Dev Server    | ts-node-dev + Nodemon                    |

---

## 📁 Project Structure

```
Chess_backend/
│
├── src/
│   ├── config/
│   │   ├── db.ts                  # MongoDB connection + events
│   │   ├── env.ts                 # Type-safe env variable loader
│   │   ├── resend.ts              # Resend singleton client
│   │   └── logger.ts              # Colorized logger
│   │
│   ├── controllers/
│   │   └── demo.controller.ts     # Demo lead HTTP handler
│   │
│   ├── routes/
│   │   ├── index.ts               # Root API router + health check
│   │   └── demo.routes.ts         # Demo lead route definitions
│   │
│   ├── services/
│   │   ├── email.service.ts       # Reusable email sending service
│   │   └── demo.service.ts        # Demo lead business logic
│   │
│   ├── models/
│   │   └── DemoLead.model.ts      # Mongoose model + schema
│   │
│   ├── validations/
│   │   └── demo.validation.ts     # Zod validation schema
│   │
│   ├── middlewares/
│   │   ├── error.middleware.ts    # Global error handler
│   │   ├── notFound.middleware.ts # 404 catch-all
│   │   ├── validate.middleware.ts # Zod validation middleware
│   │   └── rateLimiter.ts         # API + form rate limiters
│   │
│   ├── utils/
│   │   ├── ApiError.ts            # Custom error class
│   │   ├── ApiResponse.ts         # Standardized response wrapper
│   │   └── asyncHandler.ts        # Async error forwarding wrapper
│   │
│   ├── types/                     # (reserved for custom TypeScript types)
│   │
│   ├── templates/
│   │   ├── adminLeadTemplate.ts   # Admin notification email HTML
│   │   └── userConfirmationTemplate.ts  # Student confirmation email HTML
│   │
│   ├── app.ts                     # Express app factory
│   └── server.ts                  # Entry point + graceful shutdown
│
├── .env.example                   # Environment variable template
├── .gitignore
├── nodemon.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Setup

### 1. Clone and install dependencies

```bash
cd Chess_backend
npm install
```

### 2. Configure environment variables

```bash
copy .env.example .env
```

Fill in your `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/chess_academy
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
ACADEMY_EMAIL=academy@yourdomain.com
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Start development server

```bash
npm run dev
```

---

## 📡 API Reference

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Chess Academy API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 42
}
```

---

### Demo Lead Module

#### Submit Demo Request

```
POST /api/demo
```

**Request Body:**
```json
{
  "studentName": "Arjun Sharma",
  "parentName": "Rahul Sharma",
  "email": "rahul.sharma@gmail.com",
  "phone": "9876543210",
  "age": 10,
  "city": "Bangalore",
  "chessExperience": "Beginner",
  "preferredTime": "Weekday evenings 6–8 PM",
  "message": "Looking forward to learning chess!"
}
```

**Field Reference:**

| Field             | Type   | Required | Notes                                        |
|-------------------|--------|----------|----------------------------------------------|
| `studentName`     | string | ✅        | 2–100 chars                                  |
| `parentName`      | string | ✅        | 2–100 chars                                  |
| `email`           | string | ✅        | Valid email address                          |
| `phone`           | string | ✅        | 10-digit Indian mobile number                |
| `age`             | number | ✅        | Integer, 4–18                                |
| `city`            | string | ✅        | 2–100 chars                                  |
| `chessExperience` | enum   | ✅        | `None` \| `Beginner` \| `Intermediate` \| `Advanced` |
| `preferredTime`   | string | ✅        | 2–100 chars                                  |
| `message`         | string | ❌        | Optional, max 1000 chars                     |

**Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Your demo class request has been submitted successfully!",
  "data": {
    "leadId": "...",
    "studentName": "Arjun Sharma",
    "email": "rahul.sharma@gmail.com",
    "status": "New",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "_meta": {
      "adminEmailSent": true,
      "confirmationEmailSent": true
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (400 — Validation):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "phone", "message": "Please provide a valid 10-digit Indian phone number" }
  ]
}
```

**Rate Limiting:**
- General API: **100 requests / 15 minutes** per IP
- Demo submission: **5 requests / hour** per IP

---

## 🔄 Flow

```
Client (Next.js)
    │
    ▼
POST /api/demo
    │
    ├─► demoLeadLimiter (rate limit)
    ├─► validate(demoLeadSchema) (Zod)
    │
    ▼
demo.controller.ts
    │
    ▼
demo.service.ts
    ├─► Check duplicate email (MongoDB)
    ├─► Save DemoLead to MongoDB
    └─► sendBulkEmails() [concurrent]
            ├─► Admin Notification Email
            └─► Student Confirmation Email
    │
    ▼
ApiResponse (201)
```

---

## 📜 Scripts

| Script              | Description                                  |
|---------------------|----------------------------------------------|
| `npm run dev`       | Start with Nodemon + ts-node hot reload       |
| `npm run dev:ts`    | Start with ts-node-dev directly               |
| `npm run build`     | Compile TypeScript to `dist/`                 |
| `npm run start`     | Start compiled production server              |
| `npm run type-check`| Run TypeScript type checking without build    |
| `npm run clean`     | Remove `dist/` folder                         |

---

## 🔒 Security Features

- **Helmet** — HTTP security headers
- **CORS** — Configurable allowed origins via env
- **express-rate-limit** — Two-tier rate limiting
- **Zod** — Input validation + sanitization
- **10kb body limit** — Protects against large payload attacks
- **MongoDB strict mode** — Rejects unknown fields
- **No credentials hardcoded** — Everything via `.env`

---

## 📧 Email Templates

Two production-ready HTML email templates are included:

1. **Admin Notification** (`adminLeadTemplate.ts`) — Dark-themed notification sent to the academy with full lead details and a direct reply button.
2. **Student Confirmation** (`userConfirmationTemplate.ts`) — Clean, friendly confirmation email with step-by-step next steps sent to the student's parent.

---

## 🌱 Extending the Backend

To add a new module (e.g., `Enquiry`):

1. Create `src/models/Enquiry.model.ts`
2. Create `src/validations/enquiry.validation.ts`
3. Create `src/services/enquiry.service.ts`
4. Create `src/controllers/enquiry.controller.ts`
5. Create `src/routes/enquiry.routes.ts`
6. Register in `src/routes/index.ts`

---

## 🤝 Frontend Integration

This backend is designed to connect with the **Chess Academy Next.js frontend**.

Set your frontend `.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Connect using:
```ts
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/demo`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});
```

---

*Built with ❤️ for Chess Academy*
