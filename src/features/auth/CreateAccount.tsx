// @ts-nocheck
'use client';

import React from 'react';
import { dcStyle, dcStr, dcLinkClick, dcHref } from '@/lib/dcRuntime';
import {
  ICONS,
  POS,
  SHOPCATS,
  digits,
  kitById,
  n,
  openBoard,
  phoneOk
} from '@/lib/common';
import App from '@/components/dashboard/App';

const DEFAULT_PROPS: Record<string, any> = {
  "step": "welcome",
  "kit": "shoes",
  "demo": "none",
  "lang": "en",
  "size": "wide",
  "w": 1280,
  "h": 800
};

/* Copy: English · Roman Urdu · Urdu. Urdu is a first draft until a native reader signs it off (gate D3). */
var T = {
w_pitch: ['Sell, track stock and close the day, all in one place.', 'Sale, stock aur din ka hisaab, sab aik jagah.', 'فروخت، اسٹاک اور دن کا حساب، سب ایک جگہ۔'],
w_b1: ['Works on the laptop, tablet and phone you already have', 'Aap ke laptop, tablet aur phone par chalta hai', 'آپ کے لیپ ٹاپ، ٹیبلٹ اور فون پر چلتا ہے'],
w_b2: ['English, Roman Urdu or Urdu', 'English, Roman Urdu ya Urdu', 'انگریزی، رومن اردو یا اردو'],
w_b3: ['Staff only see what their job needs', 'Staff ko sirf apne kaam ki cheezein nazar aati hain', 'عملے کو صرف اپنے کام کی چیزیں نظر آتی ہیں'],
w_cap: ['The owner’s Home once the shop is set up', 'Shop set hone ke baad owner ka Home', 'دکان سیٹ ہونے کے بعد مالک کا ہوم'],
w_title: ['Welcome to ZYRO Retail POS', 'ZYRO Retail POS mein khush aamdeed', 'زائرو پی او ایس میں خوش آمدید'],
w_sub: ['How do you want to start?', 'Aap kaise shuru karna chahte hain?', 'آپ کیسے شروع کرنا چاہتے ہیں؟'],
w_lang: ['Language', 'Zubaan', 'زبان'],
c1t: ['Create my shop’s account', 'Apni shop ka account banayein', 'اپنی دکان کا اکاؤنٹ بنائیں'],
c1s: ['New to ZYRO. About 5 minutes; keep your phone near for a code.', 'ZYRO par naye hain. Taqreeban 5 minute; code ke liye phone paas rakhein.', 'زائرو پر نئے ہیں۔ تقریباً 5 منٹ؛ کوڈ کے لیے فون پاس رکھیں۔'],
c2t: ['Sign in', 'Sign in karein', 'سائن اِن کریں'],
c2s: ['You already have a ZYRO account, on the web or the phone app.', 'Aap ka ZYRO account pehle se hai, web ya phone app par.', 'آپ کا زائرو اکاؤنٹ پہلے سے ہے، ویب یا فون ایپ پر۔'],
c3t: ['Join my shop as staff', 'Staff ke taur par shop join karein', 'عملے کے طور پر دکان میں شامل ہوں'],
c3s: ['You work in a shop and the owner added your number.', 'Aap shop par kaam karte hain aur owner ne aap ka number add kiya hai.', 'آپ دکان پر کام کرتے ہیں اور مالک نے آپ کا نمبر شامل کیا ہے۔'],
help: ['Stuck? Message ZYRO support and we’ll set it up with you.', 'Mushkil ho to ZYRO support ko message karein, hum saath mil kar set kar denge.', 'مشکل ہو تو زائرو سپورٹ کو پیغام بھیجیں، ہم مل کر سیٹ کر دیں گے۔'],
stepsLabel: ['Steps', 'Qadam', 'مراحل'],
stepOf: ['Step {n} of {m}', 'Qadam {n} / {m}', 'مرحلہ {n} از {m}'],
r_create: ['Create your shop', 'Apni shop banayein', 'اپنی دکان بنائیں'], r_createSub: ['About 5 minutes', 'Taqreeban 5 minute', 'تقریباً 5 منٹ'],
r_signin: ['Sign in', 'Sign in', 'سائن اِن'], r_signinSub: ['Owners and managers', 'Owner aur manager', 'مالک اور مینیجر'],
r_join: ['Join your shop', 'Apni shop join karein', 'اپنی دکان میں شامل ہوں'], r_joinSub: ['For staff · about 2 minutes', 'Staff ke liye · taqreeban 2 minute', 'عملے کے لیے · تقریباً 2 منٹ'],
alt_create: ['Already have an account? Sign in', 'Account pehle se hai? Sign in karein', 'اکاؤنٹ پہلے سے ہے؟ سائن اِن کریں'],
alt_signin: ['New to ZYRO? Create your shop’s account', 'ZYRO par naye hain? Shop ka account banayein', 'زائرو پر نئے ہیں؟ دکان کا اکاؤنٹ بنائیں'],
alt_reset: ['Remembered it? Sign in', 'Yaad aa gaya? Sign in karein', 'یاد آ گیا؟ سائن اِن کریں'],
r_reset: ['Reset password', 'Password reset', 'پاس ورڈ ری سیٹ'], r_resetSub: ['About 2 minutes', 'Taqreeban 2 minute', 'تقریباً 2 منٹ'],
signinNote: ['Owners and managers sign in here. Cashiers and stockkeepers use the counter sign-in.', 'Owner aur manager yahan sign in karte hain. Cashier aur stockkeeper counter sign-in istemal karte hain.', 'مالک اور مینیجر یہاں سائن اِن کرتے ہیں۔ کیشیئر اور اسٹاک کیپر کاؤنٹر سائن اِن استعمال کرتے ہیں۔'],
alt_join: ['Own the shop? Create its account instead', 'Shop aap ki hai? Us ka account banayein', 'دکان آپ کی ہے؟ اس کا اکاؤنٹ بنائیں'],
s_phone: ['Your number', 'Aap ka number', 'آپ کا نمبر'], s_code: ['SMS code', 'SMS code', 'ایس ایم ایس کوڈ'], s_you: ['About you', 'Aap ke baare mein', 'آپ کے بارے میں'],
s_shop: ['Your shop', 'Aap ki shop', 'آپ کی دکان'], s_kind: ['What you sell', 'Aap kya bechte hain', 'آپ کیا بیچتے ہیں'], s_ready: ['Ready', 'Tayyar', 'تیار'],
s_signin: ['Sign in', 'Sign in', 'سائن اِن'], s_forgot: ['Get a code', 'Code mangwayein', 'کوڈ منگوائیں'], s_reset: ['New password', 'Naya password', 'نیا پاس ورڈ'],
s_pin: ['Your PIN', 'Aap ka PIN', 'آپ کا پن'], s_done: ['Done', 'Ho gaya', 'مکمل'],
back: ['Back', 'Wapas', 'واپس'], nextB: ['Next', 'Aage', 'آگے'], sendCode: ['Send code', 'Code bhejein', 'کوڈ بھیجیں'], checkCode: ['Check code', 'Code check karein', 'کوڈ چیک کریں'],
createB: ['Create my shop', 'Meri shop banayein', 'میری دکان بنائیں'], counterB: ['Set up this counter', 'Ye counter set karein', 'یہ کاؤنٹر سیٹ کریں'], homeB: ['Go to Home', 'Home par jayein', 'ہوم پر جائیں'],
signinB: ['Sign in', 'Sign in', 'سائن اِن'], savePwB: ['Save and sign in', 'Save kar ke sign in', 'محفوظ کر کے سائن اِن'], savePinB: ['Save my PIN', 'Mera PIN save karein', 'میرا پن محفوظ کریں'], counterSigninB: ['Go to the counter sign-in', 'Counter sign-in par jayein', 'کاؤنٹر سائن اِن پر جائیں'],
h_phone: ['What’s your mobile number?', 'Aap ka mobile number kya hai?', 'آپ کا موبائل نمبر کیا ہے؟'],
p_phone: ['You’ll sign in with it. We send a 6-digit code to check it’s yours.', 'Isi se sign in karein ge. Tasdeeq ke liye 6 hindson ka code bhejein ge.', 'اسی سے سائن اِن کریں گے۔ تصدیق کے لیے 6 ہندسوں کا کوڈ بھیجیں گے۔'],
l_mobile: ['Mobile number', 'Mobile number', 'موبائل نمبر'],
ph_help: ['10 digits after +92, starting with 3', '+92 ke baad 10 hindse, 3 se shuru', '+92 کے بعد 10 ہندسے، 3 سے شروع'],
agree: ['I agree to ZYRO’s terms of use and privacy policy', 'Main ZYRO ki terms of use aur privacy policy se mutafiq hoon', 'میں زائرو کی شرائط اور پرائیویسی پالیسی سے متفق ہوں'],
readTerms: ['Read them', 'Parhein', 'پڑھیں'], termsToast: ['Terms and privacy open in a new tab', 'Terms aur privacy naye tab mein khulein ge', 'شرائط اور پرائیویسی نئے ٹیب میں کھلیں گی'],
why_phone: ['Type a 10-digit number starting with 3', '3 se shuru hone wala 10 hindson ka number likhein', '3 سے شروع ہونے والا 10 ہندسوں کا نمبر لکھیں'],
why_agree: ['Tick that you agree to the terms', 'Terms se mutafiq hone ka tick lagayein', 'شرائط سے متفق ہونے پر ٹک لگائیں'],
taken_t: ['This number already has a ZYRO account', 'Is number par pehle se ZYRO account hai', 'اس نمبر پر پہلے سے زائرو اکاؤنٹ ہے'],
taken_b: ['Sign in with it to open your shop, or use another number for a new one.', 'Isi se sign in kar ke apni shop kholein, ya nayi shop ke liye doosra number likhein.', 'اسی سے سائن اِن کر کے اپنی دکان کھولیں، یا نئی دکان کے لیے دوسرا نمبر لکھیں۔'],
signInstead: ['Sign in instead', 'Sign in karein', 'سائن اِن کریں'],
h_code: ['Type the code we sent', 'Bheja hua code likhein', 'بھیجا گیا کوڈ لکھیں'], p_code: ['It came by SMS. It works for 10 minutes.', 'Ye SMS se aaya hai. 10 minute tak chalega.', 'یہ ایس ایم ایس سے آیا ہے۔ 10 منٹ تک چلے گا۔'],
changeNum: ['Change number', 'Number badlein', 'نمبر بدلیں'], l_code: ['6-digit code', '6 hindson ka code', '6 ہندسوں کا کوڈ'],
resend: ['Send again in 0:42', '0:42 mein dobara bhejein', '0:42 میں دوبارہ بھیجیں'],
codeHelp: ['No SMS after a minute? Check the number, then send again.', 'Aik minute mein SMS na aaye to number check kar ke dobara bhejein.', 'ایک منٹ میں ایس ایم ایس نہ آئے تو نمبر چیک کر کے دوبارہ بھیجیں۔'],
codeErr: ['That code didn’t match. 4 tries left, then wait 15 minutes.', 'Code match nahi hua. 4 koshishein baqi, phir 15 minute intezar.', 'کوڈ میچ نہیں ہوا۔ 4 کوششیں باقی، پھر 15 منٹ انتظار۔'],
why_code: ['Type all 6 digits', 'Poore 6 hindse likhein', 'پورے 6 ہندسے لکھیں'],
h_you: ['About you', 'Aap ke baare mein', 'آپ کے بارے میں'], p_you: ['You’ll be the owner. Staff get their own sign-in later.', 'Aap owner hon ge. Staff ka sign-in baad mein banega.', 'آپ مالک ہوں گے۔ عملے کا سائن اِن بعد میں بنے گا۔'],
l_name: ['Your full name', 'Aap ka poora naam', 'آپ کا پورا نام'], l_email: ['Email · optional', 'Email · zaroori nahi', 'ای میل · اختیاری'],
h_email: ['To reset your password if you change your number.', 'Number badalne par password reset ke liye.', 'نمبر بدلنے پر پاس ورڈ ری سیٹ کرنے کے لیے۔'],
l_pw: ['Password', 'Password', 'پاس ورڈ'], l_pw2: ['Password', 'Password', 'پاس ورڈ'], l_newpw: ['New password', 'Naya password', 'نیا پاس ورڈ'],
show: ['Show', 'Dikhayein', 'دکھائیں'], hide: ['Hide', 'Chupayein', 'چھپائیں'],
r1: ['8 or more characters', '8 ya zyada huroof', '8 یا زیادہ حروف'], r2: ['At least one number', 'Kam az kam aik hindsa', 'کم از کم ایک ہندسہ'], r3: ['Not your phone number', 'Phone number nahi', 'فون نمبر نہیں'],
met: ['done', 'ho gaya', 'مکمل'], notMet: ['not yet', 'abhi nahi', 'ابھی نہیں'],
why_name: ['Type your name', 'Apna naam likhein', 'اپنا نام لکھیں'], why_pw: ['Pick a password that meets all three', 'Teeno shartein poori karne wala password chunein', 'تینوں شرطیں پوری کرنے والا پاس ورڈ چنیں'],
h_shop: ['Your shop', 'Aap ki shop', 'آپ کی دکان'], p_shop: ['This goes on your receipts. Change it any time in Settings.', 'Ye receipt par aaye ga. Settings se kabhi bhi badlein.', 'یہ رسید پر آئے گا۔ سیٹنگز سے کبھی بھی بدلیں۔'],
l_shopName: ['Shop name', 'Shop ka naam', 'دکان کا نام'], l_city: ['City', 'Shehar', 'شہر'], l_area: ['Market or area · optional', 'Market ya ilaqa · zaroori nahi', 'مارکیٹ یا علاقہ · اختیاری'],
l_cityName: ['City name', 'Shehar ka naam', 'شہر کا نام'], why_city: ['Type the city name', 'Shehar ka naam likhein', 'شہر کا نام لکھیں'],
l_branches: ['How many branches?', 'Kitni branches?', 'کتنی برانچیں؟'], b1: ['Just one', 'Sirf aik', 'صرف ایک'], b2: ['2 or 3', '2 ya 3', '2 یا 3'], b3: ['4 or more', '4 ya zyada', '4 یا زیادہ'],
branchHelp: ['You start with the main branch. Add the others in Settings.', 'Shuru main branch se. Baqi Settings mein add karein.', 'شروع مین برانچ سے۔ باقی سیٹنگز میں شامل کریں۔'],
l_logo: ['Logo · optional', 'Logo · zaroori nahi', 'لوگو · اختیاری'], logoNone: ['A letter stands in until you add one', 'Logo lagne tak pehla harf', 'لوگو لگنے تک پہلا حرف'], logoSet: ['logo.png · on receipts and labels', 'logo.png · receipt aur labels par', 'logo.png · رسید اور لیبل پر'],
addLogo: ['Add logo', 'Logo lagayein', 'لوگو لگائیں'], removeLogo: ['Remove', 'Hatayein', 'ہٹائیں'],
receiptPrev: ['Your receipt starts like this', 'Aap ki receipt aise shuru hogi', 'آپ کی رسید ایسے شروع ہوگی'],
why_shop: ['Type the shop name', 'Shop ka naam likhein', 'دکان کا نام لکھیں'],
h_kind: ['What do you sell?', 'Aap kya bechte hain?', 'آپ کیا بیچتے ہیں؟'], p_kind: ['ZYRO sets up categories, sizes and labels to match. You can add your own later.', 'ZYRO is ke mutabiq categories, sizes aur labels bana deta hai. Baad mein apni bhi add karein.', 'زائرو اسی حساب سے کیٹیگریز، سائز اور لیبل بنا دیتا ہے۔ بعد میں اپنی بھی شامل کریں۔'],
setsUp: ['What ZYRO sets up for {k}', 'ZYRO {k} ke liye kya banaye ga', 'زائرو {k} کے لیے کیا بنائے گا'],
k_cats: ['Categories', 'Categories', 'کیٹیگریز'], k_asks: ['Add item asks for', 'Add item mein poocha jaye ga', 'آئٹم شامل کرتے وقت'], k_counts: ['Stock counted in', 'Stock ki ginti', 'اسٹاک کی گنتی'], k_labels: ['Barcodes', 'Barcode', 'بارکوڈ'],
h_building: ['Setting up {shop}', '{shop} set ho rahi hai', '{shop} سیٹ ہو رہی ہے'], p_building: ['This takes a few seconds.', 'Bas chand second.', 'بس چند سیکنڈ۔'],
bl1: ['Owner account for {name}', '{name} ka owner account', '{name} کا مالک اکاؤنٹ'], bl2: ['Main branch in {city}', '{city} mein main branch', '{city} میں مین برانچ'],
bl3: ['Categories: {cats}', 'Categories: {cats}', 'کیٹیگریز: {cats}'], bl4: ['Labels and receipt with your shop name', 'Shop ke naam wali labels aur receipt', 'دکان کے نام والے لیبل اور رسید'], bl5: ['Your Home and today’s page', 'Aap ka Home aur aaj ka page', 'آپ کا ہوم اور آج کا صفحہ'],
waiting: ['waiting', 'intezar', 'انتظار'], working: ['working', 'ho raha hai', 'جاری'],
h_ready: ['{shop} is ready', '{shop} tayyar hai', '{shop} تیار ہے'], p_ready: ['You’re signed in as the owner. Do these next, in any order.', 'Aap owner ke taur par sign in hain. Ye kaam kisi bhi tarteeb se karein.', 'آپ مالک کے طور پر سائن اِن ہیں۔ یہ کام کسی بھی ترتیب سے کریں۔'],
sumOwner: ['Owner', 'Owner', 'مالک'], sumShop: ['Shop', 'Shop', 'دکان'], sumCity: ['City', 'Shehar', 'شہر'], sumKind: ['Sells', 'Bechte hain', 'بیچتے ہیں'],
nextTitle: ['Next', 'Agla kaam', 'اگلا کام'],
n1t: ['Set up this counter', 'Ye counter set karein', 'یہ کاؤنٹر سیٹ کریں'], n1s: ['Pick the printer and print a test receipt. About 3 minutes.', 'Printer chunein aur test receipt print karein. Taqreeban 3 minute.', 'پرنٹر چنیں اور ٹیسٹ رسید پرنٹ کریں۔ تقریباً 3 منٹ۔'],
n2t: ['Add your first items', 'Pehle items add karein', 'پہلے آئٹم شامل کریں'], n2s: ['Add item asks only what your kind of shop needs, then makes labels.', 'Add item sirf zaroori cheezein poochta hai, phir labels banata hai.', 'صرف ضروری چیزیں پوچھی جاتی ہیں، پھر لیبل بنتے ہیں۔'],
n3t: ['Add your staff', 'Staff add karein', 'عملہ شامل کریں'], n3s: ['Each person gets an SMS to join and only sees their job.', 'Har shakhs ko join ka SMS jaye ga aur woh sirf apna kaam dekhe ga.', 'ہر شخص کو شامل ہونے کا ایس ایم ایس جائے گا اور وہ صرف اپنا کام دیکھے گا۔'],
n4t: ['Get the phone app', 'Phone app lein', 'فون ایپ لیں'], n4s: ['Sign in with the same number to scan and take item photos.', 'Isi number se sign in kar ke scan aur photos lein.', 'اسی نمبر سے سائن اِن کر کے اسکین اور تصاویر لیں۔'],
h_signin: ['Welcome back', 'Khush aamdeed', 'خوش آمدید'], p_signin: ['Use the number or email you signed up with.', 'Jis number ya email se account banaya tha, wohi likhein.', 'جس نمبر یا ای میل سے اکاؤنٹ بنایا تھا، وہی لکھیں۔'],
l_user: ['Mobile number or email', 'Mobile number ya email', 'موبائل نمبر یا ای میل'],
keep: ['Keep me signed in on this computer', 'Is computer par sign in rehne dein', 'اس کمپیوٹر پر سائن اِن رہنے دیں'], keepHelp: ['Leave it off on a shared counter.', 'Shared counter par na lagayein.', 'مشترکہ کاؤنٹر پر نہ لگائیں۔'],
forgot: ['Forgot password?', 'Password bhool gaye?', 'پاس ورڈ بھول گئے؟'], staffSignin: ['Staff: counter sign-in', 'Staff: counter sign-in', 'عملہ: کاؤنٹر سائن اِن'],
signErr: ['That number or password didn’t match. Check both and try again.', 'Number ya password match nahi hua. Dono check kar ke dobara koshish karein.', 'نمبر یا پاس ورڈ میچ نہیں ہوا۔ دونوں چیک کر کے دوبارہ کوشش کریں۔'],
why_signin: ['Type your number or email and password', 'Number ya email aur password likhein', 'نمبر یا ای میل اور پاس ورڈ لکھیں'],
h_forgot: ['Reset your password', 'Password reset karein', 'پاس ورڈ ری سیٹ کریں'], p_forgot: ['We send a code to the number on your account.', 'Account wale number par code bhejein ge.', 'اکاؤنٹ والے نمبر پر کوڈ بھیجیں گے۔'],
h_reset: ['Pick a new password', 'Naya password chunein', 'نیا پاس ورڈ چنیں'], p_reset: ['Type the code from the SMS, then your new password.', 'SMS wala code aur phir naya password likhein.', 'ایس ایم ایس والا کوڈ اور پھر نیا پاس ورڈ لکھیں۔'],
h_join: ['Join your shop', 'Apni shop join karein', 'اپنی دکان میں شامل ہوں'], p_join: ['Use the number your shop owner added for you.', 'Wohi number likhein jo owner ne aap ke liye add kiya.', 'وہی نمبر لکھیں جو مالک نے آپ کے لیے شامل کیا۔'],
noInvite_t: ['This number isn’t on a shop’s staff list yet', 'Ye number abhi kisi shop ki staff list mein nahi', 'یہ نمبر ابھی کسی دکان کی عملہ فہرست میں نہیں'],
noInvite_b: ['Ask the owner to add it in Settings, Staff. Then try again.', 'Owner se kahein Settings, Staff mein add kare. Phir dobara koshish karein.', 'مالک سے کہیں سیٹنگز، عملہ میں شامل کرے۔ پھر دوبارہ کوشش کریں۔'],
h_pin: ['Pick your 4-digit PIN', 'Apna 4 hindson ka PIN chunein', 'اپنا 4 ہندسوں کا پن چنیں'], p_pin: ['You type it at the counter to sell. Don’t share it.', 'Counter par sale ke liye ye likhein ge. Kisi ko na batayein.', 'کاؤنٹر پر فروخت کے لیے یہ لکھیں گے۔ کسی کو نہ بتائیں۔'],
invitedAs: ['You join as a cashier. Hamza Sheikh added you.', 'Aap cashier ke taur par join kar rahe hain. Hamza Sheikh ne add kiya.', 'آپ بطور کیشیئر شامل ہو رہے ہیں۔ حمزہ شیخ نے شامل کیا۔'],
l_pin: ['PIN', 'PIN', 'پن'], l_pin2: ['Type it again', 'Dobara likhein', 'دوبارہ لکھیں'],
pinRule: ['4 digits. Not 1234, 0000 or your birth year.', '4 hindse. 1234, 0000 ya paidaish ka saal nahi.', '4 ہندسے۔ 1234، 0000 یا پیدائش کا سال نہیں۔'],
pinMismatch: ['The two PINs don’t match. Type the second one again.', 'Dono PIN match nahi karte. Doosra dobara likhein.', 'دونوں پن میچ نہیں کرتے۔ دوسرا دوبارہ لکھیں۔'], pinEasy: ['Too easy to guess. Pick another PIN.', 'Bohat aasaan hai. Koi aur PIN chunein.', 'بہت آسان ہے۔ کوئی اور پن چنیں۔'],
why_pin: ['Type the same 4 digits twice', 'Aik jaise 4 hindse do dafa likhein', 'ایک جیسے 4 ہندسے دو دفعہ لکھیں'],
h_joinDone: ['You’re in, {first}', 'Aap shamil ho gaye, {first}', 'آپ شامل ہو گئے، {first}'], p_joinDone: ['At the counter, pick your name and type your PIN.', 'Counter par apna naam chunein aur PIN likhein.', 'کاؤنٹر پر اپنا نام چنیں اور پن لکھیں۔'],
canTitle: ['What a cashier can do', 'Cashier kya kar sakta hai', 'کیشیئر کیا کر سکتا ہے'],
can1: ['Sell for cash and print bills', 'Cash par sale aur bill print', 'نقد فروخت اور بل پرنٹ'], can2: ['Add customers, take WhatsApp orders, look up stock', 'Customer add karna, WhatsApp orders lena, stock dekhna', 'گاہک شامل کرنا، واٹس ایپ آرڈر لینا، اسٹاک دیکھنا'],
can3: ['Khata, returns and price changes stay with the owner', 'Khata, returns aur qeemat owner ke paas', 'کھاتہ، واپسی اور قیمت مالک کے پاس'],
signedToast: ['Signed in · opening Home', 'Sign in ho gaya · Home khul raha hai', 'سائن اِن ہو گیا · ہوم کھل رہا ہے']
};
var KN = {
clothing: ['Clothing and fashion', 'Kapray aur fashion', 'کپڑے اور فیشن', 'Suits, kurtas, lawn, kids wear', 'Suit, kurta, lawn, bachon ke kapray', 'سوٹ، کرتا، لان، بچوں کے کپڑے', 'shirt'],
shoes: ['Footwear', 'Joote', 'جوتے', 'Shoes, chappals, khussas, sandals', 'Joote, chappal, khussa, sandal', 'جوتے، چپل، کھسہ، سینڈل', 'shoe'],
jewellery: ['Jewellery', 'Zewraat', 'زیورات', 'Gold, silver, artificial', 'Sona, chandi, artificial', 'سونا، چاندی، مصنوعی', 'gem'],
pharmacy: ['Pharmacy', 'Pharmacy', 'فارمیسی', 'Medicines and personal care', 'Dawaiyan aur personal care', 'ادویات اور ذاتی نگہداشت', 'pill'],
grocery: ['Grocery and general store', 'Kiryana aur general store', 'کریانہ اور جنرل اسٹور', 'Kiryana, mart, daily items', 'Kiryana, mart, rozana ki cheezein', 'کریانہ، مارٹ، روزمرہ اشیا', 'basket'],
cosmetics: ['Cosmetics and beauty', 'Cosmetics aur beauty', 'کاسمیٹکس اور بیوٹی', 'Makeup, skin and hair care', 'Makeup, skin aur hair care', 'میک اپ، جلد اور بالوں کی نگہداشت', 'drop'],
mobile: ['Mobiles and electronics', 'Mobile aur electronics', 'موبائل اور الیکٹرانکس', 'Phones, chargers, accessories', 'Phone, charger, accessories', 'فون، چارجر، لوازمات', 'phone'],
other: ['Something else', 'Kuch aur', 'کچھ اور', 'Start empty and add your own', 'Khaali shuru karein, apni cheezein add karein', 'خالی شروع کریں، اپنی چیزیں شامل کریں', 'layers']
};
var KORDER = ['clothing', 'shoes', 'jewellery', 'pharmacy', 'grocery', 'cosmetics', 'mobile', 'other'];
var ASKS = {
sc: ['colours, sizes and how many of each', 'rang, size aur har aik ki tadaad', 'رنگ، سائز اور ہر ایک کی تعداد'],
simple: ['only how many you have', 'sirf kitne hain', 'صرف کتنے ہیں'],
piece: ['karat, weight and making charge of each piece', 'har piece ka karat, wazan aur banwai', 'ہر پیس کا قیراط، وزن اور بنوائی'],
batch: ['batch, expiry and packs in each batch', 'batch, expiry aur har batch mein packs', 'بیچ، میعاد اور ہر بیچ میں پیک'],
pack: ['pack size, or price per kg or litre', 'pack size, ya fi kg ya litre qeemat', 'پیک سائز، یا فی کلو یا لیٹر قیمت'],
shade: ['shade names and how many of each', 'shade ke naam aur har aik ki tadaad', 'شیڈ کے نام اور ہر ایک کی تعداد'],
serial: ['the IMEI or serial of every unit', 'har unit ka IMEI ya serial', 'ہر یونٹ کا آئی ایم ای آئی یا سیریل']
};
var UNIT = { pair: ['Pairs', 'Pairs (jore)', 'جوڑے'], piece: ['Pieces', 'Pieces', 'عدد'], pack: ['Packs and strips', 'Pack aur patte', 'پیک اور پتے'] };
var BC = { zyro: ['ZYRO prints a label for each one', 'ZYRO har cheez ka label print karta hai', 'زائرو ہر چیز کا لیبل پرنٹ کرتا ہے'], maker: ['Scan the barcode already on the pack', 'Pack par laga barcode scan karein', 'پیک پر لگا بارکوڈ اسکین کریں'], serial: ['Scan the IMEI or serial', 'IMEI ya serial scan karein', 'آئی ایم ای آئی یا سیریل اسکین کریں'] };
var CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Sialkot', 'Gujranwala', 'Other'];
var FLOWS = {
create: ['phone', 'code', 'you', 'shop', 'kind', 'ready'],
signin: ['signin'],
reset: ['forgot', 'reset'],
join: ['join', 'joinCode', 'joinPin', 'joinDone']
};
var ADD_BOARD = { clothing: 'AppAddItem', shoes: 'AppAddItemShoesCarton', jewellery: 'AppAddItemJewellery', pharmacy: 'AppAddItemPharmacyFull', grocery: 'AppAddItemGrocery', cosmetics: 'AppAddItemCosmetics', mobile: 'AppAddItemMobile', other: 'AppAddItemOther' };
var WRONG_CODE = '481923';
function flowOf(step) { if (step === 'building') return 'create'; for (var f in FLOWS) { if (FLOWS[f].indexOf(step) >= 0) return f; } return 'welcome'; }
function normalizePkPhone(raw) {
  var d = String(raw || '').replace(/\D/g, '');
  if (d.indexOf('92') === 0 && d.length > 10) d = d.slice(2);
  if (d.indexOf('0') === 0 && d.length > 1) d = d.slice(1);
  return d.slice(0, 10);
}
var STEP_TO_ROUTE = { welcome: '/', phone: '/register', signin: '/login', join: '/join' };
class CreateAccountBase extends React.Component<any, any> {
  static defaultProps = DEFAULT_PROPS;

constructor(props) {
super(props);
var p = props || {}, step = p.step || 'welcome', demo = p.demo || 'none', fill = step !== 'welcome' && demo !== 'empty';
var f = flowOf(step), idx = f === 'welcome' ? -1 : FLOWS[f].indexOf(step === 'building' ? 'ready' : step);
var past = function (st) { return f === 'create' && FLOWS.create.indexOf(st) < idx; };
this.state = {
step: step, lang: p.lang || 'en', kit: p.kit || 'shoes', demo: demo,
phone: fill || past('phone') ? (demo === 'taken' ? '3001234567' : '3214567890') : '', agree: fill, code: (step === 'code' || step === 'joinCode' || step === 'reset') ? (demo === 'codeError' ? WRONG_CODE : (fill ? '482913' : '')) : '',
codeBad: demo === 'codeError', name: fill ? (f === 'join' ? 'Ali Hassan' : 'Hamza Sheikh') : '', email: fill && f === 'create' ? 'hamza@yourshop.pk' : '',
pw: fill ? (demo === 'weak' ? 'hamza' : 'Stride2026') : '', pwShown: demo === 'weak', user: fill ? '0321 4567890' : '', keep: false, signBad: demo === 'wrongPassword',
shop: fill ? 'Stride Footwear' : '', city: 'Lahore', cityName: '', area: fill ? 'Liberty Market, Gulberg' : '', br: 1, logo: fill && step !== 'shop',
pin: demo === 'pinMismatch' ? '7391' : (fill && step === 'joinPin' ? '7391' : ''), pin2: demo === 'pinMismatch' ? '7319' : (fill && step === 'joinPin' ? '7391' : ''),
taken: demo === 'taken', noInvite: demo === 'noInvite', built: step === 'building' ? 3 : 0, busy: false, toast: null,
tried: false, resendSec: 0
};
this.timers = [];
this.resendIv = null;
}
componentDidUpdate(prevProps) {
  var p = this.props || {}, prev = prevProps || {};
  if (p.step && p.step !== prev.step && p.step !== this.state.step) {
    this.setState({ step: p.step, taken: false, noInvite: false, signBad: false, codeBad: false, busy: false, tried: false });
  }
  if (p.lang && p.lang !== prev.lang && p.lang !== this.state.lang) {
    this.setState({ lang: p.lang });
  }
  if (p.kit && p.kit !== prev.kit && p.kit !== this.state.kit) {
    this.setState({ kit: p.kit });
  }
}
componentWillUnmount() {
  this.timers.forEach(function (t) { clearTimeout(t); });
  if (this.resendIv) clearInterval(this.resendIv);
}
later(fn, ms) { this.timers.push(setTimeout(fn, ms)); }
toast(msg) { var self = this; this.setState({ toast: msg }); this.later(function () { self.setState({ toast: null }); }, 2600); }
startResendCooldown() {
  var self = this;
  if (this.resendIv) clearInterval(this.resendIv);
  this.setState({ resendSec: 30 });
  this.resendIv = setInterval(function () {
    self.setState(function (prev) {
      if (prev.resendSec <= 1) {
        if (self.resendIv) { clearInterval(self.resendIv); self.resendIv = null; }
        return { resendSec: 0 };
      }
      return { resendSec: prev.resendSec - 1 };
    });
  }, 1000);
}
go(step, syncRoute) {
  this.setState({ step: step, taken: false, noInvite: false, signBad: false, codeBad: false, busy: false, tried: false });
  if (syncRoute && typeof window !== 'undefined') {
    var curPath = window.location.pathname;
    var onCleanAuthRoute = curPath === '/' || curPath === '/login' || curPath === '/register' || curPath === '/join';
    var target = STEP_TO_ROUTE[step];
    if (onCleanAuthRoute && target && target !== curPath) {
      openBoard(target);
    }
  }
}
renderVals() {
var self = this, P = this.props || {}, s = this.state, lang = s.lang, li = lang === 'roman' ? 1 : (lang === 'ur' ? 2 : 0), ur = lang === 'ur';
var rawW = +P.w || 1280, rawH = +P.h || 800;
var phone = P.size === 'phone' || rawW < 960;
var W = rawW, H = rawH;
var t = {}; Object.keys(T).forEach(function (k) { t[k] = T[k][li]; });
var fill = function (str, o) { return String(str).replace(/\{(\w+)\}/g, function (_, k) { return o[k] != null ? o[k] : ''; }); };
var F = ur ? { body: "'Noto Naskh Arabic',Outfit,serif", head: "'Noto Naskh Arabic',Outfit,serif", base: 18, small: 15, tiny: 14, label: 16, h1: phone ? 24 : 30, btn: 18, rail: 17, railTitle: 20, choice: 19, pitch: 28, pitchPhone: 20, lh: 1.85, lhHead: 1.6 }
: { body: "Outfit,'Segoe UI',Roboto,system-ui,sans-serif", head: "Outfit,sans-serif", base: 16, small: 14, tiny: 12, label: 14, h1: phone ? 24 : 30, btn: 16, rail: 15, railTitle: 18, choice: 17, pitch: W < 1180 ? 28 : 34, pitchPhone: 20, lh: 1.5, lhHead: 1.2 };
var step = s.step, flow = flowOf(step), welcome = step === 'welcome';
var L = { padTop: phone ? 18 : (welcome ? 44 : 40), padX: phone ? (W < 420 ? 14 : 20) : (welcome ? (W < 1180 ? 32 : 56) : (W < 1180 ? 28 : 48)), choiceH: phone ? 80 : 96, kindCols: W < 540 ? 2 : (phone ? 3 : 4), kindH: phone ? 108 : 118, suCols: phone ? '1fr' : 'minmax(0,1.5fr) repeat(3,minmax(0,1fr))', sumCols: phone ? 'repeat(2,minmax(0,1fr))' : 'repeat(4,minmax(0,1fr))' };
var digits10 = normalizePkPhone(s.phone), phoneOk = /^3\d{9}$/.test(digits10);
var phoneShow = '+92 ' + digits10.slice(0, 3) + ' ' + digits10.slice(3);
var kit = s.kit, kn = KN[kit] || KN.shoes, kitObj = kitById(kit), cats = (SHOPCATS[kit] || []).map(function (c) { return c[1]; });
var kitName = kn[li], type0 = ((SHOPCATS[kit] || [])[0] || [])[2] || 'simple', unit = kitObj.unit || 'piece';
var cityShown = s.city === 'Other' ? ((s.cityName || '').trim() || '—') : s.city;
var shopName = (s.shop || '').trim() || 'Stride Footwear', first = (s.name || 'Ali Hassan').split(' ')[0];
// password rules
var pw = s.pw || '', r1 = pw.length >= 8, r2 = /\d/.test(pw), r3 = !digits10 || pw.replace(/\D/g, '').indexOf(digits10) < 0;
var pwOk = r1 && r2 && r3;
var rule = function (ok, txt) { return { t: txt, fg: ok ? '#14532D' : '#5B6585', d: ok ? ICONS.checkCircle : 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', sr: ok ? t.met : t.notMet }; };
var codeOk = /^\d{6}$/.test(s.code || ''), pinEasy = s.pin.length === 4 && (['1234', '0000', '1111', '2222', '4321', '1990', '2000'].indexOf(s.pin) >= 0 || /^(\d)\1{3}$/.test(s.pin || ''));
var pinMatch = s.pin.length === 4 && s.pin2.length === 4 && s.pin === s.pin2;
var userTrim = (s.user || '').trim();
var emailCheck = (s.email || '').trim();
var emailBad = emailCheck.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCheck);
var userIsEmail = userTrim.indexOf('@') >= 0;
var userValid = userIsEmail ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userTrim) : /^3\d{9}$/.test(normalizePkPhone(userTrim));
// step list for the rail
var labelOf = { phone: t.s_phone, code: t.s_code, you: t.s_you, shop: t.s_shop, kind: t.s_kind, ready: t.s_ready, signin: t.s_signin, forgot: t.s_forgot, reset: t.s_reset, join: t.s_phone, joinCode: t.s_code, joinPin: t.s_pin, joinDone: t.s_done };
var list = flow === 'welcome' || flow === 'signin' ? [] : FLOWS[flow], cur = step === 'building' ? 'ready' : step, ci = list.indexOf(cur);
var steps = list.map(function (id, i) {
var done = i < ci || (step === 'ready' && i === ci) || (step === 'joinDone' && i === ci), now = i === ci && !done;
return { n: i + 1, label: labelOf[id], cur: now ? 'step' : 'false', done: done, num: !done, bg: now ? 'rgba(255,255,255,.1)' : 'transparent', dotBg: done ? '#7FD6A4' : (now ? '#D0E6FD' : 'transparent'), dotFg: done || now ? '#162660' : '#BFD0EE', dotBorder: done || now ? '0' : '2px solid #A9BCE0', w: now ? 700 : 500, fg: now || done ? '#ffffff' : '#BFD0EE', sr: done ? ', ' + t.met : (now ? '' : ', ' + t.notMet) };
});
var stepMax = list.length, stepNo = Math.max(1, ci + 1);
var RT = { signin: [t.r_signin, t.r_signinSub, t.alt_signin, 'phone'], reset: [t.r_reset, t.r_resetSub, t.alt_reset, 'signin'], join: [t.r_join, t.r_joinSub, t.alt_join, 'phone'], create: [t.r_create, t.r_createSub, t.alt_create, 'signin'] };
var rt = RT[flow] || RT.create, railTitle = rt[0], railSub = rt[1], railAlt = rt[2];
var railAltGo = function () { self.go(rt[3], true); };
// titles
var TT = {
welcome: [t.w_title, t.w_sub], phone: [t.h_phone, t.p_phone], code: [t.h_code, t.p_code], you: [t.h_you, t.p_you], shop: [t.h_shop, t.p_shop], kind: [t.h_kind, t.p_kind],
building: [fill(t.h_building, { shop: shopName }), t.p_building], ready: [fill(t.h_ready, { shop: shopName }), t.p_ready], signin: [t.h_signin, t.p_signin], forgot: [t.h_forgot, t.p_forgot],
reset: [t.h_reset, t.p_reset], join: [t.h_join, t.p_join], joinCode: [t.h_code, t.p_code], joinPin: [t.h_pin, t.p_pin], joinDone: [fill(t.h_joinDone, { first: first }), t.p_joinDone]
};
var title = (TT[step] || TT.welcome)[0], sub = (TT[step] || TT.welcome)[1];
// welcome choices -> navigate cleanly to /register, /login, /join
var choices = [
[t.c1t, t.c1s, ICONS.store, function () { self.go('phone', true); }, true],
[t.c2t, t.c2s, ICONS.key, function () { self.go('signin', true); }, false],
[t.c3t, t.c3s, ICONS.userPlus, function () { self.go('join', true); }, false]
].map(function (c) { return { t: c[0], s: c[1], d: c[2], go: c[3], cls: c[4] ? 'bk' : 'opt', bg: c[4] ? '#162660' : '#ffffff', fg: c[4] ? '#ffffff' : '#162660', bd: c[4] ? '0' : '1px solid #E9E1D5', subFg: c[4] ? '#BFD0EE' : '#5B6585', icBg: c[4] ? 'rgba(255,255,255,.12)' : '#F6F0E7', icFg: c[4] ? '#ffffff' : '#162660' }; });
var LANGS = [['en', 'English', 'Outfit,sans-serif', 15], ['roman', 'Roman Urdu', 'Outfit,sans-serif', 15], ['ur', 'اردو', "'Noto Naskh Arabic',serif", 17]];
var langs = LANGS.map(function (l) { var on = lang === l[0]; return { code: l[0] === 'ur' ? 'ur' : 'en', label: l[1], font: l[2], size: l[3], on: on ? 'true' : 'false', bg: on ? '#ffffff' : 'transparent', fg: on ? '#162660' : '#454F70', sh: on ? '0 1px 2px rgba(22,30,60,.08)' : 'none', pick: function () { self.setState({ lang: l[0] }); if (P.onLangChange) P.onLangChange(l[0]); } }; });
// next button per step with active validation feedback
var why = '', nextLabel = t.nextB, next = function () {}, nextIsLink = false, nextHref = '', secHas = false, secLabel = '', secHref = '';
var onCodeStep = step === 'code' || step === 'joinCode' || step === 'reset';
var busyThen = function (fn) { self.setState({ busy: true }); self.later(function () { self.setState({ busy: false }); fn(); }, 450); };
if (step === 'phone' || step === 'forgot' || step === 'join') {
why = !phoneOk ? t.why_phone : (step === 'phone' && !s.agree ? t.why_agree : '');
nextLabel = t.sendCode;
next = function () {
if (why) { self.setState({ tried: true }); self.toast(why); return; }
if (step === 'phone' && (s.taken || digits10 === '3001234567')) { self.setState({ taken: true }); return; }
if (step === 'join' && (s.noInvite || digits10 === '3009998887')) { self.setState({ noInvite: true }); return; }
busyThen(function () {
  self.setState({ step: step === 'phone' ? 'code' : (step === 'forgot' ? 'reset' : 'joinCode'), code: '', codeBad: false, tried: false });
  self.startResendCooldown();
  self.toast('Verification code sent to ' + phoneShow + ' (demo: any 6 digits)');
});
};
} else if (step === 'code' || step === 'joinCode') {
why = !codeOk ? t.why_code : ''; nextLabel = t.checkCode;
next = function () {
  if (!codeOk) { self.setState({ tried: true }); self.toast(t.why_code); return; }
  if (s.code === WRONG_CODE) { self.setState({ codeBad: true }); return; }
  busyThen(function () { self.go(step === 'code' ? 'you' : 'joinPin'); });
};
} else if (step === 'you') {
why = !(s.name || '').trim() ? t.why_name : (emailBad ? 'Enter a valid email address or leave it blank' : (!pwOk ? t.why_pw : ''));
next = function () {
  if (why) { self.setState({ tried: true }); self.toast(why); return; }
  self.go('shop');
};
} else if (step === 'shop') {
why = !(s.shop || '').trim() ? t.why_shop : (s.city === 'Other' && !(s.cityName || '').trim() ? t.why_city : '');
next = function () {
  if (why) { self.setState({ tried: true }); self.toast(why); return; }
  self.go('kind');
};
} else if (step === 'kind') {
nextLabel = t.createB;
next = function () {
if (P.onKitChange) P.onKitChange(s.kit);
self.setState({ step: 'building', built: 0, tried: false });
[1, 2, 3, 4, 5].forEach(function (k) { self.later(function () { self.setState({ built: k }); }, k * 360); });
self.later(function () { self.setState({ step: 'ready' }); self.toast(shopName + ' account created'); }, 5 * 360 + 450);
};
} else if (step === 'ready') {
nextIsLink = true; nextLabel = t.counterB; nextHref = 'SetupDevice.dc.html'; secHas = true; secLabel = t.homeB; secHref = (kit === 'shoes' ? 'AppHomeShoes' : 'App') + '.dc.html';
} else if (step === 'signin') {
why = !userTrim ? 'Enter your mobile number or email' : (!userValid ? 'Enter a valid mobile number (03xx...) or email' : (!pw ? 'Enter your password' : (pw.length < 4 ? 'Password must be at least 4 characters' : '')));
nextLabel = t.signinB;
next = function () {
  if (why) { self.setState({ tried: true }); self.toast(why); return; }
  if (s.demo === 'wrongPassword' && s.signBad !== 'cleared') { self.setState({ signBad: true }); return; }
  self.setState({ busy: true });
  self.toast(t.signedToast);
  self.later(function () { self.setState({ busy: false }); openBoard(kit === 'shoes' ? 'AppHomeShoes' : 'App'); }, 700);
};
} else if (step === 'reset') {
why = !codeOk ? t.why_code : (!pwOk ? t.why_pw : ''); nextLabel = t.savePwB;
next = function () {
  if (why) { self.setState({ tried: true }); self.toast(why); return; }
  if (s.code === WRONG_CODE) { self.setState({ codeBad: true }); return; }
  self.toast(t.signedToast);
  self.later(function () { openBoard(kit === 'shoes' ? 'AppHomeShoes' : 'App'); }, 700);
};
} else if (step === 'joinPin') {
why = s.pin.length < 4 || s.pin2.length < 4 || pinEasy || !pinMatch ? (pinEasy ? t.pinEasy : (s.pin2.length === 4 && !pinMatch ? t.pinMismatch : t.why_pin)) : '';
nextLabel = t.savePinB;
next = function () {
  if (why) { self.setState({ tried: true }); self.toast(why); return; }
  self.toast('Counter PIN saved');
  self.go('joinDone');
};
} else if (step === 'joinDone') {
nextIsLink = true; nextLabel = t.counterSigninB; nextHref = 'SignIn.dc.html';
secHas = true; secLabel = 'Staff PIN pad'; secHref = 'Login.dc.html';
}
var backTo = { phone: 'welcome', code: 'phone', you: 'code', shop: 'you', kind: 'shop', signin: 'welcome', forgot: 'signin', reset: 'forgot', join: 'welcome', joinCode: 'join', joinPin: 'joinCode' };
var hasBack = !!backTo[step];
var onEnter = function (e) { if (e.key === 'Enter' && !s.busy) { e.preventDefault(); next(); } };
// kind cards
var kits = KORDER.map(function (id) { var on = id === kit, k = KN[id]; return { name: k[li], sub: k[3 + li], d: ICONS[k[6]] || ICONS.layers, on: on ? 'true' : 'false', bd: on ? '2px solid #2E46A0' : '1px solid #E9E1D5', bg: on ? '#EEF5FE' : '#ffffff', icBg: on ? '#ffffff' : '#F6F0E7', icFg: '#162660', pick: function () { self.setState({ kit: id }); if (P.onKitChange) P.onKitChange(id); } }; });
var bcKey = kitObj.barcode === 'maker' ? 'maker' : (kitObj.barcode === 'serial' || kit === 'mobile' ? 'serial' : 'zyro');
var kitFacts = [[t.k_asks, (ASKS[type0] || ASKS.simple)[li]], [t.k_counts, (UNIT[unit] || UNIT.piece)[li]], [t.k_labels, BC[bcKey][li]]].map(function (x) { return { k: x[0], v: x[1] }; });
var kitCats = (cats.length ? cats : [kit === 'other' ? 'General' : '']).map(function (c) { return { t: c }; });
// building
var B = [fill(t.bl1, { name: s.name || 'Hamza Sheikh' }), fill(t.bl2, { city: cityShown }), fill(t.bl3, { cats: cats.join(', ') || 'General' }), t.bl4, t.bl5];
var build = B.map(function (txt, i) { var done = i < s.built, now = i === s.built; return { t: txt, bg: done || now ? '#ffffff' : '#F8F2E9', fg: done || now ? '#162660' : '#5B6585', dotBg: done ? '#E8F6EE' : (now ? '#EAF2FD' : '#F6F0E7'), dotFg: done ? '#14532D' : (now ? '#24398A' : '#8A8276'), d: done ? ICONS.check : (now ? ICONS.refresh : ICONS.clock), anim: now ? 'zspin 1s linear infinite' : 'none', sr: done ? ', ' + t.met : (now ? ', ' + t.working : ', ' + t.waiting) }; });
// ready
var summary = [[t.sumOwner, s.name || 'Hamza Sheikh'], [t.sumShop, shopName], [t.sumCity, cityShown + (s.area ? ' · ' + s.area : '')], [t.sumKind, kitName]].map(function (x) { return { k: x[0], v: x[1] }; });
var NX = [[t.n1t, t.n1s, 'SetupDevice'], [t.n2t, t.n2s, ADD_BOARD[kit] || 'AppAddItem'], [t.n3t, t.n3s, 'SettingsStaffAdd'], [t.n4t, t.n4s, 'MOnboard']];
var nexts = NX.map(function (x, i) { var hi = i === 0; return { n: i + 1, t: x[0], s: x[1], href: x[2] + '.dc.html', bd: hi ? '2px solid #2E46A0' : '1px solid #E9E1D5', bg: hi ? '#EEF5FE' : '#ffffff', nBg: hi ? '#162660' : '#F6F0E7', nFg: hi ? '#ffffff' : '#162660' }; });
// branches, cities, logo
var branches = [[1, t.b1], [2, t.b2], [4, t.b3]].map(function (b) { var on = s.br === b[0]; return { t: b[1], on: on ? 'true' : 'false', bd: on ? '2px solid #2E46A0' : '1px solid #D9CFC0', bg: on ? '#EEF5FE' : '#ffffff', pick: function () { self.setState({ br: b[0] }); } }; });
var cities = CITIES.map(function (c) { return { v: c, sel: c === s.city }; });
var initial = (shopName.trim()[0] || 'S').toUpperCase();
var cans = [[t.can1, true], [t.can2, true], [t.can3, false]].map(function (c) { return { t: c[0], fg: c[1] ? '#14532D' : '#5B6585', d: c[1] ? ICONS.checkCircle : ICONS.lock }; });
var codeBad = !!s.codeBad || (s.tried && onCodeStep && !codeOk);
var phBad = (step === 'phone' && s.taken) || (step === 'join' && s.noInvite) || (s.tried && (step === 'phone' || step === 'forgot' || step === 'join') && !phoneOk);
var bw = W < 1180 ? Math.max(360, Math.round(W * 0.4)) : Math.min(600, Math.round(W * 0.44)), fs = bw >= 560 ? 0.4 : (bw >= 440 ? 0.3 : 0.24);
var railW = W < 1180 ? 300 : 360;
var resendLabel = s.resendSec > 0 ? ('Send again in 0:' + (s.resendSec < 10 ? '0' : '') + s.resendSec) : 'Send code again';
var doResend = function () {
  if (s.resendSec > 0) return;
  self.startResendCooldown();
  self.toast('New 6-digit code sent to ' + (digits10 ? phoneShow : '+92 321 4567890'));
};
return {
brandW: bw, railW: railW, brandPad: bw >= 520 ? '40px 44px 36px' : '28px 28px 24px', brandGap: H < 720 ? 16 : 22, figDisp: H < 720 ? 'none' : 'flex', figW: Math.round(1280 * fs), figH: Math.round(800 * fs), figS: fs,
rootH: phone ? 'min-height:100dvh;height:auto' : ('height:' + Math.max(600, H) + 'px;overflow:hidden'),
ic: ICONS, s: s, t: t, F: F, L: L, W: W, H: H, yes: true, dir: ur ? 'rtl' : 'ltr', langAttr: ur ? 'ur' : 'en', flip: ur ? 'scaleX(-1)' : 'none', kit: kit,
innerM: welcome && !phone ? 'auto 0' : '0', flow: phone ? 'column' : 'row', maxW: welcome ? 620 : (step === 'kind' || step === 'shop' ? 900 : 640),
showBrand: welcome && !phone, showBrandTop: welcome && phone, showRail: !welcome && !phone, showTop: !welcome && phone,
isWelcome: welcome, langs: langs, choices: choices, bullets: [t.w_b1, t.w_b2, t.w_b3].map(function (x) { return { t: x }; }),
railTitle: railTitle, railSub: railSub, steps: steps, hasRailAlt: flow !== 'welcome' && step !== 'building' && step !== 'ready' && step !== 'joinDone', railAlt: railAlt, railAltGo: railAltGo, altInline: phone && flow !== 'welcome' && step !== 'building' && step !== 'ready' && step !== 'joinDone',
stepOf: list.length ? fill(t.stepOf, { n: stepNo, m: stepMax }) : '', stepNo: stepNo, stepMax: Math.max(1, stepMax), pct: list.length ? Math.round(stepNo / Math.max(1, stepMax) * 100) : 100, hasStepOf: !welcome && !phone && list.length > 0, railNote: flow === 'signin', railNoteText: t.signinNote,
title: title, sub: sub, hasSub: !!sub,
showPhone: step === 'phone' || step === 'forgot' || step === 'join', showAgree: step === 'phone', showTaken: step === 'phone' && !!s.taken, showNoInvite: step === 'join' && !!s.noInvite,
phBd: phBad ? '2px solid #B42318' : '1px solid #8A8276', phInvalid: phBad ? 'true' : 'false', phoneHelp: phBad && !s.taken && !s.noInvite ? t.why_phone : t.ph_help, phoneHelpFg: phBad && !s.taken && !s.noInvite ? '#B42318' : '#5B6585',
onPhone: function (e) { self.setState({ phone: (e.target.value || '').replace(/[^\d +\-]/g, '').slice(0, 15), taken: false, noInvite: false, tried: false }); },
toggleAgree: function () { self.setState({ agree: !self.state.agree, tried: false }); }, readTerms: function () { self.toast(t.termsToast); }, goSignin: function () { self.go('signin', true); },
showCode: onCodeStep, phoneShow: digits10 ? phoneShow : '+92 321 4567890', changeNumber: function () { self.go(step === 'reset' ? 'forgot' : (step === 'joinCode' ? 'join' : 'phone')); },
onCode: function (e) { self.setState({ code: (e.target.value || '').replace(/\D/g, '').slice(0, 6), codeBad: false, tried: false }); },
codeBd: codeBad ? '2px solid #B42318' : '1px solid #8A8276', codeInvalid: codeBad ? 'true' : 'false', codeHelp: s.codeBad ? t.codeErr : (codeBad ? t.why_code : t.codeHelp), codeHelpFg: codeBad ? '#B42318' : '#5B6585', codeRole: codeBad ? 'alert' : 'note',
resendLabel: resendLabel, resendOff: s.resendSec > 0, doResend: doResend,
isYou: step === 'you', onName: function (e) { self.setState({ name: e.target.value, tried: false }); }, onEmail: function (e) { self.setState({ email: e.target.value, tried: false }); },
nameBd: s.tried && step === 'you' && !(s.name || '').trim() ? '2px solid #B42318' : '1px solid #8A8276',
emailBd: s.tried && step === 'you' && emailBad ? '2px solid #B42318' : '1px solid #8A8276',
showPw: step === 'you' || step === 'signin' || step === 'reset', isSignin: step === 'signin', showRules: step !== 'signin',
pwLabel: step === 'reset' ? t.l_newpw : t.l_pw, pwType: s.pwShown ? 'text' : 'password', pwAuto: step === 'signin' ? 'current-password' : 'new-password', pwShown: s.pwShown ? 'true' : 'false', pwToggle: s.pwShown ? t.hide : t.show,
togglePw: function () { self.setState({ pwShown: !self.state.pwShown }); }, onPw: function (e) { self.setState({ pw: e.target.value, signBad: self.state.signBad ? 'cleared' : false, tried: false }); },
pwBd: (step === 'signin' && (s.signBad === true || (s.tried && (!pw || pw.length < 4)))) || ((step === 'you' || step === 'reset') && ((s.demo === 'weak' && !pwOk) || (s.tried && !pwOk))) ? '2px solid #B42318' : '1px solid #8A8276',
rules: [rule(r1, t.r1), rule(r2, t.r2), rule(r3, t.r3)], onUser: function (e) { self.setState({ user: e.target.value, signBad: self.state.signBad ? 'cleared' : false, tried: false }); },
userBd: step === 'signin' && (s.signBad === true || (s.tried && (!userTrim || !userValid))) ? '2px solid #B42318' : '1px solid #8A8276', toggleKeep: function () { self.setState({ keep: !self.state.keep }); }, showSignErr: s.signBad === true, goForgot: function () { self.go('forgot'); },
isShop: step === 'shop', onShop: function (e) { self.setState({ shop: e.target.value, tried: false }); }, shopBd: s.tried && step === 'shop' && !(s.shop || '').trim() ? '2px solid #B42318' : '1px solid #8A8276', onCity: function (e) { self.setState({ city: e.target.value, tried: false }); }, cityOther: s.city === 'Other', onCityName: function (e) { self.setState({ cityName: e.target.value, tried: false }); }, onArea: function (e) { self.setState({ area: e.target.value }); },
cities: cities, branches: branches, logoText: initial, logoBg: s.logo ? '#162660' : '#F6F0E7', logoFg: s.logo ? '#D0E6FD' : '#5B6585', logoBd: s.logo ? '0' : '1px dashed #C8BCAA',
logoHelp: s.logo ? t.logoSet : t.logoNone, logoBtn: s.logo ? t.removeLogo : t.addLogo, logoIcon: s.logo ? ICONS.trash : ICONS.upload, toggleLogo: function () { self.setState({ logo: !self.state.logo }); },
showReceipt: !phone, rcName: shopName, rcAddr: (s.area ? s.area + ', ' : '') + cityShown, rcPhone: '+92 ' + (digits10 ? digits10.slice(0, 3) + ' ' + digits10.slice(3) : '321 4567890'),
isKind: step === 'kind', kits: kits, kitCats: kitCats, kitFacts: kitFacts, setsUpTitle: fill(t.setsUp, { k: kitName }),
isBuilding: step === 'building', build: build, isReady: step === 'ready', readyBadge: step === 'ready' && !phone, summary: summary, nexts: nexts,
isJoinPin: step === 'joinPin', onPin: function (e) { self.setState({ pin: (e.target.value || '').replace(/\D/g, '').slice(0, 4), tried: false }); }, onPin2: function (e) { self.setState({ pin2: (e.target.value || '').replace(/\D/g, '').slice(0, 4), tried: false }); },
pinBd: pinEasy || (s.tried && s.pin.length < 4) ? '2px solid #B42318' : '1px solid #8A8276', pin2Bd: (s.pin2.length === 4 && !pinMatch) || (s.tried && !pinMatch) ? '2px solid #B42318' : '1px solid #8A8276',
pinHelp: pinEasy ? t.pinEasy : ((s.pin2.length === 4 || s.tried) && !pinMatch ? t.pinMismatch : t.pinRule), pinHelpFg: pinEasy || ((s.pin2.length === 4 || s.tried) && !pinMatch) ? '#B42318' : '#5B6585', pinRole: pinEasy || ((s.pin2.length === 4 || s.tried) && !pinMatch) ? 'alert' : 'note',
isJoinDone: step === 'joinDone', cans: cans,
hasFooter: !welcome && step !== 'building', hasBack: hasBack, backText: true, back: function () { self.go(backTo[step], true); },
onEnter: onEnter,
why: why, whyFg: s.tried && why ? '#B42318' : '#5B6585', whyWeight: s.tried && why ? 600 : 400, nextLabel: s.busy ? 'Please wait…' : nextLabel, next: next, nextOff: s.busy, busy: s.busy ? 'true' : 'false', nextIsLink: nextIsLink, nextIsBtn: !nextIsLink, nextHref: nextHref, secHas: secHas, secLabel: secLabel, secHref: secHref,
toastOn: !!s.toast
};
}
}

export default class CreateAccount extends CreateAccountBase {
  static defaultProps = DEFAULT_PROPS;

  constructor(props: any) {
    super(props);
    if (!this.state) this.state = {};
  }

  render() {
    const v: any = this.renderVals ? this.renderVals() : {};
    return (
      <>
        <div dir={(v?.dir) == null || (v?.dir) === false ? undefined : (v?.dir) === true ? '' : String(v?.dir)} lang={(v?.langAttr) == null || (v?.langAttr) === false ? undefined : (v?.langAttr) === true ? '' : String(v?.langAttr)} style={dcStyle(("width:100%;max-width:100%;" + dcStr(v?.rootH) + ";position:relative;display:flex;flex-direction:" + dcStr(v?.flow) + ";background:#F1E4D1;color:#162660;font-family:" + dcStr(v?.F?.body) + ";font-size:" + dcStr(v?.F?.base) + "px;line-height:" + dcStr(v?.F?.lh)))}>
          {Boolean(v?.showBrand) ? (
            <aside aria-label="ZYRO Retail POS" style={dcStyle(("width:" + dcStr(v?.brandW) + "px;flex:none;height:100%;box-sizing:border-box;background:#162660;color:#ffffff;padding:" + dcStr(v?.brandPad) + ";display:flex;flex-direction:column;gap:" + dcStr(v?.brandGap) + "px;overflow-y:auto;overflow-x:hidden"))}>
              <div style={dcStyle("display:flex;align-items:center;gap:12px")}>
                <svg role="img" aria-label="ZYRO Retail POS" width="44" height="44" viewBox="0 0 64 64" style={dcStyle("flex:none;display:block;")}><rect width="64" height="64" rx="15" fill="#162660" /><circle cx="30" cy="35" r="16" fill="none" stroke="#FFFFFF" strokeWidth="9.5" strokeLinecap="round" strokeDasharray="76 24.5" transform="rotate(8 30 35)" /><circle cx="44.5" cy="21" r="6.6" fill="#D0E6FD" stroke="#162660" strokeWidth="1.6" /></svg>
                <span style={dcStyle("font-family:Outfit,sans-serif;font-size:20px;font-weight:700")}>{"ZYRO Retail POS"}</span>
              </div>
              <p style={dcStyle(("margin:0;font-family:" + dcStr(v?.F?.head) + ";font-size:" + dcStr(v?.F?.pitch) + "px;font-weight:700;line-height:" + dcStr(v?.F?.lhHead) + ";max-width:500px"))}>{dcStr(v?.t?.w_pitch)}</p>
              <ul style={dcStyle("margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px")}>
                {(v?.bullets || []).map((b: any, $index: number) => (
                  <li key={$index} style={dcStyle(("display:flex;align-items:center;gap:12px;font-size:" + dcStr(v?.F?.base) + "px;color:#BFD0EE"))}>
                    <span style={dcStyle("width:26px;height:26px;flex:none;border-radius:999px;background:rgba(255,255,255,.1);color:#7FD6A4;display:flex;align-items:center;justify-content:center")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={String(v?.ic?.check || '')} /></svg>
                    </span>
                    <span>{dcStr(b?.t)}</span>
                  </li>
                ))}
              </ul>
              <figure style={dcStyle(("margin:auto 0 0;display:" + dcStr(v?.figDisp) + ";flex-direction:column;gap:10px"))}>
                <div aria-hidden="true" inert={true} style={dcStyle(("width:" + dcStr(v?.figW) + "px;height:" + dcStr(v?.figH) + "px;max-width:100%;border-radius:14px;overflow:hidden;box-shadow:0 18px 48px rgba(12,20,50,.3);background:#F1E4D1;position:relative;direction:ltr"))}>
                  <div style={dcStyle(("position:absolute;left:0;top:0;width:1280px;height:800px;transform:scale(" + dcStr(v?.figS) + ");transform-origin:0 0;pointer-events:none"))}>
                    <App kit={v?.kit} preview={true} />
                  </div>
                </div>
                <figcaption style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;color:#A9BCE0"))}>{dcStr(v?.t?.w_cap)}</figcaption>
              </figure>
            </aside>
          ) : null}

          {Boolean(v?.showBrandTop) ? (
            <div style={dcStyle("flex:none;background:#162660;color:#ffffff;padding:20px 16px 18px;display:flex;flex-direction:column;gap:12px")}>
              <div style={dcStyle("display:flex;align-items:center;gap:10px")}>
                <svg role="img" aria-label="ZYRO Retail POS" width="36" height="36" viewBox="0 0 64 64" style={dcStyle("flex:none;display:block;")}><rect width="64" height="64" rx="15" fill="#162660" /><circle cx="30" cy="35" r="16" fill="none" stroke="#FFFFFF" strokeWidth="9.5" strokeLinecap="round" strokeDasharray="76 24.5" transform="rotate(8 30 35)" /><circle cx="44.5" cy="21" r="6.6" fill="#D0E6FD" stroke="#162660" strokeWidth="1.6" /></svg>
                <span style={dcStyle("font-family:Outfit,sans-serif;font-size:17px;font-weight:700")}>{"ZYRO Retail POS"}</span>
              </div>
              <p style={dcStyle(("margin:0;font-family:" + dcStr(v?.F?.head) + ";font-size:" + dcStr(v?.F?.pitchPhone) + "px;font-weight:700;line-height:" + dcStr(v?.F?.lhHead)))}>{dcStr(v?.t?.w_pitch)}</p>
            </div>
          ) : null}

          {Boolean(v?.showRail) ? (
            <aside aria-label={String(v?.railTitle || '')} style={dcStyle(("width:" + dcStr(v?.railW) + "px;flex:none;height:100%;box-sizing:border-box;background:#162660;color:#ffffff;padding:36px 28px 32px;display:flex;flex-direction:column;gap:28px;overflow-y:auto"))}>
              <div style={dcStyle("display:flex;align-items:center;gap:12px")}>
                <svg role="img" aria-label="ZYRO Retail POS" width="44" height="44" viewBox="0 0 64 64" style={dcStyle("flex:none;display:block;")}><rect width="64" height="64" rx="15" fill="#162660" /><circle cx="30" cy="35" r="16" fill="none" stroke="#FFFFFF" strokeWidth="9.5" strokeLinecap="round" strokeDasharray="76 24.5" transform="rotate(8 30 35)" /><circle cx="44.5" cy="21" r="6.6" fill="#D0E6FD" stroke="#162660" strokeWidth="1.6" /></svg>
                <span style={dcStyle("display:flex;flex-direction:column;gap:2px")}>
                  <span style={dcStyle(("font-family:" + dcStr(v?.F?.head) + ";font-size:" + dcStr(v?.F?.railTitle) + "px;font-weight:700;line-height:" + dcStr(v?.F?.lhHead)))}>{dcStr(v?.railTitle)}</span>
                  <span style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;color:#BFD0EE"))}>{dcStr(v?.railSub)}</span>
                </span>
              </div>
              <ol aria-label={String(v?.t?.stepsLabel || '')} style={dcStyle("list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px")}>
                {(v?.steps || []).map((st: any, $index: number) => (
                  <li key={$index} aria-current={st?.cur === 'step' ? 'step' : undefined} style={dcStyle(("display:flex;align-items:center;gap:14px;min-height:52px;padding:4px 12px;border-radius:12px;background:" + dcStr(st?.bg)))}>
                    <span style={dcStyle(("width:30px;height:30px;flex:none;border-radius:999px;background:" + dcStr(st?.dotBg) + ";color:" + dcStr(st?.dotFg) + ";border:" + dcStr(st?.dotBorder) + ";display:flex;align-items:center;justify-content:center;font-family:Outfit,sans-serif;font-size:13px;font-weight:700;box-sizing:border-box"))}>
                      {Boolean(st?.done) ? (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={String(v?.ic?.check || '')} /></svg>) : null}
                      {Boolean(st?.num) ? dcStr(st?.n) : null}
                    </span>
                    <span style={dcStyle(("flex:1;font-size:" + dcStr(v?.F?.rail) + "px;font-weight:" + dcStr(st?.w) + ";color:" + dcStr(st?.fg)))}>{dcStr(st?.label)}</span>
                    <span className="sr">{dcStr(st?.sr)}</span>
                  </li>
                ))}
              </ol>
              {Boolean(v?.railNote) ? (<p style={dcStyle(("margin:0;font-size:" + dcStr(v?.F?.base) + "px;line-height:" + dcStr(v?.F?.lh) + ";color:#BFD0EE"))}>{dcStr(v?.railNoteText)}</p>) : null}
              <div style={dcStyle("margin-top:auto;display:flex;flex-direction:column;gap:12px")}>
                {Boolean(v?.hasRailAlt) ? (
                  <button type="button" className="bt" onClick={v?.railAltGo} style={dcStyle(("align-self:flex-start;min-height:44px;padding:0;border:0;background:transparent;color:#ffffff;font-size:" + dcStr(v?.F?.base) + "px;font-weight:600;text-decoration:underline;text-underline-offset:3px;text-align:start"))}>{dcStr(v?.railAlt)}</button>
                ) : null}
                <p style={dcStyle(("margin:0;font-size:" + dcStr(v?.F?.small) + "px;line-height:" + dcStr(v?.F?.lh) + ";color:#BFD0EE"))}>{dcStr(v?.t?.help)}</p>
              </div>
            </aside>
          ) : null}

          {Boolean(v?.showTop) ? (
            <div style={dcStyle("flex:none;padding:14px 16px 10px;display:flex;flex-direction:column;gap:10px;background:#ffffff;border-bottom:1px solid #E9E1D5")}>
              <div style={dcStyle("display:flex;align-items:center;gap:10px")}>
                <svg role="img" aria-label="ZYRO Retail POS" width="32" height="32" viewBox="0 0 64 64" style={dcStyle("flex:none;display:block;")}><rect width="64" height="64" rx="15" fill="#162660" /><circle cx="30" cy="35" r="16" fill="none" stroke="#FFFFFF" strokeWidth="9.5" strokeLinecap="round" strokeDasharray="76 24.5" transform="rotate(8 30 35)" /><circle cx="44.5" cy="21" r="6.6" fill="#D0E6FD" stroke="#162660" strokeWidth="1.6" /></svg>
                <span style={dcStyle(("flex:1;font-family:" + dcStr(v?.F?.head) + ";font-size:" + dcStr(v?.F?.small) + "px;font-weight:700"))}>{dcStr(v?.railTitle)}</span>
                <span style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;color:#5B6585"))}>{dcStr(v?.stepOf)}</span>
              </div>
              <div role="progressbar" aria-label={String(v?.t?.stepsLabel || '')} aria-valuemin={1} aria-valuemax={Number(v?.stepMax || 1)} aria-valuenow={Number(v?.stepNo || 1)} aria-valuetext={String(v?.stepOf || '')} style={dcStyle("height:6px;border-radius:999px;background:#ECE4D8;overflow:hidden")}>
                <span style={dcStyle(("display:block;height:100%;width:" + dcStr(v?.pct) + "%;background:#162660;border-radius:999px;transition:width .3s ease-out"))}></span>
              </div>
            </div>
          ) : null}

          <div style={dcStyle("flex:1;min-width:0;min-height:0;display:flex;flex-direction:column")}>
            <div style={dcStyle(("flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:" + dcStr(v?.L?.padTop) + "px " + dcStr(v?.L?.padX) + "px 24px;display:flex;flex-direction:column"))}>
              <div style={dcStyle(("max-width:" + dcStr(v?.maxW) + "px;width:100%;display:flex;flex-direction:column;gap:18px;margin:" + dcStr(v?.innerM)))}>
                {Boolean(v?.isWelcome) ? (
                  <div style={dcStyle("display:flex;justify-content:flex-end")}>
                    <div role="group" aria-label={String(v?.t?.w_lang || '')} style={dcStyle("display:flex;flex-wrap:wrap;gap:2px;padding:3px;border-radius:12px;background:#ECE4D8")}>
                      {(v?.langs || []).map((lg: any, $index: number) => (
                        <button key={$index} type="button" aria-pressed={lg?.on === 'true'} lang={String(lg?.code || 'en')} onClick={lg?.pick} style={dcStyle(("height:40px;padding:0 12px;border:0;border-radius:9px;background:" + dcStr(lg?.bg) + ";color:" + dcStr(lg?.fg) + ";box-shadow:" + dcStr(lg?.sh) + ";font-family:" + dcStr(lg?.font) + ";font-size:" + dcStr(lg?.size) + "px;font-weight:600"))}>{dcStr(lg?.label)}</button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div style={dcStyle("display:flex;flex-direction:column;gap:6px")}>
                  {Boolean(v?.hasStepOf) ? (<span style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;font-weight:600;color:#5B6585"))}>{dcStr(v?.stepOf)}</span>) : null}
                  <h1 style={dcStyle(("margin:0;font-family:" + dcStr(v?.F?.head) + ";font-size:" + dcStr(v?.F?.h1) + "px;font-weight:700;line-height:" + dcStr(v?.F?.lhHead)))}>{dcStr(v?.title)}</h1>
                  {Boolean(v?.hasSub) ? (<p style={dcStyle(("margin:0;font-size:" + dcStr(v?.F?.base) + "px;line-height:" + dcStr(v?.F?.lh) + ";color:#454F70"))}>{dcStr(v?.sub)}</p>) : null}
                </div>

                {Boolean(v?.isWelcome) ? (
                  <>
                    <div role="list" style={dcStyle("display:flex;flex-direction:column;gap:12px")}>
                      {(v?.choices || []).map((c: any, $index: number) => (
                        <div key={$index} role="listitem">
                          <button type="button" className={String(c?.cls || '')} onClick={c?.go} style={dcStyle(("width:100%;min-height:" + dcStr(v?.L?.choiceH) + "px;display:flex;align-items:center;gap:14px;padding:14px 16px;border:" + dcStr(c?.bd) + ";border-radius:16px;background:" + dcStr(c?.bg) + ";color:" + dcStr(c?.fg) + ";text-align:start;font-family:" + dcStr(v?.F?.body)))}>
                            <span style={dcStyle(("width:48px;height:48px;flex:none;border-radius:999px;background:" + dcStr(c?.icBg) + ";color:" + dcStr(c?.icFg) + ";display:flex;align-items:center;justify-content:center"))}>
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={String(c?.d || '')} /></svg>
                            </span>
                            <span style={dcStyle("flex:1;min-width:0;display:flex;flex-direction:column;gap:3px")}>
                              <span style={dcStyle(("font-size:" + dcStr(v?.F?.choice) + "px;font-weight:700;line-height:" + dcStr(v?.F?.lhHead)))}>{dcStr(c?.t)}</span>
                              <span style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;line-height:" + dcStr(v?.F?.lh) + ";color:" + dcStr(c?.subFg)))}>{dcStr(c?.s)}</span>
                            </span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dcStyle(("flex:none;transform:" + dcStr(v?.flip)))}><path d="M9 6l6 6-6 6" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <p style={dcStyle(("margin:0;font-size:" + dcStr(v?.F?.small) + "px;line-height:" + dcStr(v?.F?.lh) + ";color:#5B6585"))}>{dcStr(v?.t?.help)}</p>
                  </>
                ) : null}

                {Boolean(v?.showPhone) ? (
                  <>
                    <div style={dcStyle("display:flex;flex-direction:column;gap:6px;max-width:440px;width:100%")}>
                      <label htmlFor="ca-ph" style={dcStyle(("font-size:" + dcStr(v?.F?.label) + "px;font-weight:600;color:#454F70"))}>{dcStr(v?.t?.l_mobile)}</label>
                      <div dir="ltr" style={dcStyle(("display:flex;align-items:stretch;height:56px;border:" + dcStr(v?.phBd) + ";border-radius:12px;background:#ffffff;overflow:hidden"))}>
                        <span style={dcStyle("flex:none;padding:0 14px;display:flex;align-items:center;background:#F8F2E9;border-right:1px solid #E9E1D5;font-family:Outfit,sans-serif;font-size:18px;font-weight:600;color:#454F70")}>{"+92"}</span>
                        <input id="ca-ph" type="tel" inputMode="numeric" autoComplete="tel-national" value={dcStr(v?.s?.phone)} onChange={v?.onPhone} onKeyDown={v?.onEnter} placeholder="300 1234567 or 0300 1234567" aria-describedby="ca-ph-h" aria-invalid={v?.phInvalid === 'true'} style={dcStyle("flex:1;min-width:0;border:0;outline:0;padding:0 14px;font-family:Outfit,sans-serif;font-size:19px;font-weight:600;letter-spacing:.02em;background:transparent;color:#162660")} />
                      </div>
                      <span id="ca-ph-h" style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;line-height:" + dcStr(v?.F?.lh) + ";color:" + dcStr(v?.phoneHelpFg)))}>{dcStr(v?.phoneHelp)}</span>
                    </div>
                    {Boolean(v?.showAgree) ? (
                      <div style={dcStyle("display:flex;flex-direction:column;gap:2px")}>
                        <label style={dcStyle("display:flex;align-items:flex-start;gap:12px;min-height:44px;cursor:pointer")}>
                          <input type="checkbox" checked={Boolean(v?.s?.agree)} onChange={v?.toggleAgree} style={dcStyle("width:22px;height:22px;margin:2px 0 0;flex:none;accent-color:#162660")} />
                          <span style={dcStyle(("font-size:" + dcStr(v?.F?.base) + "px;line-height:" + dcStr(v?.F?.lh)))}>{dcStr(v?.t?.agree)}</span>
                        </label>
                        <button type="button" className="bt" onClick={v?.readTerms} style={dcStyle(("align-self:flex-start;height:44px;padding:0 0 0 34px;border:0;background:transparent;color:#2E46A0;font-size:" + dcStr(v?.F?.small) + "px;font-weight:600;text-decoration:underline;text-underline-offset:3px"))}>{dcStr(v?.t?.readTerms)}</button>
                      </div>
                    ) : null}
                    {Boolean(v?.showTaken) ? (
                      <div role="alert" style={dcStyle("display:flex;gap:12px;padding:14px 16px;border-radius:14px;background:#FDF0EF;color:#B42318;max-width:560px")}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dcStyle("flex:none;margin-top:2px")}><path d={String(v?.ic?.warn || '')} /></svg>
                        <span style={dcStyle("flex:1;display:flex;flex-direction:column;gap:8px")}>
                          <b style={dcStyle(("font-size:" + dcStr(v?.F?.base) + "px"))}>{dcStr(v?.t?.taken_t)}</b>
                          <span style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;line-height:" + dcStr(v?.F?.lh)))}>{dcStr(v?.t?.taken_b)}</span>
                          <button type="button" className="bs" onClick={v?.goSignin} style={dcStyle(("align-self:flex-start;height:44px;padding:0 14px;border:1px solid #B42318;border-radius:12px;background:#ffffff;color:#B42318;font-size:" + dcStr(v?.F?.small) + "px;font-weight:700"))}>{dcStr(v?.t?.signInstead)}</button>
                        </span>
                      </div>
                    ) : null}
                    {Boolean(v?.showNoInvite) ? (
                      <div role="alert" style={dcStyle("display:flex;gap:12px;padding:14px 16px;border-radius:14px;background:#FFF3C4;color:#6B4E00;max-width:560px")}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dcStyle("flex:none;margin-top:2px")}><path d={String(v?.ic?.info || '')} /></svg>
                        <span style={dcStyle("flex:1;display:flex;flex-direction:column;gap:4px")}>
                          <b style={dcStyle(("font-size:" + dcStr(v?.F?.base) + "px"))}>{dcStr(v?.t?.noInvite_t)}</b>
                          <span style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;line-height:" + dcStr(v?.F?.lh)))}>{dcStr(v?.t?.noInvite_b)}</span>
                        </span>
                      </div>
                    ) : null}
                  </>
                ) : null}

                {Boolean(v?.showCode) ? (
                  <>
                    <div style={dcStyle("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <span dir="ltr" style={dcStyle("height:36px;padding:0 12px;border-radius:999px;background:#ffffff;border:1px solid #E9E1D5;display:inline-flex;align-items:center;gap:8px;font-family:Outfit,sans-serif;font-size:15px;font-weight:600")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={String(v?.ic?.phone || '')} /></svg>
                        {dcStr(v?.phoneShow)}
                      </span>
                      <button type="button" className="bt" onClick={v?.changeNumber} style={dcStyle(("height:44px;padding:0 6px;border:0;background:transparent;color:#2E46A0;font-size:" + dcStr(v?.F?.small) + "px;font-weight:600"))}>{dcStr(v?.t?.changeNum)}</button>
                    </div>
                    <div style={dcStyle("display:flex;flex-direction:column;gap:6px;max-width:360px;width:100%")}>
                      <label htmlFor="ca-code" style={dcStyle(("font-size:" + dcStr(v?.F?.label) + "px;font-weight:600;color:#454F70"))}>{dcStr(v?.t?.l_code)}</label>
                      <input id="ca-code" dir="ltr" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={dcStr(v?.s?.code)} onChange={v?.onCode} onKeyDown={v?.onEnter} placeholder="••••••" aria-describedby="ca-code-h" aria-invalid={v?.codeInvalid === 'true'} style={dcStyle(("height:64px;border:" + dcStr(v?.codeBd) + ";border-radius:12px;background:#ffffff;padding:0 18px;font-family:'JetBrains Mono',monospace;font-size:28px;font-weight:500;letter-spacing:.35em;color:#162660;text-align:center"))} />
                      <span id="ca-code-h" role={String(v?.codeRole || 'note')} style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;line-height:" + dcStr(v?.F?.lh) + ";color:" + dcStr(v?.codeHelpFg)))}>{dcStr(v?.codeHelp)}</span>
                    </div>
                    <button type="button" className="bs" disabled={Boolean(v?.resendOff)} onClick={v?.doResend} style={dcStyle(("align-self:flex-start;height:44px;padding:0 14px;border:1px solid #D9CFC0;border-radius:12px;background:#ffffff;font-size:" + dcStr(v?.F?.small) + "px;font-weight:600"))}>{dcStr(v?.resendLabel)}</button>
                  </>
                ) : null}

                {Boolean(v?.isYou) ? (
                  <>
                    <div style={dcStyle("display:flex;flex-direction:column;gap:6px;max-width:440px;width:100%")}>
                      <label htmlFor="ca-nm" style={dcStyle(("font-size:" + dcStr(v?.F?.label) + "px;font-weight:600;color:#454F70"))}>{dcStr(v?.t?.l_name)}</label>
                      <input id="ca-nm" type="text" autoComplete="name" value={dcStr(v?.s?.name)} onChange={v?.onName} onKeyDown={v?.onEnter} placeholder="Hamza Sheikh" style={dcStyle(("height:52px;border:" + dcStr(v?.nameBd) + ";border-radius:12px;background:#ffffff;padding:0 14px;font-size:17px;color:#162660"))} />
                    </div>
                    <div style={dcStyle("display:flex;flex-direction:column;gap:6px;max-width:440px;width:100%")}>
                      <label htmlFor="ca-em" style={dcStyle(("font-size:" + dcStr(v?.F?.label) + "px;font-weight:600;color:#454F70"))}>{dcStr(v?.t?.l_email)}</label>
                      <input id="ca-em" dir="ltr" type="email" autoComplete="email" value={dcStr(v?.s?.email)} onChange={v?.onEmail} onKeyDown={v?.onEnter} placeholder="name@yourshop.pk" aria-describedby="ca-em-h" style={dcStyle(("height:52px;border:" + dcStr(v?.emailBd) + ";border-radius:12px;background:#ffffff;padding:0 14px;font-size:17px;color:#162660"))} />
                      <span id="ca-em-h" style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;line-height:" + dcStr(v?.F?.lh) + ";color:#5B6585"))}>{dcStr(v?.t?.h_email)}</span>
                    </div>
                  </>
                ) : null}

                {Boolean(v?.showPw) ? (
                  <>
                    {Boolean(v?.isSignin) ? (
                      <div style={dcStyle("display:flex;flex-direction:column;gap:6px;max-width:440px;width:100%")}>
                        <label htmlFor="ca-us" style={dcStyle(("font-size:" + dcStr(v?.F?.label) + "px;font-weight:600;color:#454F70"))}>{dcStr(v?.t?.l_user)}</label>
                        <input id="ca-us" dir="ltr" type="text" autoComplete="username" value={dcStr(v?.s?.user)} onChange={v?.onUser} onKeyDown={v?.onEnter} placeholder="0321 4567890 or owner@shop.pk" style={dcStyle(("height:52px;border:" + dcStr(v?.userBd) + ";border-radius:12px;background:#ffffff;padding:0 14px;font-size:17px;color:#162660"))} />
                      </div>
                    ) : null}
                    <div style={dcStyle("display:flex;flex-direction:column;gap:6px;max-width:440px;width:100%")}>
                      <label htmlFor="ca-pw" style={dcStyle(("font-size:" + dcStr(v?.F?.label) + "px;font-weight:600;color:#454F70"))}>{dcStr(v?.pwLabel)}</label>
                      <div dir="ltr" style={dcStyle(("display:flex;align-items:center;height:52px;border:" + dcStr(v?.pwBd) + ";border-radius:12px;background:#ffffff;overflow:hidden"))}>
                        <input id="ca-pw" type={String(v?.pwType || 'password')} autoComplete={String(v?.pwAuto || 'current-password')} value={dcStr(v?.s?.pw)} onChange={v?.onPw} onKeyDown={v?.onEnter} placeholder="Enter password" aria-describedby="ca-pw-h" style={dcStyle("flex:1;min-width:0;height:100%;border:0;outline:0;padding:0 14px;font-size:17px;background:transparent;color:#162660")} />
                        <button type="button" className="bs" onClick={v?.togglePw} aria-pressed={v?.pwShown === 'true'} style={dcStyle(("height:40px;margin:0 6px;padding:0 12px;border:0;border-radius:9px;background:#F6F0E7;font-size:" + dcStr(v?.F?.small) + "px;font-weight:600;color:#162660;flex:none"))}>{dcStr(v?.pwToggle)}</button>
                      </div>
                      {Boolean(v?.showRules) ? (
                        <ul id="ca-pw-h" style={dcStyle("margin:4px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:4px")}>
                          {(v?.rules || []).map((r: any, $index: number) => (
                            <li key={$index} style={dcStyle(("display:flex;align-items:center;gap:8px;font-size:" + dcStr(v?.F?.small) + "px;color:" + dcStr(r?.fg)))}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={String(r?.d || '')} /></svg>
                              <span>{dcStr(r?.t)}</span>
                              <span className="sr">{dcStr(r?.sr)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {Boolean(v?.isSignin) ? (<span id="ca-pw-h" className="sr">{dcStr(v?.t?.l_pw2)}</span>) : null}
                    </div>
                    {Boolean(v?.isSignin) ? (
                      <>
                        <label style={dcStyle("display:flex;align-items:flex-start;gap:12px;min-height:44px;cursor:pointer;max-width:440px")}>
                          <input type="checkbox" checked={Boolean(v?.s?.keep)} onChange={v?.toggleKeep} style={dcStyle("width:22px;height:22px;margin:2px 0 0;flex:none;accent-color:#162660")} />
                          <span style={dcStyle("display:flex;flex-direction:column;gap:2px")}>
                            <span style={dcStyle(("font-size:" + dcStr(v?.F?.base) + "px"))}>{dcStr(v?.t?.keep)}</span>
                            <span style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;color:#5B6585"))}>{dcStr(v?.t?.keepHelp)}</span>
                          </span>
                        </label>
                        {Boolean(v?.showSignErr) ? (
                          <div role="alert" style={dcStyle(("display:flex;gap:10px;padding:12px 14px;border-radius:12px;background:#FDF0EF;color:#B42318;max-width:440px;font-size:" + dcStr(v?.F?.small) + "px;line-height:" + dcStr(v?.F?.lh)))}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dcStyle("flex:none;margin-top:1px")}><path d={String(v?.ic?.warn || '')} /></svg>
                            <span>{dcStr(v?.t?.signErr)}</span>
                          </div>
                        ) : null}
                        <div style={dcStyle("display:flex;flex-wrap:wrap;gap:4px 20px")}>
                          <button type="button" className="bt" onClick={v?.goForgot} style={dcStyle(("height:44px;padding:0;border:0;background:transparent;color:#2E46A0;font-size:" + dcStr(v?.F?.base) + "px;font-weight:600"))}>{dcStr(v?.t?.forgot)}</button>
                          <a href={dcHref("SignIn.dc.html")} style={dcStyle(("min-height:44px;display:inline-flex;align-items:center;color:#2E46A0;font-size:" + dcStr(v?.F?.base) + "px;font-weight:600"))} onClick={dcLinkClick("SignIn.dc.html", undefined)}>{dcStr(v?.t?.staffSignin)}</a>
                        </div>
                      </>
                    ) : null}
                  </>
                ) : null}

                {Boolean(v?.isShop) ? (
                  <div style={dcStyle("display:flex;gap:28px;align-items:flex-start;flex-wrap:wrap")}>
                    <div style={dcStyle("flex:1;min-width:260px;max-width:460px;width:100%;display:flex;flex-direction:column;gap:16px")}>
                      <div style={dcStyle("display:flex;flex-direction:column;gap:6px")}>
                        <label htmlFor="ca-sn" style={dcStyle(("font-size:" + dcStr(v?.F?.label) + "px;font-weight:600;color:#454F70"))}>{dcStr(v?.t?.l_shopName)}</label>
                        <input id="ca-sn" type="text" autoComplete="organization" value={dcStr(v?.s?.shop)} onChange={v?.onShop} onKeyDown={v?.onEnter} placeholder="Stride Footwear" style={dcStyle(("height:52px;border:" + dcStr(v?.shopBd) + ";border-radius:12px;background:#ffffff;padding:0 14px;font-size:17px;color:#162660"))} />
                      </div>
                      <div style={dcStyle("display:flex;gap:12px;flex-wrap:wrap")}>
                        <div style={dcStyle("flex:1;min-width:130px;display:flex;flex-direction:column;gap:6px")}>
                          <label htmlFor="ca-ct" style={dcStyle(("font-size:" + dcStr(v?.F?.label) + "px;font-weight:600;color:#454F70"))}>{dcStr(v?.t?.l_city)}</label>
                          <select id="ca-ct" onChange={v?.onCity} style={dcStyle("height:52px;border:1px solid #8A8276;border-radius:12px;background:#ffffff;padding:0 12px;font-size:17px;color:#162660")} value={dcStr(v?.s?.city)}>
                            {(v?.cities || []).map((ci: any, $index: number) => (
                              <option key={$index} value={String(ci?.v || '')}>{dcStr(ci?.v)}</option>
                            ))}
                          </select>
                        </div>
                        <div style={dcStyle("flex:1.3;min-width:150px;display:flex;flex-direction:column;gap:6px")}>
                          <label htmlFor="ca-ar" style={dcStyle(("font-size:" + dcStr(v?.F?.label) + "px;font-weight:600;color:#454F70"))}>{dcStr(v?.t?.l_area)}</label>
                          <input id="ca-ar" type="text" autoComplete="address-line1" value={dcStr(v?.s?.area)} onChange={v?.onArea} onKeyDown={v?.onEnter} placeholder="Liberty Market" style={dcStyle("height:52px;border:1px solid #8A8276;border-radius:12px;background:#ffffff;padding:0 14px;font-size:17px;color:#162660")} />
                        </div>
                      </div>
                      {Boolean(v?.cityOther) ? (
                        <div style={dcStyle("display:flex;flex-direction:column;gap:6px")}>
                          <label htmlFor="ca-oc" style={dcStyle(("font-size:" + dcStr(v?.F?.label) + "px;font-weight:600;color:#454F70"))}>{dcStr(v?.t?.l_cityName)}</label>
                          <input id="ca-oc" type="text" autoComplete="address-level2" value={dcStr(v?.s?.cityName)} onChange={v?.onCityName} onKeyDown={v?.onEnter} placeholder="Sargodha" style={dcStyle("height:52px;border:1px solid #8A8276;border-radius:12px;background:#ffffff;padding:0 14px;font-size:17px;color:#162660")} />
                        </div>
                      ) : null}
                      <div style={dcStyle("display:flex;flex-direction:column;gap:6px")}>
                        <span id="ca-br" style={dcStyle(("font-size:" + dcStr(v?.F?.label) + "px;font-weight:600;color:#454F70"))}>{dcStr(v?.t?.l_branches)}</span>
                        <div role="radiogroup" aria-labelledby="ca-br" style={dcStyle("display:flex;gap:8px")}>
                          {(v?.branches || []).map((b: any, $index: number) => (
                            <button key={$index} type="button" role="radio" aria-checked={b?.on === 'true'} onClick={b?.pick} style={dcStyle(("flex:1;height:48px;border:" + dcStr(b?.bd) + ";border-radius:12px;background:" + dcStr(b?.bg) + ";font-size:" + dcStr(v?.F?.small) + "px;font-weight:600;color:#162660"))}>{dcStr(b?.t)}</button>
                          ))}
                        </div>
                        <span style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;color:#5B6585"))}>{dcStr(v?.t?.branchHelp)}</span>
                      </div>
                      <div style={dcStyle("display:flex;align-items:center;gap:12px;flex-wrap:wrap")}>
                        <span aria-hidden="true" style={dcStyle(("width:52px;height:52px;flex:none;border-radius:14px;background:" + dcStr(v?.logoBg) + ";color:" + dcStr(v?.logoFg) + ";border:" + dcStr(v?.logoBd) + ";display:flex;align-items:center;justify-content:center;font-family:Outfit,sans-serif;font-size:22px;font-weight:700"))}>{dcStr(v?.logoText)}</span>
                        <span style={dcStyle("flex:1;min-width:140px;display:flex;flex-direction:column;gap:2px")}>
                          <span style={dcStyle(("font-size:" + dcStr(v?.F?.label) + "px;font-weight:600;color:#454F70"))}>{dcStr(v?.t?.l_logo)}</span>
                          <span style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;color:#5B6585"))}>{dcStr(v?.logoHelp)}</span>
                        </span>
                        <button type="button" className="bs" onClick={v?.toggleLogo} style={dcStyle(("height:44px;padding:0 14px;border:1px solid #D9CFC0;border-radius:12px;background:#ffffff;font-size:" + dcStr(v?.F?.small) + "px;font-weight:600;display:flex;align-items:center;gap:6px"))}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={String(v?.logoIcon || '')} /></svg>
                          {dcStr(v?.logoBtn)}
                        </button>
                      </div>
                    </div>
                    {Boolean(v?.showReceipt) ? (
                      <figure style={dcStyle("margin:0;width:260px;flex:none;display:flex;flex-direction:column;gap:8px")}>
                        <figcaption style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;font-weight:600;color:#5B6585"))}>{dcStr(v?.t?.receiptPrev)}</figcaption>
                        <div dir="ltr" style={dcStyle("background:#ffffff;border-radius:4px;box-shadow:0 1px 2px rgba(22,30,60,.08);padding:18px 16px 22px;display:flex;flex-direction:column;align-items:center;gap:4px;font-family:'JetBrains Mono',monospace;color:#111111;text-align:center")}>
                          {Boolean(v?.s?.logo) ? (<span style={dcStyle("width:40px;height:40px;border-radius:10px;border:2px solid #111111;display:flex;align-items:center;justify-content:center;font-family:Outfit,sans-serif;font-size:20px;font-weight:700;margin-bottom:4px")}>{dcStr(v?.logoText)}</span>) : null}
                          <span style={dcStyle("font-family:Outfit,sans-serif;font-size:17px;font-weight:700")}>{dcStr(v?.rcName)}</span>
                          <span style={dcStyle("font-size:12px;color:#555555")}>{dcStr(v?.rcAddr)}</span>
                          <span style={dcStyle("font-size:12px;color:#555555")}>{dcStr(v?.rcPhone)}</span>
                          <span aria-hidden="true" style={dcStyle("width:100%;border-top:1px dashed #9A9A9A;margin:10px 0 6px")}></span>
                          <span style={dcStyle("width:100%;display:flex;justify-content:space-between;font-size:12px;color:#555555")}><span>{"Bill 1"}</span><span>{"14 Nov 2026"}</span></span>
                          <span aria-hidden="true" style={dcStyle("width:100%;display:flex;justify-content:space-between;font-size:12px;color:#555555")}><span>{"…"}</span><span>{"…"}</span></span>
                        </div>
                      </figure>
                    ) : null}
                  </div>
                ) : null}

                {Boolean(v?.isKind) ? (
                  <>
                    <div role="radiogroup" aria-label={String(v?.t?.h_kind || '')} style={dcStyle(("display:grid;grid-template-columns:repeat(" + dcStr(v?.L?.kindCols) + ",minmax(0,1fr));gap:10px"))}>
                      {(v?.kits || []).map((k: any, $index: number) => (
                        <button key={$index} type="button" role="radio" aria-checked={k?.on === 'true'} onClick={k?.pick} className="opt" style={dcStyle(("min-height:" + dcStr(v?.L?.kindH) + "px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:6px;padding:12px 14px;border:" + dcStr(k?.bd) + ";border-radius:14px;background:" + dcStr(k?.bg) + ";text-align:start;color:#162660;font-family:" + dcStr(v?.F?.body)))}>
                          <span style={dcStyle(("width:36px;height:36px;border-radius:999px;background:" + dcStr(k?.icBg) + ";color:" + dcStr(k?.icFg) + ";display:flex;align-items:center;justify-content:center"))}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={String(k?.d || '')} /></svg>
                          </span>
                          <span style={dcStyle(("font-size:" + dcStr(v?.F?.base) + "px;font-weight:700;line-height:1.25"))}>{dcStr(k?.name)}</span>
                          <span style={dcStyle(("font-size:" + dcStr(v?.F?.tiny) + "px;line-height:1.35;color:#5B6585"))}>{dcStr(k?.sub)}</span>
                        </button>
                      ))}
                    </div>
                    <section aria-labelledby="ca-su" style={dcStyle("background:#ffffff;border:1px solid #E9E1D5;border-radius:16px;padding:14px 16px;display:flex;flex-direction:column;gap:10px")}>
                      <h2 id="ca-su" style={dcStyle(("margin:0;font-size:" + dcStr(v?.F?.base) + "px;font-weight:700"))}>{dcStr(v?.setsUpTitle)}</h2>
                      <div style={dcStyle(("display:grid;grid-template-columns:" + dcStr(v?.L?.suCols) + ";gap:10px 20px"))}>
                        <span style={dcStyle("display:flex;flex-direction:column;gap:6px")}>
                          <span style={dcStyle(("font-size:" + dcStr(v?.F?.tiny) + "px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#5B6585"))}>{dcStr(v?.t?.k_cats)}</span>
                          <span style={dcStyle("display:flex;gap:6px;flex-wrap:wrap")}>
                            {(v?.kitCats || []).map((kc: any, $index: number) => (
                              <span key={$index} style={dcStyle("height:30px;padding:0 10px;border-radius:999px;background:#F6F0E7;font-size:13px;font-weight:600;display:inline-flex;align-items:center")}>{dcStr(kc?.t)}</span>
                            ))}
                          </span>
                        </span>
                        {(v?.kitFacts || []).map((kf: any, $index: number) => (
                          <span key={$index} style={dcStyle("display:flex;flex-direction:column;gap:4px")}>
                            <span style={dcStyle(("font-size:" + dcStr(v?.F?.tiny) + "px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#5B6585"))}>{dcStr(kf?.k)}</span>
                            <span style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;line-height:1.4"))}>{dcStr(kf?.v)}</span>
                          </span>
                        ))}
                      </div>
                    </section>
                  </>
                ) : null}

                {Boolean(v?.isBuilding) ? (
                  <ul aria-live="polite" style={dcStyle("margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px;max-width:560px")}>
                    {(v?.build || []).map((bd: any, $index: number) => (
                      <li key={$index} style={dcStyle(("display:flex;align-items:center;gap:14px;min-height:52px;padding:6px 14px;border-radius:14px;background:" + dcStr(bd?.bg) + ";border:1px solid #E9E1D5"))}>
                        <span style={dcStyle(("width:30px;height:30px;flex:none;border-radius:999px;background:" + dcStr(bd?.dotBg) + ";color:" + dcStr(bd?.dotFg) + ";display:flex;align-items:center;justify-content:center"))}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dcStyle(("animation:" + dcStr(bd?.anim)))}><path d={String(bd?.d || '')} /></svg>
                        </span>
                        <span style={dcStyle(("flex:1;font-size:" + dcStr(v?.F?.base) + "px;color:" + dcStr(bd?.fg)))}>{dcStr(bd?.t)}</span>
                        <span className="sr">{dcStr(bd?.sr)}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {Boolean(v?.isReady) ? (
                  <div style={dcStyle("display:flex;flex-direction:column;gap:16px")}>
                    <div style={dcStyle(("display:grid;grid-template-columns:" + dcStr(v?.L?.sumCols) + ";gap:8px"))}>
                      {(v?.summary || []).map((sm: any, $index: number) => (
                        <span key={$index} style={dcStyle("padding:10px 12px;border-radius:12px;background:#ffffff;border:1px solid #E9E1D5;display:flex;flex-direction:column;gap:2px;min-width:0")}>
                          <span style={dcStyle(("font-size:" + dcStr(v?.F?.tiny) + "px;color:#5B6585"))}>{dcStr(sm?.k)}</span>
                          <span style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;font-weight:700;line-height:1.35"))}>{dcStr(sm?.v)}</span>
                        </span>
                      ))}
                    </div>
                    <section aria-labelledby="ca-nx" style={dcStyle("display:flex;flex-direction:column;gap:8px")}>
                      <h2 id="ca-nx" style={dcStyle(("margin:0;font-size:" + dcStr(v?.F?.base) + "px;font-weight:700"))}>{dcStr(v?.t?.nextTitle)}</h2>
                      <ol style={dcStyle("margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px")}>
                        {(v?.nexts || []).map((nx: any, $index: number) => (
                          <li key={$index}>
                            <a href={dcHref(dcStr(nx?.href))} className="opt" style={dcStyle(("min-height:64px;display:flex;align-items:center;gap:14px;padding:10px 14px;border:" + dcStr(nx?.bd) + ";border-radius:14px;background:" + dcStr(nx?.bg) + ";color:#162660;text-decoration:none"))} onClick={dcLinkClick(dcStr(nx?.href), undefined)}>
                              <span className="num" style={dcStyle(("width:30px;height:30px;flex:none;border-radius:999px;background:" + dcStr(nx?.nBg) + ";color:" + dcStr(nx?.nFg) + ";display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700"))}>{dcStr(nx?.n)}</span>
                              <span style={dcStyle("flex:1;min-width:0;display:flex;flex-direction:column;gap:2px")}>
                                <span style={dcStyle(("font-size:" + dcStr(v?.F?.base) + "px;font-weight:700"))}>{dcStr(nx?.t)}</span>
                                <span style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;line-height:1.4;color:#5B6585"))}>{dcStr(nx?.s)}</span>
                              </span>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dcStyle(("flex:none;color:#5B6585;transform:" + dcStr(v?.flip)))}><path d="M9 6l6 6-6 6" /></svg>
                            </a>
                          </li>
                        ))}
                      </ol>
                    </section>
                  </div>
                ) : null}

                {Boolean(v?.isJoinPin) ? (
                  <>
                    <div style={dcStyle("display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:16px;background:#ffffff;border:1px solid #E9E1D5;max-width:520px")}>
                      <span style={dcStyle("width:48px;height:48px;flex:none;border-radius:12px;background:#162660;color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-family:Outfit,sans-serif;font-size:20px;font-weight:700")}>{"S"}</span>
                      <span style={dcStyle("display:flex;flex-direction:column;gap:2px")}>
                        <b style={dcStyle(("font-size:" + dcStr(v?.F?.base) + "px"))}>{"Stride Footwear · Main branch"}</b>
                        <span style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;line-height:1.4;color:#454F70"))}>{dcStr(v?.t?.invitedAs)}</span>
                      </span>
                    </div>
                    <div style={dcStyle("display:flex;gap:12px;max-width:520px;flex-wrap:wrap")}>
                      <div style={dcStyle("flex:1;min-width:140px;display:flex;flex-direction:column;gap:6px")}>
                        <label htmlFor="ca-p1" style={dcStyle(("font-size:" + dcStr(v?.F?.label) + "px;font-weight:600;color:#454F70"))}>{dcStr(v?.t?.l_pin)}</label>
                        <input id="ca-p1" dir="ltr" type="password" inputMode="numeric" autoComplete="new-password" maxLength={4} value={dcStr(v?.s?.pin)} onChange={v?.onPin} onKeyDown={v?.onEnter} aria-describedby="ca-pin-h" style={dcStyle(("height:60px;border:" + dcStr(v?.pinBd) + ";border-radius:12px;background:#ffffff;padding:0 16px;font-family:'JetBrains Mono',monospace;font-size:28px;letter-spacing:.4em;text-align:center;color:#162660"))} />
                      </div>
                      <div style={dcStyle("flex:1;min-width:140px;display:flex;flex-direction:column;gap:6px")}>
                        <label htmlFor="ca-p2" style={dcStyle(("font-size:" + dcStr(v?.F?.label) + "px;font-weight:600;color:#454F70"))}>{dcStr(v?.t?.l_pin2)}</label>
                        <input id="ca-p2" dir="ltr" type="password" inputMode="numeric" autoComplete="new-password" maxLength={4} value={dcStr(v?.s?.pin2)} onChange={v?.onPin2} onKeyDown={v?.onEnter} aria-describedby="ca-pin-h" style={dcStyle(("height:60px;border:" + dcStr(v?.pin2Bd) + ";border-radius:12px;background:#ffffff;padding:0 16px;font-family:'JetBrains Mono',monospace;font-size:28px;letter-spacing:.4em;text-align:center;color:#162660"))} />
                      </div>
                    </div>
                    <span id="ca-pin-h" role={String(v?.pinRole || 'note')} style={dcStyle(("font-size:" + dcStr(v?.F?.small) + "px;line-height:" + dcStr(v?.F?.lh) + ";color:" + dcStr(v?.pinHelpFg)))}>{dcStr(v?.pinHelp)}</span>
                  </>
                ) : null}

                {Boolean(v?.isJoinDone) ? (
                  <section aria-labelledby="ca-can" style={dcStyle("background:#ffffff;border:1px solid #E9E1D5;border-radius:16px;padding:14px 16px;display:flex;flex-direction:column;gap:8px;max-width:560px")}>
                    <h2 id="ca-can" style={dcStyle(("margin:0;font-size:" + dcStr(v?.F?.base) + "px;font-weight:700"))}>{dcStr(v?.t?.canTitle)}</h2>
                    <ul style={dcStyle("margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px")}>
                      {(v?.cans || []).map((cn: any, $index: number) => (
                        <li key={$index} style={dcStyle(("display:flex;align-items:center;gap:10px;font-size:" + dcStr(v?.F?.small) + "px;color:" + dcStr(cn?.fg)))}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={String(cn?.d || '')} /></svg>
                          {dcStr(cn?.t)}
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {Boolean(v?.altInline) ? (
                  <button type="button" className="bt" onClick={v?.railAltGo} style={dcStyle(("align-self:flex-start;min-height:44px;padding:0;border:0;background:transparent;color:#2E46A0;font-size:" + dcStr(v?.F?.small) + "px;font-weight:600;text-decoration:underline;text-underline-offset:3px;text-align:start"))}>{dcStr(v?.railAlt)}</button>
                ) : null}

                {Boolean(v?.readyBadge) ? (
                  <span aria-hidden="true" style={dcStyle("position:absolute;top:28px;inset-inline-end:32px;width:64px;height:64px;border-radius:999px;background:#E8F6EE;color:#2F9E63;display:flex;align-items:center;justify-content:center;animation:zup .4s ease-out")}>
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" style={dcStyle("stroke-dasharray:48;stroke-dashoffset:0;animation:zdraw .6s ease-out")} /></svg>
                  </span>
                ) : null}
              </div>
            </div>

            {Boolean(v?.hasFooter) ? (
              <div style={dcStyle(("flex:none;background:#ffffff;border-top:1px solid #E9E1D5;padding:14px " + dcStr(v?.L?.padX) + "px;display:flex;flex-wrap:wrap;align-items:center;gap:10px 12px;position:sticky;bottom:0;z-index:10"))}>
                {Boolean(v?.hasBack) ? (
                  <button type="button" className="bs" onClick={v?.back} aria-label={String(v?.t?.back || 'Back')} style={dcStyle(("height:52px;padding:0 16px;border:1px solid #D9CFC0;border-radius:12px;background:#ffffff;font-size:" + dcStr(v?.F?.btn) + "px;font-weight:600;color:#162660;display:flex;align-items:center;gap:8px;flex:none"))}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dcStyle(("transform:" + dcStr(v?.flip)))}><path d={String(v?.ic?.left || '')} /></svg>
                    {Boolean(v?.backText) ? dcStr(v?.t?.back) : null}
                  </button>
                ) : null}
                <span role="status" aria-live="polite" style={dcStyle(("flex:1 1 150px;min-width:0;font-size:" + dcStr(v?.F?.small) + "px;line-height:1.4;font-weight:" + dcStr(v?.whyWeight) + ";color:" + dcStr(v?.whyFg)))}>{dcStr(v?.why)}</span>
                {Boolean(v?.secHas) ? (
                  <a href={dcHref(dcStr(v?.secHref))} className="bs" style={dcStyle(("height:52px;padding:0 16px;border:1px solid #D9CFC0;border-radius:12px;background:#ffffff;font-size:" + dcStr(v?.F?.btn) + "px;font-weight:600;color:#162660;text-decoration:none;display:flex;align-items:center;flex:none"))} onClick={dcLinkClick(dcStr(v?.secHref), undefined)}>{dcStr(v?.secLabel)}</a>
                ) : null}
                {Boolean(v?.nextIsLink) ? (
                  <a href={dcHref(dcStr(v?.nextHref))} className="bk" style={dcStyle(("height:52px;padding:0 20px;border-radius:12px;background:#162660;color:#ffffff;text-decoration:none;font-size:" + dcStr(v?.F?.btn) + "px;font-weight:700;display:flex;align-items:center;gap:8px;flex:none"))} onClick={dcLinkClick(dcStr(v?.nextHref), undefined)}>
                    {dcStr(v?.nextLabel)}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dcStyle(("transform:" + dcStr(v?.flip)))}><path d="M9 6l6 6-6 6" /></svg>
                  </a>
                ) : null}
                {Boolean(v?.nextIsBtn) ? (
                  <button type="button" className="bk" onClick={v?.next} disabled={Boolean(v?.nextOff)} aria-busy={v?.busy === 'true'} style={dcStyle(("height:52px;padding:0 20px;border:0;border-radius:12px;background:#162660;color:#ffffff;font-size:" + dcStr(v?.F?.btn) + "px;font-weight:700;display:flex;align-items:center;gap:8px;flex:none"))}>
                    {dcStr(v?.nextLabel)}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dcStyle(("transform:" + dcStr(v?.flip)))}><path d="M9 6l6 6-6 6" /></svg>
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          {Boolean(v?.toastOn) ? (
            <div role="status" style={dcStyle("position:fixed;left:16px;right:16px;bottom:88px;z-index:50;display:flex;justify-content:center;pointer-events:none")}>
              <span style={dcStyle("min-height:48px;display:flex;align-items:center;padding:8px 18px;border-radius:14px;background:#162660;color:#ffffff;font-size:15px;font-weight:600;box-shadow:0 12px 28px rgba(12,20,50,.28);animation:zup .2s ease-out;text-align:center")}>{dcStr(v?.s?.toast)}</span>
            </div>
          ) : null}
        </div>
      </>
    );
  }
}
