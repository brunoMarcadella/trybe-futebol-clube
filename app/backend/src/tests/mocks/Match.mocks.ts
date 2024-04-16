const matches = [
  {
    id: 1,
    homeTeamId: 16,
    homeTeamGoals: 1,
    awayTeamId: 8,
    awayTeamGoals: 1,
    inProgress: false,
    homeTeam: {
    teamName: "São Paulo"
    },
    awayTeam: {
    teamName: "Grêmio"
    }
  }
]

const unfinishedMatches = [
  {
    id: 41,
    homeTeamId: 16,
    homeTeamGoals: 2,
    awayTeamId: 9,
    awayTeamGoals: 0,
    inProgress: true,
    homeTeam: {
    teamName: "São Paulo"
    },
    awayTeam: {
    teamName: "Internacional"
    }
  },
  {
    id: 42,
    homeTeamId: 6,
    homeTeamGoals: 1,
    awayTeamId: 1,
    awayTeamGoals: 0,
    inProgress: true,
    homeTeam: {
    teamName: "Ferroviária"
    },
    awayTeam: {
    teamName: "Avaí/Kindermann"
    }
  }
]

const finishedMatches = [
  {
    id: 1,
    homeTeamId: 16,
    homeTeamGoals: 1,
    awayTeamId: 8,
    awayTeamGoals: 1,
    inProgress: false,
    homeTeam: {
      teamName: "São Paulo"
    },
    awayTeam: {
      teamName: "Grêmio"
    }
  },
  {
    id: 2,
    homeTeamId: 9,
    homeTeamGoals: 1,
    awayTeamId: 14,
    awayTeamGoals: 1,
    inProgress: false,
    homeTeam: {
      teamName: "Internacional"
    },
    awayTeam: {
      teamName: "Santos"
    }
  }
]

const unfinishedMatch = {
  id: 1,
  homeTeamId: 16,
  homeTeamGoals: 1,
  awayTeamId: 8,
  awayTeamGoals: 1,
  inProgress: true,
}

const validUpdateGoalsMatchBody = {
  homeTeamGoals: 3,
  awayTeamGoals: 1,
}

const homeTeam = {
  id: 9,
  teamName: 'Internacional',
}

const awayTeam = {
  id: 14,
  teamName: 'Santos',
}

const createdMatch = {
  id: 1,
  homeTeamId: 9,
  homeTeamGoals: 2,
  awayTeamId: 14,
  awayTeamGoals: 2,
  inProgress: true,
}

const validCreateMatchBody = {
  homeTeamId: 9,
  homeTeamGoals: 2,
  awayTeamId: 14,
  awayTeamGoals: 2,
}

const twoEqualTeamsMatchBody = {
  homeTeamId: 9,
  homeTeamGoals: 2,
  awayTeamId: 9,
  awayTeamGoals: 2,
}

const inexistentTeamIdMatchBody = {
  homeTeamId: 9,
  homeTeamGoals: 2,
  awayTeamId: 100,
  awayTeamGoals: 2,
}

export {
  matches,
  unfinishedMatches,
  finishedMatches,
  unfinishedMatch,
  validUpdateGoalsMatchBody,
  homeTeam,
  awayTeam,
  createdMatch,
  validCreateMatchBody,
  twoEqualTeamsMatchBody,
  inexistentTeamIdMatchBody,
}