import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import SequelizeMatch from '../database/models/SequelizeMatch';
import { matches } from './mocks/Match.mocks';

chai.use(chaiHttp);

const { expect } = chai;

describe('Match Test', function() {
  it('should return all matches', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(matches as any);

    const { status, body } = await chai.request(app).get('/matches');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(matches);
  });

  // it('should return a team by id', async function() {
  //   sinon.stub(SequelizeTeam, 'findOne').resolves(team as any);

  //   const { status, body } = await chai.request(app).get('/teams/5');

  //   expect(status).to.equal(200);
  //   expect(body).to.deep.equal(team);
  // });

  // it('should return not found if the team doesnt exists', async function() {
  //   sinon.stub(SequelizeTeam, 'findOne').resolves(null);

  //   const { status, body } = await chai.request(app).get('/teams/100');

  //   expect(status).to.equal(404);
  //   expect(body.message).to.equal('Team 100 not found');
  // });

  afterEach(sinon.restore);
});
