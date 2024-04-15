import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import SequelizeUser from '../database/models/SequelizeUser';
import { invalidEmailLoginBody, invalidPasswordLoginBody, userRegistered, validLoginBody, wrongPassUser } from './mocks/User.mock';
import JWT from '../utils/JWT';
import Validations from '../middlewares/Validations';

chai.use(chaiHttp);

const { expect } = chai;

describe('Login Test', function() {
  it('a successful login should return a token', async function() {
    sinon.stub(Validations, 'validateLogin').returns();
    sinon.stub(SequelizeUser, 'findOne').resolves(userRegistered as any);
    sinon.stub(JWT, 'sign').returns('validToken');

    const { status, body } = await chai.request(app)
      .post('/login')
      .send(validLoginBody);

    expect(status).to.equal(200);
    expect(body).to.have.key('token');
  });

  it('shouldn\'t login with an invalid body data', async function() {
    const { status, body } = await chai.request(app)
      .post('/login')
      .send({});

    expect(status).to.equal(400);
    expect(body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('shouldn\'t login with an invalid email', async function() {
    const { status, body } = await chai.request(app).post('/login')
      .send(invalidEmailLoginBody);

    expect(status).to.equal(401);
    expect(body).to.be.deep.equal({ message: 'Invalid email or password' });
  });

  it('shouldn\'t login with an invalid password', async function() {
    const { status, body } = await chai.request(app).post('/login')
      .send(invalidPasswordLoginBody);

    expect(status).to.equal(401);
    expect(body).to.be.deep.equal({ message: 'Invalid email or password' });
  });

  it('shouldn\'t login when user is not found', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(null);

    const { status, body } = await chai.request(app)
      .post('/login')
      .send(validLoginBody);
    expect(status).to.equal(401);
    expect(body).to.be.deep.equal({ message: 'Invalid email or password' });
  });

  it('should return invalid data when user password is wrong', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(wrongPassUser as any);
    sinon.stub(JWT, 'sign').returns('validToken');
    sinon.stub(Validations, 'validateLogin').returns();

    const { status, body } = await chai.request(app)
      .post('/login')
      .send(validLoginBody);

    expect(status).to.equal(401);
    expect(body.message).to.equal('Invalid email or password');
  });

  afterEach(sinon.restore);
});