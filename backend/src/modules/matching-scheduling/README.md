# Member 4: Matching & Scheduling Backend Module

Production-ready implementation of the matching engine, availability scheduler, and race-condition free meeting booking system for **Global Student Connect**.

---

## 📁 Module Architecture (`src/modules/matching-scheduling/`)

```
backend/src/modules/matching-scheduling/
├── models/
│   ├── Availability.js        # Weekly recurring & date-specific open time windows
│   ├── MatchRequest.js        # Active matchmaking queue requests & preferred slots
│   ├── Session.js             # Confirmed meetings with conflict-detection indexes
│   └── index.js
├── services/
│   ├── matching.service.js    # Pure matching algorithm (+50 topic, +30 time, +AI bonus)
│   └── scheduling.service.js  # Atomic conflict checking & booking logic
├── controllers/
│   └── matching-scheduling.controller.js
├── routes/
│   ├── matching.routes.js     # /api/match routes
│   └── scheduling.routes.js   # /api/schedule routes
├── test/
│   └── matching-scheduling.test.js # Comprehensive test suite
├── README.md
└── index.js                   # Module barrel export
```

---

## 🧩 Step 1: Database Schemas

### 1. `Availability`
- `userId`: ObjectId (indexed, ref `User`)
- `dayOfWeek`: Number `0-6` (0 = Sunday, 6 = Saturday in UTC)
- `date`: Date (for one-off dates when `isRecurring` is `false`)
- `startTime`: Number (minutes from midnight UTC, e.g., `540` = 09:00 UTC)
- `endTime`: Number (minutes from midnight UTC, e.g., `660` = 11:00 UTC)
- `isRecurring`: Boolean (default: `true`)
- `isActive`: Boolean (default: `true`)
- Built-in static converters: `timeStringToMinutes("09:30")` -> `570`, `minutesToTimeString(570)` -> `"09:30"`.

### 2. `MatchRequest`
- `userId`: ObjectId (indexed, ref `User`)
- `topics`: `[String]` (e.g., `["React", "Data Structures", "System Design"]`)
- `preferredTimeSlots`: Array of `{ dayOfWeek, startTime, endTime, date }`
- `status`: Enum `['pending', 'matched', 'cancelled']` (default: `'pending'`)
- `matchedUserId`: ObjectId (ref `User`)
- `matchedSessionId`: ObjectId (ref `Session`)
- `aiCompatibilityBonus`: Number (default: `0`, hook for Member 5 AI integration)

### 3. `Session` (Meeting)
- `participants`: Array of exactly 2 distinct user ObjectIds (`[userA, userB]`)
- `scheduledStart`: UTC Date
- `scheduledEnd`: UTC Date (`scheduledEnd > scheduledStart`)
- `topic`: String
- `meetingLink`: String (auto-generated room URL)
- `roomId`: String (UUID)
- `status`: Enum `['scheduled', 'completed', 'cancelled']` (default: `'scheduled'`)
- Compound Indexes:
  - `{ participants: 1, scheduledStart: 1, scheduledEnd: 1, status: 1 }`

---

## ⚡ Step 2: Matching Algorithm Engine (`findBestMatch`)

Pure service function `findBestMatch(candidateUserId, options)`:
1. **Self-Exclusion**: Excludes the candidate user.
2. **Availability Overlap**: Calculates overlap duration:
   $$\text{overlapStart} = \max(S_A, S_B), \quad \text{overlapEnd} = \min(E_A, E_B)$$
   Valid if $(\text{overlapEnd} - \text{overlapStart}) \ge 30\text{ minutes}$.
3. **Composite Scoring**:
   - **Subject/Topic Match Overlap Weight**: `+50`
   - **Same Available Time Block Weight**: `+30`
   - **AI Compatibility Hook (Member 5)**: `+aiCompatibilityBonus`
4. **Ranking**: Returns the candidate with the highest composite score and the overlapping slot details.

---

## 🔒 Step 3: Race-Condition Free Scheduling Logic

When `bookSession()` is invoked:
1. Validates that both participant IDs are distinct.
2. Checks if either participant already has an active overlapping session:
   ```javascript
   Session.findOne({
     participants: { $in: [userA, userB] },
     status: 'scheduled',
     scheduledStart: { $lt: scheduledEnd },
     scheduledEnd: { $gt: scheduledStart }
   });
   ```
3. If an overlapping session exists, throws a `BookingConflictError` returning **HTTP 409 Conflict**.
4. Uses MongoDB transactions (if replica set is active) or atomic lock verification to ensure no concurrent double-booking occurs.
5. Updates existing `MatchRequest` queue items for both users to `status: 'matched'`.

---

## 🌐 Step 4: API Endpoints & Curl Commands

Base URL: `http://localhost:5000`

> **Note on Authentication**: Uses Member 3 contract via `Authorization: Bearer <token>` or `x-user-id: <mongo_user_id>`.

### 1. Set User Availability Slots
```bash
curl -X POST http://localhost:5000/api/schedule/availability \
  -H "Content-Type: application/json" \
  -H "x-user-id: 65f1a2b3c4d5e6f7a8b9c001" \
  -d '{
    "slots": [
      {
        "dayOfWeek": 2,
        "startTime": "09:00",
        "endTime": "12:00",
        "isRecurring": true
      },
      {
        "dayOfWeek": 4,
        "startTime": "14:00",
        "endTime": "17:00",
        "isRecurring": true
      }
    ]
  }'
```

### 2. Get a User's Open Availability Slots
```bash
curl -X GET http://localhost:5000/api/schedule/availability/65f1a2b3c4d5e6f7a8b9c001 \
  -H "x-user-id: 65f1a2b3c4d5e6f7a8b9c001"
```

### 3. Find Best Match for Current User
```bash
curl -X POST http://localhost:5000/api/match/find \
  -H "Content-Type: application/json" \
  -H "x-user-id: 65f1a2b3c4d5e6f7a8b9c001" \
  -d '{
    "topics": ["React", "System Design"],
    "aiCompatibilityBonus": 15
  }'
```

### 4. Book a Meeting Session (Race-Condition Free)
```bash
curl -X POST http://localhost:5000/api/schedule/book \
  -H "Content-Type: application/json" \
  -H "x-user-id: 65f1a2b3c4d5e6f7a8b9c001" \
  -d '{
    "targetUserId": "65f1a2b3c4d5e6f7a8b9c002",
    "scheduledStart": "2026-09-15T09:00:00.000Z",
    "scheduledEnd": "2026-09-15T10:00:00.000Z",
    "topic": "React Performance & Code Architecture"
  }'
```

### 5. Verify Conflict Prevention (Simulate Double-Booking)
Running the identical booking request again will return:
```json
{
  "success": false,
  "error": "Conflict",
  "message": "Booking conflict: One or both students already have a meeting scheduled during this time slot."
}
```

### 6. Get My Scheduled Sessions
```bash
curl -X GET "http://localhost:5000/api/schedule/sessions/my?status=scheduled" \
  -H "x-user-id: 65f1a2b3c4d5e6f7a8b9c001"
```

### 7. Cancel a Session
```bash
curl -X PATCH http://localhost:5000/api/schedule/sessions/<SESSION_ID>/cancel \
  -H "Content-Type: application/json" \
  -H "x-user-id: 65f1a2b3c4d5e6f7a8b9c001" \
  -d '{
    "reason": "Exam conflict, need to reschedule"
  }'
```

---

## 🧪 Running the Tests
```bash
cd backend
npm test
```
All unit and integration tests execute via Node.js native test runner with 0 dependencies.
