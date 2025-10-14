
// data.ts
import { EgyptData, Translations } from './types';

// Centralized data for all governorates and places in Egypt.
// NOTE: For demonstration, only Cairo, Giza, and Luxor are fully populated. 
// Other governorates are included with placeholder names to show the full list.
export const EGYPT_DATA: EgyptData = {
  cairo: {
    id: 'cairo',
    name: { en: 'Cairo', fr: 'Le Caire', ar: 'القاهرة' },
    heritage: [
      {
        id: 'cai-h-1',
        name: { en: 'The Egyptian Museum', fr: 'Le Musée égyptien', ar: 'المتحف المصري' },
        images: ['https://images.picsum.photos/id/1/1024/768.jpg', 'https://images.picsum.photos/id/2/1024/768.jpg', 'https://images.picsum.photos/id/3/1024/768.jpg'],
        shortDescription: { en: 'Home to an extensive collection of ancient Egyptian antiquities.', fr: 'Abrite une vaste collection d\'antiquités égyptiennes.', ar: 'يضم مجموعة واسعة من الآثار المصرية القديمة.' },
        longDescription: { en: 'Located in Tahrir Square, the Egyptian Museum houses over 120,000 artifacts. It is one of the largest and most spectacular museums in the region, featuring the famous collection of Tutankhamun.', fr: 'Situé sur la place Tahrir, le musée égyptien abrite plus de 120 000 objets. C\'est l\'un des musées les plus grands et les plus spectaculaires de la région, avec la célèbre collection de Toutankhamon.', ar: 'يقع المتحف المصري في ميدان التحرير، ويضم أكثر من 120 ألف قطعة أثرية. إنه أحد أكبر وأروع المتاحف في المنطقة، ويضم مجموعة توت عنخ آمون الشهيرة.' },
        rating: 4.8,
        googleMapsUrl: 'https://maps.app.goo.gl/kG1YJ4x2qZ8e7f6t5',
        contactNumber: '+20 2 25796948'
      },
      {
        id: 'cai-h-2',
        name: { en: 'Khan el-Khalili', fr: 'Khan el-Khalili', ar: 'خان الخليلي' },
        images: ['https://images.picsum.photos/id/4/1024/768.jpg', 'https://images.picsum.photos/id/5/1024/768.jpg', 'https://images.picsum.photos/id/6/1024/768.jpg'],
        shortDescription: { en: 'A famous bazaar and souq in the historic center of Cairo.', fr: 'Un célèbre bazar et souk dans le centre historique du Caire.', ar: 'بازار وسوق شهير في وسط القاهرة التاريخي.' },
        longDescription: { en: 'Established in the 14th century, Khan el-Khalili is a bustling open-air bazaar filled with unique items, from spices and perfumes to jewelry and souvenirs. It represents the heart of old Cairo\'s commercial activities.', fr: 'Fondé au XIVe siècle, Khan el-Khalili est un bazar en plein air animé rempli d\'articles uniques, des épices et parfums aux bijoux et souvenirs. Il représente le cœur des activités commerciales du vieux Caire.', ar: 'تأسس خان الخليلي في القرن الرابع عشر، وهو بازار مفتوح يعج بالبضائع الفريدة، من التوابل والعطور إلى المجوهرات والهدايا التذكارية. إنه يمثل قلب الأنشطة التجارية في القاهرة القديمة.' },
        rating: 4.6,
        googleMapsUrl: 'https://maps.app.goo.gl/uQ7X3xZ4sY5p2f6w6',
      },
      // ... 8 more heritage sites for Cairo
    ],
    restaurants: [
      {
        id: 'cai-r-1',
        name: { en: 'Abou El Sid', fr: 'Abou El Sid', ar: 'أبو السيد' },
        images: ['https://images.picsum.photos/id/10/1024/768.jpg', 'https://images.picsum.photos/id/11/1024/768.jpg'],
        shortDescription: { en: 'Authentic Egyptian cuisine in an ornate, traditional setting.', fr: 'Cuisine égyptienne authentique dans un cadre orné et traditionnel.', ar: 'مأكولات مصرية أصيلة في أجواء تقليدية مزخرفة.' },
        longDescription: { en: 'Abou El Sid offers a unique dining experience, transporting you to old-world Cairo with its decor and classic Egyptian dishes. It is renowned for its authentic flavors and romantic atmosphere, perfect for a memorable meal.', fr: 'Abou El Sid offre une expérience culinaire unique, vous transportant dans le Caire d\'antan avec son décor et ses plats égyptiens classiques. Il est réputé pour ses saveurs authentiques et son atmosphère romantique, parfait pour un repas mémorable.', ar: 'يقدم أبو السيد تجربة طعام فريدة من نوعها، حيث ينقلك إلى القاهرة القديمة بديكوراته وأطباقه المصرية الكلاسيكية. يشتهر بنكهاته الأصيلة وأجوائه الرومانسية، وهو مثالي لوجبة لا تُنسى.' },
        rating: 4.5,
        averagePrice: '$$$',
        googleMapsUrl: 'https://maps.app.goo.gl/9tHq8fX7uY6o9zGk7',
        contactNumber: '+20 2 27359640'
      },
      // ... 9 more restaurants for Cairo
    ],
    cafes: [
       {
        id: 'cai-c-1',
        name: { en: 'El Fishawy Cafe', fr: 'Café El Fishawy', ar: 'قهوة الفيشاوي' },
        images: ['https://images.picsum.photos/id/20/1024/768.jpg', 'https://images.picsum.photos/id/21/1024/768.jpg'],
        shortDescription: { en: 'One of Cairo\'s oldest and most famous cafes in Khan el-Khalili.', fr: 'L\'un des cafés les plus anciens et les plus célèbres du Caire à Khan el-Khalili.', ar: 'أحد أقدم وأشهر المقاهي في القاهرة في خان الخليلي.' },
        longDescription: { en: 'Operating since 1797, El Fishawy is a historic landmark. Adorned with large mirrors and antique furniture, it has been a meeting place for writers, artists, and intellectuals for centuries, including the Nobel laureate Naguib Mahfouz.', fr: 'Ouvert depuis 1797, El Fishawy est un monument historique. Orné de grands miroirs et de meubles anciens, il a été un lieu de rencontre pour les écrivains, les artistes et les intellectuels pendant des siècles, dont le lauréat du prix Nobel Naguib Mahfouz.', ar: 'يعمل مقهى الفيشاوي منذ عام 1797، وهو معلم تاريخي. تم تزيينه بمرايا كبيرة وأثاث عتيق، وكان مكانًا للقاء الكتاب والفنانين والمثقفين لقرون، بما في ذلك نجيب محفوظ الحائز على جائزة نوبل.' },
        rating: 4.4,
        averagePrice: '$$',
        googleMapsUrl: 'https://maps.app.goo.gl/C2rYjL3xZ4w5aB6v7',
      },
      // ... 9 more cafes for Cairo
    ],
    hotels: [
      {
        id: 'cai-h-1',
        name: { en: 'Marriott Mena House', fr: 'Marriott Mena House', ar: 'فندق ماريوت مينا هاوس' },
        images: ['https://images.picsum.photos/id/30/1024/768.jpg', 'https://images.picsum.photos/id/31/1024/768.jpg'],
        shortDescription: { en: 'A historic palace hotel with spectacular views of the pyramids.', fr: 'Un hôtel-palais historique avec des vues spectaculaires sur les pyramides.', ar: 'فندق قصر تاريخي بإطلالات خلابة على الأهرامات.' },
        longDescription: { en: 'Originally a royal hunting lodge, the Marriott Mena House combines historic charm with modern luxury. Guests can enjoy lush gardens, exquisite dining, and unparalleled views of the Great Pyramids of Giza, offering a truly once-in-a-lifetime experience.', fr: 'À l\'origine un pavillon de chasse royal, le Marriott Mena House allie le charme historique au luxe moderne. Les clients peuvent profiter de jardins luxuriants, de restaurants exquis et de vues incomparables sur les grandes pyramides de Gizeh, offrant une expérience vraiment unique.', ar: 'كان فندق ماريوت مينا هاوس في الأصل نزل صيد ملكي، ويجمع بين السحر التاريخي والفخامة الحديثة. يمكن للضيوف الاستمتاع بالحدائق المورقة وتناول الطعام الرائع والإطلالات التي لا مثيل لها على أهرامات الجيزة العظيمة، مما يوفر تجربة فريدة من نوعها حقًا.' },
        rating: 4.8,
        averagePrice: '$$$$',
        googleMapsUrl: 'https://maps.app.goo.gl/tZ5fX6w7rYp8L3s9a',
        contactNumber: '+20 2 33773222'
      }
      // ... 9 more hotels for Cairo
    ]
  },
  giza: {
    id: 'giza',
    name: { en: 'Giza', fr: 'Gizeh', ar: 'الجيزة' },
    heritage: [
      {
        id: 'giz-h-1',
        name: { en: 'Giza Pyramid Complex', fr: 'Complexe de pyramides de Gizeh', ar: 'مجمع أهرامات الجيزة' },
        images: ['https://images.picsum.photos/id/40/1024/768.jpg', 'https://images.picsum.photos/id/41/1024/768.jpg', 'https://images.picsum.photos/id/42/1024/768.jpg'],
        shortDescription: { en: 'Includes the Great Pyramid, Khafre, Menkaure, and the Great Sphinx.', fr: 'Comprend la Grande Pyramide, Khéphren, Mykérinos et le Grand Sphinx.', ar: 'يضم الهرم الأكبر وخفرع ومنقرع وأبو الهول العظيم.' },
        longDescription: { en: 'The Giza Plateau is one of the most famous archaeological sites in the world. It contains the Great Pyramid of Giza (one of the Seven Wonders of the Ancient World), the somewhat smaller Pyramid of Khafre, the relatively modest-sized Pyramid of Menkaure, along with a number of smaller satellite edifices known as "queens" pyramids, and the Great Sphinx.', fr: 'Le plateau de Gizeh est l\'un des sites archéologiques les plus célèbres au monde. Il contient la Grande Pyramide de Gizeh (l\'une des Sept Merveilles du Monde Antique), la Pyramide de Khéphren un peu plus petite, la Pyramide de Mykérinos de taille relativement modeste, ainsi qu\'un certain nombre d\'édifices satellites plus petits connus sous le nom de pyramides de "reines", et le Grand Sphinx.', ar: 'هضبة الجيزة هي واحدة من أشهر المواقع الأثرية في العالم. تحتوي على هرم خوفو الأكبر (إحدى عجائب الدنيا السبع في العالم القديم)، وهرم خفرع الأصغر حجمًا إلى حد ما، وهرم منقرع المتواضع نسبيًا، إلى جانب عدد من الصروح الصغيرة التابعة المعروفة باسم أهرامات "الملكات"، وأبو الهول العظيم.' },
        rating: 4.9,
        googleMapsUrl: 'https://maps.app.goo.gl/M5dYkR3eW2p4Z1a99',
      },
      // ... 9 more heritage sites for Giza
    ],
    restaurants: [],
    cafes: [],
    hotels: []
  },
  luxor: {
    id: 'luxor',
    name: { en: 'Luxor', fr: 'Louxor', ar: 'الأقصر' },
    heritage: [
      {
        id: 'lux-h-1',
        name: { en: 'Karnak Temple Complex', fr: 'Complexe du temple de Karnak', ar: 'مجمع معابد الكرنك' },
        images: ['https://images.picsum.photos/id/50/1024/768.jpg', 'https://images.picsum.photos/id/51/1024/768.jpg'],
        shortDescription: { en: 'A vast mix of decayed temples, chapels, pylons, and other buildings.', fr: 'Un vaste mélange de temples en ruines, de chapelles, de pylônes et d\'autres bâtiments.', ar: 'مزيج واسع من المعابد المتهالكة والمصليات والأبراج والمباني الأخرى.' },
        longDescription: { en: 'The Karnak Temple Complex comprises a vast mix of decayed temples, chapels, pylons, and other buildings near Luxor, in Egypt. Construction at the complex began during the reign of Senusret I in the Middle Kingdom and continued into the Ptolemaic period. It is a vast open-air museum and the second largest ancient religious site in the world.', fr: 'Le complexe du temple de Karnak comprend un vaste mélange de temples en ruines, de chapelles, de pylônes et d\'autres bâtiments près de Louxor, en Égypte. La construction du complexe a commencé sous le règne de Sésostris Ier au Moyen Empire et s\'est poursuivie jusqu\'à l\'époque ptolémaïque. C\'est un vaste musée en plein air et le deuxième plus grand site religieux antique au monde.', ar: 'يضم مجمع معابد الكرنك مزيجًا واسعًا من المعابد المتهالكة والمصليات والأبراج والمباني الأخرى بالقرب من الأقصر في مصر. بدأ بناء المجمع في عهد سنوسرت الأول في المملكة الوسطى واستمر حتى العصر البطلمي. إنه متحف ضخم في الهواء الطلق وثاني أكبر موقع ديني قديم في العالم.' },
        rating: 4.9,
        googleMapsUrl: 'https://maps.app.goo.gl/hG9jF8yE7zD6k4A8A',
        contactNumber: '+20 95 2370637'
      },
      // ... 9 more heritage sites for Luxor
    ],
    restaurants: [],
    cafes: [],
    hotels: []
  },
  // Add other 15 governorates with just id and name for the dropdown
  aswan: { id: 'aswan', name: { en: 'Aswan', fr: 'Assouan', ar: 'أسوان' }, heritage: [], restaurants: [], cafes: [], hotels: [] },
  sharm_el_sheikh: { id: 'sharm_el_sheikh', name: { en: 'Sharm El-Sheikh', fr: 'Charm el-Cheikh', ar: 'شرم الشيخ' }, heritage: [], restaurants: [], cafes: [], hotels: [] },
  hurghada: { id: 'hurghada', name: { en: 'Hurghada', fr: 'Hurghada', ar: 'الغردقة' }, heritage: [], restaurants: [], cafes: [], hotels: [] },
  alexandria: { id: 'alexandria', name: { en: 'Alexandria', fr: 'Alexandrie', ar: 'الإسكندرية' }, heritage: [], restaurants: [], cafes: [], hotels: [] },
  suez: { id: 'suez', name: { en: 'Suez', fr: 'Suez', ar: 'السويس' }, heritage: [], restaurants: [], cafes: [], hotels: [] },
  port_said: { id: 'port_said', name: { en: 'Port Said', fr: 'Port-Saïd', ar: 'بورسعيد' }, heritage: [], restaurants: [], cafes: [], hotels: [] },
  ismailia: { id: 'ismailia', name: { en: 'Ismailia', fr: 'Ismaïlia', ar: 'الإسماعيلية' }, heritage: [], restaurants: [], cafes: [], hotels: [] },
  damietta: { id: 'damietta', name: { en: 'Damietta', fr: 'Damiette', ar: 'دمياط' }, heritage: [], restaurants: [], cafes: [], hotels: [] },
  marsa_matrouh: { id: 'marsa_matrouh', name: { en: 'Marsa Matrouh', fr: 'Marsa Matrouh', ar: 'مرسى مطروح' }, heritage: [], restaurants: [], cafes: [], hotels: [] },
  fayoum: { id: 'fayoum', name: { en: 'Fayoum', fr: 'Fayoum', ar: 'الفيوم' }, heritage: [], restaurants: [], cafes: [], hotels: [] },
  minya: { id: 'minya', name: { en: 'Minya', fr: 'Minya', ar: 'المنيا' }, heritage: [], restaurants: [], cafes: [], hotels: [] },
  assiut: { id: 'assiut', name: { en: 'Assiut', fr: 'Assiout', ar: 'أسيوط' }, heritage: [], restaurants: [], cafes: [], hotels: [] },
  beni_suef: { id: 'beni_suef', name: { en: 'Beni Suef', fr: 'Beni Souef', ar: 'بني سويف' }, heritage: [], restaurants: [], cafes: [], hotels: [] },
  kafr_el_sheikh: { id: 'kafr_el_sheikh', name: { en: 'Kafr El Sheikh', fr: 'Kafr el-Cheikh', ar: 'كفر الشيخ' }, heritage: [], restaurants: [], cafes: [], hotels: [] },
  sohag: { id: 'sohag', name: { en: 'Sohag', fr: 'Sohag', ar: 'سوهاج' }, heritage: [], restaurants: [], cafes: [], hotels: [] },
};

// UI translations
export const UI_TRANSLATIONS: Translations = {
  en: {
    appName: "TourMate Egypt",
    welcomeMessage: "Your personal guide to exploring the wonders of Egypt. Select your governorate to begin.",
    selectGovernorate: "Select a Governorate",
    start: "Start",
    heritageSites: "Heritage Sites",
    restaurants: "Restaurants",
    cafes: "Cafés",
    hotels: "Hotels",
    viewDetails: "View Details",
    searchPlaceholder: "Search for a place...",
    rating: "Rating",
    averagePrice: "Average Price",
    contact: "Contact",
    listenDescription: "Listen to Description",
    getDirections: "Get Directions",
    addToFavorites: "Add to Favorites",
    removeFromFavorites: "Remove from Favorites",
    share: "Share",
    maleVoice: "Male Voice",
    femaleVoice: "Female Voice",
    favorites: "Favorites",
    myFavorites: "My Favorites",
    noFavorites: "You haven't added any favorites yet.",
    about: "About",
    aboutTourMate: "About TourMate Egypt",
    aboutText: "TourMate Egypt is a passion project designed to make exploring Egypt's rich culture and history easier and more immersive for tourists. It provides curated lists of significant places across various governorates, complete with details, multilingual support, and interactive features.",
    changeGovernorate: "Change Governorate",
    addedToFavorites: "Added to favorites!",
    removedFromFavorites: "Removed from favorites!",
    close: "Close",
    back: "Back",
  },
  fr: {
    appName: "TourMate Égypte",
    welcomeMessage: "Votre guide personnel pour explorer les merveilles de l'Égypte. Sélectionnez votre gouvernorat pour commencer.",
    selectGovernorate: "Sélectionnez un gouvernorat",
    start: "Commencer",
    heritageSites: "Sites du patrimoine",
    restaurants: "Restaurants",
    cafes: "Cafés",
    hotels: "Hôtels",
    viewDetails: "Voir les détails",
    searchPlaceholder: "Rechercher un lieu...",
    rating: "Évaluation",
    averagePrice: "Prix moyen",
    contact: "Contact",
    listenDescription: "Écouter la description",
    getDirections: "Obtenir l'itinéraire",
    addToFavorites: "Ajouter aux favoris",
    removeFromFavorites: "Retirer des favoris",
    share: "Partager",
    maleVoice: "Voix masculine",
    femaleVoice: "Voix féminine",
    favorites: "Favoris",
    myFavorites: "Mes favoris",
    noFavorites: "Vous n'avez pas encore ajouté de favoris.",
    about: "À propos",
    aboutTourMate: "À propos de TourMate Égypte",
    aboutText: "TourMate Égypte est un projet passionné conçu pour rendre l'exploration de la riche culture et de l'histoire de l'Égypte plus facile et plus immersive pour les touristes. Il fournit des listes organisées de lieux importants dans divers gouvernorats, avec des détails, un support multilingue et des fonctionnalités interactives.",
    changeGovernorate: "Changer de gouvernorat",
    addedToFavorites: "Ajouté aux favoris !",
    removedFromFavorites: "Retiré des favoris !",
    close: "Fermer",
    back: "Retour",
  },
  ar: {
    appName: "رفيق السفر مصر",
    welcomeMessage: "دليلك الشخصي لاستكشاف عجائب مصر. اختر محافظتك للبدء.",
    selectGovernorate: "اختر محافظة",
    start: "ابدأ",
    heritageSites: "مواقع تراثية",
    restaurants: "مطاعم",
    cafes: "مقاهي",
    hotels: "فنادق",
    viewDetails: "عرض التفاصيل",
    searchPlaceholder: "ابحث عن مكان...",
    rating: "التقييم",
    averagePrice: "متوسط السعر",
    contact: "للتواصل",
    listenDescription: "استمع للوصف",
    getDirections: "احصل على الاتجاهات",
    addToFavorites: "أضف إلى المفضلة",
    removeFromFavorites: "إزالة من المفضلة",
    share: "مشاركة",
    maleVoice: "صوت رجالي",
    femaleVoice: "صوت نسائي",
    favorites: "المفضلة",
    myFavorites: "مفضلتي",
    noFavorites: "لم تقم بإضافة أي أماكن مفضلة بعد.",
    about: "حول",
    aboutTourMate: "حول رفيق السفر مصر",
    aboutText: "رفيق السفر مصر هو مشروع تم تطويره بشغف لجعل استكشاف ثقافة مصر وتاريخها الغني أكثر سهولة ومتعة للسياح. يوفر قوائم منسقة للأماكن الهامة عبر مختلف المحافظات، مع تفاصيل كاملة ودعم متعدد اللغات وميزات تفاعلية.",
    changeGovernorate: "تغيير المحافظة",
    addedToFavorites: "تمت الإضافة إلى المفضلة!",
    removedFromFavorites: "تمت الإزالة من المفضلة!",
    close: "إغلاق",
    back: "رجوع",
  },
};
