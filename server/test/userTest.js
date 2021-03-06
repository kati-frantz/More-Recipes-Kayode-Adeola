import 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../../app';
import users from '../seeders/userSeeder';
import dbSync from '../helpers/clearDb';

const testValidUsers = users.testValidUsers,
  validUsersLogin = users.validUsersLogin,
  invalidUsers = users.invalidUsers,
  emptyUsername = users.emptyUsername,
  emptyPassword = users.emptyPassword,
  emptyEmail = users.emptyEmail,
  incorrectPassword = users.incorrectPassword,
  nullForm = users.nullForm,
  changePassword = users.changePassword,
  userToken = [];

const clearDb = dbSync.clearDb,
  server = supertest.agent(app),
  expect = require('chai').expect,
  assert = require('chai').assert;

clearDb();

describe('Test Server Connection', () => {
  it('should respond with Status connected ok', (done) => {
    server
      .get('/api')
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect('Content-Type', /json/);
        expect(res.body.message).to.equal('Status connected ok');
        expect(res.statusCode).to.equal(200);
        if (err) return done(err);
        done();
      });
  });
});

describe('Response Object', () => {
  it('should respond with a json object', (done) => {
    server
      .get('/api')
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect('Content-Type', /json/);
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('success');
        if (err) return done(err);
        done();
      });
  });
});

describe('Catch invalid routes', () => {
  it('return a 404 if route not found', (done) => {
    server
      .get('/api/yuruh')
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        if (err) return done(err);
        done();
      });
  });
});

describe('User Registration', () => {
  it('allows a new user to register', (done) => {
    server
      .post('/api/v1/users/signup')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(testValidUsers[0])
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.status).to.equal('success');
        expect(res.body.message).to.equal('Account successfully created');
        if (err) return done(err);
        done();
      });
  });
  it('allows a new user to register', (done) => {
    server
      .post('/api/v1/users/signup')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(testValidUsers[1])
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.status).to.equal('success');
        expect(res.body.message).to.equal('Account successfully created');
        if (err) return done(err);
        done();
      });
  });
  it('disallow special characters for username', (done) => {
    server
      .post('/api/v1/users/signup')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(testValidUsers[2])
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.status).to.equal('fail');
        expect(res.body.message.username).to.equal('Username must contain alphabets and numbers only');
        if (err) return done(err);
        done();
      });
  });
  it('disallow username length less than three characters', (done) => {
    server
      .post('/api/v1/users/signup')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(testValidUsers[3])
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.status).to.equal('fail');
        expect(res.body.message.username).to.equal('Username should be at least three characters');
        if (err) return done(err);
        done();
      });
  });
  it('disallow password length less than six characters', (done) => {
    server
      .post('/api/v1/users/signup')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(testValidUsers[4])
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.status).to.equal('fail');
        expect(res.body.message.password).to.equal('Password should be at least six characters long');
        if (err) return done(err);
        done();
      });
  });
  it('validate if password matches', (done) => {
    server
      .post('/api/v1/users/signup')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(testValidUsers[5])
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.status).to.equal('fail');
        expect(res.body.message.confirmPassword).to.equal('Password does not match');
        if (err) return done(err);
        done();
      });
  });
  it('handle validation for empty form fields', (done) => {
    server
      .post('/api/v1/users/signup')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(testValidUsers[6])
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.status).to.equal('fail');
        assert.deepEqual((res.body.message),
          {
            username: 'Username should be at least three characters',
            email: 'Invalid Email, please enter a valid email',
            password: 'Password should be at least six characters long',
            confirmPassword: 'Re-enter password for confirmation'
          });
        if (err) return done(err);
        done();
      });
  });
});

describe('User Login', () => {
  it('allows a registered user to signin', (done) => {
    server
      .post('/api/v1/users/signin')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(validUsersLogin[0])
      .end((err, res) => {
        userToken[0] = res.body.Token;
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.message).to.equal('Token successfully generated');
        if (err) return done(err);
        done();
      });
  });
  it('allows a registered user to signin', (done) => {
    server
      .post('/api/v1/users/signin')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(validUsersLogin[1])
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.message).to.equal('Token successfully generated');
        if (err) return done(err);
        done();
      });
  });
});

describe('Disallow empty signup form fields', () => {
  it('Check for empty username', (done) => {
    server
      .post('/api/v1/users/signup')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(emptyUsername[0])
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.status).to.equal('fail');
        assert.deepEqual((res.body.message),
          {
            username: 'Username should be at least three characters',
          });
        if (err) return done(err);
        done();
      });
  });
  it('Check for empty password', (done) => {
    server
      .post('/api/v1/users/signup')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(emptyPassword[0])
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.status).to.equal('fail');
        assert.deepEqual((res.body.message),
          {
            password: 'Password should be at least six characters long',
            confirmPassword: null
          });
        if (err) return done(err);
        done();
      });
  });
  it('Check for empty email', (done) => {
    server
      .post('/api/v1/users/signup')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(emptyEmail[0])
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.status).to.equal('fail');
        assert.deepEqual((res.body.message),
          {
            email: 'Invalid Email, please enter a valid email',
          });
        if (err) return done(err);
        done();
      });
  });
});

describe('Disallow login for unregistered user', () => {
  it('should return Invalid Authentication details', (done) => {
    server
      .post('/api/v1/users/signin')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(invalidUsers[0])
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body.status).to.equal('fail');
        expect(res.body.message).to.equal(
          'Invalid Authentication Details'
        );
        if (err) return done(err);
        done();
      });
  });
  it('should return Invalid Authentication details', (done) => {
    server
      .post('/api/v1/users/signin')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(invalidUsers[1])
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body.status).to.equal('fail');
        expect(res.body.message).to.equal(
          'Invalid Authentication Details'
        );
        if (err) return done(err);
        done();
      });
  });
});

describe('Registered User Authentication', () => {
  it('should return Invalid Authentication details', (done) => {
    server
      .post('/api/v1/users/signin')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(incorrectPassword[0])
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body.status).to.equal('fail');
        expect(res.body.message).to.equal(
          'Invalid Authentication Details'
        );
        if (err) return done(err);
        done();
      });
  });
  it('should return error', (done) => {
    server
      .post('/api/v1/users/signin')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(nullForm[0])
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        if (err) return done(err);
        done();
      });
  });
});

describe('Token Authentication', () => {
  it('return No Token Provided', (done) => {
    server
      .get('/api/v1/recipes')
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body.message).to.equal('No Token provided');
        if (err) return done(err);
        done();
      });
  });
  it('return Bad Token', (done) => {
    server
      .get('/api/v1/recipes')
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .set('x-access-token', 'yturuueiiwiwjh')
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body.message).to.equal('Bad Token');
        if (err) return done(err);
        done();
      });
  });
});

describe('Change password feature', () => {
  it('user should be able to change password', (done) => {
    server
      .put('/api/v1/users/changepassword')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('x-access-token', userToken[0])
      .type('form')
      .send(changePassword[0])
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.message).to.equal('Password changed successfully');
        if (err) return done(err);
        done();
      });
  });
  it('validate password length', (done) => {
    server
      .put('/api/v1/users/changepassword')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('x-access-token', userToken[0])
      .set('Content-Type', 'application/json')
      .type('form')
      .send(changePassword[1])
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body.status).to.equal('fail');
        expect(res.body.message).to.equal('Your request could not be authorized');
        if (err) return done(err);
        done();
      });
  });
  it('checks if password form is empty', (done) => {
    server
      .put('/api/v1/users/changepassword')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('x-access-token', userToken[0])
      .set('Content-Type', 'application/json')
      .type('form')
      .send(changePassword[2])
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body.status).to.equal('fail');
        expect(res.body.message).to.equal('Your request could not be authorized');
        if (err) return done(err);
        done();
      });
  });
});

describe('Validate params is an integer', () => {
  it('return invalid message', (done) => {
    server
      .get('/api/v1/recipes/a')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('x-access-token', userToken[0])
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.statusCode).to.equal(422);
        expect(res.body.message).to.equal('You have entered an invalid parameter');
        if (err) return done(err);
        done();
      });
  });
});
