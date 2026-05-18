"use client";
import { useState, useEffect, useRef } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

async function saveUser(uid, data) {
  await setDoc(doc(db, "users", uid), data, { merge: true });
}
async function loadUser(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Cinzel:wght@400;600;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  ::-webkit-scrollbar{width:0;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeDown{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes spinRay{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes sunPulse{from{box-shadow:0 0 0 14px rgba(255,150,30,.09),0 0 0 30px rgba(255,130,0,.05),0 0 50px rgba(255,110,0,.4)}to{box-shadow:0 0 0 20px rgba(255,150,30,.13),0 0 0 42px rgba(255,130,0,.07),0 0 70px rgba(255,110,0,.65)}}
  @keyframes glowBreath{from{opacity:.7;transform:translateX(-50%) scale(1)}to{opacity:1;transform:translateX(-50%) scale(1.1)}}
  @keyframes flicker{0%{transform:scaleX(1) scaleY(1) rotate(-1deg)}30%{transform:scaleX(.88) scaleY(1.1) rotate(2deg)}60%{transform:scaleX(1.1) scaleY(.92) rotate(-2deg)}100%{transform:scaleX(.94) scaleY(1.05) rotate(1deg)}}
  @keyframes flamePulse{from{opacity:.6;transform:scale(1)}to{opacity:1;transform:scale(1.35)}}
  @keyframes ctaShimmer{0%{left:-80%}55%{left:130%}100%{left:130%}}
  @keyframes todayPulse{0%,100%{box-shadow:0 3px 14px rgba(255,100,0,.4)}50%{box-shadow:0 3px 22px rgba(255,100,0,.75)}}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
  @keyframes gradShift{from{background-position:0% 0%}to{background-position:200% 0%}}
  @keyframes wave{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.35)}}
  @keyframes breathe{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.1);opacity:1}}
  @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes shimmer{0%{left:-80%}55%{left:130%}100%{left:130%}}
  @keyframes todayGlow{0%,100%{box-shadow:0 0 18px rgba(255,160,0,.2)}50%{box-shadow:0 0 32px rgba(255,160,0,.55)}}
  @keyframes completePop{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}
`;

const BG="linear-gradient(170deg,#FFF8EC 0%,#FFF2D6 55%,#FFE8B0 100%)";
const BG_DARK="linear-gradient(170deg,#0C0618 0%,#130A28 60%,#0A0512 100%)";

const SHLOKAS=[
  {id:1,chapter:"Ch.2 V.47",grantha:"Bhagavad Gita",
   sanskrit:"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
   hindi:"आपका अधिकार केवल कर्म करने में है, फल पाने में नहीं। कर्म को फल का कारण मत समझो और अकर्म में भी आसक्त मत हो।",
   english:"You have the right to perform your duties, but never claim entitlement to its fruits. Let not the fruits be your motive, nor let your attachment be to inaction."},
];

const PRAYERS={
  0:{deity:"Surya Dev",name:"Aditya Hridayam",hi:"आदित्य हृदयम्",icon:"☀️",color:"#F97316",g:"linear-gradient(135deg,#7C2D12,#9A3412)",day:"Sunday",sub:"सूर्य उपासना · रविवार"},
  1:{deity:"Lord Shiva",name:"Shiva Panchakshara",hi:"शिव पञ्चाक्षर स्तोत्र",icon:"🔱",color:"#60A5FA",g:"linear-gradient(135deg,#1E3A5F,#1E40AF)",day:"Monday",sub:"शिव उपासना · सोमवार"},
  2:{deity:"Lord Hanuman",name:"Hanuman Chalisa",hi:"श्री हनुमान चालीसा",icon:"🐒",color:"#FB923C",g:"linear-gradient(135deg,#7C2D12,#C2410C)",day:"Tuesday",sub:"हनुमान उपासना · मंगलवार"},
  3:{deity:"Lord Ganesha",name:"Ganesh Aarti",hi:"श्री गणेश आरती",icon:"🌺",color:"#F59E0B",g:"linear-gradient(135deg,#78350F,#92400E)",day:"Wednesday",sub:"गणेश उपासना · बुधवार"},
  4:{deity:"Shyam Baba",name:"Shyam Baba Aarti",hi:"श्री श्याम बाबा आरती",icon:"🙏",color:"#8B5CF6",g:"linear-gradient(135deg,#2E1065,#4C1D95)",day:"Thursday",sub:"श्याम उपासना · गुरुवार"},
  5:{deity:"Goddess Lakshmi",name:"Lakshmi Aarti",hi:"श्री लक्ष्मी जी की आरती",icon:"🌸",color:"#EC4899",g:"linear-gradient(135deg,#831843,#9D174D)",day:"Friday",sub:"लक्ष्मी उपासना · शुक्रवार"},
  6:{deity:"Shani Dev",name:"Shani Dev Aarti",hi:"श्री शनि देव आरती",icon:"⚫",color:"#64748B",g:"linear-gradient(135deg,#0F172A,#334155)",day:"Saturday",sub:"शनि उपासना · शनिवार"},
};

const CHAUPAIS=[
  {n:"दोहा १",txt:"श्रीगुरु चरन सरोज रज,\nनिज मनु मुकुरु सुधारि।\nबरनऊँ रघुबर बिमल जसु,\nजो दायकु फल चारि॥",hi:"श्री गुरु के चरण-कमलों की धूल से मन-दर्पण को शुद्ध करके रघुनाथजी के निर्मल यश का वर्णन करता हूँ।",c:"#F97316",bg:"rgba(249,115,22,.08)",bd:"rgba(249,115,22,.22)"},
  {n:"चौपाई १",txt:"जय हनुमान ज्ञान गुण सागर।\nजय कपीस तिहुँ लोक उजागर॥",hi:"हे हनुमान! ज्ञान और गुणों के सागर — तीनों लोकों में प्रसिद्ध — आपकी जय हो।",c:"#A78BFA",bg:"rgba(167,139,250,.08)",bd:"rgba(167,139,250,.22)"},
  {n:"चौपाई २",txt:"राम दूत अतुलित बल धामा।\nअंजनि पुत्र पवन सुत नामा॥",hi:"आप राम के दूत और अतुलनीय बल के भंडार हैं। अंजनी-पुत्र और पवन-सुत नाम से जाने जाते हैं।",c:"#34D399",bg:"rgba(52,211,153,.08)",bd:"rgba(52,211,153,.22)"},
  {n:"चौपाई ३",txt:"महावीर विक्रम बजरंगी।\nकुमति निवार सुमति के संगी॥",hi:"हे महावीर, पराक्रमी बज्र-शरीर वाले! आप बुरी बुद्धि दूर करते और सुमति के साथी हैं।",c:"#FBBF24",bg:"rgba(251,191,36,.08)",bd:"rgba(251,191,36,.22)"},
  {n:"चौपाई ४",txt:"कंचन बरन बिराज सुबेसा।\nकानन कुण्डल कुंचित केसा॥",hi:"सोने सा कांतिमान शरीर, सुंदर वस्त्र, कानों में कुंडल और घुंघराले केश — आप सुशोभित हैं।",c:"#60A5FA",bg:"rgba(96,165,250,.08)",bd:"rgba(96,165,250,.22)"},
  {n:"चौपाई ५",txt:"हाथ बज्र औ ध्वजा बिराजे।\nकाँधे मूँज जनेउ साजे॥",hi:"हाथ में वज्र और ध्वजा सुशोभित है, कंधे पर मूंज का जनेऊ विराजमान है।",c:"#F472B6",bg:"rgba(244,114,182,.08)",bd:"rgba(244,114,182,.22)"},
  {n:"चौपाई ६",txt:"शंकर सुवन केसरी नंदन।\nतेज प्रताप महा जग वंदन॥",hi:"शंकर के अंश और केसरी-नंदन — आपका महान तेज और प्रताप है, सारा जगत आपको वंदन करता है।",c:"#FB923C",bg:"rgba(251,146,60,.08)",bd:"rgba(251,146,60,.22)"},
  {n:"चौपाई ७",txt:"विद्यावान गुनी अति चातुर।\nराम काज करिबे को आतुर॥",hi:"आप विद्वान, गुणवान और अत्यंत चतुर हैं — सदैव श्री राम के कार्य के लिए तत्पर रहते हैं।",c:"#818CF8",bg:"rgba(129,140,248,.08)",bd:"rgba(129,140,248,.22)"},
  {n:"चौपाई ८",txt:"प्रभु चरित्र सुनिबे को रसिया।\nराम लखन सीता मन बसिया॥",hi:"प्रभु के चरित्र सुनने के रसिक — राम, लक्ष्मण और सीता सदा आपके मन में विराजते हैं।",c:"#2DD4BF",bg:"rgba(45,212,191,.08)",bd:"rgba(45,212,191,.22)"},
  {n:"दोहा अंत",txt:"पवन तनय संकट हरन,\nमंगल मूरति रूप।\nराम लखन सीता सहित,\nहृदय बसहु सुर भूप॥",hi:"हे पवनपुत्र, संकट-हरण, मंगलमूर्ति! राम-लक्ष्मण-सीता सहित मेरे हृदय में सदा निवास करें।",c:"#FBBF24",bg:"rgba(251,191,36,.08)",bd:"rgba(251,191,36,.22)"},
];

const PHASES=[
  {id:1,emoji:"🌱",title:"Self Awareness",days:"Days 1–7",theme:"Understanding mind & confusion",color:"#22C55E",dim:"rgba(34,197,94,.12)",bdr:"rgba(34,197,94,.28)"},
  {id:2,emoji:"⚔️",title:"Right Action",days:"Days 8–14",theme:"Karma Yoga & living correctly",color:"#F59E0B",dim:"rgba(245,158,11,.12)",bdr:"rgba(245,158,11,.28)"},
  {id:3,emoji:"🧘",title:"Inner Transformation",days:"Days 15–21",theme:"Peace, devotion & higher awareness",color:"#A78BFA",dim:"rgba(167,139,250,.12)",bdr:"rgba(167,139,250,.28)"},
];

const DAYS=[
  {d:1,p:1,t:"Arjuna's Confusion",s:"Why we all feel lost",sl:"नष्टो मोहः स्मृतिर्लब्धा",done:true},
  {d:2,p:1,t:"Nature of Stress",s:"Mind as friend & enemy",sl:"उद्धरेदात्मनात्मानं",done:true},
  {d:3,p:1,t:"Duty vs Emotion",s:"What truly belongs to us",sl:"कर्मण्येवाधिकारस्ते",done:true},
  {d:4,p:1,t:"Control of Mind",s:"Restless mind, steady soul",sl:"असंशयं महाबाहो",done:true},
  {d:5,p:1,t:"Fear & Attachment",s:"Root of all suffering",sl:"ध्यायतो विषयान्पुंसः",done:false,active:true},
  {d:6,p:1,t:"Karma Concept",s:"Action without reaction",sl:"नैनं छिन्दन्ति शस्त्राणि",done:false},
  {d:7,p:1,t:"Self vs Ego",s:"Who am I, really?",sl:"आत्मैव ह्यात्मनो बन्धुः",done:false},
  {d:8,p:2,t:"Karma Yoga",s:"Work as worship",sl:"योगः कर्मसु कौशलम्",done:false},
  {d:9,p:2,t:"Focus in Action",s:"The art of doing",sl:"व्यवसायात्मिका बुद्धिः",done:false},
  {d:10,p:2,t:"Success & Failure",s:"Equanimity in all",sl:"सिद्ध्यसिद्ध्योः समो भूत्वा",done:false},
  {d:11,p:2,t:"Purposeful Work",s:"Act with intent",sl:"लोकेऽस्मिन्द्विविधा निष्ठा",done:false},
  {d:12,p:2,t:"Leadership Mind",s:"Serve without self",sl:"यद्यदाचरति श्रेष्ठः",done:false},
  {d:13,p:2,t:"Emotional Balance",s:"Neither high nor low",sl:"समदुःखसुखः स्वस्थः",done:false},
  {d:14,p:2,t:"Inner Strength",s:"The unshakeable core",sl:"स्थितप्रज्ञस्य का भाषा",done:false},
  {d:15,p:3,t:"Meditation Basics",s:"Stilling the storm within",sl:"यत्र योगेश्वरः कृष्णः",done:false},
  {d:16,p:3,t:"Nature of Faith",s:"Shraddha — the seed",sl:"श्रद्धावान्लभते ज्ञानम्",done:false},
  {d:17,p:3,t:"Letting Go",s:"Release what binds you",sl:"त्यागाच्छान्तिरनन्तरम्",done:false},
  {d:18,p:3,t:"Surrender",s:"Trusting the divine flow",sl:"सर्वधर्मान्परित्यज्य",done:false},
  {d:19,p:3,t:"Living Fearlessly",s:"Abhaya — no fear",sl:"अभयं सत्त्वसंशुद्धिः",done:false},
  {d:20,p:3,t:"Dharma Today",s:"Ancient wisdom, modern life",sl:"स्वे स्वे कर्मण्यभिरतः",done:false},
  {d:21,p:3,t:"Integration",s:"Your life plan begins",sl:"तमेव शरणं गच्छ",done:false},
];

const NAV=[
  {id:"home",icon:"🏠",label:"VedPath"},
  {id:"prarthana",icon:"🙏",label:"Prarthana"},
  {id:"sadhana",icon:"🌿",label:"Sadhana"},
  {id:"anushthan",icon:"🛤️",label:"Anushthan"},
  {id:"profile",icon:"👤",label:"Profile"},
];

const LEVELS=[
  {min:0,max:99,label:"Seeker",color:"#C47010"},
  {min:100,max:799,label:"Sadhak",color:"#059669"},
  {min:800,max:1499,label:"Shravak",color:"#7C3AED"},
  {min:1500,max:2199,label:"Bhakt",color:"#2563EB"},
  {min:2200,max:2899,label:"Upasak",color:"#DC2626"},
  {min:2900,max:3599,label:"Aradhak",color:"#D97706"},
  {min:3600,max:4299,label:"Mantrajna",color:"#0891B2"},
  {min:4300,max:4999,label:"Satsangi",color:"#9333EA"},
  {min:5000,max:5699,label:"Dhyani",color:"#16A34A"},
  {min:5700,max:6399,label:"Tapasvi",color:"#B45309"},
  {min:6400,max:7099,label:"Yogi",color:"#6D28D9"},
  {min:7100,max:7799,label:"Sevak",color:"#0284C7"},
  {min:7800,max:8499,label:"Vairagi",color:"#BE123C"},
  {min:8500,max:9199,label:"Jigyasu",color:"#A16207"},
  {min:9200,max:9899,label:"Shantatma",color:"#0D9488"},
  {min:9900,max:10599,label:"Satyarthi",color:"#7C2D12"},
  {min:10600,max:11299,label:"Suryansh",color:"#1D4ED8"},
  {min:11300,max:11999,label:"Shivansh",color:"#15803D"},
  {min:12000,max:12699,label:"Vishwasi",color:"#9D174D"},
  {min:12700,max:13399,label:"Prabuddha",color:"#92400E"},
  {min:13400,max:14099,label:"Adhyatmi",color:"#C47010"},
  {min:14100,max:14799,label:"Tejasvi",color:"#059669"},
  {min:14800,max:15499,label:"Shraddhavan",color:"#7C3AED"},
  {min:15500,max:16199,label:"Nirmal",color:"#2563EB"},
  {min:16200,max:16899,label:"Nishkaam",color:"#DC2626"},
  {min:16900,max:17599,label:"Samarpit",color:"#D97706"},
  {min:17600,max:18299,label:"Chaitanya",color:"#0891B2"},
  {min:18300,max:18999,label:"Viveki",color:"#9333EA"},
  {min:19000,max:19699,label:"Pavitra",color:"#16A34A"},
  {min:19700,max:20399,label:"Divyachetna",color:"#B45309"},
  {min:20400,max:21099,label:"Bhavarthi",color:"#6D28D9"},
  {min:21100,max:21799,label:"Dharmaveer",color:"#0284C7"},
  {min:21800,max:22499,label:"Vedpathi",color:"#BE123C"},
  {min:22500,max:23199,label:"Mahayogi",color:"#A16207"},
  {min:23200,max:23899,label:"Tatvadarshi",color:"#0D9488"},
  {min:23900,max:24599,label:"Antardrashta",color:"#7C2D12"},
  {min:24600,max:25299,label:"Gyanyogi",color:"#1D4ED8"},
  {min:25300,max:25999,label:"Anandmay",color:"#15803D"},
  {min:26000,max:26699,label:"Prakashit",color:"#9D174D"},
  {min:26700,max:27399,label:"Suryatej",color:"#92400E"},
  {min:27400,max:28099,label:"Rudrabhakt",color:"#C47010"},
  {min:28100,max:28799,label:"Narayansevak",color:"#059669"},
  {min:28800,max:29499,label:"Shivdhyani",color:"#7C3AED"},
  {min:29500,max:30199,label:"Krishnabhakt",color:"#2563EB"},
  {min:30200,max:30899,label:"Ramrasik",color:"#DC2626"},
  {min:30900,max:31599,label:"Bhaktiratna",color:"#D97706"},
  {min:31600,max:32299,label:"Satyadeep",color:"#0891B2"},
  {min:32300,max:32999,label:"Vishuddha",color:"#9333EA"},
  {min:33000,max:33699,label:"Amritatma",color:"#16A34A"},
  {min:33700,max:34399,label:"Dharmachari",color:"#B45309"},
  {min:34400,max:35099,label:"Yogesh",color:"#6D28D9"},
  {min:35100,max:35799,label:"Mahatejas",color:"#0284C7"},
  {min:35800,max:36499,label:"Chidanand",color:"#BE123C"},
  {min:36500,max:37199,label:"Brahmavetta",color:"#A16207"},
  {min:37200,max:37899,label:"Shantidoot",color:"#0D9488"},
  {min:37900,max:38599,label:"Taponishth",color:"#7C2D12"},
  {min:38600,max:39299,label:"Adhyatmdeep",color:"#1D4ED8"},
  {min:39300,max:39999,label:"Bhaktisagar",color:"#15803D"},
  {min:40000,max:40699,label:"Vedjyoti",color:"#9D174D"},
  {min:40700,max:41399,label:"Divyadarshi",color:"#92400E"},
  {min:41400,max:42099,label:"Anandjyoti",color:"#C47010"},
  {min:42100,max:42799,label:"Paramsevak",color:"#059669"},
  {min:42800,max:43499,label:"Mahasadhak",color:"#7C3AED"},
  {min:43500,max:44199,label:"Trikalgyani",color:"#2563EB"},
  {min:44200,max:44899,label:"Atmabodh",color:"#DC2626"},
  {min:44900,max:45599,label:"Satprakash",color:"#D97706"},
  {min:45600,max:46299,label:"Yogratna",color:"#0891B2"},
  {min:46300,max:46999,label:"Moksharthi",color:"#9333EA"},
  {min:47000,max:47699,label:"Shubhchetna",color:"#16A34A"},
  {min:47700,max:48399,label:"Divyatma",color:"#B45309"},
  {min:48400,max:49099,label:"Paramyogi",color:"#6D28D9"},
  {min:49100,max:49799,label:"Adhyatmagyani",color:"#0284C7"},
  {min:49800,max:50499,label:"Shantiratna",color:"#BE123C"},
  {min:50500,max:51199,label:"Bhaktidev",color:"#A16207"},
  {min:51200,max:51899,label:"Tattvagyani",color:"#0D9488"},
  {min:51900,max:52599,label:"Atmavetta",color:"#7C2D12"},
  {min:52600,max:53299,label:"Shivtej",color:"#1D4ED8"},
  {min:53300,max:53999,label:"Vishnuroop",color:"#15803D"},
  {min:54000,max:54699,label:"Suryachetna",color:"#9D174D"},
  {min:54700,max:55399,label:"Paramjyoti",color:"#92400E"},
  {min:55400,max:56099,label:"Dhyanesh",color:"#C47010"},
  {min:56100,max:56799,label:"Tapomurti",color:"#059669"},
  {min:56800,max:57499,label:"Satyaroop",color:"#7C3AED"},
  {min:57500,max:58199,label:"Anandroop",color:"#2563EB"},
  {min:58200,max:58899,label:"Vedatma",color:"#DC2626"},
  {min:58900,max:59599,label:"Yogatma",color:"#D97706"},
  {min:59600,max:60299,label:"Brahmachetna",color:"#0891B2"},
  {min:60300,max:60999,label:"Paramtapasvi",color:"#9333EA"},
  {min:61000,max:61699,label:"Mokshdeep",color:"#16A34A"},
  {min:61700,max:62399,label:"Chidjyoti",color:"#B45309"},
  {min:62400,max:63099,label:"Sanatanratna",color:"#6D28D9"},
  {min:63100,max:63799,label:"Mahachetna",color:"#0284C7"},
  {min:63800,max:64499,label:"Adidev Bhakt",color:"#BE123C"},
  {min:64500,max:65199,label:"Paramarthi",color:"#A16207"},
  {min:65200,max:65899,label:"Divyaprakash",color:"#0D9488"},
  {min:65900,max:66599,label:"Mahadhyani",color:"#7C2D12"},
  {min:66600,max:67299,label:"Brahmjyoti",color:"#1D4ED8"},
  {min:67300,max:67999,label:"Shivoham",color:"#15803D"},
  {min:68000,max:68699,label:"Paramatma Sevak",color:"#9D174D"},
  {min:68700,max:69399,label:"Mokshaprapta",color:"#92400E"},
  {min:69400,max:70099,label:"Kaivalya",color:"#C47010"},
  {min:70100,max:70799,label:"SatChitAnand",color:"#059669"},
  {min:70800,max:71499,label:"Paramshiv",color:"#7C3AED"},
  {min:71500,max:999999,label:"Brahmanubhavi",color:"#2563EB"}
];


/* ── SHARED ── */
function PlayBtn({playing,onToggle,size=44,c1="#FFD700",c2="#FF8C00",shadow}){
  return(
    <button onClick={onToggle} style={{width:size,height:size,borderRadius:"50%",border:"none",cursor:"pointer",flexShrink:0,background:`linear-gradient(135deg,${c1},${c2})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:shadow||`0 5px 18px ${c1}55`,position:"relative",transition:"transform .15s",animation:playing?"none":"pulse 3s infinite"}}>
      {playing
        ?<svg width={size*.36} height={size*.36} viewBox="0 0 16 16" fill="white"><rect x="2" y="2" width="5" height="12" rx="1.5"/><rect x="9" y="2" width="5" height="12" rx="1.5"/></svg>
        :<svg width={size*.36} height={size*.36} viewBox="0 0 16 16" fill="white" style={{marginLeft:2}}><polygon points="3,1 15,8 3,15"/></svg>}
    </button>
  );
}

function SB({light=true}){
  return(
    <div style={{width:"100%",display:"flex",justifyContent:"space-between",padding:"14px 24px 0",fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,color:light?"rgba(120,60,0,.5)":"rgba(200,170,255,.4)",flexShrink:0,zIndex:10}}>
    </div>
  );
}

function SecHead({title,color="#C47010"}){
  return <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:800,letterSpacing:3,textTransform:"uppercase",color,marginBottom:10}}>{title}</div>;
}

function BNav({active,onNav,dark=false}){
  const bg=dark?"rgba(12,6,24,.94)":"rgba(255,249,238,.93)";
  const bdr=dark?"rgba(120,80,200,.2)":"rgba(232,160,32,.18)";
  const aBg=dark?"linear-gradient(135deg,#7C3AED,#4F46E5)":"linear-gradient(135deg,#E8A020,#C47010)";
  const aSh=dark?"0 4px 14px rgba(124,58,237,.45)":"0 4px 14px rgba(200,120,16,.4)";
  const aC=dark?"#A78BFA":"#C47010";
  const iC=dark?"rgba(160,140,210,.28)":"#D4B896";
  return(
    <nav style={{position:"absolute",bottom:0,left:0,right:0,display:"flex",justifyContent:"space-around",alignItems:"center",padding:"10px 0 22px",background:bg,backdropFilter:"blur(24px)",borderTop:`1px solid ${bdr}`,zIndex:30}}>
      {NAV.map(n=>{const on=n.id===active;return(
        <div key={n.id} onClick={()=>onNav(n.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"4px 6px"}}>
          <div style={{width:40,height:40,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,background:on?aBg:"rgba(180,120,30,.06)",boxShadow:on?aSh:"none",transition:"all .2s"}}>{n.icon}</div>
          <span style={{fontFamily:"'Syne',sans-serif",fontSize:7.5,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",color:on?aC:iC}}>{n.label}</span>
        </div>
      );})}
    </nav>
  );
}

/* ── SPLASH ── */
function Splash({onEnter,onLogin,startMode="splash"}){
  const [mode,setMode]=useState(startMode); // "splash" | "login" | "otp"
  const [phone,setPhone]=useState("");
  const [otp,setOtp]=useState(["","","","","",""]);
  const [err,setErr]=useState("");
  const [verifying,setVerifying]=useState(false);
  const refs=[useRef(),useRef(),useRef(),useRef(),useRef(),useRef()];

  const [confirmResult, setConfirmResult] = useState(null);

  const sendOtp=async()=>{
    if(phone.length!==10){setErr("Valid 10-digit number required");return;}
    setErr("");
    try {
      if(window.recaptchaVerifier) { window.recaptchaVerifier.clear(); window.recaptchaVerifier=null; }
      const old=document.getElementById("recaptcha-container");
      if(old) old.remove();
      const div=document.createElement("div");
      div.id="recaptcha-container";
      document.body.appendChild(div);
      auth.settings.appVerificationDisabledForTesting = false;
      window.recaptchaVerifier=new RecaptchaVerifier(auth,"recaptcha-container",{size:"invisible",callback:()=>{},"expired-callback":()=>{}});
      await window.recaptchaVerifier.render();
      const result=await signInWithPhoneNumber(auth,"+91"+phone,window.recaptchaVerifier);
      setConfirmResult(result);
      setMode("otp");
      setTimeout(()=>refs[0].current&&refs[0].current.focus(),120);
    } catch(e) {
      console.error("OTP Error:",e);
      setErr("Error: "+e.code+" - "+e.message);
      if(window.recaptchaVerifier){window.recaptchaVerifier.clear();window.recaptchaVerifier=null;}
    }
  };
  const handleDigit=(val,i)=>{
    const d=val.replace(/\D/g,"").slice(-1);
    const n=[...otp];n[i]=d;setOtp(n);setErr("");
    if(d&&i<5)setTimeout(()=>refs[i+1].current&&refs[i+1].current.focus(),30);
  };
  const handleKey=(e,i)=>{
    if(e.key==="Backspace"&&!otp[i]&&i>0){
      refs[i-1].current&&refs[i-1].current.focus();
      const n=[...otp];n[i-1]="";setOtp(n);
    }
  };
  const verify=async()=>{
    if(otp.join("").length!==6){setErr("Enter 6-digit OTP");return;}
    if(!confirmResult){setErr("Please request OTP first");return;}
    setVerifying(true);
    try {
      await confirmResult.confirm(otp.join(""));
      setVerifying(false);
      onLogin(phone);
    } catch(e) {
      setVerifying(false);
      setErr("Invalid OTP. Please try again.");
    }
  };

  return(
    <div style={{width:"100%",height:"100%",background:"linear-gradient(175deg,#1E0C00 0%,#2C1400 45%,#1A0A00 100%)",display:"flex",flexDirection:"column",alignItems:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-40,left:"50%",width:300,height:300,background:"radial-gradient(circle,rgba(255,120,0,.18) 0%,transparent 68%)",borderRadius:"50%",animation:"glowBreath 5s ease-in-out infinite alternate",transform:"translateX(-50%)",pointerEvents:"none",zIndex:0}}/>
      <SB light={false}/>

      {/* Sun + OM */}
      <div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:mode==="splash"?28:16,zIndex:5,animation:"fadeDown 1s .2s cubic-bezier(.16,1,.3,1) both",transition:"padding .3s"}}>
        <div style={{position:"relative",width:mode==="splash"?150:100,height:mode==="splash"?150:100,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .4s"}}>
          <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",animation:"spinRay 30s linear infinite",opacity:.5}} viewBox="0 0 130 130" fill="none">
            <g stroke="rgba(255,180,60,.6)" strokeWidth="1" strokeLinecap="round">
              <line x1="65" y1="4" x2="65" y2="20"/><line x1="65" y1="110" x2="65" y2="126"/>
              <line x1="4" y1="65" x2="20" y2="65"/><line x1="110" y1="65" x2="126" y2="65"/>
              <line x1="23" y1="23" x2="34" y2="34"/><line x1="96" y1="96" x2="107" y2="107"/>
              <line x1="107" y1="23" x2="96" y2="34"/><line x1="34" y1="96" x2="23" y2="107"/>
              {[["44","7","47","21"],["86","7","83","21"],["7","44","21","47"],["7","86","21","83"],["123","44","109","47"],["123","86","109","83"],["44","123","47","109"],["86","123","83","109"]].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity=".45"/>)}
            </g>
          </svg>
          <div style={{width:mode==="splash"?84:58,height:mode==="splash"?84:58,borderRadius:"50%",background:"radial-gradient(circle at 38% 36%,#FFE566,#FF9200 52%,#D94E00)",animation:"sunPulse 4s ease-in-out infinite alternate",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1,transition:"all .4s"}}>
            <span style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:mode==="splash"?36:24,fontWeight:500,color:"rgba(60,18,0,.7)",lineHeight:1,marginTop:mode==="splash"?5:3,transition:"font-size .4s"}}>ॐ</span>
          </div>
        </div>
      </div>

      {/* Diya — only on splash */}
      {mode==="splash"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",zIndex:5,width:"100%"}}>
          <svg style={{position:"absolute",width:220,height:220,opacity:.06,animation:"spinSlow 90s linear infinite"}} viewBox="0 0 220 220" fill="none">
            <circle cx="110" cy="110" r="108" stroke="#FFB830" strokeWidth=".6" strokeDasharray="4 7"/>
            <circle cx="110" cy="110" r="86" stroke="#FFB830" strokeWidth=".5" strokeDasharray="2 8"/>
            <circle cx="110" cy="110" r="62" stroke="#FFB830" strokeWidth=".6" strokeDasharray="3 5"/>
            <circle cx="110" cy="110" r="38" stroke="#FFB830" strokeWidth=".5"/>
            <circle cx="110" cy="110" r="14" stroke="#FFB830" strokeWidth=".7"/>
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(d=><ellipse key={d} cx="110" cy="70" rx="5" ry="16" transform={`rotate(${d} 110 110)`} stroke="#FFB830" strokeWidth=".5"/>)}
          </svg>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",animation:"fadeUp .9s .5s cubic-bezier(.16,1,.3,1) both"}}>
            <svg width="110" height="96" viewBox="0 0 110 96" fill="none">
              <defs>
                <radialGradient id="fo"><stop offset="0%" stopColor="#FF9800"/><stop offset="55%" stopColor="#FF5722"/><stop offset="100%" stopColor="#BF360C" stopOpacity="0"/></radialGradient>
                <radialGradient id="fi"><stop offset="0%" stopColor="#FFFDE7"/><stop offset="100%" stopColor="#FFD54F" stopOpacity=".2"/></radialGradient>
                <linearGradient id="db" x1="55" y1="48" x2="55" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#C47010"/><stop offset="55%" stopColor="#9A4E08"/><stop offset="100%" stopColor="#6B3200"/></linearGradient>
                <linearGradient id="hg" x1="78" y1="68" x2="92" y2="54" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#C47010"/><stop offset="100%" stopColor="#8B4500"/></linearGradient>
              </defs>
              <g style={{transformOrigin:"50% 100%",animation:"flicker 1.5s ease-in-out infinite alternate"}}>
                <ellipse cx="55" cy="26" rx="8" ry="16" fill="url(#fo)"/>
                <ellipse cx="55" cy="28" rx="4.5" ry="9" fill="url(#fi)"/>
                <ellipse cx="55" cy="31" rx="2" ry="4" fill="#FFFDE7"/>
              </g>
              <line x1="55" y1="48" x2="55" y2="42" stroke="rgba(255,180,60,.55)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M24 58 Q26 50 55 50 Q84 50 86 58 L81 74 Q79 80 55 80 Q31 80 29 74 Z" fill="url(#db)"/>
              <ellipse cx="46" cy="64" rx="8" ry="3" fill="rgba(255,220,100,.18)"/>
              <path d="M26 58 Q28 51 55 51 Q82 51 84 58" stroke="rgba(255,210,100,.35)" strokeWidth="1" fill="none"/>
              <path d="M80 70 Q92 66 90 56 Q88 48 80 52" stroke="url(#hg)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{width:90,height:18,background:"radial-gradient(ellipse,rgba(255,150,30,.45) 0%,transparent 70%)",borderRadius:"50%",marginTop:-6,animation:"flamePulse 1.4s ease-in-out infinite alternate"}}/>
          </div>
        </div>
      )}

      {/* Bottom panel — changes between splash / login / otp */}
      <div style={{...(mode==="splash"?{flexShrink:0}:{flex:1,justifyContent:"center"}),width:"100%",display:"flex",flexDirection:"column",alignItems:"center",padding:mode==="splash"?"22px 28px 34px":"16px 24px 44px",background:"linear-gradient(180deg,transparent 0%,rgba(14,6,0,.82) 22%,#100700 44%)",zIndex:10,animation:"fadeUp .9s .9s cubic-bezier(.16,1,.3,1) both"}}>

        {/* NITYA wordmark — always shown */}
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:11,fontWeight:300,letterSpacing:5,textTransform:"uppercase",color:"rgba(255,190,80,.4)",marginBottom:4}}>A Daily Sadhana Companion</span>
        <span style={{fontFamily:"'Syne',sans-serif",fontSize:mode==="splash"?54:40,fontWeight:800,letterSpacing:-1,lineHeight:1,background:"linear-gradient(155deg,#FFE8A0 0%,#FFAB00 55%,#E05000 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",marginBottom:mode==="splash"?10:6,transition:"font-size .3s"}}>NITYA</span>
        <div style={{width:36,height:1,background:"linear-gradient(90deg,transparent,rgba(255,180,60,.5),transparent)",marginBottom:mode==="splash"?10:12}}/>

        {/* SPLASH MODE */}
        {mode==="splash"&&(<>
          <p style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:17,fontWeight:400,color:"rgba(255,220,140,.75)",textAlign:"center",lineHeight:1.7,marginBottom:22}}>
            <strong style={{fontWeight:600,color:"rgba(255,235,170,.95)"}}>हर दिन श्लोक,</strong><br/>हर दिन शांति।
          </p>
          <button onClick={onEnter} style={{width:"100%",background:"linear-gradient(135deg,#E07800,#B85000)",border:"none",borderRadius:22,padding:"16px 20px",cursor:"pointer",position:"relative",overflow:"hidden",boxShadow:"0 8px 28px rgba(180,80,0,.5)",marginBottom:10}}>
            <div style={{position:"absolute",top:0,left:"-80%",width:"50%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)",animation:"ctaShimmer 3s ease-in-out infinite"}}/>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
              <span style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:15,fontWeight:600,color:"#FFF5E0"}}>आज की साधना शुरू करें</span>
              <div style={{width:1,height:16,background:"rgba(255,220,120,.3)"}}/>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,230,160,.5)"}}>Begin</span>
            </div>
          </button>
          <button onClick={()=>setMode("login")} style={{width:"100%",background:"transparent",border:"1px solid rgba(255,200,80,.22)",borderRadius:22,padding:"13px 20px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"rgba(255,200,80,.6)"}}>
            🔐 Sign In to Save Progress
          </button>
        </>)}

        {/* LOGIN MODE */}
        {mode==="login"&&(<>
          <div style={{width:"100%",marginBottom:14}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,200,80,.55)",marginBottom:8}}>Mobile Number</div>
            <div style={{display:"flex",alignItems:"center",background:"rgba(255,255,255,.07)",borderRadius:16,border:`1px solid ${err?"rgba(255,100,80,.4)":"rgba(255,200,80,.2)"}`,overflow:"hidden"}}>
              <div style={{padding:"0 14px",borderRight:"1px solid rgba(255,200,80,.15)",height:52,display:"flex",alignItems:"center"}}>
                <span style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:"rgba(255,200,80,.7)"}}>+91</span>
              </div>
              <input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} onKeyDown={e=>e.key==="Enter"&&sendOtp()} placeholder="9876543210" type="tel" maxLength={10}
                style={{flex:1,background:"transparent",border:"none",outline:"none",padding:"14px",fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,color:"white",letterSpacing:2}}/>
            </div>
            {err&&<div style={{fontFamily:"'Syne',sans-serif",fontSize:10,color:"#FF8080",marginTop:5,letterSpacing:.5}}>{err}</div>}
          </div>
          <button onClick={sendOtp} style={{width:"100%",background:"linear-gradient(135deg,#E07800,#B85000)",border:"none",borderRadius:18,padding:"14px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",color:"white",boxShadow:"0 6px 24px rgba(180,80,0,.45)",marginBottom:10,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:"-80%",width:"50%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)",animation:"ctaShimmer 3s ease-in-out infinite"}}/>
            Send OTP →
          </button>
          <button onClick={()=>setMode("splash")} style={{width:"100%",background:"transparent",border:"none",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:10,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:"rgba(255,200,80,.35)",padding:"6px"}}>← Back</button>
        </>)}

        {/* OTP MODE */}
        {mode==="otp"&&(<>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:10,color:"rgba(255,200,80,.5)",marginBottom:14,letterSpacing:.5,textAlign:"center"}}>OTP sent to +91 {phone}</div>
          <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:14}}>
            {otp.map((d,i)=>(
              <input key={i} ref={refs[i]} value={d} onChange={e=>handleDigit(e.target.value,i)} onKeyDown={e=>handleKey(e,i)} maxLength={1} type="tel"
                style={{width:40,height:50,borderRadius:13,background:"rgba(255,255,255,.08)",border:`1.5px solid ${d?"rgba(255,200,80,.5)":"rgba(255,200,80,.18)"}`,outline:"none",textAlign:"center",fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:"white",transition:"border .2s"}}/>
            ))}
          </div>
          {err&&<div style={{fontFamily:"'Syne',sans-serif",fontSize:10,color:"#FF8080",marginBottom:8,letterSpacing:.5,textAlign:"center"}}>{err}</div>}
          {verifying
            ?<div style={{textAlign:"center",padding:"10px 0",fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,color:"rgba(255,200,80,.5)",letterSpacing:1,textTransform:"uppercase"}}>Verifying...</div>
            :<button onClick={verify} style={{width:"100%",background:"linear-gradient(135deg,#E07800,#B85000)",border:"none",borderRadius:18,padding:"14px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",color:"white",boxShadow:"0 6px 24px rgba(180,80,0,.45)",marginBottom:10}}>
              Verify & Begin ✓
            </button>
          }
          <div style={{display:"flex",gap:16,justifyContent:"center"}}>
            <button onClick={()=>{setMode("login");setOtp(["","","","","",""]);setErr("");}} style={{background:"transparent",border:"none",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:10,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:"rgba(255,200,80,.35)",padding:"6px"}}>← Back</button>
            <button onClick={sendOtp} style={{background:"transparent",border:"none",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:10,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:"rgba(255,200,80,.35)",padding:"6px"}}>Resend OTP</button>
          </div>
        </>)}

      </div>
    </div>
  );
}

/* ── HOME ── */
function Home({onNav,favorites,setFavorites}){
  const [tab,setTab]=useState("hindi");
  const [playing,setPlaying]=useState(false);
  const [mPlaying,setMPlaying]=useState(false);
  const [prog,setProg]=useState(28);
  const [favOpen,setFavOpen]=useState(false);
  const [toast,setToast]=useState("");
  const [sharePopup,setSharePopup]=useState(false);
  const iv=useRef(null);
  const sl=SHLOKAS[0];

  const togglePlay=()=>{setPlaying(p=>{if(!p)iv.current=setInterval(()=>setProg(x=>x>=100?0:x+0.4),200);else clearInterval(iv.current);return!p;});};
  useEffect(()=>()=>clearInterval(iv.current),[]);
  const sec=Math.floor(prog*84/100);
  const ts=`${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`;
  const isFav=favorites.some(f=>f.id===sl.id);
  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(""),2200);};
  const toggleFav=()=>{if(isFav){setFavorites(f=>f.filter(x=>x.id!==sl.id));showToast("Removed from favourites");}else{setFavorites(f=>[...f,sl]);showToast("Added to favourites ❤️");}};

  return(
    <div style={{width:"100%",height:"100%",background:BG,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",bottom:-30,right:-30,fontFamily:"'Noto Sans Devanagari',serif",fontSize:260,color:"rgba(180,120,30,.04)",pointerEvents:"none",zIndex:0,lineHeight:1}}>ॐ</div>

      {/* Toast */}
      {toast&&<div style={{position:"absolute",top:72,left:"50%",transform:"translateX(-50%)",background:"rgba(40,20,0,.93)",color:"#FFD700",fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,letterSpacing:1,padding:"9px 20px",borderRadius:20,zIndex:50,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,.4)",animation:"fadeUp .3s ease"}}>{toast}</div>}

      {/* ── WHATSAPP SHARE POPUP ── */}
      {sharePopup&&(
        <div style={{position:"absolute",inset:0,zIndex:60,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",background:"rgba(0,0,0,.65)",backdropFilter:"blur(6px)"}}
          onClick={e=>{if(e.target===e.currentTarget)setSharePopup(false);}}>
          <div style={{width:"100%",background:"white",borderRadius:"28px 28px 0 0",padding:"0 0 32px",animation:"fadeUp .35s cubic-bezier(.16,1,.3,1) both",boxShadow:"0 -12px 40px rgba(0,0,0,.25)"}}>

            {/* Handle */}
            <div style={{display:"flex",justifyContent:"center",padding:"12px 0 8px"}}>
              <div style={{width:40,height:4,borderRadius:4,background:"rgba(0,0,0,.15)"}}/>
            </div>

            {/* Header */}
            <div style={{padding:"0 20px 16px",borderBottom:"1px solid rgba(0,0,0,.07)"}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,letterSpacing:.5,textTransform:"uppercase",color:"#2D1400",marginBottom:2}}>Share Preview</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:10,fontWeight:500,color:"#C4A882",letterSpacing:.5}}>This is how it will look on WhatsApp Status</div>
            </div>

            {/* ── PREVIEW CARD ── */}
            <div style={{margin:"16px 20px",borderRadius:22,overflow:"hidden",boxShadow:"0 8px 32px rgba(80,30,0,.18)"}}>
              {/* Card top — saffron gradient */}
              <div style={{background:"linear-gradient(135deg,#3D1C00,#5C2E00)",padding:"20px 18px 16px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#FFD700,#FF8C00,#FFD700)"}}/>
                {/* Watermark OM */}
                <div style={{position:"absolute",right:-8,bottom:-12,fontFamily:"'Noto Sans Devanagari',serif",fontSize:80,color:"rgba(255,200,60,.07)",lineHeight:1,pointerEvents:"none"}}>ॐ</div>
                {/* Grantha tag */}
                <div style={{display:"inline-flex",alignItems:"center",gap:4,background:"rgba(255,200,60,.14)",border:"1px solid rgba(255,200,60,.25)",borderRadius:20,padding:"3px 10px",marginBottom:12}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:8,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"rgba(255,210,100,.9)"}}>🪷 {sl.grantha} · {sl.chapter}</span>
                </div>
                {/* Sanskrit */}
                <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:15,fontWeight:600,color:"#FFE4A0",lineHeight:1.85,textAlign:"center",whiteSpace:"pre-line",padding:"12px 8px",background:"rgba(255,255,255,.04)",borderRadius:14,border:"1px solid rgba(255,200,60,.08)",marginBottom:12}}>{sl.sanskrit}</div>
                {/* Hindi meaning */}
                <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:12,fontWeight:700,color:"rgba(255,220,140,.85)",lineHeight:1.7,textAlign:"center"}}>{sl.hindi}</div>
              </div>
              {/* Card bottom — branding */}
              <div style={{background:"#FFF8EC",padding:"10px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:22,height:22,borderRadius:7,background:"linear-gradient(135deg,#FF8C00,#FF4500)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>🪷</div>
                  <div>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:11,fontWeight:700,color:"#6B2A00",letterSpacing:1}}>NITYA</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:7.5,fontWeight:600,letterSpacing:1,color:"#C4A882",textTransform:"uppercase"}}>नित्य · Daily Sadhana</div>
                  </div>
                </div>
                <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:18,color:"rgba(180,100,20,.3)"}}>ॐ</div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{display:"flex",gap:10,padding:"0 20px"}}>
              <button
                onClick={()=>{setSharePopup(false);showToast("Shared to WhatsApp! ✨");}}
                style={{flex:1,background:"linear-gradient(135deg,#25D366,#128C7E)",border:"none",borderRadius:18,padding:"14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 5px 18px rgba(37,211,102,.35)"}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,color:"white",letterSpacing:.5}}>Share to WhatsApp</span>
              </button>
              <button
                onClick={()=>setSharePopup(false)}
                style={{width:50,background:"rgba(0,0,0,.06)",border:"none",borderRadius:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <SB/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 22px 0",zIndex:10,flexShrink:0}}>
        <span style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#4A2800",letterSpacing:".5px",textTransform:"uppercase",lineHeight:1}}>Today's Sadhana</span>
        <div style={{width:34,height:34,borderRadius:12,background:"rgba(180,80,0,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,cursor:"pointer"}}>🔔</div>
      </div>
      <div style={{flex:1,overflowY:"auto",paddingBottom:82,zIndex:5}}>

        {/* SHLOKA CARD */}
        <div style={{margin:"14px 16px 0",background:"linear-gradient(135deg,#3D1C00,#5C2E00)",borderRadius:26,padding:"20px",boxShadow:"0 12px 36px rgba(80,30,0,.28)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#FFD700,#FF8C00,#FFD700)",borderRadius:"26px 26px 0 0"}}/>
          <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(255,200,60,.12)",border:"1px solid rgba(255,200,60,.22)",borderRadius:20,padding:"4px 11px",marginBottom:14}}>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"rgba(255,210,100,.8)"}}>🪷 {sl.grantha} · {sl.chapter}</span>
          </div>
          <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:17,fontWeight:600,color:"#FFE4A0",lineHeight:1.9,textAlign:"center",whiteSpace:"pre-line",padding:"16px 10px",background:"rgba(255,255,255,.04)",borderRadius:18,border:"1px solid rgba(255,200,60,.08)",marginBottom:14}}>{sl.sanskrit}</div>
          <div style={{display:"flex",alignItems:"center",gap:12,background:"rgba(0,0,0,.2)",borderRadius:18,padding:"11px 14px"}}>
            <PlayBtn playing={playing} onToggle={togglePlay} size={44} c1="#FFD700" c2="#FF8C00"/>
            <div style={{flex:1}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:10,fontWeight:700,color:"rgba(255,220,120,.85)",display:"block",marginBottom:6}}>हिंदी पाठ सुनें · 1:24</span>
              <div style={{height:3,background:"rgba(255,200,60,.15)",borderRadius:10,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${prog}%`,background:"linear-gradient(90deg,#FFD700,#FF9000)",borderRadius:10,transition:"width .2s"}}/>
              </div>
            </div>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:10,color:"rgba(255,200,60,.4)",flexShrink:0}}>{ts}</span>
          </div>
        </div>

        {/* TRANSLATION CARD — redesigned */}
        <div style={{margin:"12px 16px 0",background:"white",borderRadius:24,overflow:"hidden",boxShadow:"0 6px 22px rgba(180,80,0,.09)",border:"1.5px solid rgba(255,165,0,.14)"}}>
          {/* Tab bar */}
          <div style={{display:"flex",borderBottom:"1.5px solid rgba(255,165,0,.1)"}}>
            {[{id:"hindi",label:"हिंदी",sub:"Hindi"},{id:"english",label:"English",sub:"अंग्रेज़ी"}].map(t=>{
              const on=tab===t.id;
              return(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"12px 8px 10px",border:"none",cursor:"pointer",background:on?"white":"rgba(255,240,220,.5)",borderBottom:on?"2.5px solid #C47010":"2.5px solid transparent",transition:"all .2s",position:"relative"}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:on?800:600,color:on?"#C47010":"rgba(160,80,10,.4)",letterSpacing:.3,lineHeight:1}}>{t.label}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:8,fontWeight:500,color:on?"rgba(196,112,16,.6)":"rgba(160,80,10,.25)",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>{t.sub}</div>
                </button>
              );
            })}
          </div>
          {/* Content */}
          <div style={{padding:"16px 18px 18px",position:"relative",minHeight:90}}>
            {/* Language label pill */}
            <div style={{display:"inline-flex",alignItems:"center",gap:5,background:tab==="hindi"?"rgba(196,112,16,.08)":"rgba(80,100,200,.07)",border:`1px solid ${tab==="hindi"?"rgba(196,112,16,.18)":"rgba(80,100,200,.15)"}`,borderRadius:20,padding:"3px 10px",marginBottom:10}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:tab==="hindi"?"#C47010":"#5B7AE0"}}/>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:8,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:tab==="hindi"?"#C47010":"#5B7AE0"}}>{tab==="hindi"?"भावार्थ · Meaning":"Translation"}</span>
            </div>
            {tab==="hindi"
              ?<p style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:15,fontWeight:700,color:"#3E1800",lineHeight:1.9}}>{sl.hindi}</p>
              :<p style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:600,color:"#2D3080",lineHeight:1.85}}>{sl.english}</p>
            }
            {/* Decorative quote mark */}
            <div style={{position:"absolute",right:16,bottom:10,fontFamily:"serif",fontSize:52,color:tab==="hindi"?"rgba(196,112,16,.06)":"rgba(80,100,200,.06)",lineHeight:1,userSelect:"none"}}>"</div>
          </div>
        </div>

        {/* ── SHARE + FAVOURITE ROW (outside cards, below translation) ── */}
        <div style={{margin:"10px 16px 0",display:"flex",gap:8}}>
          {/* WhatsApp */}
          <button onClick={()=>setSharePopup(true)} style={{flex:1,background:"linear-gradient(135deg,#25D366,#128C7E)",border:"none",borderRadius:18,padding:"12px 10px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7,boxShadow:"0 4px 16px rgba(37,211,102,.3)",transition:"transform .15s"}}
            onMouseDown={e=>e.currentTarget.style.transform="scale(.97)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,color:"white",letterSpacing:.3}}>WhatsApp</span>
          </button>
          {/* Instagram */}
          <button onClick={()=>showToast("Shared to Instagram! ✨")} style={{flex:1,background:"linear-gradient(135deg,#833AB4,#FD1D1D,#F77737)",border:"none",borderRadius:18,padding:"12px 10px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7,boxShadow:"0 4px 16px rgba(131,58,180,.3)",transition:"transform .15s"}}
            onMouseDown={e=>e.currentTarget.style.transform="scale(.97)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,color:"white",letterSpacing:.3}}>Instagram</span>
          </button>
          {/* Favourite */}
          <button onClick={toggleFav} style={{width:48,height:48,borderRadius:16,border:"none",cursor:"pointer",background:isFav?"linear-gradient(135deg,#FF6B6B,#FF4444)":"rgba(180,80,0,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,boxShadow:isFav?"0 4px 14px rgba(255,100,100,.4)":"none",flexShrink:0,transition:"all .2s"}}>
            {isFav?"❤️":"🤍"}
          </button>
        </div>

        {/* ── EVENING PRAYER — TODAY'S AARTI ── */}
        {(()=>{
          const pr=PRAYERS[new Date().getDay()]||PRAYERS[2];
          return(
            <div style={{margin:"12px 16px 0",borderRadius:26,padding:"20px",position:"relative",overflow:"hidden",boxShadow:`0 14px 42px ${pr.color}28`,background:pr.g}}>
              {/* animated top strip */}
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${pr.color},rgba(255,255,255,.75),${pr.color})`,backgroundSize:"200% 100%",animation:"gradShift 3.5s linear infinite",borderRadius:"26px 26px 0 0"}}/>
              {/* OM watermark */}
              <div style={{position:"absolute",right:-10,bottom:-18,fontFamily:"'Noto Sans Devanagari',serif",fontSize:110,color:"rgba(255,255,255,.06)",lineHeight:1,pointerEvents:"none"}}>ॐ</div>

              {/* Header row */}
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(255,255,255,.15)",border:"2px solid rgba(255,255,255,.28)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0,boxShadow:`0 0 20px ${pr.color}55`,animation:"floatUp 4s ease-in-out infinite"}}>{pr.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,.5)",marginBottom:2}}>🌙 Evening Prayer · 6:00 – 7:30 PM</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,color:"white",textTransform:"uppercase",letterSpacing:.5,lineHeight:1.1}}>{pr.deity}</div>
                  <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:14,fontWeight:600,color:"rgba(255,255,255,.8)",marginTop:2}}>{pr.hi}</div>
                </div>
              </div>

              {/* Time window pill */}
              <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
                <div style={{background:"rgba(0,0,0,.22)",backdropFilter:"blur(8px)",borderRadius:20,padding:"6px 12px",display:"flex",alignItems:"center",gap:5,border:"1px solid rgba(255,255,255,.12)"}}>
                  <span style={{fontSize:12}}>⏰</span>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"rgba(255,255,255,.7)"}}>6:00 – 7:30 PM</span>
                </div>
                <div style={{background:"rgba(0,0,0,.22)",backdropFilter:"blur(8px)",borderRadius:20,padding:"6px 12px",display:"flex",alignItems:"center",gap:5,border:"1px solid rgba(255,255,255,.12)"}}>
                  <span style={{fontSize:12}}>📿</span>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"rgba(255,255,255,.7)"}}>{pr.sub}</span>
                </div>
              </div>

              {/* Aarti name box */}
              <div style={{background:"rgba(255,255,255,.1)",backdropFilter:"blur(10px)",borderRadius:18,padding:"14px 16px",border:"1px solid rgba(255,255,255,.15)",marginBottom:14,textAlign:"center"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:8,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,.5)",marginBottom:6}}>Today's Aarti</div>
                <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:18,fontWeight:700,color:"white",lineHeight:1.6}}>{pr.name}</div>
              </div>

              {/* CTA button */}
              <button
                onClick={()=>onNav("prarthana")}
                style={{width:"100%",background:"rgba(255,255,255,.18)",backdropFilter:"blur(12px)",border:"1.5px solid rgba(255,255,255,.35)",borderRadius:18,padding:"13px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s"}}
                onMouseDown={e=>e.currentTarget.style.transform="scale(.97)"}
                onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
                <span style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:800,color:"white",letterSpacing:.5}}>Open Today's Aarti</span>
                <span style={{fontSize:14,color:"rgba(255,255,255,.8)"}}>→</span>
              </button>
            </div>
          );
        })()}

        {/* FAVOURITES */}
        <div style={{margin:"12px 16px 0",background:"white",borderRadius:22,overflow:"hidden",boxShadow:"0 4px 18px rgba(180,80,0,.07)",border:"1.5px solid rgba(255,165,0,.1)"}}>
          <button onClick={()=>setFavOpen(o=>!o)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:16}}>❤️</span>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"#4A2800"}}>Favourites{favorites.length>0?` (${favorites.length})`:""}</span>
            </div>
            <span style={{fontSize:13,color:"#C47010",display:"inline-block",transform:favOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s"}}>▼</span>
          </button>
          {favOpen&&(
            <div style={{borderTop:"1px solid rgba(255,165,0,.1)"}}>
              {favorites.length===0
                ?<div style={{padding:"16px",textAlign:"center",fontFamily:"'Noto Sans Devanagari',serif",fontSize:13,color:"#C4A882"}}>कोई पसंदीदा नहीं। ❤️ से जोड़ें।</div>
                :favorites.map((f,i)=>(
                  <div key={f.id} style={{padding:"12px 16px",borderTop:i>0?"1px solid rgba(255,165,0,.08)":"none"}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"#C47010",marginBottom:4}}>{f.grantha} · {f.chapter}</div>
                    <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:13,fontWeight:600,color:"#3E1800",lineHeight:1.7,whiteSpace:"pre-line"}}>{f.sanskrit}</div>
                    <button onClick={()=>{setFavorites(fv=>fv.filter(x=>x.id!==f.id));showToast("Removed ✓");}} style={{marginTop:6,background:"rgba(255,100,100,.08)",border:"1px solid rgba(255,100,100,.18)",borderRadius:10,padding:"3px 10px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:8,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"#EF4444"}}>Remove</button>
                  </div>
                ))
              }
            </div>
          )}
        </div>
        <div style={{height:16}}/>
      </div>
      <BNav active="home" onNav={onNav}/>
    </div>
  );
}

/* ── PRARTHANA (full day-switchable version) ── */
const FULL_DAYS=[
  {id:0,short:"Sun",full:"Sunday",deity:"Surya Dev",icon:"☀️",name:"सूर्य देव आरती",sub:"आदित्य उपासना · रविवार",
   color:"#F97316",bg:"linear-gradient(170deg,#FFF4EB 0%,#FFE8CC 55%,#FFD4A0 100%)",
   heroBg:"linear-gradient(135deg,#7C2D12,#9A3412,#C2410C)",glow:"rgba(249,115,22,.2)",
   verses:[
     {label:"आरती प्रारम्भ",text:"जय कश्यप नंदन, ॐ जय आदित्य देवा।\nकंचन काया किरणमय, तेज प्रभु देवा॥",c:"#F97316"},
     {label:"पद २",text:"सप्त अश्व रथ राजित, अरुण सारथी स्वामी।\nत्रिभुवन प्रकाशक तुम, जीवन के दानी॥",c:"#FB923C"},
     {label:"पद ३",text:"उदयाचल पर उदित हो, जग को सुखदाता।\nअस्ताचल जब जाओ, शांति बरसाता॥",c:"#FBBF24"},
     {label:"पद ४",text:"प्रातःकाल जो ध्यावे, रोग दोष मिट जावे।\nमनवांछित फल पाकर, जीवन सफल बनावे॥",c:"#F59E0B"},
     {label:"पद ५",text:"अर्घ्य चढ़े जल निर्मल, भक्त भाव से लाते।\nतेरी कृपा से प्रभु, दुख सब दूर हो जाते॥",c:"#EF4444"},
     {label:"पद ६",text:"धर्म अर्थ के दाता, आरोग्य प्रदाता।\nअज्ञान तिमिर हरते, जीवन उजियाता॥",c:"#F97316"},
     {label:"पद ७",text:"ऋषि मुनि देव जन सब, महिमा तेरी गावें।\nभक्ति भाव से जो ध्यावे, शुभ फल वह पावे॥",c:"#FB923C"},
     {label:"आरती समापन",text:"जय कश्यप नंदन, ॐ जय आदित्य देवा।\nकंचन काया किरणमय, तेज प्रभु देवा॥",c:"#F97316"},
   ]},
  {id:1,short:"Mon",full:"Monday",deity:"Lord Shiva",icon:"🔱",name:"शिव जी की आरती",sub:"शिव उपासना · सोमवार",
   color:"#60A5FA",bg:"linear-gradient(170deg,#EFF6FF 0%,#DBEAFE 55%,#BFDBFE 100%)",
   heroBg:"linear-gradient(135deg,#1E3A5F,#1E40AF,#1D4ED8)",glow:"rgba(96,165,250,.2)",
   image:"/shiva.png",imageBg:"linear-gradient(170deg,#EDF5FF 0%,#D6EAFF 50%,#C2DEFF 100%)",
   tathastuMsg:"हे भक्त, तुम्हारी प्रार्थना शिव तक पहुँची।\nभोलेनाथ का आशीर्वाद सदा तुम्हारे साथ है।",
   tathastuSender:"— महादेव शिव",
   tathastuBg:"linear-gradient(170deg,#EDF5FF 0%,#C8DFFF 55%,#A8CBFF 100%)",
   verses:[
     {label:"आरती प्रारम्भ",text:"ॐ जय शिव ओंकारा, प्रभु जय शिव ओंकारा।\nब्रह्मा विष्णु सदाशिव, अर्धांगी धारा॥",c:"#60A5FA"},
     {label:"पद २",text:"एकानन चतुरानन पंचानन राजे।\nहंसासन गरुड़ासन वृषवाहन साजे॥",c:"#818CF8"},
     {label:"पद ३",text:"दो भुज चार चतुर्भुज दस भुज अति सोहे।\nतीनों रूप निरखते त्रिभुवन मन मोहे॥",c:"#A78BFA"},
     {label:"पद ४",text:"अक्षमाला वनमाला मुण्डमाला धारी।\nचन्दन मृगमद सोहै भाले शशिधारी॥",c:"#60A5FA"},
     {label:"पद ५",text:"श्वेताम्बर पीताम्बर बाघम्बर अंगे।\nसनकादिक ब्रह्मादिक भूतादिक संगे॥",c:"#38BDF8"},
     {label:"पद ६",text:"कर में श्रेष्ठ कमंडल चक्र त्रिशूल धारी।\nजगकर्ता जगहर्ता जग पालनकारी॥",c:"#818CF8"},
     {label:"पद ७",text:"ब्रह्मा विष्णु सदाशिव जानत अविवेका।\nप्रणवाक्षर के मध्ये ये तीनों एका॥",c:"#60A5FA"},
     {label:"आरती समापन",text:"त्रिगुणस्वामी जी की आरती जो कोई नर गावे।\nकहत शिवानन्द स्वामी सुख संपत्ति पावे॥",c:"#A78BFA"},
   ]},
  {id:2,short:"Tue",full:"Tuesday",deity:"Lord Hanuman",icon:"🪔",name:"हनुमान जी की आरती",sub:"हनुमान उपासना · मंगलवार",
   color:"#EF4444",bg:"linear-gradient(170deg,#FFF5F5 0%,#FFE4E4 55%,#FECACA 100%)",
   heroBg:"linear-gradient(135deg,#7F1D1D,#991B1B,#B91C1C)",glow:"rgba(239,68,68,.2)",
   verses:[
     {label:"आरती प्रारम्भ",text:"आरती कीजै हनुमान लला की।\nदुष्ट दलन रघुनाथ कला की॥",c:"#EF4444"},
     {label:"पद २",text:"जाके बल से गिरिवर कांपे।\nरोग दोष जाके निकट न झांके॥",c:"#F97316"},
     {label:"पद ३",text:"अंजनि पुत्र महाबलदायी।\nसंतन के प्रभु सदा सहाई॥",c:"#EF4444"},
     {label:"पद ४",text:"दे बीरा रघुनाथ पठाए।\nलंका जारि सिया सुधि लाए॥",c:"#DC2626"},
     {label:"पद ५",text:"लंका सो कोट समुद्र सी खाई।\nजात पवनसुत बार न लाई॥",c:"#F97316"},
     {label:"पद ६",text:"लंका जारि असुर संहारे।\nसियारामजी के काज संवारे॥",c:"#EF4444"},
     {label:"पद ७",text:"लक्ष्मण मूर्छित पड़े सकारे।\nआनि संजीवन प्राण उबारे॥",c:"#DC2626"},
     {label:"पद ८",text:"पैठि पाताल तोरि जमकारे।\nअहिरावण की भुजा उखारे॥",c:"#F97316"},
     {label:"पद ९",text:"बाएं भुजा असुर दल मारे।\nदाहिने भुजा संतजन तारे॥",c:"#EF4444"},
     {label:"पद १०",text:"सुर नर मुनि जन आरती उतारें।\nजय जय जय हनुमान उचारें॥",c:"#DC2626"},
     {label:"पद ११",text:"कंचन थार कपूर लौ छाई।\nआरती करत अंजना माई॥",c:"#F97316"},
     {label:"पद १२",text:"जो हनुमानजी की आरती गावै।\nबसि बैकुंठ परम पद पावै॥",c:"#EF4444"},
     {label:"आरती समापन",text:"आरती कीजै हनुमान लला की।\nदुष्ट दलन रघुनाथ कला की॥",c:"#DC2626"},
   ]},
  {id:3,short:"Wed",full:"Wednesday",deity:"Lord Ganesha",icon:"🌺",name:"श्री गणेश आरती",sub:"गणेश उपासना · बुधवार",
   color:"#F59E0B",bg:"linear-gradient(170deg,#FFFBEB 0%,#FEF3C7 55%,#FDE68A 100%)",
   heroBg:"linear-gradient(135deg,#78350F,#92400E,#B45309)",glow:"rgba(245,158,11,.2)",
   verses:[
     {label:"आरती प्रारम्भ",text:"जय गणेश जय गणेश जय गणेश देवा।\nमाता जाकी पार्वती पिता महादेवा॥",c:"#F59E0B"},
     {label:"पद २",text:"एकदंत दयावंत चार भुजाधारी।\nमाथे सिंदूर सोहे मूसे की सवारी॥",c:"#FBBF24"},
     {label:"पद ३",text:"अंधन को आंख देत कोढ़िन को काया।\nबांझन को पुत्र देत निर्धन को माया॥",c:"#F59E0B"},
     {label:"पद ४",text:"हार चढ़े फूल चढ़े और चढ़े मेवा।\nलड्डुअन का भोग लगे संत करें सेवा॥",c:"#D97706"},
     {label:"पद ५",text:"दीनन की लाज राखो शंभु सुतवारी।\nकामना को पूर्ण करो जग बलिहारी॥",c:"#FBBF24"},
     {label:"आरती समापन",text:"जय गणेश जय गणेश जय गणेश देवा।\nमाता जाकी पार्वती पिता महादेवा॥",c:"#F59E0B"},
   ]},
  {id:4,short:"Thu",full:"Thursday",deity:"Shyam Baba",icon:"🙏",name:"श्री श्याम बाबा आरती",sub:"श्याम उपासना · गुरुवार",
   color:"#8B5CF6",bg:"linear-gradient(170deg,#F5F3FF 0%,#EDE9FE 55%,#DDD6FE 100%)",
   heroBg:"linear-gradient(135deg,#2E1065,#3B0764,#4C1D95)",glow:"rgba(139,92,246,.2)",
   verses:[
     {label:"आरती प्रारम्भ",text:"ॐ जय श्री श्याम हरे, बाबा जय श्री श्याम हरे।\nखाटू धाम विराजत, भक्तों के संकट टरे॥",c:"#8B5CF6"},
     {label:"पद २",text:"रत्न सिंहासन राजत, मोर मुकुट सिर धारे।\nमोरछड़ी की शोभा, मन भक्तों के हरे॥",c:"#A78BFA"},
     {label:"पद ३",text:"तन मन धन सब अर्पण, चरणों में तेरे स्वामी।\nदीनों के तुम दाता, अंतर्यामी स्वामी॥",c:"#8B5CF6"},
     {label:"पद ४",text:"हारे के सहारे तुम, जग में नाम तुम्हारा।\nजो शरण तुम्हारी आए, पार करो भव धारा॥",c:"#7C3AED"},
     {label:"पद ५",text:"शीश के दानी बाबा, महिमा अपरंपारा।\nतेरी कृपा से चमके, जीवन यह हमारा॥",c:"#A78BFA"},
     {label:"पद ६",text:"जो कोई प्रेम से गावे, आरती श्याम तुम्हारी।\nकृपा बरसे उस पर, मिटे विपदा सारी॥",c:"#8B5CF6"},
     {label:"आरती समापन",text:"ॐ जय श्री श्याम हरे, बाबा जय श्री श्याम हरे।\nखाटू धाम विराजत, भक्तों के संकट टरे॥",c:"#7C3AED"},
   ]},
  {id:5,short:"Fri",full:"Friday",deity:"Goddess Lakshmi",icon:"🌸",name:"श्री लक्ष्मी जी की आरती",sub:"लक्ष्मी उपासना · शुक्रवार",
   color:"#EC4899",bg:"linear-gradient(170deg,#FDF2F8 0%,#FCE7F3 55%,#FBCFE8 100%)",
   heroBg:"linear-gradient(135deg,#831843,#9D174D,#BE185D)",glow:"rgba(236,72,153,.2)",
   verses:[
     {label:"आरती प्रारम्भ",text:"ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता।\nतुमको निसदिन सेवत, हरि विष्णु विधाता॥",c:"#EC4899"},
     {label:"पद २",text:"उमा रमा ब्रह्माणी, तुम ही जग माता।\nसूर्य चन्द्रमा ध्यावत, नारद ऋषि गाता॥",c:"#F472B6"},
     {label:"पद ३",text:"दुर्गा रूप निरंजनि, सुख संपत्ति दाता।\nजो कोई तुमको ध्यावत, ऋद्धि सिद्धि धन पाता॥",c:"#EC4899"},
     {label:"पद ४",text:"तुम पाताल निवासिनि, तुम ही शुभदाता।\nकर्म प्रभाव प्रकाशिनि, भव निधि की त्राता॥",c:"#DB2777"},
     {label:"पद ५",text:"जिस घर तुम रहती, सब सद्गुण आता।\nसब संभव हो जाता, मन नहीं घबराता॥",c:"#F472B6"},
     {label:"पद ६",text:"तुम बिन यज्ञ न होते, वस्त्र न कोई पाता।\nखान पान का वैभव, सब तुमसे आता॥",c:"#EC4899"},
     {label:"पद ७",text:"शुभ गुण मंदिर सुंदर, क्षीरोदधि जाता।\nरत्न चतुर्दश तुम बिन, कोई नहीं पाता॥",c:"#DB2777"},
     {label:"पद ८",text:"महालक्ष्मीजी की आरती, जो कोई नर गाता।\nउर आनंद समाता, पाप उतर जाता॥",c:"#F472B6"},
     {label:"आरती समापन",text:"ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता।\nतुमको निसदिन सेवत, हरि विष्णु विधाता॥",c:"#EC4899"},
   ]},
  {id:6,short:"Sat",full:"Saturday",deity:"Shani Dev",icon:"⚫",name:"श्री शनि देव आरती",sub:"शनि उपासना · शनिवार",
   color:"#64748B",bg:"linear-gradient(170deg,#F8FAFC 0%,#F1F5F9 55%,#E2E8F0 100%)",
   heroBg:"linear-gradient(135deg,#0F172A,#1E293B,#334155)",glow:"rgba(100,116,139,.18)",
   verses:[
     {label:"आरती प्रारम्भ",text:"जय जय श्री शनिदेव भक्तन हितकारी।\nसूरज के पुत्र प्रभु छाया महतारी॥",c:"#64748B"},
     {label:"पद २",text:"श्याम अंग वक्र दृष्टि चतुर्भुजा धारी।\nनीलाम्बर धार नाथ गज की असवारी॥",c:"#94A3B8"},
     {label:"पद ३",text:"क्रीट मुकुट शीश राजित दिपत है लिलारी।\nमुक्तन की माला गले शोभित बलिहारी॥",c:"#64748B"},
     {label:"पद ४",text:"मोदक मिष्ठान पान चढ़त हैं सुपारी।\nलोहा तिल तेल उड़द महिषी अति प्यारी॥",c:"#475569"},
     {label:"पद ५",text:"देव दनुज ऋषि मुनि सुमिरत नर नारी।\nविश्वनाथ धरत ध्यान शरण हैं तुम्हारी॥",c:"#94A3B8"},
     {label:"आरती समापन",text:"जय जय श्री शनिदेव भक्तन हितकारी।\nसूरज के पुत्र प्रभु छाया महतारी॥",c:"#64748B"},
   ]},
];

function Prarthana({onNav,tasksDone={shlok:false,aarti:false},setTasksDone,setKarma,setBhaktDays}){
  const todayIdx=new Date().getDay();
  const [sel,setSel]=useState(todayIdx);
  const [tathastu,setTathastu]=useState(false);
  const [toast,setToast]=useState("");
  const day=FULL_DAYS[sel];
  const pick=(i)=>{if(i===todayIdx)setSel(i);};
  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(""),2800);};

  const completeAarti=()=>{
    if(tasksDone.aarti) return;
    if(setTasksDone) setTasksDone({...tasksDone,aarti:true});
    if(setKarma) setKarma(k=>k+30);
    if(setBhaktDays) setBhaktDays(d=>d+1);
    setTathastu(true);
  };

  return(
    <div style={{width:"100%",height:"100%",background:day.bg,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden",transition:"background .5s ease"}}>
      <div style={{position:"absolute",top:-80,left:"50%",transform:"translateX(-50%)",width:320,height:320,background:`radial-gradient(circle,${day.glow} 0%,transparent 65%)`,borderRadius:"50%",pointerEvents:"none",zIndex:0,animation:"breathe 6s ease-in-out infinite",transition:"background .5s ease"}}/>
      <div style={{position:"absolute",bottom:-10,right:-10,fontFamily:"'Noto Sans Devanagari',serif",fontSize:220,color:`${day.color}07`,pointerEvents:"none",zIndex:0,lineHeight:1}}>ॐ</div>
      <div style={{padding:"8px 22px 0",zIndex:10,flexShrink:0}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:`${day.color}77`,marginBottom:2}}>🙏 Daily Prayer</div>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"#1A0800",letterSpacing:.5,textTransform:"uppercase",lineHeight:1}}>Prarthana</div>
      </div>
      {/* Day tabs */}
      <div style={{padding:"12px 16px 0",zIndex:10,flexShrink:0}}>
        <div style={{display:"flex",gap:4,background:"rgba(255,255,255,.55)",borderRadius:22,padding:"5px",backdropFilter:"blur(16px)",border:`1px solid ${day.color}25`,boxShadow:`0 4px 18px ${day.color}14`}}>
          {FULL_DAYS.map((d,i)=>{const on=i===sel;const isToday=i===todayIdx;return(
            <button key={i} onClick={()=>pick(i)} style={{flex:1,padding:"8px 0 7px",borderRadius:16,border:"none",cursor:i===todayIdx?"pointer":"default",display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"all .25s cubic-bezier(.16,1,.3,1)",background:on?`linear-gradient(140deg,${d.color},${d.color}CC)`:"transparent",boxShadow:on?`0 4px 16px ${d.color}44`:"none",position:"relative",opacity:i===todayIdx?1:0.3,pointerEvents:i===todayIdx?"auto":"none"}}>
              {isToday&&!on&&<div style={{position:"absolute",top:4,left:"50%",transform:"translateX(6px)",width:5,height:5,borderRadius:"50%",background:d.color,boxShadow:`0 0 5px ${d.color}88`}}/>}
              <span style={{fontSize:on?16:13,lineHeight:1,transition:"font-size .2s"}}>{d.icon}</span>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:7.5,fontWeight:on?800:600,letterSpacing:.5,textTransform:"uppercase",lineHeight:1,color:on?"white":`${d.color}88`}}>{d.short}</span>
            </button>
          );})}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",paddingBottom:82,zIndex:5}}>
        {/* Hero card */}
        <div key={`hero-${sel}`} style={{margin:"12px 16px 0",borderRadius:28,padding:"22px 20px",position:"relative",overflow:"hidden",boxShadow:`0 18px 52px ${day.color}35`,background:day.heroBg,animation:"fadeUp .4s ease both"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${day.color},rgba(255,255,255,.75),${day.color})`,backgroundSize:"200% 100%",animation:"gradShift 3s linear infinite",borderRadius:"28px 28px 0 0"}}/>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontFamily:"'Noto Sans Devanagari',serif",fontSize:130,color:"rgba(255,255,255,.07)",lineHeight:1,pointerEvents:"none",userSelect:"none",width:"100%",textAlign:"center"}}>ॐ</div>
          <div style={{textAlign:"center",marginBottom:14,position:"relative",zIndex:2}}>
            <div style={{display:"inline-flex",width:76,height:76,borderRadius:"50%",background:"rgba(255,255,255,.15)",border:"2px solid rgba(255,255,255,.3)",alignItems:"center",justifyContent:"center",fontSize:38,boxShadow:`0 0 36px ${day.color}55`,animation:"floatUp 4s ease-in-out infinite"}}>{day.icon}</div>
          </div>
          <div style={{textAlign:"center",position:"relative",zIndex:2}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,.45)",marginBottom:5}}>{day.sub}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:"white",textTransform:"uppercase",lineHeight:1.1,marginBottom:5}}>{day.deity}</div>
            <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:17,fontWeight:700,color:"rgba(255,255,255,.9)"}}>{day.name}</div>
          </div>
        </div>
        {/* Section label */}
        <div style={{padding:"16px 22px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:800,letterSpacing:3,textTransform:"uppercase",color:`${day.color}99`}}>🙏 आरती के पद</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:10,fontWeight:600,color:`${day.color}66`}}>{day.verses.length} पद</div>
        </div>
        {/* Verse cards */}
        <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:10}}>
          {day.verses.map((v,i)=>{const isFirst=v.label==="आरती प्रारम्भ";const isLast=v.label==="आरती समापन";return(
            <div key={`${sel}-${i}`} style={{borderRadius:22,padding:"15px 17px 15px 21px",background:`${v.c}0D`,border:`1.5px solid ${v.c}2E`,position:"relative",overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,.05)",animation:`fadeUp .35s ${i*.04+.05}s ease both`}}>
              <div style={{position:"absolute",left:0,top:0,bottom:0,width:4,background:`linear-gradient(180deg,${v.c},${v.c}55)`,borderRadius:"22px 0 0 22px"}}/>
              <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <div style={{width:36,height:36,borderRadius:12,flexShrink:0,background:`${v.c}15`,border:`1px solid ${v.c}30`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {isFirst||isLast?<span style={{fontSize:14}}>{isFirst?"🔔":"🙏"}</span>:<span style={{fontFamily:"'Cinzel',serif",fontSize:11,fontWeight:700,color:v.c}}>{i}</span>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:`${v.c}88`,marginBottom:8}}>{v.label}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,color:"#1A0800",lineHeight:2}}>
                    {v.text.split("\n").map((line,li,arr)=>(
                      <span key={li}>
                        {line}
                        {li<arr.length-1&&<><br/><div style={{height:1,background:`linear-gradient(90deg,transparent,${v.c}40,transparent)`,margin:"2px 0"}}/></>}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{width:8,height:8,borderRadius:"50%",background:v.c,flexShrink:0,marginTop:6,boxShadow:`0 0 8px ${v.c}99`}}/>
              </div>
            </div>
          );})}
        </div>
        {/* Complete Aarti Button */}
        <div style={{padding:"16px 16px 0"}}>
          {tasksDone.aarti
            ?<div style={{borderRadius:22,padding:"16px 20px",background:"rgba(96,165,250,.08)",border:"1.5px solid rgba(96,165,250,.22)",display:"flex",alignItems:"center",justifyContent:"center",gap:10,cursor:"pointer"}} onClick={()=>setTathastu(true)}>
              <span style={{fontSize:20}}>✅</span>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:800,color:"#60A5FA",letterSpacing:.5}}>आरती सम्पन्न · Aarti Complete</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:600,color:"rgba(96,165,250,.6)",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>Tap to see blessing again</div>
              </div>
            </div>
            :<button onClick={completeAarti} style={{width:"100%",background:`linear-gradient(135deg,${day.color},${day.color}BB)`,border:"none",borderRadius:22,padding:"18px 20px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:12,boxShadow:`0 8px 28px ${day.color}44`,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:"-80%",width:"50%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent)",animation:"shimmer 2.5s ease-in-out infinite"}}/>
              <span style={{fontSize:22}}>🙏</span>
              <div style={{textAlign:"left"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,color:"white",letterSpacing:.5}}>आरती पूर्ण हुई</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:600,color:"rgba(255,255,255,.7)",letterSpacing:1.5,textTransform:"uppercase",marginTop:2}}>Tap to complete · +30 Karma</div>
              </div>
            </button>
          }
        </div>
        <div style={{height:24}}/>
      </div>

      {/* ── TATHASTU FULLSCREEN OVERLAY ── */}
      {tathastu&&(
        <div style={{position:"absolute",inset:0,zIndex:50,display:"flex",flexDirection:"column",overflowY:"auto"}}
          onClick={e=>{if(e.target===e.currentTarget)setTathastu(false);}}>
          {/* Background matches image — soft watercolor blue/white */}
          <div style={{flex:1,background:day.tathastuBg||"linear-gradient(170deg,#EDF5FF,#C8DFFF,#A8CBFF)",display:"flex",flexDirection:"column",alignItems:"center",position:"relative",overflow:"hidden"}}>

            {/* Soft light top glow */}
            <div style={{position:"absolute",top:-60,left:"50%",transform:"translateX(-50%)",width:300,height:300,background:"radial-gradient(circle,rgba(96,165,250,.18) 0%,transparent 68%)",borderRadius:"50%",pointerEvents:"none",animation:"breathe 6s ease-in-out infinite"}}/>

            {/* Floating close */}
            <button onClick={()=>setTathastu(false)} style={{position:"absolute",top:16,right:16,width:36,height:36,borderRadius:"50%",background:"rgba(0,0,0,.08)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"rgba(0,0,0,.4)",zIndex:10}}>✕</button>

            <div style={{width:"100%",padding:"48px 20px 32px",display:"flex",flexDirection:"column",alignItems:"center",gap:0}}>

              {/* Floating trishul */}
              <div style={{fontSize:52,animation:"floatUp 3s ease-in-out infinite",marginBottom:6,filter:"drop-shadow(0 4px 16px rgba(96,165,250,.5))"}}>🔱</div>

              {/* TATHASTU */}
              <div style={{fontFamily:"'Cinzel',serif",fontSize:46,fontWeight:700,color:"#1E3A5F",letterSpacing:4,lineHeight:1,marginBottom:4,textShadow:"0 2px 20px rgba(96,165,250,.2)",animation:"fadeUp .5s ease both"}}>तथास्तु</div>

              {/* So it shall be */}
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:17,fontWeight:400,color:"rgba(30,58,95,.55)",letterSpacing:3,marginBottom:28}}>So it shall be</div>

              {/* Divider */}
              <div style={{width:80,height:1,background:"linear-gradient(90deg,transparent,rgba(96,165,250,.35),transparent)",marginBottom:28}}/>

              {/* Shiva image — watercolor, matches bg */}
              {day.image&&(
                <div style={{width:260,height:260,borderRadius:"50%",overflow:"hidden",marginBottom:24,boxShadow:"0 8px 40px rgba(96,165,250,.25)",border:"3px solid rgba(255,255,255,.6)",flexShrink:0,animation:"fadeUp .6s .1s ease both"}}>
                  <img src={day.image} alt={day.deity} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/>
                </div>
              )}

              {/* Message box */}
              <div style={{width:"100%",background:"rgba(255,255,255,.65)",backdropFilter:"blur(20px)",borderRadius:24,padding:"20px 20px",border:"1.5px solid rgba(96,165,250,.2)",boxShadow:"0 4px 24px rgba(96,165,250,.12)",animation:"fadeUp .6s .2s ease both"}}>
                {/* Quote marks */}
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:48,color:"rgba(96,165,250,.2)",lineHeight:.8,marginBottom:4}}>"</div>
                <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:16,fontWeight:600,color:"#1E3A5F",lineHeight:1.9,whiteSpace:"pre-line",marginBottom:12}}>
                  {day.tathastuMsg||"तुम्हारी प्रार्थना स्वीकार हुई।\nदेव का आशीर्वाद तुम्हारे साथ है।"}
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:11,fontWeight:600,color:"rgba(30,58,95,.45)",letterSpacing:1}}>{day.tathastuSender||`— ${day.deity}`}</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(96,165,250,.1)",border:"1px solid rgba(96,165,250,.2)",borderRadius:20,padding:"4px 12px"}}>
                    <span style={{fontSize:12}}>✨</span>
                    <span style={{fontFamily:"'Syne',sans-serif",fontSize:10,fontWeight:700,color:"#1E40AF",letterSpacing:.5}}>+30 Karma</span>
                  </div>
                </div>
              </div>

              {/* Jay Shiva */}
              <div style={{marginTop:20,fontFamily:"'Noto Sans Devanagari',serif",fontSize:18,fontWeight:700,color:"rgba(30,58,95,.5)",letterSpacing:2,animation:"fadeUp .6s .3s ease both"}}>
                🔱 जय {day.deity} 🔱
              </div>

              {/* Close button */}
              <button onClick={()=>setTathastu(false)} style={{marginTop:20,background:"rgba(30,58,95,.08)",border:"1.5px solid rgba(30,58,95,.15)",borderRadius:18,padding:"12px 32px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"rgba(30,58,95,.6)"}}>
                वापस जाएं · Close
              </button>

              <div style={{height:32}}/>
            </div>
          </div>
        </div>
      )}

      <BNav active="prarthana" onNav={onNav} dark={false}/>
    </div>
  );
}

/* ── SADHANA ── */
function Sadhana({onNav,karma,setKarma,user,onGoLogin,tapasyaDays=0,setTapasyaDays,shlokaCount=0,setShlokaCount,bhaktDays=0,setBhaktDays,tasksDone={shlok:false,aarti:false},setTasksDone}){
  const today=new Date().getDay();
  const todayPrayer=PRAYERS[today]||PRAYERS[2];

  const TASK_DEFS=[
    {id:"shlok",icon:"🌅",bg:"#FFF3E0",title:"Morning Shlok",sub:"Bhagavad Gita · Ch.2 V.47",detail:"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",xp:50},
    {id:"aarti",icon:"🪔",bg:"#FFF0E8",title:"Today's Aarti",sub:`${todayPrayer.deity} · ${todayPrayer.hi}`,detail:todayPrayer.name,xp:30,accentColor:todayPrayer.color},
  ];
  const tasks=TASK_DEFS.map(t=>({...t,done:!!tasksDone[t.id]}));

  const days=[{l:"Mon"},{l:"Tue"},{l:"Wed"},{l:"Thu"},{l:"Fri"},{l:"Sat"},{l:"Sun"}].map((d,i)=>{
    if(i<tapasyaDays) return {...d,s:"done"};
    if(i===tapasyaDays) return {...d,s:"today"};
    return {...d,s:"up"};
  });
  const earned=tasks.filter(t=>t.done).reduce((a,t)=>a+t.xp,0);
  const [toast,setToast]=useState("");
  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(""),2800);};

  const toggleTask=(id)=>{
    const nowDone=!tasksDone[id];
    const nextDone={...tasksDone,[id]:nowDone};
    setTasksDone(nextDone);
    const taskXp=TASK_DEFS.find(t=>t.id===id)?.xp||0;
    setKarma(k=>nowDone ? k+taskXp : k-taskXp);
    if(id==="shlok"&&nowDone&&setShlokaCount) setShlokaCount(c=>c+1);
    const allDone=TASK_DEFS.every(t=>nextDone[t.id]);
    const wasDone=TASK_DEFS.every(t=>tasksDone[t.id]);
    if(allDone&&!wasDone){
      if(setTapasyaDays) setTapasyaDays(d=>d+1);
      if(setBhaktDays) setBhaktDays(d=>d+1);
    }
    if(nowDone&&!user) showToast("🔐 Sign in to save your progress!");
  };

  return(
    <div style={{width:"100%",height:"100%",background:BG,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",bottom:-30,right:-30,fontFamily:"'Noto Sans Devanagari',serif",fontSize:260,color:"rgba(180,120,30,.045)",pointerEvents:"none",zIndex:0,lineHeight:1}}>ॐ</div>
      {toast&&<div style={{position:"absolute",top:72,left:"50%",transform:"translateX(-50%)",background:"rgba(40,20,0,.93)",color:"#FFD700",fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,letterSpacing:1,padding:"9px 20px",borderRadius:20,zIndex:50,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,.4)",animation:"fadeUp .3s ease"}}>{toast}</div>}
      <SB/>

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 22px 0",zIndex:10,flexShrink:0}}>
        <span style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#4A2800",letterSpacing:".5px",textTransform:"uppercase",lineHeight:1}}>My Sadhana</span>
        {(()=>{const sl=LEVELS.find(l=>karma>=l.min&&karma<=l.max)||LEVELS[0];const si=LEVELS.indexOf(sl);return(<div style={{background:`linear-gradient(135deg,${sl.color}DD,${sl.color})`,color:"#FFF8E8",fontFamily:"'Syne',sans-serif",fontSize:10,fontWeight:800,letterSpacing:"1.5px",textTransform:"uppercase",padding:"7px 14px",borderRadius:20,boxShadow:`0 4px 14px ${sl.color}66`}}>Lv.{si+1} · {sl.label}</div>);})()}
      </div>

      <div style={{flex:1,overflowY:"auto",paddingBottom:82,zIndex:5}}>

        {/* ── GUEST SIGN-IN BANNER ── */}
        {!user&&(
          <div style={{margin:"14px 18px 0",borderRadius:22,overflow:"hidden",boxShadow:"0 6px 24px rgba(180,80,0,.15)",border:"1.5px solid rgba(255,165,0,.25)",animation:"fadeUp .4s ease both"}}>
            {/* Top strip */}
            <div style={{height:3,background:"linear-gradient(90deg,#FFD700,#FF8C00,#FFD700)",backgroundSize:"200% 100%",animation:"gradShift 3s linear infinite"}}/>
            <div style={{background:"linear-gradient(135deg,#FFF8EE,#FFF2D6)",padding:"16px 18px"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{width:42,height:42,borderRadius:14,background:"linear-gradient(135deg,#E8A020,#C47010)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,boxShadow:"0 4px 12px rgba(200,120,16,.35)"}}>🔐</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:800,color:"#4A2800",letterSpacing:.5,textTransform:"uppercase",marginBottom:3}}>Save Your Progress</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:10,fontWeight:500,color:"#9B7A40",lineHeight:1.5,fontStyle:"italic"}}>You're browsing as a guest. Sign in to save your Karma Points, Tapasya streak and daily progress.</div>
                </div>
              </div>
              <button
                onClick={onGoLogin}
                style={{width:"100%",marginTop:14,background:"linear-gradient(135deg,#E07800,#B85000)",border:"none",borderRadius:16,padding:"12px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",color:"white",boxShadow:"0 5px 18px rgba(180,80,0,.4)",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:"-80%",width:"50%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)",animation:"shimmer 3s ease-in-out infinite"}}/>
                Sign In to Save Progress →
              </button>
            </div>
          </div>
        )}

        {/* ── SIGNED IN BADGE ── */}
        {user&&(
          <div style={{margin:"14px 18px 0",background:"linear-gradient(135deg,rgba(34,197,94,.1),rgba(34,197,94,.05))",borderRadius:18,padding:"11px 16px",border:"1px solid rgba(34,197,94,.25)",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#22C55E,#16A34A)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0,boxShadow:"0 3px 10px rgba(34,197,94,.35)"}}>✓</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:10,fontWeight:800,color:"#166534",letterSpacing:.5,textTransform:"uppercase"}}>Progress Saving On</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:500,color:"rgba(22,101,52,.65)",marginTop:1,fontStyle:"italic"}}>Signed in as +91 {user.phone}</div>
            </div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"rgba(22,101,52,.5)"}}>🔐 Saved</div>
          </div>
        )}

        {/* ── KARMA CARD — starts at 0 ── */}
        <div style={{margin:"14px 18px 0",background:"linear-gradient(135deg,#3D2000,#5C3200)",borderRadius:26,padding:"20px 22px",position:"relative",overflow:"hidden",boxShadow:"0 12px 36px rgba(93,50,0,.3)"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#FFD700,#FF8C00,#FFD700)",borderRadius:"26px 26px 0 0"}}/>
          <div style={{position:"absolute",right:18,top:"50%",transform:"translateY(-50%)",fontSize:56,opacity:.14}}>🏆</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",color:"rgba(255,210,120,.6)"}}>Total Karma Points</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:46,fontWeight:800,color:"#FFD700",lineHeight:1.05,margin:"5px 0 3px",letterSpacing:-1}}>{earned}</div>
          {(()=>{
            const curLvl=LEVELS.find(l=>earned>=l.min&&earned<=l.max)||LEVELS[0];
            const nxtLvl=LEVELS[LEVELS.indexOf(curLvl)+1];
            const pct=nxtLvl?Math.min(Math.round(((earned-curLvl.min)/(nxtLvl.min-curLvl.min))*100),100):100;
            return(<>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:10,fontStyle:"italic",color:"rgba(255,210,120,.55)"}}>
                {earned===0?"Complete today's sadhana to earn Karma Points":nxtLvl?`${nxtLvl.min-earned} points to ${nxtLvl.label}`:"Maximum level reached 🏆"}
              </div>
              <div style={{height:6,background:"rgba(255,255,255,.08)",borderRadius:10,marginTop:16,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#FFD700,#FF8C00)",borderRadius:10,transition:"width .5s ease"}}/>
              </div>
            </>);
          })()}
        </div>

        {/* ── STATS — Tapasya replaces Streak ── */}
        <div style={{display:"flex",gap:10,padding:"12px 18px 0"}}>
          {[
            {ico:"🔥",val:String(tapasyaDays),lbl:"Tapasya"},
            {ico:"📖",val:String(shlokaCount),lbl:"Shlokas Read"},
            {ico:"🎵",val:"0m",lbl:"Mins Heard"},
          ].map(s=>(
            <div key={s.lbl} style={{flex:1,background:"white",borderRadius:20,padding:"14px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:5,boxShadow:"0 4px 16px rgba(93,50,0,.08)",border:"1.5px solid rgba(255,165,0,.12)"}}>
              <div style={{fontSize:18}}>{s.ico}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:"#C47010",lineHeight:1,letterSpacing:-.5}}>{s.val}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:7.5,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"#BCAAA4",textAlign:"center"}}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* ── TAPASYA WEEK ── */}
        <div style={{padding:"14px 18px 0"}}>
          <SecHead title="This Week's Tapasya"/>
          <div style={{display:"flex",gap:4}}>
            {days.map(d=>{
              const c=d.s==="done"
                ?{background:"linear-gradient(135deg,#FFD700,#E8A020)",boxShadow:"0 3px 10px rgba(232,160,32,.4)",color:"white",fontSize:14}
                :d.s==="today"
                ?{background:"linear-gradient(135deg,#FF6B00,#CC4400)",boxShadow:"0 3px 14px rgba(255,100,0,.5)",color:"white",fontSize:14,animation:"todayPulse 2s ease-in-out infinite"}
                :{background:"rgba(93,50,0,.07)",border:"1.5px dashed rgba(180,120,30,.25)",color:"rgba(180,120,30,.3)",fontSize:10};
              return(
                <div key={d.l} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{width:34,height:34,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:700,...c}}>
                    {d.s==="done"?"✓":d.s==="today"?"🔥":"·"}
                  </div>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:8,fontWeight:700,letterSpacing:".5px",textTransform:"uppercase",color:"#C4A882"}}>{d.l}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── TODAY'S SADHANA TASKS ── */}
        <div style={{padding:"14px 18px 0"}}>
          <SecHead title="Today's Sadhana"/>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {tasks.map(t=>{
              const accent=t.accentColor||"#C47010";
              return(
                <div key={t.id} style={{background:"white",borderRadius:22,overflow:"hidden",boxShadow:"0 3px 14px rgba(93,50,0,.08)",border:"1.5px solid rgba(255,165,0,.1)"}}>
                  {/* Main row */}
                  <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
                    <div style={{position:"absolute"}}/>
                    <div style={{width:42,height:42,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,background:t.bg,border:t.id==="aarti"?`1.5px solid ${accent}22`:"none"}}>
                      {t.icon}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:t.done?"#2D1A00":"#5A3A18"}}>{t.title}</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:10,fontStyle:"italic",color:"#B0977A",marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.sub}</div>
                      {/* Aarti day-specific detail */}
                      {t.id==="aarti"&&(
                        <div style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:4,background:`${accent}12`,border:`1px solid ${accent}25`,borderRadius:10,padding:"2px 8px"}}>
                          <span style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:10,fontWeight:600,color:accent}}>{t.detail}</span>
                        </div>
                      )}
                      {t.id!=="aarti"&&(
                        <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:11,color:"rgba(180,100,20,.55)",marginTop:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.detail}</div>
                      )}
                    </div>
                    {/* Manual tick button */}
                    <button
                      onClick={()=>toggleTask(t.id)}
                      style={{
                        width:36,height:36,borderRadius:"50%",flexShrink:0,border:"none",cursor:"pointer",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        background:t.done?"linear-gradient(135deg,#FFD700,#E8A020)":"white",
                        boxShadow:t.done?"0 3px 12px rgba(232,160,32,.45)":"inset 0 0 0 2px rgba(200,140,40,.3)",
                        transition:"all .25s cubic-bezier(.16,1,.3,1)",
                        transform:t.done?"scale(1.08)":"scale(1)",
                      }}>
                      {t.done
                        ?<svg width="16" height="16" viewBox="0 0 16 16" fill="white"><polyline points="2,8 6,12 14,4" strokeWidth="2.5" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        :<div style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(200,140,40,.35)"}}/>
                      }
                    </button>
                  </div>
                  {/* XP bar at bottom */}
                  <div style={{height:3,background:"rgba(255,165,0,.08)"}}>
                    <div style={{height:"100%",width:t.done?"100%":"0%",background:`linear-gradient(90deg,${t.accentColor||"#FFD700"},${t.accentColor||"#FF8C00"})`,transition:"width .5s ease"}}/>
                  </div>
                  {/* XP label */}
                  <div style={{padding:"6px 16px 8px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:t.done?"#E8A020":"rgba(196,160,64,.5)"}}>
                      {t.done?`✓ +${t.xp} XP Earned`:`+${t.xp} XP · Tap ✓ when done`}
                    </span>
                    {t.id==="aarti"&&!t.done&&(
                      <span onClick={()=>onNav("prarthana")} style={{fontFamily:"'Syne',sans-serif",fontSize:8,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:accent,cursor:"pointer",textDecoration:"underline",textDecorationColor:`${accent}44`}}>
                        Open Aarti →
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion message */}
        {tasks.every(t=>t.done)&&(
          <div style={{margin:"14px 18px 0",background:"linear-gradient(135deg,#3D2000,#5C3200)",borderRadius:22,padding:"18px 20px",textAlign:"center",boxShadow:"0 8px 28px rgba(93,50,0,.25)",animation:"fadeUp .5s ease both"}}>
            <div style={{fontSize:28,marginBottom:6}}>🎉</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"#FFD700",marginBottom:4}}>Sadhana Complete!</div>
            <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:13,color:"rgba(255,210,120,.7)"}}>आज की साधना सम्पन्न हुई। +{earned} Karma अर्जित।</div>
          </div>
        )}

        <div style={{height:16}}/>
      </div>
      <BNav active="sadhana" onNav={onNav}/>
    </div>
  );
}

/* ── ANUSHTHAN ── */
function Anushthan({onNav,karma,setKarma,mantaDays=0,setMantaDays,user,mantaDone=false,setMantaDone}){
  const [toast,setToast]=useState("");
  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(""),2800);};
  const daysDone=mantaDays;

  const toggleMantra=()=>{
    if(mantaDone) return; // already done today, no untoggle
    setMantaDone(true);
    if(setMantaDays)setMantaDays(d=>d+1);
    if(setKarma)setKarma(k=>k+20);
    showToast("✅ Day "+(mantaDays+1)+" complete! +20 Karma");
    if(!user) showToast("🔐 Sign in to save your progress!");
  };

  const pct=Math.round((daysDone/108)*100);

  const comingSoon=[
    {n:"21-Day Gita Journey",     h:"गीता ज्ञान साधना",    ico:"🪷",c:"#F97316"},
    {n:"40-Day Hanuman Sadhana",  h:"हनुमान भक्ति · 40 दिन",ico:"🪔",c:"#EF4444"},
    {n:"30-Day Upanishad Path",   h:"उपनिषद् ज्ञान · 30 दिन",ico:"🌿",c:"#22C55E"},
    {n:"108-Day Surya Namaskar",  h:"सूर्य नमस्कार साधना",  ico:"☀️",c:"#F59E0B"},
  ];

  return(
    <div style={{width:"100%",height:"100%",background:BG_DARK,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      {/* BG mandala */}
      {toast&&<div style={{position:"absolute",top:72,left:"50%",transform:"translateX(-50%)",background:"rgba(20,10,40,.95)",color:"#A78BFA",fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,letterSpacing:1,padding:"9px 20px",borderRadius:20,zIndex:50,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,.5)",animation:"fadeUp .3s ease"}}>{toast}</div>}
      <svg style={{position:"absolute",width:280,height:280,top:-50,right:-70,opacity:.04,animation:"spinSlow 120s linear infinite",pointerEvents:"none"}} viewBox="0 0 280 280" fill="none">
        <circle cx="140" cy="140" r="138" stroke="#A78BFA" strokeWidth=".8" strokeDasharray="4 8"/>
        <circle cx="140" cy="140" r="108" stroke="#A78BFA" strokeWidth=".5" strokeDasharray="2 10"/>
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(d=><ellipse key={d} cx="140" cy="80" rx="6" ry="22" transform={`rotate(${d} 140 140)`} stroke="#A78BFA" strokeWidth=".5"/>)}
      </svg>

      <SB light={false}/>

      {/* Header */}
      <div style={{padding:"10px 22px 0",zIndex:10,flexShrink:0}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"rgba(167,139,250,.5)",marginBottom:3}}>🛤️ Spiritual Journey</div>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#F0E6FF",textTransform:"uppercase",letterSpacing:.5}}>Anushthan</div>
      </div>

      <div style={{flex:1,overflowY:"auto",paddingBottom:82,zIndex:5}}>

        {/* ── FEATURED: 108-DAY MANTRA DISCIPLINE ── */}
        <div style={{margin:"14px 16px 0",background:"linear-gradient(135deg,#1A0E30,#261545)",borderRadius:26,padding:"20px",position:"relative",overflow:"hidden",boxShadow:"0 14px 44px rgba(15,8,60,.5)",border:"1px solid rgba(139,92,246,.28)"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#7C3AED,#60A5FA,#A78BFA,#7C3AED)",backgroundSize:"200% 100%",animation:"gradShift 4s linear infinite",borderRadius:"26px 26px 0 0"}}/>
          <div style={{position:"absolute",right:-8,bottom:-18,fontFamily:"'Noto Sans Devanagari',serif",fontSize:120,color:"rgba(167,139,250,.06)",lineHeight:1,pointerEvents:"none"}}>ॐ</div>

          {/* Badge */}
          <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(167,139,250,.15)",border:"1px solid rgba(167,139,250,.3)",borderRadius:20,padding:"4px 11px",marginBottom:12}}>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"rgba(167,139,250,.9)"}}>🔥 Active Journey</span>
          </div>

          {/* Title */}
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:21,fontWeight:800,color:"#E8D5FF",textTransform:"uppercase",lineHeight:1.1,marginBottom:4,letterSpacing:.5}}>108-Day Mantra<br/>Discipline</div>
          <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:13,color:"rgba(200,170,255,.65)",marginBottom:16}}>महामृत्युञ्जय मंत्र · प्रतिदिन एक जाप</div>

          {/* Mantra text */}
          <div style={{background:"rgba(255,255,255,.05)",borderRadius:18,padding:"16px",border:"1px solid rgba(167,139,250,.2)",textAlign:"center",marginBottom:14}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:8,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"rgba(167,139,250,.55)",marginBottom:8}}>Maha Mrityunjaya Mantra</div>
            <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:15,fontWeight:600,color:"#E8D5FF",lineHeight:2}}>
              ॐ त्र्यम्बकं यजामहे<br/>
              सुगन्धिं पुष्टिवर्धनम्।<br/>
              उर्वारुकमिव बन्धनान्<br/>
              मृत्योर्मुक्षीय माऽमृतात्॥
            </div>
          </div>

          {/* Progress */}
          <div style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"rgba(167,139,250,.5)"}}>Progress</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:12,fontWeight:600,color:"#A78BFA"}}>Day {daysDone} of 108</div>
            </div>
            <div style={{height:8,background:"rgba(255,255,255,.07)",borderRadius:10,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#7C3AED,#A78BFA)",borderRadius:10,boxShadow:"0 0 10px rgba(124,58,237,.5)",transition:"width .5s ease"}}/>
            </div>
          </div>

          {/* Stats row */}
          <div style={{display:"flex",gap:8}}>
            {[{ico:"🔥",v:`${daysDone}`,l:"Days Done"},{ico:"✨",v:`${daysDone*20}`,l:"Karma Pts"},{ico:"📅",v:`${108-daysDone}`,l:"Remaining"}].map(s=>(
              <div key={s.l} style={{flex:1,background:"rgba(255,255,255,.06)",borderRadius:14,padding:"10px 6px",textAlign:"center",border:"1px solid rgba(167,139,250,.12)"}}>
                <div style={{fontSize:16,marginBottom:2}}>{s.ico}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,color:"#C4B5FD",lineHeight:1}}>{s.v}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:7.5,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"rgba(196,181,253,.35)",marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MANUAL TICK CARD ── */}
        <div style={{margin:"12px 16px 0",background:"white",borderRadius:22,overflow:"hidden",boxShadow:"0 4px 18px rgba(124,58,237,.12)",border:"1.5px solid rgba(124,58,237,.15)"}}>
          {/* Main row */}
          <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,background:"rgba(124,58,237,.08)"}}>🔱</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:mantaDone?"#2D1A00":"#3D2060"}}>Today's Mantra Japa</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:10,fontStyle:"italic",color:"#9B8AC0",marginTop:2}}>Maha Mrityunjaya · 1 Japa</div>
              <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:11,color:"rgba(124,58,237,.55)",marginTop:3}}>ॐ त्र्यम्बकं यजामहे...</div>
            </div>
            {/* Manual tick */}
            <button onClick={toggleMantra} style={{width:38,height:38,borderRadius:"50%",flexShrink:0,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",background:mantaDone?"linear-gradient(135deg,#7C3AED,#4F46E5)":"white",boxShadow:mantaDone?"0 3px 14px rgba(124,58,237,.5)":"inset 0 0 0 2px rgba(124,58,237,.25)",transition:"all .25s cubic-bezier(.16,1,.3,1)",transform:mantaDone?"scale(1.08)":"scale(1)"}}>
              {mantaDone
                ?<svg width="16" height="16" viewBox="0 0 16 16"><polyline points="2,8 6,12 14,4" strokeWidth="2.5" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                :<div style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(124,58,237,.3)"}}/>}
            </button>
          </div>
          {/* XP bar */}
          <div style={{height:3,background:"rgba(124,58,237,.08)"}}>
            <div style={{height:"100%",width:mantaDone?"100%":"0%",background:"linear-gradient(90deg,#7C3AED,#A78BFA)",transition:"width .5s ease"}}/>
          </div>
          {/* XP label */}
          <div style={{padding:"6px 16px 10px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:mantaDone?"#7C3AED":"rgba(124,58,237,.35)"}}>
              {mantaDone?"✓ +20 Karma Earned":"Tap ✓ when you complete the japa"}
            </span>
            {mantaDone&&<span style={{fontSize:14}}>🙏</span>}
          </div>
        </div>

        {/* How to chant */}
        <div style={{margin:"10px 16px 0",background:"rgba(255,255,255,.04)",borderRadius:20,padding:"14px 16px",border:"1px solid rgba(167,139,250,.12)"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:800,letterSpacing:2,textTransform:"uppercase",color:"rgba(167,139,250,.6)",marginBottom:8}}>⚡ How to Chant</div>
          <p style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:13,fontWeight:500,color:"rgba(220,200,255,.75)",lineHeight:1.8}}>शांत मन से बैठें, आँखें बंद करें। एक बार पूरे भाव से महामृत्युञ्जय मंत्र का जाप करें। मंत्र पूर्ण होने पर ✓ दबाएं।</p>
        </div>

        {/* ── COMING SOON JOURNEYS ── */}
        <div style={{padding:"16px 16px 0"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:800,letterSpacing:3,textTransform:"uppercase",color:"rgba(167,139,250,.45)",marginBottom:10}}>More Journeys — Coming Soon</div>
          {comingSoon.map(j=>(
            <div key={j.n} style={{background:"rgba(255,255,255,.025)",borderRadius:20,padding:"13px 15px",display:"flex",alignItems:"center",gap:12,border:"1px solid rgba(255,255,255,.05)",marginBottom:8,opacity:.5}}>
              <div style={{width:44,height:44,borderRadius:14,background:`${j.c}14`,border:`1px solid ${j.c}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{j.ico}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:800,letterSpacing:.5,textTransform:"uppercase",color:"rgba(240,230,255,.4)"}}>{j.n}</div>
                <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:11,color:"rgba(180,160,220,.3)",marginTop:2}}>{j.h}</div>
              </div>
              <div style={{background:"rgba(255,255,255,.07)",borderRadius:12,padding:"5px 10px"}}>
                <span style={{fontFamily:"'Syne',sans-serif",fontSize:8,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"rgba(200,180,255,.3)"}}>Soon</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{height:16}}/>
      </div>
      <BNav active="anushthan" onNav={onNav} dark={true}/>
    </div>
  );
}

/* ── NAME SCREEN ── */
function NameScreen({onDone}){
  const [name,setName]=useState("");
  const [err,setErr]=useState("");
  return(
    <div style={{width:"100%",height:"100%",background:"linear-gradient(175deg,#1E0C00 0%,#2C1400 45%,#1A0A00 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",padding:"0 28px"}}>
      <div style={{position:"absolute",top:-40,left:"50%",width:300,height:300,background:"radial-gradient(circle,rgba(255,120,0,.18) 0%,transparent 68%)",borderRadius:"50%",animation:"glowBreath 5s ease-in-out infinite alternate",transform:"translateX(-50%)",pointerEvents:"none"}}/>
      <div style={{width:"100%",animation:"fadeUp .6s ease both"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:52,marginBottom:12}}>🙏</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,190,80,.4)",marginBottom:8}}>Welcome to Nitya</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:26,fontWeight:700,color:"#FFF0D0",marginBottom:6}}>What's your name?</div>
          <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:13,color:"rgba(255,200,100,.5)"}}>आपका नाम क्या है?</div>
        </div>
        <input
          value={name}
          onChange={e=>{setName(e.target.value);setErr("");}}
          onKeyDown={e=>e.key==="Enter"&&name.trim()&&onDone(name.trim())}
          placeholder="Enter your name"
          style={{width:"100%",background:"rgba(255,255,255,.08)",border:`1.5px solid ${err?"rgba(255,100,80,.4)":"rgba(255,165,0,.2)"}`,borderRadius:16,padding:"16px",fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,color:"white",outline:"none",marginBottom:10,textAlign:"center",letterSpacing:1}}
        />
        {err&&<div style={{fontFamily:"'Syne',sans-serif",fontSize:11,color:"#FCA5A5",textAlign:"center",marginBottom:10}}>{err}</div>}
        <button
          onClick={()=>{if(!name.trim()){setErr("Please enter your name");return;}onDone(name.trim());}}
          style={{width:"100%",background:"linear-gradient(135deg,#E07800,#B85000)",border:"none",borderRadius:18,padding:"16px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",color:"white",boxShadow:"0 6px 24px rgba(180,80,0,.45)",position:"relative",overflow:"hidden"}}
        >
          <div style={{position:"absolute",top:0,left:"-80%",width:"50%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)",animation:"shimmer 3s ease-in-out infinite"}}/>
          Begin My Journey →
        </button>
      </div>
    </div>
  );
}

/* ── PROFILE ── */
function Profile({onNav,karma,tapasyaDays=0,shlokaCount=0,mantaDays=0,nightPrayerDays=0,bhaktDays=0,userName="",setUserName,onSignOut}){
  const [name,setName]=useState(userName||"Seeker");
  useEffect(()=>{if(userName)setName(userName);},[userName]);
  const [editName,setEditName]=useState(false);
  const [notif,setNotif]=useState(true);

  /* Level derived from karma */
  const lvl=LEVELS.find(l=>karma>=l.min&&karma<=l.max)||LEVELS[0];
  const nextLvl=LEVELS[LEVELS.indexOf(lvl)+1];
  const pct=nextLvl?Math.min(Math.round(((karma-lvl.min)/(nextLvl.min-lvl.min))*100),100):100;

  /* ── BADGE GROUPS ── */
  // 1. Tapasya series — 1,7,14,21,28 days
  const tapasyaSeries=[1,7,14,21,28].map(d=>({
    ico:"🔥",n:`Tapasya-${d}`,
    desc:`${d} day${d>1?"s":""} streak`,
    e:tapasyaDays>=d,
    color:"#F97316",glow:"rgba(249,115,22,.35)",
  }));

  // 2. Om Chanter — single badge, 108 mantra days
  const omChanter=[{
    ico:"🕉",n:"Om Chanter",
    desc:"108-day Maha Mrityunjaya",
    e:mantaDays>=108,
    color:"#A78BFA",glow:"rgba(167,139,250,.35)",
  }];

  // 3. Maharishi — single badge, 10000 karma
  const maharishiBadge=[{
    ico:"👑",n:"Maharishi",
    desc:"10,000 Karma Points",
    e:karma>=10000,
    color:"#DC2626",glow:"rgba(220,38,38,.35)",
  }];

  // 4. Night Yogi — single badge, evening prayer 7 days
  const nightYogi=[{
    ico:"🌙",n:"Night Yogi",
    desc:"Evening prayer 7 days",
    e:nightPrayerDays>=7,
    color:"#2563EB",glow:"rgba(37,99,235,.35)",
  }];

  // 5. Tapasvi series — 1–12 months regular completion
  const tapasviSeries=Array.from({length:12},(_,i)=>i+1).map(m=>({
    ico:"✨",n:`Tapasvi-${m}`,
    desc:`${m} month${m>1?"s":""} regular`,
    e:bhaktDays>=(m*30),
    color:"#7C3AED",glow:"rgba(124,58,237,.35)",
  }));

  // 6. Gyani series — 1,50,100,150…500 shlokas
  const gyaniThresholds=[1,...Array.from({length:10},(_,i)=>(i+1)*50)];
  const gyaniSeries=gyaniThresholds.map(s=>({
    ico:"📖",n:s===1?"Gyani-1":`Gyani-${s}`,
    desc:`${s} shloka${s>1?"s":""} read`,
    e:shlokaCount>=s,
    color:"#059669",glow:"rgba(5,150,105,.35)",
  }));

  // 7. Bhakt — single badge, 60 day regular completion
  const bhaktBadge=[{
    ico:"🙏",n:"Bhakt",
    desc:"60 days regular",
    e:bhaktDays>=60,
    color:"#DB2777",glow:"rgba(219,39,119,.35)",
  }];

  const BADGE_GROUPS=[
    {title:"🔥 Tapasya",sub:"Daily streak milestones",badges:tapasyaSeries},
    {title:"🕉 Om Chanter",sub:"108-day mantra journey",badges:omChanter},
    {title:"👑 Maharishi",sub:"10,000 karma points",badges:maharishiBadge},
    {title:"🌙 Night Yogi",sub:"Evening prayer discipline",badges:nightYogi},
    {title:"✨ Tapasvi",sub:"Monthly commitment",badges:tapasviSeries},
    {title:"📖 Gyani",sub:"Shloka reading milestones",badges:gyaniSeries},
    {title:"🙏 Bhakt",sub:"60 days of devotion",badges:bhaktBadge},
  ];

  return(
    <div style={{width:"100%",height:"100%",background:BG,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",bottom:-30,right:-30,fontFamily:"'Noto Sans Devanagari',serif",fontSize:260,color:"rgba(180,120,30,.04)",pointerEvents:"none",zIndex:0,lineHeight:1}}>ॐ</div>

      <SB/>

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 22px 0",zIndex:10,flexShrink:0}}>
        <span style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#4A2800",letterSpacing:".5px",textTransform:"uppercase",lineHeight:1}}>My Journey</span>
        <div style={{width:34,height:34,borderRadius:12,background:"rgba(180,80,0,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,cursor:"pointer"}}>⚙️</div>
      </div>

      <div style={{flex:1,overflowY:"auto",paddingBottom:82,zIndex:5}}>

        {/* ── IDENTITY CARD ── */}
        <div style={{margin:"14px 16px 0",background:"linear-gradient(135deg,#3D1C00,#5C2E00)",borderRadius:26,padding:"18px 20px",display:"flex",alignItems:"center",gap:16,boxShadow:"0 10px 32px rgba(80,30,0,.25)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",fontSize:56,opacity:.08}}>🕉</div>
          <div style={{width:62,height:62,borderRadius:"50%",background:"linear-gradient(135deg,#FF9800,#E65100)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,border:"3px solid rgba(255,255,255,.2)",flexShrink:0,boxShadow:"0 4px 14px rgba(255,100,0,.3)"}}>🧘</div>
          <div style={{flex:1,minWidth:0}}>
            {editName
              ?<input value={name} onChange={e=>setName(e.target.value)} onBlur={()=>{setEditName(false);if(setUserName)setUserName(name);}} autoFocus
                  style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"white",background:"transparent",border:"none",borderBottom:"1px solid rgba(255,200,80,.4)",outline:"none",width:"100%"}}/>
              :<div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"white",cursor:"pointer",display:"flex",alignItems:"center",gap:6}} onClick={()=>setEditName(true)}>
                {name}<span style={{fontSize:13,opacity:.55}}>✏️</span>
              </div>
            }
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,200,80,.6)",marginTop:3}}>
              {lvl.label} · Lv.{LEVELS.indexOf(lvl)+1}
            </div>
            <div style={{display:"inline-flex",alignItems:"center",gap:4,background:"linear-gradient(135deg,#FFD700,#E8A020)",color:"#5D3200",fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:800,padding:"4px 10px",borderRadius:12,marginTop:6}}>
              ✨ {karma} Karma Points
            </div>
          </div>
        </div>

        {/* ── SADHANA LEVEL CARD ── */}
        <div style={{margin:"12px 16px 0",borderRadius:24,padding:"20px",position:"relative",overflow:"hidden",background:lvl.color,boxShadow:`0 10px 32px ${lvl.color}55`}}>
          {/* Subtle pattern overlay */}
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.18)",borderRadius:24}}/>
          <div style={{position:"absolute",right:-10,bottom:-16,fontFamily:"'Noto Sans Devanagari',serif",fontSize:110,color:"rgba(255,255,255,.1)",lineHeight:1,pointerEvents:"none"}}>ॐ</div>

          <div style={{position:"relative",zIndex:2}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,.65)",marginBottom:6}}>Current Level · {LEVELS.indexOf(lvl)+1} / {LEVELS.length}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:32,fontWeight:800,color:"white",lineHeight:1,letterSpacing:-1}}>{lvl.label}</div>
              </div>
              <div style={{width:68,height:68,borderRadius:"50%",background:"rgba(255,255,255,.2)",border:"2px solid rgba(255,255,255,.35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,flexShrink:0,boxShadow:"0 4px 20px rgba(0,0,0,.2)"}}>
                {LEVELS.indexOf(lvl)<10?"🌱":LEVELS.indexOf(lvl)<25?"🧘":LEVELS.indexOf(lvl)<50?"🔥":LEVELS.indexOf(lvl)<80?"🕉":"👑"}
              </div>
            </div>

            {/* XP display */}
            <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:10}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,color:"white",lineHeight:1}}>{karma}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,color:"rgba(255,255,255,.7)",letterSpacing:1,textTransform:"uppercase"}}>Karma Points</div>
            </div>

            {/* Progress bar */}
            {nextLvl&&(
              <>
                <div style={{height:6,background:"rgba(255,255,255,.2)",borderRadius:10,overflow:"hidden",marginBottom:8}}>
                  <div style={{height:"100%",width:`${pct}%`,background:"white",borderRadius:10,transition:"width .6s ease",boxShadow:"0 0 8px rgba(255,255,255,.6)"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,color:"rgba(255,255,255,.65)",letterSpacing:.5}}>
                    {nextLvl.min-karma} pts to {nextLvl.label}
                  </div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,color:"rgba(255,255,255,.65)",letterSpacing:.5}}>
                    {pct}%
                  </div>
                </div>
              </>
            )}
            {!nextLvl&&(
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:800,color:"white",letterSpacing:1,textAlign:"center",marginTop:4}}>
                🏆 Maximum Level Achieved
              </div>
            )}
          </div>
        </div>

        {/* ── LEVELS ── */}
        <div style={{padding:"14px 0 0"}}>
          <div style={{padding:"0 16px 10px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <SecHead title="Levels"/>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:800,color:"#C4A882",letterSpacing:.5}}>
              {LEVELS.indexOf(lvl)+1} / {LEVELS.length} Unlocked
            </div>
          </div>
          <div style={{
            display:"flex",gap:10,
            overflowX:"auto",
            padding:"2px 16px 8px",
            scrollbarWidth:"none",
            WebkitOverflowScrolling:"touch",
          }}>
            {LEVELS.map((l,i)=>{
              const unlocked=karma>=l.min;
              const isCurrent=l===lvl;
              const emoji=i<10?"🌱":i<25?"🧘":i<50?"🔥":i<80?"🕉":"👑";
              return(
                <div key={i} style={{
                  flexShrink:0,
                  width:72,
                  borderRadius:18,
                  padding:"12px 6px",
                  display:"flex",
                  flexDirection:"column",
                  alignItems:"center",
                  gap:5,
                  background:isCurrent?l.color:unlocked?"white":"white",
                  border:isCurrent?`2px solid ${l.color}`:`1.5px solid ${unlocked?l.color+"40":"rgba(200,160,80,.08)"}`,
                  opacity:unlocked?1:.3,
                  position:"relative",
                  overflow:"hidden",
                  boxShadow:isCurrent?`0 6px 20px ${l.color}44`:unlocked?`0 3px 12px ${l.color}18`:"0 2px 8px rgba(180,80,0,.04)",
                  transition:"all .2s",
                }}>
                  {/* top bar */}
                  {unlocked&&<div style={{position:"absolute",top:0,left:0,right:0,height:2.5,background:`linear-gradient(90deg,${l.color},${l.color}88)`}}/>}
                  {/* current pulse ring */}
                  {isCurrent&&<div style={{position:"absolute",inset:0,borderRadius:18,border:`2px solid ${l.color}`,animation:"pulse 2s ease-in-out infinite",pointerEvents:"none"}}/>}
                  <div style={{fontSize:18}}>{unlocked?emoji:"🔒"}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:7.5,fontWeight:800,letterSpacing:.4,textTransform:"uppercase",textAlign:"center",color:isCurrent?"white":unlocked?l.color:"#C4B8A8",lineHeight:1.25}}>{l.label}</div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:9,fontWeight:700,color:isCurrent?"rgba(255,255,255,.8)":unlocked?l.color+"99":"rgba(180,140,80,.35)",letterSpacing:.5}}>Lv.{i+1}</div>
                  {isCurrent&&<div style={{fontFamily:"'Syne',sans-serif",fontSize:6.5,fontWeight:700,letterSpacing:.5,textTransform:"uppercase",color:"rgba(255,255,255,.85)",background:"rgba(255,255,255,.2)",borderRadius:8,padding:"2px 6px",marginTop:1}}>Current</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── BADGE GROUPS ── */}
        <div style={{padding:"14px 0 0"}}>
          <div style={{padding:"0 16px 10px"}}>
            <SecHead title="Badges & Achievements"/>
          </div>
          {BADGE_GROUPS.map((grp,gi)=>{
            const earned=grp.badges.filter(b=>b.e).length;
            const total=grp.badges.length;
            const accentColor=grp.badges[0]?.color||"#C47010";
            return(
              <div key={gi} style={{marginBottom:18}}>
                {/* Group header */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",marginBottom:8}}>
                  <div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:800,letterSpacing:.5,color:"#4A2800"}}>{grp.title}</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:8.5,fontWeight:500,color:"#C4A882",fontStyle:"italic",marginTop:1}}>{grp.sub}</div>
                  </div>
                  <div style={{
                    background:earned>0?`${accentColor}18`:"rgba(200,180,150,.1)",
                    border:`1px solid ${earned>0?accentColor+"30":"rgba(200,180,150,.2)"}`,
                    borderRadius:12,padding:"3px 10px",
                    fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:800,
                    color:earned>0?accentColor:"#C4A882",letterSpacing:.5,
                  }}>
                    {earned}/{total}
                  </div>
                </div>
                {/* Horizontal scroll row */}
                <div style={{
                  display:"flex",gap:8,
                  overflowX:"auto",
                  padding:"2px 16px 6px",
                  scrollbarWidth:"none",
                  WebkitOverflowScrolling:"touch",
                }}>
                  {grp.badges.map((b,bi)=>(
                    <div key={bi} style={{
                      flexShrink:0,
                      width:total===1?320:80,
                      background:"white",
                      borderRadius:18,
                      padding:total===1?"14px 18px":"14px 8px",
                      display:"flex",
                      flexDirection:total===1?"row":"column",
                      alignItems:"center",
                      gap:total===1?14:5,
                      boxShadow:b.e?`0 4px 16px ${b.color}22`:"0 2px 8px rgba(180,80,0,.05)",
                      border:`1.5px solid ${b.e?b.color+"35":"rgba(200,160,80,.08)"}`,
                      opacity:b.e?1:.3,
                      position:"relative",overflow:"hidden",
                      transition:"all .2s",
                    }}>
                      {/* earned top bar */}
                      {b.e&&<div style={{position:"absolute",top:0,left:0,right:0,height:2.5,background:`linear-gradient(90deg,${b.color},${b.color}88)`}}/>}
                      {/* glow for earned */}
                      {b.e&&<div style={{position:"absolute",top:-20,left:"50%",transform:"translateX(-50%)",width:60,height:60,background:`radial-gradient(circle,${b.glow} 0%,transparent 70%)`,pointerEvents:"none"}}/>}
                      <div style={{fontSize:total===1?28:22,flexShrink:0}}>{b.ico}</div>
                      <div style={{flex:total===1?1:undefined}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:total===1?11:8,fontWeight:800,letterSpacing:.5,textAlign:total===1?"left":"center",textTransform:"uppercase",color:b.e?b.color:"#C4B8A8",lineHeight:1.2}}>{b.n}</div>
                        {b.e
                          ?<div style={{fontFamily:"'Syne',sans-serif",fontSize:total===1?9:7,fontWeight:600,color:b.color,letterSpacing:.5,textAlign:total===1?"left":"center",marginTop:2}}>Earned ✓</div>
                          :<div style={{fontFamily:"'Syne',sans-serif",fontSize:total===1?9:7,fontWeight:500,color:"rgba(180,140,80,.5)",letterSpacing:.3,textAlign:total===1?"left":"center",fontStyle:"italic",marginTop:2,lineHeight:1.3}}>{b.desc}</div>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── SETTINGS ── */}
        <div style={{padding:"14px 16px 0"}}>
          <SecHead title="Settings"/>
          <div style={{background:"white",borderRadius:22,overflow:"hidden",boxShadow:"0 4px 16px rgba(180,80,0,.07)",border:"1.5px solid rgba(255,165,0,.1)"}}>

            {/* Notifications */}
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px"}}>
              <div style={{width:36,height:36,borderRadius:12,background:"rgba(255,165,0,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🔔</div>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,color:"#4A2800",flex:1}}>Daily Notifications</span>
              <div onClick={()=>setNotif(v=>!v)} style={{width:48,height:28,borderRadius:14,background:notif?"linear-gradient(135deg,#E8A020,#C47010)":"rgba(200,180,150,.2)",cursor:"pointer",position:"relative",transition:"background .25s",flexShrink:0}}>
                <div style={{position:"absolute",top:4,left:notif?22:4,width:20,height:20,borderRadius:"50%",background:"white",transition:"left .25s",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/>
              </div>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <div style={{padding:"14px 16px 0"}}>
          <button onClick={onSignOut} style={{width:"100%",background:"rgba(255,100,80,.08)",border:"1.5px solid rgba(255,100,80,.2)",borderRadius:18,padding:"14px",fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"#EF4444",cursor:"pointer"}}>Sign Out</button>
        </div>

        <div style={{height:16}}/>
      </div>
      <BNav active="profile" onNav={onNav}/>
    </div>
  );
}

/* ── ROOT ── */
export default function App(){
  const [screen,setScreen]=useState("loading");
  const [favorites,setFavorites]=useState([]);
  const [karma,setKarma]=useState(0);
  const [user,setUser]=useState(null);
  const [userName,setUserName]=useState("");
  const [tapasyaDays,setTapasyaDays]=useState(0);
  const [shlokaCount,setShlokaCount]=useState(0);
  const [mantaDays,setMantaDays]=useState(0);
  const [nightPrayerDays,setNightPrayerDays]=useState(0);
  const [bhaktDays,setBhaktDays]=useState(0);
  const [tasksDone,setTasksDone]=useState({shlok:false,aarti:false});
  const [mantaDone,setMantaDone]=useState(false);

  const today = new Date().toDateString();

  // Save all state to Firestore
  const persist = async(uid, patch) => {
    try { await saveUser(uid, patch); } catch(e) { console.error("Save error",e); }
  };

  // Wrapped setters that also save to Firestore
  const setKarmaSave = (v) => {
    setKarma(prev => {
      const next = typeof v==="function" ? v(prev) : v;
      if(user?.uid) persist(user.uid, {karma:next});
      return next;
    });
  };
  const setMantaDaysSave = (v) => {
    setMantaDays(prev => {
      const next = typeof v==="function" ? v(prev) : v;
      if(user?.uid) persist(user.uid, {mantaDays:next});
      return next;
    });
  };
  const setMantaDoneSave = (v) => {
    setMantaDone(v);
    if(user?.uid) persist(user.uid, {mantaDone:v, mantaDoneDate:today});
  };
  const setTapasyaDaysSave = (v) => {
    setTapasyaDays(prev => {
      const next = typeof v==="function" ? v(prev) : v;
      if(user?.uid) persist(user.uid, {tapasyaDays:next});
      return next;
    });
  };
  const setShlokaCountSave = (v) => {
    setShlokaCount(prev => {
      const next = typeof v==="function" ? v(prev) : v;
      if(user?.uid) persist(user.uid, {shlokaCount:next});
      return next;
    });
  };
  const setBhaktDaysSave = (v) => {
    setBhaktDays(prev => {
      const next = typeof v==="function" ? v(prev) : v;
      if(user?.uid) persist(user.uid, {bhaktDays:next});
      return next;
    });
  };
  const setTasksDoneSave = (v) => {
    const next = typeof v==="function" ? v(tasksDone) : v;
    setTasksDone(next);
    if(user?.uid) persist(user.uid, {tasksDone:next, lastTaskDate:today});
  };
  const setUserNameSave = (n) => {
    setUserName(n);
    if(user?.uid) persist(user.uid, {userName:n});
  };

  // Listen to Firebase auth state — this is what keeps user logged in
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async(firebaseUser)=>{
      if(firebaseUser){
        // User is logged in — load their data from Firestore
        setUser({uid:firebaseUser.uid, phone:firebaseUser.phoneNumber});
        try {
          const data = await loadUser(firebaseUser.uid);
          if(data){
            if(data.userName){ setUserName(data.userName); }
            if(data.karma !== undefined){ setKarma(data.karma); }
            if(data.tapasyaDays !== undefined){ setTapasyaDays(data.tapasyaDays); }
            if(data.shlokaCount !== undefined){ setShlokaCount(data.shlokaCount); }
            if(data.mantaDays !== undefined){ setMantaDays(data.mantaDays); }
            // Reset mantaDone if it's a new day
            if(data.mantaDoneDate === today && data.mantaDone){ setMantaDone(true); }
            else { setMantaDone(false); }
            if(data.bhaktDays !== undefined){ setBhaktDays(data.bhaktDays); }
            if(data.favorites){ setFavorites(data.favorites); }
            // Reset daily tasks if it's a new day
            if(data.lastTaskDate !== today){
              setTasksDone({shlok:false, aarti:false});
              setMantaDone(false);
              persist(firebaseUser.uid, {tasksDone:{shlok:false,aarti:false}, lastTaskDate:today, mantaDone:false, mantaDoneDate:today});
            } else if(data.tasksDone){
              setTasksDone(data.tasksDone);
            }
            // Go to home if they have a name, else name screen
            setScreen(data.userName ? "home" : "name");
          } else {
            // New user — go to name screen
            setScreen("name");
          }
        } catch(e){
          console.error("Load error",e);
          setScreen("name");
        }
      } else {
        // Not logged in
        setUser(null);
        setScreen("splash");
      }
    });
    return ()=>unsub();
  },[]);

  // Save favorites when they change
  useEffect(()=>{
    if(user?.uid) persist(user.uid, {favorites});
  },[favorites]);

  const handleSignOut = () => {
    auth.signOut();
    setUser(null);
    setUserName("");
    setKarma(0);
    setTapasyaDays(0);
    setShlokaCount(0);
    setMantaDays(0);
    setMantaDone(false);
    setBhaktDays(0);
    setTasksDone({shlok:false,aarti:false});
    setScreen("splash");
  };

  if(screen==="loading") return(
    <div style={{width:"100vw",height:"100dvh",background:"linear-gradient(175deg,#1E0C00,#2C1400,#1A0A00)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:52,color:"rgba(255,200,80,.8)",animation:"pulse 2s infinite"}}>ॐ</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,200,80,.4)"}}>Loading...</div>
    </div>
  );

  return(
    <>
      <style>{css}</style>
      <div style={{minHeight:"100dvh",background:"#080410",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{width:"min(100vw,430px)",height:"100dvh",borderRadius:0,overflow:"hidden",position:"relative",flexShrink:0,display:"flex",flexDirection:"column"}}>
          {(screen==="splash"||screen==="login")&&<Splash startMode={screen==="login"?"login":"splash"} onEnter={()=>setScreen("home")} onLogin={(phone)=>{}}/>}
          {screen==="home"      &&<Home     onNav={setScreen} favorites={favorites} setFavorites={setFavorites}/>}
          {screen==="prarthana" &&<Prarthana onNav={setScreen} tasksDone={tasksDone} setTasksDone={setTasksDoneSave} setKarma={setKarmaSave} setBhaktDays={setBhaktDaysSave}/>}
          {screen==="sadhana"   &&<Sadhana  onNav={setScreen} karma={karma} setKarma={setKarmaSave} user={user} onGoLogin={()=>setScreen("login")}
            tapasyaDays={tapasyaDays} setTapasyaDays={setTapasyaDaysSave}
            shlokaCount={shlokaCount} setShlokaCount={setShlokaCountSave}
            bhaktDays={bhaktDays} setBhaktDays={setBhaktDaysSave}
            tasksDone={tasksDone} setTasksDone={setTasksDoneSave}/>}
          {screen==="anushthan" &&<Anushthan onNav={setScreen} karma={karma} setKarma={setKarmaSave}
            mantaDays={mantaDays} setMantaDays={setMantaDaysSave} user={user}
            mantaDone={mantaDone} setMantaDone={setMantaDoneSave}/>}
          {screen==="profile"   &&<Profile  onNav={setScreen} karma={karma}
            tapasyaDays={tapasyaDays} shlokaCount={shlokaCount}
            mantaDays={mantaDays} nightPrayerDays={nightPrayerDays} bhaktDays={bhaktDays}
            userName={userName} setUserName={setUserNameSave} onSignOut={handleSignOut}/>}
          {screen==="name" && <NameScreen onDone={(n)=>{setUserNameSave(n);setScreen("home");}}/>}
        </div>
      </div>
    </>
  );
}
