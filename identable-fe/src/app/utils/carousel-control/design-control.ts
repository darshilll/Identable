export class designControl {
    
    public static defaultTemplate         = 'template1';
    public static defaultCreativeTemplate = 'template1';   
    public static defaultSlideBtnText     = 'Call To Action';
    public static defaultSwipeBtnText     = 'Swipe';

    public static listBackgroundColor = ['#ef4444','#f97316','#facc15','#2dd4bf','#4ade80','#3b82f6','#6366f1','#ec4899','#4444dd'];
 
    public static randomSwipeBtnText = ['Swipe','See more','Swipe to continue','Swipe to read','Unveil','Learn','Learn more','Read','Unlock'];

    public static listBackgroundGradient = [
        'linear-gradient(90deg, #fbda61 0%, #ff5acd 100%)',
        'linear-gradient(90deg, #f6d365 0%, #fda085 100%)',
        'linear-gradient(90deg, #f7bb97 0%, #dd5e89 100%)',
        'linear-gradient(90deg, #56ccf2 0%, #2f80ed 100%)',
        'linear-gradient(90deg, #fbc7d4 0%, #9796f0 100%)',
        'linear-gradient(90deg, #84fab0 0%, #8fd3f4 100%)',
        'linear-gradient(90deg, #f6d365 0%, #fda085 100%)',
        'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
        'linear-gradient(90deg, #d397fa 0%, #8364e8 100%)',
        'linear-gradient(90deg, #ccf7f4 0%, #eed991 100%)'
    ];

    public static colorThemes = {
        boldAndBright: [
          { backgroundColor: '#11004D', textColor: '#ffffff', subColor: '#BB0088', subBackgroundColor: '#332288' },
          { backgroundColor: '#2222BB', textColor: '#ffffff', subColor: '#AA77CC', subBackgroundColor: '#4444DD' },
          { backgroundColor: '#771144', textColor: '#ffffff', subColor: '#EE3377', subBackgroundColor: '#992255' },
          { backgroundColor: '#280647', textColor: '#B3AEE9', subColor: '#96F7D2', subBackgroundColor: '#342355' }
        ],
        coolAndClean: [
          { backgroundColor: '#F2DEC8', textColor: '#847459', subColor: '#C08552', subBackgroundColor: '#F8E8D9' },
          { backgroundColor: '#F8E8D9', textColor: '#8B786D', subColor: '#AC8179', subBackgroundColor: '#FFFEF9' },
          { backgroundColor: '#1E140F', textColor: '#FBE1B7', subColor: '#FF9A8D', subBackgroundColor: '#3B2923' },
          { backgroundColor: '#397A59', textColor: '#FFFCFA', subColor: '#FCCE19', subBackgroundColor: '#4D8A6D' }
        ],
        warmAndFriendly: [
          { backgroundColor: '#FFF2E4', textColor: '#7A552B', subColor: '#C65911', subBackgroundColor: '#FFEDDA' },
          { backgroundColor: '#FFEDD9', textColor: '#B66328', subColor: '#DF842D', subBackgroundColor: '#FFF4E5' },
          { backgroundColor: '#FEF1DA', textColor: '#CE8035', subColor: '#C26F27', subBackgroundColor: '#FFF8E8' },
          { backgroundColor: '#F4B94D', textColor: '#FFFFFF', subColor: '#1D1D76', subBackgroundColor: '#F8E4B5' }
        ]
    };
    
    public static fontFamilyList: any = [
        'Bebas Neue',
        'Play',
        'Sora',
        'Inter',
        'Roboto',
        'Lobster',
        'Poppins',
        'PT Serif',
        'Varela Round',
        'Dancing Script',
        'PT Sans Narrow',
        'Playfair Display',
    ];

    public static PairFontFamilyList: any = [
        {
            fontOne: 'Bebas Neue',
            fontTwo: 'Play',
            value: 'Bebas Neue / Play'
        },
        {
            fontOne: 'Play',
            fontTwo: 'Poppins',
            value: 'Play / Poppins'
        },
        {
            fontOne: 'Sora',
            fontTwo: 'Varela Round',
            value: 'Sora / Varela Round'
        },
        {
            fontOne: 'Inter',
            fontTwo: 'Roboto',
            value: 'Inter / Roboto'
        },
        {
            fontOne: 'Roboto',
            fontTwo: 'Play',
            value: 'Roboto / Play'
        },
        {
            fontOne: 'Lobster',
            fontTwo: 'Sora',
            value: 'Lobster / Sora'
        },
        {
            fontOne: 'Poppins',
            fontTwo: 'Inter',
            value: 'Poppins / Inter'
        },
        {
            fontOne: 'PT Serif',
            fontTwo: 'Play',
            value: 'PT Serif / Play'
        },
        {
            fontOne: 'Varela Round',
            fontTwo: 'Roboto',
            value: 'Varela Round / Roboto'
        },
        {
            fontOne: 'Dancing Script',
            fontTwo: 'Sora',
            value: 'Dancing Script / Sora'
        },
        {
            fontOne: 'PT Sans Narrow',
            fontTwo: 'Inter',
            value: 'PT Sans Narrow / Inter'
        },
        {
            fontOne: 'Playfair Display',
            fontTwo: 'Poppins',
            value: 'Playfair Display / Poppins'
        }    
    ];

}