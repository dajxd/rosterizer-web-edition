import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { colorCodes } from './colorCodes';
import './App.css';
import { Select, FormControl, Grid, ListSubheader, InputLabel, MenuItem, TextField } from '@mui/material';

function App() {
  const [dataReady, setDataReady] = useState(false);
  const [selectedTeamOne, setSelectedTeamOne] = useState('');
  const [selectedTeamTwo, setSelectedTeamTwo] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [filterNumber, setFilterNumber] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filtering, setFiltering] = useState(false);
  const [league, setLeague] = useState({
    nfc: {
      north: { Atlanta_Falcons: {}, Carolina_Panthers: {}, New_Orleans_Saints: {}, Tampa_Bay_Buccaneers: {} },
      south: { Chicago_Bears: {}, Detroit_Lions: {}, Green_Bay_Packers: {}, Minnesota_Vikings: {} },
      east: { Arizona_Cardinals: {}, Los_Angeles_Rams: {}, San_Francisco_49ers: {}, Seattle_Seahawks: {} },
      west: { Dallas_Cowboys: {}, New_York_Giants: {}, Philadelphia_Eagles: {}, Washington_Commanders: {} },
    },
    afc: {
      north: { Houston_Texans: {}, Indianapolis_Colts: {}, Jacksonville_Jaguars: {}, Tennessee_Titans: {} },
      south: { Baltimore_Ravens: {}, Cincinnati_Bengals: {}, Cleveland_Browns: {}, Pittsburgh_Steelers: {} },
      east: { Denver_Broncos: {}, Kansas_City_Chiefs: {}, Las_Vegas_Raiders: {}, Los_Angeles_Chargers: {} },
      west: { Buffalo_Bills: {}, Miami_Dolphins: {}, New_England_Patriots: {}, New_York_Jets: {} },
    },
  });

  const teamNames = {
    nfc: {
      south: ['Atlanta_Falcons', 'Carolina_Panthers', 'New_Orleans_Saints', 'Tampa_Bay_Buccaneers'],
      north: ['Chicago_Bears', 'Detroit_Lions', 'Green_Bay_Packers', 'Minnesota_Vikings'],
      west: ['Arizona_Cardinals', 'Los_Angeles_Rams', 'San_Francisco_49ers', 'Seattle_Seahawks'],
      east: ['Dallas_Cowboys', 'New_York_Giants', 'Philadelphia_Eagles', 'Washington_Commanders'],
    },
    afc: {
      south: ['Houston_Texans', 'Indianapolis_Colts', 'Jacksonville_Jaguars', 'Tennessee_Titans'],
      north: ['Baltimore_Ravens', 'Cincinnati_Bengals', 'Cleveland_Browns', 'Pittsburgh_Steelers'],
      west: ['Denver_Broncos', 'Kansas_City_Chiefs', 'Las_Vegas_Raiders', 'Los_Angeles_Chargers'],
      east: ['Buffalo_Bills', 'Miami_Dolphins', 'New_England_Patriots', 'New_York_Jets'],
    },
  };

  useEffect(() => {
    if (filterName.length === 0 && filterNumber.length === 0) {
      setFiltering(false);
    } else {
      setFiltering(true);
    }
  }, [filterName, filterNumber]);

  useEffect(() => {
    if (selectedGame) {
      setSelectedTeamOne(selectedGame[0]);
      setSelectedTeamTwo(selectedGame[1]);
    }
  }, [selectedGame]);

  const camelCaser = (str) => {
    const secondChunk = str.substr(str.indexOf(' ') + 1);
    if (secondChunk === str) {
      return secondChunk.toLowerCase();
    }
    const firstChunk = str.substr(0, str.indexOf(' ')).toLowerCase();
    return firstChunk + secondChunk;
  };

  const deCamel = (str) => {
    let newStr = '';
    newStr += str.slice(0, 1).toUpperCase();
    str = str.slice(1);
    for (const char in str) {
      if (str[char].toLowerCase() === str[char]) {
        newStr += str[char];
      } else {
        if (newStr[newStr.length - 1].toUpperCase() !== newStr[newStr.length - 1]) {
          newStr += ' ';
        }
        newStr += str[char];
      }
    }
    return newStr;
  };

  const parsedResponse = (resp, nonWikiText) => {
    const sectionParser = (s) => {
      const linkFinder = (name) => {
        const linkString = nonWikiText.data.parse.links.find((e) => e['*'].includes(name));
        return linkString ? `https://en.wikipedia.org/wiki/${linkString['*'].replaceAll(' ', '_')}` : null;
      };
      const parsedSection = {};
      let split = s.split('\n');
      let title = split[0].replace('=', '');
      title = camelCaser(title);
      parsedSection.members = [];
      split = split.splice(1);
      split.forEach((l) => {
        let sp = l.split('|');
        sp = sp.filter((s) => {
          return !s.includes('d=');
        });
        if (sp[2]) {
          parsedSection.members.push({
            number: sp[1],
            name: sp[2].includes('}') ? sp[2].substr(0, sp[2].indexOf('}')) : sp[2],
            link: linkFinder(sp[2].includes('}') ? sp[2].substr(0, sp[2].indexOf('}')) : sp[2]),
            position: sp[3] ? sp[3].substr(0, sp[3].indexOf('}')) : null,
          });
        }
      });
      return [title, parsedSection.members];
    };
    const team = {};
    const rawString = resp.parse.wikitext['*'].replaceAll('&nbsp;', '');

    let teamName = rawString.split(/\n\|/)[1];
    const urlTeamName = rawString
      .split(/\n\|/)[1]
      .substr(teamName.indexOf('=') + 1)
      .replaceAll(' ', '_');
    teamName = teamName.substr(teamName.indexOf('=') + 1).replaceAll(' ', '');
    const splitIntoSections = rawString
      .split(/\n\|/)
      .slice(rawString.split(/\n\|/).indexOf(rawString.split(/\n\|/).find((e) => e.includes('Quarterbacks'))), rawString.split(/\n\|/).length - 1);
    splitIntoSections.forEach((s) => {
      const [t, i] = sectionParser(s, urlTeamName);
      team[t] = i;
    });
    return team;
  };

  const blendColors = (colorA, colorB, amount) => {
    const [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16));
    const [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16));
    const r = Math.round(rA + (rB - rA) * amount)
      .toString(16)
      .padStart(2, '0');
    const g = Math.round(gA + (gB - gA) * amount)
      .toString(16)
      .padStart(2, '0');
    const b = Math.round(bA + (bB - bA) * amount)
      .toString(16)
      .padStart(2, '0');
    return '#' + r + g + b;
  };
  useEffect(() => {
    Object.entries(teamNames).forEach((conference) => {
      Object.entries(conference[1]).forEach((division) => {
        division[1].forEach((teamName) => {
          axios
            .get(`https://en.wikipedia.org/w/api.php?action=parse&page=Template:${teamName}_roster&prop=wikitext&format=json&origin=*`)
            .then((response) => {
              axios.get(`https://en.wikipedia.org/w/api.php?action=parse&page=Template:${teamName}_roster&format=json&origin=*`).then((resp2) => {
                setLeague((prev) => {
                  const parsedDataObject = parsedResponse(response.data, resp2);
                  return {
                    ...prev,
                    [conference[0]]: {
                      ...prev[conference[0]],
                      [division[0]]: {
                        ...prev[conference[0]][division[0]],
                        [teamName]: {
                          ...parsedDataObject,
                          teamName: teamName.replaceAll('_', ' '),
                          colors: {
                            primary: (() => colorCodes.find((e) => e.name === teamName.replaceAll('_', ' '))?.colors?.hex[0])(),
                            secondary: (() => colorCodes.find((e) => e.name === teamName.replaceAll('_', ' '))?.colors?.hex[1])(),
                          },
                        },
                      },
                    },
                  };
                });
              });
              if (
                Object.entries(league.nfc.south).length +
                  Object.entries(league.nfc.east).length +
                  Object.entries(league.nfc.west).length +
                  Object.entries(league.nfc.north).length +
                  Object.entries(league.afc.south).length +
                  Object.entries(league.afc.east).length +
                  Object.entries(league.afc.west).length +
                  Object.entries(league.afc.north).length >=
                32
              ) {
                setDataReady(true);
              } else {
                setDataReady(false);
              }
            })
            .catch((e) => {
              console.warn('axios error!', e);
            });
        });
      });
    });
  }, []);

  const FormattedTeam = ({
    defensiveBacks,
    defensiveLinemen,
    linebackers,
    offensiveLinemen,
    quarterbacks,
    reserveLists,
    runningBacks,
    specialTeams,
    tightEnds,
    unrestrictedFAs,
    wideReceivers,
    teamName,
  }) => {
    const allPositions = {
      defensiveBacks: defensiveBacks ? defensiveBacks : [],
      defensiveLinemen: defensiveLinemen ? defensiveLinemen : [],
      linebackers: linebackers ? linebackers : [],
      offensiveLinemen: offensiveLinemen ? offensiveLinemen : [],
      quarterbacks: quarterbacks ? quarterbacks : [],
      reserveLists: reserveLists ? reserveLists : [],
      runningBacks: runningBacks ? runningBacks : [],
      specialTeams: specialTeams ? specialTeams : [],
      tightEnds: tightEnds ? tightEnds : [],
      unrestrictedFAs: unrestrictedFAs ? unrestrictedFAs : [],
      wideReceivers: wideReceivers ? wideReceivers : [],
    };

    return (
      <>
        <h2 style={{ width: '100%', textAlign: 'center', height: '60px' }}>{teamName}</h2>
        {/* {filtering && <h2>filtering</h2>} */}
        {Object.keys(allPositions).map((k) => (
          <div className="positionBox" key={k}>
            <h2 style={{ marginTop: 0 }}>{deCamel(k)}</h2>
            {filtering
              ? allPositions[k].map((player) =>
                  (player.name.toLowerCase().includes(filterName.toLowerCase()) && filterName.length > 0) ||
                  (player.number.includes(filterNumber) && filterNumber.length > 0) ? (
                    <span className="player playerMatch" key={player.name}>
                      <a href={player.link || ''} target="_blank" rel="noreferrer">
                        <b>{player.number}</b> {player.name}
                      </a>
                    </span>
                  ) : (
                    <span className="player playerNoMatch" key={player.name}>
                      <a href={player.link || ''} target="_blank" rel="noreferrer">
                        <b>{player.number}</b> {player.name}
                      </a>
                    </span>
                  )
                )
              : allPositions[k].map((player) => (
                  <span className="player" key={player.name}>
                    <a href={player.link || ''} target="_blank" rel="noreferrer">
                      <b>{player.number}</b> {player.name}
                    </a>
                  </span>
                ))}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="App">
      {dataReady ? (
        <Grid container>
          <Grid
            container
            item
            className="allTop"
            style={{
              backgroundColor: blendColors(`#${selectedTeamOne?.colors?.primary || 'ffffff'}`, `#${selectedTeamTwo?.colors?.primary || 'ffffff'}`, 0.5),
            }}
          >
            <Grid
              container
              item
              xs={12}
              margin={1}
              className="title"
              color={blendColors(`#${selectedTeamOne?.colors?.secondary || 'cccccc'}`, `#${selectedTeamTwo?.colors?.secondary || 'cccccc'}`, 0.5)}
            >
              <p />
              <p>r</p>
              <p>o</p>
              <p>s</p>
              <p>t</p>
              <p>e</p>
              <p>r</p>
              <p>i</p>
              <p>z</p>
              <p>e</p>
              <p>r</p>
              <p />
            </Grid>
            <Grid container item m={2} justifyContent="space-between">
              <Grid item textAlign="center">
                <InputLabel
                  style={{
                    color: blendColors(`#${selectedTeamOne?.colors?.secondary || 'cccccc'}`, `#${selectedTeamTwo?.colors?.secondary || 'cccccc'}`, 0.5),
                  }}
                >
                  Team One
                </InputLabel>
                <FormControl style={{ width: '200px' }}>
                  <Select
                    id="teamSelectOne"
                    value="Change team"
                    onChange={(e) => {
                      setSelectedTeamOne(e.target.value);
                    }}
                  >
                    <MenuItem key="Change team" value="Change team">
                      Change team
                    </MenuItem>
                    <ListSubheader>NFC North</ListSubheader>
                    {teamNames.nfc.north.map((teamName) => {
                      return (
                        <MenuItem key={teamName} value={{ ...league.nfc.north[teamName] }}>
                          {teamName.replaceAll('_', ' ')}
                        </MenuItem>
                      );
                    })}
                    <ListSubheader>NFC East</ListSubheader>
                    {teamNames.nfc.east.map((teamName) => {
                      return (
                        <MenuItem key={teamName} value={{ ...league.nfc.east[teamName] }}>
                          {teamName.replaceAll('_', ' ')}
                        </MenuItem>
                      );
                    })}
                    <ListSubheader>NFC West</ListSubheader>
                    {teamNames.nfc.west.map((teamName) => {
                      return (
                        <MenuItem key={teamName} value={{ ...league.nfc.west[teamName] }}>
                          {teamName.replaceAll('_', ' ')}
                        </MenuItem>
                      );
                    })}
                    <ListSubheader>NFC South</ListSubheader>
                    {teamNames.nfc.south.map((teamName) => {
                      return (
                        <MenuItem key={teamName} value={{ ...league.nfc.south[teamName] }}>
                          {teamName.replaceAll('_', ' ')}
                        </MenuItem>
                      );
                    })}
                    <ListSubheader>AFC North</ListSubheader>
                    {teamNames.afc.north.map((teamName) => {
                      return (
                        <MenuItem key={teamName} value={{ ...league.afc.north[teamName] }}>
                          {teamName.replaceAll('_', ' ')}
                        </MenuItem>
                      );
                    })}
                    <ListSubheader>AFC East</ListSubheader>
                    {teamNames.afc.east.map((teamName) => {
                      return (
                        <MenuItem key={teamName} value={{ ...league.afc.east[teamName] }}>
                          {teamName.replaceAll('_', ' ')}
                        </MenuItem>
                      );
                    })}
                    <ListSubheader>AFC West</ListSubheader>
                    {teamNames.afc.west.map((teamName) => {
                      return (
                        <MenuItem key={teamName} value={{ ...league.afc.west[teamName] }}>
                          {teamName.replaceAll('_', ' ')}
                        </MenuItem>
                      );
                    })}
                    <ListSubheader>AFC South</ListSubheader>
                    {teamNames.afc.south.map((teamName) => {
                      return (
                        <MenuItem key={teamName} value={{ ...league.afc.south[teamName] }}>
                          {teamName.replaceAll('_', ' ')}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item textAlign="center">
                <InputLabel
                  style={{
                    color: blendColors(`#${selectedTeamOne?.colors?.secondary || 'cccccc'}`, `#${selectedTeamTwo?.colors?.secondary || 'cccccc'}`, 0.5),
                  }}
                >
                  Filter By Number
                </InputLabel>
                <TextField
                  value={filterNumber}
                  onChange={(e) => {
                    setFilterNumber(e.target.value.replaceAll(/[A-Z]|[a-z]/g, ''));
                  }}
                ></TextField>
              </Grid>
              <Grid item textAlign="center">
                <InputLabel
                  style={{
                    color: blendColors(`#${selectedTeamOne?.colors?.secondary || 'cccccc'}`, `#${selectedTeamTwo?.colors?.secondary || 'cccccc'}`, 0.5),
                  }}
                >
                  Today's Games
                </InputLabel>
                <FormControl style={{ width: '200px' }}>
                  <Select
                    id="gameSelect"
                    value="None"
                    onChange={(e) => {
                      setSelectedGame(e.target.value);
                    }}
                  >
                    <MenuItem value="None">Choose matchup</MenuItem>
                    <ListSubheader>Live</ListSubheader>

                    <MenuItem value={[league.nfc.east.Dallas_Cowboys, league.nfc.east.New_York_Giants]}>DAL v NYG</MenuItem>
                    <MenuItem value={[league.nfc.north.Green_Bay_Packers, league.nfc.north.Detroit_Lions]}>GB @ DET</MenuItem>
                    <MenuItem value={[league.nfc.west.Los_Angeles_Rams, league.afc.west.Las_Vegas_Raiders]}>LAR @ LV</MenuItem>
                    <ListSubheader>Upcoming</ListSubheader>
                    <MenuItem value={[league.nfc.west.San_Francisco_49ers, league.nfc.west.Seattle_Seahawks]}>SF @ SEA</MenuItem>
                    <MenuItem value={[league.nfc.west.Arizona_Cardinals, league.afc.west.Los_Angeles_Chargers]}>ARI @ LAC</MenuItem>
                    <MenuItem value={[league.afc.east.Buffalo_Bills, league.afc.east.Miami_Dolphins]}>BUF @ MIA</MenuItem>
                    <MenuItem value={[league.nfc.east.Washington_Commanders, league.nfc.east.Philadelphia_Eagles]}>WAS @ PHI</MenuItem>
                    <ListSubheader>Ended</ListSubheader>
                    <MenuItem value={[league.afc.west.Denver_Broncos, league.afc.west.Kansas_City_Chiefs]}>DEN @ KC</MenuItem>
                    <MenuItem value={[league.afc.north.Baltimore_Ravens, league.afc.north.Cleveland_Browns]}>BAL @ CLE</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item textAlign="center">
                <InputLabel
                  style={{
                    color: blendColors(`#${selectedTeamOne?.colors?.secondary || 'cccccc'}`, `#${selectedTeamTwo?.colors?.secondary || 'cccccc'}`, 0.5),
                  }}
                >
                  Filter By Name
                </InputLabel>

                <TextField
                  value={filterName}
                  onChange={(e) => {
                    setFilterName(e.target.value);
                  }}
                ></TextField>
              </Grid>

              <Grid item textAlign="center">
                <InputLabel
                  style={{
                    color: blendColors(`#${selectedTeamOne?.colors?.secondary || 'cccccc'}`, `#${selectedTeamTwo?.colors?.secondary || 'cccccc'}`, 0.5),
                  }}
                >
                  Team Two
                </InputLabel>
                <FormControl style={{ width: '200px' }}>
                  <Select
                    id="teamSelectTwo"
                    value="Change team"
                    onChange={(e) => {
                      setSelectedTeamTwo(e.target.value);
                    }}
                  >
                    <MenuItem key="Change team" value="Change team">
                      Change team
                    </MenuItem>
                    <ListSubheader>NFC North</ListSubheader>
                    {teamNames.nfc.north.map((teamName) => {
                      return (
                        <MenuItem key={teamName} value={{ ...league.nfc.north[teamName] }}>
                          {teamName.replaceAll('_', ' ')}
                        </MenuItem>
                      );
                    })}
                    <ListSubheader>NFC East</ListSubheader>
                    {teamNames.nfc.east.map((teamName) => {
                      return (
                        <MenuItem key={teamName} value={{ ...league.nfc.east[teamName] }}>
                          {teamName.replaceAll('_', ' ')}
                        </MenuItem>
                      );
                    })}
                    <ListSubheader>NFC West</ListSubheader>
                    {teamNames.nfc.west.map((teamName) => {
                      return (
                        <MenuItem key={teamName} value={{ ...league.nfc.west[teamName] }}>
                          {teamName.replaceAll('_', ' ')}
                        </MenuItem>
                      );
                    })}
                    <ListSubheader>NFC South</ListSubheader>
                    {teamNames.nfc.south.map((teamName) => {
                      return (
                        <MenuItem key={teamName} value={{ ...league.nfc.south[teamName] }}>
                          {teamName.replaceAll('_', ' ')}
                        </MenuItem>
                      );
                    })}
                    <ListSubheader>AFC North</ListSubheader>
                    {teamNames.afc.north.map((teamName) => {
                      return (
                        <MenuItem key={teamName} value={{ ...league.afc.north[teamName] }}>
                          {teamName.replaceAll('_', ' ')}
                        </MenuItem>
                      );
                    })}
                    <ListSubheader>AFC East</ListSubheader>
                    {teamNames.afc.east.map((teamName) => {
                      return (
                        <MenuItem key={teamName} value={{ ...league.afc.east[teamName] }}>
                          {teamName.replaceAll('_', ' ')}
                        </MenuItem>
                      );
                    })}
                    <ListSubheader>AFC West</ListSubheader>
                    {teamNames.afc.west.map((teamName) => {
                      return (
                        <MenuItem key={teamName} value={{ ...league.afc.west[teamName] }}>
                          {teamName.replaceAll('_', ' ')}
                        </MenuItem>
                      );
                    })}
                    <ListSubheader>AFC South</ListSubheader>
                    {teamNames.afc.south.map((teamName) => {
                      return (
                        <MenuItem key={teamName} value={{ ...league.afc.south[teamName] }}>
                          {teamName.replaceAll('_', ' ')}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            justifyContent="center"
            xs={6}
            className="teamContainer"
            style={{
              backgroundColor: `#${selectedTeamOne?.colors?.secondary || 'ffffff'}`,
              color: `#${selectedTeamOne?.colors?.primary || 'ffffff'}`,
            }}
          >
            {selectedTeamOne && <FormattedTeam {...selectedTeamOne} />}
          </Grid>
          <Grid
            item
            justifyContent="center"
            xs={6}
            className="teamContainer"
            style={{
              backgroundColor: `#${selectedTeamTwo?.colors?.secondary || 'ffffff'}`,
              color: `#${selectedTeamTwo?.colors?.primary || 'ffffff'}`,
            }}
          >
            {selectedTeamTwo && <FormattedTeam {...selectedTeamTwo} />}
          </Grid>
        </Grid>
      ) : (
        <h5>be patient, okay?</h5>
      )}
    </div>
  );
}

export default App;
