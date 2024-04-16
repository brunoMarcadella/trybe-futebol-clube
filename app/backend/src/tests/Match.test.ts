import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import SequelizeMatch from '../database/models/SequelizeMatch';
import { awayTeam, createdMatch, finishedMatches, homeTeam, inexistentTeamIdMatchBody, matches, twoEqualTeamsMatchBody, unfinishedMatch, unfinishedMatches, validCreateMatchBody, validUpdateGoalsMatchBody } from './mocks/Match.mocks';
import JWT from '../utils/JWT';

chai.use(chaiHttp);

const { expect } = chai;

describe('Match Test', function() {
  it('should return all matches', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(matches as any);

    const { status, body } = await chai.request(app).get('/matches');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(matches);
  });

  it('should return only unfinished matches', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(unfinishedMatches as any);

    const { status, body } = await chai.request(app)
      .get('/matches')
      .query({ inProgress: true })
      .send();

    expect(status).to.equal(200);
    expect(body).to.deep.equal(unfinishedMatches);
  });

  it('should return only finished matches', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(finishedMatches as any);

    const { status, body } = await chai.request(app)
      .get('/matches')
      .query({ inProgress: false })
      .send();

    expect(status).to.equal(200);
    expect(body).to.deep.equal(finishedMatches);
  });

  it('should return a message after finish a match', async function() {
    sinon.stub(JWT, 'verify').resolves({ id: 1, email: 'teste@teste.com' });
    sinon.stub(SequelizeMatch, 'findByPk').resolves(unfinishedMatch as any);
    sinon.stub(SequelizeMatch, 'update').resolves();

    const { status, body } = await chai.request(app)
      .patch('/matches/1/finish')
      .set('Authorization', 'Bearer ValidToken')
      .send();

    expect(status).to.equal(200);
    expect(body).to.deep.equal({ message: 'Finished'});
  });

  it('should return token not found when try to finish a match without a token', async function() {
    sinon.stub(JWT, 'verify').resolves({ id: 1, email: 'admin@admin.com' });
    

    const { status, body } = await chai.request(app)
      .patch('/matches/1/finish')
      .set('Authorization', '')
      .send();
    
    expect(status).to.equal(401);
    expect(body.message).to.deep.equal('Token not found');
  });

  it('should return token must be a valid token when try to finish a match without a token', async function() {
    sinon.stub(JWT, 'verify').resolves('Token must be a valid token');
    

    const { status, body } = await chai.request(app)
      .patch('/matches/1/finish')
      .set('Authorization', 'Bearer InvalidToken')
      .send();
    
    expect(status).to.equal(401);
    expect(body.message).to.deep.equal('Token must be a valid token');
  });

  it('should return code 200 when try to update a match in progress', async function() {
    sinon.stub(JWT, 'verify').resolves({ id: 1, email: 'teste@teste.com' });
    sinon.stub(SequelizeMatch, 'findByPk').resolves(unfinishedMatch as any);
    sinon.stub(SequelizeMatch, 'update').resolves();

    const { status, body } = await chai.request(app)
      .patch('/matches/1')
      .set('Authorization', 'Bearer ValidToken')
      .send(validUpdateGoalsMatchBody);

    expect(status).to.equal(200);
  });

  it('should return token not found when try to update goals match without a token', async function() {
    sinon.stub(JWT, 'verify').resolves({ id: 1, email: 'admin@admin.com' });
    

    const { status, body } = await chai.request(app)
      .patch('/matches/1')
      .set('Authorization', '')
      .send();
    
    expect(status).to.equal(401);
    expect(body.message).to.deep.equal('Token not found');
  });

  it('should return token must be a valid token when try to goals match without a token', async function() {
    sinon.stub(JWT, 'verify').resolves('Token must be a valid token');
    

    const { status, body } = await chai.request(app)
      .patch('/matches/1')
      .set('Authorization', 'Bearer InvalidToken')
      .send();
    
    expect(status).to.equal(401);
    expect(body.message).to.deep.equal('Token must be a valid token');
  });

  it('should return the new match with id when create a new match', async function() {
    sinon.stub(JWT, 'verify').resolves({ id: 1, email: 'teste@teste.com' });
    sinon.stub(SequelizeMatch, 'findByPk')
      .onFirstCall()
      .resolves(homeTeam as any)
      .onSecondCall()
      .resolves(awayTeam as any);
    sinon.stub(SequelizeMatch, 'create').resolves(createdMatch as any);

    const { status, body } = await chai.request(app)
      .post('/matches')
      .set('Authorization', 'Bearer ValidToken')
      .send(validCreateMatchBody);

    expect(status).to.equal(201);
    expect(body).to.deep.equal(createdMatch);
  });

  it('should return token not found when try to create a new match without a token', async function() {
    sinon.stub(JWT, 'verify').resolves({ id: 1, email: 'admin@admin.com' });
    

    const { status, body } = await chai.request(app)
      .post('/matches')
      .set('Authorization', '')
      .send(validCreateMatchBody);
    
    expect(status).to.equal(401);
    expect(body.message).to.deep.equal('Token not found');
  });

  it('should return token must be a valid token when try to create a new match without a token', async function() {
    sinon.stub(JWT, 'verify').resolves('Token must be a valid token');
    

    const { status, body } = await chai.request(app)
      .post('/matches')
      .set('Authorization', 'Bearer InvalidToken')
      .send(validCreateMatchBody);
    
    expect(status).to.equal(401);
    expect(body.message).to.deep.equal('Token must be a valid token');
  });

  it('should return a message when try to create a new match with two equal teams', async function() {
    sinon.stub(JWT, 'verify').resolves({ id: 1, email: 'teste@teste.com' });
    sinon.stub(SequelizeMatch, 'findByPk')
      .onFirstCall()
      .resolves(homeTeam as any)
      .onSecondCall()
      .resolves(homeTeam as any);

    const { status, body } = await chai.request(app)
      .post('/matches')
      .set('Authorization', 'Bearer ValidToken')
      .send(twoEqualTeamsMatchBody);

    expect(status).to.equal(422);
    expect(body.message).to.deep.equal('It is not possible to create a match with two equal teams');
  });

  it('should return a message when try to create a new match with a inexistent team id', async function() {
    sinon.stub(JWT, 'verify').resolves({ id: 1, email: 'teste@teste.com' });
    sinon.stub(SequelizeMatch, 'findByPk')
      .onFirstCall()
      .resolves(homeTeam as any)
      .onSecondCall()
      .resolves(null);

    const { status, body } = await chai.request(app)
      .post('/matches')
      .set('Authorization', 'Bearer ValidToken')
      .send(inexistentTeamIdMatchBody);

    expect(status).to.equal(404);
    expect(body.message).to.deep.equal('There is no team with such id!');
  });

  afterEach(sinon.restore);
});
