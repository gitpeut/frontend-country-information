// const axios = require('axios')

let countries = [];
let APIerror  = "";
let findingCountry = false;

function delDomTree( root ){
    for (let i = 0; i < root.children.length; i++) {
        delDomTree( root.children[i] );
    }
    root.remove();
}

// format an array of objects with the name attribute to a comma
// separated string with last 2 element separated by 'and' in stead of ','.
// so results:
// one -> one
// one,two -> one and two
// one,two,thrre -> one,two and three.

function A2String( A ){
    let string  = '';
    let alen    = A.length;
    for( let i=0; i < alen; ++i ){
        string += A[i].name ?? "unknown";
        switch(i){
            case (alen-1):
                break;
            case (alen-2):
                string += ' and ';
                break;
            default:
                string += ', ';
                break;
        }
    }

    console.log( string );

return string;
}

function addFlag( countryName , flagUrl ){
    let flaglist    = document.getElementById('flags');

    let flagItem   = document.createElement('li');

    let flag   = document.createElement('img');
    flag.src   = flagUrl;
    flag.style.height = '100px';
    //flag.style.width = '150px';

    let country   = document.createTextNode( countryName );

    flagItem.appendChild( flag );
    flagItem.appendChild( country );

    flaglist.appendChild( flagItem );

}


// Collect all countries and select relevant fields for our app
async function getCountries(){
    APIerror = "";
    try {
        const result = await axios.get('https://restcountries.eu/rest/v2/all?fields=name;capital;population;currencies;languages;flag;subregion');

        for (let i in result.data) {
            let c = {};
            ({ name:c.name, capital:c.capital, languages:c.languages, currencies:c.currencies, flag:c.flag , population: c.population, subregion: c.subregion} = result.data[i]);
            countries.push(c);
        }
        console.log( countries );
    } catch(e) {
        console.error(e);
        APIerror = " Unable to collect country data. The network may be failing or the website may be down. Try again later."
        console.warn( APIerror );
    }
}

function changeErrorVisibility( onoff){
    let errorField = document.getElementById('error-field');

    if ( onoff ){
        errorField.classList.remove('hidden');
        errorField.classList.add('visible');
    }else{
        errorField.classList.remove('visible');
        errorField.classList.add('hidden');
    }
}

function showCountryError( text ){
    let errorField = document.getElementById('error-field');
    errorField.innerHTML = text;
    changeErrorVisibility( true);
    console.error( text);
}

function showCountry( countryObject ){
    console.log( "Showing " + countryObject.name );
    document.getElementById( 'searchfield').value = '';
    try{
        delDomTree( document.getElementById( 'result') );
    }catch(e){
        //Never mind, first time use
    }
    let parentdiv = document.getElementById('main');
    let resultdiv =  document.createElement('div');
    resultdiv.id = 'result';

    let flag   = document.createElement('img');
    flag.id    = 'flag';
    flag.src   = countryObject.flag;
    flag.style.height = '100px';

    resultdiv.appendChild( flag );

    let textdiv = document.createElement('div');
    textdiv.id  = 'description';

    nameElement      = document.createElement('h2');
    let nameElementTxt = document.createTextNode(countryObject.name);
    nameElement.appendChild( nameElementTxt );
    resultdiv.appendChild( nameElement );

    let codestring = '';
    codestring += countryObject.name + ' is situated in ' + countryObject.subregion + '.\n';
    codestring += 'It has a population of ' + countryObject.population + ' people. ';
    codestring += 'The capital is ' + countryObject.capital;
    codestring += ' and you can pay with ' + A2String( countryObject.currencies ) + '.\n';
    codestring += 'They speak ' + A2String( countryObject.languages ) + '.\n';

    let txtContent = document.createTextNode( codestring );

    textdiv.appendChild( txtContent );

    resultdiv.appendChild( textdiv );
    parentdiv.appendChild( resultdiv );

}

async function findCountry(){
    if ( findingCountry) return;
    findingCountry = true;

    changeErrorVisibility( false);

    let country = document.getElementById("searchfield").value;

    if ( countries.length === 0 ){
        delDomTree( document.getElementById( 'main' ) );
        await getCountries();
        createSearchField();
    }

    for( let i in countries ){
        if ( country === countries[i].name ){
            findingCountry = false;
            showCountry( countries[i] );
            return countries[i].name
        }
    }

    findingCountry = false;
    if ( APIerror === "" ){
        console.log('no such country' + country);
        showCountryError(country + " : No such country exists ")
    }else {
        showCountryError(APIerror);
    }
    return "";
}


// After all countries have been fetched, they are available in countries.
// To add all country names to the datalist, traverse the objects in countries
// and extract the name and add it to the datalist.

function buildCountryList(){
    let countrylist = document.createElement('datalist');
    countrylist.id = 'country-names';

    for( let i in countries){
        let o = document.createElement('option');
        let t = document.createTextNode(countries[i].name );

        o.appendChild(t);
        countrylist.appendChild(o);
    }

    return countrylist;
}



function createSearchField(){

    let body = document.querySelector('body');

// make surrounding div
    let parentdiv = document.createElement('div');
    parentdiv.id = "main";

    let errorField =  document.createElement('div');
    errorField.id  = "error-field";
    parentdiv.append(errorField);

    // Add the searchfield and the datalist
    let searchfield = document.createElement('input');
    searchfield.setAttribute('type', 'text');
    // refer to the datalist with id country-names
    searchfield.setAttribute('list', 'country-names');
    searchfield.id = "searchfield";

    // Don't add change event listener. It causes double firing with
    // the button click Event listener. Ij a proper form with a submit button
    // this very likely would work
    //searchfield.addEventListener('change', findCountry );
    parentdiv.appendChild( searchfield );
    // add datalist with id country-name to the parent div as well
    parentdiv.appendChild( buildCountryList() );

    // add a button
    let searchbutton = document.createElement('button');
    searchbutton.id  = "searchbutton";
    searchbutton.addEventListener('click', findCountry );

    let buttontext = document.createTextNode("Search Country");
    searchbutton.appendChild( buttontext);

    parentdiv.appendChild( searchbutton );

    // Add the main div to the body
    body.appendChild( parentdiv);

    if ( APIerror !== "" ){
        showCountryError( APIerror);
    }

}

// make main function async so we can await the getcountries function
//
async function main(){
    await getCountries();
    createSearchField();
}


window.onload = main;