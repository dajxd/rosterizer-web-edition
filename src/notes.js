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
const camelCaser = (str) => {
  const secondChunk = str.substr(str.indexOf(' ') + 1);
  if (secondChunk === str) {
    return secondChunk.toLowerCase();
  }
  const firstChunk = str.substr(0, str.indexOf(' ')).toLowerCase();
  return firstChunk + secondChunk;
};
const sectionParser = (s) => {
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
        position: sp[3] ? sp[3].substr(0, sp[3].indexOf('}')) : null,
      });
    }
  });
  return [title, parsedSection.members];
};

const addToLeague = (teamUrlString, conference, division) => {
  const team = {};
  function reqListener() {
    const unparsedText = this.responseText;
    const parsed = JSON.parse(unparsedText);
    const rawString = parsed.parse.wikitext['*'].replaceAll('&nbsp;', '');
    let teamName = rawString.split(/\n\|/)[1];
    teamName = teamName.substr(teamName.indexOf('=') + 1).replaceAll(' ', '');
    const splitIntoSections = rawString.split(/\n\|/).slice(13, rawString.split(/\n\|/).length - 1);
    splitIntoSections.forEach((s) => {
      const [t, i] = sectionParser(s);
      team[t] = i;
    });
    league[conference][division][teamName] = team;
    const newObj = league;
    newObj[conference][division][teamName] = team;
    setLeague((prev) => ({ ...prev, ...newObj }));
    // console.log(teamName);
    // console.log(league);
  }
  var oReq = new XMLHttpRequest();
  oReq.addEventListener('load', reqListener);
  oReq.open('GET', `https://en.wikipedia.org/w/api.php?action=parse&page=Template:${teamUrlString}_roster&prop=wikitext&format=json&origin=*`);
  oReq.send();
};

const addAllToLeague = () => {
  Object.entries(teamNames.nfc).forEach((div) => {
    let division = div[0];
    div[1].forEach((t) => {
      addToLeague(t, 'nfc', division);
    });
  });
  Object.entries(teamNames.afc).forEach((div) => {
    let division = div[0];
    div[1].forEach((t) => {
      addToLeague(t, 'afc', division);
    });
  });
};

useEffect(() => {
  setLeague({
    nfc: {
      north: {
        GreenBayPackers: {
          quarterbacks: [
            {
              number: '10',
              name: 'Jordan Love',
              position: null,
            },
            {
              number: '12',
              name: 'Aaron Rodgers',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '28',
              name: 'A. J. Dillon',
              position: null,
            },
            {
              number: '32',
              name: 'Kylin Hill',
              position: null,
            },
            {
              number: '33',
              name: 'Aaron Jones',
              position: null,
            },
            {
              number: '27',
              name: 'Patrick Taylor',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '18',
              name: 'Randall Cobb',
              position: null,
            },
            {
              number: '8',
              name: 'Amari Rodgers',
              position: null,
            },
            {
              number: '88',
              name: 'Juwann Winfree',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '84',
              name: 'Tyler Davis',
              position: null,
            },
            {
              number: '81',
              name: 'Josiah Deguara',
              position: null,
            },
            {
              number: '89',
              name: 'Marcedes Lewis',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '69',
              name: 'David Bakhtiari',
              position: 'T',
            },
            {
              number: '74',
              name: 'Elgton Jenkins',
              position: 'G',
            },
            {
              number: '71',
              name: 'Josh Myers',
              position: '',
            },
            {
              number: '70',
              name: 'Royce Newman',
              position: 'G',
            },
            {
              number: '76',
              name: 'Jon Runyan Jr.',
              position: 'G',
            },
            {
              number: '77',
              name: 'Billy Turner',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '97',
              name: 'Kenny Clark',
              position: 'NT',
            },
            {
              number: '94',
              name: 'Dean Lowry',
              position: 'DE',
            },
            {
              number: '93',
              name: 'Tedarrell Slaton',
              position: 'NT',
            },
          ],
          linebackers: [
            {
              number: '40',
              name: 'Tipa Galeai',
              position: 'OLB',
            },
            {
              number: '53',
              name: 'Jonathan Garvin',
              position: 'OLB',
            },
            {
              number: '52',
              name: 'Rashan Gary',
              position: 'OLB',
            },
            {
              number: '58',
              name: 'Isaiah McDuffie',
              position: 'ILB',
            },
            {
              number: '91',
              name: 'Preston Smith',
              position: '',
            },
            {
              number: '55',
              name: "Za'Darius Smith",
              position: 'OLB',
            },
            {
              number: '44',
              name: 'Ty Summers',
              position: 'ILB',
            },
          ],
          defensiveBacks: [
            {
              number: '23',
              name: 'Jaire Alexander',
              position: 'CB',
            },
            {
              number: '31',
              name: 'Adrian Amos',
              position: 'SS',
            },
            {
              number: '30',
              name: 'Shawn Davis',
              position: '',
            },
            {
              number: '22',
              name: 'Shemar Jean-Charles',
              position: 'CB',
            },
            {
              number: '26',
              name: 'Darnell Savage',
              position: 'FS',
            },
            {
              number: '36',
              name: 'Vernon Scott',
              position: 'SS',
            },
            {
              number: '21',
              name: 'Eric Stokes',
              position: '',
            },
          ],
          specialTeams: [
            {
              number: '2',
              name: 'Mason Crosby',
              position: 'K',
            },
            {
              number: '46',
              name: 'Steven Wirtel',
              position: 'LS',
            },
          ],
          reserveLists: [
            {
              number: '6',
              name: 'Kurt Benkert',
              position: '',
            },
            {
              number: '16',
              name: 'Chris Blair',
              position: '',
            },
            {
              number: '--',
              name: 'Dominik Eberle',
              position: '',
            },
            {
              number: '48',
              name: 'Kabion Ento',
              position: '',
            },
            {
              number: '9',
              name: 'Danny Etling',
              position: '',
            },
            {
              number: '--',
              name: 'Rico Gafford',
              position: '',
            },
            {
              number: '38',
              name: 'Innis Gaines',
              position: '',
            },
            {
              number: '54',
              name: "La'Darius Hamilton",
              position: '',
            },
            {
              number: '90',
              name: 'Jack Heflin',
              position: '',
            },
            {
              number: '--',
              name: 'Alizé Mack',
              position: '',
            },
            {
              number: '65',
              name: 'Michal Menet',
              position: '',
            },
            {
              number: '11',
              name: 'J. J. Molson',
              position: '',
            },
            {
              number: '--',
              name: 'Kiondre Thomas',
              position: '',
            },
            {
              number: '78',
              name: 'Cole Van Lanen',
              position: '',
            },
            {
              number: '57',
              name: 'Ray Wilborn',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '17',
              name: 'Davante Adams',
              position: 'WR',
            },
            {
              number: '7',
              name: 'Corey Bojorquez',
              position: 'P',
            },
            {
              number: '42',
              name: 'Oren Burks',
              position: 'ILB',
            },
            {
              number: '59',
              name: "De'Vondre Campbell",
              position: 'ILB',
            },
            {
              number: '29',
              name: 'Rasul Douglas',
              position: 'CB',
            },
            {
              number: '79',
              name: 'Dennis Kelly',
              position: '',
            },
            {
              number: '20',
              name: 'Kevin King',
              position: '',
            },
            {
              number: '95',
              name: 'Tyler Lancaster',
              position: 'DE',
            },
            {
              number: '50',
              name: 'Whitney Mercilus',
              position: 'OLB',
            },
            {
              number: '62',
              name: 'Lucas Patrick',
              position: 'G',
            },
            {
              number: '19',
              name: 'Equanimeous St. Brown',
              position: 'WR',
            },
            {
              number: '39',
              name: 'Chandon Sullivan',
              position: 'CB',
            },
            {
              number: '85',
              name: 'Robert Tonyan',
              position: 'TE',
            },
            {
              number: '83',
              name: 'Marquez Valdes-Scantling',
              position: 'WR',
            },
          ],
          restrictedFAs: [
            {
              number: '13',
              name: 'Allen Lazard',
              position: 'WR',
            },
          ],
        },
        DetroitLions: {
          'datefebruary23, 2022': [],
          quarterbacks: [
            {
              number: '16',
              name: 'Jared Goff',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '45',
              name: 'Jason Cabinda',
              position: 'FB',
            },
            {
              number: '28',
              name: 'Jermar Jefferson',
              position: null,
            },
            {
              number: '46',
              name: 'Craig Reynolds',
              position: null,
            },
            {
              number: '32',
              name: "D'Andre Swift",
              position: null,
            },
            {
              number: '30',
              name: 'Jamaal Williams',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '17',
              name: 'Trinity Benson',
              position: null,
            },
            {
              number: '87',
              name: 'Quintez Cephus',
              position: null,
            },
            {
              number: '14',
              name: 'Amon-Ra St. Brown',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '86',
              name: 'Hunter Bryant',
              position: null,
            },
            {
              number: '88',
              name: 'T. J. Hockenson',
              position: null,
            },
            {
              number: '80',
              name: 'Jared Pinkney',
              position: null,
            },
            {
              number: '43',
              name: 'Charlie Taumoepeau',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '68',
              name: 'Taylor Decker',
              position: 'T',
            },
            {
              number: '73',
              name: 'Jonah Jackson',
              position: 'G',
            },
            {
              number: '77',
              name: 'Frank Ragnow',
              position: 'C',
            },
            {
              number: '58',
              name: 'Penei Sewell',
              position: 'T',
            },
            {
              number: '71',
              name: 'Logan Stenberg',
              position: 'G',
            },
            {
              number: '72',
              name: 'Halapoulivaati Vaitai',
              position: 'G',
            },
          ],
          defensiveLinemen: [
            {
              number: '91',
              name: 'Michael Brockers',
              position: 'DE',
            },
            {
              number: '96',
              name: 'Jashon Cornell',
              position: 'DE',
            },
            {
              number: '54',
              name: 'Alim McNeill',
              position: 'NT',
            },
            {
              number: '75',
              name: 'Levi Onwuzurike',
              position: 'DE',
            },
            {
              number: '98',
              name: 'John Penisini',
              position: 'NT',
            },
          ],
          linebackers: [
            {
              number: '55',
              name: 'Derrick Barnes',
              position: 'ILB',
            },
            {
              number: '49',
              name: 'Curtis Bolton',
              position: 'ILB',
            },
            {
              number: '2',
              name: 'Austin Bryant',
              position: 'OLB',
            },
            {
              number: '90',
              name: 'Trey Flowers',
              position: 'OLB',
            },
            {
              number: '99',
              name: 'Julian Okwara',
              position: 'OLB',
            },
            {
              number: '95',
              name: 'Romeo Okwara',
              position: 'OLB',
            },
            {
              number: '51',
              name: 'Josh Woods',
              position: 'ILB',
            },
          ],
          defensiveBacks: [
            {
              number: '15',
              name: 'Brady Breeze',
              position: 'SS',
            },
            {
              number: '25',
              name: 'Will Harris',
              position: 'SS',
            },
            {
              number: '--',
              name: 'JuJu Hughes',
              position: 'CB',
            },
            {
              number: '39',
              name: 'Jerry Jacobs',
              position: 'CB',
            },
            {
              number: '26',
              name: 'Ifeatu Melifonwu',
              position: 'CB',
            },
            {
              number: '23',
              name: 'Jeff Okudah',
              position: 'CB',
            },
            {
              number: '24',
              name: 'Amani Oruwariye',
              position: 'CB',
            },
            {
              number: '41',
              name: 'A. J. Parker',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '5',
              name: 'Aldrick Rosas',
              position: 'K',
            },
            {
              number: '4',
              name: 'Austin Seibert',
              position: 'K',
            },
          ],
          reserveLists: [
            {
              number: '94',
              name: 'Eric Banks',
              position: '',
            },
            {
              number: '59',
              name: 'Tavante Beckett',
              position: '',
            },
            {
              number: '76',
              name: 'Bruce Hector',
              position: '',
            },
            {
              number: '83',
              name: 'Javon McKinley',
              position: '',
            },
            {
              number: '19',
              name: 'Steven Montez',
              position: '',
            },
            {
              number: '29',
              name: 'Parnell Motley',
              position: '',
            },
            {
              number: '70',
              name: 'Dan Skipper',
              position: '',
            },
            {
              number: '19',
              name: 'Saivion Smith',
              position: '',
            },
            {
              number: '84',
              name: 'Matt Sokol',
              position: '',
            },
            {
              number: '--',
              name: 'Jordan Thomas',
              position: '',
            },
            {
              number: '84',
              name: 'Shane Zylstra',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '34',
              name: 'Alex Anzalone',
              position: 'ILB',
            },
            {
              number: '12',
              name: 'Tim Boyle',
              position: 'QB',
            },
            {
              number: '65',
              name: 'Tyrell Crosby',
              position: 'T',
            },
            {
              number: '50',
              name: 'Shaun Dion Hamilton',
              position: 'ILB',
            },
            {
              number: '53',
              name: 'Charles Harris',
              position: 'OLB',
            },
            {
              number: '79',
              name: 'Joel Heath',
              position: 'DE',
            },
            {
              number: '18',
              name: 'KhaDarel Hodge',
              position: 'WR',
            },
            {
              number: '31',
              name: 'Dean Marlowe',
              position: 'SS',
            },
            {
              number: '11',
              name: 'Kalif Raymond',
              position: 'WR',
            },
            {
              number: '44',
              name: 'Jalen Reeves-Maybin',
              position: 'ILB',
            },
            {
              number: '8',
              name: 'Josh Reynolds',
              position: 'WR',
            },
            {
              number: '21',
              name: 'Tracy Walker',
              position: 'FS',
            },
            {
              number: '97',
              name: 'Nick Williams',
              position: 'DE',
            },
          ],
          restrictedFAs: [
            {
              number: '10',
              name: 'David Blough',
              position: 'QB',
            },
            {
              number: '63',
              name: 'Evan Brown',
              position: 'C',
            },
            {
              number: '69',
              name: 'Will Holden',
              position: 'T',
            },
            {
              number: '38',
              name: 'C. J. Moore',
              position: 'FS',
            },
          ],
        },
        ChicagoBears: {
          quarterbacks: [
            {
              number: '1',
              name: 'Justin Fields',
              position: null,
            },
            {
              number: '9',
              name: 'Nick Foles',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '29',
              name: 'Tarik Cohen',
              position: null,
            },
            {
              number: '24',
              name: 'Khalil Herbert',
              position: null,
            },
            {
              number: '32',
              name: 'David Montgomery',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '11',
              name: 'Darnell Mooney',
              position: null,
            },
            {
              number: '83',
              name: 'Dazz Newsome',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '85',
              name: 'Cole Kmet',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '75',
              name: 'Larry Borom',
              position: 'T',
            },
            {
              number: '76',
              name: 'Teven Jenkins',
              position: 'T',
            },
            {
              number: '65',
              name: 'Cody Whitehair',
              position: 'G',
            },
          ],
          defensiveLinemen: [
            {
              number: '50',
              name: 'Jeremiah Attaochu',
              position: 'DE',
            },
            {
              number: '99',
              name: 'Trevis Gipson',
              position: 'DE',
            },
            {
              number: '52',
              name: 'Khalil Mack',
              position: 'DE',
            },
            {
              number: '94',
              name: 'Robert Quinn',
              position: 'DE',
            },
            {
              number: '90',
              name: 'Angelo Blackson',
              position: 'DT',
            },
            {
              number: '97',
              name: 'Mario Edwards Jr.',
              position: 'DE',
            },
            {
              number: '91',
              name: 'Eddie Goldman',
              position: 'DT',
            },
            {
              number: '46',
              name: 'Sam Kamara',
              position: 'DE',
            },
            {
              number: '95',
              name: 'Khyiris Tonga',
              position: 'DT',
            },
          ],
          linebackers: [
            {
              number: '--',
              name: 'Noah Dawkins',
              position: 'OLB',
            },
            {
              number: '92',
              name: 'Caleb Johnson',
              position: 'OLB',
            },
            {
              number: '58',
              name: 'Roquan Smith',
              position: 'OLB',
            },
            {
              number: '--',
              name: 'Joe Thomas',
              position: 'OLB',
            },
            {
              number: '6',
              name: 'Danny Trevathan',
              position: 'MLB',
            },
          ],
          defensiveBacks: [
            {
              number: '27',
              name: 'Thomas Graham Jr.',
              position: 'CB',
            },
            {
              number: '4',
              name: 'Eddie Jackson',
              position: 'FS',
            },
            {
              number: '33',
              name: 'Jaylon Johnson',
              position: 'CB',
            },
            {
              number: '20',
              name: 'Duke Shelley',
              position: 'CB',
            },
            {
              number: '22',
              name: 'Kindle Vildor',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '--',
              name: 'Beau Brinkley',
              position: 'LS',
            },
            {
              number: '2',
              name: 'Cairo Santos',
              position: 'K',
            },
            {
              number: '--',
              name: 'Ryan Winslow',
              position: 'P',
            },
          ],
          reserveLists: [
            {
              number: '78',
              name: 'Auzoyah Alufohai',
              position: '',
            },
            {
              number: '82',
              name: 'Isaiah Coulter',
              position: '',
            },
            {
              number: '60',
              name: 'Dieter Eiselen',
              position: '',
            },
            {
              number: '--',
              name: 'Lamar Jackson',
              position: '',
            },
            {
              number: '31',
              name: 'Michael Joseph',
              position: '',
            },
            {
              number: '39',
              name: 'BoPete Keyes',
              position: '',
            },
            {
              number: '63',
              name: 'LaCale London',
              position: '',
            },
            {
              number: '43',
              name: 'Ledarius Mack',
              position: '',
            },
            {
              number: '49',
              name: 'Charles Snowden',
              position: '',
            },
            {
              number: '15',
              name: 'Nsimba Webster',
              position: '',
            },
            {
              number: '72',
              name: 'Tyrone Wheatley Jr.',
              position: '',
            },
            {
              number: '--',
              name: 'Willie Wright',
              position: '',
            },
            {
              number: '19',
              name: 'Ryan Willis',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '25',
              name: 'Artie Burns',
              position: 'CB',
            },
            {
              number: '26',
              name: 'Deon Bush',
              position: 'SS',
            },
            {
              number: '10',
              name: 'Damiere Byrd',
              position: 'WR',
            },
            {
              number: '23',
              name: 'Marqui Christian',
              position: 'FS',
            },
            {
              number: '14',
              name: 'Andy Dalton',
              position: 'QB',
            },
            {
              number: '68',
              name: 'James Daniels',
              position: 'G',
            },
            {
              number: '38',
              name: 'Tashaun Gipson',
              position: 'SS',
            },
            {
              number: '84',
              name: 'Marquise Goodwin',
              position: 'WR',
            },
            {
              number: '80',
              name: 'Jimmy Graham',
              position: 'TE',
            },
            {
              number: '17',
              name: 'Jakeem Grant',
              position: 'WR',
            },
            {
              number: '96',
              name: 'Akiem Hicks',
              position: 'DE',
            },
            {
              number: '36',
              name: 'DeAndre Houston-Carson',
              position: 'FS',
            },
            {
              number: '93',
              name: 'Margus Hunt',
              position: 'DE',
            },
            {
              number: '74',
              name: 'Germain Ifedi',
              position: 'T',
            },
            {
              number: '55',
              name: 'Bruce Irvin',
              position: 'OLB',
            },
            {
              number: '45',
              name: 'Joel Iyiegbuniwe',
              position: 'ILB',
            },
            {
              number: '18',
              name: 'Jesse James',
              position: 'TE',
            },
            {
              number: '57',
              name: 'Christian Jones',
              position: 'ILB',
            },
            {
              number: '59',
              name: 'Cassius Marsh',
              position: 'OLB',
            },
            {
              number: '98',
              name: 'Bilal Nichols',
              position: 'DE',
            },
            {
              number: '16',
              name: "Pat O'Donnell",
              position: 'P',
            },
            {
              number: '44',
              name: 'Alec Ogletree',
              position: 'ILB',
            },
            {
              number: '71',
              name: 'Jason Peters',
              position: 'T',
            },
            {
              number: '12',
              name: 'Allen Robinson',
              position: 'WR',
            },
            {
              number: '48',
              name: 'Patrick Scales',
              position: 'LS',
            },
            {
              number: '70',
              name: 'Elijah Wilkinson',
              position: 'T',
            },
            {
              number: '8',
              name: 'Damien Williams',
              position: 'RB',
            },
          ],
          restrictedFAs: [
            {
              number: '64',
              name: 'Alex Bars',
              position: 'G',
            },
            {
              number: '21',
              name: 'Xavier Crawford',
              position: 'CB',
            },
            {
              number: '81',
              name: 'J. P. Holtz',
              position: 'TE',
            },
            {
              number: '35',
              name: 'Ryan Nall',
              position: 'RB',
            },
            {
              number: '37',
              name: 'Teez Tabor',
              position: 'SS',
            },
          ],
        },
        MinnesotaVikings: {
          'datejanuary13, 2022': [],
          quarterbacks: [
            {
              number: '8',
              name: 'Kirk Cousins',
              position: null,
            },
            {
              number: '11',
              name: 'Kellen Mond',
              position: null,
            },
            {
              number: '14',
              name: 'Nate Stanley',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '33',
              name: 'Dalvin Cook',
              position: null,
            },
            {
              number: '30',
              name: 'C. J. Ham',
              position: 'FB',
            },
            {
              number: '25',
              name: 'Alexander Mattison',
              position: null,
            },
            {
              number: '26',
              name: 'Kene Nwangwu',
              position: 'KR',
            },
          ],
          wideReceivers: [
            {
              number: '85',
              name: 'Dan Chisena',
              position: null,
            },
            {
              number: '18',
              name: 'Justin Jefferson',
              position: null,
            },
            {
              number: '81',
              name: 'Bisi Johnson',
              position: null,
            },
            {
              number: '17',
              name: 'K. J. Osborn',
              position: null,
            },
            {
              number: '13',
              name: 'Blake Proehl',
              position: null,
            },
            {
              number: '15',
              name: 'Ihmir Smith-Marsette',
              position: null,
            },
            {
              number: '19',
              name: 'Adam Thielen',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '40',
              name: 'Zach Davidson',
              position: null,
            },
            {
              number: '82',
              name: 'Ben Ellefson',
              position: null,
            },
            {
              number: '84',
              name: 'Irv Smith Jr.',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '56',
              name: 'Garrett Bradbury',
              position: 'C',
            },
            {
              number: '64',
              name: 'Blake Brandel',
              position: 'T',
            },
            {
              number: '72',
              name: 'Ezra Cleveland',
              position: 'G',
            },
            {
              number: '71',
              name: 'Christian Darrisaw',
              position: 'T',
            },
            {
              number: '51',
              name: 'Wyatt Davis',
              position: 'G',
            },
            {
              number: '75',
              name: "Brian O'Neill",
              position: 'T',
            },
            {
              number: '74',
              name: 'Oli Udoh',
              position: 'G',
            },
          ],
          defensiveLinemen: [
            {
              number: '99',
              name: 'Danielle Hunter',
              position: 'DE',
            },
            {
              number: '93',
              name: 'Patrick Jones II',
              position: 'DE',
            },
            {
              number: '92',
              name: 'James Lynch',
              position: 'DT',
            },
            {
              number: '58',
              name: 'Michael Pierce',
              position: 'DT',
            },
            {
              number: '95',
              name: 'Janarius Robinson',
              position: 'DE',
            },
            {
              number: '66',
              name: 'Jordon Scott',
              position: 'DT',
            },
            {
              number: '94',
              name: 'Dalvin Tomlinson',
              position: 'DT',
            },
            {
              number: '76',
              name: 'Jaylen Twyman',
              position: 'DT',
            },
            {
              number: '96',
              name: 'Armon Watts',
              position: 'DT',
            },
            {
              number: '79',
              name: 'Kenny Willekes',
              position: 'DE',
            },
            {
              number: '98',
              name: 'D. J. Wonnum',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '57',
              name: 'Ryan Connelly',
              position: 'OLB',
            },
            {
              number: '45',
              name: 'Troy Dye',
              position: 'MLB',
            },
            {
              number: '54',
              name: 'Eric Kendricks',
              position: 'MLB',
            },
            {
              number: '48',
              name: 'Blake Lynch',
              position: 'OLB',
            },
            {
              number: '41',
              name: 'Chazz Surratt',
              position: 'OLB',
            },
          ],
          defensiveBacks: [
            {
              number: '29',
              name: 'Kris Boyd',
              position: 'CB',
            },
            {
              number: '43',
              name: 'Camryn Bynum',
              position: 'SS',
            },
            {
              number: '27',
              name: 'Cameron Dantzler',
              position: 'CB',
            },
            {
              number: '20',
              name: 'Harrison Hand',
              position: 'CB',
            },
            {
              number: '44',
              name: 'Josh Metellus',
              position: 'SS',
            },
            {
              number: '22',
              name: 'Harrison Smith',
              position: 'SS',
            },
          ],
          specialTeams: [
            {
              number: '42',
              name: 'Andrew DePaola',
              position: 'LS',
            },
          ],
          reserveLists: [
            {
              number: '47',
              name: 'Tuf Borland',
              position: '',
            },
            {
              number: '46',
              name: 'Myles Dorn',
              position: '',
            },
            {
              number: '68',
              name: 'Kyle Hinton',
              position: '',
            },
            {
              number: '9',
              name: 'Trishton Jackson',
              position: '',
            },
            {
              number: '87',
              name: 'Myron Mitchell',
              position: '',
            },
            {
              number: '39',
              name: 'Parry Nickerson',
              position: '',
            },
            {
              number: '61',
              name: 'Timon Parris',
              position: '',
            },
            {
              number: '36',
              name: 'A. J. Rose',
              position: '',
            },
            {
              number: '50',
              name: 'T. J. Smith',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '24',
              name: 'Mackensie Alexander',
              position: 'CB',
            },
            {
              number: '55',
              name: 'Anthony Barr',
              position: 'OLB',
            },
            {
              number: '12',
              name: 'Chad Beebe',
              position: 'WR',
            },
            {
              number: '3',
              name: 'Jordan Berry',
              position: 'P',
            },
            {
              number: '73',
              name: 'Tashawn Bower',
              position: 'DE',
            },
            {
              number: '52',
              name: 'Mason Cole',
              position: 'C',
            },
            {
              number: '83',
              name: 'Tyler Conklin',
              position: 'TE',
            },
            {
              number: '78',
              name: 'Dakota Dozier',
              position: 'G',
            },
            {
              number: '31',
              name: 'Wayne Gallman',
              position: 'RB',
            },
            {
              number: '97',
              name: 'Everson Griffen',
              position: 'DE',
            },
            {
              number: '89',
              name: 'Chris Herndon',
              position: 'TE',
            },
            {
              number: '69',
              name: 'Rashod Hill',
              position: 'T',
            },
            {
              number: '14',
              name: 'Sean Mannion',
              position: 'QB',
            },
            {
              number: '7',
              name: 'Patrick Peterson',
              position: 'CB',
            },
            {
              number: '90',
              name: 'Sheldon Richardson',
              position: 'DT',
            },
            {
              number: '35',
              name: 'Luke Stocker',
              position: 'TE',
            },
            {
              number: '59',
              name: 'Nick Vigil',
              position: 'OLB',
            },
            {
              number: '12',
              name: 'Dede Westbrook',
              position: 'WR/PR',
            },
            {
              number: '23',
              name: 'Xavier Woods',
              position: 'FS',
            },
          ],
        },
      },
      south: {
        NewOrleansSaints: {
          'datefebruary23, 2022': [],
          quarterbacks: [
            {
              number: '16',
              name: 'Ian Book',
              position: null,
            },
            {
              number: '7',
              name: 'Taysom Hill',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '14',
              name: 'Mark Ingram Jr.',
              position: null,
            },
            {
              number: '34',
              name: 'Tony Jones Jr.',
              position: null,
            },
            {
              number: '41',
              name: 'Alvin Kamara',
              position: null,
            },
            {
              number: '46',
              name: 'Adam Prentice',
              position: 'FB',
            },
          ],
          wideReceivers: [
            {
              number: '1',
              name: 'Marquez Callaway',
              position: null,
            },
            {
              number: '13',
              name: 'Michael Thomas',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '89',
              name: 'Dylan Soehner',
              position: null,
            },
            {
              number: '82',
              name: 'Adam Trautman',
              position: null,
            },
            {
              number: '81',
              name: 'Nick Vannett',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '74',
              name: 'James Hurst',
              position: 'T',
            },
            {
              number: '78',
              name: 'Erik McCoy',
              position: 'C',
            },
            {
              number: '75',
              name: 'Andrus Peat',
              position: 'G',
            },
            {
              number: '71',
              name: 'Ryan Ramczyk',
              position: 'T',
            },
            {
              number: '51',
              name: 'Cesar Ruiz',
              position: 'G',
            },
            {
              number: '76',
              name: 'Calvin Throckmorton',
              position: 'T',
            },
            {
              number: '67',
              name: 'Landon Young',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '92',
              name: 'Marcus Davenport',
              position: 'DE',
            },
            {
              number: '94',
              name: 'Cameron Jordan',
              position: 'DE',
            },
            {
              number: '90',
              name: 'Tanoh Kpassagnon',
              position: 'DE',
            },
            {
              number: '93',
              name: 'David Onyemata',
              position: 'DT',
            },
            {
              number: '98',
              name: 'Payton Turner',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '53',
              name: 'Zack Baun',
              position: 'OLB',
            },
            {
              number: '56',
              name: 'Demario Davis',
              position: 'MLB',
            },
            {
              number: '50',
              name: 'Andrew Dowell',
              position: 'MLB',
            },
            {
              number: '55',
              name: 'Kaden Elliss',
              position: 'OLB',
            },
            {
              number: '20',
              name: 'Pete Werner',
              position: 'OLB',
            },
          ],
          defensiveBacks: [
            {
              number: '29',
              name: 'Paulson Adebo',
              position: 'CB',
            },
            {
              number: '22',
              name: 'C. J. Gardner-Johnson',
              position: 'SS',
            },
            {
              number: '48',
              name: 'J. T. Gray',
              position: 'SS',
            },
            {
              number: '27',
              name: 'Malcolm Jenkins',
              position: 'SS',
            },
            {
              number: '23',
              name: 'Marshon Lattimore',
              position: 'CB',
            },
            {
              number: '21',
              name: 'Bradley Roby',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '4',
              name: 'Blake Gillikin',
              position: 'P',
            },
            {
              number: '3',
              name: 'Wil Lutz',
              position: 'K',
            },
            {
              number: '49',
              name: 'Zach Wood',
              position: 'LS',
            },
          ],
          reserveLists: [
            {
              number: '31',
              name: 'Josh Adams',
              position: '',
            },
            {
              number: '80',
              name: 'Kawaan Baker',
              position: '',
            },
            {
              number: '6',
              name: 'Blake Bortles',
              position: '',
            },
            {
              number: '68',
              name: 'Cohl Cabral',
              position: '',
            },
            {
              number: '59',
              name: 'Sharif Finch',
              position: '',
            },
            {
              number: '63',
              name: 'Jerald Hawkins',
              position: '',
            },
            {
              number: '52',
              name: 'Braxton Hoyett',
              position: '',
            },
            {
              number: '37',
              name: 'Dylan Mabin',
              position: '',
            },
            {
              number: '17',
              name: 'Jalen McCleskey',
              position: '',
            },
            {
              number: '--',
              name: 'Kirk Merritt',
              position: '',
            },
            {
              number: '36',
              name: 'Jordan Miller',
              position: '',
            },
            {
              number: '97',
              name: 'Malcolm Roach',
              position: '',
            },
            {
              number: '35',
              name: 'KeiVarae Russell',
              position: '',
            },
            {
              number: '32',
              name: 'Bryce Thompson',
              position: '',
            },
            {
              number: '17',
              name: 'Kevin White',
              position: '',
            },
            {
              number: '18',
              name: 'Easop Winston',
              position: '',
            },
            {
              number: '86',
              name: 'Ethan Wolf',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '5',
              name: 'Kwon Alexander',
              position: 'OLB',
            },
            {
              number: '72',
              name: 'Terron Armstead',
              position: 'T',
            },
            {
              number: '65',
              name: 'Caleb Benenoch',
              position: 'T',
            },
            {
              number: '77',
              name: 'James Carpenter',
              position: 'G',
            },
            {
              number: '25',
              name: 'Ken Crawley',
              position: 'CB',
            },
            {
              number: '38',
              name: 'Jeff Heath',
              position: 'SS',
            },
            {
              number: '57',
              name: 'Jalyn Holmes',
              position: 'DE',
            },
            {
              number: '79',
              name: 'Jordan Mills',
              position: 'T',
            },
            {
              number: '88',
              name: 'Ty Montgomery',
              position: 'WR',
            },
            {
              number: '70',
              name: 'Christian Ringo',
              position: 'DT',
            },
            {
              number: '15',
              name: 'Trevor Siemian',
              position: 'QB',
            },
            {
              number: '10',
              name: "Tre'Quan Smith",
              position: 'WR',
            },
            {
              number: '12',
              name: 'Kenny Stills',
              position: 'WR',
            },
            {
              number: '24',
              name: 'Dwayne Washington',
              position: 'RB',
            },
            {
              number: '43',
              name: 'Marcus Williams',
              position: 'FS',
            },
            {
              number: '26',
              name: 'P. J. Williams',
              position: 'FS',
            },
            {
              number: '2',
              name: 'Jameis Winston',
              position: 'QB',
            },
          ],
          restrictedFAs: [
            {
              number: '96',
              name: 'Carl Granderson',
              position: 'DE',
            },
            {
              number: '73',
              name: 'Ethan Greenidge',
              position: 'T',
            },
            {
              number: '45',
              name: 'Garrett Griffin',
              position: 'TE',
            },
            {
              number: '11',
              name: 'Deonte Harris',
              position: 'WR',
            },
            {
              number: '99',
              name: 'Shy Tuttle',
              position: 'DT',
            },
          ],
        },
        AtlantaFalcons: {
          quarterbacks: [
            {
              number: '15',
              name: 'Feleipe Franks',
              position: null,
            },
            {
              number: '2',
              name: 'Matt Ryan',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '28',
              name: 'Mike Davis',
              position: null,
            },
            {
              number: '40',
              name: 'Keith Smith',
              position: 'FB',
            },
          ],
          wideReceivers: [
            {
              number: '88',
              name: 'Frank Darby',
              position: null,
            },
            {
              number: '18',
              name: 'Calvin Ridley',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '80',
              name: 'Ryan Becker',
              position: null,
            },
            {
              number: '46',
              name: 'Parker Hesse',
              position: null,
            },
            {
              number: '8',
              name: 'Kyle Pitts',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '67',
              name: 'Drew Dalman',
              position: 'C',
            },
            {
              number: '61',
              name: 'Matt Hennessy',
              position: 'C',
            },
            {
              number: '71',
              name: 'Rick Leonard',
              position: 'T',
            },
            {
              number: '63',
              name: 'Chris Lindstrom',
              position: 'G',
            },
            {
              number: '70',
              name: 'Jake Matthews',
              position: 'T',
            },
            {
              number: '77',
              name: 'Jalen Mayfield',
              position: 'T',
            },
            {
              number: '76',
              name: 'Kaleb McGary',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '50',
              name: 'John Cominsky',
              position: 'DE',
            },
            {
              number: '90',
              name: 'Marlon Davidson',
              position: 'DE',
            },
            {
              number: '96',
              name: 'Tyeler Davison',
              position: 'NT',
            },
            {
              number: '95',
              name: "Ta'Quon Graham",
              position: 'DE',
            },
            {
              number: '97',
              name: 'Grady Jarrett',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '45',
              name: 'Deion Jones',
              position: 'ILB',
            },
            {
              number: '92',
              name: 'Adetokunbo Ogundeji',
              position: 'OLB',
            },
            {
              number: '93',
              name: 'James Vaughters',
              position: 'OLB',
            },
            {
              number: '3',
              name: 'Mykal Walker',
              position: 'ILB',
            },
          ],
          defensiveBacks: [
            {
              number: '27',
              name: 'Richie Grant',
              position: 'SS',
            },
            {
              number: '34',
              name: 'Darren Hall',
              position: 'CB',
            },
            {
              number: '32',
              name: 'Jaylinn Hawkins',
              position: 'SS',
            },
            {
              number: '20',
              name: 'Kendall Sheffield',
              position: 'CB',
            },
            {
              number: '24',
              name: 'A. J. Terrell',
              position: 'CB',
            },
            {
              number: '35',
              name: 'Avery Williams',
              position: 'CB',
            },
          ],
          specialTeams: [],
          reserveLists: [
            {
              number: '37',
              name: 'DeAundre Alford',
              position: '',
            },
            {
              number: '29',
              name: 'Cornell Armstrong',
              position: '',
            },
            {
              number: '--',
              name: 'Corey Ballentine',
              position: '',
            },
            {
              number: '72',
              name: 'Willie Beavers',
              position: '',
            },
            {
              number: '56',
              name: 'Quinton Bell',
              position: '',
            },
            {
              number: '49',
              name: 'Jordan Brailford',
              position: '',
            },
            {
              number: '--',
              name: 'Rashaad Coward',
              position: '',
            },
            {
              number: '--',
              name: 'Duke Ejiofor',
              position: '',
            },
            {
              number: '48',
              name: 'Dorian Etheridge',
              position: '',
            },
            {
              number: '83',
              name: 'Chad Hansen',
              position: '',
            },
            {
              number: '--',
              name: 'Daniel Helm',
              position: '',
            },
            {
              number: '42',
              name: 'Caleb Huntley',
              position: '',
            },
            {
              number: '33',
              name: 'Luther Kirk',
              position: '',
            },
            {
              number: '86',
              name: 'Brayden Lenius',
              position: '',
            },
            {
              number: '9',
              name: 'Dom Maggio',
              position: '',
            },
            {
              number: '64',
              name: 'Ryan Neuzil',
              position: '',
            },
            {
              number: '38',
              name: 'Lafayette Pitts',
              position: '',
            },
            {
              number: '89',
              name: 'John Raine',
              position: '',
            },
            {
              number: '59',
              name: 'Rashad Smith',
              position: '',
            },
            {
              number: '79',
              name: 'Nick Thurman',
              position: '',
            },
            {
              number: '82',
              name: 'Austin Trammell',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '68',
              name: 'Josh Andrews',
              position: 'G',
            },
            {
              number: '53',
              name: 'Daren Bates',
              position: 'ILB',
            },
            {
              number: '99',
              name: 'Jonathan Bullard',
              position: 'DE',
            },
            {
              number: '51',
              name: 'Brandon Copeland',
              position: 'OLB',
            },
            {
              number: '14',
              name: 'Russell Gage',
              position: 'WR',
            },
            {
              number: '21',
              name: 'Duron Harmon',
              position: 'FS',
            },
            {
              number: '23',
              name: 'Erik Harris',
              position: 'FS',
            },
            {
              number: '47',
              name: 'Josh Harris',
              position: 'LS',
            },
            {
              number: '81',
              name: 'Hayden Hurst',
              position: 'TE',
            },
            {
              number: '5',
              name: 'A. J. McCarron',
              position: 'QB',
            },
            {
              number: '55',
              name: 'Steven Means',
              position: 'OLB',
            },
            {
              number: '22',
              name: 'Fabian Moreau',
              position: 'CB',
            },
            {
              number: '19',
              name: 'Thomas Morstead',
              position: 'P',
            },
            {
              number: '26',
              name: 'Isaiah Oliver',
              position: 'CB',
            },
            {
              number: '54',
              name: 'Foyesade Oluokun',
              position: 'ILB',
            },
            {
              number: '84',
              name: 'Cordarrelle Patterson',
              position: 'WR',
            },
            {
              number: '98',
              name: 'Mike Pennel',
              position: 'NT',
            },
            {
              number: '4',
              name: 'Tajae Sharpe',
              position: 'WR',
            },
            {
              number: '69',
              name: 'Jason Spriggs',
              position: 'T',
            },
            {
              number: '36',
              name: 'Shawn Williams',
              position: 'SS',
            },
          ],
          restrictedFAs: [
            {
              number: '13',
              name: 'Christian Blake',
              position: 'WR',
            },
            {
              number: '52',
              name: 'Emmanuel Ellerbee',
              position: 'ILB',
            },
            {
              number: '87',
              name: 'Jaeden Graham',
              position: 'TE',
            },
            {
              number: '7',
              name: 'Younghoe Koo',
              position: 'K',
            },
            {
              number: '30',
              name: 'Qadree Ollison',
              position: 'RB',
            },
            {
              number: '16',
              name: 'Josh Rosen',
              position: 'QB',
            },
            {
              number: '94',
              name: 'Anthony Rush',
              position: 'NT',
            },
            {
              number: '17',
              name: 'Olamide Zaccheaus',
              position: 'WR',
            },
          ],
        },
        CarolinaPanthers: {
          'datefebruary27, 2022': [],
          quarterbacks: [
            {
              number: '14',
              name: 'Sam Darnold',
              position: null,
            },
            {
              number: '6',
              name: 'P. J. Walker',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '30',
              name: 'Chuba Hubbard',
              position: null,
            },
            {
              number: '22',
              name: 'Christian McCaffrey',
              position: null,
            },
            {
              number: '45',
              name: 'Giovanni Ricci',
              position: 'FB',
            },
          ],
          wideReceivers: [
            {
              number: '11',
              name: 'Robby Anderson',
              position: null,
            },
            {
              number: '88',
              name: 'Terrace Marshall Jr.',
              position: null,
            },
            {
              number: '2',
              name: 'D. J. Moore',
              position: null,
            },
            {
              number: '12',
              name: 'Shi Smith',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '84',
              name: 'Stephen Sullivan',
              position: null,
            },
            {
              number: '80',
              name: 'Ian Thomas',
              position: null,
            },
            {
              number: '82',
              name: 'Tommy Tremble',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '77',
              name: 'Deonte Brown',
              position: 'G',
            },
            {
              number: '70',
              name: 'Brady Christensen',
              position: 'T',
            },
            {
              number: '65',
              name: 'Dennis Daley',
              position: 'G',
            },
            {
              number: '60',
              name: 'Pat Elflein',
              position: 'G',
            },
            {
              number: '75',
              name: 'Cameron Erving',
              position: 'T',
            },
            {
              number: '73',
              name: 'Michael Jordan',
              position: 'G',
            },
            {
              number: '72',
              name: 'Taylor Moton',
              position: 'T',
            },
            {
              number: '68',
              name: 'Sam Tecklenburg',
              position: 'C',
            },
          ],
          defensiveLinemen: [
            {
              number: '95',
              name: 'Derrick Brown',
              position: 'DT',
            },
            {
              number: '53',
              name: 'Brian Burns',
              position: 'DE',
            },
            {
              number: '91',
              name: 'Morgan Fox',
              position: 'DE',
            },
            {
              number: '97',
              name: 'Yetur Gross-Matos',
              position: 'DE',
            },
            {
              number: '71',
              name: 'Phil Hoskins',
              position: 'DT',
            },
            {
              number: '--',
              name: 'Joe Jackson',
              position: 'DE',
            },
            {
              number: '92',
              name: 'Darryl Johnson',
              position: 'DE',
            },
            {
              number: '54',
              name: 'Azur Kamara',
              position: 'DE',
            },
            {
              number: '94',
              name: 'Daviyon Nixon',
              position: 'DT',
            },
            {
              number: '93',
              name: 'Bravvion Roy',
              position: 'DT',
            },
            {
              number: '48',
              name: 'Jacob Tuioti-Mariner',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '49',
              name: 'Frankie Luvu',
              position: 'OLB',
            },
            {
              number: '47',
              name: 'Kamal Martin',
              position: 'OLB',
            },
            {
              number: '7',
              name: 'Shaq Thompson',
              position: 'OLB',
            },
          ],
          defensiveBacks: [
            {
              number: '24',
              name: 'A. J. Bouye',
              position: 'CB',
            },
            {
              number: '21',
              name: 'Jeremy Chinn',
              position: 'FS',
            },
            {
              number: '42',
              name: 'Sam Franklin',
              position: 'SS',
            },
            {
              number: '38',
              name: 'Myles Hartsfield',
              position: 'FS',
            },
            {
              number: '15',
              name: 'C. J. Henderson',
              position: 'CB',
            },
            {
              number: '8',
              name: 'Jaycee Horn',
              position: 'CB',
            },
            {
              number: '25',
              name: 'Troy Pride',
              position: 'CB',
            },
            {
              number: '27',
              name: 'Kenny Robinson',
              position: 'FS',
            },
            {
              number: '28',
              name: 'Keith Taylor',
              position: '',
            },
            {
              number: '23',
              name: 'Stantley Thomas-Oliver',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '46',
              name: 'Thomas Fletcher',
              position: 'LS',
            },
            {
              number: '3',
              name: 'Lirim Hajrullahu',
              position: 'K',
            },
            {
              number: '44',
              name: 'J. J. Jansen',
              position: 'LS',
            },
          ],
          reserveLists: [
            {
              number: '--',
              name: 'Darius Bradwell',
              position: '',
            },
            {
              number: '33',
              name: 'Spencer Brown',
              position: '',
            },
            {
              number: '36',
              name: 'Madre Harper',
              position: '',
            },
            {
              number: '69',
              name: 'Frank Herron',
              position: '',
            },
            {
              number: '66',
              name: 'Mike Horton',
              position: '',
            },
            {
              number: '96',
              name: 'Austin Larkin',
              position: '',
            },
            {
              number: '62',
              name: 'Aaron Monteiro',
              position: '',
            },
            {
              number: '19',
              name: 'Aaron Parker',
              position: '',
            },
            {
              number: '74',
              name: 'Austen Pleasants',
              position: '',
            },
            {
              number: '81',
              name: 'C. J. Saunders',
              position: '',
            },
            {
              number: '86',
              name: 'Colin Thompson',
              position: '',
            },
          ],
        },
        TampaBayBuccaneers: {
          quarterbacks: [
            {
              number: '2',
              name: 'Kyle Trask',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '21',
              name: "Ke'Shawn Vaughn",
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '1',
              name: 'Jaelon Darden',
              position: null,
            },
            {
              number: '13',
              name: 'Mike Evans',
              position: null,
            },
            {
              number: '15',
              name: 'Cyril Grayson',
              position: null,
            },
            {
              number: '18',
              name: 'Tyler Johnson',
              position: null,
            },
            {
              number: '10',
              name: 'Scotty Miller',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '84',
              name: 'Cameron Brate',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '70',
              name: 'Robert Hainsey',
              position: 'T',
            },
            {
              number: '61',
              name: 'Sadarius Hutcherson',
              position: 'G',
            },
            {
              number: '60',
              name: 'Nick Leverett',
              position: 'G',
            },
            {
              number: '76',
              name: 'Donovan Smith',
              position: 'T',
            },
            {
              number: '73',
              name: 'Brandon Walton',
              position: 'T',
            },
            {
              number: '78',
              name: 'Tristan Wirfs',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '56',
              name: 'Rakeem Nuñez-Roches',
              position: 'NT',
            },
            {
              number: '50',
              name: 'Vita Vea',
              position: 'NT',
            },
          ],
          linebackers: [
            {
              number: '58',
              name: 'Shaquil Barrett',
              position: 'OLB',
            },
            {
              number: '52',
              name: 'K. J. Britt',
              position: 'ILB',
            },
            {
              number: '54',
              name: 'Lavonte David',
              position: 'ILB',
            },
            {
              number: '49',
              name: 'Cam Gill',
              position: 'OLB',
            },
            {
              number: '98',
              name: 'Anthony Nelson',
              position: 'OLB',
            },
            {
              number: '48',
              name: 'Grant Stuard',
              position: 'ILB',
            },
            {
              number: '9',
              name: 'Joe Tryon-Shoyinka',
              position: 'OLB',
            },
            {
              number: '45',
              name: 'Devin White',
              position: 'ILB',
            },
          ],
          defensiveBacks: [
            {
              number: '43',
              name: 'Ross Cockrell',
              position: 'CB',
            },
            {
              number: '35',
              name: 'Jamel Dean',
              position: 'CB',
            },
            {
              number: '30',
              name: 'Dee Delaney',
              position: 'CB',
            },
            {
              number: '32',
              name: 'Mike Edwards',
              position: 'FS',
            },
            {
              number: '23',
              name: 'Sean Murphy-Bunting',
              position: 'CB',
            },
            {
              number: '31',
              name: 'Antoine Winfield Jr.',
              position: 'FS',
            },
          ],
          specialTeams: [
            {
              number: '8',
              name: 'Bradley Pinion',
              position: 'P',
            },
            {
              number: '3',
              name: 'Ryan Succop',
              position: 'K',
            },
          ],
          reserveLists: [
            {
              number: '38',
              name: 'Kenjon Barner',
              position: '',
            },
            {
              number: '19',
              name: 'José Borregales',
              position: '',
            },
            {
              number: '39',
              name: 'Chris Cooper',
              position: '',
            },
            {
              number: '6',
              name: 'Sterling Hofrichter',
              position: '',
            },
            {
              number: '68',
              name: 'Jonathan Hubbard',
              position: '',
            },
            {
              number: '--',
              name: 'Travis Jonsen',
              position: '',
            },
            {
              number: '86',
              name: 'Codey McElroy',
              position: '',
            },
            {
              number: '75',
              name: 'John Molchon',
              position: '',
            },
            {
              number: '44',
              name: 'Elijah Ponder',
              position: '',
            },
            {
              number: '91',
              name: "Benning Potoa'e",
              position: '',
            },
            {
              number: '94',
              name: 'Willington Previlon',
              position: '',
            },
            {
              number: '28',
              name: 'Rashard Robinson',
              position: '',
            },
            {
              number: '71',
              name: 'Kobe Smith',
              position: '',
            },
            {
              number: '--',
              name: 'Vyncint Smith',
              position: '',
            },
            {
              number: '22',
              name: 'Troy Warner',
              position: '',
            },
            {
              number: '--',
              name: 'Austin Watkins',
              position: '',
            },
          ],
          practiceSquad: [],
          unrestrictedFAs: [
            {
              number: '26',
              name: 'Andrew Adams',
              position: 'SS',
            },
            {
              number: '25',
              name: 'Giovani Bernard',
              position: 'RB',
            },
            {
              number: '65',
              name: 'Alex Cappa',
              position: 'G',
            },
            {
              number: '24',
              name: 'Carlton Davis',
              position: 'CB',
            },
            {
              number: '29',
              name: 'Pierre Desir',
              position: 'CB',
            },
            {
              number: '7',
              name: 'Leonard Fournette',
              position: 'RB',
            },
            {
              number: '11',
              name: 'Blaine Gabbert',
              position: 'QB',
            },
            {
              number: '92',
              name: 'William Gholston',
              position: 'DE',
            },
            {
              number: '14',
              name: 'Chris Godwin',
              position: 'WR',
            },
            {
              number: '87',
              name: 'Rob Gronkowski',
              position: 'TE',
            },
            {
              number: '80',
              name: 'O. J. Howard',
              position: 'TE',
            },
            {
              number: '66',
              name: 'Ryan Jensen',
              position: 'C',
            },
            {
              number: '27',
              name: 'Ronald Jones II',
              position: 'RB',
            },
            {
              number: '96',
              name: 'Steve McLendon',
              position: 'NT',
            },
            {
              number: '51',
              name: 'Kevin Minter',
              position: 'ILB',
            },
            {
              number: '16',
              name: 'Breshad Perriman',
              position: 'WR',
            },
            {
              number: '90',
              name: 'Jason Pierre-Paul',
              position: 'OLB',
            },
            {
              number: '39',
              name: 'Curtis Riley',
              position: 'SS',
            },
            {
              number: '5',
              name: 'Richard Sherman',
              position: 'CB',
            },
            {
              number: '64',
              name: 'Aaron Stinnie',
              position: 'G',
            },
            {
              number: '93',
              name: 'Ndamukong Suh',
              position: 'DE',
            },
            {
              number: '72',
              name: 'Josh Wells',
              position: 'T',
            },
            {
              number: '33',
              name: 'Jordan Whitehead',
              position: 'SS',
            },
          ],
        },
      },
      east: {
        DallasCowboys: {
          'datefebruary5, 2022': [],
          quarterbacks: [
            {
              number: '15',
              name: 'Will Grier',
              position: null,
            },
            {
              number: '4',
              name: 'Dak Prescott',
              position: null,
            },
            {
              number: '10',
              name: 'Cooper Rush',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '34',
              name: 'Rico Dowdle',
              position: null,
            },
            {
              number: '21',
              name: 'Ezekiel Elliott',
              position: null,
            },
            {
              number: '45',
              name: 'Sewo Olonilua',
              position: 'FB',
            },
            {
              number: '20',
              name: 'Tony Pollard',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '19',
              name: 'Amari Cooper',
              position: null,
            },
            {
              number: '81',
              name: 'Simi Fehoko',
              position: null,
            },
            {
              number: '88',
              name: 'CeeDee Lamb',
              position: null,
            },
            {
              number: '15',
              name: 'T. J. Vasher',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '89',
              name: 'Blake Jarwin',
              position: null,
            },
            {
              number: '84',
              name: 'Sean McKeon',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '75',
              name: 'Josh Ball',
              position: 'T',
            },
            {
              number: '63',
              name: 'Tyler Biadasz',
              position: 'C',
            },
            {
              number: '71',
              name: "La'el Collins",
              position: 'T',
            },
            {
              number: '68',
              name: 'Matt Farniok',
              position: 'G',
            },
            {
              number: '70',
              name: 'Zack Martin',
              position: 'G',
            },
            {
              number: '66',
              name: 'Connor McGovern',
              position: 'G',
            },
            {
              number: '77',
              name: 'Tyron Smith',
              position: 'T',
            },
            {
              number: '78',
              name: 'Terence Steele',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '93',
              name: 'Tarell Basham',
              position: 'DE',
            },
            {
              number: '98',
              name: 'Quinton Bohanna',
              position: 'DT',
            },
            {
              number: '96',
              name: 'Neville Gallimore',
              position: 'DT',
            },
            {
              number: '59',
              name: 'Chauncey Golston',
              position: 'DE',
            },
            {
              number: '72',
              name: 'Trysten Hill',
              position: 'DT',
            },
            {
              number: '90',
              name: 'DeMarcus Lawrence',
              position: 'DE',
            },
            {
              number: '97',
              name: 'Osa Odighizuwa',
              position: 'DT',
            },
          ],
          linebackers: [
            {
              number: '14',
              name: 'Jabril Cox',
              position: 'OLB',
            },
            {
              number: '11',
              name: 'Micah Parsons',
              position: 'OLB',
            },
          ],
          defensiveBacks: [
            {
              number: '30',
              name: 'Anthony Brown',
              position: 'CB',
            },
            {
              number: '7',
              name: 'Trevon Diggs',
              position: 'CB',
            },
            {
              number: '29',
              name: 'C. J. Goodwin',
              position: 'CB',
            },
            {
              number: '24',
              name: 'Kelvin Joseph',
              position: 'CB',
            },
            {
              number: '26',
              name: 'Jourdan Lewis',
              position: 'CB',
            },
            {
              number: '38',
              name: 'Israel Mukuamu',
              position: 'FS',
            },
            {
              number: '41',
              name: 'Reggie Robinson',
              position: 'CB',
            },
            {
              number: '6',
              name: 'Donovan Wilson',
              position: 'SS',
            },
            {
              number: '25',
              name: 'Nahshon Wright',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '1',
              name: 'Hunter Niswander',
              position: 'P',
            },
            {
              number: '2',
              name: 'Greg Zuerlein',
              position: 'K',
            },
          ],
          reserveLists: [
            {
              number: '60',
              name: 'Isaac Alarcón',
              position: '',
            },
            {
              number: '51',
              name: 'Devante Bond',
              position: '',
            },
            {
              number: '36',
              name: 'Kyron Brown',
              position: '',
            },
            {
              number: '49',
              name: 'Ian Bunting',
              position: '',
            },
            {
              number: '76',
              name: 'Aviante Collins',
              position: '',
            },
            {
              number: '39',
              name: 'Tyler Coyle',
              position: '',
            },
            {
              number: '3',
              name: 'Ben DiNucci',
              position: '',
            },
            {
              number: '58',
              name: 'Austin Faoliu',
              position: '',
            },
            {
              number: '83',
              name: 'Robert Foster',
              position: '',
            },
            {
              number: '37',
              name: 'JaQuan Hardy',
              position: '',
            },
            {
              number: '62',
              name: 'Braylon Jones',
              position: '',
            },
            {
              number: '--',
              name: 'Chris Naggar',
              position: '',
            },
            {
              number: '46',
              name: 'Nick Ralston',
              position: '',
            },
            {
              number: '80',
              name: 'Brandon Smith',
              position: '',
            },
            {
              number: '43',
              name: 'Ito Smith',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '5',
              name: 'Bryan Anger',
              position: 'P',
            },
            {
              number: '92',
              name: 'Dorance Armstrong',
              position: 'DE',
            },
            {
              number: '85',
              name: 'Noah Brown',
              position: 'WR',
            },
            {
              number: '31',
              name: 'Maurice Canady',
              position: 'CB',
            },
            {
              number: '32',
              name: 'Corey Clement',
              position: 'RB',
            },
            {
              number: '13',
              name: 'Michael Gallup',
              position: 'WR',
            },
            {
              number: '94',
              name: 'Randy Gregory',
              position: 'DE',
            },
            {
              number: '28',
              name: 'Malik Hooker',
              position: 'FS',
            },
            {
              number: '18',
              name: 'Damontae Kazee',
              position: 'FS',
            },
            {
              number: '27',
              name: 'Jayron Kearse',
              position: 'SS',
            },
            {
              number: '44',
              name: 'Jacob McQuaide',
              position: 'LS',
            },
            {
              number: '42',
              name: 'Keanu Neal',
              position: 'MLB',
            },
            {
              number: '79',
              name: 'Ty Nsekhe',
              position: 'T',
            },
            {
              number: '86',
              name: 'Dalton Schultz',
              position: 'TE',
            },
            {
              number: '87',
              name: 'Jeremy Sprinkle',
              position: 'TE',
            },
            {
              number: '17',
              name: 'Malik Turner',
              position: 'WR',
            },
            {
              number: '95',
              name: 'Brent Urban',
              position: 'DT',
            },
            {
              number: '55',
              name: 'Leighton Vander Esch',
              position: 'OLB',
            },
            {
              number: '91',
              name: 'Carlos Watkins',
              position: 'DT',
            },
            {
              number: '52',
              name: 'Connor Williams',
              position: 'G',
            },
            {
              number: '1',
              name: 'Cedrick Wilson Jr.',
              position: 'WR',
            },
          ],
          restrictedFAs: [
            {
              number: '57',
              name: 'Luke Gifford',
              position: 'OLB',
            },
          ],
        },
        PhiladelphiaEagles: {
          runningBacks: [
            {
              number: '14',
              name: 'Kenneth Gainwell',
              position: null,
            },
            {
              number: '32',
              name: 'Jason Huntley',
              position: null,
            },
            {
              number: '26',
              name: 'Miles Sanders',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '19',
              name: 'J. J. Arcega-Whiteside',
              position: null,
            },
            {
              number: '18',
              name: 'Jalen Reagor',
              position: null,
            },
            {
              number: '6',
              name: 'DeVonta Smith',
              position: null,
            },
            {
              number: '16',
              name: 'Quez Watkins',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '88',
              name: 'Dallas Goedert',
              position: null,
            },
            {
              number: '80',
              name: 'Tyree Jackson',
              position: null,
            },
            {
              number: '81',
              name: 'Richard Rodgers II',
              position: null,
            },
            {
              number: '89',
              name: 'Jack Stoll',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '76',
              name: 'Jack Anderson',
              position: '',
            },
            {
              number: '74',
              name: "Le'Raven Clark",
              position: 'T',
            },
            {
              number: '69',
              name: 'Landon Dickerson',
              position: 'G',
            },
            {
              number: '77',
              name: 'Andre Dillard',
              position: 'T',
            },
            {
              number: '63',
              name: 'Jack Driscoll',
              position: 'T',
            },
            {
              number: '65',
              name: 'Lane Johnson',
              position: 'T',
            },
            {
              number: '68',
              name: 'Jordan Mailata',
              position: 'T',
            },
            {
              number: '78',
              name: 'Sua Opeta',
              position: 'G',
            },
            {
              number: '56',
              name: 'Isaac Seumalo',
              position: 'G',
            },
            {
              number: '64',
              name: 'Brett Toth',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '91',
              name: 'Fletcher Cox',
              position: 'DT',
            },
            {
              number: '55',
              name: 'Brandon Graham',
              position: 'DE',
            },
            {
              number: '97',
              name: 'Javon Hargrave',
              position: 'DT',
            },
            {
              number: '75',
              name: 'Tarron Jackson',
              position: 'DE',
            },
            {
              number: '95',
              name: 'Joe Ostman',
              position: 'DE',
            },
            {
              number: '94',
              name: 'Josh Sweat',
              position: 'DE',
            },
            {
              number: '95',
              name: 'Marlon Tuipulotu',
              position: 'DT',
            },
            {
              number: '93',
              name: 'Milton Williams',
              position: 'DT',
            },
            {
              number: '--',
              name: 'Renell Wren',
              position: 'DT',
            },
          ],
          linebackers: [
            {
              number: '54',
              name: 'Shaun Bradley',
              position: 'MLB',
            },
            {
              number: '57',
              name: 'T. J. Edwards',
              position: 'MLB',
            },
            {
              number: '48',
              name: 'Patrick Johnson',
              position: 'OLB',
            },
            {
              number: '52',
              name: 'Davion Taylor',
              position: 'OLB',
            },
          ],
          defensiveBacks: [
            {
              number: '22',
              name: 'Marcus Epps',
              position: 'FS',
            },
            {
              number: '36',
              name: 'Tay Gowan',
              position: 'CB',
            },
            {
              number: '29',
              name: 'Avonte Maddox',
              position: 'CB',
            },
            {
              number: '27',
              name: 'Zech McPhearson',
              position: 'CB',
            },
            {
              number: '33',
              name: 'Josiah Scott',
              position: 'CB',
            },
            {
              number: '2',
              name: 'Darius Slay',
              position: 'CB',
            },
            {
              number: '34',
              name: 'Kary Vincent Jr.',
              position: 'CB',
            },
            {
              number: '42',
              name: "K'Von Wallace",
              position: 'SS',
            },
          ],
          specialTeams: [
            {
              number: '4',
              name: 'Jake Elliott',
              position: 'K',
            },
            {
              number: '45',
              name: 'Rick Lovato',
              position: 'LS',
            },
            {
              number: '8',
              name: 'Arryn Siposs',
              position: 'P',
            },
          ],
          reserveLists: [
            {
              number: '72',
              name: 'Kayode Awosika',
              position: '',
            },
            {
              number: '85',
              name: 'Deon Cain',
              position: '',
            },
            {
              number: '82',
              name: 'John Hightower',
              position: '',
            },
            {
              number: '53',
              name: 'Christian Elliss',
              position: '',
            },
            {
              number: '31',
              name: 'Craig James',
              position: '',
            },
            {
              number: '66',
              name: 'Matt Leo',
              position: '',
            },
            {
              number: '59',
              name: 'Cameron Malveaux',
              position: '',
            },
            {
              number: '41',
              name: 'Jared Mayden',
              position: '',
            },
            {
              number: '37',
              name: 'Mac McCain',
              position: '',
            },
            {
              number: '30',
              name: 'JaCoby Stevens',
              position: '',
            },
            {
              number: '83',
              name: 'Noah Togiai',
              position: '',
            },
            {
              number: '73',
              name: 'Marvin Wilson',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '58',
              name: 'Genard Avery',
              position: 'OLB',
            },
            {
              number: '96',
              name: 'Derek Barnett',
              position: 'DE',
            },
            {
              number: '28',
              name: 'Anthony Harris',
              position: 'SS',
            },
            {
              number: '24',
              name: 'Jordan Howard',
              position: 'RB',
            },
            {
              number: '62',
              name: 'Jason Kelce',
              position: 'C',
            },
            {
              number: '90',
              name: 'Ryan Kerrigan',
              position: 'DE',
            },
            {
              number: '23',
              name: 'Rodney McLeod',
              position: 'FS',
            },
            {
              number: '3',
              name: 'Steven Nelson',
              position: 'CB',
            },
            {
              number: '98',
              name: 'Hassan Ridgeway',
              position: 'DT',
            },
          ],
          restrictedFAs: [
            {
              number: '81',
              name: 'Jason Croom',
              position: 'TE',
            },
            {
              number: '67',
              name: 'Nate Herbig',
              position: 'G',
            },
            {
              number: '35',
              name: 'Boston Scott',
              position: 'RB',
            },
            {
              number: '49',
              name: 'Alex Singleton',
              position: 'OLB',
            },
            {
              number: '84',
              name: 'Greg Ward',
              position: 'WR',
            },
          ],
        },
        WashingtonCommanders: {
          'datefebruary2, 2022': [],
          quarterbacks: [
            {
              number: '4',
              name: 'Taylor Heinicke',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '24',
              name: 'Antonio Gibson',
              position: null,
            },
            {
              number: '32',
              name: 'Jaret Patterson',
              position: null,
            },
            {
              number: '35',
              name: 'Jonathan Williams',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '2',
              name: 'Dyami Brown',
              position: null,
            },
            {
              number: '17',
              name: 'Terry McLaurin',
              position: null,
            },
            {
              number: '15',
              name: 'Dax Milne',
              position: null,
            },
            {
              number: '10',
              name: 'Curtis Samuel',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '87',
              name: 'John Bates',
              position: null,
            },
            {
              number: '80',
              name: 'Sammis Reyes',
              position: null,
            },
            {
              number: '82',
              name: 'Logan Thomas',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '77',
              name: 'Saahdiq Charles',
              position: 'T',
            },
            {
              number: '76',
              name: 'Sam Cosmi',
              position: 'T',
            },
            {
              number: '79',
              name: 'Ereck Flowers',
              position: 'G',
            },
            {
              number: '72',
              name: 'Charles Leno',
              position: 'T',
            },
            {
              number: '73',
              name: 'Chase Roullier',
              position: 'C',
            },
            {
              number: '71',
              name: 'Wes Schweitzer',
              position: 'G',
            },
          ],
          defensiveLinemen: [
            {
              number: '93',
              name: 'Jonathan Allen',
              position: 'DT',
            },
            {
              number: '56',
              name: 'William Bradley-King',
              position: 'DE',
            },
            {
              number: '98',
              name: 'Matt Ioannidis',
              position: 'DT',
            },
            {
              number: '94',
              name: 'Daron Payne',
              position: 'DT',
            },
            {
              number: '96',
              name: 'James Smith-Williams',
              position: 'DE',
            },
            {
              number: '90',
              name: 'Montez Sweat',
              position: 'DE',
            },
            {
              number: '58',
              name: 'Shaka Toney',
              position: 'DE',
            },
            {
              number: '95',
              name: 'Casey Toohill',
              position: 'DE',
            },
            {
              number: '99',
              name: 'Chase Young',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '52',
              name: 'Jamin Davis',
              position: 'OLB',
            },
            {
              number: '45',
              name: "De'Jon Harris",
              position: 'OLB',
            },
            {
              number: '55',
              name: 'Cole Holcomb',
              position: 'OLB',
            },
            {
              number: '47',
              name: 'Khaleke Hudson',
              position: 'MLB',
            },
            {
              number: '59',
              name: 'Jordan Kunaszyk',
              position: 'MLB',
            },
            {
              number: '51',
              name: 'David Mayo',
              position: 'MLB',
            },
          ],
          defensiveBacks: [
            {
              number: '26',
              name: 'Landon Collins',
              position: 'SS',
            },
            {
              number: '31',
              name: 'Kamren Curl',
              position: 'FS',
            },
            {
              number: '37',
              name: 'Corn Elder',
              position: 'CB',
            },
            {
              number: '22',
              name: 'Deshazor Everett',
              position: 'SS',
            },
            {
              number: '48',
              name: 'Darrick Forrest',
              position: 'SS',
            },
            {
              number: '29',
              name: 'Kendall Fuller',
              position: 'CB',
            },
            {
              number: '23',
              name: 'William Jackson III',
              position: 'CB',
            },
            {
              number: '39',
              name: 'Jeremy Reaves',
              position: 'FS',
            },
            {
              number: '25',
              name: 'Benjamin St-Juste',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '54',
              name: 'Camaron Cheeseman',
              position: 'LS',
            },
            {
              number: '5',
              name: 'Tress Way',
              position: 'P',
            },
          ],
          reserveLists: [
            {
              number: '40',
              name: 'Alex Armah',
              position: '',
            },
            {
              number: '64',
              name: 'David Bada',
              position: '',
            },
            {
              number: '61',
              name: 'Zack Bailey',
              position: '',
            },
            {
              number: '39',
              name: 'Reggie Bonnafon',
              position: '',
            },
            {
              number: '63',
              name: 'Beau Benzschawel',
              position: '',
            },
            {
              number: '68',
              name: 'Shaq Calhoun',
              position: '',
            },
            {
              number: '68',
              name: 'Tyler Clark',
              position: '',
            },
            {
              number: '18',
              name: 'Antonio Gandy-Golden',
              position: '',
            },
            {
              number: '84',
              name: 'Kelvin Harmon',
              position: '',
            },
            {
              number: '25',
              name: 'D. J. Hayden',
              position: '',
            },
            {
              number: '74',
              name: 'Nolan Laufenberg',
              position: '',
            },
            {
              number: '19',
              name: 'Marken Michel',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '30',
              name: 'Troy Apke',
              position: 'CB',
            },
            {
              number: '53',
              name: 'Jon Bostic',
              position: 'MLB',
            },
            {
              number: '1',
              name: 'DeAndre Carter',
              position: 'WR',
            },
            {
              number: '64',
              name: 'Jamil Douglas',
              position: 'G',
            },
            {
              number: '14',
              name: 'Ryan Fitzpatrick',
              position: 'QB',
            },
            {
              number: '13',
              name: 'Adam Humphries',
              position: 'WR',
            },
            {
              number: '36',
              name: 'Danny Johnson',
              position: 'CB',
            },
            {
              number: '69',
              name: 'Tyler Larsen',
              position: 'C',
            },
            {
              number: '78',
              name: 'Cornelius Lucas',
              position: 'T',
            },
            {
              number: '20',
              name: 'Bobby McCain',
              position: 'FS',
            },
            {
              number: '41',
              name: 'J. D. McKissic',
              position: 'RB',
            },
            {
              number: '35',
              name: 'Torry McTyer',
              position: 'CB',
            },
            {
              number: '50',
              name: 'Jared Norris',
              position: 'LB',
            },
            {
              number: '50',
              name: 'Nate Orchard',
              position: 'DE',
            },
            {
              number: '34',
              name: 'Darryl Roberts',
              position: 'CB',
            },
            {
              number: '75',
              name: 'Brandon Scherff',
              position: 'G',
            },
            {
              number: '83',
              name: 'Ricky Seals-Jones',
              position: 'TE',
            },
            {
              number: '97',
              name: 'Tim Settle',
              position: 'DT',
            },
            {
              number: '11',
              name: 'Cam Sims',
              position: 'WR',
            },
          ],
          restrictedFAs: [
            {
              number: '8',
              name: 'Kyle Allen',
              position: 'QB',
            },
            {
              number: '19',
              name: 'Garrett Gilbert',
              position: 'QB',
            },
            {
              number: '3',
              name: 'Joey Slye',
              position: 'K',
            },
          ],
        },
        NewYorkGiants: {
          'datefebruary18, 2022': [],
          quarterbacks: [
            {
              number: '8',
              name: 'Daniel Jones',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '26',
              name: 'Saquon Barkley',
              position: null,
            },
            {
              number: '37',
              name: 'Gary Brightwell',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '19',
              name: 'Kenny Golladay',
              position: null,
            },
            {
              number: '15',
              name: 'Collin Johnson',
              position: null,
            },
            {
              number: '--',
              name: 'Austin Proehl',
              position: null,
            },
            {
              number: '3',
              name: 'Sterling Shepard',
              position: null,
            },
            {
              number: '86',
              name: 'Darius Slayton',
              position: null,
            },
            {
              number: '89',
              name: 'Kadarius Toney',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '44',
              name: 'Rysen John',
              position: null,
            },
            {
              number: '82',
              name: 'Kaden Smith',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '68',
              name: 'Ben Bredeson',
              position: 'G',
            },
            {
              number: '65',
              name: 'Nick Gates',
              position: 'C',
            },
            {
              number: '66',
              name: 'Shane Lemieux',
              position: 'G',
            },
            {
              number: '63',
              name: 'Wes Martin',
              position: 'G',
            },
            {
              number: '74',
              name: 'Matt Peart',
              position: 'T',
            },
            {
              number: '78',
              name: 'Andrew Thomas',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '91',
              name: 'Raymond Johnson',
              position: 'DE',
            },
            {
              number: '97',
              name: 'Dexter Lawrence',
              position: 'DE',
            },
            {
              number: '99',
              name: 'Leonard Williams',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '47',
              name: 'Cam Brown',
              position: 'ILB',
            },
            {
              number: '35',
              name: 'T. J. Brunson',
              position: 'ILB',
            },
            {
              number: '52',
              name: 'Carter Coughlin',
              position: 'ILB',
            },
            {
              number: '48',
              name: 'Tae Crowder',
              position: 'ILB',
            },
            {
              number: '46',
              name: 'Justin Hilliard',
              position: 'ILB',
            },
            {
              number: '54',
              name: 'Blake Martinez',
              position: 'ILB',
            },
            {
              number: '51',
              name: 'Azeez Ojulari',
              position: 'OLB',
            },
            {
              number: '95',
              name: 'Quincy Roche',
              position: 'OLB',
            },
            {
              number: '94',
              name: 'Elerson Smith',
              position: 'OLB',
            },
            {
              number: '53',
              name: 'Oshane Ximines',
              position: 'OLB',
            },
          ],
          defensiveBacks: [
            {
              number: '24',
              name: 'James Bradberry',
              position: 'CB',
            },
            {
              number: '30',
              name: 'Darnay Holmes',
              position: 'CB',
            },
            {
              number: '22',
              name: "Adoree' Jackson",
              position: 'CB',
            },
            {
              number: '20',
              name: 'Julian Love',
              position: 'FS',
            },
            {
              number: '29',
              name: 'Xavier McKinney',
              position: 'SS',
            },
            {
              number: '33',
              name: 'Aaron Robinson',
              position: 'CB',
            },
            {
              number: '23',
              name: 'Logan Ryan',
              position: 'FS',
            },
            {
              number: '25',
              name: 'Rodarius Williams',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '9',
              name: 'Riley Dixon',
              position: 'P',
            },
            {
              number: '5',
              name: 'Graham Gano',
              position: 'K',
            },
          ],
          reserveLists: [
            {
              number: '81',
              name: 'Alex Bachman',
              position: '',
            },
            {
              number: '44',
              name: 'Omari Cobb',
              position: '',
            },
            {
              number: '--',
              name: 'Jamie Gillan',
              position: '',
            },
            {
              number: '62',
              name: 'Devery Hamilton',
              position: '',
            },
            {
              number: '93',
              name: 'Trent Harris',
              position: '',
            },
            {
              number: '49',
              name: 'Jake Hausmann',
              position: '',
            },
            {
              number: '57',
              name: 'Niko Lalos',
              position: '',
            },
            {
              number: '6',
              name: 'Brian Lewerke',
              position: '',
            },
            {
              number: '96',
              name: 'David Moa',
              position: '',
            },
            {
              number: '13',
              name: 'Travis Toivonen',
              position: '',
            },
            {
              number: '--',
              name: 'Davis Webb',
              position: '',
            },
            {
              number: '--',
              name: 'Antonio Williams',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '59',
              name: 'Lorenzo Carter',
              position: 'OLB',
            },
            {
              number: '31',
              name: 'Keion Crossen',
              position: 'CB',
            },
            {
              number: '79',
              name: 'Korey Cunningham',
              position: 'T',
            },
            {
              number: '43',
              name: 'Nate Ebner',
              position: 'SS',
            },
            {
              number: '88',
              name: 'Evan Engram',
              position: 'TE',
            },
            {
              number: '2',
              name: 'Mike Glennon',
              position: 'QB',
            },
            {
              number: '71',
              name: 'Will Hernandez',
              position: 'G',
            },
            {
              number: '98',
              name: 'Austin Johnson',
              position: 'NT',
            },
            {
              number: '58',
              name: 'Casey Kreiter',
              position: 'LS',
            },
            {
              number: '49',
              name: 'Benardrick McKinney',
              position: 'ILB',
            },
            {
              number: '39',
              name: 'Elijhaa Penny',
              position: 'FB',
            },
            {
              number: '21',
              name: 'Jabrill Peppers',
              position: 'SS',
            },
            {
              number: '13',
              name: 'Dante Pettis',
              position: 'WR',
            },
            {
              number: '69',
              name: 'Billy Price',
              position: 'C',
            },
            {
              number: '55',
              name: 'Reggie Ragland',
              position: 'ILB',
            },
            {
              number: '12',
              name: 'John Ross',
              position: 'WR',
            },
            {
              number: '75',
              name: 'Danny Shelton',
              position: 'NT',
            },
            {
              number: '67',
              name: 'Matt Skura',
              position: 'G',
            },
            {
              number: '45',
              name: 'Jaylon Smith',
              position: 'ILB',
            },
            {
              number: '76',
              name: 'Nate Solder',
              position: 'T',
            },
            {
              number: '85',
              name: 'Levine Toilolo',
              position: 'TE',
            },
          ],
          restrictedFAs: [
            {
              number: '18',
              name: 'C. J. Board',
              position: 'WR',
            },
            {
              number: '36',
              name: 'Cullen Gillaspia',
              position: 'FB',
            },
            {
              number: '39',
              name: 'Joshua Kalu',
              position: 'FS',
            },
            {
              number: '38',
              name: 'Steven Parker',
              position: 'SS',
            },
          ],
        },
      },
      west: {
        SanFrancisco49ers: {
          'datefebruary19, 2022': [],
          quarterbacks: [
            {
              number: '10',
              name: 'Jimmy Garoppolo',
              position: null,
            },
            {
              number: '5',
              name: 'Trey Lance',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '44',
              name: 'Kyle Juszczyk',
              position: 'FB',
            },
            {
              number: '25',
              name: 'Elijah Mitchell',
              position: null,
            },
            {
              number: '28',
              name: 'Trey Sermon',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '11',
              name: 'Brandon Aiyuk',
              position: null,
            },
            {
              number: '19',
              name: 'Deebo Samuel',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '85',
              name: 'George Kittle',
              position: null,
            },
            {
              number: '89',
              name: 'Charlie Woerner',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '65',
              name: 'Aaron Banks',
              position: 'G',
            },
            {
              number: '50',
              name: 'Alex Mack',
              position: 'C',
            },
            {
              number: '69',
              name: 'Mike McGlinchey',
              position: 'T',
            },
            {
              number: '76',
              name: 'Jaylon Moore',
              position: 'T',
            },
            {
              number: '71',
              name: 'Trent Williams',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '91',
              name: 'Arik Armstead',
              position: 'DE',
            },
            {
              number: '97',
              name: 'Nick Bosa',
              position: 'DE',
            },
            {
              number: '56',
              name: 'Samson Ebukam',
              position: 'DE',
            },
            {
              number: '55',
              name: 'Dee Ford',
              position: 'DE',
            },
            {
              number: '99',
              name: 'Javon Kinlaw',
              position: 'DT',
            },
            {
              number: '92',
              name: 'Charles Omenihu',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '57',
              name: 'Dre Greenlaw',
              position: 'OLB',
            },
            {
              number: '54',
              name: 'Fred Warner',
              position: 'MLB',
            },
          ],
          defensiveBacks: [
            {
              number: '29',
              name: 'Talanoa Hufanga',
              position: 'SS',
            },
            {
              number: '38',
              name: 'Deommodore Lenoir',
              position: 'CB',
            },
            {
              number: '4',
              name: 'Emmanuel Moseley',
              position: 'CB',
            },
            {
              number: '20',
              name: 'Ambry Thomas',
              position: 'CB',
            },
            {
              number: '1',
              name: 'Jimmie Ward',
              position: 'FS',
            },
          ],
          specialTeams: [
            {
              number: '9',
              name: 'Robbie Gould',
              position: 'K',
            },
            {
              number: '46',
              name: 'Taybor Pepper',
              position: 'LS',
            },
            {
              number: '18',
              name: 'Mitch Wishnowsky',
              position: 'P',
            },
          ],
          reserveLists: [
            {
              number: '58',
              name: 'Alex Barrett',
              position: '',
            },
            {
              number: '77',
              name: 'Alfredo Gutiérrez',
              position: '',
            },
            {
              number: '40',
              name: 'Josh Hokit',
              position: '',
            },
            {
              number: '--',
              name: "Ka'dar Hollman",
              position: '',
            },
            {
              number: '84',
              name: 'Tanner Hudson',
              position: '',
            },
            {
              number: '--',
              name: 'KeeSean Johnson',
              position: '',
            },
            {
              number: '86',
              name: 'Austin Mack',
              position: '',
            },
            {
              number: '88',
              name: 'Jordan Matthews',
              position: '',
            },
            {
              number: '59',
              name: 'Curtis Robinson',
              position: '',
            },
            {
              number: '78',
              name: 'Chris Slayton',
              position: '',
            },
            {
              number: '83',
              name: 'Connor Wedington',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '17',
              name: 'Travis Benjamin',
              position: 'WR',
            },
            {
              number: '64',
              name: 'Jake Brendel',
              position: 'C',
            },
            {
              number: '49',
              name: 'Trenton Cannon',
              position: 'RB',
            },
            {
              number: '66',
              name: 'Tom Compton',
              position: 'G',
            },
            {
              number: '82',
              name: 'Ross Dwelley',
              position: 'TE',
            },
            {
              number: '36',
              name: 'Marcell Harris',
              position: 'MLB',
            },
            {
              number: '96',
              name: 'Maurice Hurst Jr.',
              position: 'DT',
            },
            {
              number: '13',
              name: 'Richie James',
              position: 'WR',
            },
            {
              number: '27',
              name: 'Dontae Johnson',
              position: 'CB',
            },
            {
              number: '93',
              name: 'D. J. Jones',
              position: 'DT',
            },
            {
              number: '98',
              name: 'Arden Key',
              position: 'DE',
            },
            {
              number: '31',
              name: 'Raheem Mostert',
              position: 'RB',
            },
            {
              number: '26',
              name: 'Josh Norman',
              position: 'CB',
            },
            {
              number: '6',
              name: 'Mohamed Sanu',
              position: 'WR',
            },
            {
              number: '81',
              name: 'Trent Sherfield',
              position: 'WR',
            },
            {
              number: '95',
              name: 'Kentavius Street',
              position: 'DT',
            },
            {
              number: '3',
              name: 'Jaquiski Tartt',
              position: 'SS',
            },
            {
              number: '75',
              name: 'Laken Tomlinson',
              position: 'G',
            },
            {
              number: '2',
              name: 'Jason Verrett',
              position: 'CB',
            },
            {
              number: '24',
              name: "K'Waun Williams",
              position: 'CB',
            },
            {
              number: '94',
              name: 'Jordan Willis',
              position: 'DE',
            },
            {
              number: '22',
              name: 'Jeff Wilson',
              position: 'RB',
            },
            {
              number: '32',
              name: 'Tavon Wilson',
              position: 'SS',
            },
          ],
          restrictedFAs: [
            {
              number: '51',
              name: 'Azeez Al-Shaair',
              position: 'OLB',
            },
            {
              number: '60',
              name: 'Daniel Brunskill',
              position: 'G',
            },
          ],
        },
        LosAngelesRams: {
          quarterbacks: [
            {
              number: '16',
              name: 'Bryce Perkins',
              position: null,
            },
            {
              number: '9',
              name: 'Matthew Stafford',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '23',
              name: 'Cam Akers',
              position: null,
            },
            {
              number: '30',
              name: 'Raymond Calais',
              position: null,
            },
            {
              number: '34',
              name: 'Jake Funk',
              position: null,
            },
            {
              number: '27',
              name: 'Darrell Henderson',
              position: null,
            },
            {
              number: '25',
              name: 'Xavier Jones',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '15',
              name: 'Tutu Atwell',
              position: null,
            },
            {
              number: '87',
              name: 'Jacob Harris',
              position: null,
            },
            {
              number: '12',
              name: 'Van Jefferson',
              position: null,
            },
            {
              number: '10',
              name: 'Cooper Kupp',
              position: null,
            },
            {
              number: '18',
              name: 'Ben Skowronek',
              position: null,
            },
            {
              number: '2',
              name: 'Robert Woods',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '86',
              name: 'Kendall Blanton',
              position: null,
            },
            {
              number: '89',
              name: 'Tyler Higbee',
              position: null,
            },
            {
              number: '88',
              name: 'Brycen Hopkins',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '72',
              name: 'Tremayne Anchrum',
              position: 'G',
            },
            {
              number: '73',
              name: 'David Edwards',
              position: 'G',
            },
            {
              number: '71',
              name: 'Bobby Evans',
              position: 'T',
            },
            {
              number: '79',
              name: 'Rob Havenstein',
              position: 'T',
            },
            {
              number: '68',
              name: 'Alaric Jackson',
              position: 'T',
            },
            {
              number: '77',
              name: 'Andrew Whitworth',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '95',
              name: 'Bobby Brown III',
              position: 'NT',
            },
            {
              number: '93',
              name: 'Marquise Copeland',
              position: 'DT',
            },
            {
              number: '99',
              name: 'Aaron Donald',
              position: 'DT',
            },
            {
              number: '91',
              name: 'Greg Gaines',
              position: 'NT',
            },
            {
              number: '96',
              name: 'Michael Hoecht',
              position: 'DE',
            },
            {
              number: '94',
              name: "A'Shawn Robinson",
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '54',
              name: 'Leonard Floyd',
              position: 'OLB',
            },
            {
              number: '48',
              name: 'Chris Garrett',
              position: 'OLB',
            },
            {
              number: '58',
              name: 'Justin Hollins',
              position: 'OLB',
            },
            {
              number: '50',
              name: 'Ernest Jones',
              position: 'ILB',
            },
            {
              number: '52',
              name: 'Terrell Lewis',
              position: 'OLB',
            },
            {
              number: '56',
              name: 'Christian Rozeboom',
              position: 'ILB',
            },
          ],
          defensiveBacks: [
            {
              number: '26',
              name: 'Terrell Burgess',
              position: 'FS',
            },
            {
              number: '4',
              name: 'Jordan Fuller',
              position: 'SS',
            },
            {
              number: '43',
              name: 'Jake Gervase',
              position: 'FS',
            },
            {
              number: '46',
              name: 'Grant Haley',
              position: 'CB',
            },
            {
              number: '22',
              name: 'David Long',
              position: 'CB',
            },
            {
              number: '5',
              name: 'Jalen Ramsey',
              position: 'CB',
            },
            {
              number: '24',
              name: 'Taylor Rapp',
              position: 'FS',
            },
            {
              number: '31',
              name: 'Robert Rochell',
              position: 'CB',
            },
            {
              number: '33',
              name: 'Nick Scott',
              position: 'SS',
            },
          ],
          specialTeams: [
            {
              number: '6',
              name: 'Johnny Hekker',
              position: 'P',
            },
            {
              number: '42',
              name: 'Matthew Orzech',
              position: 'LS',
            },
          ],
          reserveLists: [
            {
              number: '84',
              name: 'Landen Akers',
              position: '',
            },
            {
              number: '67',
              name: 'Chandler Brewer',
              position: '',
            },
            {
              number: '39',
              name: 'Antoine Brooks',
              position: '',
            },
            {
              number: '90',
              name: 'Earnest Brown IV',
              position: '',
            },
            {
              number: '76',
              name: 'Adrian Ealy',
              position: '',
            },
            {
              number: '37',
              name: 'Tyler Hall',
              position: '',
            },
            {
              number: '14',
              name: 'Javian Hawkins',
              position: '',
            },
            {
              number: '61',
              name: 'Drake Jackson',
              position: '',
            },
            {
              number: '83',
              name: 'Warren Jackson',
              position: '',
            },
            {
              number: '60',
              name: 'Jeremiah Kolone',
              position: '',
            },
            {
              number: '17',
              name: 'J. J. Koski',
              position: '',
            },
            {
              number: '47',
              name: 'Kyle Markway',
              position: '',
            },
            {
              number: '35',
              name: 'Kareem Orr',
              position: '',
            },
            {
              number: '66',
              name: 'Max Pircher',
              position: '',
            },
            {
              number: '92',
              name: 'Jonah Williams',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '55',
              name: 'Brian Allen',
              position: 'C',
            },
            {
              number: '3',
              name: 'Odell Beckham Jr.',
              position: 'WR',
            },
            {
              number: '63',
              name: 'Austin Corbett',
              position: 'G',
            },
            {
              number: '21',
              name: 'Donte Deayon',
              position: 'CB',
            },
            {
              number: '38',
              name: 'Buddy Howell',
              position: 'RB',
            },
            {
              number: '69',
              name: 'Sebastian Joseph-Day',
              position: 'NT',
            },
            {
              number: '25',
              name: 'Sony Michel',
              position: 'RB',
            },
            {
              number: '40',
              name: 'Von Miller',
              position: 'OLB',
            },
            {
              number: '82',
              name: 'Johnny Mundt',
              position: 'TE',
            },
            {
              number: '70',
              name: 'Joseph Noteboom',
              position: 'OT',
            },
            {
              number: '45',
              name: 'Ogbonnia Okoronkwo',
              position: 'OLB',
            },
            {
              number: '19',
              name: 'Brandon Powell',
              position: 'WR',
            },
            {
              number: '11',
              name: 'Darious Williams',
              position: 'CB',
            },
          ],
          restrictedFAs: [
            {
              number: '64',
              name: 'Jamil Demby',
              position: 'G',
            },
            {
              number: '8',
              name: 'Matt Gay',
              position: 'K',
            },
            {
              number: '32',
              name: 'Travin Howard',
              position: 'ILB',
            },
            {
              number: '51',
              name: 'Troy Reeder',
              position: 'ILB',
            },
            {
              number: '65',
              name: 'Coleman Shelton',
              position: 'C',
            },
          ],
        },
        ArizonaCardinals: {
          'datefebruary18, 2022': [],
          quarterbacks: [
            {
              number: '19',
              name: 'Trace McSorley',
              position: null,
            },
            {
              number: '1',
              name: 'Kyler Murray',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '26',
              name: 'Eno Benjamin',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '83',
              name: 'Greg Dortch',
              position: null,
            },
            {
              number: '10',
              name: 'DeAndre Hopkins',
              position: null,
            },
            {
              number: '17',
              name: 'Andy Isabella',
              position: null,
            },
            {
              number: '4',
              name: 'Rondale Moore',
              position: null,
            },
          ],
          tightEnds: [],
          offensiveLinemen: [
            {
              number: '68',
              name: 'Kelvin Beachum',
              position: 'T',
            },
            {
              number: '64',
              name: 'Sean Harlow',
              position: 'G',
            },
            {
              number: '53',
              name: 'Marcus Henry',
              position: 'C',
            },
            {
              number: '61',
              name: 'Rodney Hudson',
              position: 'C',
            },
            {
              number: '74',
              name: 'D. J. Humphries',
              position: 'T',
            },
            {
              number: '79',
              name: 'Josh Jones',
              position: 'T',
            },
            {
              number: '66',
              name: 'Joshua Miles',
              position: 'T',
            },
            {
              number: '71',
              name: 'Justin Murray',
              position: 'T',
            },
            {
              number: '67',
              name: 'Justin Pugh',
              position: 'G',
            },
          ],
          defensiveLinemen: [
            {
              number: '94',
              name: 'Zach Allen',
              position: 'DE',
            },
            {
              number: '95',
              name: 'Leki Fotu',
              position: 'NT',
            },
            {
              number: '90',
              name: 'Rashard Lawrence',
              position: 'NT',
            },
            {
              number: '97',
              name: 'Jordan Phillips',
              position: 'DE',
            },
            {
              number: '99',
              name: 'J. J. Watt',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '25',
              name: 'Zaven Collins',
              position: 'ILB',
            },
            {
              number: '52',
              name: 'Victor Dimukeje',
              position: 'OLB',
            },
            {
              number: '44',
              name: 'Markus Golden',
              position: 'OLB',
            },
            {
              number: '58',
              name: 'Jordan Hicks',
              position: 'ILB',
            },
            {
              number: '42',
              name: 'Devon Kennard',
              position: 'OLB',
            },
            {
              number: '9',
              name: 'Isaiah Simmons',
              position: 'ILB',
            },
            {
              number: '51',
              name: 'Tanner Vallejo',
              position: 'ILB',
            },
          ],
          defensiveBacks: [
            {
              number: '3',
              name: 'Budda Baker',
              position: 'FS',
            },
            {
              number: '7',
              name: 'Byron Murphy',
              position: 'CB',
            },
            {
              number: '22',
              name: 'Deionte Thompson',
              position: 'SS',
            },
            {
              number: '34',
              name: 'Jalen Thompson',
              position: 'SS',
            },
            {
              number: '38',
              name: 'James Wiggins',
              position: 'FS',
            },
            {
              number: '20',
              name: 'Marco Wilson',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '5',
              name: 'Matt Prater',
              position: 'K',
            },
          ],
          reserveLists: [
            {
              number: '82',
              name: 'Andre Baccellia',
              position: '',
            },
            {
              number: '21',
              name: 'Breon Borders',
              position: '',
            },
            {
              number: '37',
              name: 'Nate Brooks',
              position: '',
            },
            {
              number: '--',
              name: 'Nolan Cooney',
              position: '',
            },
            {
              number: '56',
              name: 'Matt Dickerson',
              position: '',
            },
            {
              number: '36',
              name: 'Alex Ellis',
              position: '',
            },
            {
              number: '32',
              name: 'Javon Hagan',
              position: '',
            },
            {
              number: '63',
              name: 'Danny Isidora',
              position: '',
            },
            {
              number: '93',
              name: 'Jonathan Ledbetter',
              position: '',
            },
            {
              number: '60',
              name: 'Koda Martin',
              position: '',
            },
            {
              number: '--',
              name: 'Jaylen Samuels',
              position: '',
            },
            {
              number: '80',
              name: 'Bernhard Seikovits',
              position: '',
            },
            {
              number: '72',
              name: 'Eric Smith',
              position: '',
            },
            {
              number: '59',
              name: 'Joe Walker',
              position: '',
            },
            {
              number: '41',
              name: 'David Wells',
              position: '',
            },
            {
              number: '39',
              name: 'Jace Whittaker',
              position: '',
            },
            {
              number: '--',
              name: 'Deon Yelder',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '23',
              name: 'Robert Alford',
              position: 'CB',
            },
            {
              number: '31',
              name: 'Chris Banjo',
              position: 'SS',
            },
            {
              number: '46',
              name: 'Aaron Brewer',
              position: 'LS',
            },
            {
              number: '6',
              name: 'James Conner',
              position: 'RB',
            },
            {
              number: '69',
              name: 'Jack Crawford',
              position: 'DE',
            },
            {
              number: '81',
              name: 'Darrell Daniels',
              position: 'TE',
            },
            {
              number: '2',
              name: 'Chase Edmonds',
              position: 'RB',
            },
            {
              number: '86',
              name: 'Zach Ertz',
              position: 'TE',
            },
            {
              number: '73',
              name: 'Max Garcia',
              position: 'G',
            },
            {
              number: '45',
              name: 'Dennis Gardeck',
              position: 'OLB',
            },
            {
              number: '18',
              name: 'A. J. Green',
              position: 'WR',
            },
            {
              number: '33',
              name: 'Antonio Hamilton',
              position: 'CB',
            },
            {
              number: '84',
              name: 'Demetrius Harris',
              position: 'TE',
            },
            {
              number: '55',
              name: 'Chandler Jones',
              position: 'OLB',
            },
            {
              number: '13',
              name: 'Christian Kirk',
              position: 'WR',
            },
            {
              number: '14',
              name: 'Andy Lee',
              position: 'P',
            },
            {
              number: '12',
              name: 'Colt McCoy',
              position: 'QB',
            },
            {
              number: '98',
              name: 'Corey Peters',
              position: 'NT',
            },
            {
              number: '47',
              name: 'Ezekiel Turner',
              position: 'ILB',
            },
            {
              number: '28',
              name: 'Charles Washington',
              position: 'FS',
            },
            {
              number: '87',
              name: 'Maxx Williams',
              position: 'TE',
            },
          ],
          restrictedFAs: [
            {
              number: '91',
              name: 'Michael Dogbe',
              position: 'DE',
            },
            {
              number: '49',
              name: 'Kylie Fitts',
              position: 'OLB',
            },
          ],
          'exclusive-rightsFAs': [
            {
              number: '29',
              name: 'Jonathan Ward',
              position: 'RB',
            },
            {
              number: '85',
              name: 'Antoine Wesley',
              position: 'WR',
            },
          ],
        },
        SeattleSeahawks: {
          'datefebruary18, 2022': [],
          quarterbacks: [
            {
              number: '17',
              name: 'Jacob Eason',
              position: null,
            },
            {
              number: '3',
              name: 'Russell Wilson',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '44',
              name: 'Nick Bellore',
              position: 'FB',
            },
            {
              number: '32',
              name: 'Chris Carson',
              position: null,
            },
            {
              number: '31',
              name: 'DeeJay Dallas',
              position: null,
            },
            {
              number: '25',
              name: 'Travis Homer',
              position: null,
            },
            {
              number: '34',
              name: 'Josh Johnson',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '1',
              name: "D'Wayne Eskridge",
              position: null,
            },
            {
              number: '16',
              name: 'Tyler Lockett',
              position: null,
            },
            {
              number: '14',
              name: 'DK Metcalf',
              position: null,
            },
            {
              number: '18',
              name: 'Freddie Swain',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '85',
              name: 'Tyler Mabry',
              position: null,
            },
            {
              number: '84',
              name: 'Colby Parkinson',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '74',
              name: 'Jake Curhan',
              position: 'T',
            },
            {
              number: '78',
              name: 'Stone Forsythe',
              position: 'T',
            },
            {
              number: '66',
              name: 'Gabe Jackson',
              position: 'G',
            },
            {
              number: '68',
              name: 'Damien Lewis',
              position: 'G',
            },
          ],
          defensiveLinemen: [
            {
              number: '91',
              name: 'L. J. Collier',
              position: 'DE',
            },
            {
              number: '8',
              name: 'Carlos Dunlap',
              position: 'DE',
            },
            {
              number: '97',
              name: 'Poona Ford',
              position: 'DT',
            },
            {
              number: '51',
              name: 'Kerry Hyder',
              position: 'DE',
            },
            {
              number: '10',
              name: 'Benson Mayowa',
              position: 'DE',
            },
            {
              number: '98',
              name: 'Alton Robinson',
              position: 'DE',
            },
            {
              number: '52',
              name: 'Darrell Taylor',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '57',
              name: 'Cody Barton',
              position: 'MLB',
            },
            {
              number: '56',
              name: 'Jordyn Brooks',
              position: 'OLB',
            },
            {
              number: '55',
              name: 'Ben Burr-Kirven',
              position: 'OLB',
            },
            {
              number: '54',
              name: 'Bobby Wagner',
              position: 'MLB',
            },
          ],
          defensiveBacks: [
            {
              number: '33',
              name: 'Jamal Adams',
              position: 'SS',
            },
            {
              number: '28',
              name: 'Ugo Amadi',
              position: 'FS',
            },
            {
              number: '27',
              name: 'Marquise Blair',
              position: 'SS',
            },
            {
              number: '22',
              name: 'Tre Brown',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '4',
              name: 'Michael Dickson',
              position: 'P',
            },
            {
              number: '5',
              name: 'Jason Myers',
              position: 'K',
            },
            {
              number: '69',
              name: 'Tyler Ott',
              position: 'LS',
            },
          ],
          reserveLists: [
            {
              number: '67',
              name: 'Myles Adams',
              position: '',
            },
            {
              number: '87',
              name: 'Matt Cole',
              position: '',
            },
            {
              number: '43',
              name: 'Aaron Donkor',
              position: '',
            },
            {
              number: '75',
              name: 'Greg Eiland',
              position: '',
            },
            {
              number: '13',
              name: 'Aaron Fuller',
              position: '',
            },
            {
              number: '62',
              name: 'Jarrod Hewitt',
              position: '',
            },
            {
              number: '30',
              name: 'Mike Jackson Sr.',
              position: '',
            },
            {
              number: '88',
              name: 'Cade Johnson',
              position: '',
            },
            {
              number: '42',
              name: 'Josh Jones',
              position: '',
            },
            {
              number: '62',
              name: 'Pier-Olivier Lestage',
              position: '',
            },
            {
              number: '48',
              name: 'Edmond Robinson',
              position: '',
            },
            {
              number: '79',
              name: 'Niles Scott',
              position: '',
            },
            {
              number: '58',
              name: 'Alex Tchangam',
              position: '',
            },
            {
              number: '11',
              name: 'Cody Thompson',
              position: '',
            },
            {
              number: '--',
              name: 'Darwin Thompson',
              position: '',
            },
            {
              number: '47',
              name: 'Lakiem Williams',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '76',
              name: 'Duane Brown',
              position: 'T',
            },
            {
              number: '41',
              name: 'Alex Collins',
              position: 'RB',
            },
            {
              number: '6',
              name: 'Quandre Diggs',
              position: 'FS',
            },
            {
              number: '89',
              name: 'Will Dissly',
              position: 'TE',
            },
            {
              number: '81',
              name: 'Gerald Everett',
              position: 'TE',
            },
            {
              number: '94',
              name: 'Rasheem Green',
              position: 'DE',
            },
            {
              number: '73',
              name: 'Jamarco Jones',
              position: 'T',
            },
            {
              number: '23',
              name: 'Sidney Jones',
              position: 'CB',
            },
            {
              number: '92',
              name: 'Robert Nkemdiche',
              position: 'DE',
            },
            {
              number: '20',
              name: 'Rashaad Penny',
              position: 'RB',
            },
            {
              number: '77',
              name: 'Ethan Pocic',
              position: 'C',
            },
            {
              number: '2',
              name: 'D. J. Reed',
              position: 'CB',
            },
            {
              number: '72',
              name: 'Brandon Shell',
              position: 'T',
            },
            {
              number: '7',
              name: 'Geno Smith',
              position: 'QB',
            },
            {
              number: '99',
              name: 'Al Woods',
              position: 'DT',
            },
          ],
          restrictedFAs: [
            {
              number: '36',
              name: 'Blessuan Austin',
              position: 'CB',
            },
            {
              number: '61',
              name: 'Kyle Fuller',
              position: 'C',
            },
            {
              number: '60',
              name: 'Phil Haynes',
              position: 'G',
            },
          ],
        },
      },
    },
    afc: {
      north: {
        BaltimoreRavens: {
          quarterbacks: [
            {
              number: '8',
              name: 'Lamar Jackson',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '27',
              name: 'J. K. Dobbins',
              position: null,
            },
            {
              number: '35',
              name: 'Gus Edwards',
              position: null,
            },
            {
              number: '43',
              name: 'Justice Hill',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '12',
              name: 'Rashod Bateman',
              position: null,
            },
            {
              number: '80',
              name: 'Miles Boykin',
              position: null,
            },
            {
              number: '5',
              name: 'Marquise Brown',
              position: null,
            },
            {
              number: '13',
              name: 'Devin Duvernay',
              position: null,
            },
            {
              number: '11',
              name: 'James Proche',
              position: null,
            },
            {
              number: '16',
              name: 'Tylan Wallace',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '89',
              name: 'Mark Andrews',
              position: null,
            },
            {
              number: '86',
              name: 'Nick Boyle',
              position: null,
            },
            {
              number: '84',
              name: 'Josh Oliver',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '66',
              name: 'Ben Cleveland',
              position: 'G',
            },
            {
              number: '76',
              name: "Ja'Wuan James",
              position: 'T',
            },
            {
              number: '65',
              name: 'Patrick Mekari',
              position: 'T',
            },
            {
              number: '74',
              name: 'Tyre Phillips',
              position: 'G',
            },
            {
              number: '72',
              name: 'Ben Powers',
              position: 'G',
            },
            {
              number: '79',
              name: 'Ronnie Stanley',
              position: 'T',
            },
            {
              number: '78',
              name: 'Alejandro Villanueva',
              position: 'T',
            },
            {
              number: '70',
              name: 'Kevin Zeitler',
              position: 'G',
            },
          ],
          defensiveLinemen: [
            {
              number: '91',
              name: 'Xavier Kelly',
              position: 'NT',
            },
            {
              number: '92',
              name: 'Justin Madubuike',
              position: 'DE',
            },
            {
              number: '96',
              name: 'Broderick Washington Jr.',
              position: 'DE',
            },
            {
              number: '95',
              name: 'Derek Wolfe',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '54',
              name: 'Tyus Bowser',
              position: 'OLB',
            },
            {
              number: '45',
              name: 'Jaylon Ferguson',
              position: 'OLB',
            },
            {
              number: '40',
              name: 'Malik Harrison',
              position: 'ILB',
            },
            {
              number: '59',
              name: 'Daelin Hayes',
              position: 'OLB',
            },
            {
              number: '99',
              name: 'Odafe Oweh',
              position: 'OLB',
            },
            {
              number: '6',
              name: 'Patrick Queen',
              position: 'ILB',
            },
          ],
          defensiveBacks: [
            {
              number: '36',
              name: 'Chuck Clark',
              position: 'SS',
            },
            {
              number: '44',
              name: 'Marlon Humphrey',
              position: 'CB',
            },
            {
              number: '31',
              name: 'Tony Jefferson',
              position: 'SS',
            },
            {
              number: '37',
              name: 'Iman Marshall',
              position: 'CB',
            },
            {
              number: '24',
              name: 'Marcus Peters',
              position: 'CB',
            },
            {
              number: '38',
              name: 'Kevon Seymour',
              position: 'CB',
            },
            {
              number: '21',
              name: 'Brandon Stephens',
              position: 'FS',
            },
            {
              number: '29',
              name: "Ar'Darius Washington",
              position: 'FS',
            },
            {
              number: '25',
              name: 'Tavon Young',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '4',
              name: 'Sam Koch',
              position: 'P',
            },
            {
              number: '9',
              name: 'Justin Tucker',
              position: 'K',
            },
          ],
          reserveLists: [
            {
              number: '17',
              name: 'Robert Jackson',
              position: '',
            },
            {
              number: '61',
              name: 'Jaryd Jones-Smith',
              position: '',
            },
            {
              number: '94',
              name: 'Isaiah Mack',
              position: '',
            },
            {
              number: '––',
              name: 'Ben Mason',
              position: '',
            },
            {
              number: '47',
              name: 'Nate McCrary',
              position: '',
            },
            {
              number: '69',
              name: 'Kahlil McKenzie',
              position: '',
            },
            {
              number: '10',
              name: 'Jaylon Moore',
              position: '',
            },
            {
              number: '67',
              name: 'Jimmy Murray',
              position: '',
            },
            {
              number: '83',
              name: 'Tony Poljan',
              position: '',
            },
            {
              number: '18',
              name: 'Kevin Toliver',
              position: '',
            },
            {
              number: '81',
              name: 'Binjimen Victor',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '23',
              name: 'Anthony Averett',
              position: 'CB',
            },
            {
              number: '49',
              name: 'Chris Board',
              position: 'MLB',
            },
            {
              number: '77',
              name: 'Bradley Bozeman',
              position: 'C',
            },
            {
              number: '56',
              name: 'Josh Bynes',
              position: 'ILB',
            },
            {
              number: '93',
              name: 'Calais Campbell',
              position: 'DE',
            },
            {
              number: '32',
              name: 'DeShon Elliott',
              position: 'FS',
            },
            {
              number: '71',
              name: 'Justin Ellis',
              position: 'NT',
            },
            {
              number: '3',
              name: 'L. J. Fort',
              position: 'ILB',
            },
            {
              number: '33',
              name: 'Devonta Freeman',
              position: 'RB',
            },
            {
              number: '50',
              name: 'Justin Houston',
              position: 'OLB',
            },
            {
              number: '15',
              name: 'Josh Johnson',
              position: 'QB',
            },
            {
              number: '90',
              name: 'Pernell McPhee',
              position: 'OLB',
            },
            {
              number: '28',
              name: 'Latavius Murray',
              position: 'RB',
            },
            {
              number: '42',
              name: 'Patrick Ricard',
              position: '',
            },
            {
              number: '62',
              name: 'David Sharpe',
              position: 'OT',
            },
            {
              number: '22',
              name: 'Jimmy Smith',
              position: 'CB',
            },
            {
              number: '85',
              name: 'Eric Tomlinson',
              position: 'TE',
            },
            {
              number: '14',
              name: 'Sammy Watkins',
              position: 'WR',
            },
            {
              number: '98',
              name: 'Brandon Williams',
              position: 'NT',
            },
          ],
          restrictedFAs: [
            {
              number: '51',
              name: 'Otaro Alaka',
              position: 'MLB',
            },
            {
              number: '30',
              name: 'Chris Westry',
              position: 'CB',
            },
          ],
          'exclusive-rightsFAs': [
            {
              number: '63',
              name: 'Trystan Colon',
              position: 'C',
            },
            {
              number: '97',
              name: 'Aaron Crawford',
              position: 'DE',
            },
            {
              number: '31',
              name: 'Khalil Dorsey',
              position: 'CB',
            },
            {
              number: '2',
              name: 'Tyler Huntley',
              position: 'QB',
            },
            {
              number: '––',
              name: 'Brandon Knight',
              position: 'OT',
            },
            {
              number: '46',
              name: 'Nick Moore',
              position: 'LS',
            },
            {
              number: '26',
              name: 'Geno Stone',
              position: 'SS',
            },
            {
              number: '57',
              name: 'Kristian Welch',
              position: 'ILB',
            },
            {
              number: '34',
              name: "Ty'Son Williams",
              position: 'RB',
            },
          ],
        },
        CincinnatiBengals: {
          'datefebruary23, 2022': [],
          quarterbacks: [
            {
              number: '9',
              name: 'Joe Burrow',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '25',
              name: 'Chris Evans',
              position: null,
            },
            {
              number: '28',
              name: 'Joe Mixon',
              position: null,
            },
            {
              number: '34',
              name: 'Samaje Perine',
              position: null,
            },
            {
              number: '32',
              name: 'Trayveon Williams',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '83',
              name: 'Tyler Boyd',
              position: null,
            },
            {
              number: '1',
              name: "Ja'Marr Chase",
              position: null,
            },
            {
              number: '85',
              name: 'Tee Higgins',
              position: null,
            },
            {
              number: '11',
              name: 'Trent Taylor',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '89',
              name: 'Drew Sample',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '77',
              name: 'Hakeem Adeniji',
              position: 'G',
            },
            {
              number: '79',
              name: 'Jackson Carman',
              position: 'G',
            },
            {
              number: '63',
              name: 'Trey Hill',
              position: 'C',
            },
            {
              number: '66',
              name: 'Trey Hopkins',
              position: 'C',
            },
            {
              number: '75',
              name: 'Isaiah Prince',
              position: 'T',
            },
            {
              number: '70',
              name: "D'Ante Smith",
              position: 'T',
            },
            {
              number: '73',
              name: 'Jonah Williams',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '91',
              name: 'Trey Hendrickson',
              position: 'DE',
            },
            {
              number: '94',
              name: 'Sam Hubbard',
              position: 'DE',
            },
            {
              number: '56',
              name: 'Wyatt Hubert',
              position: 'DE',
            },
            {
              number: '90',
              name: 'Khalid Kareem',
              position: 'DE',
            },
            {
              number: '58',
              name: 'Joseph Ossai',
              position: 'DE',
            },
            {
              number: '98',
              name: 'D. J. Reader',
              position: 'DT',
            },
            {
              number: '96',
              name: 'Cameron Sample',
              position: 'DE',
            },
            {
              number: '99',
              name: 'Tyler Shelvin',
              position: 'DT',
            },
          ],
          linebackers: [
            {
              number: '51',
              name: 'Markus Bailey',
              position: 'MLB',
            },
            {
              number: '59',
              name: 'Akeem Davis-Gaither',
              position: 'OLB',
            },
            {
              number: '47',
              name: 'Keandre Jones',
              position: 'OLB',
            },
            {
              number: '57',
              name: 'Germaine Pratt',
              position: 'OLB',
            },
            {
              number: '55',
              name: 'Logan Wilson',
              position: 'MLB',
            },
          ],
          defensiveBacks: [
            {
              number: '22',
              name: 'Chidobe Awuzie',
              position: 'CB',
            },
            {
              number: '24',
              name: 'Vonn Bell',
              position: 'SS',
            },
            {
              number: '21',
              name: 'Mike Hilton',
              position: 'CB',
            },
            {
              number: '26',
              name: 'Trae Waynes',
              position: 'CB',
            },
            {
              number: '40',
              name: 'Brandon Wilson',
              position: 'FS',
            },
          ],
          specialTeams: [
            {
              number: '2',
              name: 'Evan McPherson',
              position: 'K',
            },
          ],
          reserveLists: [
            {
              number: '39',
              name: 'John Brannon',
              position: '',
            },
            {
              number: '6',
              name: 'Jake Browning',
              position: '',
            },
            {
              number: '4',
              name: 'Drue Chrisman',
              position: '',
            },
            {
              number: '61',
              name: 'Lamont Gaillard',
              position: '',
            },
            {
              number: '41',
              name: 'Trayvon Henderson',
              position: '',
            },
            {
              number: '36',
              name: 'Elijah Holyfield',
              position: '',
            },
            {
              number: '81',
              name: 'Thaddeus Moss',
              position: '',
            },
            {
              number: '52',
              name: 'Noah Spence',
              position: '',
            },
            {
              number: '82',
              name: 'Scotty Washington',
              position: '',
            },
            {
              number: '12',
              name: 'Pooka Williams Jr.',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '8',
              name: 'Brandon Allen',
              position: 'QB',
            },
            {
              number: '20',
              name: 'Eli Apple',
              position: 'CB',
            },
            {
              number: '30',
              name: 'Jessie Bates',
              position: 'FS',
            },
            {
              number: '50',
              name: 'Jordan Evans',
              position: 'OLB',
            },
            {
              number: '33',
              name: 'Tre Flowers',
              position: 'CB',
            },
            {
              number: '29',
              name: 'Vernon Hargreaves',
              position: 'CB',
            },
            {
              number: '46',
              name: 'Clark Harris',
              position: 'LS',
            },
            {
              number: '92',
              name: 'B. J. Hill',
              position: 'DT',
            },
            {
              number: '10',
              name: 'Kevin Huber',
              position: 'P',
            },
            {
              number: '69',
              name: 'Zach Kerr',
              position: 'DT',
            },
            {
              number: '65',
              name: 'Larry Ogunjobi',
              position: 'DT',
            },
            {
              number: '23',
              name: 'Darius Phillips',
              position: 'CB',
            },
            {
              number: '71',
              name: 'Riley Reiff',
              position: 'T',
            },
            {
              number: '67',
              name: 'Quinton Spain',
              position: 'G',
            },
            {
              number: '19',
              name: 'Auden Tate',
              position: 'WR',
            },
            {
              number: '31',
              name: 'Michael Thomas',
              position: 'SS',
            },
            {
              number: '80',
              name: 'Mike Thomas',
              position: 'WR',
            },
            {
              number: '68',
              name: 'Josh Tupou',
              position: 'DT',
            },
            {
              number: '87',
              name: 'C. J. Uzomah',
              position: 'TE',
            },
          ],
          restrictedFAs: [
            {
              number: '74',
              name: 'Fred Johnson',
              position: 'G',
            },
            {
              number: '17',
              name: 'Stanley Morgan Jr.',
              position: 'WR',
            },
          ],
        },
        ClevelandBrowns: {
          'datefebruary1, 2022': [],
          quarterbacks: [
            {
              number: '5',
              name: 'Case Keenum',
              position: null,
            },
            {
              number: '6',
              name: 'Baker Mayfield',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '24',
              name: 'Nick Chubb',
              position: null,
            },
            {
              number: '25',
              name: 'Demetric Felton',
              position: null,
            },
            {
              number: '37',
              name: 'Tre Harbison',
              position: null,
            },
            {
              number: '27',
              name: 'Kareem Hunt',
              position: null,
            },
            {
              number: '31',
              name: 'Andy Janovich',
              position: 'FB',
            },
          ],
          wideReceivers: [
            {
              number: '80',
              name: 'Jarvis Landry',
              position: null,
            },
            {
              number: '11',
              name: 'Donovan Peoples-Jones',
              position: null,
            },
            {
              number: '10',
              name: 'Anthony Schwartz',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '88',
              name: 'Harrison Bryant',
              position: null,
            },
            {
              number: '81',
              name: 'Austin Hooper',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '75',
              name: 'Joel Bitonio',
              position: 'G',
            },
            {
              number: '78',
              name: 'Jack Conklin',
              position: 'T',
            },
            {
              number: '79',
              name: 'Drew Forbes',
              position: 'G',
            },
            {
              number: '53',
              name: 'Nick Harris',
              position: 'C',
            },
            {
              number: '66',
              name: 'James Hudson',
              position: 'T',
            },
            {
              number: '77',
              name: 'Wyatt Teller',
              position: 'G',
            },
            {
              number: '64',
              name: 'JC Tretter',
              position: 'C',
            },
            {
              number: '71',
              name: 'Jedrick Wills',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '96',
              name: 'Jordan Elliott',
              position: 'DT',
            },
            {
              number: '95',
              name: 'Myles Garrett',
              position: 'DE',
            },
            {
              number: '93',
              name: 'Tommy Togiai',
              position: 'DT',
            },
          ],
          linebackers: [
            {
              number: '42',
              name: 'Tony Fields II',
              position: 'OLB',
            },
            {
              number: '28',
              name: 'Jeremiah Owusu-Koramoah',
              position: 'OLB',
            },
            {
              number: '50',
              name: 'Jacob Phillips',
              position: 'MLB',
            },
            {
              number: '44',
              name: 'Sione Takitaki',
              position: 'OLB',
            },
            {
              number: '51',
              name: 'Mack Wilson',
              position: 'OLB',
            },
          ],
          defensiveBacks: [
            {
              number: '22',
              name: 'Grant Delpit',
              position: 'SS',
            },
            {
              number: '38',
              name: 'A. J. Green',
              position: 'CB',
            },
            {
              number: '23',
              name: 'Troy Hill',
              position: 'CB',
            },
            {
              number: '43',
              name: 'John Johnson',
              position: 'FS',
            },
            {
              number: '39',
              name: 'Richard LeCounte',
              position: 'FS',
            },
            {
              number: '20',
              name: 'Greg Newsome II',
              position: 'CB',
            },
            {
              number: '21',
              name: 'Denzel Ward',
              position: 'CB',
            },
            {
              number: '26',
              name: 'Greedy Williams',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '47',
              name: 'Charley Hughlett',
              position: 'LS',
            },
          ],
          reserveLists: [
            {
              number: '12',
              name: 'Chris Blewitt',
              position: '',
            },
            {
              number: '--',
              name: 'Joseph Charlton',
              position: '',
            },
            {
              number: '86',
              name: 'Miller Forristall',
              position: '',
            },
            {
              number: '72',
              name: 'Hjalte Froholdt',
              position: '',
            },
            {
              number: '48',
              name: 'Nick Guggemos',
              position: '',
            },
            {
              number: '54',
              name: 'Willie Harvey Jr.',
              position: '',
            },
            {
              number: '41',
              name: 'John Kelly',
              position: '',
            },
            {
              number: '49',
              name: 'Nate Meadors',
              position: '',
            },
            {
              number: '29',
              name: 'Herb Miller',
              position: '',
            },
            {
              number: '60',
              name: 'David Moore',
              position: '',
            },
            {
              number: '65',
              name: 'Elijah Nkansah',
              position: '',
            },
            {
              number: '40',
              name: 'Johnny Stanton',
              position: '',
            },
            {
              number: '70',
              name: 'Alex Taylor',
              position: '',
            },
            {
              number: '59',
              name: 'Curtis Weaver',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '90',
              name: 'Jadeveon Clowney',
              position: 'DE',
            },
            {
              number: '2',
              name: 'Dustin Colquitt',
              position: 'P',
            },
            {
              number: '92',
              name: 'Sheldon Day',
              position: 'DT',
            },
            {
              number: '33',
              name: 'Ronnie Harrison',
              position: 'SS',
            },
            {
              number: '82',
              name: 'Rashard Higgins',
              position: 'WR',
            },
            {
              number: '74',
              name: 'Chris Hubbard',
              position: 'T',
            },
            {
              number: '97',
              name: 'Malik Jackson',
              position: 'DT',
            },
            {
              number: '52',
              name: 'Elijah Lee',
              position: 'MLB',
            },
            {
              number: '55',
              name: 'Takkarist McKinley',
              position: 'DE',
            },
            {
              number: '9',
              name: 'Nick Mullens',
              position: 'QB',
            },
            {
              number: '85',
              name: 'David Njoku',
              position: 'TE',
            },
            {
              number: '57',
              name: 'Ifeadi Odenigbo',
              position: 'DE',
            },
            {
              number: '56',
              name: 'Malcolm Smith',
              position: 'OLB',
            },
            {
              number: '36',
              name: 'M. J. Stewart',
              position: 'SS',
            },
            {
              number: '15',
              name: 'Ryan Switzer',
              position: 'WR',
            },
            {
              number: '4',
              name: 'Anthony Walker Jr.',
              position: 'MLB',
            },
          ],
          restrictedFAs: [
            {
              number: '89',
              name: 'Stephen Carlson',
              position: 'TE',
            },
            {
              number: '94',
              name: 'Porter Gustin',
              position: 'DE',
            },
            {
              number: '30',
              name: "D'Ernest Johnson",
              position: 'RB',
            },
            {
              number: '3',
              name: 'Chase McLaughlin',
              position: 'K',
            },
          ],
        },
        PittsburghSteelers: {
          quarterbacks: [
            {
              number: '2',
              name: 'Mason Rudolph',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '22',
              name: 'Najee Harris',
              position: null,
            },
            {
              number: '26',
              name: 'Anthony McFarland Jr.',
              position: null,
            },
            {
              number: '24',
              name: 'Benny Snell',
              position: null,
            },
            {
              number: '44',
              name: 'Derek Watt',
              position: 'FB',
            },
          ],
          wideReceivers: [
            {
              number: '11',
              name: 'Chase Claypool',
              position: null,
            },
            {
              number: '18',
              name: 'Diontae Johnson',
              position: null,
            },
            {
              number: '15',
              name: 'Cody White',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '88',
              name: 'Pat Freiermuth',
              position: null,
            },
            {
              number: '81',
              name: 'Zach Gentry',
              position: null,
            },
            {
              number: '87',
              name: 'Kevin Rader',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '72',
              name: 'Zach Banner',
              position: 'T',
            },
            {
              number: '69',
              name: 'Kevin Dotson',
              position: 'G',
            },
            {
              number: '53',
              name: 'Kendrick Green',
              position: 'C',
            },
            {
              number: '71',
              name: 'Joe Haeg',
              position: 'T',
            },
            {
              number: '77',
              name: 'John Leglue',
              position: 'G',
            },
            {
              number: '65',
              name: 'Dan Moore',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '94',
              name: 'Tyson Alualu',
              position: 'DE',
            },
            {
              number: '73',
              name: 'Carlos Davis',
              position: 'NT',
            },
            {
              number: '97',
              name: 'Cameron Heyward',
              position: 'DE',
            },
            {
              number: '92',
              name: 'Isaiahh Loudermilk',
              position: 'DE',
            },
            {
              number: '99',
              name: 'Henry Mondeaux',
              position: 'DE',
            },
            {
              number: '91',
              name: 'Stephon Tuitt',
              position: 'DE',
            },
            {
              number: '95',
              name: 'Chris Wormley',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '55',
              name: 'Devin Bush Jr.',
              position: 'ILB',
            },
            {
              number: '54',
              name: 'Ulysees Gilbert',
              position: 'ILB',
            },
            {
              number: '56',
              name: 'Alex Highsmith',
              position: 'OLB',
            },
            {
              number: '45',
              name: 'Buddy Johnson',
              position: 'ILB',
            },
            {
              number: '30',
              name: 'Tegray Scales',
              position: 'ILB',
            },
            {
              number: '93',
              name: 'Joe Schobert',
              position: 'ILB',
            },
            {
              number: '48',
              name: 'Derrek Tuszka',
              position: 'OLB',
            },
            {
              number: '90',
              name: 'T. J. Watt',
              position: 'OLB',
            },
          ],
          defensiveBacks: [
            {
              number: '39',
              name: 'Minkah Fitzpatrick',
              position: 'FS',
            },
            {
              number: '31',
              name: 'Justin Layne',
              position: 'CB',
            },
            {
              number: '21',
              name: 'Tre Norwood',
              position: 'FS',
            },
            {
              number: '42',
              name: 'James Pierre',
              position: 'CB',
            },
            {
              number: '20',
              name: 'Cameron Sutton',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '9',
              name: 'Chris Boswell',
              position: 'K',
            },
            {
              number: '6',
              name: 'Pressley Harvin III',
              position: 'P',
            },
            {
              number: '46',
              name: 'Christian Kuntz',
              position: 'LS',
            },
          ],
          reserveLists: [
            {
              number: '61',
              name: 'Daniel Archibong',
              position: '',
            },
            {
              number: '84',
              name: 'Rico Bussey',
              position: '',
            },
            {
              number: '68',
              name: 'Khalil Davis',
              position: '',
            },
            {
              number: '33',
              name: 'Trey Edmunds',
              position: '',
            },
            {
              number: '62',
              name: 'Nate Gilliam',
              position: '',
            },
            {
              number: '74',
              name: 'Chaz Green',
              position: '',
            },
            {
              number: '30',
              name: 'Isaiah Johnson',
              position: '',
            },
            {
              number: '16',
              name: 'Cameron Nizialek',
              position: '',
            },
            {
              number: '64',
              name: 'Malcolm Pridgeon',
              position: '',
            },
            {
              number: '50',
              name: 'Delontae Scott',
              position: '',
            },
            {
              number: '38',
              name: 'John Simon',
              position: '',
            },
            {
              number: '82',
              name: 'Steven Sims',
              position: '',
            },
            {
              number: '4',
              name: 'Sam Sloman',
              position: '',
            },
            {
              number: '40',
              name: 'Linden Stephens',
              position: '',
            },
            {
              number: '89',
              name: 'Jace Sternberger',
              position: '',
            },
            {
              number: '37',
              name: 'Donovan Stiner',
              position: '',
            },
            {
              number: '--',
              name: 'Rex Sunahara',
              position: '',
            },
            {
              number: '80',
              name: 'Tyler Vaughns',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '57',
              name: 'Montravius Adams',
              position: 'DE',
            },
            {
              number: '29',
              name: 'Kalen Ballage',
              position: 'RB',
            },
            {
              number: '98',
              name: 'Taco Charlton',
              position: 'OLB',
            },
            {
              number: '5',
              name: 'Joshua Dobbs',
              position: 'QB',
            },
            {
              number: '85',
              name: 'Eric Ebron',
              position: 'TE',
            },
            {
              number: '34',
              name: 'Terrell Edmunds',
              position: 'SS',
            },
            {
              number: '67',
              name: 'B. J. Finney',
              position: 'G',
            },
            {
              number: '23',
              name: 'Joe Haden',
              position: 'CB',
            },
            {
              number: '28',
              name: 'Miles Killebrew',
              position: 'SS',
            },
            {
              number: '35',
              name: 'Arthur Maulet',
              position: 'CB',
            },
            {
              number: '14',
              name: 'Ray-Ray McCloud',
              position: 'WR',
            },
            {
              number: '76',
              name: 'Chukwuma Okorafor',
              position: 'OT',
            },
            {
              number: '19',
              name: 'JuJu Smith-Schuster',
              position: 'WR',
            },
            {
              number: '51',
              name: 'Trai Turner',
              position: 'G',
            },
            {
              number: '13',
              name: 'James Washington',
              position: 'WR',
            },
            {
              number: '25',
              name: 'Ahkello Witherspoon',
              position: 'CB',
            },
          ],
          restrictedFAs: [
            {
              number: '27',
              name: 'Marcus Allen',
              position: 'ILB',
            },
            {
              number: '3',
              name: 'Dwayne Haskins',
              position: 'QB',
            },
            {
              number: '41',
              name: 'Robert Spillane',
              position: 'ILB',
            },
          ],
        },
      },
      south: {
        TennesseeTitans: {
          quarterbacks: [
            {
              number: '17',
              name: 'Ryan Tannehill',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '44',
              name: 'Tory Carter',
              position: 'FB',
            },
            {
              number: '32',
              name: 'Darrynton Evans',
              position: null,
            },
            {
              number: '22',
              name: 'Derrick Henry',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '11',
              name: 'A. J. Brown',
              position: null,
            },
            {
              number: '10',
              name: 'Dez Fitzpatrick',
              position: null,
            },
            {
              number: '2',
              name: 'Julio Jones',
              position: null,
            },
            {
              number: '--',
              name: 'Josh Malone',
              position: null,
            },
            {
              number: '81',
              name: 'Racey McMath',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '89',
              name: 'Tommy Hudson',
              position: null,
            },
            {
              number: '83',
              name: 'Ryan Izzo',
              position: null,
            },
            {
              number: '49',
              name: 'Briley Moore',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '62',
              name: 'Aaron Brewer',
              position: 'G',
            },
            {
              number: '64',
              name: 'Nate Davis',
              position: 'G',
            },
            {
              number: '66',
              name: 'Brandon Kemp',
              position: 'T',
            },
            {
              number: '71',
              name: 'Kendall Lamm',
              position: 'T',
            },
            {
              number: '61',
              name: 'Corey Levin',
              position: 'C',
            },
            {
              number: '77',
              name: 'Taylor Lewan',
              position: 'T',
            },
            {
              number: '75',
              name: 'Dillon Radunz',
              position: 'T',
            },
            {
              number: '76',
              name: 'Rodger Saffold',
              position: 'G',
            },
          ],
          defensiveLinemen: [
            {
              number: '96',
              name: 'Denico Autry',
              position: 'DE',
            },
            {
              number: '78',
              name: "Da'Shawn Hand",
              position: 'DE',
            },
            {
              number: '90',
              name: 'Naquan Jones',
              position: 'NT',
            },
            {
              number: '91',
              name: 'Larrell Murchison',
              position: 'DE',
            },
            {
              number: '98',
              name: 'Jeffery Simmons',
              position: 'DE',
            },
            {
              number: '97',
              name: 'Kevin Strong',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '41',
              name: 'Zach Cunningham',
              position: 'ILB',
            },
            {
              number: '48',
              name: 'Bud Dupree',
              position: 'OLB',
            },
            {
              number: '--',
              name: 'Justin Lawler',
              position: 'OLB',
            },
            {
              number: '51',
              name: 'David Long Jr.',
              position: 'ILB',
            },
            {
              number: '56',
              name: 'Monty Rice',
              position: 'ILB',
            },
            {
              number: '99',
              name: 'Rashad Weaver',
              position: 'OLB',
            },
          ],
          defensiveBacks: [
            {
              number: '31',
              name: 'Kevin Byard',
              position: 'FS',
            },
            {
              number: '3',
              name: 'Caleb Farley',
              position: 'CB',
            },
            {
              number: '26',
              name: 'Kristian Fulton',
              position: 'CB',
            },
            {
              number: '37',
              name: 'Amani Hooker',
              position: 'SS',
            },
            {
              number: '35',
              name: 'Chris Jackson',
              position: 'CB',
            },
            {
              number: '20',
              name: 'Janoris Jenkins',
              position: 'CB',
            },
            {
              number: '24',
              name: 'Elijah Molden',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '6',
              name: 'Brett Kern',
              position: 'P',
            },
          ],
          reserveLists: [
            {
              number: '25',
              name: 'Jamal Carter',
              position: '',
            },
            {
              number: '39',
              name: 'Shyheim Carter',
              position: '',
            },
            {
              number: '47',
              name: 'Rodney Clemons',
              position: '',
            },
            {
              number: '69',
              name: 'Christian DiLauro',
              position: '',
            },
            {
              number: '84',
              name: 'Austin Fort',
              position: '',
            },
            {
              number: '66',
              name: 'Derwin Gray',
              position: '',
            },
            {
              number: '--',
              name: 'Nate Hall',
              position: '',
            },
            {
              number: '8',
              name: 'Kevin Hogan',
              position: '',
            },
            {
              number: '16',
              name: 'Cody Hollister',
              position: '',
            },
            {
              number: '42',
              name: 'Joseph Jones',
              position: '',
            },
            {
              number: '--',
              name: 'Kobe Jones',
              position: '',
            },
            {
              number: '12',
              name: 'Mason Kinsey',
              position: '',
            },
            {
              number: '52',
              name: 'Daniel Munyer',
              position: '',
            },
            {
              number: '70',
              name: 'Jordan Roos',
              position: '',
            },
            {
              number: '59',
              name: 'Tuzar Skipper',
              position: '',
            },
            {
              number: '--',
              name: 'Chris Williamson',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '92',
              name: 'Ola Adeniyi',
              position: 'OLB',
            },
            {
              number: '13',
              name: 'Cameron Batson',
              position: 'WR',
            },
            {
              number: '53',
              name: 'B. J. Bello',
              position: 'ILB',
            },
            {
              number: '55',
              name: 'Jayon Brown',
              position: 'ILB',
            },
            {
              number: '14',
              name: 'Randy Bullock',
              position: 'K',
            },
            {
              number: '53',
              name: 'Dylan Cole',
              position: 'ILB',
            },
            {
              number: '97',
              name: 'Trevon Coley',
              position: 'DE',
            },
            {
              number: '46',
              name: 'Morgan Cox',
              position: 'LS',
            },
            {
              number: '29',
              name: 'Dane Cruikshank',
              position: 'FS',
            },
            {
              number: '49',
              name: 'Nick Dzubnar',
              position: 'ILB',
            },
            {
              number: '54',
              name: 'Rashaan Evans',
              position: 'ILB',
            },
            {
              number: '21',
              name: 'Matthias Farley',
              position: 'SS',
            },
            {
              number: '86',
              name: 'Anthony Firkser',
              position: 'TE',
            },
            {
              number: '7',
              name: "D'Onta Foreman",
              position: 'RB',
            },
            {
              number: '40',
              name: 'Dontrell Hilliard',
              position: 'RB',
            },
            {
              number: '88',
              name: 'Marcus Johnson',
              position: 'WR',
            },
            {
              number: '60',
              name: 'Ben Jones',
              position: 'C',
            },
            {
              number: '58',
              name: 'Harold Landry',
              position: 'OLB',
            },
            {
              number: '30',
              name: 'Greg Mabin',
              position: 'CB',
            },
            {
              number: '95',
              name: 'Kyle Peko',
              position: 'NT',
            },
            {
              number: '85',
              name: 'MyCole Pruitt',
              position: 'TE',
            },
            {
              number: '80',
              name: 'Chester Rogers',
              position: 'WR',
            },
            {
              number: '38',
              name: 'Buster Skrine',
              position: 'CB',
            },
            {
              number: '87',
              name: 'Geoff Swaim',
              position: 'TE',
            },
          ],
          restrictedFAs: [
            {
              number: '45',
              name: 'Khari Blasingame',
              position: 'FB',
            },
            {
              number: '4',
              name: 'Sam Ficken',
              position: 'K',
            },
            {
              number: '72',
              name: 'David Quessenberry',
              position: 'OT',
            },
            {
              number: '50',
              name: 'Derick Roberson',
              position: 'OLB',
            },
          ],
        },
        HoustonTexans: {
          'datefebruary27, 2022': [],
          quarterbacks: [
            {
              number: '10',
              name: 'Davis Mills',
              position: null,
            },
            {
              number: '4',
              name: 'Deshaun Watson',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '28',
              name: 'Rex Burkhead',
              position: null,
            },
            {
              number: '27',
              name: 'Scottie Phillips',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '12',
              name: 'Nico Collins',
              position: null,
            },
            {
              number: '13',
              name: 'Brandin Cooks',
              position: null,
            },
            {
              number: '2',
              name: 'Phillip Dorsett',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '9',
              name: 'Brevin Jordan',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '61',
              name: 'Marcus Cannon',
              position: 'T',
            },
            {
              number: '67',
              name: 'Charlie Heck',
              position: 'T',
            },
            {
              number: '71',
              name: 'Tytus Howard',
              position: 'G',
            },
            {
              number: '64',
              name: 'Justin McCray',
              position: 'G',
            },
            {
              number: '74',
              name: 'Max Scharping',
              position: 'G',
            },
            {
              number: '78',
              name: 'Laremy Tunsil',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '90',
              name: 'Ross Blacklock',
              position: 'DT',
            },
            {
              number: '75',
              name: "Ron'Dell Carter",
              position: 'DE',
            },
            {
              number: '52',
              name: 'Jonathan Greenard',
              position: 'DE',
            },
            {
              number: '50',
              name: 'Jordan Jenkins',
              position: 'DE',
            },
            {
              number: '--',
              name: 'Kingsley Keke',
              position: 'DT',
            },
            {
              number: '91',
              name: 'Roy Lopez',
              position: 'DT',
            },
            {
              number: '95',
              name: 'Derek Rivers',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '55',
              name: 'Tae Davis',
              position: 'OLB',
            },
            {
              number: '57',
              name: 'Kevin Pierre-Louis',
              position: 'OLB',
            },
            {
              number: '32',
              name: 'Garret Wallow',
              position: 'MLB',
            },
          ],
          defensiveBacks: [
            {
              number: '35',
              name: 'Grayland Arnold',
              position: 'CB',
            },
            {
              number: '1',
              name: 'Lonnie Johnson Jr.',
              position: 'CB',
            },
            {
              number: '39',
              name: 'Terrance Mitchell',
              position: 'CB',
            },
            {
              number: '22',
              name: 'Jimmy Moreland',
              position: 'CB',
            },
            {
              number: '23',
              name: 'Eric Murray',
              position: 'SS',
            },
            {
              number: '36',
              name: 'Jonathan Owens',
              position: 'SS',
            },
            {
              number: '24',
              name: 'Tremon Smith',
              position: 'CB',
            },
            {
              number: '37',
              name: 'Tavierre Thomas',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '7',
              name: 'Kaʻimi Fairbairn',
              position: 'K',
            },
            {
              number: '11',
              name: 'Cameron Johnston',
              position: 'P',
            },
            {
              number: '46',
              name: 'Jon Weeks',
              position: 'LS',
            },
          ],
          reserveLists: [
            {
              number: '30',
              name: 'Darius Anderson',
              position: '',
            },
            {
              number: '17',
              name: 'Jalen Camp',
              position: '',
            },
            {
              number: '98',
              name: 'Michael Dwumfour',
              position: '',
            },
            {
              number: '60',
              name: 'Jake Eldrenkamp',
              position: '',
            },
            {
              number: '14',
              name: 'T. J. Green',
              position: '',
            },
            {
              number: '94',
              name: 'Demone Harris',
              position: '',
            },
            {
              number: '86',
              name: 'Damon Hazelton',
              position: '',
            },
            {
              number: '45',
              name: 'Paul Quessenberry',
              position: '',
            },
            {
              number: '70',
              name: 'Jordan Steckler',
              position: '',
            },
            {
              number: '53',
              name: 'Connor Strachan',
              position: '',
            },
            {
              number: '40',
              name: 'Josh Watson',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '88',
              name: 'Jordan Akins',
              position: 'TE',
            },
            {
              number: '89',
              name: 'Danny Amendola',
              position: 'WR',
            },
            {
              number: '83',
              name: 'Antony Auclair',
              position: 'TE',
            },
            {
              number: '68',
              name: 'Justin Britt',
              position: 'C',
            },
            {
              number: '8',
              name: 'Terrence Brooks',
              position: 'SS',
            },
            {
              number: '85',
              name: 'Pharaoh Brown',
              position: 'TE',
            },
            {
              number: '72',
              name: 'Geron Christian',
              position: 'T',
            },
            {
              number: '97',
              name: 'Maliek Collins',
              position: 'DT',
            },
            {
              number: '18',
              name: 'Chris Conley',
              position: 'WR',
            },
            {
              number: '6',
              name: 'Jeff Driskel',
              position: 'TE',
            },
            {
              number: '26',
              name: 'Royce Freeman',
              position: 'RB',
            },
            {
              number: '51',
              name: 'Kamu Grugier-Hill',
              position: 'MLB',
            },
            {
              number: '43',
              name: 'Neville Hewitt',
              position: 'OLB',
            },
            {
              number: '31',
              name: 'David Johnson',
              position: 'RB',
            },
            {
              number: '93',
              name: 'Jaleel Johnson',
              position: 'DT',
            },
            {
              number: '25',
              name: 'Desmond King',
              position: 'CB',
            },
            {
              number: '58',
              name: 'Christian Kirksey',
              position: 'MLB',
            },
            {
              number: '54',
              name: 'Jacob Martin',
              position: 'DE',
            },
            {
              number: '33',
              name: 'A. J. Moore',
              position: 'FS',
            },
            {
              number: '15',
              name: 'Chris Moore',
              position: 'WR',
            },
            {
              number: '56',
              name: 'Hardy Nickerson Jr.',
              position: 'OLB',
            },
            {
              number: '20',
              name: 'Justin Reid',
              position: 'FS',
            },
            {
              number: '92',
              name: 'Chris Smith',
              position: 'DE',
            },
            {
              number: '65',
              name: 'Lane Taylor',
              position: 'G',
            },
            {
              number: '5',
              name: 'Tyrod Taylor',
              position: 'QB',
            },
            {
              number: '96',
              name: 'Vincent Taylor',
              position: 'DT',
            },
            {
              number: '66',
              name: 'Cole Toner',
              position: 'C',
            },
            {
              number: '55',
              name: 'DeMarcus Walker',
              position: 'DE',
            },
            {
              number: '59',
              name: 'Eric Wilson',
              position: 'MLB',
            },
          ],
        },
        JacksonvilleJaguars: {
          'datefebruary18, 2022': [],
          quarterbacks: [
            {
              number: '3',
              name: 'C. J. Beathard',
              position: null,
            },
            {
              number: '16',
              name: 'Trevor Lawrence',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '23',
              name: 'Ryquell Armstead',
              position: null,
            },
            {
              number: '1',
              name: 'Travis Etienne',
              position: null,
            },
            {
              number: '24',
              name: 'Carlos Hyde',
              position: null,
            },
            {
              number: '25',
              name: 'James Robinson',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '39',
              name: 'Jamal Agnew',
              position: null,
            },
            {
              number: '11',
              name: 'Marvin Jones',
              position: null,
            },
            {
              number: '10',
              name: 'Laviska Shenault',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '85',
              name: 'Dan Arnold',
              position: null,
            },
            {
              number: '89',
              name: 'Luke Farrell',
              position: null,
            },
            {
              number: '84',
              name: 'Chris Manhertz',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '78',
              name: 'Ben Bartch',
              position: 'G',
            },
            {
              number: '65',
              name: 'Brandon Linder',
              position: 'C',
            },
            {
              number: '72',
              name: 'Walker Little',
              position: 'T',
            },
            {
              number: '62',
              name: 'K. C. McDermott',
              position: 'G',
            },
            {
              number: '75',
              name: 'Jawaan Taylor',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '41',
              name: 'Josh Allen',
              position: 'DE',
            },
            {
              number: '90',
              name: 'Malcom Brown',
              position: 'DT',
            },
            {
              number: '45',
              name: "K'Lavon Chaisson",
              position: 'DE',
            },
            {
              number: '52',
              name: 'DaVon Hamilton',
              position: 'DT',
            },
            {
              number: '95',
              name: 'Roy Robertson-Harris',
              position: 'DT',
            },
            {
              number: '92',
              name: 'Jordan Smith',
              position: 'DE',
            },
            {
              number: '91',
              name: 'Dawuane Smoot',
              position: 'DE',
            },
            {
              number: '97',
              name: 'Jay Tufele',
              position: 'DT',
            },
          ],
          linebackers: [
            {
              number: '44',
              name: 'Myles Jack',
              position: 'OLB',
            },
            {
              number: '48',
              name: 'Dylan Moses',
              position: 'OLB',
            },
            {
              number: '50',
              name: 'Shaquille Quarterman',
              position: 'MLB',
            },
            {
              number: '--',
              name: 'Elijah Sullivan',
              position: 'LB',
            },
          ],
          defensiveBacks: [
            {
              number: '32',
              name: 'Tyson Campbell',
              position: 'CB',
            },
            {
              number: '38',
              name: 'Andre Cisco',
              position: 'FS',
            },
            {
              number: '27',
              name: 'Chris Claybrooks',
              position: 'CB',
            },
            {
              number: '5',
              name: 'Rudy Ford',
              position: 'SS',
            },
            {
              number: '26',
              name: 'Shaquill Griffin',
              position: 'CB',
            },
            {
              number: '2',
              name: 'Rayshawn Jenkins',
              position: 'FS',
            },
            {
              number: '29',
              name: 'Brandon Rusnak',
              position: 'FS',
            },
            {
              number: '20',
              name: 'Daniel Thomas',
              position: 'SS',
            },
          ],
          specialTeams: [
            {
              number: '9',
              name: 'Logan Cooke',
              position: 'P',
            },
            {
              number: '46',
              name: 'Ross Matiscik',
              position: 'LS',
            },
            {
              number: '15',
              name: 'Matthew Wright',
              position: 'K',
            },
          ],
          reserveLists: [
            {
              number: '88',
              name: 'Jeff Cotton',
              position: '',
            },
            {
              number: '31',
              name: 'Nathan Cottrell',
              position: '',
            },
            {
              number: '64',
              name: 'Coy Cronk',
              position: '',
            },
            {
              number: '81',
              name: 'Josh Hammond',
              position: '',
            },
            {
              number: '70',
              name: 'Jared Hocker',
              position: '',
            },
            {
              number: '83',
              name: 'Tim Jones',
              position: '',
            },
            {
              number: '98',
              name: 'Jeremiah Ledbetter',
              position: '',
            },
            {
              number: '--',
              name: 'Jake Luton',
              position: '',
            },
            {
              number: '73',
              name: 'Badara Traore',
              position: '',
            },
            {
              number: '--',
              name: 'Raequan Williams',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '59',
              name: 'Tyrell Adams',
              position: 'MLB',
            },
            {
              number: '7',
              name: 'Tavon Austin',
              position: 'WR',
            },
            {
              number: '93',
              name: 'Taven Bryan',
              position: 'DT',
            },
            {
              number: '60',
              name: 'A. J. Cann',
              position: 'G',
            },
            {
              number: '17',
              name: 'D. J. Chark',
              position: 'WR',
            },
            {
              number: '96',
              name: 'Adam Gotsis',
              position: 'DE',
            },
            {
              number: '37',
              name: 'Tre Herndon',
              position: 'CB',
            },
            {
              number: '86',
              name: 'Jacob Hollister',
              position: 'TE',
            },
            {
              number: '21',
              name: 'Nevin Lawson',
              position: 'CB',
            },
            {
              number: '55',
              name: 'Lerentee McCray',
              position: 'DE',
            },
            {
              number: '4',
              name: 'Jaydon Mickens',
              position: 'WR',
            },
            {
              number: '68',
              name: 'Andrew Norwell',
              position: 'G',
            },
            {
              number: '80',
              name: "James O'Shaughnessy",
              position: 'TE',
            },
            {
              number: '76',
              name: 'Will Richardson',
              position: 'T',
            },
            {
              number: '74',
              name: 'Cam Robinson',
              position: 'T',
            },
            {
              number: '69',
              name: 'Tyler Shatley',
              position: 'C',
            },
            {
              number: '18',
              name: 'Laquon Treadwell',
              position: 'WR',
            },
            {
              number: '6',
              name: 'Jihad Ward',
              position: 'DE',
            },
            {
              number: '54',
              name: 'Damien Wilson',
              position: 'MLB',
            },
          ],
          restrictedFAs: [
            {
              number: '53',
              name: 'Dakota Allen',
              position: 'OLB',
            },
            {
              number: '33',
              name: 'Dare Ogunbowale',
              position: 'RB',
            },
            {
              number: '13',
              name: 'J. K. Scott',
              position: 'P',
            },
            {
              number: '47',
              name: 'Kahale Warring',
              position: 'TE',
            },
            {
              number: '42',
              name: 'Andrew Wingard',
              position: 'FS',
            },
          ],
          'exclusive-rightsFAs': [
            {
              number: '14',
              name: 'Terry Godwin',
              position: 'WR',
            },
            {
              number: '40',
              name: 'Jamir Jones',
              position: 'OLB',
            },
            {
              number: '49',
              name: 'Chapelle Russell',
              position: 'OLB',
            },
            {
              number: '36',
              name: 'Mekhi Sargent',
              position: 'RB',
            },
          ],
        },
        IndianapolisColts: {
          'datefebruary8, 2022': [],
          quarterbacks: [
            {
              number: '4',
              name: 'Sam Ehlinger',
              position: null,
            },
            {
              number: '2',
              name: 'Carson Wentz',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '21',
              name: 'Nyheim Hines',
              position: null,
            },
            {
              number: '35',
              name: 'Deon Jackson',
              position: null,
            },
            {
              number: '28',
              name: 'Jonathan Taylor',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '1',
              name: 'Parris Campbell',
              position: null,
            },
            {
              number: '10',
              name: 'Dezmon Patmon',
              position: null,
            },
            {
              number: '11',
              name: 'Michael Pittman Jr.',
              position: null,
            },
            {
              number: '17',
              name: 'Michael Strachan',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '84',
              name: 'Jack Doyle',
              position: null,
            },
            {
              number: '83',
              name: 'Kylen Granson',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '75',
              name: 'Will Fries',
              position: 'G',
            },
            {
              number: '78',
              name: 'Ryan Kelly',
              position: 'C',
            },
            {
              number: '56',
              name: 'Quenton Nelson',
              position: 'G',
            },
            {
              number: '63',
              name: 'Danny Pinter',
              position: 'C',
            },
            {
              number: '72',
              name: 'Braden Smith',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '52',
              name: 'Ben Banogu',
              position: 'DE',
            },
            {
              number: '99',
              name: 'DeForest Buckner',
              position: 'DT',
            },
            {
              number: '--',
              name: 'R. J. McIntosh',
              position: 'DT',
            },
            {
              number: '54',
              name: 'Dayo Odeyingbo',
              position: 'DE',
            },
            {
              number: '51',
              name: 'Kwity Paye',
              position: 'DE',
            },
            {
              number: '90',
              name: 'Grover Stewart',
              position: 'DT',
            },
          ],
          linebackers: [
            {
              number: '59',
              name: 'Jordan Glasgow',
              position: 'OLB',
            },
            {
              number: '53',
              name: 'Darius Leonard',
              position: 'OLB',
            },
            {
              number: '58',
              name: 'Bobby Okereke',
              position: 'MLB',
            },
            {
              number: '45',
              name: 'E. J. Speed',
              position: 'OLB',
            },
          ],
          defensiveBacks: [
            {
              number: '32',
              name: 'Julian Blackmon',
              position: 'FS',
            },
            {
              number: '23',
              name: 'Kenny Moore',
              position: 'CB',
            },
            {
              number: '34',
              name: 'Isaiah Rodgers',
              position: 'CB',
            },
            {
              number: '37',
              name: 'Khari Willis',
              position: 'SS',
            },
            {
              number: '26',
              name: 'Rock Ya-Sin',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '3',
              name: 'Rodrigo Blankenship',
              position: 'K',
            },
            {
              number: '46',
              name: 'Luke Rhodes',
              position: 'LS',
            },
            {
              number: '8',
              name: 'Rigoberto Sanchez',
              position: 'P',
            },
            {
              number: '--',
              name: 'Jake Verity',
              position: 'K',
            },
          ],
          reserveLists: [
            {
              number: '47',
              name: 'Anthony Chesley',
              position: '',
            },
            {
              number: '92',
              name: 'Kameron Cline',
              position: '',
            },
            {
              number: '76',
              name: 'Shon Coleman',
              position: '',
            },
            {
              number: '15',
              name: 'Keke Coutee',
              position: '',
            },
            {
              number: '86',
              name: 'Farrod Green',
              position: '',
            },
            {
              number: '12',
              name: 'DeMichael Harris',
              position: '',
            },
            {
              number: '80',
              name: 'Michael Jacobson',
              position: '',
            },
            {
              number: '43',
              name: 'Malik Jefferson',
              position: '',
            },
            {
              number: '--',
              name: 'Nikola Kalinic',
              position: '',
            },
            {
              number: '9',
              name: 'James Morgan',
              position: '',
            },
            {
              number: '--',
              name: 'Jordan Murray',
              position: '',
            },
            {
              number: '--',
              name: 'Alexander Myres',
              position: '',
            },
            {
              number: '61',
              name: "Carter O'Donnell",
              position: '',
            },
            {
              number: '29',
              name: 'Will Redmond',
              position: '',
            },
            {
              number: '40',
              name: 'Chris Wilcox',
              position: '',
            },
            {
              number: '66',
              name: 'Chris Williams',
              position: '',
            },
            {
              number: '85',
              name: 'Eli Wolf',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '49',
              name: 'Matthew Adams',
              position: 'OLB',
            },
            {
              number: '41',
              name: 'Jahleel Addae',
              position: 'FS',
            },
            {
              number: '81',
              name: 'Mo Alie-Cox',
              position: 'TE',
            },
            {
              number: '6',
              name: 'Michael Badgley',
              position: 'K',
            },
            {
              number: '38',
              name: 'T. J. Carrie',
              position: 'CB',
            },
            {
              number: '73',
              name: 'Julién Davenport',
              position: 'T',
            },
            {
              number: '79',
              name: 'Eric Fisher',
              position: 'T',
            },
            {
              number: '44',
              name: 'Zaire Franklin',
              position: 'MLB',
            },
            {
              number: '64',
              name: 'Mark Glowinski',
              position: 'G',
            },
            {
              number: '13',
              name: 'T. Y. Hilton',
              position: 'WR',
            },
            {
              number: '94',
              name: 'Tyquan Lewis',
              position: 'DT',
            },
            {
              number: '25',
              name: 'Marlon Mack',
              position: 'RB',
            },
            {
              number: '97',
              name: 'Al-Quadin Muhammad',
              position: 'DE',
            },
            {
              number: '30',
              name: 'George Odum',
              position: 'SS',
            },
            {
              number: '14',
              name: 'Zach Pascal',
              position: 'WR',
            },
            {
              number: '69',
              name: 'Matt Pryor',
              position: 'T',
            },
            {
              number: '62',
              name: 'Chris Reed',
              position: 'G',
            },
            {
              number: '27',
              name: 'Xavier Rhodes',
              position: 'CB',
            },
            {
              number: '91',
              name: 'Isaac Rochell',
              position: 'DE',
            },
            {
              number: '42',
              name: 'Andrew Sendejo',
              position: 'FS',
            },
            {
              number: '71',
              name: 'Sam Tevi',
              position: 'T',
            },
            {
              number: '57',
              name: 'Kemoko Turay',
              position: 'DE',
            },
            {
              number: '96',
              name: 'Antwaun Woods',
              position: 'DT',
            },
          ],
          restrictedFAs: [
            {
              number: '16',
              name: 'Ashton Dulin',
              position: 'WR',
            },
            {
              number: '95',
              name: 'Taylor Stallworth',
              position: 'DT',
            },
          ],
        },
      },
      east: {
        BuffaloBills: {
          'datefebruary23, 2022': [],
          quarterbacks: [
            {
              number: '17',
              name: 'Josh Allen',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '41',
              name: 'Reggie Gilliam',
              position: 'FB',
            },
            {
              number: '20',
              name: 'Zack Moss',
              position: null,
            },
            {
              number: '26',
              name: 'Devin Singletary',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '11',
              name: 'Cole Beasley',
              position: null,
            },
            {
              number: '13',
              name: 'Gabriel Davis',
              position: null,
            },
            {
              number: '14',
              name: 'Stefon Diggs',
              position: null,
            },
            {
              number: '5',
              name: 'Marquez Stevenson',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '88',
              name: 'Dawson Knox',
              position: null,
            },
            {
              number: '89',
              name: 'Tommy Sweeney',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '79',
              name: 'Spencer Brown',
              position: 'T',
            },
            {
              number: '73',
              name: 'Dion Dawkins',
              position: 'T',
            },
            {
              number: '72',
              name: 'Tommy Doyle',
              position: 'T',
            },
            {
              number: '76',
              name: 'Jon Feliciano',
              position: 'G',
            },
            {
              number: '74',
              name: 'Cody Ford',
              position: 'G',
            },
            {
              number: '60',
              name: 'Mitch Morse',
              position: 'C',
            },
            {
              number: '75',
              name: 'Daryl Williams',
              position: 'G',
            },
          ],
          defensiveLinemen: [
            {
              number: '51',
              name: 'Eli Ankou',
              position: 'DT',
            },
            {
              number: '96',
              name: 'Carlos Basham Jr.',
              position: 'DE',
            },
            {
              number: '57',
              name: 'A. J. Epenesa',
              position: 'DE',
            },
            {
              number: '98',
              name: 'Star Lotulelei',
              position: 'DT',
            },
            {
              number: '91',
              name: 'Ed Oliver',
              position: 'DT',
            },
            {
              number: '50',
              name: 'Gregory Rousseau',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '53',
              name: 'Tyrel Dodson',
              position: 'OLB',
            },
            {
              number: '49',
              name: 'Tremaine Edmunds',
              position: 'MLB',
            },
            {
              number: '54',
              name: 'A. J. Klein',
              position: 'OLB',
            },
            {
              number: '44',
              name: 'Tyler Matakevich',
              position: 'MLB',
            },
            {
              number: '58',
              name: 'Matt Milano',
              position: 'OLB',
            },
            {
              number: '9',
              name: 'Andre Smith',
              position: 'OLB',
            },
          ],
          defensiveBacks: [
            {
              number: '31',
              name: 'Damar Hamlin',
              position: 'FS',
            },
            {
              number: '23',
              name: 'Micah Hyde',
              position: 'SS',
            },
            {
              number: '30',
              name: 'Dane Jackson',
              position: 'CB',
            },
            {
              number: '46',
              name: 'Jaquan Johnson',
              position: 'SS',
            },
            {
              number: '24',
              name: 'Taron Johnson',
              position: 'CB',
            },
            {
              number: '47',
              name: 'Cam Lewis',
              position: 'CB',
            },
            {
              number: '33',
              name: 'Siran Neal',
              position: 'CB',
            },
            {
              number: '21',
              name: 'Jordan Poyer',
              position: 'FS',
            },
            {
              number: '27',
              name: "Tre'Davious White",
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '2',
              name: 'Tyler Bass',
              position: 'K',
            },
            {
              number: '69',
              name: 'Reid Ferguson',
              position: 'LS',
            },
            {
              number: '3',
              name: 'Matt Haack',
              position: 'P',
            },
          ],
          reserveLists: [
            {
              number: '90',
              name: 'Brandin Bryant',
              position: '',
            },
            {
              number: '66',
              name: 'Jacob Capra',
              position: '',
            },
            {
              number: '87',
              name: 'Tanner Gentry',
              position: '',
            },
            {
              number: '42',
              name: 'Joe Giles-Harris',
              position: '',
            },
            {
              number: '37',
              name: 'Olaijah Griffin',
              position: '',
            },
            {
              number: '29',
              name: 'Tim Harris',
              position: '',
            },
            {
              number: '16',
              name: 'Isaiah Hodgins',
              position: '',
            },
            {
              number: '56',
              name: 'Mike Love',
              position: '',
            },
            {
              number: '38',
              name: 'Nick McCloud',
              position: '',
            },
            {
              number: '85',
              name: 'Quintin Morris',
              position: '',
            },
            {
              number: '36',
              name: 'Josh Thomas',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '97',
              name: 'Mario Addison',
              position: 'DE',
            },
            {
              number: '65',
              name: 'Ike Boettger',
              position: 'G',
            },
            {
              number: '22',
              name: 'Matt Breida',
              position: 'RB',
            },
            {
              number: '94',
              name: 'Vernon Butler',
              position: 'DT',
            },
            {
              number: '51',
              name: 'Bryan Cox Jr.',
              position: 'DE',
            },
            {
              number: '68',
              name: 'Bobby Hart',
              position: 'T',
            },
            {
              number: '55',
              name: 'Jerry Hughes',
              position: 'DE',
            },
            {
              number: '25',
              name: 'Taiwan Jones',
              position: 'RB',
            },
            {
              number: '15',
              name: 'Jake Kumerow',
              position: 'WR',
            },
            {
              number: '19',
              name: 'Isaiah McKenzie',
              position: 'WR',
            },
            {
              number: '93',
              name: 'Efe Obada',
              position: 'DE',
            },
            {
              number: '99',
              name: 'Harrison Phillips',
              position: 'DT',
            },
            {
              number: '1',
              name: 'Emmanuel Sanders',
              position: 'WR',
            },
            {
              number: '10',
              name: 'Mitchell Trubisky',
              position: 'QB',
            },
            {
              number: '39',
              name: 'Levi Wallace',
              position: 'CB',
            },
          ],
        },
        NewYorkJets: {
          'datejanuary27, 2022': [],
          quarterbacks: [
            {
              number: '2',
              name: 'Zach Wilson',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '32',
              name: 'Michael Carter',
              position: null,
            },
            {
              number: '25',
              name: 'Ty Johnson',
              position: null,
            },
            {
              number: '22',
              name: "La'Mical Perine",
              position: null,
            },
            {
              number: '36',
              name: 'Austin Walter',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '84',
              name: 'Corey Davis',
              position: null,
            },
            {
              number: '11',
              name: 'Denzel Mims',
              position: null,
            },
            {
              number: '8',
              name: 'Elijah Moore',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '86',
              name: 'Ryan Griffin',
              position: null,
            },
            {
              number: '85',
              name: 'Trevon Wesco',
              position: null,
            },
            {
              number: '83',
              name: 'Kenny Yeboah',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '77',
              name: 'Mekhi Becton',
              position: 'T',
            },
            {
              number: '70',
              name: 'Chuma Edoga',
              position: 'T',
            },
            {
              number: '76',
              name: 'George Fant',
              position: 'T',
            },
            {
              number: '68',
              name: 'Parker Ferguson',
              position: 'T',
            },
            {
              number: '60',
              name: 'Connor McGovern',
              position: 'C',
            },
            {
              number: '62',
              name: 'Greg Van Roten',
              position: 'G',
            },
            {
              number: '75',
              name: 'Alijah Vera-Tucker',
              position: 'G',
            },
          ],
          defensiveLinemen: [
            {
              number: '91',
              name: 'John Franklin-Myers',
              position: 'DE',
            },
            {
              number: '47',
              name: 'Bryce Huff',
              position: 'DE',
            },
            {
              number: '58',
              name: 'Carl Lawson',
              position: 'DE',
            },
            {
              number: '96',
              name: 'Jonathan Marshall',
              position: 'DT',
            },
            {
              number: '98',
              name: 'Sheldon Rankins',
              position: 'DT',
            },
            {
              number: '95',
              name: 'Quinnen Williams',
              position: 'DT',
            },
            {
              number: '92',
              name: 'Jabari Zuniga',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '53',
              name: 'Blake Cashman',
              position: 'OLB',
            },
            {
              number: '57',
              name: 'C. J. Mosley',
              position: 'MLB',
            },
            {
              number: '45',
              name: 'Hamsah Nasirildeen',
              position: 'OLB',
            },
            {
              number: '43',
              name: "Del'Shawn Phillips",
              position: 'OLB',
            },
            {
              number: '44',
              name: 'Jamien Sherwood',
              position: 'OLB',
            },
            {
              number: '9',
              name: 'Javin White',
              position: 'OLB',
            },
            {
              number: '56',
              name: 'Quincy Williams',
              position: 'OLB',
            },
          ],
          defensiveBacks: [
            {
              number: '30',
              name: 'Michael Carter II',
              position: 'CB',
            },
            {
              number: '21',
              name: 'Ashtyn Davis',
              position: 'FS',
            },
            {
              number: '27',
              name: 'Isaiah Dunn',
              position: 'CB',
            },
            {
              number: '26',
              name: 'Brandin Echols',
              position: 'CB',
            },
            {
              number: '37',
              name: 'Bryce Hall',
              position: 'CB',
            },
            {
              number: '34',
              name: 'Justin Hardee',
              position: 'CB',
            },
            {
              number: '33',
              name: 'Zane Lewis',
              position: 'CB',
            },
            {
              number: '1',
              name: 'Kai Nacua',
              position: 'FS',
            },
            {
              number: '41',
              name: 'Jason Pinnock',
              position: 'CB/S',
            },
            {
              number: '29',
              name: 'Rachad Wildgoose',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '42',
              name: 'Thomas Hennessy',
              position: 'LS',
            },
            {
              number: '7',
              name: 'Braden Mann',
              position: 'P',
            },
          ],
          reserveLists: [
            {
              number: '--',
              name: 'Rodney Adams',
              position: '',
            },
            {
              number: '6',
              name: 'Matt Ammendola',
              position: '',
            },
            {
              number: '--',
              name: 'Bradlee Anae',
              position: '',
            },
            {
              number: '3',
              name: 'Tarik Black',
              position: '',
            },
            {
              number: '--',
              name: 'Lawrence Cager',
              position: '',
            },
            {
              number: '44',
              name: 'Brandon Dillon',
              position: '',
            },
            {
              number: '63',
              name: 'Grant Hermanns',
              position: '',
            },
            {
              number: '--',
              name: 'Jovante Moffatt',
              position: '',
            },
            {
              number: '14',
              name: 'D. J. Montgomery',
              position: '',
            },
            {
              number: '66',
              name: 'Ross Pierschbacher',
              position: '',
            },
            {
              number: '55',
              name: 'Hamilcar Rashed Jr.',
              position: '',
            },
            {
              number: '65',
              name: 'Dru Samia',
              position: '',
            },
            {
              number: '79',
              name: 'Tanzel Smart',
              position: '',
            },
            {
              number: '71',
              name: 'Isaiah Williams',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '48',
              name: 'Nick Bawden',
              position: 'FB',
            },
            {
              number: '10',
              name: 'Braxton Berrios',
              position: 'WR',
            },
            {
              number: '88',
              name: 'Keelan Cole',
              position: 'WR',
            },
            {
              number: '23',
              name: 'Tevin Coleman',
              position: 'RB',
            },
            {
              number: '82',
              name: 'Jamison Crowder',
              position: 'WR',
            },
            {
              number: '52',
              name: 'Jarrad Davis',
              position: 'MLB',
            },
            {
              number: '72',
              name: 'Laurent Duvernay-Tardif',
              position: 'G',
            },
            {
              number: '94',
              name: 'Folorunso Fatukasi',
              position: 'DT',
            },
            {
              number: '67',
              name: 'Dan Feeney',
              position: 'G',
            },
            {
              number: '19',
              name: 'Joe Flacco',
              position: 'QB',
            },
            {
              number: '29',
              name: 'Lamarcus Joyner',
              position: 'FS',
            },
            {
              number: '81',
              name: 'Tyler Kroft',
              position: 'TE',
            },
            {
              number: '20',
              name: 'Marcus Maye',
              position: 'FS',
            },
            {
              number: '69',
              name: 'Conor McDermott',
              position: 'T',
            },
            {
              number: '78',
              name: 'Morgan Moses',
              position: 'T',
            },
            {
              number: '39',
              name: 'Will Parks',
              position: 'SS',
            },
            {
              number: '15',
              name: 'Eddy Piñeiro',
              position: 'K',
            },
            {
              number: '74',
              name: 'Greg Senat',
              position: 'T',
            },
            {
              number: '97',
              name: 'Nathan Shepherd',
              position: 'DT',
            },
          ],
          restrictedFAs: [
            {
              number: '93',
              name: 'Kyle Phillips',
              position: 'DE',
            },
            {
              number: '5',
              name: 'Mike White',
              position: 'QB',
            },
          ],
        },
        NewEnglandPatriots: {
          'datefebruary9, 2022': [],
          quarterbacks: [
            {
              number: '10',
              name: 'Mac Jones',
              position: null,
            },
            {
              number: '4',
              name: 'Jarrett Stidham',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '37',
              name: 'Damien Harris',
              position: null,
            },
            {
              number: '38',
              name: 'Rhamondre Stevenson',
              position: null,
            },
            {
              number: '42',
              name: 'J. J. Taylor',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '15',
              name: 'Nelson Agholor',
              position: null,
            },
            {
              number: '84',
              name: 'Kendrick Bourne',
              position: null,
            },
            {
              number: '1',
              name: "N'Keal Harry",
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '86',
              name: 'Devin Asiasi',
              position: null,
            },
            {
              number: '85',
              name: 'Hunter Henry',
              position: null,
            },
            {
              number: '44',
              name: 'Dalton Keene',
              position: null,
            },
            {
              number: '81',
              name: 'Jonnu Smith',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '60',
              name: 'David Andrews',
              position: 'C',
            },
            {
              number: '72',
              name: 'Yodny Cajuste',
              position: 'T',
            },
            {
              number: '70',
              name: 'Yasir Durant',
              position: 'G',
            },
            {
              number: '75',
              name: 'Justin Herron',
              position: 'T',
            },
            {
              number: '69',
              name: 'Shaq Mason',
              position: 'G',
            },
            {
              number: '71',
              name: 'Michael Onwenu',
              position: 'G',
            },
            {
              number: '76',
              name: 'Isaiah Wynn',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '94',
              name: 'Henry Anderson',
              position: 'DE',
            },
            {
              number: '90',
              name: 'Christian Barmore',
              position: 'DT',
            },
            {
              number: '99',
              name: 'Byron Cowart',
              position: 'DT',
            },
            {
              number: '92',
              name: 'Davon Godchaux',
              position: 'DT',
            },
            {
              number: '93',
              name: 'Lawrence Guy',
              position: 'DT',
            },
            {
              number: '51',
              name: 'Ronnie Perkins',
              position: 'DE',
            },
            {
              number: '50',
              name: 'Chase Winovich',
              position: 'DE',
            },
            {
              number: '91',
              name: 'Deatrich Wise Jr.',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '59',
              name: 'Anfernee Jennings',
              position: 'OLB',
            },
            {
              number: '9',
              name: 'Matthew Judon',
              position: 'OLB',
            },
            {
              number: '52',
              name: 'Harvey Langi',
              position: 'MLB',
            },
            {
              number: '45',
              name: 'Cameron McGrone',
              position: 'OLB',
            },
            {
              number: '46',
              name: 'Raekwon McMillan',
              position: 'MLB',
            },
            {
              number: '48',
              name: 'Jahlani Tavai',
              position: 'MLB',
            },
            {
              number: '55',
              name: 'Josh Uche',
              position: 'OLB',
            },
            {
              number: '53',
              name: 'Kyle Van Noy',
              position: 'OLB',
            },
          ],
          defensiveBacks: [
            {
              number: '29',
              name: 'Justin Bethel',
              position: 'CB',
            },
            {
              number: '24',
              name: 'Joshuah Bledsoe',
              position: 'FS',
            },
            {
              number: '41',
              name: 'Myles Bryant',
              position: 'CB',
            },
            {
              number: '22',
              name: 'Cody Davis',
              position: 'FS',
            },
            {
              number: '23',
              name: 'Kyle Dugger',
              position: 'SS',
            },
            {
              number: '31',
              name: 'Jonathan Jones',
              position: 'CB',
            },
            {
              number: '2',
              name: 'Jalen Mills',
              position: 'CB',
            },
            {
              number: '21',
              name: 'Adrian Phillips',
              position: 'SS',
            },
            {
              number: '26',
              name: 'Shaun Wade',
              position: 'CB',
            },
            {
              number: '33',
              name: 'Joejuan Williams',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '7',
              name: 'Jake Bailey',
              position: 'P',
            },
            {
              number: '49',
              name: 'Joe Cardona',
              position: 'LS',
            },
          ],
          reserveLists: [
            {
              number: '--',
              name: 'Drew Desjarlais',
              position: '',
            },
            {
              number: '95',
              name: 'Daniel Ekuale',
              position: '',
            },
            {
              number: '--',
              name: 'Arlington Hambright',
              position: '',
            },
            {
              number: '97',
              name: 'Bill Murray',
              position: '',
            },
            {
              number: '87',
              name: 'Tre Nixon',
              position: '',
            },
            {
              number: '3',
              name: 'Quinn Nordin',
              position: '',
            },
            {
              number: '34',
              name: 'Devine Ozigbo',
              position: '',
            },
            {
              number: '19',
              name: 'Malcolm Perry',
              position: '',
            },
            {
              number: '68',
              name: 'William Sherman',
              position: '',
            },
            {
              number: '17',
              name: 'Kristian Wilkerson',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '8',
              name: "Ja'Whaun Bentley",
              position: 'MLB',
            },
            {
              number: '25',
              name: 'Brandon Bolden',
              position: 'RB',
            },
            {
              number: '77',
              name: 'Trent Brown',
              position: 'T',
            },
            {
              number: '58',
              name: 'Jamie Collins',
              position: 'OLB',
            },
            {
              number: '98',
              name: 'Carl Davis',
              position: 'DT',
            },
            {
              number: '6',
              name: 'Nick Folk',
              position: 'K',
            },
            {
              number: '88',
              name: 'Troy Fumagalli',
              position: 'TE',
            },
            {
              number: '54',
              name: "Dont'a Hightower",
              position: 'MLB',
            },
            {
              number: '5',
              name: 'Brian Hoyer',
              position: 'QB',
            },
            {
              number: '27',
              name: 'J. C. Jackson',
              position: 'CB',
            },
            {
              number: '67',
              name: 'Ted Karras',
              position: 'C',
            },
            {
              number: '36',
              name: 'Brandon King',
              position: 'OLB',
            },
            {
              number: '32',
              name: 'Devin McCourty',
              position: 'FS',
            },
            {
              number: '18',
              name: 'Matthew Slater',
              position: 'WR',
            },
            {
              number: '28',
              name: 'James White',
              position: 'RB',
            },
          ],
          restrictedFAs: [
            {
              number: '47',
              name: 'Jakob Johnson',
              position: 'FB',
            },
            {
              number: '16',
              name: 'Jakobi Meyers',
              position: 'WR',
            },
            {
              number: '80',
              name: 'Gunner Olszewski',
              position: 'WR',
            },
          ],
        },
        MiamiDolphins: {
          'datefebruary22, 2022': [],
          quarterbacks: [
            {
              number: '--',
              name: 'Chris Streveler',
              position: null,
            },
            {
              number: '1',
              name: 'Tua Tagovailoa',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '37',
              name: 'Myles Gaskin',
              position: null,
            },
            {
              number: '--',
              name: 'John Lovett',
              position: 'FB',
            },
          ],
          wideReceivers: [
            {
              number: '--',
              name: 'Lynn Bowden',
              position: null,
            },
            {
              number: '--',
              name: 'River Cracraft',
              position: null,
            },
            {
              number: '--',
              name: 'Allen Hurns',
              position: null,
            },
            {
              number: '11',
              name: 'DeVante Parker',
              position: null,
            },
            {
              number: '17',
              name: 'Jaylen Waddle',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '82',
              name: 'Cethan Carter',
              position: null,
            },
            {
              number: '84',
              name: 'Hunter Long',
              position: null,
            },
            {
              number: '80',
              name: 'Adam Shaheen',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '79',
              name: 'Larnel Coleman',
              position: 'T',
            },
            {
              number: '77',
              name: 'Jesse Davis',
              position: 'T',
            },
            {
              number: '63',
              name: 'Michael Deiter',
              position: 'C',
            },
            {
              number: '74',
              name: 'Liam Eichenberg',
              position: 'T',
            },
            {
              number: '68',
              name: 'Robert Hunt',
              position: 'G',
            },
            {
              number: '73',
              name: 'Austin Jackson',
              position: 'G',
            },
            {
              number: '65',
              name: 'Robert Jones',
              position: 'T',
            },
            {
              number: '66',
              name: 'Solomon Kindley',
              position: 'G',
            },
            {
              number: '75',
              name: 'Greg Little',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '70',
              name: 'Adam Butler',
              position: 'DE',
            },
            {
              number: '98',
              name: 'Raekwon Davis',
              position: 'NT',
            },
            {
              number: '92',
              name: 'Zach Sieler',
              position: 'DE',
            },
            {
              number: '94',
              name: 'Christian Wilkins',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '55',
              name: 'Jerome Baker',
              position: 'ILB',
            },
            {
              number: '--',
              name: 'Daeshon Hall',
              position: 'OLB',
            },
            {
              number: '41',
              name: 'Darius Hodge',
              position: 'OLB',
            },
            {
              number: '50',
              name: 'Calvin Munson',
              position: 'ILB',
            },
            {
              number: '15',
              name: 'Jaelan Phillips',
              position: 'OLB',
            },
            {
              number: '43',
              name: 'Andrew Van Ginkel',
              position: 'OLB',
            },
          ],
          defensiveBacks: [
            {
              number: '42',
              name: 'Clayton Fejedelem',
              position: 'SS',
            },
            {
              number: '8',
              name: 'Jevon Holland',
              position: 'FS',
            },
            {
              number: '25',
              name: 'Xavien Howard',
              position: 'CB',
            },
            {
              number: '9',
              name: 'Noah Igbinoghene',
              position: 'CB',
            },
            {
              number: '29',
              name: 'Brandon Jones',
              position: 'SS',
            },
            {
              number: '24',
              name: 'Byron Jones',
              position: 'CB',
            },
            {
              number: '21',
              name: 'Eric Rowe',
              position: 'SS',
            },
            {
              number: '6',
              name: 'Trill Williams',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '44',
              name: 'Blake Ferguson',
              position: 'LS',
            },
            {
              number: '7',
              name: 'Jason Sanders',
              position: 'K',
            },
          ],
          reserveLists: [
            {
              number: '19',
              name: 'Cody Core',
              position: '',
            },
            {
              number: '38',
              name: 'Javaris Davis',
              position: '',
            },
            {
              number: '--',
              name: 'DeVonte Dedmon',
              position: '',
            },
            {
              number: '23',
              name: 'Gerrid Doaks',
              position: '',
            },
            {
              number: '78',
              name: 'Adam Pankey',
              position: '',
            },
            {
              number: '--',
              name: "D'Angelo Ross",
              position: '',
            },
            {
              number: '76',
              name: 'Kion Smith',
              position: '',
            },
            {
              number: '--',
              name: 'Quincy Wilson',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '47',
              name: 'Vince Biegel',
              position: 'OLB',
            },
            {
              number: '14',
              name: 'Jacoby Brissett',
              position: 'QB',
            },
            {
              number: '34',
              name: 'Malcolm Brown',
              position: 'RB',
            },
            {
              number: '27',
              name: 'Justin Coleman',
              position: 'CB',
            },
            {
              number: '87',
              name: 'Isaiah Ford',
              position: 'WR',
            },
            {
              number: '3',
              name: 'Will Fuller',
              position: 'WR',
            },
            {
              number: '88',
              name: 'Mike Gesicki',
              position: 'TE',
            },
            {
              number: '86',
              name: 'Mack Hollins',
              position: 'WR',
            },
            {
              number: '90',
              name: 'John Jenkins',
              position: 'NT',
            },
            {
              number: '28',
              name: 'Duke Johnson',
              position: 'RB',
            },
            {
              number: '31',
              name: 'Phillip Lindsay',
              position: 'RB',
            },
            {
              number: '62',
              name: 'Greg Mancz',
              position: 'C',
            },
            {
              number: '30',
              name: 'Jason McCourty',
              position: 'FS',
            },
            {
              number: '91',
              name: 'Emmanuel Ogbah',
              position: 'DE',
            },
            {
              number: '5',
              name: 'Michael Palardy',
              position: 'P',
            },
            {
              number: '45',
              name: 'Duke Riley',
              position: 'ILB',
            },
            {
              number: '52',
              name: 'Elandon Roberts',
              position: 'ILB',
            },
            {
              number: '57',
              name: 'Brennan Scarlett',
              position: 'OLB',
            },
            {
              number: '81',
              name: 'Durham Smythe',
              position: 'TE',
            },
            {
              number: '2',
              name: 'Albert Wilson',
              position: 'WR',
            },
          ],
          restrictedFAs: [
            {
              number: '49',
              name: 'Samuel Eguavoen',
              position: 'ILB',
            },
            {
              number: '32',
              name: 'Patrick Laird',
              position: 'RB',
            },
            {
              number: '40',
              name: 'Nik Needham',
              position: 'CB',
            },
            {
              number: '33',
              name: 'Jamal Perry',
              position: 'CB',
            },
            {
              number: '20',
              name: 'Sheldrick Redwine',
              position: 'FS',
            },
            {
              number: '18',
              name: 'Preston Williams',
              position: 'WR',
            },
          ],
        },
      },
      west: {
        LasVegasRaiders: {
          'datefebruary27, 2022': [],
          quarterbacks: [
            {
              number: '4',
              name: 'Derek Carr',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '23',
              name: 'Kenyan Drake',
              position: null,
            },
            {
              number: '28',
              name: 'Josh Jacobs',
              position: null,
            },
            {
              number: '41',
              name: 'Sutton Smith',
              position: 'FB',
            },
          ],
          wideReceivers: [
            {
              number: '89',
              name: 'Bryan Edwards',
              position: null,
            },
            {
              number: '17',
              name: 'Tyron Johnson',
              position: null,
            },
            {
              number: '13',
              name: 'Hunter Renfrow',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '87',
              name: 'Foster Moreau',
              position: null,
            },
            {
              number: '83',
              name: 'Darren Waller',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '71',
              name: 'Denzelle Good',
              position: 'G',
            },
            {
              number: '68',
              name: 'Andre James',
              position: 'C',
            },
            {
              number: '70',
              name: 'Alex Leatherwood',
              position: 'G',
            },
            {
              number: '--',
              name: 'Jordan Meredith',
              position: 'G',
            },
            {
              number: '74',
              name: 'Kolton Miller',
              position: 'T',
            },
            {
              number: '63',
              name: 'Kamaal Seymour',
              position: 'T',
            },
            {
              number: '76',
              name: 'John Simpson',
              position: 'G',
            },
          ],
          defensiveLinemen: [
            {
              number: '--',
              name: 'Andrew Billings',
              position: 'DT',
            },
            {
              number: '98',
              name: 'Maxx Crosby',
              position: 'DE',
            },
            {
              number: '99',
              name: 'Clelin Ferrell',
              position: 'DE',
            },
            {
              number: '51',
              name: 'Malcolm Koonce',
              position: 'DE',
            },
            {
              number: '94',
              name: 'Carl Nassib',
              position: 'DE',
            },
            {
              number: '91',
              name: 'Yannick Ngakoue',
              position: 'DE',
            },
            {
              number: '95',
              name: 'Kendal Vickers',
              position: 'DT',
            },
          ],
          linebackers: [
            {
              number: '5',
              name: 'Divine Deablo',
              position: 'OLB',
            },
            {
              number: '44',
              name: 'Nick Kwiatkoski',
              position: 'OLB',
            },
            {
              number: '42',
              name: 'Cory Littleton',
              position: 'OLB',
            },
            {
              number: '52',
              name: 'Denzel Perryman',
              position: 'MLB',
            },
          ],
          defensiveBacks: [
            {
              number: '24',
              name: 'Johnathan Abram',
              position: 'SS',
            },
            {
              number: '37',
              name: 'Tyree Gillespie',
              position: 'SS',
            },
            {
              number: '39',
              name: 'Nate Hobbs',
              position: 'CB',
            },
            {
              number: '--',
              name: "Cre'Von LeBlanc",
              position: 'CB',
            },
            {
              number: '25',
              name: 'Trevon Moehrig',
              position: 'FS',
            },
            {
              number: '27',
              name: 'Trayvon Mullen',
              position: 'CB',
            },
            {
              number: '21',
              name: 'Amik Robertson',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '2',
              name: 'Daniel Carlson',
              position: 'K',
            },
            {
              number: '6',
              name: 'A. J. Cole III',
              position: 'P',
            },
            {
              number: '47',
              name: 'Trent Sieg',
              position: 'LS',
            },
          ],
          reserveLists: [
            {
              number: '38',
              name: 'Jordan Brown',
              position: '',
            },
            {
              number: '67',
              name: 'Lester Cotton',
              position: '',
            },
            {
              number: '43',
              name: 'Kavon Frazier',
              position: '',
            },
            {
              number: '65',
              name: 'Hroniss Grasu',
              position: '',
            },
            {
              number: '56',
              name: 'Gerri Green',
              position: '',
            },
            {
              number: '--',
              name: 'Brett Heggie',
              position: '',
            },
            {
              number: '--',
              name: 'Natrell Jamerson',
              position: '',
            },
            {
              number: '54',
              name: 'P. J. Johnson',
              position: '',
            },
            {
              number: '53',
              name: 'Justin March',
              position: '',
            },
            {
              number: '79',
              name: 'Jeremiah Poutasi',
              position: '',
            },
            {
              number: '36',
              name: 'Trey Ragas',
              position: '',
            },
            {
              number: '16',
              name: 'Dillon Stoner',
              position: '',
            },
            {
              number: '--',
              name: 'William Sweet',
              position: '',
            },
            {
              number: '19',
              name: 'D. J. Turner',
              position: '',
            },
            {
              number: '15',
              name: 'Javon Wims',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '31',
              name: 'Peyton Barber',
              position: 'RB',
            },
            {
              number: '85',
              name: 'Derek Carrier',
              position: 'TE',
            },
            {
              number: '72',
              name: 'Jermaine Eluemunor',
              position: 'G',
            },
            {
              number: '35',
              name: 'Brandon Facyson',
              position: 'CB',
            },
            {
              number: '90',
              name: 'Johnathan Hankins',
              position: 'DT',
            },
            {
              number: '29',
              name: 'Casey Hayward',
              position: 'CB',
            },
            {
              number: '64',
              name: 'Richie Incognito',
              position: 'G',
            },
            {
              number: '1',
              name: 'DeSean Jackson',
              position: 'WR',
            },
            {
              number: '77',
              name: 'Quinton Jefferson',
              position: 'DT',
            },
            {
              number: '7',
              name: 'Zay Jones',
              position: 'WR',
            },
            {
              number: '55',
              name: 'Marquel Lee',
              position: 'MLB',
            },
            {
              number: '8',
              name: 'Marcus Mariota',
              position: 'QB',
            },
            {
              number: '66',
              name: 'Nick Martin',
              position: 'C',
            },
            {
              number: '93',
              name: 'Gerald McCoy',
              position: 'DT',
            },
            {
              number: '50',
              name: 'Nicholas Morrow',
              position: 'MLB',
            },
            {
              number: '48',
              name: 'Patrick Onwuasor',
              position: 'MLB',
            },
            {
              number: '75',
              name: 'Brandon Parker',
              position: 'T',
            },
            {
              number: '96',
              name: 'Darius Philon',
              position: 'DT',
            },
            {
              number: '30',
              name: 'Jalen Richard',
              position: 'RB',
            },
            {
              number: '92',
              name: 'Solomon Thomas',
              position: 'DT',
            },
            {
              number: '10',
              name: 'Desmond Trufant',
              position: 'CB',
            },
            {
              number: '58',
              name: 'Kyle Wilber',
              position: 'MLB',
            },
            {
              number: '34',
              name: 'K. J. Wright',
              position: 'OLB',
            },
          ],
          restrictedFAs: [
            {
              number: '78',
              name: 'Jackson Barton',
              position: 'T',
            },
            {
              number: '45',
              name: 'Alec Ingold',
              position: 'FB',
            },
            {
              number: '32',
              name: 'Dallin Leavitt',
              position: 'FS',
            },
            {
              number: '22',
              name: 'Keisean Nixon',
              position: 'CB',
            },
            {
              number: '60',
              name: 'Jordan Simmons',
              position: 'G',
            },
          ],
        },
        DenverBroncos: {
          runningBacks: [
            {
              number: '26',
              name: 'Mike Boone',
              position: null,
            },
            {
              number: '33',
              name: 'Javonte Williams',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '16',
              name: 'Tyrie Cleveland',
              position: null,
            },
            {
              number: '17',
              name: 'DaeSean Hamilton',
              position: null,
            },
            {
              number: '1',
              name: 'K. J. Hamler',
              position: null,
            },
            {
              number: '9',
              name: 'Kendall Hinton',
              position: null,
            },
            {
              number: '10',
              name: 'Jerry Jeudy',
              position: null,
            },
            {
              number: '81',
              name: 'Tim Patrick',
              position: null,
            },
            {
              number: '14',
              name: 'Courtland Sutton',
              position: null,
            },
            {
              number: '19',
              name: 'Seth Williams',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '87',
              name: 'Noah Fant',
              position: null,
            },
            {
              number: '85',
              name: 'Albert Okwuegbunam',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '75',
              name: 'Quinn Bailey',
              position: 'T',
            },
            {
              number: '72',
              name: 'Garett Bolles',
              position: 'T',
            },
            {
              number: '60',
              name: 'Cody Conway',
              position: 'T',
            },
            {
              number: '79',
              name: 'Lloyd Cushenberry',
              position: 'C',
            },
            {
              number: '61',
              name: 'Graham Glasgow',
              position: 'G',
            },
            {
              number: '77',
              name: 'Quinn Meinerz',
              position: 'G',
            },
            {
              number: '52',
              name: 'Netane Muti',
              position: 'G',
            },
            {
              number: '66',
              name: 'Dalton Risner',
              position: 'G',
            },
          ],
          defensiveLinemen: [
            {
              number: '95',
              name: 'McTelvin Agim',
              position: 'DE',
            },
            {
              number: '92',
              name: 'Jonathan Harris',
              position: 'DE',
            },
            {
              number: '96',
              name: 'Shelby Harris',
              position: 'DE',
            },
            {
              number: '93',
              name: "Dre'Mont Jones",
              position: 'DE',
            },
            {
              number: '98',
              name: 'Mike Purcell',
              position: 'NT',
            },
          ],
          linebackers: [
            {
              number: '56',
              name: 'Baron Browning',
              position: 'ILB',
            },
            {
              number: '55',
              name: 'Bradley Chubb',
              position: 'OLB',
            },
            {
              number: '53',
              name: 'Jonathon Cooper',
              position: 'OLB',
            },
            {
              number: '48',
              name: 'Andre Mintze',
              position: 'OLB',
            },
            {
              number: '94',
              name: 'Aaron Patrick',
              position: 'OLB',
            },
            {
              number: '40',
              name: 'Justin Strnad',
              position: 'ILB',
            },
          ],
          defensiveBacks: [
            {
              number: '34',
              name: 'Essang Bassey',
              position: 'CB',
            },
            {
              number: '21',
              name: 'Ronald Darby',
              position: 'CB',
            },
            {
              number: '49',
              name: 'Jamar Johnson',
              position: 'SS',
            },
            {
              number: '13',
              name: 'Michael Ojemudia',
              position: 'CB',
            },
            {
              number: '31',
              name: 'Justin Simmons',
              position: 'FS',
            },
            {
              number: '30',
              name: 'Caden Sterns',
              position: 'FS',
            },
            {
              number: '2',
              name: 'Patrick Surtain II',
              position: 'CB',
            },
          ],
          specialTeams: [
            {
              number: '46',
              name: 'Jacob Bobenmoyer',
              position: 'LS',
            },
            {
              number: '6',
              name: 'Sam Martin',
              position: 'P',
            },
            {
              number: '8',
              name: 'Brandon McManus',
              position: 'K',
            },
            {
              number: '--',
              name: 'Corliss Waitman',
              position: 'P',
            },
          ],
          reserveLists: [
            {
              number: '88',
              name: 'Shaun Beyer',
              position: '',
            },
            {
              number: '28',
              name: 'Damarea Crockett',
              position: '',
            },
            {
              number: '17',
              name: 'Travis Fulgham',
              position: '',
            },
            {
              number: '78',
              name: 'Drew Himmelman',
              position: '',
            },
            {
              number: '68',
              name: 'Zack Johnson',
              position: '',
            },
            {
              number: '61',
              name: 'Jonathan Kongbo',
              position: '',
            },
            {
              number: '51',
              name: 'Marquiss Spencer',
              position: '',
            },
            {
              number: '--',
              name: 'Casey Tucker',
              position: '',
            },
            {
              number: '54',
              name: 'Barrington Wade',
              position: '',
            },
          ],
          practiceSquad: [],
          unrestrictedFAs: [
            {
              number: '5',
              name: 'Teddy Bridgewater',
              position: 'QB',
            },
            {
              number: '29',
              name: 'Bryce Callahan',
              position: 'CB',
            },
            {
              number: '73',
              name: 'Cameron Fleming',
              position: 'T',
            },
            {
              number: '12',
              name: 'Mike Ford',
              position: 'CB',
            },
            {
              number: '23',
              name: 'Kyle Fuller',
              position: 'CB',
            },
            {
              number: '25',
              name: 'Melvin Gordon',
              position: 'RB',
            },
            {
              number: '27',
              name: 'Nate Hairston',
              position: 'CB',
            },
            {
              number: '22',
              name: 'Kareem Jackson',
              position: 'SS',
            },
            {
              number: '47',
              name: 'Josey Jewell',
              position: 'ILB',
            },
            {
              number: '45',
              name: 'A. J. Johnson',
              position: 'ILB',
            },
            {
              number: '65',
              name: 'Brett Jones',
              position: 'C',
            },
            {
              number: '43',
              name: 'Micah Kiser',
              position: 'ILB',
            },
            {
              number: '70',
              name: 'Bobby Massie',
              position: 'T',
            },
            {
              number: '82',
              name: 'Eric Saubert',
              position: 'TE',
            },
            {
              number: '99',
              name: 'Shamar Stephen',
              position: 'DE',
            },
            {
              number: '91',
              name: 'Stephen Weatherly',
              position: 'OLB',
            },
            {
              number: '41',
              name: 'Kenny Young',
              position: 'ILB',
            },
          ],
          restrictedFAs: [
            {
              number: '76',
              name: 'Calvin Anderson',
              position: 'T',
            },
            {
              number: '83',
              name: 'Andrew Beck',
              position: 'TE',
            },
            {
              number: '74',
              name: 'Justin Hamilton',
              position: 'NT',
            },
            {
              number: '57',
              name: 'Natrez Patrick',
              position: 'OLB',
            },
            {
              number: '59',
              name: 'Malik Reed',
              position: 'OLB',
            },
            {
              number: '71',
              name: 'Austin Schlottmann',
              position: 'G',
            },
            {
              number: '11',
              name: 'Diontae Spencer',
              position: 'WR',
            },
            {
              number: '90',
              name: 'DeShawn Williams',
              position: 'NT',
            },
          ],
        },
        LosAngelesChargers: {
          quarterbacks: [
            {
              number: '10',
              name: 'Justin Herbert',
              position: null,
            },
            {
              number: '2',
              name: 'Easton Stick',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '30',
              name: 'Austin Ekeler',
              position: null,
            },
            {
              number: '27',
              name: 'Joshua Kelley',
              position: null,
            },
            {
              number: '40',
              name: 'Gabe Nabers',
              position: 'FB',
            },
            {
              number: '35',
              name: 'Larry Rountree III',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '13',
              name: 'Keenan Allen',
              position: null,
            },
            {
              number: '5',
              name: 'Josh Palmer',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '88',
              name: "Tre' McKitty",
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '75',
              name: 'Bryan Bulaga',
              position: 'T',
            },
            {
              number: '71',
              name: 'Matt Feiler',
              position: 'G',
            },
            {
              number: '64',
              name: 'Brenden Jaimes',
              position: 'G',
            },
            {
              number: '63',
              name: 'Corey Linsley',
              position: 'C',
            },
            {
              number: '79',
              name: 'Trey Pipkins',
              position: 'T',
            },
            {
              number: '70',
              name: 'Rashawn Slater',
              position: 'T',
            },
          ],
          defensiveLinemen: [
            {
              number: '96',
              name: 'Breiden Fehoko',
              position: 'DE',
            },
            {
              number: '92',
              name: 'Joe Gaziano',
              position: 'DE',
            },
            {
              number: '99',
              name: 'Jerry Tillery',
              position: 'DE',
            },
          ],
          linebackers: [
            {
              number: '97',
              name: 'Joey Bosa',
              position: 'OLB',
            },
            {
              number: '53',
              name: 'Damon Lloyd',
              position: 'ILB',
            },
            {
              number: '9',
              name: 'Kenneth Murray',
              position: 'ILB',
            },
            {
              number: '31',
              name: 'Nick Niemann',
              position: 'ILB',
            },
            {
              number: '57',
              name: 'Amen Ogbongbemiga',
              position: 'ILB',
            },
            {
              number: '94',
              name: 'Chris Rumph II',
              position: 'OLB',
            },
            {
              number: '49',
              name: 'Drue Tranquill',
              position: 'ILB',
            },
          ],
          defensiveBacks: [
            {
              number: '24',
              name: 'Nasir Adderley',
              position: 'FS',
            },
            {
              number: '20',
              name: 'Tevaughn Campbell',
              position: 'CB',
            },
            {
              number: '43',
              name: 'Michael Davis',
              position: 'CB',
            },
            {
              number: '32',
              name: 'Alohi Gilman',
              position: 'SS',
            },
            {
              number: '37',
              name: 'Kemon Hall',
              position: 'CB',
            },
            {
              number: '33',
              name: 'Derwin James',
              position: 'SS',
            },
            {
              number: '26',
              name: 'Asante Samuel Jr.',
              position: 'CB',
            },
            {
              number: '29',
              name: 'Mark Webb',
              position: 'FS',
            },
          ],
          specialTeams: [],
          reserveLists: [
            {
              number: '83',
              name: 'Michael Bandy',
              position: '',
            },
            {
              number: '90',
              name: 'Andrew Brown',
              position: '',
            },
            {
              number: '50',
              name: 'Cole Christiansen',
              position: '',
            },
            {
              number: '--',
              name: 'Jamal Davis',
              position: '',
            },
            {
              number: '46',
              name: 'Ben DeLuca',
              position: '',
            },
            {
              number: '51',
              name: 'Emeke Egbule',
              position: '',
            },
            {
              number: '80',
              name: 'Maurice Ffrench',
              position: '',
            },
            {
              number: '67',
              name: 'Ryan Hunter',
              position: '',
            },
            {
              number: '47',
              name: 'Hunter Kampmoyer',
              position: '',
            },
            {
              number: '91',
              name: 'Forrest Merrill',
              position: '',
            },
            {
              number: '11',
              name: 'Jason Moore',
              position: '',
            },
            {
              number: '12',
              name: 'Joe Reed',
              position: '',
            },
            {
              number: '73',
              name: 'Foster Sarell',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '76',
              name: 'Oday Aboushi',
              position: 'G',
            },
            {
              number: '82',
              name: 'Stephen Anderson',
              position: 'TE',
            },
            {
              number: '87',
              name: 'Jared Cook',
              position: 'TE',
            },
            {
              number: '95',
              name: 'Christian Covington',
              position: 'DE',
            },
            {
              number: '4',
              name: 'Chase Daniel',
              position: 'QB',
            },
            {
              number: '52',
              name: 'Kyler Fackrell',
              position: 'OLB',
            },
            {
              number: '25',
              name: 'Chris Harris Jr.',
              position: 'CB',
            },
            {
              number: '28',
              name: 'Davontae Harris',
              position: 'CB',
            },
            {
              number: '6',
              name: 'Dustin Hopkins',
              position: 'K',
            },
            {
              number: '22',
              name: 'Justin Jackson',
              position: 'RB',
            },
            {
              number: '93',
              name: 'Justin Jones',
              position: 'DE',
            },
            {
              number: '98',
              name: 'Linval Joseph',
              position: 'NT',
            },
            {
              number: '68',
              name: 'Senio Kelemete',
              position: 'G',
            },
            {
              number: '42',
              name: 'Uchenna Nwosu',
              position: 'OLB',
            },
            {
              number: '54',
              name: 'Matt Overton',
              position: 'LS',
            },
            {
              number: '61',
              name: 'Scott Quessenberry',
              position: 'C',
            },
            {
              number: '7',
              name: 'Andre Roberts',
              position: 'WR',
            },
            {
              number: '72',
              name: 'Michael Schofield',
              position: 'G',
            },
            {
              number: '23',
              name: 'Ryan Smith',
              position: 'CB',
            },
            {
              number: '44',
              name: 'Kyzir White',
              position: 'ILB',
            },
            {
              number: '81',
              name: 'Mike Williams',
              position: 'WR',
            },
          ],
          restrictedFAs: [
            {
              number: '1',
              name: 'Ty Long',
              position: 'P',
            },
            {
              number: '36',
              name: 'Trey Marshall',
              position: 'SS',
            },
          ],
        },
        KansasCityChiefs: {
          'datefebruary21, 2022': [],
          quarterbacks: [
            {
              number: '6',
              name: 'Shane Buechele',
              position: null,
            },
            {
              number: '15',
              name: 'Patrick Mahomes',
              position: null,
            },
          ],
          runningBacks: [
            {
              number: '25',
              name: 'Clyde Edwards-Helaire',
              position: null,
            },
          ],
          wideReceivers: [
            {
              number: '17',
              name: 'Mecole Hardman',
              position: null,
            },
            {
              number: '10',
              name: 'Tyreek Hill',
              position: null,
            },
          ],
          tightEnds: [
            {
              number: '83',
              name: 'Noah Gray',
              position: null,
            },
            {
              number: '87',
              name: 'Travis Kelce',
              position: null,
            },
          ],
          offensiveLinemen: [
            {
              number: '73',
              name: 'Nick Allegretti',
              position: 'G',
            },
            {
              number: '52',
              name: 'Creed Humphrey',
              position: 'C',
            },
            {
              number: '67',
              name: 'Lucas Niang',
              position: 'T',
            },
            {
              number: '65',
              name: 'Trey Smith',
              position: 'G',
            },
            {
              number: '70',
              name: 'Prince Tega Wanogho',
              position: 'T',
            },
            {
              number: '62',
              name: 'Joe Thuney',
              position: 'G',
            },
          ],
          defensiveLinemen: [
            {
              number: '55',
              name: 'Frank Clark',
              position: '',
            },
            {
              number: '51',
              name: 'Mike Danna',
              position: 'DE',
            },
            {
              number: '70',
              name: 'Malik Herring',
              position: 'DE',
            },
            {
              number: '95',
              name: 'Chris Jones',
              position: 'DT',
            },
            {
              number: '59',
              name: 'Joshua Kaindoh',
              position: 'DE',
            },
            {
              number: '99',
              name: 'Khalen Saunders',
              position: 'DT',
            },
            {
              number: '98',
              name: 'Tershawn Wharton',
              position: 'DT',
            },
          ],
          linebackers: [
            {
              number: '54',
              name: 'Nick Bolton',
              position: 'OLB',
            },
            {
              number: '50',
              name: 'Willie Gay',
              position: 'OLB',
            },
          ],
          defensiveBacks: [
            {
              number: '39',
              name: 'Zayne Anderson',
              position: 'FS',
            },
            {
              number: '27',
              name: 'Rashad Fenton',
              position: 'CB',
            },
            {
              number: '38',
              name: "L'Jarius Sneed",
              position: 'CB',
            },
            {
              number: '22',
              name: 'Juan Thornhill',
              position: 'FS',
            },
          ],
          specialTeams: [
            {
              number: '7',
              name: 'Harrison Butker',
              position: 'K',
            },
            {
              number: '5',
              name: 'Tommy Townsend',
              position: 'P',
            },
            {
              number: '41',
              name: 'James Winchester',
              position: 'LS',
            },
          ],
          reserveLists: [
            {
              number: '--',
              name: 'Omar ﻿Bayless',
              position: '',
            },
            {
              number: '2',
              name: 'Dicaprio Bootle',
              position: '',
            },
            {
              number: '79',
              name: 'Cortez Broughton',
              position: '',
            },
            {
              number: '84',
              name: 'Matt Bushman',
              position: '',
            },
            {
              number: '92',
              name: 'Shilique Calhoun',
              position: '',
            },
            {
              number: '--',
              name: 'Brandin Dandridge',
              position: '',
            },
            {
              number: '12',
              name: 'Gehrig Dieter',
              position: '',
            },
            {
              number: '60',
              name: 'Austin Edwards',
              position: '',
            },
            {
              number: '--',
              name: 'Chris Finke',
              position: '',
            },
            {
              number: '82',
              name: 'Daurice Fountain',
              position: '',
            },
            {
              number: '--',
              name: 'Jordan Franks',
              position: '',
            },
            {
              number: '48',
              name: 'Nakia Griffin-Stewart',
              position: '',
            },
            {
              number: '19',
              name: 'Josh Gordon',
              position: '',
            },
            {
              number: '47',
              name: 'Darius Harris',
              position: '',
            },
            {
              number: '--',
              name: 'Gary Jennings Jr.',
              position: '',
            },
            {
              number: '--',
              name: 'Roderick Johnson',
              position: '',
            },
            {
              number:
                '<!-- DO NOT add 24. Melvin Ingram, a defensive player, already had this number and per NFL rules, even in the offseason and preseason, two players on the same side of the ball CANNOT have the same number. -->--',
              name: 'Devon Key',
              position: '',
            },
            {
              number: '--',
              name: 'Brenden Knox',
              position: '',
            },
            {
              number: '--',
              name: 'Lorenzo Neal',
              position: '',
            },
            {
              number: '--',
              name: 'Josh Pederson',
              position: '',
            },
            {
              number: '14',
              name: 'Cornell Powell',
              position: '',
            },
            {
              number: '--',
              name: 'Mathew Sexton',
              position: '',
            },
            {
              number: '--',
              name: 'Darius Stills',
              position: '',
            },
            {
              number: '80',
              name: 'Mark Vital',
              position: '',
            },
            {
              number: '--',
              name: 'Justin Watson',
              position: '',
            },
            {
              number: '64',
              name: 'Darryl Williams',
              position: '',
            },
            {
              number: '--',
              name: 'Jonathan Woodard',
              position: '',
            },
          ],
          unrestrictedFAs: [
            {
              number: '81',
              name: 'Blake Bell',
              position: 'TE',
            },
            {
              number: '66',
              name: 'Austin Blythe',
              position: 'C',
            },
            {
              number: '57',
              name: 'Orlando Brown Jr.',
              position: 'T',
            },
            {
              number: '45',
              name: 'Michael Burton',
              position: '',
            },
            {
              number: '4',
              name: 'Chad Henne',
              position: 'QB',
            },
            {
              number: '21',
              name: 'Mike Hughes',
              position: '',
            },
            {
              number: '24',
              name: 'Melvin Ingram',
              position: 'OLB/<!-- DO NOT remove DE. He is listed as OLB/DE -->DE',
            },
            {
              number: '85',
              name: 'Marcus Kemp',
              position: 'WR',
            },
            {
              number: '69',
              name: 'Kyle Long',
              position: 'G',
            },
            {
              number: '32',
              name: 'Tyrann Mathieu',
              position: 'SS',
            },
            {
              number: '1',
              name: 'Jerick McKinnon',
              position: 'RB',
            },
            {
              number: '56',
              name: 'Ben Niemann',
              position: 'MLB',
            },
            {
              number: '91',
              name: 'Derrick Nnadi',
              position: 'DT',
            },
            {
              number: '44',
              name: "Dorian O'Daniel",
              position: 'OLB',
            },
            {
              number: '97',
              name: 'Alex Okafor',
              position: 'DE',
            },
            {
              number: '13',
              name: 'Byron Pringle',
              position: 'WR',
            },
            {
              number: '90',
              name: 'Jarran Reed',
              position: 'DT',
            },
            {
              number: '75',
              name: 'Mike Remmers',
              position: 'T',
            },
            {
              number: '11',
              name: 'Demarcus Robinson',
              position: 'WR',
            },
            {
              number: '49',
              name: 'Daniel Sorensen',
              position: 'FS',
            },
            {
              number: '35',
              name: 'Charvarius Ward',
              position: 'CB',
            },
            {
              number: '23',
              name: 'Armani Watts',
              position: 'SS',
            },
            {
              number: '31',
              name: 'Darrel Williams',
              position: 'RB',
            },
            {
              number: '77',
              name: 'Andrew Wylie',
              position: 'G',
            },
          ],
        },
      },
    },
  });
}, []);
