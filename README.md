# Opdrachtbeschrijving

## Inleiding
Je vrienden hebben er inmiddels lucht van gekregen dat je kunt programmeren en sindsdien wordt je 
low key gestalkt met verzoekjes om webapplicaties te bouwen. Je vriend Constantijn wil heel graag
dat je een applicatie voor hem maakt die feitjes over landen kan ophalen, zodat hij cool kan doen 
met zijn wereldse kennis op borrels en verjaardagen.

![screenshot](./assets/screenshot.png)

Je gaat dit doen met behulp van de REST Counties API. De documentatie over de verschillende endpoints
kun je [hier](https://restcountries.eu/#api-endpoints-language) vinden. 

## Voor je begint
1. Koppel jouw JavaScript bestand met de HTML pagina. Doe dit ook voor het CSS bestand.
2. Maak een `package.json` aan met `npm init --yes`.
3. Installeer de npm package `axios` met `npm install axios --save`.
4. Zorg ervoor dat je `axios` importeert!
4. Vergeet niet dat je bij iedere wijziging eerst moet opslaan en de browser moet refreshen. 
`Nodemon` is niet meer nodig omdat we JavaScript nu in de browser gaan gebruiken (waar het voor bedoeld is)
5. Schrijf voor alle onderstaande opdrachten eerst **stap voor stap de psuedo-code uit**. 
Check bij de pseudo-antwoorden of je geen stappen overgeslagen hebt. Begin dan pas met programmeren.

## Plan de campagne
1. Maak een 'Zoek'-knop op de pagina en koppel deze aan een functie die de gegevens over `België` ophaalt en dit in de console logt. 
_Tip:_ Als de de [documentatie](https://www.npmjs.com/package/axios) bekijkt en op `async` zoekt, vindt je een voorbeeld van een GET-request.

2. Maak op basis van de response de volgende string en log dit in de console: `[country-naam] is situated in [subarea-name]. It has a population of [amount] people.`
3. Maak op basis van de response de volgende string en log dit in de console: `The capital is [city]`
4. Maak een functie die ongeacht het aantal currencies die in een land gebruikt worden, een string maakt. In een land kunnen één of twee currencies gebruikt worden:
    * 1 valuta: `and you can pay with [currency]'s`
    * 2 valuta's: `and you can pay with [currency]'s and [currency]'s`
5. Check of alles nog steeds werkt als je de gegevens over _Aruba_ of _Duitsland_ ophaalt!
6. _Bonusopdracht:_ Maak een functie die ongeacht het aantal talen die in een land gesproken worden, een string maakt:
    * 1 taal: `They speak [language]`
    * 2 talen: `They speak [language] and [language]` 
    * 3 talen: `They speak [language], [language] and [language]`
    * etc. 
7. Zorg ervoor dat de opgehaalde data op de volgende manier wordt toegevoegd aan de DOM:

```
[IMAGE: flag]
[country-name]
[country-naam] is situated in [subarea-name]. It has a population of [amount] people.
The capital is [city] and you can pay with [currency]'s
They speak [language], [language] and [language]
```

8. Maak een inputveld op de pagina en zorg ervoor dat als de gebruiker op enter drukt, de functie wordt 
aangeroepen waarmee de gegevens over `België` worden opgehaald. 

9. Zorg ervoor dat de waarde uit het input veld wordt gebruikt als query voor het GET request. 
Er moet alleen een request gedaan worden als de gebruiker op enter drukt, of op de zoek-knop klikt.
_Tip:_ gebruik een globale variabele.

10. Zorg ervoor dat de waarde van het input veld wordt leeggemaakt na elke zoekopdracht.

11. Zorg ervoor dat er altijd maar één zoekresultaat op de pagina staat.

12. Zorg ervoor dat als er naar een land wordt gezocht dat niet bestaat, er een foutmelding in de DOM wordt gezet.
_Tip:_ als er een ongeldige API call wordt gemaakt, zal de response in het `catch` blok terecht komen.

13. Zorg ervoor dat als je na een ongeldige API call weer een geldige API call maakt, de foutmelding verdwenen is.

14. **Bonusopdracht:** make it look nice! 😍
