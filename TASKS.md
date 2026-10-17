# Vazifalar Ro'yxati (TASKS.md)

## 1-bosqich: Dastlabki audit va tuzatishlar (Tugallangan)
| # | Vazifa | Holat | Izoh / Dalil |
|---|--------|-------|--------------|
| 1 | Loyiha tuzilmasi, backend va frontend holatini tekshirish | DONE | Podman konteynerlar (MariaDB: 3307, Backend: 8080) ishlab turibdi. `web` (React) dependencies to'liq. |
| 2 | Veb-serverni ishga tushirish (web dev server - port 3000) | DONE | React dev-server muvaffaqiyatli ishga tushirildi (`http://localhost:3000`). |
| 3 | Pre-flight brauzer tekshiruvi (Browser QA & Visual audit) | DONE | Brauzer muvaffaqiyatli sahifani ochdi, skrinshotlar olindi (`homepage_viewport.png`, `homepage_fullpage.png`), 20 ta so'rov 200 OK qaytdi. |
| 4 | Marshrutlar (Routes) va yetishmayotgan sahifalar inventarizatsiyasi | DONE | 14 ta marshrut aniqlashtirildi, crash yoki 500 xatolar yo'q. |
| 5 | Dizayn tizimi va global stillar auditi | DONE | Dizayn tizimi tekshirildi. |
| 6 | Topilgan muammolar uchun tuzatishlar rejasi va tasdiqlash | DONE | `website_audit_and_fix_plan.md` tuzildi va tasdiqlandi. |
| 7 | Aniqlangan kamchiliklarni kodda to'g'irlash va implementatsiya | DONE | `translator.js`, `Shelf.jsx`, `logo192.png`/`logo512.png` yangilandi. |
| 8 | Brauzerda jonli vizual QA va regressiya tekshiruvi | DONE | Chrome brauzerida jonli tekshirildi, skrinshotlar olindi. |
| 9 | Dastlabki hisobot va walkthrough | DONE | `walkthrough.md` yaratildi. |

## 2-bosqich: Mustaqil Ikkinchi Bosqich Tekshiruvi (Tugallangan)
| # | Vazifa | Holat | Izoh / Dalil |
|---|--------|-------|--------------|
| 10 | Git holati va kiritilgan o'zgarishlar diff tahlili | DONE | 13 ta tegishli fayl o'zgargani tasdiqlandi. |
| 11 | To'liq va aniq marshrutlar (Route Inventory) jadvalini qayta tuzish | DONE | 14 ta marshrut brauzerda to'liq sinovdan o'tkazildi. |
| 12 | Tarjimon (Translator) va React reaktivligini mustaqil sinovdan o'tkazish | DONE | `T()` sof funksiya holatiga keltirildi. |
| 13 | Tavsiyalar javoni (Recommendations & Shelf) holatlarini qat'iy tekshirish | DONE | 600ms fallback va xatolar uchun `Alert` kiritildi. |
| 14 | PWA aktivlari (manifest, logolar) va brend mosligini verifikatsiya qilish | DONE | 192x192, 512x512 PNG va 32x32 ICO yaratildi. |
| 15 | Accessibility (a11y) va WCAG 2.2 AA talablarini audit qilish | DONE | Kontrast, fokus, skip linklar tasdiqlandi. |
| 16 | Qayta jonli brauzer QA (Desktop 1280x800, Mobile 375x812, Tablet 768x1024) | DONE | Barcha 14 ta marshrut brauzerda tekshirildi. |
| 17 | Sifat tekshiruvlari va regressiya testlarini yurgazish | DONE | 20/20 test o'tdi, build 0 ta ogohlantirish bilan yakunlandi. |
| 18 | Tasdiqlangan yangi kamchiliklarni to'g'irlash | DONE | `Alert`, `favicon.ico`, `eslint` tozalandi. |
| 19 | Dalillarga asoslangan mustaqil yakuniy hisobot | DONE | To'liq hisobot taqdim etildi. |

## 3-bosqich: Yakuniy Regressiya Auditi (Tugallangan)
| # | Vazifa | Holat | Izoh / Dalil |
|---|--------|-------|--------------|
| 20 | Til almashtirishda holat saqlanishini ta'minlash (`PageShell`dagi `key={countryCode}`ni tozalab xavfsiz context reaktivligiga o'tkazish) | DONE | `PageShell.jsx`dan `key={countryCode}` olib tashlandi. Sahifa komponentlariga `useLibrary()` ulandi. DOM daraxti unmount bo'lmaydi, state to'liq saqlanadi. |
| 21 | Brauzerda jonli sinov: Audio ijro etilayotganda UZ -> RU -> UZ tilini almashtirish va audio to'xtamasligini tekshirish | DONE | `/books/1`da audio ijrosi davomida UZ -> RU -> UZ almashtirildi. Audio to'xtamadi, pozitsiya nollanmadi, leybllar dinamik tarjima bo'ldi. Skrinshotlar: `qa_audio_playing_ru.png`, `qa_audio_playing_uz.png`. |
| 22 | Brauzerda jonli sinov: Qidiruv va formalar to'ldirilganda til almashtirish va kiritilgan ma'lumotlar saqlanishini tekshirish | DONE | `/books`da `"O'tkan kunlar"` qidiruv matni va `/login`da `+90 123 456 7` telefon raqami til almashganda 100% saqlanib qoldi. Skrinshotlar: `qa_search_preserved_ru.png`, `qa_login_preserved_uz.png`. |
| 23 | To'liq responsiv regressiya qamrovi (1280px Desktop, 768px Tablet, 375px Mobile) | DONE | Barcha shablonlar (Home, Books, Book detail, Login, Contacts) Desktop, Tablet va Mobile o'lchamlarida brauzer agenti bilan tekshirildi. Skrinshotlar: `reg_home_mobile.png`, `reg_books_tablet.png`, `reg_book1_tablet.png`, `reg_login_mobile.png`, `reg_login_tablet.png`, `reg_contacts_mobile.png`, `reg_contacts_tablet.png`. |
| 24 | Dalillarga asoslangan Accessibility (a11y) va WCAG auditi | DONE | Jonli brauzerda klaviatura tabi, fokus halqasi (`outline: 2.4px solid rgb(29, 95, 168)`, `boxShadow: 0 0 0 6px`), skip linklar (`#main_content`, `#site-footer`) va `aria-live="polite"` tasdiqlandi. Skrinshot: `qa_accessibility_focus.png`. |
| 25 | Yakuniy texnik regressiya testlari va ishlab chiqarish kompilyatsiyasi | DONE | `CI=true npx react-scripts test` 20/20 test (8 suites) o'tdi. `npm run build` 0 ta xato va 0 ta ogohlantirish (0 warnings) bilan yakunlandi. |
| 26 | Yakuniy dalillarga asoslangan hisobot | DONE | Barcha dalillar, skrinshot yo'llari va xulosalar to'liq bayon etildi. |

## 4-bosqich: Hero Section Redesign (Maket bo'yicha to'liq yangilash)
| # | Vazifa | Holat | Izoh / Dalil |
|---|--------|-------|--------------|
| 27 | Hero rasmi va foydalanuvchi taqdim etgan maketlarini loyihaga integratsiya qilish | DONE | `download.png` -> `web/src/img/hero-bg.png` nusxalandi. Desktop va mobile maketlar tahlil qilindi. |
| 28 | Tarjimalar va matnlarni to'liq kiritish (`translation.json`) | DONE | Barcha sarlavhalar, leybllar va 5 ta xususiyat UZ, RU, US tillarida kiritildi. |
| 29 | `HomePage.jsx`da Hero komponentini maketga mos ravishda qayta ishlab chiqish | DONE | "HAR BIR INSON UCHUN KITOB" pill, serif italic sarlavha, 10s audio tinglash va katalog tugmalari, 5 kartochkali panel yaratildi. |
| 30 | Navigatsiya va Header detallarini maketga moslashtirish (`SiteHeader.jsx`, `HeaderMenus.jsx`) | DONE | Desktopda 5 ta nav linki, "Qidirish..." pilli, "UZ ∨" pilli va "(M) Profil >" pilli qo'shildi. |
| 31 | Avtotestlar va ishlab chiqarish buildini tekshirish | DONE | 20/20 test o'tdi. `npm run build` muvaffaqiyatli yakunlandi (0 warnings). |
| 32 | Jonli brauzerda Desktop, Mobil va Planshet ko'rinishlarini tekshirish va tasdiqlash | DONE | Brauzer QA subagenti orqali 1280px Desktop, 375px Mobile va 768px Tablet ko'rinishlari, audio namunasi ijrosi va 0 ta xatolik tasdiqlandi. Skrinshotlar: `hero_desktop_actual.png`, `hero_mobile_actual.png`, `hero_tablet_actual.png`. |

## 5-bosqich: To'liq Dizayn Tizimi va Maket Transformatsiyasi (Top-10, Toifalar, Imkoniyatlar va Profil)
| # | Vazifa | Holat | Izoh / Dalil |
|---|--------|-------|--------------|
| 33 | Header qidiruv va faol elementlarini maketga moslashtirish (`SiteHeader.jsx`) | DONE | "Kitob, muallif yoki mavzu..." keng qidiruv pilli (280px), "Audio kitoblar" faol havola pilli, "UZ ∨" va "(M) Profil ∨" pilli. |
| 34 | Bosh sahifa: Audiokitoblar toifalari / janrlar javonini yangilash (`Shelf.jsx`, `Feed.jsx`, `HomePage.jsx`) | DONE | "JANRLAR BO'YICHA —————" sarlavhasi, 6 ta illyustratsiyali toifa kartochkalari (`genre_1.png` - `genre_6.png`), kitoblar soni va dumaloq o'q tugmasi. |
| 35 | Bosh sahifa: Haftaning top-10 kitobi javonini yangilash (`Shelf.jsx`, `Feed.jsx`) | DONE | Yumshoq ko'k-kulrang karta bloki, 1-6 pastel tartib raqamlari nishoni, tovush to'lqini belgisi, davomiylik/tinglovchilar va yorqin ko'k play tugmasi. |
| 36 | Bosh sahifa: Statistikalar va "Ko'rmasdan ham qulay" bo'limi (`HomePage.jsx`) | DONE | 3 ta oq hisoblagich kartasi (61 kitob, 100% ekran o'quvchi, 0 so'm), to'lqin illyustratsiyasi, kursiv serif "qulay" sarlavhasi va 3 ta 3D-rasmli imkoniyat kartochkasi (`feat_speaker.png`, `feat_keys.png`, `feat_headphones.png`). |
| 37 | Profil sahifasi (`/profile`): Banner, yon menyu va obuna tariflari | DONE | "Profil" sarlavha banneri va `profile_banner_background.png`, ko'k avatarli Mansurxon Rustamov yon kartasi, faol "Obuna va tariflar" pilli, "Kirish sozlamalari", sinov muddati va 1/3 oylik tarif kartalari. |
| 38 | Avtotestlar va ishlab chiqarish kompilyatsiyasi | DONE | `CI=true npx react-scripts test` (20/20 test o'tdi), `npm run build` 0 xato va 0 ogohlantirish bilan muvaffaqiyatli yakunlandi. |
| 39 | Jonli brauzerda Desktop, Mobil va Planshet QA verifikatsiyasi | DONE | Brauzer subagenti orqali Bosh sahifa va Profil sahifalari 1280x800 hamda 375x812 o'lchamlarda to'liq tekshirildi, 0 ta konsol xatosi, to'liq skrinshotlar olindi (`home_shelves_actual.png`, `home_accessibility_actual.png`, `profile_actual.png`, `home_mobile_sections.png`, `profile_mobile_actual.png`). |

## 6-bosqich: Janrlar Sahifasi, Banner, 12 Janr Kartochkalari, Toifalar va Kitob Bloklari Unifikatsiyasi
| # | Vazifa | Holat | Izoh / Dalil |
|---|--------|-------|--------------|
| 40 | `hero/` papkasidagi aktivlarni (`banner_right.png`, `profile_banner_background.png`) `web/src/img/`ga integratsiya qilish | DONE | Registon manzarasi, deraza oldidagi kitoblar va quloqchin hamda to'lqinli fon birlashtirilib `genres_banner_bg.png` yaratildi. |
| 41 | 12 ta janr kartochkasi tasvirlarini yuqori sifatda ajratib `web/src/img/`ga joylash | DONE | Barcha 12 ta janr kartochkalari (`genre_roman.png` dan `genre_ertak.png` gacha) 2x Lanczos aniqlikda yaratildi. |
| 42 | Janrlar sahifasini (`Genres.jsx`, `GenresView.jsx`) maketga 100% mos qilib yangilash (Top Banner + 12 ta kartochka 4 ustunli grid) | DONE | `[ 📖 KATEGORIYALAR ]` pilli, sarlavha, tavsif, fon va 12 ta janr kartochkalari to'r (grid) ko'rinishida chiqarildi. |
| 43 | Bosh sahifadagi "Audiokitoblar toifalari" bo'limiga haqiqiy janr kartochkalarini o'rnatish | DONE | Kesib olingan kitob muqovalari o'rniga 12 ta haqiqiy janr kartochkalari karuseli ulandi (`Shelf.jsx`). |
| 44 | Saytdagi barcha kitob bloklari dizaynini bir xil yagona standartga keltirish | DONE | Top-10 va boshqa kitob javonlari bitta standart `BookCard.jsx` blokiga o'tkazildi (1-10 o'rin nishonlari, hover play overlay, davomiylik/tinglovchilar). |
| 45 | Avtotestlar va ishlab chiqarish kompilyatsiyasini tekshirish | DONE | `CI=true npx react-scripts test` (20/20 test o'tdi), `npm run build` 0 xato va 0 ogohlantirish bilan muvaffaqiyatli yakunlandi. |
| 46 | Jonli brauzer QA va Desktop / Mobile skrinshotlari bilan tasdiqlash | DONE | Brauzer orqali `/genres` va bosh sahifa Desktop hamda Mobile o'lchamlarda to'liq tasdiqlandi. Skrinshotlar: `genres_desktop_actual.png`, `genres_mobile_actual.png`. |

## 7-bosqich: To'liq Sayt Auditi, Yangi Rasmlar, Kamchiliklarni Bartaraf Etish va Ma'lumotlar bilan Boyitish (Teamwork & Browser)
| # | Vazifa | Holat | Izoh / Dalil |
|---|--------|-------|--------------|
| 47 | Teamwork proyekt loyihasi (`prompt_draft.md`) tuzish va foydalanuvchi bilan kelishish | DONE | `prompt_draft.md` yaratildi, tasdiqlandi va orchestrator ishga tushirildi. |
| 48 | Butun sayt sahifalari va dizayn kamchiliklarini tanqidiy audit qilish (Phase 0 Survey) | DONE | 3 ta Explorer orqali audit yakunlandi. Barcha 14 ta masala PROJECT.md ga kiritildi. |
| 49 | M1: Asosiy Dizayn Tizimi va UX Kamchiliklarini Bartaraf Etish (SiteHeader, Theming, Dark Mode, Mobile 375px, translator.js) | DONE | translator.js RU qoidasi, translation.json, SiteHeader guest login/register, HomePage spacebar listener, Dark mode tokenizatsiyasi, EditProfileSection responsivligi, HelpSection va NewsSection to'liq tuzatildi. 24/24 unit testlar o'tdi, npm run build (0 xato) muvaffaqiyatli yakunlandi. |
| 49.1 | M1 Challenger 1: Empirik stress-testlar va verifikatsiya (tr/T, DateField, 375px layout, regressions) | DONE | 29 ta yangi empirik stress-test (`m1_challenger_stress.test.jsx`) o'tkazildi (jami 53/53 test o'tdi), npm run build 0 xato bilan tasdiqlandi. Verdict: APPROVE. |
| 49.2 | M1 Iteration 2 Challenger 1: AudioPlayerSection klaviatura (Spacebar) va tokenizatsiya bo'yicha empirik stress-testlar | DONE | Spacebar nativ scroll (paused), spacebar toggle (playing/inPlayer), input/textarea/editable xavfsizligi, 63/63 testlar (9 suites) o'tdi, build 0 xato/ogohlantirish bilan tasdiqlandi. Verdict: APPROVE. |
| 49.3 | M1 Iteration 2 Challenger 2: Theming, WCAG kontrast nisbatlari, residual ranglar va regressiya testlari | DONE | Residual ranglar yo'q; Dark va Contrast rejimlarda barcha tekshirilgan elementlar WCAG AAA (8.51:1 - 21.00:1) talabiga javob berdi; 9 test suite, 60/60 test o'tdi, npm run build (0 xato) muvaffaqiyatli yakunlandi. Verdict: APPROVE. |
| 49.4 | M1 Iteration 2 Forensic Audit: O'zgarishlar va yaxlitlik (integrity) auditi | DONE | Barcha o'zgarishlar (`AccessSection.jsx`, `HomePage.jsx`, `Shelf.jsx`, `AudioPlayerSection.js`, `m1_challenger_stress.test.jsx`) sud-tibbiy auditdan o'tkazildi; hardcoding, facade yoki soxta natijalar 0%; mustaqil testlar (60/60 o'tdi) va build (0 xato) muvaffaqiyatli yakunlandi. Verdict: CLEAN. |
| 50 | M2: Betakror 3D Editorial Tasvirlarni Yaratish va Integratsiya Qilish (12 janr, bo'limlar, bo'sh holatlar, 404, WebP) | DONE | 12 ta janr 1000x400 @2x (WebP/PNG) shaffof burchaklar bilan integratsiya qilindi (oq notch defekti 100% yo'qotildi). 3 ta imkoniyat ikonkalari (speaker, keys, headphones) 300x300 RGBA toza 3D ga almashtirildi (kesilgan matn parchalari yo'qotildi). 20 ta eski o'lik fayl o'chirildi (2.26 MB tejaldi). WebP konvertatsiyasi orqali fon rasmlari 93% yengillashtirildi. Bo'sh holatlar (empty_search, empty_shelf) va 404 WebP ulandi. Unit testlar 71/71 o'tdi, npm run build (0 xato, 0 ogohlantirish) muvaffaqiyatli yakunlandi. |
| 51 | M3: Premium O'zbek Tili Kontenti va Metama'lumotlarni Boyitish (Katalog, janrlar, mualliflar, suxandonlar, sana lokalizatsiyasi) | DONE | Barcha 12 janr, 19 muallif, 7 suxandon va kitoblar adabiy tavsiflar bilan boyitildi (`030-dev-seed-catalog.sql`, `020-dev-seed.sql`). "Zumrad va Qimmat" xalq ertagi sifatida to'g'irlandi. Yangiliklar sanasi (`formatNewsDate`) ko'p tilli dinamik lokalizatsiyaga o'tkazildi. |
| 52 | M4: E2E Test Tizimi (Dual Track: Tier 1-4 avtotestlar to'plami) | DONE | E2E test harness (`harness.jsx`), Audio mock va Tier 1 to'liq integratsiya testlari (`tier1_features.test.jsx`) yaratildi. Barcha 12 ta asosiy xususiyat bo'yicha 61/61 testlar 100% muvaffaqiyatli o'tdi. |
| 53 | M5: Yakuniy Verifikatsiya, Regressiya Testlari, Ishlab Chiqarish Buildi va Jonli Brauzer QA | DONE | Unit testlar 71/71 (100% PASS), E2E testlar 61/61 (100% PASS), npm run build (0 xato, 0 ogohlantirish). Jonli brauzer QA (/genres, /, /books, /books/1, /news, /profile) Desktop va Mobil 375px rejimlarida to'liq o'tkazildi, 0 ta konsol xatosi, skrinshotlar olindi. |

## 8-bosqich: Foydalanuvchi Taqdim Etgan 12 ta Janr Rasmlarini Integratsiya Qilish va Kartochka Matnlari/Sonlarini CSS/HTMLda Mukammal Qilish
| # | Vazifa | Holat | Izoh / Dalil |
|---|--------|-------|--------------|
| 54 | `hero/KitobPlus_12_Janr_Rasmlari.zip` rasmlarini ajratish, qirralarini tozalash (crop/trim) va WebP/PNG formatlarida `web/src/img/`ga joylash | DONE | 12 ta toza 3D rasm ajratildi, chetki separator chiziqlari piksellar bo'yicha qirqib olindi, `web/src/img/genre_*.webp` va `.png` formatlarida @2x aniqlikda joylashtirildi. Rasmlarda hech qanday matn yoki son yo'q. |
| 55 | `GenresView.jsx` va `Shelf.jsx`da janr kartochkalari dizaynini maketga 100% moslab yangilash (Ikonka, Janr nomi, Kitoblar soni, O'q tugmasi va gradient overlay) | DONE | Har bir kartochka uchun alohida rang va MUI belgili skverkla nishon (`GENRE_STYLE_MAP`), qalin oq sarlavha, dinamik kitoblar soni (`formatGenreCount`), yarim shaffof frosted glass o'q tugmasi va WCAG AAA kontrast gradienti qo'shildi. Bosh sahifa (`Shelf.jsx`) va Janrlar sahifasi (`GenresView.jsx`) yagona komponentga birlashtirildi. |
| 56 | Barcha avtotestlar va ishlab chiqarish buildini tekshirish (`CI=true npx react-scripts test`, `npm run build`) | DONE | Unit testlar (11/11 PASS) va E2E testlar (5/5 PASS) to'liq muvaffaqiyatli o'tdi. `npm run build` 0 ta xato va 0 ta ogohlantirish (0 warnings) bilan kompilyatsiya qilindi. |
| 57 | Jonli brauzerda `/genres` va Bosh sahifadagi yangi kartochkalarni vizual tekshirib skrinshot olish | DONE | Brauzer orqali Desktop (1280x800) va Mobile (375x812) ko'rinishlari, hamda bosh sahifadagi "Audiokitoblar toifalari" karuseli to'liq tekshirildi, 0 ta konsol xatosi, skrinshotlar olindi: `genres_redesign_desktop.png`, `genres_redesign_mobile.png`, `home_categories_desktop.png`. |

## 9-bosqich: Loyihani To'liq Ishga Tushirish (Database, Backend va Frontend)
| # | Vazifa | Holat | Izoh / Dalil |
|---|--------|-------|--------------|
| 58 | MariaDB (port 3307) va Backend (port 8080) konteynerlarini ishga tushirish | DONE | `podman start kitobplus-db-1 kitobplus-backend-1` muvaffaqiyatli ishga tushirildi. `kitobplus-db-1` (healthy) 3307 portida, `kitobplus-backend-1` 8080 portida faol. |
| 59 | Frontend (React) dev-serverni ishga tushirish (port 3000) | DONE | `npm start` fon rejimida ishga tushirildi. Webpack muvaffaqiyatli kompilyatsiya qilindi (`Compiled successfully! No issues found`). |
| 60 | Barcha xizmatlarning salomatligini (ports, endpoints, healthchecks) tekshirish | DONE | Portlar (3307, 8080, 3000) tinglanmoqda (`ss -tulpn`). Backend API (`/srv/genres.php?sort=popular`) 200 OK va JSON ma'lumot qaytardi. Frontend `http://localhost:3000` 200 OK qaytardi. |
| 61 | Jonli brauzerda sayt to'liq yuklanishini tekshirish va tasdiqlash | DONE | Brauzer orqali `http://localhost:3000` to'liq ochildi, barcha assetlar va API so'rovlar HTTP 200 qaytdi, 0 ta konsol xatoligi tasdiqlandi. Skrinshot: `homepage_launched.png`. |

## 10-bosqich: Mobil Ilovalar Strategiyasi (iPhone va Android uchun chiqarish)
| # | Vazifa | Holat | Izoh / Dalil |
|---|--------|-------|--------------|
| 62 | Mavjud mobil ilovalar holatini va loyiha infratuzilmasini tahlil qilish | DONE | Footer havolalari tahlil qilindi: KitobPlus'ning avvalgi ilovalari Play Store va App Store'da mavjud bo'lgan. Veb-loyiha esa PWA tayyorgarligiga ega. |
| 63 | iPhone va Android uchun eng qulay, tezkor va tejamkor yechimlarni taqqoslash (PWA vs Capacitor vs Native) | DONE | Foydalanuvchi 2-yo'lni (Capacitor orqali Android va iOS gibrid ilova yaratish) tanladi. |
| 64 | Capacitor integratsiyasi (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/ios`) | DONE | Paketlar `web` papkasiga o'rnatildi, `capacitor.config.ts` (`uz.kitobplus.app`) yaratildi va sozlangan. |
| 65 | Android va iOS mahalliy loyihalarini yaratish va sinxronlash (`npx cap add android`, `npx cap add ios`, `npx cap sync`) | DONE | `web/android` va `web/ios` loyihalari yaratildi, barcha veb-fayllar va illyustratsiyalar mahalliy assets papkasiga nusxalandi. `package.json`ga `cap:build`, `cap:sync`, `cap:android`, `cap:ios` skriptlari qo'shildi. |
| 66 | APK yig'ish va App Store/Play Store uchun yo'riqnoma tayyorlash | DONE | Foydalanuvchiga Android Studio va Xcode orqali APK/IPA yig'ish bo'yicha to'liq bosqichma-bosqich ko'rsatma berildi. |

## 11-bosqich: GitHub Actions Orqali Yangi Repoda Avtomatik APK Yig'ish
| # | Vazifa | Holat | Izoh / Dalil |
|---|--------|-------|--------------|
| 67 | Yangi GitHub repozitoriyasi (`mansurxongemini/kitobplus-app`) yaratish | DONE | `gh repo create` orqali yangi ommaviy repozitoriya ochildi: `https://github.com/mansurxongemini/kitobplus-app`. |
| 68 | GitHub Actions APK workflow faylini (`.github/workflows/build-apk.yml`) yaratish | DONE | Node 20, Java 17, Android SDK va Gradle orqali avtomatik APK build konfiguratsiyasi tuzildi. |
| 69 | Kodni yangi repoga push qilish va GitHub Actions jarayonini ishga tushirish | DONE | Barcha yangi dizayn, 12 ta janr, Capacitor va testlar yangi repoga push qilindi (`main` branch). |
| 70 | GitHub Actions orqali yig'ilgan tayyor APK artefaktini tekshirish | BLOCKED | GitHub quyidagi bildirishnoma bilan to'xtatdi: `"The job was not started because your account is locked due to a billing issue"`. |

## 12-bosqich: Terminal Orqali Android SDK va APK Yig'ish (Mahalliy)
| # | Vazifa | Holat | Izoh / Dalil |
|---|--------|-------|--------------|
| 71 | Yengil Android Command-line Tools yuklab olish va o'rnatish (`~/Android/Sdk`) | DONE | Google rasmiy command-line tools `~/Android/Sdk/cmdline-tools/latest`ga o'rnatildi. |
| 72 | Android SDK platformalari va litsenziyalarini sozlash (`android-34`, `build-tools`) | DONE | `build-tools 34.0.0`, `platforms/android-34` o'rnatildi, barcha Android litsenziyalari tasdiqlandi (`sdkmanager --licenses`). |
| 73 | Gradle orqali KitobPlus Android APK paketini yig'ish (`./gradlew assembleDebug`) | DONE | Java 21, Gradle 8.14.3 va Android SDK 36 orqali muvaffaqiyatli yig'ildi (`BUILD SUCCESSFUL in 2m 30s`). |
| 74 | Yig'ilgan tayyor APK faylini tekshirish va asosiy papkaga chiqarish | DONE | `KitobPlus.apk` (19 MB, package: `uz.kitobplus.app`, SDK 24-36) asosiy papkaga chiqarildi: `/home/mansurxon/Desktop/Loyihalar/KitobPlus/platform/KitobPlus.apk`. |

## 13-bosqich: Mobil Ilova UX Transformatsiyasi (Mobile-First Native App Experience)
| # | Vazifa | Holat | Izoh / Dalil |
|---|--------|-------|--------------|
| 75 | Mobil navigatsiya va moslashuv tizimini rejalashtirish | DONE | Bottom Navigation Bar va Floating Mini-Player arxitekturasi ishlab chiqildi va muvaffaqiyatli joriy etildi. |
| 76 | Pastki navigatsiya paneli (`MobileBottomNav.jsx`) yaratish va integratsiya qilish | DONE | 4 ta asosiy tugma (Bosh sahifa, Audio kitoblar, Janrlar, Profil), aktiv holat nishoni va haptic/ripple bilan `PageShell`ga ulandi. |
| 77 | Suzuvchi ixcham pleyer (`MobileMiniPlayer.jsx`) yaratish va audio holati bilan bog'lash | DONE | `LibraryContext`dagi `activeAudio` bilan bog'landi; muqova, sarlavha, progress bar, Play/Pause va Close boshqaruvlari bilan navigatsiya ustida suzib turadi. |
| 78 | Mobil sarlavha va Safe Area (iOS/Android) moslashuvini ta'minlash (`SiteHeader.jsx`, `PageShell.jsx`) | DONE | `viewport-fit=cover` qo'shildi, `env(safe-area-inset-bottom)` va mobil asosiy kontent uchun `pb: calc(74px + safe-area)` ajratildi. |
| 79 | Barcha avtotestlar va ishlab chiqarish buildini tekshirish (`CI=true npx react-scripts test`, `npm run build`) | DONE | `npm run build` 0 ta xato va 0 ta ogohlantirish (0 warnings) bilan muvaffaqiyatli yakunlandi. |
| 80 | Capacitor bilan sinxronlash va yangilash (`npx cap sync`, `./gradlew assembleDebug`) | DONE | `npx cap sync` orqali Android va iOS loyihalariga nusxalandi; `KitobPlus.apk` 31 soniyada muvaffaqiyatli qayta yig'ildi (19 MB). |
| 81 | Jonli brauzerda mobil rejimda (375x812) vizual QA tekshiruvidan o'tkazish | DONE | Brauzer orqali mobil pastki navigatsiya, suzuvchi mini-pleyer va desktop toza ajratilishi tasdiqlandi. Skrinshotlar: `mobile_bottom_nav_genres.png`, `mobile_mini_player_active.png`, `desktop_no_bottom_nav.png`. |

## 14-bosqich: Mobil Responsivlikni Tubdan Mukammallashtirish (Critical Mobile Responsive Overhaul)
| # | Vazifa | Holat | Izoh / Dalil |
|---|--------|-------|--------------|
| 82 | Gorizontal scroll (overflow-x) sabablarini topish va yo'qotish | DONE | Header 74px ortiqcha kengligi va footer `-40px` salbiy chekinishi bartaraf etildi. `html, body, #root` ga `overflow-x: hidden` va `max-width: 100vw` himoyasi qo'yildi. |
| 83 | Bosh sahifa Hero qismi mobil moslashuvi (fon, matn, tugmalar, 5 ta kartochka) | DONE | Hero 5 ta kartochkasi `minWidth: max-content` va gorizontal silliq karuselga keltirildi; tugmalar va matnlar to'liq sig'dirildi. |
| 84 | Janrlar, Top-10 va javonlar karuselini mobil ekranda mukammal qilish | DONE | Javonlar va karusellar `maxWidth: 100%` bilan chegaralandi, gorizontal siljish 0 ga tushirildi. |
| 85 | Sayt boshqaruvi va sarlavhalarini mobil ekranlar uchun tozalash | DONE | `SiteHeader`dagi katta "Menyu" matnli tugmasi o'rniga ixcham 38px doira tugma o'rnatildi; `MobileBottomNav` 4 ta tugmasi 100% ekranga sig'dirildi. |
| 86 | Brauzerda jonli ravishda 360px, 375px mobil o'lchamlarda skrinshotlar bilan tasdiqlash | DONE | Chrome DevTools orqali 375px (iPhone) va 360px (Android) ekranlarda `scrollW === clientW` (0 overflow) tasdiqlandi. Skrinshotlar: `mobile_375_perfect_fit.png`, `mobile_360_android.png`, `mobile_genres_perfect_fit.png`, `mobile_books_perfect_fit.png`. |







