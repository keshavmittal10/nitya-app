export const SHLOKAS = [
  {
    id: 1,
    chapter: "Ch.2 V.47",
    grantha: "Bhagavad Gita",
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    hindi: "आपका अधिकार केवल कर्म करने में है, फल पाने में नहीं। कर्म को फल का कारण मत समझो और अकर्म में भी आसक्त मत हो।",
    english: "You have the right to perform your duties, but never claim entitlement to its fruits. Let not the fruits be your motive, nor let your attachment be to inaction.",
  },
  {
    id: 2,
    chapter: "Ch.6 V.5",
    grantha: "Bhagavad Gita",
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
    hindi: "अपने आप से अपना उद्धार करो, अपने आप को नीचे मत गिराओ। क्योंकि आत्मा ही अपना मित्र है और आत्मा ही अपना शत्रु है।",
    english: "Elevate yourself through the power of your mind, and not degrade yourself, for the mind can be the friend and also the enemy of the self.",
  },
  {
    id: 3,
    chapter: "Ch.2 V.62",
    grantha: "Bhagavad Gita",
    sanskrit: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते।\nसङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते॥",
    hindi: "विषयों का चिंतन करने से उनमें आसक्ति होती है, आसक्ति से कामना, कामना से क्रोध उत्पन्न होता है।",
    english: "Contemplating the objects of the senses, a person develops attachment for them; from attachment desires are born; from desire, anger arises.",
  },
];

export const PRAYERS: Record<number, { deity: string; name: string; hi: string; icon: string; color: string; g: string; day: string; sub: string }> = {
  0: { deity: "Surya Dev", name: "Aditya Hridayam", hi: "आदित्य हृदयम्", icon: "☀️", color: "#F97316", g: "linear-gradient(135deg,#7C2D12,#9A3412)", day: "Sunday", sub: "सूर्य उपासना · रविवार" },
  1: { deity: "Lord Shiva", name: "Shiva Panchakshara", hi: "शिव पञ्चाक्षर स्तोत्र", icon: "🔱", color: "#60A5FA", g: "linear-gradient(135deg,#1E3A5F,#1E40AF)", day: "Monday", sub: "शिव उपासना · सोमवार" },
  2: { deity: "Lord Hanuman", name: "Hanuman Chalisa", hi: "श्री हनुमान चालीसा", icon: "🐒", color: "#EF4444", g: "linear-gradient(135deg,#7F1D1D,#991B1B)", day: "Tuesday", sub: "हनुमान उपासना · मंगलवार" },
  3: { deity: "Lord Ganesha", name: "Ganesh Aarti", hi: "श्री गणेश आरती", icon: "🌺", color: "#F59E0B", g: "linear-gradient(135deg,#78350F,#92400E)", day: "Wednesday", sub: "गणेश उपासना · बुधवार" },
  4: { deity: "Shyam Baba", name: "Shyam Baba Aarti", hi: "श्री श्याम बाबा आरती", icon: "🙏", color: "#8B5CF6", g: "linear-gradient(135deg,#2E1065,#4C1D95)", day: "Thursday", sub: "श्याम उपासना · गुरुवार" },
  5: { deity: "Goddess Lakshmi", name: "Lakshmi Aarti", hi: "श्री लक्ष्मी जी की आरती", icon: "🌸", color: "#EC4899", g: "linear-gradient(135deg,#831843,#9D174D)", day: "Friday", sub: "लक्ष्मी उपासना · शुक्रवार" },
  6: { deity: "Shani Dev", name: "Shani Dev Aarti", hi: "श्री शनि देव आरती", icon: "⚫", color: "#64748B", g: "linear-gradient(135deg,#0F172A,#334155)", day: "Saturday", sub: "शनि उपासना · शनिवार" },
};

export const CHAUPAIS = [
  { n: "दोहा १", txt: "श्रीगुरु चरन सरोज रज,\nनिज मनु मुकुरु सुधारि।\nबरनऊँ रघुबर बिमल जसु,\nजो दायकु फल चारि॥", hi: "श्री गुरु के चरण-कमलों की धूल से मन-दर्पण को शुद्ध करके रघुनाथजी के निर्मल यश का वर्णन करता हूँ।", c: "#F97316", bg: "rgba(249,115,22,.08)", bd: "rgba(249,115,22,.22)" },
  { n: "चौपाई १", txt: "जय हनुमान ज्ञान गुण सागर।\nजय कपीस तिहुँ लोक उजागर॥", hi: "हे हनुमान! ज्ञान और गुणों के सागर — तीनों लोकों में प्रसिद्ध — आपकी जय हो।", c: "#A78BFA", bg: "rgba(167,139,250,.08)", bd: "rgba(167,139,250,.22)" },
  { n: "चौपाई २", txt: "राम दूत अतुलित बल धामा।\nअंजनि पुत्र पवन सुत नामा॥", hi: "आप राम के दूत और अतुलनीय बल के भंडार हैं। अंजनी-पुत्र और पवन-सुत नाम से जाने जाते हैं।", c: "#34D399", bg: "rgba(52,211,153,.08)", bd: "rgba(52,211,153,.22)" },
  { n: "चौपाई ३", txt: "महावीर विक्रम बजरंगी।\nकुमति निवार सुमति के संगी॥", hi: "हे महावीर, पराक्रमी बज्र-शरीर वाले! आप बुरी बुद्धि दूर करते और सुमति के साथी हैं।", c: "#FBBF24", bg: "rgba(251,191,36,.08)", bd: "rgba(251,191,36,.22)" },
  { n: "चौपाई ४", txt: "कंचन बरन बिराज सुबेसा।\nकानन कुण्डल कुंचित केसा॥", hi: "सोने सा कांतिमान शरीर, सुंदर वस्त्र, कानों में कुंडल और घुंघराले केश — आप सुशोभित हैं।", c: "#60A5FA", bg: "rgba(96,165,250,.08)", bd: "rgba(96,165,250,.22)" },
  { n: "चौपाई ५", txt: "हाथ बज्र औ ध्वजा बिराजे।\nकाँधे मूँज जनेउ साजे॥", hi: "हाथ में वज्र और ध्वजा सुशोभित है, कंधे पर मूंज का जनेऊ विराजमान है।", c: "#F472B6", bg: "rgba(244,114,182,.08)", bd: "rgba(244,114,182,.22)" },
  { n: "चौपाई ६", txt: "शंकर सुवन केसरी नंदन।\nतेज प्रताप महा जग वंदन॥", hi: "शंकर के अंश और केसरी-नंदन — आपका महान तेज और प्रताप है, सारा जगत आपको वंदन करता है।", c: "#FB923C", bg: "rgba(251,146,60,.08)", bd: "rgba(251,146,60,.22)" },
  { n: "चौपाई ७", txt: "विद्यावान गुनी अति चातुर।\nराम काज करिबे को आतुर॥", hi: "आप विद्वान, गुणवान और अत्यंत चतुर हैं — सदैव श्री राम के कार्य के लिए तत्पर रहते हैं।", c: "#818CF8", bg: "rgba(129,140,248,.08)", bd: "rgba(129,140,248,.22)" },
  { n: "चौपाई ८", txt: "प्रभु चरित्र सुनिबे को रसिया।\nराम लखन सीता मन बसिया॥", hi: "प्रभु के चरित्र सुनने के रसिक — राम, लक्ष्मण और सीता सदा आपके मन में विराजते हैं।", c: "#2DD4BF", bg: "rgba(45,212,191,.08)", bd: "rgba(45,212,191,.22)" },
  { n: "दोहा अंत", txt: "पवन तनय संकट हरन,\nमंगल मूरति रूप।\nराम लखन सीता सहित,\nहृदय बसहु सुर भूप॥", hi: "हे पवनपुत्र, संकट-हरण, मंगलमूर्ति! राम-लक्ष्मण-सीता सहित मेरे हृदय में सदा निवास करें।", c: "#FBBF24", bg: "rgba(251,191,36,.08)", bd: "rgba(251,191,36,.22)" },
];

export const PHASES = [
  { id: 1, emoji: "🌱", title: "Self Awareness", days: "Days 1–7", theme: "Understanding mind & confusion", color: "#22C55E", dim: "rgba(34,197,94,.12)", bdr: "rgba(34,197,94,.28)" },
  { id: 2, emoji: "⚔️", title: "Right Action", days: "Days 8–14", theme: "Karma Yoga & living correctly", color: "#F59E0B", dim: "rgba(245,158,11,.12)", bdr: "rgba(245,158,11,.28)" },
  { id: 3, emoji: "🧘", title: "Inner Transformation", days: "Days 15–21", theme: "Peace, devotion & higher awareness", color: "#A78BFA", dim: "rgba(167,139,250,.12)", bdr: "rgba(167,139,250,.28)" },
];

export const DAYS = [
  { d: 1, p: 1, t: "Arjuna's Confusion", s: "Why we all feel lost", sl: "नष्टो मोहः स्मृतिर्लब्धा", done: true },
  { d: 2, p: 1, t: "Nature of Stress", s: "Mind as friend & enemy", sl: "उद्धरेदात्मनात्मानं", done: true },
  { d: 3, p: 1, t: "Duty vs Emotion", s: "What truly belongs to us", sl: "कर्मण्येवाधिकारस्ते", done: true },
  { d: 4, p: 1, t: "Control of Mind", s: "Restless mind, steady soul", sl: "असंशयं महाबाहो", done: true },
  { d: 5, p: 1, t: "Fear & Attachment", s: "Root of all suffering", sl: "ध्यायतो विषयान्पुंसः", done: false, active: true },
  { d: 6, p: 1, t: "Karma Concept", s: "Action without reaction", sl: "नैनं छिन्दन्ति शस्त्राणि", done: false },
  { d: 7, p: 1, t: "Self vs Ego", s: "Who am I, really?", sl: "आत्मैव ह्यात्मनो बन्धुः", done: false },
  { d: 8, p: 2, t: "Karma Yoga", s: "Work as worship", sl: "योगः कर्मसु कौशलम्", done: false },
  { d: 9, p: 2, t: "Focus in Action", s: "The art of doing", sl: "व्यवसायात्मिका बुद्धिः", done: false },
  { d: 10, p: 2, t: "Success & Failure", s: "Equanimity in all", sl: "सिद्ध्यसिद्ध्योः समो भूत्वा", done: false },
  { d: 11, p: 2, t: "Purposeful Work", s: "Act with intent", sl: "लोकेऽस्मिन्द्विविधा निष्ठा", done: false },
  { d: 12, p: 2, t: "Leadership Mind", s: "Serve without self", sl: "यद्यदाचरति श्रेष्ठः", done: false },
  { d: 13, p: 2, t: "Emotional Balance", s: "Neither high nor low", sl: "समदुःखसुखः स्वस्थः", done: false },
  { d: 14, p: 2, t: "Inner Strength", s: "The unshakeable core", sl: "स्थितप्रज्ञस्य का भाषा", done: false },
  { d: 15, p: 3, t: "Meditation Basics", s: "Stilling the storm within", sl: "यत्र योगेश्वरः कृष्णः", done: false },
  { d: 16, p: 3, t: "Nature of Faith", s: "Shraddha — the seed", sl: "श्रद्धावान्लभते ज्ञानम्", done: false },
  { d: 17, p: 3, t: "Letting Go", s: "Release what binds you", sl: "त्यागाच्छान्तिरनन्तरम्", done: false },
  { d: 18, p: 3, t: "Surrender", s: "Trusting the divine flow", sl: "सर्वधर्मान्परित्यज्य", done: false },
  { d: 19, p: 3, t: "Living Fearlessly", s: "Abhaya — no fear", sl: "अभयं सत्त्वसंशुद्धिः", done: false },
  { d: 20, p: 3, t: "Dharma Today", s: "Ancient wisdom, modern life", sl: "स्वे स्वे कर्मण्यभिरतः", done: false },
  { d: 21, p: 3, t: "Integration", s: "Your life plan begins", sl: "तमेव शरणं गच्छ", done: false },
];

export const NAV = [
  { id: "home", icon: "🏠", label: "VedPath" },
  { id: "prarthana", icon: "🙏", label: "Prarthana" },
  { id: "sadhana", icon: "🌿", label: "Sadhana" },
  { id: "anushthan", icon: "🛤️", label: "Anushthan" },
  { id: "profile", icon: "👤", label: "Profile" },
];

export const FULL_DAYS = [
  {
    id: 0, short: "Sun", full: "Sunday", deity: "Surya Dev", icon: "☀️",
    name: "सूर्य देव आरती", sub: "आदित्य उपासना · रविवार",
    color: "#F97316", bg: "linear-gradient(170deg,#FFF4EB 0%,#FFE8CC 55%,#FFD4A0 100%)",
    heroBg: "linear-gradient(135deg,#7C2D12,#9A3412,#C2410C)", glow: "rgba(249,115,22,.2)",
    verses: [
      { label: "आरती प्रारम्भ", text: "जय कश्यप नंदन, ॐ जय आदित्य देवा।\nकंचन काया किरणमय, तेज प्रभु देवा॥", c: "#F97316" },
      { label: "पद २", text: "सप्त अश्व रथ राजित, अरुण सारथी स्वामी।\nत्रिभुवन प्रकाशक तुम, जीवन के दानी॥", c: "#FB923C" },
      { label: "पद ३", text: "उदयाचल पर उदित हो, जग को सुखदाता।\nअस्ताचल जब जाओ, शांति बरसाता॥", c: "#FBBF24" },
      { label: "पद ४", text: "प्रातःकाल जो ध्यावे, रोग दोष मिट जावे।\nमनवांछित फल पाकर, जीवन सफल बनावे॥", c: "#F59E0B" },
      { label: "पद ५", text: "अर्घ्य चढ़े जल निर्मल, भक्त भाव से लाते।\nतेरी कृपा से प्रभु, दुख सब दूर हो जाते॥", c: "#EF4444" },
      { label: "आरती समापन", text: "जय कश्यप नंदन, ॐ जय आदित्य देवा।\nकंचन काया किरणमय, तेज प्रभु देवा॥", c: "#F97316" },
    ],
  },
  {
    id: 1, short: "Mon", full: "Monday", deity: "Lord Shiva", icon: "🔱",
    name: "शिव जी की आरती", sub: "शिव उपासना · सोमवार",
    color: "#60A5FA", bg: "linear-gradient(170deg,#EFF6FF 0%,#DBEAFE 55%,#BFDBFE 100%)",
    heroBg: "linear-gradient(135deg,#1E3A5F,#1E40AF,#1D4ED8)", glow: "rgba(96,165,250,.2)",
    verses: [
      { label: "आरती प्रारम्भ", text: "ॐ जय शिव ओंकारा, प्रभु जय शिव ओंकारा।\nब्रह्मा विष्णु सदाशिव, अर्धांगी धारा॥", c: "#60A5FA" },
      { label: "पद २", text: "एकानन चतुरानन पंचानन राजे।\nहंसासन गरुड़ासन वृषवाहन साजे॥", c: "#818CF8" },
      { label: "पद ३", text: "दो भुज चार चतुर्भुज दस भुज अति सोहे।\nतीनों रूप निरखते त्रिभुवन मन मोहे॥", c: "#A78BFA" },
      { label: "पद ४", text: "अक्षमाला वनमाला मुण्डमाला धारी।\nचन्दन मृगमद सोहै भाले शशिधारी॥", c: "#60A5FA" },
      { label: "आरती समापन", text: "त्रिगुणस्वामी जी की आरती जो कोई नर गावे।\nकहत शिवानन्द स्वामी सुख संपत्ति पावे॥", c: "#A78BFA" },
    ],
  },
  {
    id: 2, short: "Tue", full: "Tuesday", deity: "Lord Hanuman", icon: "🐒",
    name: "हनुमान जी की आरती", sub: "हनुमान उपासना · मंगलवार",
    color: "#EF4444", bg: "linear-gradient(170deg,#FFF5F5 0%,#FFE4E4 55%,#FECACA 100%)",
    heroBg: "linear-gradient(135deg,#7F1D1D,#991B1B,#B91C1C)", glow: "rgba(239,68,68,.2)",
    verses: [
      { label: "आरती प्रारम्भ", text: "आरती कीजै हनुमान लला की।\nदुष्ट दलन रघुनाथ कला की॥", c: "#EF4444" },
      { label: "पद २", text: "जाके बल से गिरिवर कांपे।\nरोग दोष जाके निकट न झांके॥", c: "#F97316" },
      { label: "पद ३", text: "अंजनि पुत्र महाबलदायी।\nसंतन के प्रभु सदा सहाई॥", c: "#EF4444" },
      { label: "आरती समापन", text: "आरती कीजै हनुमान लला की।\nदुष्ट दलन रघुनाथ कला की॥", c: "#DC2626" },
    ],
  },
  {
    id: 3, short: "Wed", full: "Wednesday", deity: "Lord Ganesha", icon: "🌺",
    name: "श्री गणेश आरती", sub: "गणेश उपासना · बुधवार",
    color: "#F59E0B", bg: "linear-gradient(170deg,#FFFBEB 0%,#FEF3C7 55%,#FDE68A 100%)",
    heroBg: "linear-gradient(135deg,#78350F,#92400E,#B45309)", glow: "rgba(245,158,11,.2)",
    verses: [
      { label: "आरती प्रारम्भ", text: "जय गणेश जय गणेश जय गणेश देवा।\nमाता जाकी पार्वती पिता महादेवा॥", c: "#F59E0B" },
      { label: "पद २", text: "एकदंत दयावंत चार भुजाधारी।\nमाथे सिंदूर सोहे मूसे की सवारी॥", c: "#FBBF24" },
      { label: "पद ३", text: "अंधन को आंख देत कोढ़िन को काया।\nबांझन को पुत्र देत निर्धन को माया॥", c: "#F59E0B" },
      { label: "आरती समापन", text: "जय गणेश जय गणेश जय गणेश देवा।\nमाता जाकी पार्वती पिता महादेवा॥", c: "#F59E0B" },
    ],
  },
  {
    id: 4, short: "Thu", full: "Thursday", deity: "Shyam Baba", icon: "🙏",
    name: "श्री श्याम बाबा आरती", sub: "श्याम उपासना · गुरुवार",
    color: "#8B5CF6", bg: "linear-gradient(170deg,#F5F3FF 0%,#EDE9FE 55%,#DDD6FE 100%)",
    heroBg: "linear-gradient(135deg,#2E1065,#3B0764,#4C1D95)", glow: "rgba(139,92,246,.2)",
    verses: [
      { label: "आरती प्रारम्भ", text: "ॐ जय श्री श्याम हरे, बाबा जय श्री श्याम हरे।\nखाटू धाम विराजत, भक्तों के संकट टरे॥", c: "#8B5CF6" },
      { label: "पद २", text: "रत्न सिंहासन राजत, मोर मुकुट सिर धारे।\nमोरछड़ी की शोभा, मन भक्तों के हरे॥", c: "#A78BFA" },
      { label: "पद ३", text: "तन मन धन सब अर्पण, चरणों में तेरे स्वामी।\nदीनों के तुम दाता, अंतर्यामी स्वामी॥", c: "#8B5CF6" },
      { label: "आरती समापन", text: "ॐ जय श्री श्याम हरे, बाबा जय श्री श्याम हरे।\nखाटू धाम विराजत, भक्तों के संकट टरे॥", c: "#7C3AED" },
    ],
  },
  {
    id: 5, short: "Fri", full: "Friday", deity: "Goddess Lakshmi", icon: "🌸",
    name: "श्री लक्ष्मी जी की आरती", sub: "लक्ष्मी उपासना · शुक्रवार",
    color: "#EC4899", bg: "linear-gradient(170deg,#FDF2F8 0%,#FCE7F3 55%,#FBCFE8 100%)",
    heroBg: "linear-gradient(135deg,#831843,#9D174D,#BE185D)", glow: "rgba(236,72,153,.2)",
    verses: [
      { label: "आरती प्रारम्भ", text: "ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता।\nतुमको निसदिन सेवत, हरि विष्णु विधाता॥", c: "#EC4899" },
      { label: "पद २", text: "उमा रमा ब्रह्माणी, तुम ही जग माता।\nसूर्य चन्द्रमा ध्यावत, नारद ऋषि गाता॥", c: "#F472B6" },
      { label: "पद ३", text: "दुर्गा रूप निरंजनि, सुख संपत्ति दाता।\nजो कोई तुमको ध्यावत, ऋद्धि सिद्धि धन पाता॥", c: "#EC4899" },
      { label: "आरती समापन", text: "ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता।\nतुमको निसदिन सेवत, हरि विष्णु विधाता॥", c: "#EC4899" },
    ],
  },
  {
    id: 6, short: "Sat", full: "Saturday", deity: "Shani Dev", icon: "⚫",
    name: "श्री शनि देव आरती", sub: "शनि उपासना · शनिवार",
    color: "#64748B", bg: "linear-gradient(170deg,#F8FAFC 0%,#F1F5F9 55%,#E2E8F0 100%)",
    heroBg: "linear-gradient(135deg,#0F172A,#1E293B,#334155)", glow: "rgba(100,116,139,.18)",
    verses: [
      { label: "आरती प्रारम्भ", text: "जय जय श्री शनिदेव भक्तन हितकारी।\nसूरज के पुत्र प्रभु छाया महतारी॥", c: "#64748B" },
      { label: "पद २", text: "श्याम अंग वक्र दृष्टि चतुर्भुजा धारी।\nनीलाम्बर धार नाथ गज की असवारी॥", c: "#94A3B8" },
      { label: "पद ३", text: "क्रीट मुकुट शीश राजित दिपत है लिलारी।\nमुक्तन की माला गले शोभित बलिहारी॥", c: "#64748B" },
      { label: "आरती समापन", text: "जय जय श्री शनिदेव भक्तन हितकारी।\nसूरज के पुत्र प्रभु छाया महतारी॥", c: "#64748B" },
    ],
  },
];

export const LEVELS = [
  { min: 0, max: 99, label: "Seeker", color: "#C47010" },
  { min: 100, max: 799, label: "Sadhak", color: "#059669" },
  { min: 800, max: 1499, label: "Shravak", color: "#7C3AED" },
  { min: 1500, max: 2199, label: "Bhakt", color: "#2563EB" },
  { min: 2200, max: 2899, label: "Upasak", color: "#DC2626" },
  { min: 2900, max: 3599, label: "Aradhak", color: "#D97706" },
  { min: 3600, max: 4299, label: "Mantrajna", color: "#0891B2" },
  { min: 4300, max: 4999, label: "Satsangi", color: "#9333EA" },
  { min: 5000, max: 5699, label: "Dhyani", color: "#16A34A" },
  { min: 5700, max: 999999, label: "Tapasvi+", color: "#B45309" },
];

export const getBadges = (tapasyaDays: number, shlokaCount: number, mantaDays: number, nightPrayerDays: number, bhaktDays: number) => [
  {
    cat: "Sadhana",
    items: [
      { n: "Tapasvi", ico: "🔥", e: tapasyaDays >= 7, color: "#F97316", glow: "rgba(249,115,22,.25)", desc: "7-day streak" },
      { n: "Nishtha", ico: "⚡", e: tapasyaDays >= 21, color: "#FBBF24", glow: "rgba(251,191,36,.25)", desc: "21-day streak" },
      { n: "Dhruv", ico: "⭐", e: tapasyaDays >= 108, color: "#8B5CF6", glow: "rgba(139,92,246,.25)", desc: "108-day streak" },
    ],
  },
  {
    cat: "Gyan",
    items: [
      { n: "Jigyasu", ico: "📖", e: shlokaCount >= 1, color: "#60A5FA", glow: "rgba(96,165,250,.25)", desc: "Read 1 shloka" },
      { n: "Swadhyayi", ico: "🕮", e: shlokaCount >= 10, color: "#34D399", glow: "rgba(52,211,153,.25)", desc: "Read 10 shlokas" },
      { n: "Vedpathi", ico: "📜", e: shlokaCount >= 50, color: "#F59E0B", glow: "rgba(245,158,11,.25)", desc: "Read 50 shlokas" },
    ],
  },
  {
    cat: "Anushthan",
    items: [
      { n: "Vratachar", ico: "🛤️", e: mantaDays >= 1, color: "#EC4899", glow: "rgba(236,72,153,.25)", desc: "Start journey" },
      { n: "Sadhak", ico: "🧘", e: mantaDays >= 7, color: "#A78BFA", glow: "rgba(167,139,250,.25)", desc: "7 days done" },
      { n: "Yogi", ico: "🌟", e: mantaDays >= 21, color: "#22C55E", glow: "rgba(34,197,94,.25)", desc: "Complete journey" },
    ],
  },
  {
    cat: "Bhakti",
    items: [
      { n: "Bhakt", ico: "🙏", e: bhaktDays >= 1, color: "#F97316", glow: "rgba(249,115,22,.25)", desc: "First completion" },
      { n: "Sevak", ico: "🌺", e: bhaktDays >= 7, color: "#EC4899", glow: "rgba(236,72,153,.25)", desc: "7 completions" },
      { n: "Aradhak", ico: "✨", e: bhaktDays >= 30, color: "#FBBF24", glow: "rgba(251,191,36,.25)", desc: "30 completions" },
    ],
  },
];
