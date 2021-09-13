// const axios = require('axios')

let countries = [];

// APIError defined globally, so it can be displayed depending on
// contents (empty or not).

let APIerror = "";

// delete a DOMtree, including the parent element in the parameter to this function

function delDomTree(root) {
    for (let i = 0; i < root.children.length; i++) {
        delDomTree(root.children[i]);
    }
    root.remove();
}

// if string is undefined, empty or contains '['
// return the empty message

function cleanString(string, emptyMessage) {

    let out = string ?? emptyMessage;
    if (out.includes('[') ) out = emptyMessage;
    return out;

}


// format an array of objects with the name attribute to a comma
// separated string with last 2 element separated by 'and' in stead of ','.
// so results:
// one -> one
// one,two -> one and two
// one,two,three -> one,two and three.

function array2String(A) {
    let string = '';
    let alen = A.length;
    for (let i = 0; i < alen; ++i) {
        string += cleanString(A[i].name, "unspecified others")
        switch (i) {
            case (alen - 1):
                break;
            case (alen - 2):
                string += ' and ';
                break;
            default:
                string += ', ';
                break;
        }
    }

    //console.log( string );

    return string;
}


// Collect all countries and select relevant fields for our app
async function getCountries() {
    APIerror = "";
    try {
        const result = await axios.get('https://restcountries.eu/rest/v2/all?fields=name;capital;population;currencies;languages;flag;subregion');

        for (let i in result.data) {
            ({
                name: c.name,
                capital: c.capital,
                languages: c.languages,
                currencies: c.currencies,
                flag: c.flag,
                population: c.population,
                subregion: c.subregion
            } = result.data[i]);
            countries.push(c);
        }
        //console.log( countries );
    } catch (e) {
        console.error(e);
        APIerror = " Unable to collect country data. The network may be failing or the website may be down. Try again later."
        console.warn(APIerror);
    }
}

function changeErrorVisibility(onoff) {
    let errorField = document.getElementById('error-field');

    if (onoff) {
        errorField.classList.remove('hidden');
        errorField.classList.add('visible');
    } else {
        errorField.classList.remove('visible');
        errorField.classList.add('hidden');
    }
}

function showCountryError(text) {
    let errorField = document.getElementById('error-field');
    errorField.innerHTML = text;
    changeErrorVisibility(true);
    console.error(text);
}


// once found, show the country details as per the specification.
// no handling of errors or omissions in the country api,
// these issues may be transient

function showCountry(countryObject) {
    //log( "Showing " + countryObject.name );
    document.getElementById('searchfield').value = '';
    try {
        delDomTree(document.getElementById('result'));
    } catch (e) {
        //Never mind, first time use
    }
    let parentdiv = document.getElementById('main');
    let resultdiv = document.createElement('div');
    resultdiv.id = 'result';

    let flag = document.createElement('img');
    flag.id = 'flag';
    flag.src = countryObject.flag;
    flag.style.height = '100px';

    resultdiv.appendChild(flag);

    let textdiv = document.createElement('div');
    textdiv.id = 'description';

    let nameElement = document.createElement('h2');
    let nameElementTxt = document.createTextNode(countryObject.name);
    nameElement.appendChild(nameElementTxt);
    resultdiv.appendChild(nameElement);

    // initialize codestring to '' to make sure you can always use +=
    // without testing if this is the first part of the codestring.

    let codestring = '';
    codestring += countryObject.name;
    if (cleanString(countryObject.subregion, '') !== '') {
        codestring += ' is situated  in ' + cleanString(countryObject.subregion, '') + '.\nIt has';
    } else {
        codestring += ' has';
    }
    codestring += ' a population of ' + Number(countryObject.population).toLocaleString('en-en') + ' people.';
    if (cleanString(countryObject.capital, "") !== "") {
        codestring += ' The capital is ' + countryObject.capital + ' and you';
    } else {
        codestring += ' No capital is registered. You'
    }
    codestring += ' can pay with ' + array2String(countryObject.currencies) + '.\n';
    codestring += 'They speak ' + array2String(countryObject.languages) + '.\n';

    let txtContent = document.createTextNode(codestring);

    textdiv.appendChild(txtContent);

    resultdiv.appendChild(textdiv);
    parentdiv.appendChild(resultdiv);

}


async function findCountry(event) {
    // make sure no page reloads, other events fire etc.
    event.preventDefault();

    changeErrorVisibility(false);

    let country = document.getElementById("searchfield").value;

    if (countries.length === 0) {
        delDomTree(document.getElementById('main'));
        await getCountries();
        createSearchField();
    }

    for (let i in countries) {
        if (country === countries[i].name) {
            showCountry(countries[i]);
            return false;
        }
    }

    if (APIerror === "") {
        console.warn('no such country' + country);
        showCountryError(country + " : No such country exists ")
    } else {
        showCountryError(APIerror);
    }
    return false;
}


// After all countries have been fetched, they are available in countries.
// To add all country names to the datalist, traverse the objects in countries
// and extract the name and add it to the datalist.

function buildCountryList() {
    let countrylist = document.createElement('datalist');
    countrylist.id = 'country-names';

    for (let i in countries) {
        let o = document.createElement('option');
        let t = document.createTextNode(countries[i].name);

        o.appendChild(t);
        countrylist.appendChild(o);
    }

    return countrylist;
}


function createSearchField() {

    let body = document.querySelector('body');

// make surrounding div
    let parentdiv = document.createElement('div');
    parentdiv.id = "main";

    let errorField = document.createElement('div');
    errorField.id = "error-field";
    parentdiv.append(errorField);

//searchForm. This allows for submitting the query both by clicking
// search button and hitting enter after a country is selected of entered,
// provided an event.preventDefault is done in the submit event handler.

    let searchForm = document.createElement('form');
    searchForm.addEventListener('submit', findCountry);

    // Add the searchfield and the datalist
    let searchfield = document.createElement('input');
    searchfield.setAttribute('type', 'text');
    // refer to the datalist with id country-names
    searchfield.setAttribute('list', 'country-names');
    searchfield.id = "searchfield";

    searchForm.appendChild(searchfield);
    // add datalist with id country-name to the parent div as well
    searchForm.appendChild(buildCountryList());

    // add a button
    let searchbutton = document.createElement('button');
    searchbutton.setAttribute('type', 'submit');
    searchbutton.id = "searchbutton";

    let buttontext = document.createTextNode("Search Country");
    searchbutton.appendChild(buttontext);

    searchForm.appendChild(searchbutton);

    parentdiv.appendChild(searchForm);


    // Add the main div to the body
    body.appendChild(parentdiv);

    if (APIerror !== "") {
        showCountryError(APIerror);
    }

}

// make main function async so we can await the getcountries function
//
async function main() {
    // retrieve all possible data.
    // This is a bit naughty, as this was not what was asked (
    // call the api at every query).
    // However, as there only so many countries (~250), there is no possible
    // issue of this overpowering the client, especially when collecting
    // only the required fields.
    // And it improves speed and allows for a nice datalist to the text input.
    await getCountries();
    //add the search field
    createSearchField();
}


window.onload = main;