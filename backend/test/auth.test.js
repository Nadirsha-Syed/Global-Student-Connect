import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signup, login, getProfile, updateProfile, generateToken } from '../controllers/authController.js';

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
    assert.ok(User.schema.path('bio'), 'User schema must have bio');
    assert.ok(User.schema.path('profilePicture'), 'User schema must have profilePicture');
    assert.ok(User.schema.path('isProfileComplete'), 'User schema must have isProfileComplete');
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

  await t.test('3b. calculateProfileCompletion calculates dynamic score accurately', () => {
    const user = new User({
      name: 'Ruthvik Reddy',
      country: 'India',
      age: 19,
      gradeLevel: 'College',
      bio: 'I love technology and cultures',
      interests: ['Technology', 'Music'],
      languages: ['English', 'Hindi'],
      profilePicture: 'https://example.com/avatar.jpg',
    });

    const completionScore = user.calculateProfileCompletion();
    assert.equal(completionScore, 100, 'Full profile should have 100% completion');

    const partialUser = new User({
      name: 'Ruthvik Reddy',
      country: 'India',
    });
    assert.equal(partialUser.calculateProfileCompletion(), 30, 'Partial profile should have 30% completion');
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

test('Authentication & Student Profile - Feature 3: Auth Middleware', async (t) => {
  const { requireAuth } = await import('../middleware/auth.js');

  await t.test('1. Valid JWT Bearer token successfully authenticates and calls next()', async () => {
    let nextCalled = false;
    const testUserId = '65f1a2b3c4d5e6f7a8b9c0d1';
    const validToken = jwt.sign(
      { id: testUserId, email: 'student@example.com' },
      process.env.JWT_SECRET || 'global_student_connect_jwt_secret_dev'
    );

    const req = {
      headers: {
        authorization: `Bearer ${validToken}`,
      },
    };
    const res = {
      status: () => res,
      json: () => {},
    };
    const next = () => {
      nextCalled = true;
    };

    await requireAuth(req, res, next);
    assert.equal(nextCalled, true, 'next() must be called for valid JWT');
    assert.equal(req.userId, testUserId);
    assert.equal(req.user.id, testUserId);
  });

  await t.test('2. Expired JWT Bearer token is rejected with 401 and descriptive message', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const expiredToken = jwt.sign(
      { id: '65f1a2b3c4d5e6f7a8b9c0d1' },
      process.env.JWT_SECRET || 'global_student_connect_jwt_secret_dev',
      { expiresIn: '-1s' }
    );

    const req = {
      headers: {
        authorization: `Bearer ${expiredToken}`,
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

    await requireAuth(req, res, () => {});
    assert.equal(statusCode, 401);
    assert.equal(jsonResponse.success, false);
    assert.match(jsonResponse.message, /expired/i);
  });

  await t.test('3. Invalid / forged JWT signature is rejected with 401', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const tamperedToken = jwt.sign(
      { id: '65f1a2b3c4d5e6f7a8b9c0d1' },
      'wrong_secret_key_tampered'
    );

    const req = {
      headers: {
        authorization: `Bearer ${tamperedToken}`,
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

    await requireAuth(req, res, () => {});
    assert.equal(statusCode, 401);
    assert.equal(jsonResponse.success, false);
  });

  await t.test('4. Missing authentication header returns 401 Authentication required', async () => {
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

    await requireAuth(req, res, () => {});
    assert.equal(statusCode, 401);
    assert.equal(jsonResponse.success, false);
    assert.match(jsonResponse.message, /Authentication required/);
  });

  await t.test('5. Supports x-user-id header for service integration', async () => {
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

    await requireAuth(req, res, next);
    assert.equal(nextCalled, true);
    assert.equal(req.userId, '65f1a2b3c4d5e6f7a8b9c0d1');
  });

  await t.test('6. Rejects x-user-id header bypass in production mode', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    try {
      let statusCode = 0;
      let jsonResponse = null;

      const req = {
        headers: {
          'x-user-id': '65f1a2b3c4d5e6f7a8b9c0d1',
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

      await requireAuth(req, res, () => {});
      assert.equal(statusCode, 401, 'Must reject dev fallbacks in production');
      assert.equal(jsonResponse.success, false);
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  await t.test('7. Rejects token belonging to deleted user with 401', async () => {
    const validToken = jwt.sign(
      { id: '65f1a2b3c4d5e6f7a8b9c0d1', email: 'deleted@example.com' },
      process.env.JWT_SECRET || 'global_student_connect_jwt_secret_dev'
    );

    const mongooseModule = await import('mongoose');
    const originalReadyState = mongooseModule.default.connection.readyState;
    // Simulate DB connected
    Object.defineProperty(mongooseModule.default.connection, 'readyState', {
      value: 1,
      configurable: true,
    });

    const originalFindById = User.findById;
    User.findById = () => ({
      select: async () => null, // user deleted
    });

    try {
      let statusCode = 0;
      let jsonResponse = null;

      const req = {
        headers: {
          authorization: `Bearer ${validToken}`,
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

      await requireAuth(req, res, () => {});
      assert.equal(statusCode, 401);
      assert.equal(jsonResponse.success, false);
      assert.match(jsonResponse.message, /no longer exists/i);
    } finally {
      User.findById = originalFindById;
      Object.defineProperty(mongooseModule.default.connection, 'readyState', {
        value: originalReadyState,
        configurable: true,
      });
    }
  });
});

test('Authentication & Student Profile - Feature 4: Get Profile API', async (t) => {
  await t.test('1. Get profile successfully returns student information without password', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const mockProfile = {
      _id: '65f1a2b3c4d5e6f7a8b9c0d1',
      name: 'Kruthika Priyadarshini',
      email: 'kruthika@example.com',
      country: 'India',
      timezone: 'Asia/Kolkata',
      age: 18,
      gradeLevel: 'College Freshman',
      languages: ['English', 'Telugu'],
      interests: ['Web Development', 'AI'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const originalFindById = User.findById;
    User.findById = () => ({
      select: async () => mockProfile,
    });

    try {
      const req = {
        userId: '65f1a2b3c4d5e6f7a8b9c0d1',
        user: { id: '65f1a2b3c4d5e6f7a8b9c0d1' },
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

      await getProfile(req, res, () => {});
      assert.equal(statusCode, 200);
      assert.equal(jsonResponse.success, true);
      assert.equal(jsonResponse.user.name, 'Kruthika Priyadarshini');
      assert.equal(jsonResponse.user.email, 'kruthika@example.com');
      assert.equal(jsonResponse.user.password, undefined, 'Password must never be returned');
    } finally {
      User.findById = originalFindById;
    }
  });

  await t.test('2. Get profile returns 404 when student record is not found', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const originalFindById = User.findById;
    User.findById = () => ({
      select: async () => null,
    });

    try {
      const req = {
        userId: '65f1a2b3c4d5e6f7a8b9c000',
        user: { id: '65f1a2b3c4d5e6f7a8b9c000' },
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

      await getProfile(req, res, () => {});
      assert.equal(statusCode, 404);
      assert.equal(jsonResponse.success, false);
      assert.equal(jsonResponse.message, 'Student profile not found');
    } finally {
      User.findById = originalFindById;
    }
  });

  await t.test('3. Get profile returns 401 when unauthenticated', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const req = {};
    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        jsonResponse = data;
      },
    };

    await getProfile(req, res, () => {});
    assert.equal(statusCode, 401);
    assert.equal(jsonResponse.success, false);
  });
});

test('Authentication & Student Profile - Feature 5: Update Profile API', async (t) => {
  await t.test('1. Successfully updates student profile fields and omits password', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const mockUser = {
      _id: '65f1a2b3c4d5e6f7a8b9c0d1',
      name: 'Old Name',
      email: 'student@example.com',
      password: 'hashedSecretPassword',
      country: 'Old Country',
      timezone: 'UTC',
      age: 16,
      gradeLevel: '10th',
      languages: ['English'],
      interests: ['Reading'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      save: async function () {
        return this;
      },
    };

    const originalFindById = User.findById;
    User.findById = async () => mockUser;

    try {
      const req = {
        userId: '65f1a2b3c4d5e6f7a8b9c0d1',
        body: {
          name: 'Updated Student Name',
          country: 'Germany',
          timezone: 'Europe/Berlin',
          age: 18,
          gradeLevel: '12th Grade',
          languages: ['German', 'English'],
          interests: ['Robotics', 'Quantum Computing'],
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

      await updateProfile(req, res, () => {});
      assert.equal(statusCode, 200);
      assert.equal(jsonResponse.success, true);
      assert.equal(jsonResponse.message, 'Profile updated successfully');
      assert.equal(jsonResponse.user.name, 'Updated Student Name');
      assert.equal(jsonResponse.user.country, 'Germany');
      assert.equal(jsonResponse.user.timezone, 'Europe/Berlin');
      assert.equal(jsonResponse.user.age, 18);
      assert.equal(jsonResponse.user.gradeLevel, '12th Grade');
      assert.deepEqual(jsonResponse.user.languages, ['German', 'English']);
      assert.deepEqual(jsonResponse.user.interests, ['Robotics', 'Quantum Computing']);
      assert.equal(jsonResponse.user.password, undefined, 'Password must never be returned');
      assert.ok(typeof jsonResponse.user.profileCompletion === 'number', 'profileCompletion must be returned');
    } finally {
      User.findById = originalFindById;
    }
  });

  await t.test('2. Validates against empty name and empty country', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const mockUser = {
      _id: '65f1a2b3c4d5e6f7a8b9c0d1',
      name: 'Existing Name',
      country: 'Existing Country',
    };

    const originalFindById = User.findById;
    User.findById = async () => mockUser;

    try {
      // Test empty name
      const reqEmptyName = {
        userId: '65f1a2b3c4d5e6f7a8b9c0d1',
        body: { name: '   ' },
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

      await updateProfile(reqEmptyName, res, () => {});
      assert.equal(statusCode, 400);
      assert.equal(jsonResponse.success, false);
      assert.equal(jsonResponse.message, 'Name cannot be empty');

      // Test empty country
      const reqEmptyCountry = {
        userId: '65f1a2b3c4d5e6f7a8b9c0d1',
        body: { country: '  ' },
      };

      await updateProfile(reqEmptyCountry, res, () => {});
      assert.equal(statusCode, 400);
      assert.equal(jsonResponse.success, false);
      assert.equal(jsonResponse.message, 'Country cannot be empty');
    } finally {
      User.findById = originalFindById;
    }
  });

  await t.test('3. Validates invalid age boundary values', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const mockUser = {
      _id: '65f1a2b3c4d5e6f7a8b9c0d1',
    };

    const originalFindById = User.findById;
    User.findById = async () => mockUser;

    try {
      const req = {
        userId: '65f1a2b3c4d5e6f7a8b9c0d1',
        body: { age: 200 },
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

      await updateProfile(req, res, () => {});
      assert.equal(statusCode, 400);
      assert.equal(jsonResponse.success, false);
      assert.match(jsonResponse.message, /valid age/i);
    } finally {
      User.findById = originalFindById;
    }
  });

  await t.test('4. Update profile returns 404 when student record not found', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const originalFindById = User.findById;
    User.findById = async () => null;

    try {
      const req = {
        userId: '65f1a2b3c4d5e6f7a8b9c000',
        body: { name: 'New Name' },
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

      await updateProfile(req, res, () => {});
      assert.equal(statusCode, 404);
      assert.equal(jsonResponse.success, false);
      assert.equal(jsonResponse.message, 'Student profile not found');
    } finally {
      User.findById = originalFindById;
    }
  });

  await t.test('5. Update profile returns 401 when unauthenticated', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const req = { body: {} };
    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        jsonResponse = data;
      },
    };

    await updateProfile(req, res, () => {});
    assert.equal(statusCode, 401);
    assert.equal(jsonResponse.success, false);
  });

  await t.test('6. Validates bio does not exceed 500 characters', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const mockUser = {
      _id: '65f1a2b3c4d5e6f7a8b9c0d1',
    };

    const originalFindById = User.findById;
    User.findById = async () => mockUser;

    try {
      const longBio = 'A'.repeat(501);
      const req = {
        userId: '65f1a2b3c4d5e6f7a8b9c0d1',
        body: { bio: longBio },
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

      await updateProfile(req, res, () => {});
      assert.equal(statusCode, 400);
      assert.equal(jsonResponse.success, false);
      assert.equal(jsonResponse.message, 'Bio cannot exceed 500 characters');
    } finally {
      User.findById = originalFindById;
    }
  });

  await t.test('7. Auto-updates isProfileComplete when not explicitly provided', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const mockUser = {
      _id: '65f1a2b3c4d5e6f7a8b9c0d1',
      name: 'Full Profile Student',
      email: 'full@example.com',
      country: 'India',
      age: 20,
      gradeLevel: 'College',
      bio: 'Comprehensive bio here',
      languages: ['English'],
      interests: ['Coding'],
      profilePicture: 'https://example.com/pic.jpg',
      calculateProfileCompletion: () => 100,
      save: async function () { return this; },
    };

    const originalFindById = User.findById;
    User.findById = async () => mockUser;

    try {
      const req = {
        userId: '65f1a2b3c4d5e6f7a8b9c0d1',
        body: { name: 'Full Profile Student' },
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

      await updateProfile(req, res, () => {});
      assert.equal(statusCode, 200);
      assert.equal(jsonResponse.user.isProfileComplete, true, 'isProfileComplete should auto-set to true for >= 80%');
    } finally {
      User.findById = originalFindById;
    }
  });

  await t.test('8. Type checking: non-string fields in signup return 400 instead of 500', async () => {
    let statusCode = 0;
    let jsonResponse = null;

    const req = {
      body: {
        name: 12345, // invalid type
        email: 'test@example.com',
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
});



