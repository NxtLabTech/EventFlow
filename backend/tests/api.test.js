import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createRequire } from 'node:module';

// Load the CommonJS app through require so the app and the tests share one Mongoose instance
const require = createRequire(import.meta.url);
const app = require('../src/app.js');
const Event = require('../src/models/Event.js');
const Registration = require('../src/models/Registration.js');
const mongoose = require('mongoose');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  await Registration.init(); // make sure the unique index exists
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Event.deleteMany({});
  await Registration.deleteMany({});
});

const validEvent = (overrides = {}) => ({
  title: 'Node Meetup',
  description: 'Talks about Node.js',
  date: '2099-01-15',
  time: '18:30',
  location: 'Hyderabad',
  organizer: 'NxtLabTech',
  capacity: 2,
  ...overrides,
});

const createEvent = async (overrides) => (await request(app).post('/api/events').send(validEvent(overrides))).body;

describe('events', () => {
  test('creates an event', async () => {
    const res = await request(app).post('/api/events').send(validEvent());
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'Node Meetup', capacity: 2 });
    expect(res.body._id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  test('rejects invalid event data with 400', async () => {
    const res = await request(app)
      .post('/api/events')
      .send(validEvent({ title: '', date: '2026-02-31', capacity: 0 }));
    expect(res.status).toBe(400);
    expect(Object.keys(res.body.details)).toEqual(expect.arrayContaining(['title', 'date', 'capacity']));
  });

  test('rejects overly long title', async () => {
    const res = await request(app).post('/api/events').send(validEvent({ title: 'x'.repeat(101) }));
    expect(res.status).toBe(400);
    expect(res.body.details.title).toBeDefined();
  });

  test('creates an event without optional description', async () => {
    const data = validEvent();
    delete data.description;
    const res = await request(app).post('/api/events').send(data);
    expect(res.status).toBe(201);
    expect(res.body.description).toBe('');
    expect(await Event.countDocuments()).toBe(1);
  });

  test('rejects empty payload and reports all missing required fields', async () => {
    const res = await request(app).post('/api/events').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toEqual({
      title: 'title is required',
      location: 'location is required',
      organizer: 'organizer is required',
      date: 'date is required',
      time: 'time is required',
      capacity: 'capacity is required',
    });
    expect(await Event.countDocuments()).toBe(0);
  });

  test('rejects missing individual required fields and does not save to MongoDB', async () => {
    const fields = ['title', 'date', 'time', 'location', 'organizer', 'capacity'];
    for (const field of fields) {
      const payload = validEvent();
      delete payload[field];
      const res = await request(app).post('/api/events').send(payload);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(res.body.details[field]).toMatch(new RegExp(`${field} is required`, 'i'));
      expect(await Event.countDocuments()).toBe(0);
    }
  });

  test('rejects whitespace-only text fields', async () => {
    for (const field of ['title', 'location', 'organizer']) {
      const res = await request(app).post('/api/events').send(validEvent({ [field]: '   ' }));
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(res.body.details[field]).toBe(`${field} is required`);
      expect(await Event.countDocuments()).toBe(0);
    }
  });

  test('rejects non-object array payload', async () => {
    const res = await request(app).post('/api/events').send([validEvent()]);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details.body).toBeDefined();
    expect(await Event.countDocuments()).toBe(0);
  });

  test('rejects non-string types for string fields', async () => {
    const res = await request(app)
      .post('/api/events')
      .send(validEvent({ title: 12345, location: true, organizer: { name: 'Org' }, description: 999 }));
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details.title).toBe('title must be a string');
    expect(res.body.details.location).toBe('location must be a string');
    expect(res.body.details.organizer).toBe('organizer must be a string');
    expect(res.body.details.description).toBe('description must be a string');
    expect(await Event.countDocuments()).toBe(0);
  });

  test('rejects fields exceeding maximum allowed lengths', async () => {
    const res = await request(app).post('/api/events').send(
      validEvent({
        location: 'l'.repeat(201),
        organizer: 'o'.repeat(101),
        description: 'd'.repeat(2001),
      })
    );
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details.location).toBe('location must be at most 200 characters');
    expect(res.body.details.organizer).toBe('organizer must be at most 100 characters');
    expect(res.body.details.description).toBe('description must be at most 2000 characters');
    expect(await Event.countDocuments()).toBe(0);
  });

  test('rejects invalid date values and formats', async () => {
    const invalidDates = ['not-a-date', '2026-02-31', '2026-13-01', '2026/01/15', '01-15-2099', 12345];
    for (const badDate of invalidDates) {
      const res = await request(app).post('/api/events').send(validEvent({ date: badDate }));
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(res.body.details.date).toBe('date must be a valid date in YYYY-MM-DD format');
      expect(await Event.countDocuments()).toBe(0);
    }
  });

  test('rejects invalid time formats', async () => {
    const invalidTimes = ['25:00', '12:60', '9:30', 'noon', '12:00:00', 1830];
    for (const badTime of invalidTimes) {
      const res = await request(app).post('/api/events').send(validEvent({ time: badTime }));
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(res.body.details.time).toBe('time must be in HH:MM (24-hour) format');
      expect(await Event.countDocuments()).toBe(0);
    }
  });

  test('rejects invalid capacity values (zero, negative, decimal, non-numeric, overflow)', async () => {
    const invalidCapacities = [0, -5, 1.5, 'abc', 100001, true];
    for (const badCap of invalidCapacities) {
      const res = await request(app).post('/api/events').send(validEvent({ capacity: badCap }));
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(res.body.details.capacity).toBe('capacity must be a positive whole number (max 100000)');
      expect(await Event.countDocuments()).toBe(0);
    }
  });

  test('ensures invalid event data is never saved in MongoDB when other events exist', async () => {
    await createEvent({ title: 'Existing Event' });
    expect(await Event.countDocuments()).toBe(1);

    const res = await request(app).post('/api/events').send(validEvent({ title: '', capacity: -1 }));
    expect(res.status).toBe(400);
    expect(await Event.countDocuments()).toBe(1);
  });

  test('lists events sorted by date', async () => {
    await createEvent({ title: 'Later', date: '2099-05-01' });
    await createEvent({ title: 'Sooner', date: '2099-02-01' });
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(res.body.map((e) => e.title)).toEqual(['Sooner', 'Later']);
  });

  test('gets an event by id with registration count', async () => {
    const event = await createEvent();
    const res = await request(app).get(`/api/events/${event._id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Node Meetup');
    expect(res.body.registrationCount).toBe(0);
  });

  test('returns 404 for unknown or malformed event id', async () => {
    const missing = await request(app).get(`/api/events/${new mongoose.Types.ObjectId()}`);
    expect(missing.status).toBe(404);
    const malformed = await request(app).get('/api/events/not-an-id');
    expect(malformed.status).toBe(404);
  });

  test('updates an event', async () => {
    const event = await createEvent();
    const res = await request(app)
      .put(`/api/events/${event._id}`)
      .send(validEvent({ title: 'Renamed', capacity: 10 }));
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ title: 'Renamed', capacity: 10 });
  });

  test('does not allow capacity below current registrations', async () => {
    const event = await createEvent({ capacity: 2 });
    await request(app).post(`/api/events/${event._id}/register`).send({ name: 'A', email: 'a@x.com' });
    await request(app).post(`/api/events/${event._id}/register`).send({ name: 'B', email: 'b@x.com' });
    const res = await request(app).put(`/api/events/${event._id}`).send(validEvent({ capacity: 1 }));
    expect(res.status).toBe(400);
    expect(res.body.details.capacity).toBeDefined();
  });

  test('update of missing event returns 404', async () => {
    const res = await request(app).put(`/api/events/${new mongoose.Types.ObjectId()}`).send(validEvent());
    expect(res.status).toBe(404);
  });

  test('deletes an event and its registrations', async () => {
    const event = await createEvent();
    await request(app).post(`/api/events/${event._id}/register`).send({ name: 'A', email: 'a@x.com' });
    const res = await request(app).delete(`/api/events/${event._id}`);
    expect(res.status).toBe(200);
    expect((await request(app).get(`/api/events/${event._id}`)).status).toBe(404);
    expect(await Registration.countDocuments()).toBe(0);
  });
});

describe('registrations', () => {
  test('registers a participant and lists them', async () => {
    const event = await createEvent();
    const res = await request(app)
      .post(`/api/events/${event._id}/register`)
      .send({ name: 'Asha', email: 'Asha@Example.com' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Asha', email: 'asha@example.com', eventId: event._id });

    const list = await request(app).get(`/api/events/${event._id}/registrations`);
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
  });

  test('rejects invalid name/email', async () => {
    const event = await createEvent();
    const res = await request(app).post(`/api/events/${event._id}/register`).send({ name: ' ', email: 'nope' });
    expect(res.status).toBe(400);
    expect(Object.keys(res.body.details)).toEqual(expect.arrayContaining(['name', 'email']));
  });

  test('rejects duplicate registration with 409', async () => {
    const event = await createEvent();
    const body = { name: 'Asha', email: 'asha@example.com' };
    await request(app).post(`/api/events/${event._id}/register`).send(body);
    const res = await request(app).post(`/api/events/${event._id}/register`).send({ ...body, email: 'ASHA@example.com' });
    expect(res.status).toBe(409);
  });

  test('rejects registration when capacity is reached', async () => {
    const event = await createEvent({ capacity: 1 });
    await request(app).post(`/api/events/${event._id}/register`).send({ name: 'A', email: 'a@x.com' });
    const res = await request(app).post(`/api/events/${event._id}/register`).send({ name: 'B', email: 'b@x.com' });
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/full/i);
  });

  test('registration for a nonexistent event returns 404', async () => {
    const id = new mongoose.Types.ObjectId();
    const post = await request(app).post(`/api/events/${id}/register`).send({ name: 'A', email: 'a@x.com' });
    expect(post.status).toBe(404);
    const get = await request(app).get(`/api/events/${id}/registrations`);
    expect(get.status).toBe(404);
  });
});

describe('stats & misc', () => {
  test('returns dashboard stats', async () => {
    const upcoming = await createEvent({ date: '2099-01-01' });
    await createEvent({ date: '2000-01-01' });
    await request(app).post(`/api/events/${upcoming._id}/register`).send({ name: 'A', email: 'a@x.com' });
    const res = await request(app).get('/api/stats');
    expect(res.body).toEqual({ totalEvents: 2, totalRegistrations: 1, upcomingEvents: 1 });
  });

  test('invalid JSON returns 400 and unknown route 404', async () => {
    const bad = await request(app).post('/api/events').set('Content-Type', 'application/json').send('{bad');
    expect(bad.status).toBe(400);
    expect((await request(app).get('/api/nope')).status).toBe(404);
  });

  test('errorHandler formats Mongoose ValidationError and CastError as 400', () => {
    const { errorHandler } = require('../src/middleware/errorHandler.js');
    const resVal = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const validationError = new mongoose.Error.ValidationError();
    validationError.errors = {
      title: new mongoose.Error.ValidatorError({ message: 'Title is required', path: 'title' }),
    };
    errorHandler(validationError, {}, resVal, () => {});
    expect(resVal.status).toHaveBeenCalledWith(400);
    expect(resVal.json).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: { title: 'Title is required' },
    });

    const resCast = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const castError = new mongoose.Error.CastError('number', 'abc', 'capacity');
    errorHandler(castError, {}, resCast, () => {});
    expect(resCast.status).toHaveBeenCalledWith(400);
    expect(resCast.json).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: { capacity: 'Invalid value for capacity' },
    });
  });
});
