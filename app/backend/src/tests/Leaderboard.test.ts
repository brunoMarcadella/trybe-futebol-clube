import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import SequelizeMatch from '../database/models/SequelizeMatch';
import SequelizeTeam from '../database/models/SequelizeTeam';
import { awayLeaderboard, finishedMatches, homeLeaderboard, leaderboard, teams } from './mocks/Leaderboard.mocks';

chai.use(chaiHttp);

const { expect } = chai;

describe('Leaderboard Test', function() {
  it('should return home leaderboard', async function() {
    sinon.stub(SequelizeTeam, 'findAll').resolves(teams as any);
    sinon.stub(SequelizeMatch, 'findAll').resolves(finishedMatches as any);

    const { status, body } = await chai.request(app)
      .get('/leaderboard/home');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(homeLeaderboard);
  });

  it('should return away leaderboard', async function() {
    sinon.stub(SequelizeTeam, 'findAll').resolves(teams as any);
    sinon.stub(SequelizeMatch, 'findAll').resolves(finishedMatches as any);

    const { status, body } = await chai.request(app)
      .get('/leaderboard/away');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(awayLeaderboard);
  });

  it('should return home + away leaderboard', async function() {
    sinon.stub(SequelizeTeam, 'findAll').resolves(teams as any);
    sinon.stub(SequelizeMatch, 'findAll').resolves(finishedMatches as any);

    const { status, body } = await chai.request(app)
      .get('/leaderboard');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(leaderboard);
  });

  afterEach(sinon.restore);
});
