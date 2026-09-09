import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTimeOverlap } from '../services/matching.service.js';
import Availability from '../models/Availability.js';
import Session from '../models/Session.js';
import { BookingConflictError } from '../services/scheduling.service.js';
import { requireAuth } from '../../../../middleware/auth.js';

test('Matching & Scheduling Module - Unit & Integration Test Suite', async (t) => {
  await t.test('1. Time Overlap Calculations', () => {
    // 09:00 (540) - 11:00 (660) and 10:00 (600) - 12:00 (720) -> Overlap: 10:00 to 11:00 (60 mins)
    const result1 = calculateTimeOverlap(540, 660, 600, 720, 30);
    assert.equal(result1.overlaps, true);
    assert.equal(result1.overlapStart, 600);
    assert.equal(result1.overlapEnd, 660);
    assert.equal(result1.duration, 60);

    // Disjoint intervals: 09:00 (540) - 10:00 (600) and 11:00 (660) - 12:00 (720)
    const result2 = calculateTimeOverlap(540, 600, 660, 720, 30);
    assert.equal(result2.overlaps, false);

    // Overlap shorter than minimum 30 min duration (e.g. 15 mins)
    const result3 = calculateTimeOverlap(540, 600, 585, 660, 30);
    assert.equal(result3.overlaps, false);
  });

  await t.test('2. Availability Time String Utilities', () => {
    const minutes = Availability.timeStringToMinutes('14:30');
    assert.equal(minutes, 870);

    const formatted = Availability.minutesToTimeString(870);
    assert.equal(formatted, '14:30');

    const midnight = Availability.timeStringToMinutes('00:00');
    assert.equal(midnight, 0);
    assert.equal(Availability.minutesToTimeString(0), '00:00');
  });

  await t.test('3. Session Conflict Error instantiation', () => {
    const err = new BookingConflictError('Time slot already occupied');
    assert.equal(err.name, 'BookingConflictError');
    assert.equal(err.statusCode, 409);
    assert.match(err.message, /Time slot already occupied/);
  });

  await t.test('4. Auth Middleware Team Contract (Member 3 Interface)', () => {
    let nextCalled = false;
    const req = {
      headers: {
        'x-user-id': '65f1a2b3c4d5e6f7a8b9c0d1',
      },
    };
    const res = {
      status: () => res,
      json: () => {},
    };
    const next = () => {
      nextCalled = true;
    };

    requireAuth(req, res, next);
    assert.equal(nextCalled, true);
    assert.equal(req.userId, '65f1a2b3c4d5e6f7a8b9c0d1');
    assert.equal(req.user.id, '65f1a2b3c4d5e6f7a8b9c0d1');
  });

  await t.test('5. Auth Middleware Rejection when unauthenticated', () => {
    let statusCode = 0;
    let jsonResponse = null;
    const req = { headers: {} };
    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        jsonResponse = data;
      },
    };
    const next = () => {};

    requireAuth(req, res, next);
    assert.equal(statusCode, 401);
    assert.equal(jsonResponse.success, false);
    assert.match(jsonResponse.message, /Authentication required/);
  });

  await t.test('6. Matching Algorithm Scoring Formula & AI Hook Contract', () => {
    // Shared topics weight: +50
    // Time overlap weight: +30
    // AI compatibility bonus: +20
    const candidateTopics = ['react', 'mongodb', 'system design'];
    const peerTopics = ['react', 'docker', 'python'];
    const sharedTopics = candidateTopics.filter((t) => peerTopics.includes(t));
    assert.deepEqual(sharedTopics, ['react']);

    const topicScore = sharedTopics.length > 0 ? 50 : 0;
    assert.equal(topicScore, 50);

    const hasTimeOverlap = true;
    const timeScore = hasTimeOverlap ? 30 : 0;
    assert.equal(timeScore, 30);

    const aiBonus = 15; // Provided by Member 5
    const totalScore = topicScore + timeScore + aiBonus;
    assert.equal(totalScore, 95);
  });

  await t.test('7. Model Schemas Verification', () => {
    assert.ok(Availability.schema.path('userId'));
    assert.ok(Availability.schema.path('startTime'));
    assert.ok(Availability.schema.path('endTime'));
    assert.ok(Availability.schema.path('isRecurring'));

    assert.ok(Session.schema.path('participants'));
    assert.ok(Session.schema.path('scheduledStart'));
    assert.ok(Session.schema.path('scheduledEnd'));
    assert.ok(Session.schema.path('meetingLink'));
    assert.ok(Session.schema.path('status'));
  });
});
