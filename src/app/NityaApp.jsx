"use client";
import { useState, useEffect, useRef } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";


// Simple English to Devanagari transliteration for common names
function toDevanagari(name) {
  if(!name) return "";
  // If already contains Devanagari, return as is
  if(/[ऀ-ॿ]/.test(name)) return name;
  const map = {
    // Common name mappings
    "keshav":"केशव","ramesh":"रमेश","suresh":"सुरेश","mahesh":"महेश","dinesh":"दिनेश",
    "rajesh":"राजेश","mukesh":"मुकेश","ganesh":"गणेश","naresh":"नरेश","umesh":"उमेश",
    "priya":"प्रिया","kavita":"कविता","sunita":"सुनीता","anita":"अनीता","geeta":"गीता",
    "sita":"सीता","rita":"रीता","rekha":"रेखा","usha":"उषा","asha":"आशा",
    "arjun":"अर्जुन","ravi":"रवि","shiva":"शिव","krishna":"कृष्ण","ram":"राम",
    "mohan":"मोहन","sohan":"सोहन","rohan":"रोहन","rohit":"रोहित","mohit":"मोहित",
    "amit":"अमित","sumit":"सुमित","anil":"अनिल","sunil":"सुनील","kapil":"कपिल",
    "vikas":"विकास","deepak":"दीपक","rakesh":"राकेश","lokesh":"लोकेश","yogesh":"योगेश",
    "pooja":"पूजा","aarti":"आरती","archana":"अर्चना","vandana":"वंदना","radha":"राधा",
    "meera":"मीरा","neha":"नेहा","sneha":"स्नेहा","preeti":"प्रीति","swati":"स्वाति",
    "rahul":"राहुल","nikhil":"निखिल","akhil":"अखिल","sahil":"साहिल","sachin":"सचिन",
    "lalit":"ललित","harish":"हरीश","girish":"गिरीश","suresh":"सुरेश","paresh":"परेश",
    "shyam":"श्याम","ghansyam":"घनश्याम","balram":"बलराम","lakshmi":"लक्ष्मी",
    "pankaj":"पंकज","sanjay":"संजय","vijay":"विजय","ajay":"अजय","manoj":"मनोज",
    "pramod":"प्रमोद","vinod":"विनोद","arvind":"अरविंद","govind":"गोविंद","ravind":"रवींद्र",
    "ashok":"अशोक","alok":"आलोक","trilok":"त्रिलोक","bhavesh":"भावेश","devesh":"देवेश",
    "satish":"सतीश","jagdish":"जगदीश","ramakant":"रामकांत","shivkant":"शिवकांत",
    "maya":"माया","mamta":"ममता","sarla":"सरला","kamla":"कमला","vimla":"विमला",
    "seema":"सीमा","reema":"रीमा","heema":"हीमा","meena":"मीना","veena":"वीणा",
    "anjali":"अंजली","shweta":"श्वेता","shruti":"श्रुति","smriti":"स्मृति","kratika":"कृतिका",
  };
  const lower = name.toLowerCase().trim();
  if(map[lower]) return map[lower];
  // Return original if not found
  return name;
}

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
  0:{deity:"Surya Dev",name:"Aditya Hridayam",hi:"आदित्य हृदयम्",icon:"☀️",color:"#F97316",g:"linear-gradient(135deg,#4A1208,#5C1E08)",day:"Sunday",sub:"सूर्य उपासना · रविवार"},
  1:{deity:"Bhagwaan Shiva",name:"Shiva Panchakshara",hi:"शिव पञ्चाक्षर स्तोत्र",icon:"🔱",color:"#60A5FA",g:"linear-gradient(135deg,#0A1828,#0E2260)",day:"Monday",sub:"शिव उपासना · सोमवार"},
  2:{deity:"Prabhu Hanuman",name:"Shri Hanuman Aarti",hi:"श्री हनुमान आरती",icon:"🪔",color:"#FB923C",g:"linear-gradient(135deg,#421408,#7A2208)",day:"Tuesday",sub:"हनुमान उपासना · मंगलवार"},
  3:{deity:"Shree Ganesha",name:"Ganesh Aarti",hi:"श्री गणेश आरती",icon:"🌺",color:"#F59E0B",g:"linear-gradient(135deg,#3C1806,#4A2006)",day:"Wednesday",sub:"गणेश उपासना · बुधवार"},
  4:{deity:"Shyam Baba",name:"Shyam Baba Aarti",hi:"श्री श्याम बाबा आरती",icon:"🙏",color:"#8B5CF6",g:"linear-gradient(135deg,#140630,#280E50)",day:"Thursday",sub:"श्याम उपासना · गुरुवार"},
  5:{deity:"Maa Lakshmi",name:"Lakshmi Aarti",hi:"श्री लक्ष्मी जी की आरती",icon:"🌸",color:"#EC4899",g:"linear-gradient(135deg,#420820,#520A28)",day:"Friday",sub:"लक्ष्मी उपासना · शुक्रवार"},
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
  {id:"anushthan",icon:"🛤️",label:"Anushthan"},
  {id:"sadhana",icon:"🌿",label:"Sadhana"},
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


const GITA_JOURNEY = [  {day:1,theme:"Ego",hi:"अहंकार",ref:"Gita · 3.27",
   sanskrit:"प्रकृतेः क्रियमाणानि गुणैः कर्माणि सर्वशः।\nअहङ्कारविमूढात्मा कर्ताहमिति मन्यते॥",
   hindi:"प्रकृति के तीन गुण — सत्व, रज और तम — ये ही सारे कर्म करते हैं। तुम केवल एक माध्यम हो। लेकिन जब अहंकार आता है, तो मन कहता है — \"यह मैंने किया।\" यही सबसे बड़ा भ्रम है। जिस दिन यह भ्रम टूट जाए, उस दिन तुम सच में मुक्त हो।",
   english:"All actions are performed by the modes of nature. One whose mind is deluded by ego thinks 'I am the doer.'"},
  {day:2,theme:"Remembrance",hi:"स्मरण",ref:"Gita · 8.6",
   sanskrit:"यं यं वापि स्मरन्भावं त्यजत्यन्ते कलेवरम्।\nतं तमेवैति कौन्तेय सदा तद्भावभावितः॥",
   hindi:"जीवनभर जो विचार तुम्हारे मन में रहे, मृत्यु के वक्त वही उठेगा। यह कोई संयोग नहीं — यह प्रकृति का नियम है। इसीलिए अभी से अपने मन को उस भाव में रंगो जो तुम बनना चाहते हो।",
   english:"Whatever state of being one remembers when leaving the body at death — that alone will one attain, being ever absorbed in that thought."},
  {day:3,theme:"Self-Reliance",hi:"आत्मनिर्भरता",ref:"Gita · 6.5",
   sanskrit:"उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
   hindi:"कोई गुरु, कोई देवता, कोई परिजन — कोई भी तुम्हें वहाँ नहीं ले जा सकता जहाँ तुम्हें जाना है। तुम्हारा मन ही तुम्हारी सबसे बड़ी सीढ़ी है और तुम्हारा मन ही सबसे गहरा गड्ढा भी। चुनाव तुम्हारा है — हर पल, हर सोच में।",
   english:"Let a person lift themselves by their own self; let them not degrade themselves. For the self alone is the friend of the self, and the self alone is the enemy of the self."},
  {day:4,theme:"Oneness",hi:"एकता",ref:"Gita · 7.7",
   sanskrit:"मत्तः परतरं नान्यत्किञ्चिदस्ति धनञ्जय।\nमयि सर्वमिदं प्रोतं सूत्रे मणिगणा इव॥",
   hindi:"जब तुम धागे को देखते हो तो मोती अलग-अलग दिखते हैं। लेकिन धागा एक ही है। यह संसार भी ऐसा ही है — ऊपर से सब अलग दिखता है, भीतर से सब एक ही सत्ता में पिरोया हुआ है। जिस दिन धागा दिखने लगे, उस दिन अकेलापन हमेशा के लिए चला जाता है।",
   english:"O Arjuna, there is nothing whatsoever higher than Me. All this is strung on Me like clusters of gems on a thread."},
  {day:5,theme:"Vision",hi:"दृष्टि",ref:"Gita · 13.27",
   sanskrit:"समं सर्वेषु भूतेषु तिष्ठन्तं परमेश्वरम्।\nविनश्यत्स्वविनश्यन्तं यः पश्यति स पश्यति॥",
   hindi:"आँखें खुली हों तो भी इंसान अंधा हो सकता है। और आँखें बंद हों तो भी कोई सब देख सकता है। असली देखना वह है जब तुम किसी भी इंसान, किसी भी जीव में उस एक को पहचान लो जो कभी मिटता नहीं। यही दृष्टि तुम्हें घृणा, ईर्ष्या और भेद से हमेशा के लिए आज़ाद कर देती है।",
   english:"One who sees the Supreme Lord dwelling equally in all beings — the imperishable within the perishable — that person truly sees."},
  {day:6,theme:"Renunciation",hi:"त्याग",ref:"Gita · 16.21",
   sanskrit:"त्रिविधं नरकस्येदं द्वारं नाशनमात्मनः।\nकामः क्रोधस्तथा लोभस्तस्मादेतत्त्रयं त्यजेत्॥",
   hindi:"काम माने सिर्फ वासना नहीं — यह हर वो इच्छा है जो मन को बेचैन रखती है। क्रोध वो आग है जो पहले खुद को जलाती है। और लोभ वो कुआँ है जिसका पेंदा कभी नहीं आता। कृष्ण कह रहे हैं — इन तीनों को छोड़ना मतलब खुद को खोना नहीं, बल्कि खुद को पाना है।",
   english:"These three are the gateways to hell and destruction of the self — lust, anger, and greed. Therefore one should abandon all three."},
  {day:7,theme:"Equality",hi:"समता",ref:"Gita · 9.29",
   sanskrit:"समोऽहं सर्वभूतेषु न मे द्वेष्योऽस्ति न प्रियः।\nये भजन्ति तु मां भक्त्या मयि ते तेषु चाप्यहम्॥",
   hindi:"परमात्मा का प्रेम किसी बैंक की तरह नहीं है जो सिर्फ अमीर को कर्ज़ दे। वो सूरज की तरह है — सबको समान रोशनी देता है। फर्क सिर्फ इतना है कि जो खिड़की खोलता है, उसे धूप मिलती है। भक्ति वही खिड़की है।",
   english:"I am equally present in all beings; none is hateful or dear to Me. But those who worship Me with devotion — they are in Me, and I am also in them."},
  {day:8,theme:"Perception",hi:"अनुभूति",ref:"Gita · 15.11",
   sanskrit:"यतन्तो योगिनश्चैनं पश्यन्त्यात्मन्यवस्थितम्।\nयतन्तोऽप्यकृतात्मानो नैनं पश्यन्त्यचेतसः॥",
   hindi:"आत्मा छिपी नहीं है — तुम छिपे हो। शोर में, भागदौड़ में, विचारों की भीड़ में। योगी वो नहीं जो पहाड़ पर बैठा हो — योगी वो है जिसने अपने भीतर की भीड़ को शांत कर लिया हो। तब आत्मा अपने आप दिखने लगती है, जैसे तालाब का पानी शांत हो तो तल दिखता है।",
   english:"The striving yogis behold this soul established in the self. But those of unrefined mind and no self-discipline, even if striving, do not perceive it."},
  {day:9,theme:"Faith",hi:"श्रद्धा",ref:"Gita · 17.3",
   sanskrit:"सत्त्वानुरूपा सर्वस्य श्रद्धा भवति भारत।\nश्रद्धामयोऽयं पुरुषो यो यच्छ्रद्धः स एव सः॥",
   hindi:"तुम जो बार-बार सोचते हो, जिस पर भरोसा करते हो — धीरे-धीरे तुम वही बन जाते हो। यह कोई दर्शन नहीं, यह जीवन का सबसे सीधा सच है। इसीलिए अपनी श्रद्धा को सँभालकर रखो — क्योंकि श्रद्धा ही तुम्हारा भविष्य गढ़ती है।",
   english:"O Arjuna, the faith of each person is in accordance with their nature. A person is made of their faith — whatever one's faith is, that is what one becomes."},
  {day:10,theme:"Detachment",hi:"वैराग्य",ref:"Gita · 18.17",
   sanskrit:"यस्य नाहङ्कृतो भावो बुद्धिर्यस्य न लिप्यते।\nहत्वाऽपि स इमाँल्लोकान्न हन्ति न निबध्यते॥",
   hindi:"अहंकार के बिना किया गया कर्म पानी पर खींची लकीर की तरह है — होता है, मिट जाता है, कोई निशान नहीं। जब \"मैंने किया\" का भाव नहीं होता, तो कर्म का बोझ भी नहीं होता। यही मुक्ति का सबसे सरल रास्ता है — बड़े से बड़ा काम करो, पर उसे अपना मत मानो।",
   english:"One free from ego, whose intellect is untainted — even if that person slays all these worlds, they neither slay nor are they bound."},
  {day:11,theme:"Practice",hi:"अभ्यास",ref:"Gita · 6.35",
   sanskrit:"असंशयं महाबाहो मनो दुर्निग्रहं चलम्।\nअभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते॥",
   hindi:"मन की चंचलता कोई दोष नहीं — यह उसका स्वभाव है, जैसे हवा का चलना। दोष तब होता है जब तुम हवा को रोकने की बजाय उसके साथ बह जाते हो। अभ्यास माने रोज़ थोड़ा-थोड़ा मन को वापस लाना। वैराग्य माने यह जानना कि बाहर की चीज़ें तुम्हें वो नहीं दे सकतीं जो तुम सच में ढूँढ रहे हो।",
   english:"Undoubtedly, O mighty-armed one, the mind is restless and difficult to control. But by practice and by dispassion, O Arjuna, it can be restrained."},
  {day:12,theme:"Virtue",hi:"सद्गुण",ref:"Gita · 16.1",
   sanskrit:"अभयं सत्त्वसंशुद्धिर्ज्ञानयोगव्यवस्थितिः।\nदानं दमश्च यज्ञश्च स्वाध्यायस्तप आर्जवम्॥",
   hindi:"ये गुण कोई नियम नहीं हैं जो बाहर से थोपे जाएँ। ये वो फूल हैं जो तब खिलते हैं जब भीतर की ज़मीन तैयार हो। निडरता तब आती है जब तुम जान लो कि आत्मा को कोई नुकसान नहीं पहुँचा सकता। सरलता तब आती है जब दिखावे की ज़रूरत न रहे। ये सब एक-दूसरे से जुड़े हैं — एक को जगाओ, बाकी खुद आते हैं।",
   english:"Fearlessness, purity of heart, steadfastness in knowledge and yoga, charity, self-control, sacrifice, study of the scriptures, austerity, and straightforwardness — these are the divine qualities."},
  {day:13,theme:"Devotion",hi:"भक्ति",ref:"Gita · 18.55",
   sanskrit:"भक्त्या मामभिजानाति यावान्यश्चास्मि तत्त्वतः।\nततो मां तत्त्वतो ज्ञात्वा विशते तदनन्तरम्॥",
   hindi:"भक्ति कोई कमज़ोरी नहीं है — यह सबसे बड़ी शक्ति है। तर्क से परमात्मा को समझा जा सकता है, लेकिन जाना नहीं जा सकता। जैसे नमक पानी में घुल जाता है और अलग नहीं किया जा सकता — वैसे ही भक्त और भगवान एक हो जाते हैं। यही सच्चा ज्ञान है।",
   english:"By devotion one truly comes to know Me in truth. And having known Me in truth, one immediately enters into Me."},
  {day:14,theme:"Immortality",hi:"अमरता",ref:"Gita · 2.20",
   sanskrit:"न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः।\nअजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे॥",
   hindi:"हम जन्म से डरते नहीं, मृत्यु से डरते हैं। लेकिन जो कभी जन्मा ही नहीं, वो मरेगा कैसे? शरीर कपड़े की तरह है — पुराना हो जाए तो बदल लो। भीतर जो है वो वही है जो सदा था, सदा है और सदा रहेगा। इस सच को जान लो — फिर किसी चीज़ का डर नहीं रहता।",
   english:"The soul is never born nor dies at any time. It is unborn, eternal, ever-existing, and primeval. It is not slain when the body is slain."},
  {day:15,theme:"Surrender",hi:"समर्पण",ref:"Gita · 7.19",
   sanskrit:"बहूनां जन्मनामन्ते ज्ञानवान्मां प्रपद्यते।\nवासुदेवः सर्वमिति स महात्मा सुदुर्लभः॥",
   hindi:"यह जन्म-जन्म की यात्रा है। हर जीवन में थोड़ा और परत उतरती है, थोड़ा और साफ होता है। और जब पूरी सफाई हो जाती है — जब मन यह मान लेता है कि \"जो है, वो सब वासुदेव है\" — तब कहीं जाना नहीं पड़ता। वो खुद आ जाता है। ऐसा इंसान संसार में रहते हुए भी संसार से परे होता है।",
   english:"After many births and deaths, one who is truly in knowledge surrenders unto Me, knowing that I, Vasudeva, am everything. Such a great soul is very rare."},
  {day:16,theme:"Refuge",hi:"शरण",ref:"Gita · 12.6–7",
   sanskrit:"ये तु सर्वाणि कर्माणि मयि संन्यस्य मत्पराः।\nअनन्येनैव योगेन मां ध्यायन्त उपासते॥",
   hindi:"यह कृष्ण का सबसे बड़ा वादा है। वो कह रहे हैं — तुम्हें सब कुछ खुद नहीं करना। बस अपना हाथ मेरी तरफ बढ़ाओ। जो इंसान हर कर्म को परमात्मा को समर्पित करके चलता है, उसका बोझ परमात्मा उठा लेते हैं। यह कमज़ोरी नहीं — यह सबसे गहरी समझ है।",
   english:"Those who surrender all actions to Me and worship with undivided devotion, their minds fixed on Me — I swiftly deliver them from the ocean of birth and death."},
  {day:17,theme:"Presence",hi:"उपस्थिति",ref:"Gita · 5.8–9",
   sanskrit:"नैव किञ्चित्करोमीति युक्तो मन्येत तत्त्ववित्।\nपश्यन् शृण्वन् स्पृशन् जिघ्रन् अश्नन् गच्छन् स्वपन् श्वसन्॥",
   hindi:"हम खाते हैं पर स्वाद नहीं लेते। देखते हैं पर देखते नहीं। सुनते हैं पर सुनते नहीं। मन हमेशा कहीं और होता है — बीते हुए कल में या आने वाले कल में। ज्ञानी वो है जो यह जानता है कि \"मैं यंत्र नहीं हूँ\" — और इसीलिए हर पल में पूरा जीता है, बिना किसी दावे के।",
   english:"The one who knows the truth thinks 'I do nothing at all' — whether seeing, hearing, touching, smelling, eating, going, sleeping, breathing — holding firm that the senses move among their objects."},
  {day:18,theme:"Divinity",hi:"दिव्यता",ref:"Gita · 9.16",
   sanskrit:"अहं क्रतुरहं यज्ञः स्वधाऽहमहमौषधम्।\nमन्त्रोऽहमहमेवाज्यमहमग्निरहं हुतम्॥",
   hindi:"जब तुम दीया जलाते हो, मंत्र पढ़ते हो, आहुति देते हो — तुम्हें लगता है तुम कुछ बाहर की शक्ति को बुला रहे हो। लेकिन कृष्ण कह रहे हैं — वो शक्ति पहले से वहाँ है। अग्नि में, मंत्र में, घी में, और तुम्हारे हाथों में भी। पूजा इसीलिए नहीं होती कि भगवान को ज़रूरत है — पूजा इसीलिए होती है ताकि तुम यह देख सको।",
   english:"I am the ritual, I am the sacrifice, I am the offering to the ancestors, I am the herb, I am the mantra, I am the clarified butter, I am the fire, and I am the act of offering."},
  {day:19,theme:"Infinity",hi:"अनंतता",ref:"Gita · 10.32–33",
   sanskrit:"सर्गाणामादिरन्तश्च मध्यं चैवाहमर्जुन।\nअध्यात्मविद्या विद्यानां वादः प्रवदतामहम्॥",
   hindi:"कृष्ण अर्जुन को यह नहीं बता रहे कि वो बड़े हैं। वो उसे एक दृष्टि दे रहे हैं — जो भी सबसे श्रेष्ठ है, सबसे पहला है, सबसे गहरा है — वो मैं हूँ। इसका मतलब यह है कि जब तुम किसी भी चीज़ की गहराई में जाओ, तुम परमात्मा तक पहुँच जाओगे। हर रास्ता उसी तक जाता है।",
   english:"I am the beginning, middle, and end of all creation. Among knowledge I am the knowledge of the Self. I am the letter A, inexhaustible time, and the Creator facing everywhere."},
  {day:20,theme:"Conquest",hi:"विजय",ref:"Gita · 3.43",
   sanskrit:"एवं बुद्धेः परं बुद्ध्वा संस्तभ्यात्मानमात्मना।\nजहि शत्रुं महाबाहो कामरूपं दुरासदम्॥",
   hindi:"सबसे बड़ा युद्ध बाहर नहीं लड़ा जाता — वो भीतर लड़ा जाता है। और सबसे ज़िद्दी दुश्मन है — इच्छा। वो मरती नहीं, छिप जाती है। लेकिन जब आत्मा का बोध हो जाता है तो इच्छा की जड़ ही कट जाती है। फिर वो उठ नहीं सकती। यही असली विजय है।",
   english:"Thus knowing the Self to be superior to the intellect, O mighty-armed one, steady the self with the Self and slay the enemy — desire — so difficult to conquer."},
  {day:22,theme:"Silence",hi:"मौन",ref:"Gita · 2.60",
   sanskrit:"यततो ह्यपि कौन्तेय पुरुषस्य विपश्चितः।\nइन्द्रियाणि प्रमाथीनि हरन्ति प्रसभं मनः॥",
   hindi:"इंद्रियाँ बड़ी बलवान हैं। विद्वान से विद्वान इंसान का मन भी ये जबरदस्ती खींच ले जाती हैं। इसीलिए मौन सिर्फ चुप रहना नहीं है — मौन माने इंद्रियों को भीतर मोड़ लेना। जब बाहर का शोर बंद होता है, तभी भीतर की आवाज़ सुनाई देती है।",
   english:"The senses are so strong and turbulent that they forcibly carry away the mind even of a person of discernment who is striving for self-control."},
  {day:23,theme:"Wisdom",hi:"ज्ञान",ref:"Gita · 4.38",
   sanskrit:"न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।\nतत्स्वयं योगसंसिद्धः कालेनात्मनि विन्दति॥",
   hindi:"इस दुनिया में ज्ञान से बड़ा कोई पवित्र करने वाला नहीं है। पानी मैल धोता है, आग कचरा जलाती है — लेकिन ज्ञान वो जड़ तक साफ करता है जहाँ से मैल उठता है। और यह ज्ञान माँगने से नहीं मिलता — जब साधना पक जाती है, तो यह अपने आप भीतर से उठता है।",
   english:"In this world, there is nothing as purifying as knowledge. One who is perfected in yoga finds this knowledge within themselves in due course of time."},
  {day:24,theme:"Steadiness",hi:"स्थिरता",ref:"Gita · 2.56",
   sanskrit:"दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः।\nवीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते॥",
   hindi:"जो दुख में घबराता नहीं और सुख में पागल नहीं होता — जिसके भीतर न राग है, न भय, न क्रोध — उसे स्थितप्रज्ञ कहते हैं। यह कोई ठंडा-बेजान इंसान नहीं है। यह वो है जिसकी जड़ें इतनी गहरी हैं कि तूफान आए तो भी पेड़ हिलता है पर उखड़ता नहीं।",
   english:"One who is not disturbed in mind even amidst the threefold miseries, nor elated when there is happiness, and who is free from attachment, fear, and anger, is called a sage of steady mind."},
  {day:25,theme:"Transformation",hi:"रूपांतरण",ref:"Gita · 4.7",
   sanskrit:"यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
   hindi:"जब-जब धर्म कमज़ोर पड़ता है और अधर्म सिर उठाता है — परमात्मा स्वयं प्रकट होते हैं। यह सिर्फ इतिहास की बात नहीं है। यह तुम्हारे भीतर भी होता है — जब तुम्हारे अंदर का सच दबने लगता है, तो एक शक्ति उठती है जो तुम्हें वापस लाती है। वही परमात्मा का अवतरण है।",
   english:"Whenever and wherever there is a decline in righteousness and a rise in unrighteousness, O Arjuna, at that time I manifest Myself."},
  {day:26,theme:"Liberation",hi:"मुक्ति",ref:"Gita · 4.9",
   sanskrit:"जन्म कर्म च मे दिव्यमेवं यो वेत्ति तत्त्वतः।\nत्यक्त्वा देहं पुनर्जन्म नैति मामेति सोऽर्जुन॥",
   hindi:"जो यह जान लेता है कि कृष्ण का जन्म और कर्म दिव्य हैं — साधारण नहीं — वो मरने के बाद फिर जन्म नहीं लेता। लेकिन यह जानना सिर्फ किताबी नहीं है। यह वो क्षण है जब तुम्हें भीतर से दिखता है कि यह सब खेल है, और खिलाड़ी एक ही है। उस क्षण के बाद तुम फिर वही नहीं रहते।",
   english:"One who knows in truth the divine nature of My birth and activities does not, upon leaving the body, take birth again in this material world, but attains My eternal abode."},
  {day:27,theme:"Acceptance",hi:"स्वीकृति",ref:"Gita · 2.14",
   sanskrit:"मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥",
   hindi:"सर्दी आती है, गर्मी आती है — और चली भी जाती है। सुख आता है, दुख आता है — और यह भी जाता है। इंद्रियों के स्पर्श से जो अनुभव होते हैं, वो सब आने-जाने वाले हैं। जो इंसान यह जान लेता है, वो न सुख में उछलता है न दुख में टूटता है। यही सहनशीलता है — और यही शुरुआत है।",
   english:"O Arjuna, the contacts between the senses and their objects give rise to cold and heat, pleasure and pain. They come and go and are impermanent. Bear them with patience."},
  {day:28,theme:"Contentment",hi:"संतोष",ref:"Gita · 2.57",
   sanskrit:"यः सर्वत्रानभिस्नेहस्तत्तत्प्राप्य शुभाशुभम्।\nनाभिनन्दति न द्वेष्टि तस्य प्रज्ञा प्रतिष्ठिता॥",
   hindi:"जो इंसान अच्छा मिले तो खुशी से नहीं उछलता और बुरा मिले तो नफरत नहीं करता — जो हर जगह बिना चिपके रहता है — उसकी बुद्धि स्थिर है। संतोष कोई हार नहीं है। संतोष वो जगह है जहाँ से तुम सब देखते हो बिना किसी चीज़ के गुलाम बने।",
   english:"One who is not affected by whatever good or evil they obtain, who neither rejoices nor hates — their wisdom is firmly established."},
  {day:29,theme:"Clarity",hi:"स्पष्टता",ref:"Gita · 2.41",
   sanskrit:"व्यवसायात्मिका बुद्धिरेकेह कुरुनन्दन।\nबहुशाखा ह्यनन्ताश्च बुद्धयोऽव्यवसायिनाम्॥",
   hindi:"निश्चय वाले की बुद्धि एक होती है — सीधी, तेज़, एक ही दिशा में। लेकिन जो अनिश्चय में जीता है, उसके मन में हज़ार शाखाएँ होती हैं — हर पल एक नई सोच, एक नया डर, एक नया रास्ता। इसीलिए स्पष्टता सबसे बड़ी ताकत है। जब तुम जानते हो तुम्हें क्या चाहिए, तो ब्रह्मांड भी रास्ता देता है।",
   english:"Those who are on this path are resolute in purpose, and their aim is one. But the thoughts of those who are irresolute are many-branched and endless."},
  {day:30,theme:"Grace",hi:"कृपा",ref:"Gita · 10.10",
   sanskrit:"तेषां सततयुक्तानां भजतां प्रीतिपूर्वकम्।\nददामि बुद्धियोगं तं येन मामुपयान्ति ते॥",
   hindi:"जो प्रेम से, निरंतर भक्ति से मुझसे जुड़े रहते हैं — उन्हें मैं वो बुद्धि देता हूँ जिससे वो मुझ तक पहुँच सकें। यह कृपा माँगी नहीं जाती — यह प्रेम का स्वाभाविक फल है। जैसे फूल खिले और खुशबू अपने आप फैले। जब तुम सच्चे मन से जुड़ते हो, तो परमात्मा खुद रास्ता खोलते हैं।",
   english:"To those who are constantly devoted and who worship Me with love, I give the understanding by which they can come to Me."},
  {day:31,theme:"Equanimity",hi:"समभाव",ref:"Gita · 2.48",
   sanskrit:"सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते।",
   hindi:"सफलता मिले या असफलता — दोनों में समान रहना ही योग है। यह उदासीनता नहीं है। यह वो गहराई है जहाँ तुम जानते हो कि न सफलता तुम्हें बनाती है, न असफलता तुम्हें मिटाती है। तुम उससे कहीं ज़्यादा हो। यही समभाव तुम्हें हर हाल में पूरा रखता है।",
   english:"Perform your duty equably, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called yoga."},
  {day:32,theme:"Discipline",hi:"साधना",ref:"Gita · 6.17",
   sanskrit:"युक्ताहारविहारस्य युक्तचेष्टस्य कर्मसु।\nयुक्तस्वप्नावबोधस्य योगो भवति दुःखहा॥",
   hindi:"जो सही तरह खाता है, सही तरह चलता-फिरता है, सही तरह काम करता है और सही तरह सोता-जागता है — उसके लिए योग दुख मिटाने वाला बन जाता है। साधना कोई कठोर तपस्या नहीं है। साधना माने जीवन के हर छोटे काम को होश के साथ करना। वही होश एक दिन समाधि बन जाता है।",
   english:"He who is temperate in eating and recreation, balanced in work, regulated in sleep and wakefulness — for him yoga becomes the destroyer of all sorrow."},
  {day:33,theme:"Fearlessness",hi:"निडरता",ref:"Gita · 2.3",
   sanskrit:"क्लैब्यं मा स्म गमः पार्थ नैतत्त्वय्युपपद्यते।\nक्षुद्रं हृदयदौर्बल्यं त्यक्त्वोत्तिष्ठ परन्तप॥",
   hindi:"कृष्ण अर्जुन को झकझोर रहे हैं — यह कायरता तुम्हें शोभा नहीं देती। यह दिल की कमज़ोरी है, इसे छोड़ो और उठो। यह बात सिर्फ अर्जुन को नहीं कही गई — यह हर उस इंसान को कही गई है जो अपने डर के सामने बैठकर रो रहा है। उठो। जो तुम हो, वो डर से बड़ा है।",
   english:"O Arjuna, do not yield to this degrading impotence. It does not become you. Shake off your faint-heartedness and arise."},
  {day:34,theme:"Impermanence",hi:"अनित्यता",ref:"Gita · 2.28",
   sanskrit:"अव्यक्तादीनि भूतानि व्यक्तमध्यानि भारत।\nअव्यक्तनिधनान्येव तत्र का परिदेवना॥",
   hindi:"सब प्राणी जन्म से पहले अदृश्य थे, बीच में दिखते हैं और मरने के बाद फिर अदृश्य हो जाते हैं। जो पहले नहीं था और बाद में नहीं रहेगा — उस बीच के समय के लिए इतना रोना क्यों? जो आया है वो जाएगा — यह सत्य जब भीतर उतरता है तो शोक की जड़ ही कट जाती है।",
   english:"All created beings are unmanifest in their beginnings, manifest in the middle, and unmanifest again at the end. What is there to lament in this?"},
  {day:35,theme:"Service",hi:"सेवा",ref:"Gita · 3.9",
   sanskrit:"यज्ञार्थात्कर्मणोऽन्यत्र लोकोऽयं कर्मबन्धनः।\nतदर्थं कर्म कौन्तेय मुक्तसङ्गः समाचर॥",
   hindi:"यज्ञ माने सिर्फ हवन नहीं — यज्ञ माने वो काम जो दूसरों के लिए, बड़े उद्देश्य के लिए किया जाए। जो काम सिर्फ अपने लिए होता है, वो बंधन बनाता है। जो काम समर्पण भाव से होता है — वो मुक्ति का रास्ता बन जाता है। इसीलिए हर काम को यज्ञ समझकर करो।",
   english:"Work done as a sacrifice for the Divine must be performed; otherwise action causes bondage in this world. Therefore, O Arjuna, perform your duties for His sake, free from all attachment."},
  {day:36,theme:"Compassion",hi:"करुणा",ref:"Gita · 5.18",
   sanskrit:"विद्याविनयसंपन्ने ब्राह्मणे गवि हस्तिनि।\nशुनि चैव श्वपाके च पण्डिताः समदर्शिनः॥",
   hindi:"ज्ञानी वो है जो एक विद्वान ब्राह्मण में, एक गाय में, हाथी में, कुत्ते में और नीच कहे जाने वाले इंसान में — सबमें एक ही सत्ता देखे। जब यह दृष्टि खुल जाती है तो घृणा के लिए कोई जगह नहीं बचती। करुणा कोई भावना नहीं है — यह ज्ञान का स्वाभाविक परिणाम है।",
   english:"The humble sages, by virtue of true knowledge, see with equal vision a learned brahmin, a cow, an elephant, a dog, and an outcast."},
  {day:37,theme:"Stillness",hi:"निश्चलता",ref:"Gita · 18.78",
   sanskrit:"यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः।\nतत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम॥",
   hindi:"जहाँ योगेश्वर कृष्ण हैं और जहाँ धनुर्धर अर्जुन है — वहाँ लक्ष्मी है, विजय है, वैभव है और अटल नीति है। इसका गहरा अर्थ यह है — जब भीतर का परमात्मा और बाहर का कर्म एक साथ हों, जब आत्मज्ञान और क्रिया में विरोध न हो — तब हर काम में जीत होती है।",
   english:"Wherever there is Krishna, the lord of all mystics, and wherever there is Arjuna, the supreme archer, there will also certainly be opulence, victory, extraordinary power, and morality."},
  {day:38,theme:"Knowing",hi:"बोध",ref:"Gita · 13.2",
   sanskrit:"क्षेत्रज्ञं चापि मां विद्धि सर्वक्षेत्रेषु भारत।\nक्षेत्रक्षेत्रज्ञयोर्ज्ञानं यत्तज्ज्ञानं मतं मम॥",
   hindi:"शरीर एक खेत है — क्षेत्र। और उस खेत को जानने वाला — क्षेत्रज्ञ — वो मैं हूँ। हर शरीर में, हर इंसान में वही जानने वाला बैठा है। जब तुम यह जान लेते हो कि तुम शरीर नहीं हो बल्कि जानने वाले हो — तब सब बदल जाता है। यही बोध है, यही ज्ञान की परम अवस्था है।",
   english:"O Arjuna, you should understand that I am also the knower in all bodies. To understand this body and its knower is called true knowledge."},
  {day:39,theme:"Letting Go",hi:"छोड़ना",ref:"Gita · 18.66",
   sanskrit:"सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
   hindi:"यह गीता का आखिरी और सबसे बड़ा वचन है। कृष्ण कह रहे हैं — सब छोड़ो। सब धर्म, सब नियम, सब अहंकार — सब। बस मेरी शरण में आ जाओ। मैं तुम्हें हर पाप से, हर बोझ से मुक्त कर दूँगा। चिंता मत करो। यह हार नहीं है — यह सबसे बड़ी जीत है। जब तुम सब छोड़ देते हो, तब जो बचता है — वही तुम हो।",
   english:"Abandon all varieties of religion and simply surrender unto Me. I shall deliver you from all sinful reactions. Do not fear."},
  {day:40,theme:"Awareness",hi:"जागृति",ref:"Gita · 15.15",
   sanskrit:"सर्वस्य चाहं हृदि सन्निविष्टो\nमत्तः स्मृतिर्ज्ञानमपोहनं च॥",
   hindi:"परमात्मा कह रहे हैं — मैं हर इंसान के हृदय में बैठा हूँ। याददाश्त मुझसे आती है, ज्ञान मुझसे आता है और भूलना भी मुझसे होता है। तुम जब कुछ याद करते हो, तब भी मैं हूँ। जब भूल जाते हो, तब भी मैं हूँ। जागृति माने यह पहचानना कि हर पल के पीछे वही है।",
   english:"I am seated in the hearts of all living beings. From Me come remembrance, knowledge, and forgetfulness. I am to be known by all the Vedas."},
  {day:41,theme:"Truth",hi:"सत्य",ref:"Gita · 10.3",
   sanskrit:"यो मामजमनादिं च वेत्ति लोकमहेश्वरम्।\nअसम्मूढः स मर्त्येषु सर्वपापैः प्रमुच्यते॥",
   hindi:"जो यह जानता है कि परमात्मा अजन्मा है, अनादि है और सब लोकों का स्वामी है — वो इंसान सब भ्रमों से मुक्त हो जाता है और सब पापों से छूट जाता है। सत्य की यह पहचान कोई दार्शनिक बात नहीं है — यह एक ऐसा अनुभव है जो भीतर से जीवन को बदल देता है।",
   english:"One who knows Me as unborn and without beginning, as the Supreme Lord of all worlds — that person, undeluded among mortals, is freed from all sins."},
  {day:42,theme:"Flow",hi:"प्रवाह",ref:"Gita · 3.8",
   sanskrit:"नियतं कुरु कर्म त्वं कर्म ज्यायो ह्यकर्मणः।\nशरीरयात्रापि च ते न प्रसिद्ध्येदकर्मणः॥",
   hindi:"अपना नियत कर्म करते रहो — क्योंकि कर्म न करने से कर्म करना हमेशा बेहतर है। यहाँ तक कि शरीर का गुज़ारा भी बिना कर्म के नहीं होता। जीवन एक नदी है — उसमें बहना सीखो। रुकना नहीं, डूबना नहीं — बस बहते रहो।",
   english:"Perform your prescribed duties, for action is better than inaction. Even the maintenance of your body would not be possible without action."},
  {day:43,theme:"Beauty",hi:"सौंदर्य",ref:"Gita · 9.26",
   sanskrit:"पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति।\nतदहं भक्त्युपहृतमश्नामि प्रयतात्मनः॥",
   hindi:"एक पत्ता, एक फूल, एक फल, थोड़ा पानी — बस इतना काफी है। परमात्मा कह रहे हैं — मुझे बड़े यज्ञ नहीं चाहिए, महँगी पूजा नहीं चाहिए। जो शुद्ध मन से, प्रेम से थोड़ा भी देता है — वो मुझे मिलता है। यही जीवन की सबसे बड़ी सुंदरता है — कि परमात्मा को पाना इतना सरल है।",
   english:"If one offers Me with love and devotion a leaf, a flower, a fruit, or water, I will accept it."},
  {day:44,theme:"Humility",hi:"विनम्रता",ref:"Gita · 13.7",
   sanskrit:"अमानित्वमदम्भित्वमहिंसा क्षान्तिरार्जवम्।\nआचार्योपासनं शौचं स्थैर्यमात्मविनिग्रहः॥",
   hindi:"मान न चाहना, दिखावा न करना, किसी को नुकसान न पहुँचाना, धैर्य रखना, सरल होना, गुरु की सेवा, मन की शुद्धि, स्थिरता और खुद पर काबू — ये सब ज्ञान के लक्षण हैं। विनम्रता कमज़ोरी नहीं है — यह उस इंसान की पहचान है जिसे भीतर से पता है कि वो क्या है।",
   english:"Humility, absence of pride, non-violence, patience, simplicity, service to the teacher, cleanliness, steadiness, and self-control — all these are declared to be knowledge."},
  {day:45,theme:"Purpose",hi:"उद्देश्य",ref:"Gita · 3.35",
   sanskrit:"श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्।\nस्वधर्मे निधनं श्रेयः परधर्मो भयावहः॥",
   hindi:"अपना धर्म — यानी अपनी प्रकृति के अनुसार काम — थोड़ा कमज़ोर भी हो तो बेहतर है, बजाय किसी दूसरे के रास्ते पर चलने से जो बड़ा दिखता हो। अपने रास्ते पर मरना भी बेहतर है — दूसरे का रास्ता डर लाता है। जब तुम खुद को जानते हो और उसी के अनुसार चलते हो — वहीं उद्देश्य है।",
   english:"It is better to perform one's own duty imperfectly than to perform another's duty perfectly. It is better to die in one's own duty; another's duty is fraught with fear."},
  {day:46,theme:"Silence of Mind",hi:"मन का मौन",ref:"Gita · 6.27",
   sanskrit:"प्रशान्तमनसं ह्येनं योगिनं सुखमुत्तमम्।\nउपैति शान्तरजसं ब्रह्मभूतमकल्मषम्॥",
   hindi:"जिसका मन शांत हो गया है, जिसके भीतर रज का आंदोलन थम गया है, जो निष्पाप हो गया है — उस योगी को सर्वोच्च सुख मिलता है। यह सुख बाहर से नहीं आता। यह वो सुख है जो तब मिलता है जब मन की सतह पर लहरें थम जाती हैं और भीतर का स्थिर पानी दिखने लगता है।",
   english:"The yogi whose mind is thus always free from disturbance, whose sins are cleansed, whose rajas has subsided — attains the highest happiness of union with the Supreme."},
  {day:47,theme:"Integrity",hi:"निष्ठा",ref:"Gita · 4.39",
   sanskrit:"श्रद्धावाँल्लभते ज्ञानं तत्परः संयतेन्द्रियः।\nज्ञानं लब्ध्वा परां शान्तिमचिरेणाधिगच्छति॥",
   hindi:"श्रद्धा हो, तत्परता हो और इंद्रियाँ काबू में हों — जो इन तीनों को एक साथ साधता है, उसे ज्ञान मिलता है। और ज्ञान मिलने के बाद परम शांति देर नहीं लगती। निष्ठा माने सिर्फ ईमानदारी नहीं — निष्ठा माने पूरी तरह से, बिना बिखरे, एक दिशा में लगे रहना।",
   english:"One who is faithful, devoted, and with senses controlled attains knowledge. Having attained knowledge, one quickly reaches supreme peace."},
  {day:48,theme:"Upliftment",hi:"उत्थान",ref:"Gita · 4.36",
   sanskrit:"अपि चेदसि पापेभ्यः सर्वेभ्यः पापकृत्तमः।\nसर्वं ज्ञानप्लवेनैव वृजिनं सन्तरिष्यसि॥",
   hindi:"अगर तुम सबसे बड़े पापी भी हो — तो भी ज्ञान की नाव तुम्हें पार लगा देगी। यह कृष्ण का सबसे बड़ा आश्वासन है उन लोगों के लिए जो खुद को टूटा, गिरा, नाकाबिल समझते हैं। कोई इतना नहीं गिरा कि उठ न सके। ज्ञान की एक किरण काफी है — पूरा अँधेरा मिट जाता है।",
   english:"Even if you are the most sinful of all sinners, you shall cross over all wickedness with the boat of knowledge alone."},
  {day:49,theme:"Wholeness",hi:"पूर्णता",ref:"Gita · 4.24",
   sanskrit:"ब्रह्मार्पणं ब्रह्म हविर्ब्रह्माग्नौ ब्रह्मणा हुतम्।\nब्रह्मैव तेन गन्तव्यं ब्रह्मकर्मसमाधिना॥",
   hindi:"यज्ञ में जो समर्पित किया जाता है — वो भी ब्रह्म है। जो समर्पित करता है — वो भी ब्रह्म है। आग — वो भी ब्रह्म है। जो डाला जाता है — वो भी ब्रह्म है। और जहाँ जाना है — वो भी ब्रह्म है। जब हर चीज़ में एक ही दिखने लगे — तब भीतर एक पूर्णता आती है जो किसी चीज़ से नहीं टूटती।",
   english:"The act of offering is Brahman, the offering itself is Brahman, the fire is Brahman, and the one who offers is Brahman. The goal to be reached by one who is absorbed in Brahman is Brahman alone."},
  {day:50,theme:"Rest",hi:"विश्राम",ref:"Gita · 6.18",
   sanskrit:"यदा विनियतं चित्तमात्मन्येवावतिष्ठते।\nनिःस्पृहः सर्वकामेभ्यो युक्त इत्युच्यते तदा॥",
   hindi:"जब मन पूरी तरह वश में आ जाता है और केवल आत्मा में टिक जाता है — जब किसी भी इच्छा की प्यास नहीं रहती — तब उसे युक्त कहते हैं, यानी जुड़ा हुआ। यही असली विश्राम है। थका हुआ शरीर सोने से आराम पाता है — लेकिन थकी हुई आत्मा सिर्फ इसी अवस्था में विश्राम पाती है।",
   english:"When the disciplined mind rests in the Self alone, free from longing for all objects of desire — that person is said to be in perfect union."},
  {day:51,theme:"Mystery",hi:"रहस्य",ref:"Gita · 9.4",
   sanskrit:"मया ततमिदं सर्वं जगदव्यक्तमूर्तिना।\nमत्स्थानि सर्वभूतानि न चाहं तेष्ववस्थितः॥",
   hindi:"मैं इस पूरे जगत में व्याप्त हूँ — अदृश्य रूप में। सब कुछ मुझमें है, लेकिन मैं उसमें नहीं हूँ। यह परमात्मा का सबसे बड़ा रहस्य है। जैसे आकाश हर जगह है पर किसी चीज़ से बँधा नहीं — वैसे ही वो सब में है पर सबसे परे भी है। यह रहस्य समझ में नहीं आता — सिर्फ अनुभव में उतरता है।",
   english:"All this universe is pervaded by Me in My unmanifest form. All beings exist in Me, but I do not dwell in them."},
  {day:52,theme:"Resilience",hi:"दृढ़ता",ref:"Gita · 2.16",
   sanskrit:"नासतो विद्यते भावो नाभावो विद्यते सतः।\nउभयोरपि दृष्टोऽन्तस्त्वनयोस्तत्त्वदर्शिभिः॥",
   hindi:"जो असत् है — जो झूठा है — उसका कोई अस्तित्व नहीं। और जो सत् है — जो सच है — उसका कभी नाश नहीं। तत्त्व को देखने वाले यह जान लेते हैं। जब तुम यह जान लो कि तुम्हारे भीतर जो है वो कभी मिट नहीं सकता — तब कोई भी टूटन तुम्हें हमेशा के लिए नहीं तोड़ सकती। यही दृढ़ता की जड़ है।",
   english:"The unreal has no existence, and the real never ceases to be. The seers of truth have concluded this by studying the nature of both."},
  {day:53,theme:"Charity",hi:"दान",ref:"Gita · 17.20",
   sanskrit:"दातव्यमिति यद्दानं दीयतेऽनुपकारिणे।\nदेशे काले च पात्रे च तद्दानं सात्त्विकं स्मृतम्॥",
   hindi:"जो दान इसलिए दिया जाए कि देना चाहिए — बिना किसी बदले की उम्मीद के, सही जगह, सही समय और सही इंसान को — वो सात्विक दान है। दान तब दान है जब उसमें \"मैंने दिया\" का भाव न हो। जब देना स्वाभाविक हो जाए जैसे पेड़ का फल देना — तब समझो दान का असली अर्थ समझ आया।",
   english:"Charity given out of duty, without expectation of return, to a worthy person at the right place and time — that charity is considered to be in the mode of goodness."},
  {day:54,theme:"Longing",hi:"तड़प",ref:"Gita · 9.34",
   sanskrit:"मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु।\nमामेवैष्यसि युक्त्वैवमात्मानं मत्परायणः॥",
   hindi:"कृष्ण कह रहे हैं — बस मुझमें मन लगाओ, मेरे भक्त बनो, मेरी पूजा करो, मुझे नमन करो। इतना करो तो मुझ तक पहुँच जाओगे। यह आदेश नहीं है — यह प्रेम का निमंत्रण है। जैसे कोई प्रिय कहे — बस मेरी तरफ देखो। तड़प वो धागा है जो भक्त और भगवान को जोड़ता है।",
   english:"Always think of Me, become My devotee, worship Me, and offer your homage unto Me. Thus you will come to Me without fail."},
  {day:55,theme:"Mastery",hi:"महारत",ref:"Gita · 2.67",
   sanskrit:"इन्द्रियाणां हि चरतां यन्मनोऽनुविधीयते।\nतदस्य हरति प्रज्ञां वायुर्नावमिवाम्भसि॥",
   hindi:"जैसे पानी में तूफान आए तो नाव को बहा ले जाता है — वैसे ही अगर मन इंद्रियों के पीछे चल पड़े, तो बुद्धि बह जाती है। महारत माने इंद्रियों को जीतना नहीं — महारत माने मन को इतना मज़बूत करना कि वो इंद्रियों के तूफान में भी अपनी जगह न छोड़े।",
   english:"Just as a boat on the water is swept away by a strong wind, even one of the senses upon which the mind focuses can carry away a person's intelligence."},
  {day:56,theme:"Eternity",hi:"शाश्वतता",ref:"Gita · 2.25",
   sanskrit:"अव्यक्तोऽयमचिन्त्योऽयमविकार्योऽयमुच्यते।\nतस्मादेवं विदित्वैनं नानुशोचितुमर्हसि॥",
   hindi:"आत्मा अव्यक्त है — दिखती नहीं। अचिन्त्य है — सोच में नहीं आती। अविकारी है — इसमें कोई बदलाव नहीं होता। जब तुम यह जान लो — तो शोक करने की कोई वजह नहीं रहती। जो शाश्वत है, उसके लिए आँसू? जो कभी बदलता नहीं, उसके लिए चिंता? बस जानो — और मुक्त हो जाओ।",
   english:"It is said that the soul is invisible, inconceivable, immutable, and unchangeable. Knowing this, you should not grieve for the body."},
  {day:57,theme:"Union",hi:"योग",ref:"Gita · 13.28",
   sanskrit:"समं पश्यन्हि सर्वत्र समवस्थितमीश्वरम्।\nन हिनस्त्यात्मनात्मानं ततो याति परां गतिम्॥",
   hindi:"जो हर जगह, हर हाल में ईश्वर को समान रूप से देखता है — वो अपने आप को खुद से नहीं काटता। और जो खुद से नहीं कटता, वो परम गति को पाता है। योग माने जुड़ना — लेकिन सबसे पहले खुद से जुड़ना। जब भीतर का टूटना बंद हो जाए, तब बाहर से भी सब जुड़ा लगता है।",
   english:"One who sees the Supreme Lord equally present everywhere does not degrade himself by his own mind. Thus he gradually attains the supreme destination."},
  {day:58,theme:"Healing",hi:"उपचार",ref:"Gita · 10.11",
   sanskrit:"तेषामेवानुकम्पार्थमहमज्ञानजं तमः।\nनाशयाम्यात्मभावस्थो ज्ञानदीपेन भास्वता॥",
   hindi:"जो मुझसे प्रेम से जुड़े हैं — उन पर मेरी करुणा होती है। और उनके अज्ञान से जो अँधेरा है — उसे मैं खुद उनके भीतर बैठकर ज्ञान के दीपक से मिटाता हूँ। यह उपचार बाहर से नहीं होता। परमात्मा भीतर से चंगा करते हैं — जहाँ कोई दवा नहीं पहुँच सकती।",
   english:"Out of compassion for them, I, dwelling within their hearts, destroy with the shining lamp of knowledge the darkness born of ignorance."},
  {day:59,theme:"Completion",hi:"समापन",ref:"Gita · 18.64",
   sanskrit:"सर्वगुह्यतमं भूयः शृणु मे परमं वचः।\nइष्टोऽसि मे दृढमिति ततो वक्ष्यामि ते हितम्॥",
   hindi:"कृष्ण कह रहे हैं — सब रहस्यों में सबसे गहरा रहस्य एक बार और सुनो। मैं यह इसलिए कह रहा हूँ क्योंकि तुम मुझे बहुत प्रिय हो। यह पूरी गीता का सबसे कोमल क्षण है। जब यात्रा पूरी होती है — तब परमात्मा नियम नहीं बोलते, प्रेम बोलते हैं। यात्रा का समापन हमेशा प्रेम में होता है।",
   english:"Because you are My very dear friend, I am speaking to you the most confidential part of knowledge. Hear this from Me, for it is for your benefit."},
  {day:60,theme:"Peace",hi:"शांति",ref:"Gita · 5.25",
   sanskrit:"लभन्ते ब्रह्मनिर्वाणमृषयः क्षीणकल्मषाः।\nछिन्नद्वैधा यतात्मानः सर्वभूतहिते रताः॥",
   hindi:"जिनके पाप धुल गए हैं, जिनके मन का द्वंद्व कट गया है, जो खुद को साध चुके हैं और जो सब प्राणियों की भलाई में लगे हैं — वो ब्रह्म की उस शांति को पाते हैं जो शब्दों में नहीं आती। यह शांति कोई मनोस्थिति नहीं है — यह वो अवस्था है जहाँ भीतर का सारा युद्ध खत्म हो जाता है। यात्रा यहीं पूरी होती है — शांति में, पूर्णता में।",
   english:"Those whose sins have been destroyed, whose doubts have been dispelled, whose minds are disciplined, and who are engaged in the welfare of all beings — they attain liberation in the Supreme."},
];

function Home({onNav,favorites,setFavorites,tasksDone={shlok:false},setTasksDone,setKarma,setShlokaCount,joinDate}){
  const [tab,setTab]=useState("hindi");
  const [favOpen,setFavOpen]=useState(false);
  const [toast,setToast]=useState("");

  // Journey starts from user's personal joinDate (Day 1 = their signup day)
  const JOURNEY_START = joinDate ? new Date(joinDate).getTime() : Date.now();
  const daysSinceStart = Math.max(0, Math.floor((Date.now() - JOURNEY_START) / 86400000));
  const journeyDayIdx = Math.min(daysSinceStart, 59);
  const todayLesson = GITA_JOURNEY[journeyDayIdx];
  const journeyDay = journeyDayIdx + 1;

  const isFav=favorites.some(f=>f.id===todayLesson.day);
  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(""),2200);};
  const toggleFav=()=>{if(isFav){setFavorites(f=>f.filter(x=>x.id!==todayLesson.day));showToast("Removed from favourites");}else{setFavorites(f=>[...f,{...todayLesson,id:todayLesson.day}]);showToast("Added to favourites ❤️");}};

  return(
    <div style={{width:"100%",height:"100%",background:"linear-gradient(170deg,#EEF4FF 0%,#DCE9FF 55%,#C8DBFF 100%)",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",bottom:-30,right:-30,fontFamily:"'Noto Sans Devanagari',serif",fontSize:260,color:"rgba(30,70,180,.04)",pointerEvents:"none",zIndex:0,lineHeight:1}}>ॐ</div>

      {/* Toast */}
      {toast&&<div style={{position:"absolute",top:72,left:"50%",transform:"translateX(-50%)",background:"rgba(10,20,60,.93)",color:"#A5C8FF",fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,letterSpacing:1,padding:"9px 20px",borderRadius:20,zIndex:50,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,.4)",animation:"fadeUp .3s ease"}}>{toast}</div>}

      {/* ── WHATSAPP SHARE POPUP ── */}


      <SB/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 22px 0",zIndex:10,flexShrink:0}}>
        <span style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#0D1F5C",letterSpacing:".5px",textTransform:"uppercase",lineHeight:1}}>VedPath</span>
        <div style={{width:34,height:34,borderRadius:12,background:"rgba(26,58,143,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,cursor:"pointer"}}>🔔</div>
      </div>
      <div style={{flex:1,overflowY:"auto",paddingBottom:82,zIndex:5}}>

        {/* ── 21-DAY GITA JOURNEY SECTION ── */}

        {/* Big bold heading */}
        <div style={{padding:"16px 20px 0"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"rgba(40,80,200,.5)",marginBottom:6}}>📖 Daily Scripture</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:26,fontWeight:800,color:"#0D1F5C",letterSpacing:.5,lineHeight:1.1}}>60-Day Gita Journey</div>
          <div style={{height:3,width:60,background:"linear-gradient(90deg,#3B82F6,transparent)",borderRadius:4,marginTop:8}}/>
        </div>

        {/* Aaj ka gyaan label */}
        <div style={{padding:"12px 20px 10px"}}>
          <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:22,fontWeight:800,color:"#0D1F5C",letterSpacing:.3}}>आज का ज्ञान</div>
        </div>

        {/* Shloka Sadhana instruction card */}
        <div style={{margin:"0 16px 12px",background:"rgba(255,255,255,.55)",backdropFilter:"blur(12px)",borderRadius:20,padding:"18px 20px",border:"1px solid rgba(100,150,255,.2)",boxShadow:"0 3px 14px rgba(26,58,143,.08)"}}>
          <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:14,fontWeight:800,letterSpacing:.5,color:"rgba(40,80,200,.7)",marginBottom:10}}>🌸 श्लोक साधना</div>
          <p style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:16,fontWeight:500,color:"#0D1F5C",lineHeight:1.9,margin:0}}>शांत मन से बैठें, आँखें बंद करें। इस श्लोक का धीरे-धीरे उच्चारण करें, और इसके भाव को अपने जीवन में अपनाने का संकल्प लें। पढ़ने के बाद ✓ दबाएं।</p>
        </div>

        {/* Krishna image card */}
        <div style={{margin:"0 16px",borderRadius:26,overflow:"hidden",boxShadow:"0 16px 48px rgba(26,58,143,.25)",border:"1px solid rgba(100,150,255,.25)",position:"relative"}}>
          <div style={{height:3,background:"linear-gradient(90deg,#60A5FA,#3B82F6,#1D4ED8,#3B82F6,#60A5FA)",backgroundSize:"200% 100%",animation:"gradShift 4s linear infinite"}}/>
          <div style={{position:"relative",width:"100%"}}>
            <img src="/krishna-vishwarup.jpg" alt="Shri Krishna" style={{width:"100%",display:"block",objectFit:"cover",height:380,objectPosition:"center top"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(5,15,50,.75) 0%,transparent 40%,rgba(5,15,50,.92) 100%)"}}/>
            {/* Day counter at TOP */}
            <div style={{position:"absolute",top:0,left:0,right:0,padding:"18px 22px",display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"rgba(180,210,255,.75)",marginBottom:2}}>Gita Journey</div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:42,fontWeight:800,color:"white",lineHeight:1,textShadow:"0 2px 24px rgba(59,130,246,.6)"}}>Day {journeyDay}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:600,color:"rgba(180,210,255,.6)"}}>of 60</div>
              </div>
              <div style={{background:"rgba(100,160,255,.18)",border:"1px solid rgba(100,160,255,.3)",borderRadius:14,padding:"6px 12px",backdropFilter:"blur(8px)"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(180,210,255,.9)"}}>{todayLesson.ref}</div>
              </div>
            </div>
            {/* Theme overlay at bottom */}
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"22px 22px 26px",textAlign:"center"}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:28,fontWeight:700,color:"#BAD4FF",lineHeight:1.1,textShadow:"0 2px 20px rgba(59,130,246,.5)",marginBottom:4}}>{todayLesson.theme}</div>
              <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:18,fontWeight:600,color:"rgba(180,210,255,.8)"}}>{todayLesson.hi}</div>
            </div>
          </div>
        </div>

        {/* Shloka card — separate below image */}
        <div style={{margin:"10px 16px 0",background:"linear-gradient(160deg,#0A1845 0%,#112270 50%,#0D1F5C 100%)",borderRadius:24,padding:"22px 20px 24px",boxShadow:"0 12px 40px rgba(13,31,92,.45), 0 0 0 1px rgba(100,150,255,.2), inset 0 1px 0 rgba(255,255,255,.07)",position:"relative",overflow:"hidden"}}>
          {/* Animated top bar */}
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,transparent,#60A5FA,#93C5FD,#60A5FA,transparent)",borderRadius:"24px 24px 0 0"}}/>
          {/* Subtle radial glow behind text */}
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:220,height:120,background:"radial-gradient(ellipse,rgba(96,165,250,.12) 0%,transparent 70%)",pointerEvents:"none"}}/>
          {/* Flute backdrop */}
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%) rotate(-8deg)",opacity:.07,pointerEvents:"none",zIndex:0}}>
            <svg width="280" height="36" viewBox="0 0 280 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="14" width="272" height="8" rx="4" fill="#93C5FD"/>
              <ellipse cx="4" cy="18" rx="4" ry="8" fill="#93C5FD"/>
              <circle cx="35" cy="18" r="4" fill="#0A1845" stroke="#93C5FD" strokeWidth="1.5"/>
              <circle cx="62" cy="18" r="4" fill="#0A1845" stroke="#93C5FD" strokeWidth="1.5"/>
              <circle cx="89" cy="18" r="4" fill="#0A1845" stroke="#93C5FD" strokeWidth="1.5"/>
              <circle cx="116" cy="18" r="4" fill="#0A1845" stroke="#93C5FD" strokeWidth="1.5"/>
              <circle cx="143" cy="18" r="4" fill="#0A1845" stroke="#93C5FD" strokeWidth="1.5"/>
              <circle cx="170" cy="18" r="4" fill="#0A1845" stroke="#93C5FD" strokeWidth="1.5"/>
              <circle cx="197" cy="18" r="4" fill="#0A1845" stroke="#93C5FD" strokeWidth="1.5"/>
              <path d="M276 14 Q284 10 276 6" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          {/* Corner ॐ watermark */}
          <div style={{position:"absolute",bottom:-8,right:10,fontFamily:"'Noto Sans Devanagari',serif",fontSize:80,color:"rgba(100,150,255,.06)",pointerEvents:"none",lineHeight:1}}>ॐ</div>

          {/* Ref pill */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(96,165,250,.1)",border:"1px solid rgba(96,165,250,.25)",borderRadius:20,padding:"4px 14px"}}>
              <span style={{fontSize:10}}>🪷</span>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(147,197,253,.9)"}}>{todayLesson.ref}</span>
            </div>
          </div>

          {/* Sanskrit lines with decorative borders */}
          <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontWeight:700}}>
            {/* Top decorative line */}
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{flex:1,height:1,background:"linear-gradient(90deg,transparent,rgba(96,165,250,.4))"}}/>
              <span style={{fontSize:12,color:"rgba(147,197,253,.7)"}}>✦</span>
              <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(96,165,250,.4),transparent)"}}/>
            </div>
            {todayLesson.sanskrit.split("\n").map((line,i)=>(
              <div key={i} style={{fontSize:"clamp(15px,5vw,20px)",color:i===0?"#E0ECFF":"rgba(180,210,255,.88)",textAlign:"center",lineHeight:1.75,letterSpacing:.3,textShadow:"0 0 24px rgba(96,165,250,.35)",marginBottom:i===0?6:0}}>{line}</div>
            ))}
            {/* Bottom decorative line */}
            <div style={{display:"flex",alignItems:"center",gap:10,marginTop:14}}>
              <div style={{flex:1,height:1,background:"linear-gradient(90deg,transparent,rgba(96,165,250,.4))"}}/>
              <span style={{fontSize:12,color:"rgba(147,197,253,.7)"}}>✦</span>
              <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(96,165,250,.4),transparent)"}}/>
            </div>
          </div>
        </div>

        {/* Translation card — Peacock feather theme */}
        <div style={{margin:"10px 16px 0",background:"linear-gradient(160deg,#0a2a1a 0%,#0f3d20 45%,#122e14 100%)",borderRadius:24,overflow:"hidden",boxShadow:"0 12px 40px rgba(10,42,26,.6), 0 0 0 1px rgba(134,197,94,.2), inset 0 1px 0 rgba(255,255,255,.06)",position:"relative"}}>

          {/* Top shimmer bar — feather colours */}
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,transparent,#4ade80,#facc15,#4ade80,transparent)"}}/>

          {/* Peacock feather SVG — top right corner watermark */}
          <div style={{position:"absolute",top:-6,right:-6,opacity:.13,pointerEvents:"none",zIndex:0}}>
            <svg width="90" height="110" viewBox="0 0 90 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Feather stem */}
              <path d="M45 105 Q44 70 43 40 Q42 20 45 5" stroke="#facc15" strokeWidth="2" strokeLinecap="round"/>
              {/* Barbs left */}
              <path d="M44 80 Q30 74 18 72" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M43 68 Q28 60 14 55" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M43 56 Q30 46 20 38" stroke="#86efac" strokeWidth="1.1" strokeLinecap="round"/>
              <path d="M43 44 Q34 34 28 24" stroke="#86efac" strokeWidth="1" strokeLinecap="round"/>
              {/* Barbs right */}
              <path d="M46 80 Q60 74 72 72" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M46 68 Q62 60 76 55" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M46 56 Q60 46 70 38" stroke="#86efac" strokeWidth="1.1" strokeLinecap="round"/>
              <path d="M46 44 Q56 34 62 24" stroke="#86efac" strokeWidth="1" strokeLinecap="round"/>
              {/* Eye of feather */}
              <ellipse cx="45" cy="18" rx="10" ry="13" fill="none" stroke="#facc15" strokeWidth="1.5"/>
              <ellipse cx="45" cy="18" rx="6" ry="8" fill="none" stroke="#4ade80" strokeWidth="1.2"/>
              <ellipse cx="45" cy="18" rx="3" ry="4" fill="#facc15" opacity=".6"/>
            </svg>
          </div>

          {/* Flute SVG — bottom left watermark */}
          <div style={{position:"absolute",bottom:10,left:-4,opacity:.1,pointerEvents:"none",zIndex:0,transform:"rotate(-18deg)"}}>
            <svg width="100" height="22" viewBox="0 0 100 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="9" width="96" height="5" rx="2.5" fill="#facc15"/>
              <circle cx="20" cy="11.5" r="2.5" fill="#0a2a1a" stroke="#facc15" strokeWidth="1"/>
              <circle cx="33" cy="11.5" r="2.5" fill="#0a2a1a" stroke="#facc15" strokeWidth="1"/>
              <circle cx="46" cy="11.5" r="2.5" fill="#0a2a1a" stroke="#facc15" strokeWidth="1"/>
              <circle cx="59" cy="11.5" r="2.5" fill="#0a2a1a" stroke="#facc15" strokeWidth="1"/>
              <circle cx="72" cy="11.5" r="2.5" fill="#0a2a1a" stroke="#facc15" strokeWidth="1"/>
              <path d="M2 11.5 Q0 8 2 5" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",borderBottom:"1px solid rgba(74,222,128,.12)",position:"relative",zIndex:1}}>
            {[{id:"hindi",label:"हिंदी",sub:"Hindi"},{id:"english",label:"English",sub:"अंग्रेज़ी"}].map(t=>{
              const on=tab===t.id;
              return(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"13px 8px 11px",border:"none",cursor:"pointer",background:on?"rgba(74,222,128,.08)":"transparent",borderBottom:on?"2.5px solid #4ade80":"2.5px solid transparent",transition:"all .2s"}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:on?800:600,color:on?"#86efac":"rgba(134,239,172,.28)",letterSpacing:.3,lineHeight:1}}>{t.label}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:8,fontWeight:500,color:on?"rgba(134,239,172,.4)":"rgba(134,239,172,.18)",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>{t.sub}</div>
                </button>
              );
            })}
          </div>

          <div style={{padding:"18px 18px 22px",position:"relative",zIndex:1}}>
            {/* Top decorative line */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <div style={{flex:1,height:1,background:"linear-gradient(90deg,transparent,rgba(250,204,21,.45))"}}/>
              <span style={{fontSize:12,color:"#facc15"}}>◆</span>
              <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(250,204,21,.45),transparent)"}}/>
            </div>

            {/* Label pill */}
            <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(250,204,21,.1)",border:"1px solid rgba(250,204,21,.25)",borderRadius:20,padding:"4px 14px"}}>
                <span style={{fontSize:9}}>🎋</span>
                <span style={{fontFamily:"'Syne',sans-serif",fontSize:8,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#facc15"}}>{tab==="hindi"?"भावार्थ · Meaning":"Translation"}</span>
              </div>
            </div>

            {tab==="hindi"
              ?<p style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:19,fontWeight:700,color:"#fef08a",lineHeight:2,margin:0}}>{todayLesson.hindi}</p>
              :<p style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:700,color:"#fef08a",lineHeight:1.9,margin:0}}>{todayLesson.english}</p>
            }

            {/* Bottom decorative line */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:18}}>
              <div style={{flex:1,height:1,background:"linear-gradient(90deg,transparent,rgba(250,204,21,.45))"}}/>
              <span style={{fontSize:12,color:"#facc15"}}>◆</span>
              <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(250,204,21,.45),transparent)"}}/>
            </div>
          </div>
        </div>

        {/* ── AAJ KA GYAAN TOGGLE ── */}
        <div style={{margin:"10px 16px 0"}}>
          <div style={{background:"white",borderRadius:22,overflow:"hidden",boxShadow:"0 3px 14px rgba(109,40,217,.08)",border:"1.5px solid rgba(139,92,246,.15)"}}>
            <div style={{padding:"13px 16px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,background:"rgba(109,40,217,.1)",border:"1px solid rgba(139,92,246,.2)"}}>📖</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"#3B1095"}}>Aaj Ka Gyaan</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:10,fontStyle:"italic",color:"#9B7AE0",marginTop:2}}>{todayLesson.ref} · {todayLesson.theme}</div>
              </div>
              <button onClick={()=>{
                if(tasksDone.shlok) return;
                if(setTasksDone) setTasksDone({...tasksDone,shlok:true});
                if(setKarma) setKarma(k=>k+50);
                if(setShlokaCount) setShlokaCount(c=>c+1);
              }} disabled={tasksDone.shlok}
                style={{width:38,height:38,borderRadius:"50%",flexShrink:0,border:"none",cursor:tasksDone.shlok?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                  background:tasksDone.shlok?"linear-gradient(135deg,#FFD700,#FF8C00)":"white",
                  boxShadow:tasksDone.shlok?"0 4px 14px rgba(255,180,0,.45)":"inset 0 0 0 2.5px rgba(200,140,40,.3)",
                  transition:"all .3s"}}>
                {tasksDone.shlok
                  ?<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  :<div style={{width:14,height:14,borderRadius:"50%",border:"2.5px solid rgba(200,140,40,.35)"}}/>
                }
              </button>
            </div>
            <div style={{height:3,background:"rgba(255,165,0,.1)"}}>
              <div style={{height:"100%",width:tasksDone.shlok?"100%":"0%",background:"linear-gradient(90deg,#FFD700,#FF8C00)",transition:"width .8s ease"}}/>
            </div>
            <div style={{padding:"5px 16px 9px"}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:tasksDone.shlok?"#C47010":"rgba(196,160,64,.5)"}}>
                {tasksDone.shlok?"✓ +50 XP EARNED · Gyaan complete":"Tap ✓ when you've read today's shlok · +50 XP"}
              </span>
            </div>
          </div>
        </div>

        {/* ── HIDDEN SHARE CARD (rendered off-screen, captured as image) ── */}

        {/* ── SHARE + FAVOURITE ROW ── */}
        <div style={{margin:"10px 16px 0",display:"flex",gap:10}}>
          {/* Share */}
          <button
            onClick={async()=>{
              try{
                showToast("Creating card... 🎨");
                const lesson=todayLesson;
                const W=800,PAD=60;
                const canvas=document.createElement("canvas");
                canvas.width=W;canvas.height=100;// temp height, will resize
                const ctx=canvas.getContext("2d");

                // wrap helper
                const wrap=(text,font,maxW)=>{
                  ctx.font=font;
                  const words=text.split(" ");
                  const lines=[];let cur="";
                  for(const w of words){
                    const test=cur?cur+" "+w:w;
                    if(ctx.measureText(test).width>maxW&&cur){lines.push(cur);cur=w;}
                    else cur=test;
                  }
                  if(cur)lines.push(cur);
                  return lines;
                };

                const innerW=W-PAD*2;
                const SFONT="bold 24px sans-serif";
                const HFONT="bold 26px sans-serif";

                // split sanskrit on actual newline
                const sanskritLines=lesson.sanskrit.split("\n");
                // also wrap each sanskrit line in case it's too long
                const wrappedSanskrit=[];
                for(const sl of sanskritLines){
                  const wl=wrap(sl,SFONT,innerW);
                  wl.forEach(l=>wrappedSanskrit.push(l));
                }
                const hindiLines=wrap(lesson.hindi,HFONT,innerW);
                const refLine=`${lesson.ref}  ·  ${lesson.theme}`;

                // calculate total height
                const H=60+50+28+wrappedSanskrit.length*46+28+hindiLines.length*50+28+80;
                canvas.height=H;

                // background
                const bg=ctx.createLinearGradient(0,0,0,H);
                bg.addColorStop(0,"#0a2a1a");bg.addColorStop(.5,"#0f3d20");bg.addColorStop(1,"#0a2a1a");
                ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

                // top colour bar
                const bar=ctx.createLinearGradient(0,0,W,0);
                bar.addColorStop(0,"#4ade80");bar.addColorStop(.5,"#facc15");bar.addColorStop(1,"#4ade80");
                ctx.fillStyle=bar;ctx.fillRect(0,0,W,5);

                let y=50;

                // ref pill
                ctx.font="bold 20px sans-serif";ctx.fillStyle="rgba(250,204,21,0.13)";
                const pillW=Math.min(ctx.measureText(refLine).width+60,innerW);
                ctx.fillRect(PAD,y,pillW,38);
                ctx.strokeStyle="rgba(250,204,21,0.35)";ctx.lineWidth=1.5;ctx.strokeRect(PAD,y,pillW,38);
                ctx.fillStyle="#facc15";ctx.textBaseline="middle";ctx.textAlign="left";
                ctx.fillText(refLine,PAD+16,y+19);
                y+=58;

                // divider
                const divider=(yy)=>{
                  ctx.strokeStyle="rgba(250,204,21,0.35)";ctx.lineWidth=1;
                  ctx.beginPath();ctx.moveTo(PAD,yy);ctx.lineTo(W-PAD,yy);ctx.stroke();
                  ctx.fillStyle="#facc15";ctx.font="18px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";
                  ctx.fillText("◆",W/2,yy);
                };

                divider(y);y+=28;

                // sanskrit lines
                ctx.font=SFONT;ctx.textAlign="center";ctx.textBaseline="top";
                for(let i=0;i<wrappedSanskrit.length;i++){
                  ctx.fillStyle=i===0?"#E0ECFF":"rgba(180,210,255,0.85)";
                  ctx.fillText(wrappedSanskrit[i],W/2,y);y+=46;
                }
                y+=10;divider(y);y+=28;

                // hindi lines
                ctx.font=HFONT;ctx.fillStyle="#fef08a";ctx.textAlign="left";ctx.textBaseline="top";
                for(const line of hindiLines){ctx.fillText(line,PAD,y);y+=50;}
                y+=10;divider(y);y+=28;

                // branding
                ctx.font="bold 22px sans-serif";ctx.fillStyle="#4ade80";ctx.textAlign="left";ctx.textBaseline="middle";
                ctx.fillText("NITYA",PAD,y+16);
                ctx.font="15px sans-serif";ctx.fillStyle="rgba(134,239,172,0.55)";
                ctx.fillText("nitya.app  ·  Daily Sadhana",PAD,y+38);
                ctx.font="52px sans-serif";ctx.fillStyle="rgba(250,204,21,0.14)";ctx.textAlign="right";
                ctx.fillText("ॐ",W-PAD,y+28);

                // share
                canvas.toBlob(async(blob)=>{
                  if(!blob){showToast("Unable to create card");return;}
                  const file=new File([blob],"nitya-shlok.png",{type:"image/png"});
                  try{
                    if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
                      await navigator.share({title:"Nitya · Daily Shlok",files:[file]});
                    } else {
                      const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="nitya-shlok.png";a.click();
                      showToast("Card saved! 📥");
                    }
                  }catch(e){showToast("Sharing cancelled");}
                },"image/png");
              }catch(e){showToast("Unable to create card");}
            }}
            style={{flex:1,background:"linear-gradient(135deg,#1A3A8F,#2D5BE3)",border:"none",borderRadius:18,padding:"13px 10px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 4px 16px rgba(26,58,143,.35)",transition:"transform .15s"}}
            onMouseDown={e=>e.currentTarget.style.transform="scale(.97)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,color:"white",letterSpacing:.5}}>Share Shlok</span>
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
   image:"/surya.png",
   tathastuBg:"linear-gradient(145deg,#1A0800,#2C1200)",
   tathastu2:"linear-gradient(135deg,#2C1400,#4A2000)",
   tathastuMsg:"हे भक्त, तुम्हारी प्रार्थना\nस्वीकार हुई।\nसूर्य देव का तेज\nतुम्हारे साथ है।",
   tathastuSender:"— सूर्य देव",
   tathastuColor:"#FB923C",tathastuGlow:"rgba(251,146,60,.4)",darkText:"#9A3412",
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
  {id:1,short:"Mon",full:"Monday",deity:"Bhagwaan Shiva",icon:"🔱",name:"शिव जी की आरती",sub:"शिव उपासना · सोमवार",
   color:"#60A5FA",bg:"linear-gradient(170deg,#EFF6FF 0%,#DBEAFE 55%,#BFDBFE 100%)",
   heroBg:"linear-gradient(135deg,#1E3A5F,#1E40AF,#1D4ED8)",glow:"rgba(96,165,250,.2)",
   image:"/shiva.png",
   tathastuBg:"linear-gradient(145deg,#050E1F,#0A1830)",
   tathastu2:"linear-gradient(135deg,#0C1A3A,#142850)",
   tathastuMsg:"हे भक्त, तुम्हारी प्रार्थना\nस्वीकार हुई।\nशिव का आशीर्वाद\nतुम्हारे साथ है।",
   tathastuSender:"— महादेव शिव",
   tathastuColor:"#60A5FA",tathastuGlow:"rgba(96,165,250,.4)",darkText:"#1E3A5F",
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
  {id:2,short:"Tue",full:"Tuesday",deity:"Prabhu Hanuman",icon:"🪔",name:"हनुमान जी की आरती",sub:"हनुमान उपासना · मंगलवार",
   color:"#EF4444",bg:"linear-gradient(170deg,#FFF5F5 0%,#FFE4E4 55%,#FECACA 100%)",
   heroBg:"linear-gradient(135deg,#7F1D1D,#991B1B,#B91C1C)",glow:"rgba(239,68,68,.2)",
   image:"/hanuman.png",
   tathastuBg:"linear-gradient(145deg,#1A0200,#2E0500)",
   tathastu2:"linear-gradient(135deg,#3A0800,#5C1000)",
   tathastuMsg:"हे भक्त, तुम्हारी प्रार्थना\nस्वीकार हुई।\nहनुमान जी का बल\nतुम्हारे साथ है।",
   tathastuSender:"— श्री हनुमान",
   tathastuColor:"#F87171",tathastuGlow:"rgba(248,113,113,.4)",darkText:"#7F1D1D",
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
  {id:3,short:"Wed",full:"Wednesday",deity:"Shree Ganesha",icon:"🌺",name:"श्री गणेश आरती",sub:"गणेश उपासना · बुधवार",
   color:"#F59E0B",bg:"linear-gradient(170deg,#FFFBEB 0%,#FEF3C7 55%,#FDE68A 100%)",
   heroBg:"linear-gradient(135deg,#78350F,#92400E,#B45309)",glow:"rgba(245,158,11,.2)",
   image:"/ganesha.png",floatIcon:"🐘",
   tathastuBg:"linear-gradient(145deg,#221000,#3A1C00)",
   tathastu2:"linear-gradient(135deg,#2C1400,#503000)",
   tathastuMsg:"हे भक्त, तुम्हारी प्रार्थना\nस्वीकार हुई।\nगणेश का आशीष\nतुम्हारे साथ है।",
   tathastuSender:"— श्री गणेश",
   tathastuColor:"#F59E0B",tathastuGlow:"rgba(245,158,11,.35)",darkText:"#78350F",
   verses:[
     {bg:"linear-gradient(135deg,#3C1806,#5C2A08)",label:"आरती प्रारम्भ",text:"जय गणेश जय गणेश जय गणेश देवा।\nमाता जाकी पार्वती पिता महादेवा॥",c:"#F59E0B"},
     {bg:"linear-gradient(135deg,#4A2200,#6B3800)",label:"पद २",text:"एकदंत दयावंत चार भुजाधारी।\nमाथे सिंदूर सोहे मूसे की सवारी॥",c:"#FBBF24"},
     {bg:"linear-gradient(135deg,#3A1604,#582804)",label:"पद ३",text:"अंधन को आंख देत कोढ़िन को काया।\nबांझन को पुत्र देत निर्धन को माया॥",c:"#F59E0B"},
     {bg:"linear-gradient(135deg,#4E2A00,#703C00)",label:"पद ४",text:"हार चढ़े फूल चढ़े और चढ़े मेवा।\nलड्डुअन का भोग लगे संत करें सेवा॥",c:"#D97706"},
     {bg:"linear-gradient(135deg,#421C04,#623008)",label:"पद ५",text:"दीनन की लाज राखो शंभु सुतवारी।\nकामना को पूर्ण करो जग बलिहारी॥",c:"#FBBF24"},
     {bg:"linear-gradient(135deg,#3C1806,#5C2A08)",label:"आरती समापन",text:"जय गणेश जय गणेश जय गणेश देवा।\nमाता जाकी पार्वती पिता महादेवा॥",c:"#F59E0B"},
   ]},
  {id:4,short:"Thu",full:"Thursday",deity:"Shyam Baba",icon:"🙏",name:"श्री श्याम बाबा आरती",sub:"श्याम उपासना · गुरुवार",
   color:"#8B5CF6",bg:"linear-gradient(170deg,#F5F3FF 0%,#EDE9FE 55%,#DDD6FE 100%)",
   heroBg:"linear-gradient(135deg,#2E1065,#3B0764,#4C1D95)",glow:"rgba(139,92,246,.2)",
   image:"/shyam.png",floatIcon:"✨",
   tathastuBg:"linear-gradient(145deg,#0E0520,#1A0A35)",
   tathastu2:"linear-gradient(135deg,#150830,#280F5A)",
   tathastuMsg:"हे भक्त, तुम्हारी प्रार्थना\nस्वीकार हुई।\nश्याम बाबा का प्रेम\nतुम्हारे साथ है।",
   tathastuSender:"— श्री श्याम",
   tathastuColor:"#8B5CF6",tathastuGlow:"rgba(139,92,246,.35)",darkText:"#2E1065",
   verses:[
     {bg:"linear-gradient(135deg,#14062E,#240A52)",label:"आरती प्रारम्भ",text:"ॐ जय श्री श्याम हरे, बाबा जय श्री श्याम हरे।\nखाटू धाम विराजत, भक्तों के संकट टरे॥",c:"#8B5CF6"},
     {bg:"linear-gradient(135deg,#1A0840,#2E1068)",label:"पद २",text:"रत्न सिंहासन राजत, मोर मुकुट सिर धारे।\nमोरछड़ी की शोभा, मन भक्तों के हरे॥",c:"#A78BFA"},
     {bg:"linear-gradient(135deg,#100428,#1E0848)",label:"पद ३",text:"तन मन धन सब अर्पण, चरणों में तेरे स्वामी।\nदीनों के तुम दाता, अंतर्यामी स्वामी॥",c:"#8B5CF6"},
     {bg:"linear-gradient(135deg,#1C0A3C,#320C5E)",label:"पद ४",text:"हारे के सहारे तुम, जग में नाम तुम्हारा।\nजो शरण तुम्हारी आए, पार करो भव धारा॥",c:"#7C3AED"},
     {bg:"linear-gradient(135deg,#140630,#260A50)",label:"पद ५",text:"शीश के दानी बाबा, महिमा अपरंपारा।\nतेरी कृपा से चमके, जीवन यह हमारा॥",c:"#A78BFA"},
     {bg:"linear-gradient(135deg,#180840,#2C0E60)",label:"पद ६",text:"जो कोई प्रेम से गावे, आरती श्याम तुम्हारी।\nकृपा बरसे उस पर, मिटे विपदा सारी॥",c:"#8B5CF6"},
     {bg:"linear-gradient(135deg,#14062E,#240A52)",label:"आरती समापन",text:"ॐ जय श्री श्याम हरे, बाबा जय श्री श्याम हरे।\nखाटू धाम विराजत, भक्तों के संकट टरे॥",c:"#7C3AED"},
   ]},
  {id:5,short:"Fri",full:"Friday",deity:"Maa Lakshmi",icon:"🌸",name:"श्री लक्ष्मी जी की आरती",sub:"लक्ष्मी उपासना · शुक्रवार",
   color:"#EC4899",bg:"linear-gradient(170deg,#FDF2F8 0%,#FCE7F3 55%,#FBCFE8 100%)",
   heroBg:"linear-gradient(135deg,#831843,#9D174D,#BE185D)",glow:"rgba(236,72,153,.2)",
   image:"/lakshmi.png",floatIcon:"🪷",
   tathastuBg:"linear-gradient(145deg,#1E0414,#340820)",
   tathastu2:"linear-gradient(135deg,#2A0618,#500A2C)",
   tathastuMsg:"हे भक्त, तुम्हारी प्रार्थना\nस्वीकार हुई।\nमाँ लक्ष्मी की कृपा\nतुम्हारे साथ है।",
   tathastuSender:"— माँ लक्ष्मी",
   tathastuColor:"#EC4899",tathastuGlow:"rgba(236,72,153,.35)",darkText:"#831843",
   verses:[
     {bg:"linear-gradient(135deg,#420820,#620A2C)",label:"आरती प्रारम्भ",text:"ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता।\nतुमको निसदिन सेवत, हरि विष्णु विधाता॥",c:"#EC4899"},
     {bg:"linear-gradient(135deg,#52082C,#780C3A)",label:"पद २",text:"उमा रमा ब्रह्माणी, तुम ही जग माता।\nसूर्य चन्द्रमा ध्यावत, नारद ऋषि गाता॥",c:"#F472B6"},
     {bg:"linear-gradient(135deg,#3C0618,#5A0A24)",label:"पद ३",text:"दुर्गा रूप निरंजनि, सुख संपत्ति दाता।\nजो कोई तुमको ध्यावत, ऋद्धि सिद्धि धन पाता॥",c:"#EC4899"},
     {bg:"linear-gradient(135deg,#4E0A26,#6E0C32)",label:"पद ४",text:"तुम पाताल निवासिनि, तुम ही शुभदाता।\nकर्म प्रभाव प्रकाशिनि, भव निधि की त्राता॥",c:"#DB2777"},
     {bg:"linear-gradient(135deg,#420820,#620A2E)",label:"पद ५",text:"जिस घर तुम रहती, सब सद्गुण आता।\nसब संभव हो जाता, मन नहीं घबराता॥",c:"#F472B6"},
     {bg:"linear-gradient(135deg,#500A28,#720C36)",label:"पद ६",text:"तुम बिन यज्ञ न होते, वस्त्र न कोई पाता।\nखान पान का वैभव, सब तुमसे आता॥",c:"#EC4899"},
     {bg:"linear-gradient(135deg,#3C0618,#580A22)",label:"पद ७",text:"शुभ गुण मंदिर सुंदर, क्षीरोदधि जाता।\nरत्न चतुर्दश तुम बिन, कोई नहीं पाता॥",c:"#DB2777"},
     {bg:"linear-gradient(135deg,#4A0820,#680A2C)",label:"पद ८",text:"महालक्ष्मीजी की आरती, जो कोई नर गाता।\nउर आनंद समाता, पाप उतर जाता॥",c:"#F472B6"},
     {label:"आरती समापन",text:"ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता।\nतुमको निसदिन सेवत, हरि विष्णु विधाता॥",c:"#EC4899"},
   ]},
  {id:6,short:"Sat",full:"Saturday",deity:"Shani Dev",icon:"⚫",name:"श्री शनि देव आरती",sub:"शनि उपासना · शनिवार",
   color:"#64748B",bg:"linear-gradient(170deg,#F8FAFC 0%,#F1F5F9 55%,#E2E8F0 100%)",
   heroBg:"linear-gradient(135deg,#0F172A,#1E293B,#334155)",glow:"rgba(100,116,139,.18)",
   image:"/shani.png",floatIcon:"⚖️",
   tathastuBg:"linear-gradient(145deg,#060810,#0E1220)",
   tathastu2:"linear-gradient(135deg,#0A0C18,#141828)",
   tathastuMsg:"हे भक्त, तुम्हारी प्रार्थना\nस्वीकार हुई।\nशनि देव का न्याय\nतुम्हारे साथ है।",
   tathastuSender:"— शनि देव",
   tathastuColor:"#94A3B8",tathastuGlow:"rgba(148,163,184,.3)",darkText:"#0F172A",
   verses:[
     {bg:"linear-gradient(135deg,#060810,#0E1628)",label:"आरती प्रारम्भ",text:"जय जय श्री शनिदेव भक्तन हितकारी।\nसूरज के पुत्र प्रभु छाया महतारी॥",c:"#64748B"},
     {bg:"linear-gradient(135deg,#0C1220,#182034)",label:"पद २",text:"श्याम अंग वक्र दृष्टि चतुर्भुजा धारी।\nनीलाम्बर धार नाथ गज की असवारी॥",c:"#94A3B8"},
     {bg:"linear-gradient(135deg,#080C18,#101C2E)",label:"पद ३",text:"क्रीट मुकुट शीश राजित दिपत है लिलारी।\nमुक्तन की माला गले शोभित बलिहारी॥",c:"#64748B"},
     {bg:"linear-gradient(135deg,#0E1428,#1A2238)",label:"पद ४",text:"मोदक मिष्ठान पान चढ़त हैं सुपारी।\nलोहा तिल तेल उड़द महिषी अति प्यारी॥",c:"#475569"},
     {bg:"linear-gradient(135deg,#0A1020,#16202E)",label:"पद ५",text:"देव दनुज ऋषि मुनि सुमिरत नर नारी।\nविश्वनाथ धरत ध्यान शरण हैं तुम्हारी॥",c:"#94A3B8"},
     {bg:"linear-gradient(135deg,#060810,#0E1628)",label:"आरती समापन",text:"जय जय श्री शनिदेव भक्तन हितकारी।\nसूरज के पुत्र प्रभु छाया महतारी॥",c:"#64748B"},
   ]},
];

function Prarthana({onNav,tasksDone={shlok:false,aarti:false},setTasksDone,setKarma,setBhaktDays,userName=""}){
  const todayIdx=new Date().getDay();
  const [sel,setSel]=useState(todayIdx);
  const [tathastu,setTathastu]=useState(false);
  const [toast,setToast]=useState("");
  const day=FULL_DAYS[sel];
  const pick=(i)=>{setSel(i);};
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
            <button key={i} onClick={()=>isToday&&pick(i)} style={{flex:1,padding:"8px 0 7px",borderRadius:16,border:"none",cursor:isToday?"pointer":"default",display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"all .25s cubic-bezier(.16,1,.3,1)",background:on?`linear-gradient(140deg,${d.color},${d.color}CC)`:"transparent",boxShadow:on?`0 4px 16px ${d.color}44`:"none",position:"relative",opacity:isToday?1:.35,pointerEvents:isToday?"auto":"none"}}>
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
        {/* Instruction card */}
        <div style={{margin:"14px 16px 0",background:"rgba(255,255,255,.55)",backdropFilter:"blur(12px)",borderRadius:20,padding:"18px 20px",border:`1px solid ${day.color}22`,boxShadow:`0 3px 14px ${day.color}12`}}>
          <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:14,fontWeight:800,letterSpacing:.5,color:`${day.color}99`,marginBottom:10}}>🙏 आरती विधि</div>
          <p style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:16,fontWeight:500,color:day.darkText||"#2D1200",lineHeight:1.9,margin:0}}>शांत मन से बैठें, आँखें बंद करें। एक बार अपनी मधुर वाणी से श्रद्धापूर्वक इस आरती का उच्चारण करें। आरती पूर्ण होने पर ✓ दबाएं।</p>
        </div>
        {/* Section label */}
        <div style={{padding:"14px 22px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:800,letterSpacing:3,textTransform:"uppercase",color:`${day.color}99`}}>🙏 आरती के पद</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:10,fontWeight:600,color:`${day.color}66`}}>{day.verses.length} पद</div>
        </div>
        {/* Verse cards */}
        <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:10}}>
          {day.verses.map((v,i)=>{const isFirst=v.label==="आरती प्रारम्भ";const isLast=v.label==="आरती समापन";return(
            <div key={`${sel}-${i}`} style={{borderRadius:22,padding:"18px 18px 18px 20px",background:`${v.c}15`,border:`1.5px solid ${v.c}35`,position:"relative",overflow:"hidden",boxShadow:`0 6px 20px ${v.c}33`,animation:`fadeUp .35s ${i*.04+.05}s ease both`}}>
              {/* subtle top shimmer line */}
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)`,borderRadius:"22px 22px 0 0"}}/>
              {/* inner glow */}
              <div style={{position:"absolute",top:-30,right:-20,width:120,height:120,background:`radial-gradient(circle,${v.c}22 0%,transparent 70%)`,pointerEvents:"none"}}/>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:8,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:day.darkText||v.c,opacity:.7,marginBottom:10}}>{v.label}</div>
              <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontWeight:700,lineHeight:2}}>
                {v.text.split("\n").map((line,li,arr)=>(
                  <div key={li} style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"clip",fontSize:"clamp(15px,5.2vw,21px)",color:day.darkText||v.c}}>
                    {line}
                    {li<arr.length-1&&(
                      <div style={{display:"flex",alignItems:"center",gap:6,margin:"6px 0"}}>
                        <span style={{fontSize:10,color:day.darkText||v.c,opacity:.6,flexShrink:0}}>◆</span>
                        <div style={{flex:1,height:1,background:`linear-gradient(90deg,${day.darkText||v.c}44,${day.darkText||v.c}22,${day.darkText||v.c}44)`}}/>
                        <span style={{fontSize:10,color:day.darkText||v.c,opacity:.6,flexShrink:0}}>◆</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );})}
        </div>
        {/* Today's Aarti card */}
        <div style={{padding:"16px 16px 0"}}>
          <div style={{background:"white",borderRadius:22,overflow:"hidden",boxShadow:"0 3px 14px rgba(109,40,217,.08)",border:"1.5px solid rgba(139,92,246,.15)"}}>
            <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,background:"#FFF0E8",border:`1.5px solid ${day.color}33`}}>{day.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"#5A3A18"}}>Today's Aarti</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:10,fontStyle:"italic",color:"#B0977A",marginTop:2}}>{day.deity} · {day.name}</div>
                <div style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:4,background:`${day.color}18`,border:`1px solid ${day.color}33`,borderRadius:10,padding:"2px 8px"}}>
                  <span style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:10,fontWeight:600,color:day.color}}>{day.hi||day.sub}</span>
                </div>
              </div>
              <button onClick={completeAarti} disabled={tasksDone.aarti}
                style={{width:38,height:38,borderRadius:"50%",flexShrink:0,border:"none",cursor:tasksDone.aarti?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                  background:tasksDone.aarti?"linear-gradient(135deg,#FFD700,#FF8C00)":"white",
                  boxShadow:tasksDone.aarti?"0 4px 14px rgba(255,180,0,.45)":"inset 0 0 0 2.5px rgba(200,140,40,.3)",
                  transition:"all .3s"}}>
                {tasksDone.aarti
                  ?<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  :<div style={{width:14,height:14,borderRadius:"50%",border:"2.5px solid rgba(200,140,40,.35)"}}/>
                }
              </button>
            </div>
            <div style={{height:3,background:`${day.color}12`}}>
              <div style={{height:"100%",width:tasksDone.aarti?"100%":"0%",background:`linear-gradient(90deg,${day.color},${day.color}88)`,transition:"width .8s ease"}}/>
            </div>
            <div style={{padding:"6px 16px 10px"}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:tasksDone.aarti?"#C47010":"rgba(196,160,64,.5)"}}>
                {tasksDone.aarti?"✓ +30 XP EARNED":"Tap ✓ to complete · +30 XP"}
              </span>
            </div>
          </div>
        </div>

        {/* ── TATHASTU CARD — locked until aarti complete ── */}
        <div style={{padding:"10px 16px 0"}}>
          <div
            style={{
              borderRadius:24,overflow:"hidden",
              border:tasksDone.aarti?`1.5px solid ${day.tathastuColor||"#8B5CF6"}44`:"1.5px solid rgba(255,255,255,.08)",
              boxShadow:tasksDone.aarti?`0 8px 32px ${day.tathastuGlow||"rgba(139,92,246,.18)"}`:"none",
              opacity:tasksDone.aarti?1:0.45,
              cursor:"default",
              transition:"all .5s ease",
              background:day.tathastuBg||"linear-gradient(135deg,#1A0A30,#2D1560)",
              position:"relative",
            }}>
            {/* Shimmer on activate */}
            {tasksDone.aarti&&<div style={{position:"absolute",top:0,left:"-80%",width:"50%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent)",animation:"shimmer 3s ease-in-out infinite",pointerEvents:"none"}}/>}
            {/* Top rainbow bar */}
            <div style={{height:3,background:tasksDone.aarti?`linear-gradient(90deg,${day.tathastuColor||"#8B5CF6"},rgba(255,255,255,.5),${day.tathastuColor||"#8B5CF6"})`:"rgba(255,255,255,.08)",backgroundSize:"200% 100%",animation:tasksDone.aarti?"gradShift 3s linear infinite":"none"}}/>

            {/* Locked state — show blurred deity image with lock */}
            {!tasksDone.aarti&&(
              <div style={{padding:"16px 16px",display:"flex",alignItems:"center",gap:14}}>
                {/* Blurred deity image preview */}
                {day.image&&(
                  <div style={{width:64,height:64,borderRadius:16,overflow:"hidden",flexShrink:0,position:"relative",border:"1px solid rgba(255,255,255,.1)"}}>
                    <img src={day.image} alt={day.deity} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",filter:"blur(4px) brightness(.5)",transform:"scale(1.1)"}}/>
                    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🔒</div>
                  </div>
                )}
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:20,fontWeight:700,color:"rgba(255,255,255,.22)",letterSpacing:3}}>तथास्तु</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,.15)",marginTop:4}}>Complete today's aarti to unlock</div>
                </div>
              </div>
            )}



            {/* Unlocked — auto expanded when aarti done */}
            {tasksDone.aarti&&(
              <div style={{padding:"24px 18px 28px",display:"flex",flexDirection:"column",alignItems:"center"}}>

                {/* Floating deity icon */}
                <div style={{fontSize:50,animation:"floatUp 3s ease-in-out infinite",filter:`drop-shadow(0 6px 18px ${day.tathastuGlow||"rgba(255,200,80,.6)"})`,marginBottom:10}}>{day.icon}</div>

                {/* TATHASTU */}
                <div style={{fontFamily:"'Cinzel',serif",fontSize:42,fontWeight:700,color:day.tathastuColor||"#FFD700",letterSpacing:4,lineHeight:1.2,marginBottom:5,textShadow:`0 0 40px ${day.tathastuGlow||"rgba(255,200,80,.5)"}`,textAlign:"center"}}>तथास्तु</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:15,color:"rgba(255,255,255,.4)",letterSpacing:3,marginBottom:22}}>So it shall be</div>

                {/* Divider */}
                <div style={{width:60,height:1,background:`linear-gradient(90deg,transparent,${day.tathastuColor||"#FFD700"}55,transparent)`,marginBottom:22}}/>

                {/* Image — square with curved borders, inner card feel */}
                {day.image&&(
                  <div style={{
                    width:"100%",
                    background:day.tathastu2||"rgba(255,255,255,.06)",
                    borderRadius:24,
                    padding:12,
                    border:`1px solid ${day.tathastuColor||"#FFD700"}22`,
                    boxShadow:`0 8px 32px ${day.tathastuGlow||"rgba(255,200,80,.2)"},inset 0 1px 0 rgba(255,255,255,.06)`,
                    marginBottom:18,
                    position:"relative",
                    overflow:"hidden",
                  }}>
                    {/* Inner card glow */}
                    <div style={{position:"absolute",top:-40,left:"50%",transform:"translateX(-50%)",width:200,height:200,background:`radial-gradient(circle,${day.tathastuGlow||"rgba(255,200,80,.15)"} 0%,transparent 70%)`,pointerEvents:"none"}}/>
                    <div style={{
                      borderRadius:16,
                      overflow:"hidden",
                      width:"100%",
                      aspectRatio:"1/1",
                      position:"relative",
                      boxShadow:`0 4px 20px ${day.tathastuGlow||"rgba(255,200,80,.25)"}`,
                    }}>
                      <img src={day.image} alt={day.deity} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block"}}/>
                    </div>
                    {/* Deity name below image inside card */}
                    <div style={{textAlign:"center",marginTop:10,marginBottom:2}}>
                      <div style={{fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:700,color:day.tathastuColor||"#FFD700",letterSpacing:2}}>{day.deity}</div>
                    </div>
                  </div>
                )}

                {/* Message box */}
                <div style={{width:"100%",background:"rgba(255,255,255,.06)",borderRadius:20,padding:"18px",border:`1px solid ${day.tathastuColor||"#FFD700"}22`,marginBottom:16}}>
                  <div style={{fontFamily:"'Noto Sans Devanagari',serif",textAlign:"center",lineHeight:2}}>
                    {(day.tathastuMsg||"तुम्हारी प्रार्थना स्वीकार हुई।\nदेव का आशीर्वाद तुम्हारे साथ है।").split("\n").map((line,i)=>(
                      <div key={i} style={{fontSize:"clamp(15px,5.2vw,21px)",fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"clip",
                        color:i%2===0?"rgba(255,255,255,.95)":"rgba(255,230,180,.8)"}}>
                        {line}
                      </div>
                    ))}
                  </div>
                  <div style={{height:1,background:`linear-gradient(90deg,transparent,${day.tathastuColor||"#FFD700"}33,transparent)`,margin:"14px 0"}}/>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"rgba(255,255,255,.3)",letterSpacing:1}}>{day.tathastuSender||`— ${day.deity}`}</div>
                    <div style={{display:"inline-flex",alignItems:"center",gap:4,background:`${day.tathastuColor||"#FFD700"}18`,border:`1px solid ${day.tathastuColor||"#FFD700"}33`,borderRadius:20,padding:"3px 10px"}}>
                      <span style={{fontSize:11}}>✨</span>
                      <span style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,color:day.tathastuColor||"#FFD700"}}>+30 Karma</span>
                    </div>
                  </div>
                </div>


              </div>
            )}
          </div>
        </div>
        <div style={{height:24}}/>
      </div>

      <BNav active="prarthana" onNav={onNav} dark={false}/>
    </div>
  );
}

/* ── SADHANA ── */
function Sadhana({onNav,karma,setKarma,user,onGoLogin,tapasyaDays=0,setTapasyaDays,shlokaCount=0,setShlokaCount,bhaktDays=0,setBhaktDays,tasksDone={shlok:false,aarti:false,mantra:false},setTasksDone,setMantaDone,userName="",completedDates=[],addCompletedDate}){
  const today=new Date().getDay();
  const todayPrayer=PRAYERS[today]||PRAYERS[2];

  const TASK_DEFS=[
    {id:"shlok",icon:"🌅",bg:"#FFF3E0",title:"Morning Shlok",sub:"Aaj Ka Gyan",detail:"",xp:50},
    {id:"aarti",icon:"🪔",bg:"#FFF0E8",title:"Today's Aarti",sub:`${todayPrayer.deity} · ${todayPrayer.hi}`,detail:todayPrayer.name,xp:30,accentColor:todayPrayer.color},
    {id:"mantra",icon:"📿",bg:"#F5F0FF",title:"Mantra Japa",sub:"Anushthan · महामृत्युञ्जय मंत्र",detail:"ॐ त्र्यम्बकं यजामहे...",xp:20,accentColor:"#8B5CF6"},
  ];
  const tasks=TASK_DEFS.map(t=>({...t,done:!!tasksDone[t.id]}));

  // Real week tracking using actual completion dates
  const todayDate = new Date();
  const todayDayJS = todayDate.getDay(); // 0=Sun,1=Mon..6=Sat
  const todayDotIdx = todayDayJS===0?6:todayDayJS-1; // Mon=0..Sun=6

  // Get Monday of current week
  const getMondayOfWeek = (d) => {
    const day = d.getDay();
    const diff = (day===0?-6:1-day);
    const monday = new Date(d);
    monday.setDate(d.getDate()+diff);
    return monday;
  };
  const monday = getMondayOfWeek(todayDate);

  // Build 7 day slots Mon-Sun with their date strings
  const weekDates = Array.from({length:7},(_,i)=>{
    const d = new Date(monday);
    d.setDate(monday.getDate()+i);
    return d.toISOString().split("T")[0];
  });

  const todayStr = todayDate.toISOString().split("T")[0];
  const todayAllDone = tasksDone.shlok && tasksDone.aarti && tasksDone.mantra;

  const days=[{l:"Mon"},{l:"Tue"},{l:"Wed"},{l:"Thu"},{l:"Fri"},{l:"Sat"},{l:"Sun"}].map((d,i)=>{
    const dateStr = weekDates[i];
    const isPast = dateStr < todayStr;
    const isToday = dateStr === todayStr;
    const isCompleted = completedDates.includes(dateStr) || (isToday && todayAllDone);
    if(isCompleted) return {...d,s:"done"};
    if(isToday) return {...d,s:"today"};
    if(isPast) return {...d,s:"missed"};
    return {...d,s:"up"};
  });
  const earned=tasks.filter(t=>t.done).reduce((a,t)=>a+t.xp,0);
  const [toast,setToast]=useState("");
  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(""),2800);};

  const toggleTask=(id)=>{
    if(tasksDone[id]) return; // irreversible
    const nextDone={...tasksDone,[id]:true};
    setTasksDone(nextDone);
    const taskXp=TASK_DEFS.find(t=>t.id===id)?.xp||0;
    setKarma(k=>k+taskXp);
    if(id==="shlok"&&setShlokaCount) setShlokaCount(c=>c+1);
    if(id==="mantra"&&setMantaDone) setMantaDone(true);
    const allDone=TASK_DEFS.every(t=>nextDone[t.id]);
    const wasDone=TASK_DEFS.every(t=>tasksDone[t.id]);
    if(allDone&&!wasDone){
      if(setTapasyaDays) setTapasyaDays(d=>d+1);
      if(setBhaktDays) setBhaktDays(d=>d+1);
      if(addCompletedDate) addCompletedDate(new Date().toISOString().split("T")[0]);
      showToast("🎉 Sadhana Complete! +15 Streak");
    }
    if(!user) showToast("🔐 Sign in to save your progress!");
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

        {/* ── KARMA CARD — starts at 0 ── */}
        <div style={{margin:"14px 18px 0",background:"linear-gradient(135deg,#3D2000,#5C3200)",borderRadius:26,padding:"20px 22px",position:"relative",overflow:"hidden",boxShadow:"0 12px 36px rgba(93,50,0,.3)"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#FFD700,#FF8C00,#FFD700)",borderRadius:"26px 26px 0 0"}}/>
          <div style={{position:"absolute",right:18,top:"50%",transform:"translateY(-50%)",fontSize:56,opacity:.14}}>🏆</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",color:"rgba(255,210,120,.6)"}}>Today's Karma Points</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:46,fontWeight:800,color:"#FFD700",lineHeight:1.05,margin:"5px 0 3px",letterSpacing:-1}}>{earned}</div>
          {(()=>{
            const pct=Math.min(Math.round((earned/100)*100),100);
            return(<>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:10,fontStyle:"italic",color:"rgba(255,210,120,.55)"}}>
                {earned===0?"Complete today's sadhana to earn Karma Points":earned>=(50+30+20)?"Today's sadhana complete! 🎉":`${(50+30+20)-earned} points to today's sadhana`}
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
                ?{background:"linear-gradient(135deg,#22C55E,#16A34A)",boxShadow:"0 3px 10px rgba(34,197,94,.4)",color:"white",fontSize:16}
                :d.s==="today"
                ?{background:"linear-gradient(135deg,#FF6B00,#CC4400)",boxShadow:"0 3px 14px rgba(255,100,0,.5)",color:"white",fontSize:14,animation:"todayPulse 2s ease-in-out infinite"}
                :d.s==="missed"
                ?{background:"rgba(220,50,50,.08)",border:"1.5px solid rgba(220,50,50,.25)",color:"rgba(200,50,50,.6)",fontSize:14}
                :{background:"rgba(93,50,0,.04)",border:"1.5px dashed rgba(180,120,30,.15)",color:"rgba(180,120,30,.2)",fontSize:10};
              return(
                <div key={d.l} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{width:34,height:34,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:700,...c}}>
                    {d.s==="done"?"✓":d.s==="today"?"🔥":d.s==="missed"?"✗":"·"}
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
                      {t.id!=="aarti"&&t.detail&&(
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

        {/* ── KRISHNA COMPLETION CARD ── */}
        {tasks.every(t=>t.done)&&(
          <div style={{margin:"14px 16px 0",borderRadius:28,overflow:"hidden",boxShadow:"0 20px 60px rgba(180,80,0,.2)",animation:"fadeUp .6s ease both",position:"relative",border:"1.5px solid rgba(255,200,80,.2)"}}>
            {/* Top shimmer bar */}
            <div style={{height:3,background:"linear-gradient(90deg,#FFD700,#FF8C00,#FF4500,#FF8C00,#FFD700)",backgroundSize:"200% 100%",animation:"gradShift 3s linear infinite"}}/>

            {/* Image — full width */}
            <div style={{position:"relative",width:"100%",background:"linear-gradient(135deg,#FFF8EE,#FFF0D6)"}}>
              <img src="/krishna-bhakt.jpg" alt="Krishna" style={{width:"100%",display:"block",objectFit:"cover"}}/>
              {/* Gradient fade at bottom of image */}
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:"40%",background:"linear-gradient(180deg,transparent,rgba(30,10,0,.85))"}}/>
            </div>

            {/* Text section */}
            <div style={{background:"linear-gradient(135deg,#1A0800,#2C1200)",padding:"22px 20px 26px",position:"relative",overflow:"hidden"}}>
              {/* Ambient glow */}
              <div style={{position:"absolute",top:-40,left:"50%",transform:"translateX(-50%)",width:200,height:200,background:"radial-gradient(circle,rgba(255,140,0,.12) 0%,transparent 70%)",pointerEvents:"none"}}/>
              {/* OM watermark */}
              <div style={{position:"absolute",right:-10,bottom:-20,fontFamily:"'Noto Sans Devanagari',serif",fontSize:120,color:"rgba(255,150,30,.06)",lineHeight:1,pointerEvents:"none"}}>ॐ</div>

              {/* Sadhana complete badge */}
              <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
                <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,215,0,.12)",border:"1px solid rgba(255,215,0,.25)",borderRadius:20,padding:"6px 16px"}}>
                  <span style={{fontSize:14}}>🎉</span>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:10,fontWeight:800,letterSpacing:2,textTransform:"uppercase",color:"#FFD700"}}>Sadhana Complete · +{earned} Karma</span>
                </div>
              </div>

              {/* Divider */}
              <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(255,180,60,.3),transparent)",marginBottom:20}}/>

              {/* Main poem lines */}
              <div style={{fontFamily:"'Noto Sans Devanagari',serif",textAlign:"center",lineHeight:2}}>
                {[
                  {text:"तू ही मेरा घर,",color:"#FFE4A0"},
                  {text:"तेरा नाम ही मेरी सांस,",color:"rgba(255,220,140,.85)"},
                  {text:"तू ही मेरा प्रिय,",color:"#FFE4A0"},
                  {text:"तू ही मेरा हृदय।",color:"rgba(255,220,140,.85)"},
                ].map((l,i)=>(
                  <div key={i} style={{fontSize:"clamp(15px,5.2vw,21px)",fontWeight:700,color:l.color,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"clip"}}>{l.text}</div>
                ))}

                {/* Spacer */}
                <div style={{height:14}}/>

                {/* Closing card — from user */}
                <div style={{background:"rgba(255,200,60,.08)",border:"1px solid rgba(255,200,60,.18)",borderRadius:16,padding:"14px 16px",margin:"0 4px"}}>
                  <div style={{fontSize:"clamp(15px,5.2vw,21px)",fontWeight:700,color:"rgba(255,230,160,.9)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"clip"}}>क्योंकि तू ही मेरा</div>
                  <div style={{fontSize:"clamp(15px,5.2vw,21px)",fontWeight:700,color:"#FFD700",textShadow:"0 2px 16px rgba(255,180,30,.4)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"clip"}}>सबसे प्यारा सखा।</div>
                </div>
              </div>

              {/* Attribution — from user */}
              <div style={{display:"flex",justifyContent:"center",marginTop:16}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,color:"rgba(255,180,60,.55)",letterSpacing:1}}>— {userName||"Your Sadhak"}</div>
              </div>
            </div>
          </div>
        )}

        <div style={{height:16}}/>
      </div>
      <BNav active="sadhana" onNav={onNav}/>
    </div>
  );
}

/* ── ANUSHTHAN ── */
function Anushthan({onNav,karma,setKarma,mantaDays=0,setMantaDays,user,mantaDone=false,setMantaDone,tasksDone={shlok:false,aarti:false,mantra:false},setTasksDone}){
  const [toast,setToast]=useState("");
  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(""),2800);};
  const daysDone=mantaDays;

  const toggleMantra=()=>{
    if(mantaDone) return;
    if(setMantaDone)setMantaDone(true);
    if(setMantaDays)setMantaDays(d=>d+1);
    if(setKarma)setKarma(k=>k+20);
    if(setTasksDone)setTasksDone({...tasksDone,mantra:true});
    showToast("✅ Day "+(mantaDays+1)+" complete! +20 Karma");
    if(!user) showToast("🔐 Sign in to save your progress!");
  };

  const pct=Math.round((daysDone/108)*100);

  const comingSoon=[
    {n:"60-Day Gita Journey",     h:"गीता ज्ञान साधना",    ico:"🪷",c:"#F97316"},
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

        {/* ── 108-DAY MANTRA DISCIPLINE — outside heading ── */}
        <div style={{padding:"16px 20px 0"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"rgba(167,139,250,.5)",marginBottom:6}}>🔥 Active Journey</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:26,fontWeight:800,color:"#F0E6FF",letterSpacing:.5,lineHeight:1.1}}>108-Day Mantra<br/>Discipline</div>
          <div style={{height:3,width:60,background:"linear-gradient(90deg,#7C3AED,transparent)",borderRadius:4,marginTop:8}}/>
        </div>

        {/* ── HOW TO CHANT — above mantra card ── */}
        <div style={{margin:"14px 16px 0",background:"rgba(255,255,255,.04)",borderRadius:20,padding:"18px 20px",border:"1px solid rgba(167,139,250,.15)"}}>
          <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:14,fontWeight:800,letterSpacing:.5,color:"rgba(167,139,250,.8)",marginBottom:10}}>⚡ मंत्र साधना</div>
          <p style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:16,fontWeight:500,color:"rgba(220,200,255,.85)",lineHeight:1.9,margin:0}}>शांत मन से बैठें, आँखें बंद करें। एक बार पूरे भाव से महामृत्युञ्जय मंत्र का जाप करें। मंत्र पूर्ण होने पर ✓ दबाएं।</p>
        </div>

        {/* ── MAIN MANTRA CARD ── */}
        <div style={{margin:"10px 16px 0",background:"linear-gradient(135deg,#1A0E30,#261545)",borderRadius:26,padding:"20px",position:"relative",overflow:"hidden",boxShadow:"0 14px 44px rgba(15,8,60,.5)",border:"1px solid rgba(139,92,246,.28)"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#7C3AED,#60A5FA,#A78BFA,#7C3AED)",backgroundSize:"200% 100%",animation:"gradShift 4s linear infinite",borderRadius:"26px 26px 0 0"}}/>
          <div style={{position:"absolute",right:-8,bottom:-18,fontFamily:"'Noto Sans Devanagari',serif",fontSize:120,color:"rgba(167,139,250,.06)",lineHeight:1,pointerEvents:"none"}}>ॐ</div>


          {/* ── BACKGROUND ELEMENTS ── */}

          {/* Large damru — left background */}
          <div style={{position:"absolute",left:-14,top:"50%",transform:"translateY(-50%) rotate(-15deg)",opacity:.07,pointerEvents:"none",zIndex:0}}>
            <svg width="80" height="100" viewBox="0 0 80 100" fill="none">
              <polygon points="10,8 70,8 40,50" fill="#C4B5FD"/>
              <polygon points="10,92 70,92 40,50" fill="#C4B5FD"/>
              <rect x="36" y="8" width="8" height="84" rx="4" fill="#A78BFA"/>
              <circle cx="4" cy="50" r="7" fill="#fef08a"/>
              <circle cx="76" cy="50" r="7" fill="#fef08a"/>
              <line x1="4" y1="50" x2="20" y2="42" stroke="#fef08a" strokeWidth="2.5"/>
              <line x1="76" y1="50" x2="60" y2="42" stroke="#fef08a" strokeWidth="2.5"/>
            </svg>
          </div>

          {/* Small damru — top right */}
          <div style={{position:"absolute",top:10,right:14,opacity:.08,pointerEvents:"none",zIndex:0,transform:"rotate(10deg)"}}>
            <svg width="44" height="50" viewBox="0 0 80 100" fill="none">
              <polygon points="10,8 70,8 40,50" fill="#E8D5FF"/>
              <polygon points="10,92 70,92 40,50" fill="#E8D5FF"/>
              <rect x="36" y="8" width="8" height="84" rx="4" fill="#C4B5FD"/>
              <circle cx="4" cy="50" r="7" fill="#fef08a"/>
              <circle cx="76" cy="50" r="7" fill="#fef08a"/>
            </svg>
          </div>

          {/* Starry glow dots scattered */}
          <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
            <svg width="100%" height="100%" viewBox="0 0 340 320" preserveAspectRatio="xMidYMid slice" fill="none">
              {/* Gold stars */}
              <circle cx="30"  cy="30"  r="1.5" fill="#fef08a" opacity=".55"/><circle cx="30"  cy="30"  r="6"   fill="#fef08a" opacity=".07"/>
              <circle cx="310" cy="25"  r="1.5" fill="#fef08a" opacity=".5"/> <circle cx="310" cy="25"  r="7"   fill="#fef08a" opacity=".06"/>
              <circle cx="290" cy="180" r="1.5" fill="#fef08a" opacity=".5"/> <circle cx="290" cy="180" r="5"   fill="#fef08a" opacity=".07"/>
              <circle cx="320" cy="280" r="1.5" fill="#fef08a" opacity=".45"/><circle cx="320" cy="280" r="6"   fill="#fef08a" opacity=".06"/>
              <circle cx="140" cy="60"  r="1.2" fill="#fef08a" opacity=".4"/> <circle cx="140" cy="60"  r="4"   fill="#fef08a" opacity=".06"/>
              <circle cx="230" cy="100" r="1"   fill="#fef08a" opacity=".4"/>
              <circle cx="50"  cy="140" r="1.2" fill="#fef08a" opacity=".4"/> <circle cx="50"  cy="140" r="4"   fill="#fef08a" opacity=".05"/>
              <circle cx="190" cy="240" r="1.5" fill="#fef08a" opacity=".45"/><circle cx="190" cy="240" r="5"   fill="#fef08a" opacity=".06"/>
              {/* White stars */}
              <circle cx="160" cy="18"  r="1.2" fill="white"   opacity=".55"/><circle cx="160" cy="18"  r="5"   fill="white"   opacity=".06"/>
              <circle cx="200" cy="290" r="1.5" fill="white"   opacity=".45"/><circle cx="200" cy="290" r="6"   fill="white"   opacity=".05"/>
              <circle cx="270" cy="70"  r="1"   fill="white"   opacity=".45"/>
              <circle cx="80"  cy="80"  r="1"   fill="white"   opacity=".4"/>
              <circle cx="330" cy="150" r="1.2" fill="white"   opacity=".4"/>
              <circle cx="110" cy="300" r="1"   fill="white"   opacity=".4"/>
              {/* Purple stars */}
              <circle cx="60"  cy="200" r="1.5" fill="#C4B5FD" opacity=".55"/><circle cx="60"  cy="200" r="6"   fill="#C4B5FD" opacity=".07"/>
              <circle cx="100" cy="260" r="1.2" fill="#C4B5FD" opacity=".5"/> <circle cx="100" cy="260" r="4"   fill="#C4B5FD" opacity=".06"/>
              <circle cx="240" cy="40"  r="1"   fill="#C4B5FD" opacity=".45"/>
              <circle cx="20"  cy="280" r="1.2" fill="#C4B5FD" opacity=".4"/>
              <circle cx="170" cy="150" r="1"   fill="#C4B5FD" opacity=".35"/>
              {/* 4-point star shapes */}
              <path d="M260 60 L262 55 L264 60 L269 62 L264 64 L262 69 L260 64 L255 62 Z" fill="#fef08a" opacity=".2"/>
              <path d="M80  120 L81.5 116 L83 120 L87 121.5 L83 123 L81.5 127 L80 123 L76 121.5 Z" fill="#C4B5FD" opacity=".22"/>
              <path d="M300 130 L302 126 L304 130 L308 131.5 L304 133 L302 137 L300 133 L296 131.5 Z" fill="white" opacity=".17"/>
              <path d="M180 280 L181.5 276 L183 280 L187 281.5 L183 283 L181.5 287 L180 283 L176 281.5 Z" fill="#fef08a" opacity=".18"/>
              <path d="M40  60  L41.5 56 L43 60 L47 61.5 L43 63 L41.5 67 L40 63 L36 61.5 Z" fill="white" opacity=".15"/>
              <path d="M320 210 L321.5 206 L323 210 L327 211.5 L323 213 L321.5 217 L320 213 L316 211.5 Z" fill="#C4B5FD" opacity=".18"/>
            </svg>
          </div>

          {/* ── CONTENT (above backgrounds) ── */}
          <div style={{position:"relative",zIndex:1}}>
            {/* Heading */}
            <div style={{textAlign:"center",marginBottom:0}}>
              <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:30,fontWeight:800,color:"#fef08a",lineHeight:1.2,textShadow:"0 0 20px rgba(250,204,21,.25)"}}>महामृत्युञ्जय मंत्र</div>

              {/* Separator with circles */}
              <div style={{display:"flex",alignItems:"center",gap:8,margin:"10px 16px"}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:"rgba(167,139,250,.6)",flexShrink:0}}/>
                <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(167,139,250,.3),rgba(250,204,21,.5),rgba(167,139,250,.3))"}}/>
                <div style={{width:7,height:7,borderRadius:"50%",background:"rgba(167,139,250,.6)",flexShrink:0}}/>
              </div>

              <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:14,fontWeight:700,color:"rgba(255,255,255,.85)"}}>प्रतिदिन एक जाप</div>
            </div>

            {/* Mantra text with top/bottom lines + damru icon */}
            <div style={{background:"rgba(255,255,255,.05)",borderRadius:18,padding:"18px 16px",border:"1px solid rgba(167,139,250,.2)",textAlign:"center",margin:"16px 0 14px"}}>
              {/* Top line with damru */}
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <div style={{flex:1,height:1,background:"linear-gradient(90deg,transparent,rgba(250,204,21,.4))"}}/>
                <svg width="22" height="18" viewBox="0 0 44 36" fill="none">
                  <polygon points="4,2 40,2 22,18" fill="#C4B5FD" opacity=".9"/>
                  <polygon points="4,34 40,34 22,18" fill="#C4B5FD" opacity=".9"/>
                  <rect x="20" y="2" width="4" height="32" rx="2" fill="#A78BFA"/>
                  <circle cx="2" cy="18" r="4" fill="#fef08a" opacity=".9"/>
                  <circle cx="42" cy="18" r="4" fill="#fef08a" opacity=".9"/>
                </svg>
                <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(250,204,21,.4),transparent)"}}/>
              </div>

              <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontWeight:700,color:"#E8D5FF",lineHeight:2}}>
                {["ॐ त्र्यम्बकं यजामहे","सुगन्धिं पुष्टिवर्धनम्।","उर्वारुकमिव बन्धनान्","मृत्योर्मुक्षीय माऽमृतात्॥"].map((line,i)=>(
                  <div key={i} style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"clip",fontSize:"clamp(15px,5.2vw,21px)"}}>{line}</div>
                ))}
              </div>

              {/* Bottom line with damru */}
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:14}}>
                <div style={{flex:1,height:1,background:"linear-gradient(90deg,transparent,rgba(250,204,21,.4))"}}/>
                <svg width="22" height="18" viewBox="0 0 44 36" fill="none">
                  <polygon points="4,2 40,2 22,18" fill="#C4B5FD" opacity=".9"/>
                  <polygon points="4,34 40,34 22,18" fill="#C4B5FD" opacity=".9"/>
                  <rect x="20" y="2" width="4" height="32" rx="2" fill="#A78BFA"/>
                  <circle cx="2" cy="18" r="4" fill="#fef08a" opacity=".9"/>
                  <circle cx="42" cy="18" r="4" fill="#fef08a" opacity=".9"/>
                </svg>
                <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(250,204,21,.4),transparent)"}}/>
              </div>
            </div>
          </div>

          {/* Progress + Stats */}
          <div style={{position:"relative",zIndex:1}}>
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
          </div>{/* end progress+stats zIndex div */}
        </div>{/* end main mantra card */}
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

        {/* ── SHIVA BLESSING CARD — shows after mantra done ── */}
        {(mantaDone||tasksDone.mantra)&&(
          <div style={{margin:"14px 16px 0",borderRadius:26,overflow:"hidden",boxShadow:"0 16px 48px rgba(96,165,250,.25)",border:"1px solid rgba(167,139,250,.3)",animation:"fadeUp .6s ease both",position:"relative"}}>
            <div style={{height:3,background:"linear-gradient(90deg,#7C3AED,#60A5FA,#A78BFA,#7C3AED)",backgroundSize:"200% 100%",animation:"gradShift 4s linear infinite"}}/>
            <div style={{position:"relative",width:"100%",aspectRatio:"1/1",overflow:"hidden"}}>
              <img src="/shiva-tathastu.png" alt="Bhagwaan Shiva" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block"}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 50%,rgba(10,5,30,.96) 100%)"}}/>
              <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"20px 20px 24px",textAlign:"center"}}>
                <div style={{fontFamily:"'Noto Sans Devanagari',serif",fontSize:22,fontWeight:700,color:"white",lineHeight:1.7,textShadow:"0 2px 16px rgba(96,165,250,.6)"}}>
                  मैं सदैव तुम्हारे साथ हूँ।
                </div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:11,fontWeight:600,color:"rgba(167,139,250,.8)",letterSpacing:2,marginTop:6}}>— Bhagwaan Shiva</div>
              </div>
            </div>
          </div>
        )}

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
  const [joinDate,setJoinDate]=useState(null);
  const [userName,setUserName]=useState("");
  const [tapasyaDays,setTapasyaDays]=useState(0);
  const [completedDates,setCompletedDates]=useState([]); // array of date strings like "2026-05-21"
  const [shlokaCount,setShlokaCount]=useState(0);
  const [mantaDays,setMantaDays]=useState(0);
  const [nightPrayerDays,setNightPrayerDays]=useState(0);
  const [bhaktDays,setBhaktDays]=useState(0);
  const [tasksDone,setTasksDone]=useState({shlok:false,aarti:false,mantra:false});
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
  const addCompletedDate = (dateStr) => {
    setCompletedDates(prev => {
      const next = prev.includes(dateStr) ? prev : [...prev, dateStr];
      if(user?.uid) persist(user.uid, {completedDates:next});
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
            if(data.completedDates){ setCompletedDates(data.completedDates); }
            if(data.shlokaCount !== undefined){ setShlokaCount(data.shlokaCount); }
            if(data.mantaDays !== undefined){ setMantaDays(data.mantaDays); }
            // Load or set joinDate
            if(data.joinDate){ setJoinDate(data.joinDate); }
            else { persist(firebaseUser.uid,{joinDate:today}); setJoinDate(today); }
            // Reset mantaDone if it's a new day
            if(data.mantaDoneDate === today && data.mantaDone){ setMantaDone(true); }
            else { setMantaDone(false); }
            if(data.bhaktDays !== undefined){ setBhaktDays(data.bhaktDays); }
            if(data.favorites){ setFavorites(data.favorites); }
            // Reset daily tasks if it's a new day
            if(data.lastTaskDate !== today){
              setTasksDone({shlok:false, aarti:false, mantra:false});
              setMantaDone(false);
              persist(firebaseUser.uid, {tasksDone:{shlok:false,aarti:false,mantra:false}, lastTaskDate:today, mantaDone:false, mantaDoneDate:today});
            } else if(data.tasksDone){
              setTasksDone(data.tasksDone);
            }
            // Go to home if they have a name, else name screen
            setScreen(data.userName ? "home" : "name");
          } else {
            // New user — save joinDate and go to name screen
            persist(firebaseUser.uid,{joinDate:today});
            setJoinDate(today);
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
    setCompletedDates([]);
    setBhaktDays(0);
    setTasksDone({shlok:false,aarti:false,mantra:false});
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
          {screen==="home"      &&<Home     onNav={setScreen} favorites={favorites} setFavorites={setFavorites} tasksDone={tasksDone} setTasksDone={setTasksDoneSave} setKarma={setKarmaSave} setShlokaCount={setShlokaCountSave} joinDate={joinDate}/>}
          {screen==="prarthana" &&<Prarthana onNav={setScreen} tasksDone={tasksDone} setTasksDone={setTasksDoneSave} setKarma={setKarmaSave} setBhaktDays={setBhaktDaysSave} userName={userName}/>}
          {screen==="sadhana"   &&<Sadhana  onNav={setScreen} karma={karma} setKarma={setKarmaSave} user={user} onGoLogin={()=>setScreen("login")}
            tapasyaDays={tapasyaDays} setTapasyaDays={setTapasyaDaysSave}
            shlokaCount={shlokaCount} setShlokaCount={setShlokaCountSave}
            bhaktDays={bhaktDays} setBhaktDays={setBhaktDaysSave}
            tasksDone={tasksDone} setTasksDone={setTasksDoneSave}
            setMantaDone={setMantaDoneSave}
            userName={userName} completedDates={completedDates} addCompletedDate={addCompletedDate}/>}
          {screen==="anushthan" &&<Anushthan onNav={setScreen} karma={karma} setKarma={setKarmaSave}
            mantaDays={mantaDays} setMantaDays={setMantaDaysSave} user={user}
            mantaDone={mantaDone} setMantaDone={setMantaDoneSave}
            tasksDone={tasksDone} setTasksDone={setTasksDoneSave} joinDate={joinDate}/>}
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
