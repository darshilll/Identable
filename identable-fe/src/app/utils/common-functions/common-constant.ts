export class commonConstant {
  public static aiFormality = ['causal', 'neutral', 'formal'];

  public static aiTone = [
    'personable',
    'confident',
    'empathetic',
    'engaging',
    'witty',
    'direct',
  ];

  public static pointOfView = [
    'First person singular(i, me, my, mine)',
    'First person plural(we, us, our, ours)',
    'Second person(you, your, yours)',
    'Third person(he, she, it, they)',
  ];

  public static aiLanguage = [
    { language: 'North American English', flag: 'assets/images/US.svg' },
    { language: 'British English', flag: 'assets/images/flag-uk.svg' },
    { language: 'Scottish English', flag: 'assets/images/flag-uk.svg' },
    { language: 'Irish English', flag: 'assets/images/IE.svg' },
    { language: 'Australian English', flag: 'assets/images/AU.svg' },
    { language: 'New Zealand English', flag: 'assets/images/NZ.svg' },
  ];

  public static timePeriod = [
    { period: 'Morning', isAvailable: true },
    { period: 'Lunchtime', isAvailable: true },
    { period: 'Evening', isAvailable: true },
    { period: 'After-work', isAvailable: true },
  ];

  public static timeSlotList = [
    {
      meridiem: 'AM',
      time: [
        { time: '7:00', isAvailable: true },
        { time: '7:30', isAvailable: true },
        { time: '8:00', isAvailable: true },
        { time: '8:30', isAvailable: true },
        { time: '9:00', isAvailable: true },
      ],
    },
    {
      meridiem: 'PM',
      time: [
        { time: '12:00', isAvailable: true },
        { time: '12:30', isAvailable: true },
        { time: '1:00', isAvailable: true },
      ],
    },
    {
      meridiem: 'PM',
      time: [
        { time: '5:00', isAvailable: true },
        { time: '5:30', isAvailable: true },
        { time: '6:00', isAvailable: true },
        { time: '6:30', isAvailable: true },
        { time: '7:00', isAvailable: true },
      ],
    },
    {
      meridiem: 'PM',
      time: [
        { time: '8:00', isAvailable: true },
        { time: '8:30', isAvailable: true },
        { time: '9:00', isAvailable: true },
        { time: '9:30', isAvailable: true },
        { time: '10:00', isAvailable: true },
      ],
    },
  ];

  public static editPostPromptAction = {
    EXPAND: 'expand',
    REWRITE: 'rewritePost',
  };

  public static POSTMEDIATYPE = {
    IMAGE: 'image',
    VIDEO: 'video',
    GIPHY: 'giphy',
    CAROUSEL: 'carousel',
    AI_VIDEO: 'aivideo',
  };

  public static POSTGENERATETYPE = {
    INSPIRE_ME: 'inspireMe',
    TRENDING_NEWS: 'trendingNews',
    DIY_STRATEGY: 'diyStrategy',
    CAROUSEL: 'carousel',
    AI_VIDEO: 'aivideo',
    ARTICLE: 'article',
  };

  public static POSTSTATUS = {
    POSTED: 'posted',
    SCHEDULED: 'scheduled',
    DRAFT: 'draft',
    ERROR: 'error',
    POSTING: 'posting',
  };

  public static caruselPromtTheme = [
    'General',
    'Pain Points',
    'Common Mistakes',
    'Misconceptions',
    'eBook',
  ];

  public static versionPromtTheme = [
    {
      item: 'Case study/client testimonial',
      isReadOnly: false,
    },
    {
      item: 'Personal Story',
      isReadOnly: false,
    },
    {
      item: 'Big mistakes in you industry',
      isReadOnly: false,
    },
    {
      item: 'Call out industry myths and BS',
      isReadOnly: false,
    },
    {
      item: 'Give a contrarian POV',
      isReadOnly: false,
    },
    {
      item: 'Make a predication for the future',
      isReadOnly: false,
    },
    {
      item: 'Describe a recent client win',
      isReadOnly: false,
    },
    {
      item: 'Step-bt-step guide',
      isReadOnly: false,
    },
    {
      item: 'Unpopular opinion',
      isReadOnly: false,
    },
    {
      item: 'A cheatsheet',
      isReadOnly: false,
    },
    {
      item: 'A fill-in-the-blank template',
      isReadOnly: false,
    },
    {
      item: 'Old way vs new way of doing things',
      isReadOnly: false,
    },
    {
      item: 'Worst advice you ever heard',
      isReadOnly: false,
    },
    {
      item: 'A funny moment in your week',
      isReadOnly: false,
    },
  ];

  public static AIVIDEOGENERATE = {
    SAMPLE_URL:
      'https://firebasestorage.googleapis.com/v0/b/storage.getvidon.com/o/video%2FIMeHhxaRza%2Frender%2FRQboiUddhZ%2Fvideo.mp4?alt=media',
  };

  public static timeZoneArray = [
    { id: 'Europe/Berlin', name: '(GMT+01:00) Central European Time - Berlin' },
    { id: 'Pacific/Niue', name: '(GMT-11:00) Niue Time' },
    { id: 'Pacific/Pago_Pago', name: '(GMT-11:00) Samoa Standard Time' },
    { id: 'Pacific/Rarotonga', name: '(GMT-10:00) Cook Islands Standard Time' },
    {
      id: 'Pacific/Honolulu',
      name: '(GMT-10:00) Hawaii-Aleutian Standard Time',
    },
    { id: 'America/Adak', name: '(GMT-10:00) Hawaii-Aleutian Time' },
    { id: 'Pacific/Tahiti', name: '(GMT-10:00) Tahiti Time' },
    { id: 'Pacific/Marquesas', name: '(GMT-09:30) Marquesas Time' },
    { id: 'America/Anchorage', name: '(GMT-09:00) Alaska Time - Anchorage' },
    { id: 'America/Juneau', name: '(GMT-09:00) Alaska Time - Juneau' },
    { id: 'America/Metlakatla', name: '(GMT-09:00) Alaska Time - Metlakatla' },
    { id: 'America/Nome', name: '(GMT-09:00) Alaska Time - Nome' },
    { id: 'America/Sitka', name: '(GMT-09:00) Alaska Time - Sitka' },
    { id: 'America/Yakutat', name: '(GMT-09:00) Alaska Time - Yakutat' },
    { id: 'Pacific/Gambier', name: '(GMT-09:00) Gambier Time' },
    {
      id: 'America/Los_Angeles',
      name: '(GMT-08:00) Pacific Time - Los Angeles',
    },
    { id: 'America/Tijuana', name: '(GMT-08:00) Pacific Time - Tijuana' },
    { id: 'America/Vancouver', name: '(GMT-08:00) Pacific Time - Vancouver' },
    { id: 'Pacific/Pitcairn', name: '(GMT-08:00) Pitcairn Time' },
    {
      id: 'America/Hermosillo',
      name: '(GMT-07:00) Mexican Pacific Standard Time',
    },
    {
      id: 'America/Chihuahua',
      name: '(GMT-07:00) Mexican Pacific Time - Chihuahua',
    },
    {
      id: 'America/Mazatlan',
      name: '(GMT-07:00) Mexican Pacific Time - Mazatlan',
    },
    {
      id: 'America/Dawson_Creek',
      name: '(GMT-07:00) Mountain Standard Time - Dawson Creek',
    },
    {
      id: 'America/Fort_Nelson',
      name: '(GMT-07:00) Mountain Standard Time - Fort Nelson',
    },
    {
      id: 'America/Phoenix',
      name: '(GMT-07:00) Mountain Standard Time - Phoenix',
    },
    { id: 'America/Boise', name: '(GMT-07:00) Mountain Time - Boise' },
    {
      id: 'America/Cambridge_Bay',
      name: '(GMT-07:00) Mountain Time - Cambridge Bay',
    },
    { id: 'America/Denver', name: '(GMT-07:00) Mountain Time - Denver' },
    { id: 'America/Edmonton', name: '(GMT-07:00) Mountain Time - Edmonton' },
    { id: 'America/Inuvik', name: '(GMT-07:00) Mountain Time - Inuvik' },
    { id: 'America/Ojinaga', name: '(GMT-07:00) Mountain Time - Ojinaga' },
    {
      id: 'America/Yellowknife',
      name: '(GMT-07:00) Mountain Time - Yellowknife',
    },
    { id: 'America/Dawson', name: '(GMT-07:00) Yukon Time - Dawson' },
    { id: 'America/Whitehorse', name: '(GMT-07:00) Yukon Time - Whitehorse' },
    {
      id: 'America/Belize',
      name: '(GMT-06:00) Central Standard Time - Belize',
    },
    {
      id: 'America/Costa_Rica',
      name: '(GMT-06:00) Central Standard Time - Costa Rica',
    },
    {
      id: 'America/El_Salvador',
      name: '(GMT-06:00) Central Standard Time - El Salvador',
    },
    {
      id: 'America/Guatemala',
      name: '(GMT-06:00) Central Standard Time - Guatemala',
    },
    {
      id: 'America/Managua',
      name: '(GMT-06:00) Central Standard Time - Managua',
    },
    {
      id: 'America/Regina',
      name: '(GMT-06:00) Central Standard Time - Regina',
    },
    {
      id: 'America/Tegucigalpa',
      name: '(GMT-06:00) Central Standard Time - Tegucigalpa',
    },
    { id: 'America/Chicago', name: '(GMT-06:00) Central Time - Chicago' },
    { id: 'America/Matamoros', name: '(GMT-06:00) Central Time - Matamoros' },
    { id: 'America/Menominee', name: '(GMT-06:00) Central Time - Menominee' },
    { id: 'America/Merida', name: '(GMT-06:00) Central Time - Merida' },
    {
      id: 'America/Mexico_City',
      name: '(GMT-06:00) Central Time - Mexico City',
    },
    { id: 'America/Monterrey', name: '(GMT-06:00) Central Time - Monterrey' },
    {
      id: 'America/North_Dakota/Beulah',
      name: '(GMT-06:00) Central Time - North Dakota - Beulah',
    },
    {
      id: 'America/North_Dakota/Center',
      name: '(GMT-06:00) Central Time - North Dakota - Center',
    },
    {
      id: 'America/North_Dakota/New_Salem',
      name: '(GMT-06:00) Central Time - North Dakota - New Salem',
    },
    {
      id: 'America/Rainy_River',
      name: '(GMT-06:00) Central Time - Rainy River',
    },
    {
      id: 'America/Rankin_Inlet',
      name: '(GMT-06:00) Central Time - Rankin Inlet',
    },
    { id: 'America/Resolute', name: '(GMT-06:00) Central Time - Resolute' },
    { id: 'America/Winnipeg', name: '(GMT-06:00) Central Time - Winnipeg' },
    { id: 'Pacific/Galapagos', name: '(GMT-06:00) Galapagos Time' },
    { id: 'America/Bogota', name: '(GMT-05:00) Colombia Standard Time' },
    {
      id: 'America/Cancun',
      name: '(GMT-05:00) Eastern Standard Time - Cancun',
    },
    {
      id: 'America/Jamaica',
      name: '(GMT-05:00) Eastern Standard Time - Jamaica',
    },
    { id: 'America/New_York', name: '(GMT-05:00) Eastern Time - New York' },
    {
      id: 'America/Indiana/Indianapolis',
      name: '(GMT-05:00) Eastern Time - Indiana - Indianapolis',
    },
    {
      id: 'America/Indiana/Marengo',
      name: '(GMT-05:00) Eastern Time - Indiana - Marengo',
    },
    {
      id: 'America/Indiana/Petersburg',
      name: '(GMT-05:00) Eastern Time - Indiana - Petersburg',
    },
    {
      id: 'America/Indiana/Vevay',
      name: '(GMT-05:00) Eastern Time - Indiana - Vevay',
    },
    {
      id: 'America/Indiana/Vincennes',
      name: '(GMT-05:00) Eastern Time - Indiana - Vincennes',
    },
    {
      id: 'America/Indiana/Winamac',
      name: '(GMT-05:00) Eastern Time - Indiana - Winamac',
    },
    { id: 'America/Iqaluit', name: '(GMT-05:00) Eastern Time - Iqaluit' },
    {
      id: 'America/Kentucky/Louisville',
      name: '(GMT-05:00) Eastern Time - Kentucky - Louisville',
    },
    {
      id: 'America/Kentucky/Monticello',
      name: '(GMT-05:00) Eastern Time - Kentucky - Monticello',
    },
    { id: 'America/Nassau', name: '(GMT-05:00) Eastern Time - Nassau' },
    { id: 'America/Panama', name: '(GMT-05:00) Eastern Time - Panama' },
    {
      id: 'America/Port-au-Prince',
      name: '(GMT-05:00) Eastern Time - Port-au-Prince',
    },
    { id: 'America/Toronto', name: '(GMT-05:00) Eastern Time - Toronto' },
    {
      id: 'America/Atikokan',
      name: '(GMT-05:00) Eastern Standard Time - Atikokan',
    },
    {
      id: 'America/Detroit',
      name: '(GMT-05:00) Eastern Standard Time - Detroit',
    },
    {
      id: 'America/Fort_Wayne',
      name: '(GMT-05:00) Eastern Standard Time - Fort Wayne',
    },
    {
      id: 'America/Grand_Turk',
      name: '(GMT-05:00) Eastern Standard Time - Grand Turk',
    },
    {
      id: 'America/Indiana/Tell_City',
      name: '(GMT-05:00) Eastern Standard Time - Tell City',
    },
    {
      id: 'America/Indiana/Veedersburg',
      name: '(GMT-05:00) Eastern Standard Time - Veedersburg',
    },
    {
      id: 'America/Indiana/Winchester',
      name: '(GMT-05:00) Eastern Standard Time - Winchester',
    },
    {
      id: 'America/Kralendijk',
      name: '(GMT-04:00) Atlantic Standard Time - Kralendijk',
    },
    { id: 'America/La_Paz', name: '(GMT-04:00) Bolivia Time' },
    { id: 'America/Manaus', name: '(GMT-04:00) Amazon Time - Manaus' },
    { id: 'America/Boa_Vista', name: '(GMT-04:00) Amazon Time - Boa Vista' },
    { id: 'America/Eirunepe', name: '(GMT-04:00) Amazon Time - Eirunepe' },
    {
      id: 'America/Porto_Velho',
      name: '(GMT-04:00) Amazon Time - Porto Velho',
    },
    { id: 'America/Rio_Branco', name: '(GMT-04:00) Amazon Time - Rio Branco' },
    {
      id: 'America/Barbados',
      name: '(GMT-04:00) Atlantic Standard Time - Barbados',
    },
    {
      id: 'America/Blanc-Sablon',
      name: '(GMT-04:00) Atlantic Standard Time - Blanc-Sablon',
    },
    {
      id: 'America/Curacao',
      name: '(GMT-04:00) Atlantic Standard Time - Curacao',
    },
    {
      id: 'America/Glace_Bay',
      name: '(GMT-04:00) Atlantic Standard Time - Glace Bay',
    },
    {
      id: 'America/Goose_Bay',
      name: '(GMT-04:00) Atlantic Standard Time - Goose Bay',
    },
    {
      id: 'America/Halifax',
      name: '(GMT-04:00) Atlantic Standard Time - Halifax',
    },
    {
      id: 'America/Moncton',
      name: '(GMT-04:00) Atlantic Standard Time - Moncton',
    },
    { id: 'America/Thule', name: '(GMT-04:00) Atlantic Standard Time - Thule' },
    { id: 'America/Anguilla', name: '(GMT-04:00) Atlantic Time - Anguilla' },
    { id: 'America/Antigua', name: '(GMT-04:00) Atlantic Time - Antigua' },
    { id: 'America/Aruba', name: '(GMT-04:00) Atlantic Time - Aruba' },
    { id: 'America/Barbados', name: '(GMT-04:00) Atlantic Time - Barbados' },
    {
      id: 'America/Blanc-Sablon',
      name: '(GMT-04:00) Atlantic Time - Blanc-Sablon',
    },
    { id: 'America/Curacao', name: '(GMT-04:00) Atlantic Time - Curacao' },
    { id: 'America/Dominica', name: '(GMT-04:00) Atlantic Time - Dominica' },
    { id: 'America/Grenada', name: '(GMT-04:00) Atlantic Time - Grenada' },
    {
      id: 'America/Guadeloupe',
      name: '(GMT-04:00) Atlantic Time - Guadeloupe',
    },
    {
      id: 'America/Kralendijk',
      name: '(GMT-04:00) Atlantic Time - Kralendijk',
    },
    {
      id: 'America/Lower_Princes',
      name: '(GMT-04:00) Atlantic Time - Lower Princes',
    },
    { id: 'America/Marigot', name: '(GMT-04:00) Atlantic Time - Marigot' },
    {
      id: 'America/Martinique',
      name: '(GMT-04:00) Atlantic Time - Martinique',
    },
    {
      id: 'America/Montserrat',
      name: '(GMT-04:00) Atlantic Time - Montserrat',
    },
    {
      id: 'America/Port_of_Spain',
      name: '(GMT-04:00) Atlantic Time - Port of Spain',
    },
    {
      id: 'America/Puerto_Rico',
      name: '(GMT-04:00) Atlantic Time - Puerto Rico',
    },
    {
      id: 'America/Santo_Domingo',
      name: '(GMT-04:00) Atlantic Time - Santo Domingo',
    },
    {
      id: 'America/St_Barthelemy',
      name: '(GMT-04:00) Atlantic Time - St. Barthelemy',
    },
    { id: 'America/St_Kitts', name: '(GMT-04:00) Atlantic Time - St. Kitts' },
    { id: 'America/St_Lucia', name: '(GMT-04:00) Atlantic Time - St. Lucia' },
    { id: 'America/St_Thomas', name: '(GMT-04:00) Atlantic Time - St. Thomas' },
    {
      id: 'America/St_Vincent',
      name: '(GMT-04:00) Atlantic Time - St. Vincent',
    },
    { id: 'America/Tortola', name: '(GMT-04:00) Atlantic Time - Tortola' },
    {
      id: 'America/Argentina/Salta',
      name: '(GMT-03:00) Argentina Standard Time - Salta',
    },
    {
      id: 'America/Argentina/San_Juan',
      name: '(GMT-03:00) Argentina Standard Time - San Juan',
    },
    {
      id: 'America/Argentina/San_Luis',
      name: '(GMT-03:00) Argentina Standard Time - San Luis',
    },
    {
      id: 'America/Argentina/Tucuman',
      name: '(GMT-03:00) Argentina Standard Time - Tucuman',
    },
    {
      id: 'America/Argentina/Ushuaia',
      name: '(GMT-03:00) Argentina Standard Time - Ushuaia',
    },
    { id: 'America/Bahia', name: '(GMT-03:00) Brasilia Standard Time' },
    { id: 'America/Belem', name: '(GMT-03:00) Brasilia Standard Time - Belem' },
    {
      id: 'America/Argentina/Catamarca',
      name: '(GMT-03:00) Argentina Time - Catamarca',
    },
    {
      id: 'America/Argentina/ComodRivadavia',
      name: '(GMT-03:00) Argentina Time - ComodRivadavia',
    },
    {
      id: 'America/Argentina/Cordoba',
      name: '(GMT-03:00) Argentina Time - Cordoba',
    },
    {
      id: 'America/Argentina/Jujuy',
      name: '(GMT-03:00) Argentina Time - Jujuy',
    },
    {
      id: 'America/Argentina/La_Rioja',
      name: '(GMT-03:00) Argentina Time - La Rioja',
    },
    {
      id: 'America/Argentina/Mendoza',
      name: '(GMT-03:00) Argentina Time - Mendoza',
    },
    {
      id: 'America/Argentina/Rio_Gallegos',
      name: '(GMT-03:00) Argentina Time - Rio Gallegos',
    },
    {
      id: 'America/Argentina/Salta',
      name: '(GMT-03:00) Argentina Time - Salta',
    },
    {
      id: 'America/Argentina/San_Juan',
      name: '(GMT-03:00) Argentina Time - San Juan',
    },
    {
      id: 'America/Argentina/San_Luis',
      name: '(GMT-03:00) Argentina Time - San Luis',
    },
    {
      id: 'America/Argentina/Tucuman',
      name: '(GMT-03:00) Argentina Time - Tucuman',
    },
    {
      id: 'America/Argentina/Ushuaia',
      name: '(GMT-03:00) Argentina Time - Ushuaia',
    },
    { id: 'America/Asuncion', name: '(GMT-03:00) Paraguay Time' },
    { id: 'America/Bahia', name: '(GMT-03:00) Salvador Time' },
    { id: 'America/Belem', name: '(GMT-03:00) Belem Time' },
    { id: 'America/Cayenne', name: '(GMT-03:00) French Guiana Time' },
    { id: 'America/Fortaleza', name: '(GMT-03:00) Fortaleza Time' },
    { id: 'America/Maceio', name: '(GMT-03:00) Maceio Time' },
    {
      id: 'America/Miquelon',
      name: '(GMT-03:00) Saint Pierre and Miquelon Time',
    },
    { id: 'America/Montevideo', name: '(GMT-03:00) Uruguay Standard Time' },
    { id: 'America/Nuuk', name: '(GMT-03:00) West Greenland Time' },
    { id: 'America/Paramaribo', name: '(GMT-03:00) Suriname Time' },
    {
      id: 'America/Punta_Arenas',
      name: '(GMT-03:00) Chile Standard Time - Punta Arenas',
    },
    { id: 'America/Recife', name: '(GMT-03:00) Recife Time' },
    { id: 'America/Santarem', name: '(GMT-03:00) Santarem Time' },
    {
      id: 'America/Santiago',
      name: '(GMT-03:00) Chile Standard Time - Santiago',
    },
    { id: 'America/Sao_Paulo', name: '(GMT-03:00) Sao Paulo Time' },
    {
      id: 'America/St_Johns',
      name: '(GMT-02:30) Newfoundland Time - St. Johns',
    },
    {
      id: 'America/Scoresbysund',
      name: '(GMT-01:00) Azores Standard Time - Scoresbysund',
    },
    { id: 'Atlantic/Azores', name: '(GMT-01:00) Azores Time' },
    { id: 'Atlantic/Cape_Verde', name: '(GMT-01:00) Cape Verde Time' },
    { id: 'America/Noronha', name: '(GMT-02:00) Fernando de Noronha Time' },
    { id: 'Atlantic/South_Georgia', name: '(GMT-02:00) South Georgia Time' },
    {
      id: 'America/Godthab',
      name: '(GMT-02:00) Greenland Standard Time - Godthab',
    },
    {
      id: 'America/Argentina/Buenos_Aires',
      name: '(GMT-03:00) Argentina Standard Time - Buenos Aires',
    },
    {
      id: 'America/Argentina/Catamarca',
      name: '(GMT-03:00) Argentina Standard Time - Catamarca',
    },
    {
      id: 'America/Argentina/ComodRivadavia',
      name: '(GMT-03:00) Argentina Standard Time - ComodRivadavia',
    },
    {
      id: 'America/Argentina/Cordoba',
      name: '(GMT-03:00) Argentina Standard Time - Cordoba',
    },
    {
      id: 'America/Argentina/Jujuy',
      name: '(GMT-03:00) Argentina Standard Time - Jujuy',
    },
    {
      id: 'America/Argentina/La_Rioja',
      name: '(GMT-03:00) Argentina Standard Time - La Rioja',
    },
    {
      id: 'America/Argentina/Mendoza',
      name: '(GMT-03:00) Argentina Standard Time - Mendoza',
    },
    {
      id: 'America/Argentina/Rio_Gallegos',
      name: '(GMT-03:00) Argentina Standard Time - Rio Gallegos',
    },
    {
      id: 'America/Argentina/Ushuaia',
      name: '(GMT-03:00) Argentina Standard Time - Ushuaia',
    },
    { id: 'America/Bahia', name: '(GMT-03:00) Brasilia Standard Time - Bahia' },
    { id: 'America/Belem', name: '(GMT-03:00) Brasilia Standard Time - Belem' },
    {
      id: 'America/Fortaleza',
      name: '(GMT-03:00) Brasilia Standard Time - Fortaleza',
    },
    {
      id: 'America/Maceio',
      name: '(GMT-03:00) Brasilia Standard Time - Maceio',
    },
    {
      id: 'America/Paramaribo',
      name: '(GMT-03:00) Brasilia Standard Time - Paramaribo',
    },
    {
      id: 'America/Recife',
      name: '(GMT-03:00) Brasilia Standard Time - Recife',
    },
    {
      id: 'America/Santarem',
      name: '(GMT-03:00) Brasilia Standard Time - Santarem',
    },
    {
      id: 'America/Sao_Paulo',
      name: '(GMT-03:00) Brasilia Standard Time - Sao Paulo',
    },
    { id: 'America/Cayenne', name: '(GMT-03:00) French Guiana Standard Time' },
    {
      id: 'America/Miquelon',
      name: '(GMT-03:00) Saint Pierre and Miquelon Standard Time',
    },
    { id: 'America/Thule', name: '(GMT-04:00) Thule Time' },
    { id: 'Atlantic/Bermuda', name: '(GMT-04:00) Bermuda Time' },
    { id: 'America/Nassau', name: '(GMT-05:00) Nassau Time' },
    { id: 'America/Grand_Turk', name: '(GMT-05:00) Turks and Caicos Time' },
    { id: 'America/Nuuk', name: '(GMT-03:00) Nuuk Time' },
    { id: 'America/Goose_Bay', name: '(GMT-04:00) Goose Bay Time' },
    { id: 'America/Asuncion', name: '(GMT-03:00) Asuncion Time' },
    { id: 'America/Montevideo', name: '(GMT-03:00) Montevideo Time' },
    { id: 'America/Punta_Arenas', name: '(GMT-03:00) Punta Arenas Time' },
    { id: 'America/Santiago', name: '(GMT-03:00) Santiago Time' },
    {
      id: 'America/Argentina/Buenos_Aires',
      name: '(GMT-03:00) Buenos Aires Time',
    },
    { id: 'America/Argentina/Catamarca', name: '(GMT-03:00) Catamarca Time' },
    {
      id: 'America/Argentina/ComodRivadavia',
      name: '(GMT-03:00) ComodRivadavia Time',
    },
    { id: 'America/Argentina/Cordoba', name: '(GMT-03:00) Cordoba Time' },
    { id: 'America/Argentina/Jujuy', name: '(GMT-03:00) Jujuy Time' },
    { id: 'America/Argentina/La_Rioja', name: '(GMT-03:00) La Rioja Time' },
    { id: 'America/Argentina/Mendoza', name: '(GMT-03:00) Mendoza Time' },
    {
      id: 'America/Argentina/Rio_Gallegos',
      name: '(GMT-03:00) Rio Gallegos Time',
    },
    { id: 'America/Argentina/Ushuaia', name: '(GMT-03:00) Ushuaia Time' },
    { id: 'America/Noronha', name: '(GMT-02:00) Noronha Time' },
    { id: 'Atlantic/South_Georgia', name: '(GMT-02:00) South Georgia Time' },
    { id: 'America/Godthab', name: '(GMT-02:00) Godthab Time' },
    { id: 'Atlantic/Azores', name: '(GMT-01:00) Azores Time' },
    { id: 'Atlantic/Cape_Verde', name: '(GMT-01:00) Cape Verde Time' },
    { id: 'Africa/Abidjan', name: '(GMT+00:00) Greenwich Mean Time - Abidjan' },
    { id: 'Africa/Accra', name: '(GMT+00:00) Greenwich Mean Time - Accra' },
    { id: 'Africa/Bamako', name: '(GMT+00:00) Greenwich Mean Time - Bamako' },
    { id: 'Africa/Banjul', name: '(GMT+00:00) Greenwich Mean Time - Banjul' },
    { id: 'Africa/Bissau', name: '(GMT+00:00) Greenwich Mean Time - Bissau' },
    { id: 'Africa/Conakry', name: '(GMT+00:00) Greenwich Mean Time - Conakry' },
    { id: 'Africa/Dakar', name: '(GMT+00:00) Greenwich Mean Time - Dakar' },
    {
      id: 'Africa/Freetown',
      name: '(GMT+00:00) Greenwich Mean Time - Freetown',
    },
    { id: 'Africa/Lome', name: '(GMT+00:00) Greenwich Mean Time - Lome' },
    {
      id: 'Africa/Monrovia',
      name: '(GMT+00:00) Greenwich Mean Time - Monrovia',
    },
    {
      id: 'Africa/Nouakchott',
      name: '(GMT+00:00) Greenwich Mean Time - Nouakchott',
    },
    {
      id: 'Africa/Ouagadougou',
      name: '(GMT+00:00) Greenwich Mean Time - Ouagadougou',
    },
    {
      id: 'Africa/Sao_Tome',
      name: '(GMT+00:00) Greenwich Mean Time - Sao Tome',
    },
    {
      id: 'Atlantic/St_Helena',
      name: '(GMT+00:00) Greenwich Mean Time - St. Helena',
    },
    {
      id: 'Africa/Algiers',
      name: '(GMT+01:00) Central European Standard Time - Algiers',
    },
    { id: 'Africa/Bangui', name: '(GMT+01:00) West Africa Time - Bangui' },
    {
      id: 'Africa/Brazzaville',
      name: '(GMT+01:00) West Africa Time - Brazzaville',
    },
    { id: 'Africa/Douala', name: '(GMT+01:00) West Africa Time - Douala' },
    { id: 'Africa/Kinshasa', name: '(GMT+01:00) West Africa Time - Kinshasa' },
    { id: 'Africa/Lagos', name: '(GMT+01:00) West Africa Time - Lagos' },
    {
      id: 'Africa/Libreville',
      name: '(GMT+01:00) West Africa Time - Libreville',
    },
    { id: 'Africa/Luanda', name: '(GMT+01:00) West Africa Time - Luanda' },
    { id: 'Africa/Malabo', name: '(GMT+01:00) West Africa Time - Malabo' },
    { id: 'Africa/Ndjamena', name: '(GMT+01:00) West Africa Time - Ndjamena' },
    { id: 'Africa/Niamey', name: '(GMT+01:00) West Africa Time - Niamey' },
    {
      id: 'Africa/Porto-Novo',
      name: '(GMT+01:00) West Africa Time - Porto-Novo',
    },
    {
      id: 'Africa/Tunis',
      name: '(GMT+01:00) Central European Standard Time - Tunis',
    },
    {
      id: 'Africa/Windhoek',
      name: '(GMT+01:00) Central European Standard Time - Windhoek',
    },
    {
      id: 'Arctic/Longyearbyen',
      name: '(GMT+01:00) Central European Standard Time - Longyearbyen',
    },
    {
      id: 'Europe/Amsterdam',
      name: '(GMT+01:00) Central European Standard Time - Amsterdam',
    },
    {
      id: 'Europe/Andorra',
      name: '(GMT+01:00) Central European Standard Time - Andorra',
    },
    {
      id: 'Europe/Belgrade',
      name: '(GMT+01:00) Central European Standard Time - Belgrade',
    },
    {
      id: 'Europe/Berlin',
      name: '(GMT+01:00) Central European Standard Time - Berlin',
    },
    {
      id: 'Europe/Bratislava',
      name: '(GMT+01:00) Central European Standard Time - Bratislava',
    },
    {
      id: 'Europe/Brussels',
      name: '(GMT+01:00) Central European Standard Time - Brussels',
    },
    {
      id: 'Europe/Budapest',
      name: '(GMT+01:00) Central European Standard Time - Budapest',
    },
    {
      id: 'Europe/Busingen',
      name: '(GMT+01:00) Central European Standard Time - Busingen',
    },
    {
      id: 'Europe/Copenhagen',
      name: '(GMT+01:00) Central European Standard Time - Copenhagen',
    },
    {
      id: 'Europe/Gibraltar',
      name: '(GMT+01:00) Central European Standard Time - Gibraltar',
    },
    {
      id: 'Europe/Ljubljana',
      name: '(GMT+01:00) Central European Standard Time - Ljubljana',
    },
    {
      id: 'Europe/Luxembourg',
      name: '(GMT+01:00) Central European Standard Time - Luxembourg',
    },
    {
      id: 'Europe/Madrid',
      name: '(GMT+01:00) Central European Standard Time - Madrid',
    },
    {
      id: 'Europe/Malta',
      name: '(GMT+01:00) Central European Standard Time - Malta',
    },
    {
      id: 'Europe/Monaco',
      name: '(GMT+01:00) Central European Standard Time - Monaco',
    },
    {
      id: 'Europe/Oslo',
      name: '(GMT+01:00) Central European Standard Time - Oslo',
    },
    {
      id: 'Europe/Paris',
      name: '(GMT+01:00) Central European Standard Time - Paris',
    },
    {
      id: 'Europe/Podgorica',
      name: '(GMT+01:00) Central European Standard Time - Podgorica',
    },
    {
      id: 'Europe/Prague',
      name: '(GMT+01:00) Central European Standard Time - Prague',
    },
    {
      id: 'Europe/Rome',
      name: '(GMT+01:00) Central European Standard Time - Rome',
    },
    {
      id: 'Europe/San_Marino',
      name: '(GMT+01:00) Central European Standard Time - San Marino',
    },
    {
      id: 'Europe/Sarajevo',
      name: '(GMT+01:00) Central European Standard Time - Sarajevo',
    },
    {
      id: 'Europe/Skopje',
      name: '(GMT+01:00) Central European Standard Time - Skopje',
    },
    {
      id: 'Europe/Stockholm',
      name: '(GMT+01:00) Central European Standard Time - Stockholm',
    },
    {
      id: 'Europe/Tirane',
      name: '(GMT+01:00) Central European Standard Time - Tirane',
    },
    {
      id: 'Europe/Vaduz',
      name: '(GMT+01:00) Central European Standard Time - Vaduz',
    },
    {
      id: 'Europe/Vatican',
      name: '(GMT+01:00) Central European Standard Time - Vatican',
    },
    {
      id: 'Europe/Vienna',
      name: '(GMT+01:00) Central European Standard Time - Vienna',
    },
    {
      id: 'Europe/Warsaw',
      name: '(GMT+01:00) Central European Standard Time - Warsaw',
    },
    {
      id: 'Europe/Zagreb',
      name: '(GMT+01:00) Central European Standard Time - Zagreb',
    },
    {
      id: 'Europe/Zurich',
      name: '(GMT+01:00) Central European Standard Time - Zurich',
    },
    {
      id: 'Africa/Cairo',
      name: '(GMT+02:00) Eastern European Standard Time - Cairo',
    },
    {
      id: 'Africa/Blantyre',
      name: '(GMT+02:00) Central Africa Time - Blantyre',
    },
    {
      id: 'Africa/Bujumbura',
      name: '(GMT+02:00) Central Africa Time - Bujumbura',
    },
    {
      id: 'Africa/Gaborone',
      name: '(GMT+02:00) Central Africa Time - Gaborone',
    },
    { id: 'Africa/Harare', name: '(GMT+02:00) Central Africa Time - Harare' },
    {
      id: 'Africa/Johannesburg',
      name: '(GMT+02:00) Central Africa Time - Johannesburg',
    },
    { id: 'Africa/Kigali', name: '(GMT+02:00) Central Africa Time - Kigali' },
    {
      id: 'Africa/Lubumbashi',
      name: '(GMT+02:00) Central Africa Time - Lubumbashi',
    },
    { id: 'Africa/Lusaka', name: '(GMT+02:00) Central Africa Time - Lusaka' },
    { id: 'Africa/Maputo', name: '(GMT+02:00) Central Africa Time - Maputo' },
    { id: 'Africa/Maseru', name: '(GMT+02:00) Central Africa Time - Maseru' },
    { id: 'Africa/Mbabane', name: '(GMT+02:00) Central Africa Time - Mbabane' },
    {
      id: 'Africa/Tripoli',
      name: '(GMT+02:00) Eastern European Standard Time - Tripoli',
    },
    {
      id: 'Asia/Amman',
      name: '(GMT+02:00) Eastern European Standard Time - Amman',
    },
    {
      id: 'Asia/Beirut',
      name: '(GMT+02:00) Eastern European Standard Time - Beirut',
    },
    {
      id: 'Asia/Damascus',
      name: '(GMT+02:00) Eastern European Standard Time - Damascus',
    },
    {
      id: 'Asia/Gaza',
      name: '(GMT+02:00) Eastern European Standard Time - Gaza',
    },
    {
      id: 'Asia/Hebron',
      name: '(GMT+02:00) Eastern European Standard Time - Hebron',
    },
    {
      id: 'Asia/Nicosia',
      name: '(GMT+02:00) Eastern European Standard Time - Nicosia',
    },
    {
      id: 'Europe/Athens',
      name: '(GMT+02:00) Eastern European Standard Time - Athens',
    },
    {
      id: 'Europe/Bucharest',
      name: '(GMT+02:00) Eastern European Standard Time - Bucharest',
    },
    {
      id: 'Europe/Chisinau',
      name: '(GMT+02:00) Eastern European Standard Time - Chisinau',
    },
    {
      id: 'Europe/Helsinki',
      name: '(GMT+02:00) Eastern European Standard Time - Helsinki',
    },
    {
      id: 'Europe/Istanbul',
      name: '(GMT+02:00) Eastern European Standard Time - Istanbul',
    },
    {
      id: 'Europe/Kaliningrad',
      name: '(GMT+02:00) Eastern European Standard Time - Kaliningrad',
    },
    {
      id: 'Europe/Kiev',
      name: '(GMT+02:00) Eastern European Standard Time - Kiev',
    },
    {
      id: 'Europe/Mariehamn',
      name: '(GMT+02:00) Eastern European Standard Time - Mariehamn',
    },
    {
      id: 'Europe/Minsk',
      name: '(GMT+02:00) Eastern European Standard Time - Minsk',
    },
    {
      id: 'Europe/Riga',
      name: '(GMT+02:00) Eastern European Standard Time - Riga',
    },
    {
      id: 'Europe/Sofia',
      name: '(GMT+02:00) Eastern European Standard Time - Sofia',
    },
    {
      id: 'Europe/Tallinn',
      name: '(GMT+02:00) Eastern European Standard Time - Tallinn',
    },
    {
      id: 'Europe/Uzhgorod',
      name: '(GMT+02:00) Eastern European Standard Time - Uzhgorod',
    },
    {
      id: 'Europe/Vilnius',
      name: '(GMT+02:00) Eastern European Standard Time - Vilnius',
    },
    {
      id: 'Europe/Zaporozhye',
      name: '(GMT+02:00) Eastern European Standard Time - Zaporozhye',
    },
    {
      id: 'Africa/Ceuta',
      name: '(GMT+01:00) Central European Standard Time - Ceuta',
    },
    {
      id: 'Africa/El_Aaiun',
      name: '(GMT+01:00) Western European Standard Time - El Aaiun',
    },
    {
      id: 'Africa/Monrovia',
      name: '(GMT+00:00) Greenwich Mean Time - Monrovia',
    },
    {
      id: 'Africa/Ndjamena',
      name: '(GMT+01:00) West Africa Standard Time - Ndjamena',
    },
    {
      id: 'Africa/Tripoli',
      name: '(GMT+02:00) Eastern European Standard Time - Tripoli',
    },
    {
      id: 'Africa/Windhoek',
      name: '(GMT+01:00) West Central Africa Standard Time - Windhoek',
    },
    {
      id: 'America/Scoresbysund',
      name: '(GMT-01:00) Azores Standard Time - Scoresbysund',
    },
    {
      id: 'America/Noronha',
      name: '(GMT-02:00) Fernando de Noronha Standard Time',
    },
    {
      id: 'Atlantic/South_Georgia',
      name: '(GMT-02:00) South Georgia Standard Time',
    },
    {
      id: 'America/Godthab',
      name: '(GMT-02:00) Greenland Standard Time - Godthab',
    },
    {
      id: 'Africa/Monrovia',
      name: '(GMT+00:00) Greenwich Mean Time - Monrovia',
    },
    {
      id: 'Africa/Algiers',
      name: '(GMT+01:00) Central European Standard Time - Algiers',
    },
    {
      id: 'Africa/Windhoek',
      name: '(GMT+02:00) West Central Africa Standard Time - Windhoek',
    },
    {
      id: 'America/Noronha',
      name: '(GMT-02:00) Fernando de Noronha Standard Time',
    },
    {
      id: 'America/Scoresbysund',
      name: '(GMT-01:00) Azores Standard Time - Scoresbysund',
    },
    {
      id: 'Atlantic/South_Georgia',
      name: '(GMT-02:00) South Georgia Standard Time',
    },
    {
      id: 'Asia/Amman',
      name: '(GMT+02:00) Eastern European Standard Time - Amman',
    },
    {
      id: 'Asia/Beirut',
      name: '(GMT+02:00) Eastern European Standard Time - Beirut',
    },
    {
      id: 'Asia/Damascus',
      name: '(GMT+02:00) Eastern European Standard Time - Damascus',
    },
    {
      id: 'Asia/Gaza',
      name: '(GMT+02:00) Eastern European Standard Time - Gaza',
    },
    {
      id: 'Asia/Hebron',
      name: '(GMT+02:00) Eastern European Standard Time - Hebron',
    },
    {
      id: 'Asia/Nicosia',
      name: '(GMT+02:00) Eastern European Standard Time - Nicosia',
    },
    {
      id: 'Europe/Athens',
      name: '(GMT+02:00) Eastern European Standard Time - Athens',
    },
    {
      id: 'Europe/Bucharest',
      name: '(GMT+02:00) Eastern European Standard Time - Bucharest',
    },
    {
      id: 'Europe/Chisinau',
      name: '(GMT+02:00) Eastern European Standard Time - Chisinau',
    },
    {
      id: 'Europe/Helsinki',
      name: '(GMT+02:00) Eastern European Standard Time - Helsinki',
    },
    {
      id: 'Europe/Istanbul',
      name: '(GMT+02:00) Eastern European Standard Time - Istanbul',
    },
    {
      id: 'Europe/Kaliningrad',
      name: '(GMT+02:00) Eastern European Standard Time - Kaliningrad',
    },
    {
      id: 'Europe/Kiev',
      name: '(GMT+02:00) Eastern European Standard Time - Kiev',
    },
    {
      id: 'Europe/Mariehamn',
      name: '(GMT+02:00) Eastern European Standard Time - Mariehamn',
    },
    {
      id: 'Europe/Minsk',
      name: '(GMT+02:00) Eastern European Standard Time - Minsk',
    },
    {
      id: 'Europe/Riga',
      name: '(GMT+02:00) Eastern European Standard Time - Riga',
    },
    {
      id: 'Europe/Sofia',
      name: '(GMT+02:00) Eastern European Standard Time - Sofia',
    },
    {
      id: 'Europe/Tallinn',
      name: '(GMT+02:00) Eastern European Standard Time - Tallinn',
    },
    {
      id: 'Europe/Uzhgorod',
      name: '(GMT+02:00) Eastern European Standard Time - Uzhgorod',
    },
    {
      id: 'Europe/Vilnius',
      name: '(GMT+02:00) Eastern European Standard Time - Vilnius',
    },
    {
      id: 'Europe/Zaporozhye',
      name: '(GMT+02:00) Eastern European Standard Time - Zaporozhye',
    },
    {
      id: 'Africa/Addis_Ababa',
      name: '(GMT+03:00) East Africa Time - Addis Ababa',
    },
    { id: 'Africa/Asmara', name: '(GMT+03:00) East Africa Time - Asmara' },
    { id: 'Africa/Asmera', name: '(GMT+03:00) East Africa Time - Asmera' },
    {
      id: 'Africa/Dar_es_Salaam',
      name: '(GMT+03:00) East Africa Time - Dar es Salaam',
    },
    { id: 'Africa/Djibouti', name: '(GMT+03:00) East Africa Time - Djibouti' },
    { id: 'Africa/Kampala', name: '(GMT+03:00) East Africa Time - Kampala' },
    {
      id: 'Africa/Mogadishu',
      name: '(GMT+03:00) East Africa Time - Mogadishu',
    },
    { id: 'Africa/Nairobi', name: '(GMT+03:00) East Africa Time - Nairobi' },
    { id: 'Antarctica/Syowa', name: '(GMT+03:00) Syowa Time' },
    { id: 'Asia/Aden', name: '(GMT+03:00) Arabian Standard Time - Aden' },
    { id: 'Asia/Baghdad', name: '(GMT+03:00) Arabian Standard Time - Baghdad' },
    { id: 'Asia/Bahrain', name: '(GMT+03:00) Arabian Standard Time - Bahrain' },
    { id: 'Asia/Kuwait', name: '(GMT+03:00) Arabian Standard Time - Kuwait' },
    { id: 'Asia/Qatar', name: '(GMT+03:00) Arabian Standard Time - Qatar' },
    { id: 'Asia/Riyadh', name: '(GMT+03:00) Arabian Standard Time - Riyadh' },
    { id: 'Europe/Kirov', name: '(GMT+03:00) Kirov Time' },
    { id: 'Europe/Moscow', name: '(GMT+03:00) Moscow Standard Time' },
    {
      id: 'Europe/Simferopol',
      name: '(GMT+03:00) Moscow Standard Time - Simferopol',
    },
    {
      id: 'Europe/Volgograd',
      name: '(GMT+03:00) Moscow Standard Time - Volgograd',
    },
    {
      id: 'Indian/Antananarivo',
      name: '(GMT+03:00) Eastern Africa Time - Antananarivo',
    },
    { id: 'Indian/Comoro', name: '(GMT+03:00) Eastern Africa Time - Comoro' },
    { id: 'Indian/Mayotte', name: '(GMT+03:00) Eastern Africa Time - Mayotte' },
    { id: 'Asia/Tehran', name: '(GMT+03:30) Iran Standard Time' },
    { id: 'Asia/Baku', name: '(GMT+04:00) Azerbaijan Standard Time - Baku' },
    { id: 'Asia/Dubai', name: '(GMT+04:00) Gulf Standard Time - Dubai' },
    { id: 'Asia/Muscat', name: '(GMT+04:00) Gulf Standard Time - Muscat' },
    { id: 'Asia/Tbilisi', name: '(GMT+04:00) Georgia Standard Time' },
    { id: 'Asia/Yerevan', name: '(GMT+04:00) Armenia Standard Time' },
    {
      id: 'Europe/Astrakhan',
      name: '(GMT+04:00) Moscow Standard Time - Astrakhan',
    },
    { id: 'Europe/Samara', name: '(GMT+04:00) Moscow Standard Time - Samara' },
    {
      id: 'Europe/Saratov',
      name: '(GMT+04:00) Moscow Standard Time - Saratov',
    },
    {
      id: 'Europe/Ulyanovsk',
      name: '(GMT+04:00) Moscow Standard Time - Ulyanovsk',
    },
    { id: 'Indian/Mahe', name: '(GMT+04:00) Seychelles Time' },
    { id: 'Indian/Mauritius', name: '(GMT+04:00) Mauritius Time' },
    { id: 'Indian/Reunion', name: '(GMT+04:00) Reunion Time' },
    { id: 'Asia/Kabul', name: '(GMT+04:30) Afghanistan Time' },
    { id: 'Asia/Aqtau', name: '(GMT+05:00) Kazakhstan Standard Time - Aqtau' },
    {
      id: 'Asia/Aqtobe',
      name: '(GMT+05:00) Kazakhstan Standard Time - Aqtobe',
    },
    { id: 'Asia/Ashgabat', name: '(GMT+05:00) Turkmenistan Standard Time' },
    {
      id: 'Asia/Atyrau',
      name: '(GMT+05:00) Kazakhstan Standard Time - Atyrau',
    },
    { id: 'Asia/Dushanbe', name: '(GMT+05:00) Tajikistan Time' },
    { id: 'Asia/Karachi', name: '(GMT+05:00) Pakistan Standard Time' },
    { id: 'Asia/Oral', name: '(GMT+05:00) Kazakhstan Standard Time - Oral' },
    {
      id: 'Asia/Qyzylorda',
      name: '(GMT+05:00) Kazakhstan Standard Time - Qyzylorda',
    },
    {
      id: 'Asia/Samarkand',
      name: '(GMT+05:00) Uzbekistan Standard Time - Samarkand',
    },
    {
      id: 'Asia/Tashkent',
      name: '(GMT+05:00) Uzbekistan Standard Time - Tashkent',
    },
    {
      id: 'Asia/Yekaterinburg',
      name: '(GMT+05:00) Yekaterinburg Standard Time',
    },
    {
      id: 'Indian/Kerguelen',
      name: '(GMT+05:00) French Southern & Antarctic Time',
    },
    { id: 'Indian/Maldives', name: '(GMT+05:00) Maldives Time' },
    { id: 'Asia/Colombo', name: '(GMT+05:30) India Standard Time' },
    { id: 'Asia/Kolkata', name: '(GMT+05:30) India Standard Time - Kolkata' },
    { id: 'Asia/Kolkata', name: '(GMT+05:30) India Standard Time - Mumbai' },
    { id: 'Asia/Kolkata', name: '(GMT+05:30) India Standard Time - New Delhi' },
    { id: 'Asia/Kolkata', name: '(GMT+05:30) India Standard Time - Kolkata' },
    {
      id: 'Asia/Kolkata',
      name: '(GMT+05:30) India Standard Time - Sri Jayawardenepura',
    },
    { id: 'Asia/Kolkata', name: '(GMT+05:30) India Standard Time - Chennai' },
  ];

  public static countryDataWitId = [
    { id: 'AF', name: 'Afghanistan' },
    { id: 'AL', name: 'Albania' },
    { id: 'DZ', name: 'Algeria' },
    { id: 'AS', name: 'American Samoa' },
    { id: 'AD', name: 'Andorra' },
    { id: 'AO', name: 'Angola' },
    { id: 'AI', name: 'Anguilla' },
    { id: 'AQ', name: 'Antarctica' },
    { id: 'AG', name: 'Antigua and Barbuda' },
    { id: 'AR', name: 'Argentina' },
    { id: 'AM', name: 'Armenia' },
    { id: 'AW', name: 'Aruba' },
    { id: 'AU', name: 'Australia' },
    { id: 'AT', name: 'Austria' },
    { id: 'AZ', name: 'Azerbaijan' },
    { id: 'BS', name: 'Bahamas' },
    { id: 'BH', name: 'Bahrain' },
    { id: 'BD', name: 'Bangladesh' },
    { id: 'BB', name: 'Barbados' },
    { id: 'BY', name: 'Belarus' },
    { id: 'BE', name: 'Belgium' },
    { id: 'BZ', name: 'Belize' },
    { id: 'BJ', name: 'Benin' },
    { id: 'BM', name: 'Bermuda' },
    { id: 'BT', name: 'Bhutan' },
    { id: 'BO', name: 'Bolivia' },
    { id: 'BA', name: 'Bosnia and Herzegovina' },
    { id: 'BW', name: 'Botswana' },
    { id: 'BR', name: 'Brazil' },
    { id: 'IO', name: 'British Indian Ocean Territory' },
    { id: 'BN', name: 'Brunei' },
    { id: 'BG', name: 'Bulgaria' },
    { id: 'BF', name: 'Burkina Faso' },
    { id: 'BI', name: 'Burundi' },
    { id: 'CV', name: 'Cabo Verde' },
    { id: 'KH', name: 'Cambodia' },
    { id: 'CM', name: 'Cameroon' },
    { id: 'CA', name: 'Canada' },
    { id: 'KY', name: 'Cayman Islands' },
    { id: 'CF', name: 'Central African Republic' },
    { id: 'TD', name: 'Chad' },
    { id: 'CL', name: 'Chile' },
    { id: 'CN', name: 'China' },
    { id: 'CO', name: 'Colombia' },
    { id: 'KM', name: 'Comoros' },
    { id: 'CG', name: 'Congo' },
    { id: 'CD', name: 'Congo (DRC)' },
    { id: 'CK', name: 'Cook Islands' },
    { id: 'CR', name: 'Costa Rica' },
    { id: 'CI', name: 'Côte d’Ivoire' },
    { id: 'HR', name: 'Croatia' },
    { id: 'CU', name: 'Cuba' },
    { id: 'CW', name: 'Curaçao' },
    { id: 'CY', name: 'Cyprus' },
    { id: 'CZ', name: 'Czechia' },
    { id: 'DK', name: 'Denmark' },
    { id: 'DJ', name: 'Djibouti' },
    { id: 'DM', name: 'Dominica' },
    { id: 'DO', name: 'Dominican Republic' },
    { id: 'EC', name: 'Ecuador' },
    { id: 'EG', name: 'Egypt' },
    { id: 'SV', name: 'El Salvador' },
    { id: 'GQ', name: 'Equatorial Guinea' },
    { id: 'ER', name: 'Eritrea' },
    { id: 'EE', name: 'Estonia' },
    { id: 'SZ', name: 'Eswatini' },
    { id: 'ET', name: 'Ethiopia' },
    { id: 'FJ', name: 'Fiji' },
    { id: 'FI', name: 'Finland' },
    { id: 'FR', name: 'France' },
    { id: 'GA', name: 'Gabon' },
    { id: 'GM', name: 'Gambia' },
    { id: 'GE', name: 'Georgia' },
    { id: 'DE', name: 'Germany' },
    { id: 'GH', name: 'Ghana' },
    { id: 'GR', name: 'Greece' },
    { id: 'GD', name: 'Grenada' },
    { id: 'GU', name: 'Guam' },
    { id: 'GT', name: 'Guatemala' },
    { id: 'GN', name: 'Guinea' },
    { id: 'GW', name: 'Guinea-Bissau' },
    { id: 'GY', name: 'Guyana' },
    { id: 'HT', name: 'Haiti' },
    { id: 'HN', name: 'Honduras' },
    { id: 'HK', name: 'Hong Kong SAR' },
    { id: 'HU', name: 'Hungary' },
    { id: 'IS', name: 'Iceland' },
    { id: 'IN', name: 'India' },
    { id: 'ID', name: 'Indonesia' },
    { id: 'IR', name: 'Iran' },
    { id: 'IQ', name: 'Iraq' },
    { id: 'IE', name: 'Ireland' },
    { id: 'IL', name: 'Israel' },
    { id: 'IT', name: 'Italy' },
    { id: 'JM', name: 'Jamaica' },
    { id: 'JP', name: 'Japan' },
    { id: 'JO', name: 'Jordan' },
    { id: 'KZ', name: 'Kazakhstan' },
    { id: 'KE', name: 'Kenya' },
    { id: 'KI', name: 'Kiribati' },
    { id: 'KP', name: 'Korea (North)' },
    { id: 'KR', name: 'Korea (South)' },
    { id: 'KW', name: 'Kuwait' },
    { id: 'KG', name: 'Kyrgyzstan' },
    { id: 'LA', name: 'Laos' },
    { id: 'LV', name: 'Latvia' },
    { id: 'LB', name: 'Lebanon' },
    { id: 'LS', name: 'Lesotho' },
    { id: 'LR', name: 'Liberia' },
    { id: 'LY', name: 'Libya' },
    { id: 'LI', name: 'Liechtenstein' },
    { id: 'LT', name: 'Lithuania' },
    { id: 'LU', name: 'Luxembourg' },
    { id: 'MO', name: 'Macao SAR' },
    { id: 'MG', name: 'Madagascar' },
    { id: 'MW', name: 'Malawi' },
    { id: 'MY', name: 'Malaysia' },
    { id: 'MV', name: 'Maldives' },
    { id: 'ML', name: 'Mali' },
    { id: 'MT', name: 'Malta' },
    { id: 'MH', name: 'Marshall Islands' },
    { id: 'MR', name: 'Mauritania' },
    { id: 'MU', name: 'Mauritius' },
    { id: 'MX', name: 'Mexico' },
    { id: 'FM', name: 'Micronesia' },
    { id: 'MD', name: 'Moldova' },
    { id: 'MC', name: 'Monaco' },
    { id: 'MN', name: 'Mongolia' },
    { id: 'ME', name: 'Montenegro' },
    { id: 'MS', name: 'Montserrat' },
    { id: 'MA', name: 'Morocco' },
    { id: 'MZ', name: 'Mozambique' },
    { id: 'MM', name: 'Myanmar' },
    { id: 'NA', name: 'Namibia' },
    { id: 'NR', name: 'Nauru' },
    { id: 'NP', name: 'Nepal' },
    { id: 'NL', name: 'Netherlands' },
    { id: 'NZ', name: 'New Zealand' },
    { id: 'NI', name: 'Nicaragua' },
    { id: 'NE', name: 'Niger' },
    { id: 'NG', name: 'Nigeria' },
    { id: 'MK', name: 'North Macedonia' },
    { id: 'NO', name: 'Norway' },
    { id: 'OM', name: 'Oman' },
    { id: 'PK', name: 'Pakistan' },
    { id: 'PW', name: 'Palau' },
    { id: 'PS', name: 'Palestinian Territories' },
    { id: 'PA', name: 'Panama' },
    { id: 'PG', name: 'Papua New Guinea' },
    { id: 'PY', name: 'Paraguay' },
    { id: 'PE', name: 'Peru' },
    { id: 'PH', name: 'Philippines' },
    { id: 'PL', name: 'Poland' },
    { id: 'PT', name: 'Portugal' },
    { id: 'PR', name: 'Puerto Rico' },
    { id: 'QA', name: 'Qatar' },
    { id: 'RO', name: 'Romania' },
    { id: 'RU', name: 'Russia' },
    { id: 'RW', name: 'Rwanda' },
    { id: 'WS', name: 'Samoa' },
    { id: 'SM', name: 'San Marino' },
    { id: 'ST', name: 'São Tomé and Príncipe' },
    { id: 'SA', name: 'Saudi Arabia' },
    { id: 'SN', name: 'Senegal' },
    { id: 'RS', name: 'Serbia' },
    { id: 'SC', name: 'Seychelles' },
    { id: 'SL', name: 'Sierra Leone' },
    { id: 'SG', name: 'Singapore' },
    { id: 'SK', name: 'Slovakia' },
    { id: 'SI', name: 'Slovenia' },
    { id: 'SB', name: 'Solomon Islands' },
    { id: 'SO', name: 'Somalia' },
    { id: 'ZA', name: 'South Africa' },
    { id: 'SS', name: 'South Sudan' },
    { id: 'ES', name: 'Spain' },
    { id: 'LK', name: 'Sri Lanka' },
    { id: 'SD', name: 'Sudan' },
    { id: 'SR', name: 'Suriname' },
    { id: 'SE', name: 'Sweden' },
    { id: 'CH', name: 'Switzerland' },
    { id: 'SY', name: 'Syria' },
    { id: 'TW', name: 'Taiwan' },
    { id: 'TJ', name: 'Tajikistan' },
    { id: 'TZ', name: 'Tanzania' },
    { id: 'TH', name: 'Thailand' },
    { id: 'TL', name: 'Timor-Leste' },
    { id: 'TG', name: 'Togo' },
    { id: 'TO', name: 'Tonga' },
    { id: 'TT', name: 'Trinidad and Tobago' },
    { id: 'TN', name: 'Tunisia' },
    { id: 'TR', name: 'Turkey' },
    { id: 'TM', name: 'Turkmenistan' },
    { id: 'TV', name: 'Tuvalu' },
    { id: 'UG', name: 'Uganda' },
    { id: 'UA', name: 'Ukraine' },
    { id: 'AE', name: 'United Arab Emirates' },
    { id: 'GB', name: 'United Kingdom' },
    { id: 'US', name: 'United States' },
    { id: 'UY', name: 'Uruguay' },
    { id: 'UZ', name: 'Uzbekistan' },
    { id: 'VU', name: 'Vanuatu' },
    { id: 'VA', name: 'Vatican City' },
    { id: 'VE', name: 'Venezuela' },
    { id: 'VN', name: 'Vietnam' },
    { id: 'EH', name: 'Western Sahara' },
    { id: 'YE', name: 'Yemen' },
    { id: 'ZM', name: 'Zambia' },
    { id: 'ZW', name: 'Zimbabwe' },
  ];
}
