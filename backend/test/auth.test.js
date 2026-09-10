import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signup, login, generateToken } from '../controllers/authController.js';

test('Authentication & Student Profile - Feature 1: Signup & User Model', async (t) => {
  await t.test('1. User Schema definition and paths', () => {
    assert.ok(User.schema.path('name'), 'User schema must have name');
    assert.ok(User.schema.path('email'), 'User schema must have email');
    assert.ok(User.schema.path('password'), 'User schema must have password');
    assert.ok(User.schema.path('country'), 'User schema must have country');
    assert.ok(User.schema.path('timezone'), 'User schema must have timezone');
    assert.ok(User.schema.path('age'), 'User schema must have age');
    assert.ok(User.schema.path('gradeLevel'), 'User schema must have gradeLevel');
    assert.ok(User.schema.path('interests'), 'User schema must have interests');
    assert.ok(User.schema.path('languages'), 'User schema must have languages');
  });

  await t.test('2. Password hashing & comparePassword method', async () => {
    const plainPassword = 'StudentSecret123!';
    const user = new User({
      name: 'Kruthika Test',
      email: 'kruthika@example.com',
      password: plainPassword,
      country: 'India',
    });

    // Simulate pre-save hook
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    assert.notEqual(user.password, plainPassword, 'Password must be hashed');
    assert.ok(user.password.startsWith('$2'), 'Password hash must be a bcrypt string');

    const isMatch = await user.comparePassword(plainPassword);
    assert.equal(isMatch, true, 'comparePassword should return true for correct password');

    const isMismatch = await user.comparePassword('WrongPassword123');
    assert.equal(isMismatch, false, 'comparePassword should return false for incorrect password');
  });

  await t.test('3. toJSON transforms removes password and __v', () => {
    const user = new User({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: 'hashedPasswordGoesHere',
      country: 'India',
    });

    const json = user.toJSON();
    assert.equal(json.password, undefined, 'toJSON must not expose password');
    assert.equal(json.__v, undefined, 'toJSON must not expose __v');
  });

  await t.test('4. generateToken produces valid JWT token', () => {
    const testId = '65f1a2b3c4d5e6f7a8b9c0d1';
    const testEmail = 'student@example.com';
    const token = generateToken(testId, testEmail);

    assert.ok(token, 'Token must be generated');
    const decoded = jwt.decode(token);
    assert.equal(decoded.id, testId);
    assert.equal(decoded.email, testEmail);
  });

  await t.test('5. Signup validation: Missing required name', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const req = {
      body: {
        email: 'student@example.com',
        password: 'password123',
        country: 'India',
      },
    };
    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        jsonResponse = data;
      },
    };

    await signup(req, res, () => {});
    assert.equal(statusCode, 400);
    assert.equal(jsonResponse.success, false);
    assert.equal(jsonResponse.message, 'Name is required');
  });

  await t.test('6. Signup validation: Missing required email & invalid format', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const reqMissing = {
      body: {
        name: 'Student Name',
        password: 'password123',
        country: 'India',
      },
    };
    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        jsonResponse = data;
      },
    };

    await signup(reqMissing, res, () => {});
    assert.equal(statusCode, 400);
    assert.equal(jsonResponse.success, false);
    assert.equal(jsonResponse.message, 'Email is required');

    const reqInvalid = {
      body: {
        name: 'Student Name',
        email: 'invalid-email-format',
        password: 'password123',
        country: 'India',
      },
    };

    await signup(reqInvalid, res, () => {});
    assert.equal(statusCode, 400);
    assert.equal(jsonResponse.success, false);
    assert.equal(jsonResponse.message, 'Please provide a valid email address');
  });

  await t.test('7. Signup validation: Short password (< 6 chars)', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const req = {
      body: {
        name: 'Student Name',
        email: 'student@example.com',
        password: '123',
        country: 'India',
      },
    };
    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        jsonResponse = data;
      },
    };

    await signup(req, res, () => {});
    assert.equal(statusCode, 400);
    assert.equal(jsonResponse.success, false);
    assert.equal(jsonResponse.message, 'Password must be at least 6 characters long');
  });

  await t.test('8. Signup validation: Missing country', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const req = {
      body: {
        name: 'Student Name',
        email: 'student@example.com',
        password: 'password123',
      },
    };
    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        jsonResponse = data;
      },
    };

    await signup(req, res, () => {});
    assert.equal(statusCode, 400);
    assert.equal(jsonResponse.success, false);
    assert.equal(jsonResponse.message, 'Country is required');
  });
});

test('Authentication & Student Profile - Feature 2: Login API', async (t) => {
  await t.test('1. Login validation: Missing email', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const req = {
      body: {
        password: 'password123',
      },
    };
    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        jsonResponse = data;
      },
    };

    await login(req, res, () => {});
    assert.equal(statusCode, 400);
    assert.equal(jsonResponse.success, false);
    assert.equal(jsonResponse.message, 'Email is required');
  });

  await t.test('2. Login validation: Missing password', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const req = {
      body: {
        email: 'student@example.com',
      },
    };
    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        jsonResponse = data;
      },
    };

    await login(req, res, () => {});
    assert.equal(statusCode, 400);
    assert.equal(jsonResponse.success, false);
    assert.equal(jsonResponse.message, 'Password is required');
  });

  await t.test('3. Login authentication: Non-existent student email', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    // Mock User.findOne returning null
    const originalFindOne = User.findOne;
    User.findOne = async () => null;

    try {
      const req = {
        body: {
          email: 'nonexistent@example.com',
          password: 'Password123!',
        },
      };
      const res = {
        status: (code) => {
          statusCode = code;
          return res;
        },
        json: (data) => {
          jsonResponse = data;
        },
      };

      await login(req, res, () => {});
      assert.equal(statusCode, 401);
      assert.equal(jsonResponse.success, false);
      assert.equal(jsonResponse.message, 'Invalid email or password');
    } finally {
      User.findOne = originalFindOne;
    }
  });

  await t.test('4. Login authentication: Incorrect password', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const mockUser = {
      _id: '65f1a2b3c4d5e6f7a8b9c0d1',
      email: 'student@example.com',
      comparePassword: async () => false,
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    try {
      const req = {
        body: {
          email: 'student@example.com',
          password: 'WrongPassword',
        },
      };
      const res = {
        status: (code) => {
          statusCode = code;
          return res;
        },
        json: (data) => {
          jsonResponse = data;
        },
      };

      await login(req, res, () => {});
      assert.equal(statusCode, 401);
      assert.equal(jsonResponse.success, false);
      assert.equal(jsonResponse.message, 'Invalid email or password');
    } finally {
      User.findOne = originalFindOne;
    }
  });

  await t.test('5. Login authentication: Successful login returns token and student profile', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const mockUser = {
      _id: '65f1a2b3c4d5e6f7a8b9c0d1',
      name: 'Aarav Patel',
      email: 'aarav.patel@example.com',
      country: 'India',
      timezone: 'Asia/Kolkata',
      age: 17,
      gradeLevel: '12th Grade',
      languages: ['English', 'Hindi'],
      interests: ['Coding', 'Astronomy'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comparePassword: async (pwd) => pwd === 'CorrectPassword123',
    };

    const originalFindOne = User.findOne;
    User.findOne = async () => mockUser;

    try {
      const req = {
        body: {
          email: 'aarav.patel@example.com',
          password: 'CorrectPassword123',
        },
      };
      const res = {
        status: (code) => {
          statusCode = code;
          return res;
        },
        json: (data) => {
          jsonResponse = data;
        },
      };

      await login(req, res, () => {});
      assert.equal(statusCode, 200);
      assert.equal(jsonResponse.success, true);
      assert.equal(jsonResponse.message, 'Login successful');
      assert.ok(jsonResponse.token, 'Token should be returned');
      assert.equal(jsonResponse.user.name, 'Aarav Patel');
      assert.equal(jsonResponse.user.email, 'aarav.patel@example.com');
      assert.equal(jsonResponse.user.password, undefined, 'Password must never be exposed');

      const decoded = jwt.decode(jsonResponse.token);
      assert.equal(decoded.id, '65f1a2b3c4d5e6f7a8b9c0d1');
    } finally {
      User.findOne = originalFindOne;
    }
  });
});

