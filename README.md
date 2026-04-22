# ApproÄppi

## Tarkoitus
ApproÄppi on digitaalinen appropassi-sovellus, jonka avulla käyttäjät voivat osallistua tapahtumiin, seurata etenemistään ja kerätä leimoja QR-koodeja skannaamalla. Sovellus korvaa perinteisen fyysisen appropassin tarjoamalla helppokäyttöisen mobiiliratkaisun.

## Ominaisuudet

### Käyttäjälle
- Rekisteröityminen ja kirjautuminen
- Tapahtumien selaaminen
- Tapahtumiin liittyminen
- Tapahtuman tietojen tarkastelu
- Tapahtuman baarien ja ravintoloiden tarkastelu kartalla
- Omien tapahtumien selaaminen
- Leimojen kerääminen appropassiin QR-koodeja skannaamalla

### Admin-käyttäjälle
- Tilastojen tarkastelu
- Skannaukset per baari
- Skannaukset per tapahtuma

## Teknologiat

### Kehitystyökalu
- Expo

### Frontend
- React Native
- TypeScript

### Backend ja palvelut
- Firebase Authentication
- Firebase Firestore

### Muut integraatiot
- Google Maps

## Ympäristömuuttujat

Sovellus käyttää ympäristömuuttujia, jotka on määritelty `.env`-tiedostossa.

### Firebase
Firebase-konfiguraatio sijaitsee tiedostossa:
- `firebase/firebaseConfig.ts`

API-avaimet ja muut konfiguraatiot haetaan ympäristömuuttujista.

### Google Maps
Google Maps API -avain on määritelty `.env`-tiedostossa.

## Projektin rakenne

### Keskeiset osat
- Käyttäjähallinta (Authentication)
- Tapahtumien hallinta
- QR-koodin skannaus ja leimojen keräys
- Karttanäkymä
- Tilastot (admin)