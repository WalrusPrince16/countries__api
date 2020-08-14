const selectRegion = document.getElementById('selectRegion');
const button = document.getElementById('btn');
const grid = document.getElementById('countries__grid');
const countryDetailsFlagImg = document.getElementById('country__details-flag-img');
const heading = document.getElementById('heading');
const details = document.getElementById('country__details');
const themeToggle = document.getElementById('theme');
const searchInput = document.getElementById('countries__search');
const searchList = document.getElementById('countries__list');


// * Filter By Region

function initAPIcall(call) {
    grid.innerHTML = "";
    if (call === 'region/all') call = call.replace('region/', '');
    return call;
}

// * Make API Call

function useAPI(call) {
    let formattedCall = initAPIcall(call);
    fetch(`https://restcountries.eu/rest/v2/${formattedCall}`)
        .then(res => res.json())
        .then(data => {
            data.forEach(country => {
                createCountryCard(country);
                populateSearchList(country);
            });
        });
}

// * Populate Results List

function getResult(country) {
    let result = document.createElement('li');
    result.innerText = country.name;
    result.addEventListener('click', () => addDetails(country));
    return result;
}

function populateResults() {
    let filter = searchInput.value.toUpperCase();
    let lis = searchList.children;
    for (let i = 0; i < lis.length; i++) {
        const element = lis[i];
        if (element.innerText.toUpperCase().indexOf(filter) > -1 || filter == '') {
            element.style.display = "";
        } else {
            element.style.display = "none";
        }
    }
}

function populateSearchList(country) {
    let result = getResult(country);
    searchList.appendChild(result);
}

// * Build Country Cards

function getFlag(country) {
    let flagImgElem = document.createElement('div');
    flagImgElem.classList = 'country__flag';
    let flagImgSrc = country.flag;
    flagImgElem.style.backgroundImage = `url(${flagImgSrc})`;
    return flagImgElem;
}

function getCountryText(country) {
    let countryTextElem = document.createElement('div');
    countryTextElem.classList = 'country__text';
    countryTextElem.innerHTML =
        /*html*/
        `
    <h1 class="country__text-heading">${country.name}</h1>
    <p><span class="country__text-bold">Population</span>: ${country.population}</p>
    <p><span class="country__text-bold">Region</span>: ${country.region}</p>
    <p><span class="country__text-bold">Capital</span>: ${country.capital}</p>
    `;
    return countryTextElem;
}

function createCountryCard(country) {
    let countryElement = document.createElement('div');
    countryElement.classList = 'country__card';

    let countryFlag = getFlag(country);
    let countryText = getCountryText(country);

    countryElement.appendChild(countryFlag);
    countryElement.appendChild(countryText);
    countryElement.addEventListener('click', () => addDetails(country));

    grid.appendChild(countryElement);
}

// * Build Fullscreen Page

function getFlagDetails(flag) {
    let flagElem = document.getElementById('country__details-flag-img');
    flagElem.style.backgroundImage = `url(${flag})`;
}

function getArrayData(arr) {
    let str = '';
    if (arr.length > 1) {
        arr.forEach(data => {
            str += `${data.name}, `;
        });
    } else if (arr.length === 1) {
        str += arr[0].name;
    }
    return str;
}

function setTextDetails(country) {
    document.getElementById('heading').innerText = country.name;
    let countryFacts = document.getElementById('country__facts');
    countryFacts.innerHTML =
        /*html*/
        `
    <p><span class="country__text-bold">Native Name: </span>
    ${country.nativeName}
    </p>
    <p><span class="country__text-bold">Population: </span>
    ${country.population}
    </p>
    <p><span class="country__text-bold">Region: </span>
    ${country.region}
    </p>
    <p><span class="country__text-bold">Sub Region: </span>
    ${country.subregion}
    </p>
    <p><span class="country__text-bold">Capital: </span>
    ${country.capital}
    </p>
    <p><span class="country__text-bold">Top Level Domain: </span>
    ${country.topLevelDomain}
    </p>
    <p><span class="country__text-bold">Currencies: </span>
    ${getArrayData(country.currencies)}
    </p>
    <p><span class="country__text-bold">Languages: </span>
    ${getArrayData(country.languages)}
    </p>
    `;
}

function addBorderCountry(border) {
    let borderLi = document.createElement('li');
    borderLi.classList = 'country__borders-li'
    borderLi.innerText = border;
    fetch(`https://restcountries.eu/rest/v2/alpha/${borderLi.innerText}`).then(
            res => res.json())
        .then(data => {
            let countryData = data;
            borderLi.addEventListener('click', () => {
                getCountryDetails(countryData);
            });
        });
    return borderLi;
}

async function setBorderCountryDetails(borders) {
    let bordersList = document.getElementById('country__borders');
    if (borders.length < 1) {
        bordersList.innerHTML = `No Bordering Countries`
        return;
    } else {
        bordersList.innerHTML = "Border Countries: "
        borders.forEach(border => {
            let borderCountryElem = addBorderCountry(border);
            bordersList.appendChild(borderCountryElem);
        });
    }
}

function getCountryDetails(country) {
    getFlagDetails(country.flag);
    setTextDetails(country);
    setBorderCountryDetails(country.borders);
}

function addDetails(country) {
    getCountryDetails(country);
    details.classList.toggle('country__details--toggle');
}

function customDropDown() {
    let options = document.querySelectorAll('.select__option');
    let dropDownList = document.querySelector('.select__list');
    dropDownList.classList.toggle('select__option--open');

    options.forEach((option) => {
        option.addEventListener('click', () => useAPI(`region/${option.dataset.region}`));
    });
}

// * Event Listeners

function addEvents() {
    selectRegion.addEventListener('click', () => customDropDown());
    button.addEventListener('click', () => details.classList.toggle('country__details--toggle'));
    themeToggle.addEventListener('click', () => {
        let htmlElem = document.querySelector('html');
        htmlElem.classList.toggle('dark');
        if (htmlElem.classList == 'dark') {
            themeToggle.innerHTML = `<i class="fas fa-moon"></i> Dark Mode`;
        } else {
            themeToggle.innerHTML = `<i class="fas fa-sun"></i> Light Mode`;
        }
    });
    searchInput.addEventListener('keyup', populateResults);
}

// * Init

function init() {
    addEvents();
    useAPI("all");
}

init();