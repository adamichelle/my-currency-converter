class MyConverter{
    constructor(){ 
        this.dbPromise = openDatabase();
        this.registerServiceWorker();
        this.getCurrencies()
        .then( () => {document.getElementById("status").style.display = "none"; console.log("Retriving currencies from api!"); return;})
        .catch( () => {
            console.log("Retriving currencies from IndexDB!");
            document.getElementById("status").style.display = "block";
            document.getElementById("status").innerHTML = "You're Offline."
            this.showCachedCurrencies();
        });

    }

    //retrieve currencies from the api and cache them
    getCurrencies() {
        const currencyListUrl = "https://free.currencyconverterapi.com/api/v5/currencies";
        return fetch(currencyListUrl)
        .then((resp) => resp.json()) // Transform the data into json
        .then((data) => {
            let currencies = data.results;
            let currenciesArray = Object.values(currencies);

            currenciesArray.sort((a, b) => a.currencyName.localeCompare(b.currencyName)) //sort the surrencies in alphabetical order by currency Name

            this.dbPromise.then(function(db){
                
                if(!db) return;

                let tx = db.transaction('currency-list', 'readwrite');
                let currencyListStore = tx.objectStore('currency-list');
                currenciesArray.forEach(function(currency) {
                  currencyListStore.put(currency);
                });
            });
            
            this.displayCurrencyDropdown(currenciesArray);       
        });
    }

    //display the currencies in the select dropdown
    displayCurrencyDropdown(currenciesArray){
        const select1 = document.getElementById("fromCurrency");
        const select2 = document.getElementById("toCurrency");
        return currenciesArray.map(function(currency){

            let options1 = document.createElement("option");
            options1.setAttribute("value", `${currency.id}`);
            options1.innerHTML = `${currency.currencyName} - ${currency.id}`;

            let options2 = document.createElement("option");
            options2.setAttribute("value", `${currency.id}`);
            options2.innerHTML = `${currency.currencyName} - ${currency.id}`;

            select1.appendChild(options1);
            select2.appendChild(options2);
                
        });
    }

    //Show currencies from the indexDB if network is not available
    showCachedCurrencies(){
        let MyConverter = this;

        return this.dbPromise.then(function(db) {
            // if we're already showing posts, eg shift-refresh
            // or the very first load, there's no point fetching
            // posts from IDB
            // if (!db || MyConverter) return;

            const index = db.transaction('currency-list')
            .objectStore('currency-list').index('by-currencyName');

            return index.getAll().then(function(currencies) {
                const select1 = document.getElementById("fromCurrency");
                const select2 = document.getElementById("toCurrency");
                return currencies.map(function(currency){

                    let options1 = document.createElement("option");
                    options1.setAttribute("value", `${currency.id}`);
                    options1.innerHTML = `${currency.currencyName} - ${currency.id}`;

                    let options2 = document.createElement("option");
                    options2.setAttribute("value", `${currency.id}`);
                    options2.innerHTML = `${currency.currencyName} - ${currency.id}`;

                    select1.appendChild(options1);
                    select2.appendChild(options2);
                        
                });
            });
        });
        
    }


    registerServiceWorker(){
        if(!navigator.serviceWorker) return;
        navigator.serviceWorker.register('/my-currency-converter/sw.js', {scope: '/my-currency-converter/'})
        .then( function(){
            console.log("Registered");
        })
        .catch( function(){
            console.log("Not registered");
        })
    }

    convertCurrency(amount, currencyFrom, currencyTo){
        this.amount = amount;
        this.currencyFrom = currencyFrom;
        this.currencyTo = currencyTo;
        let query = `${this.currencyFrom}_${this.currencyTo}`;
        let revertedQuery = `${this.currencyTo}_${this.currencyFrom}`;
        let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query},${revertedQuery}`;
        
        return fetch(url).then((response) => response.json())
        .then((data) => {
            let rates = data.results;       
            let ratesArray = Object.values(rates);

            //Store the rates in the indexDB
            this.dbPromise.then(function(db){
                if(!db) return;

                let tx = db.transaction('rate-list', 'readwrite');
                let rateListStore = tx.objectStore('rate-list');
                ratesArray.forEach(function(rate) {
                  rateListStore.put(rate);
                });
            });

            //Begin Conversion
            let newAmount, convertedAmount, rateConversionName, conversionRate;
            let resultEntry = ratesArray.find(rate => rate.id === query);
            if (resultEntry) {
                conversionRate = resultEntry.val;
                // console.log(conversionRate);
                newAmount = this.amount * conversionRate;
                convertedAmount = newAmount.toFixed(2);
                document.getElementById("toAmount").value = convertedAmount;
                document.getElementById("loader-icon").style.display = "none";
            }
        })
        .catch( () => {
            this.dbPromise.then( (db) => {
                if(!db) return; //if no db then no need to proceed

                //If there's provision for indexDB, get values that match the query
                let tx = db.transaction('rate-list');
                let rateListStore = tx.objectStore('rate-list');
                let rateQueryIndex = rateListStore.index('by-rateQuery');
                return rateQueryIndex.getAll(query);

            }).then( (rateDetailsArray) => {
                // console.log(rateDetailsArray);
                let offlineNewAmount, offlineConvertedAmount, offlineConversionRate;

                let offlineResultEntry = rateDetailsArray.find((offlineRate) => offlineRate.id === query);
                if(offlineResultEntry){
                    offlineConversionRate = offlineResultEntry.val;
                    offlineNewAmount = this.amount * offlineConversionRate;
                    offlineConvertedAmount = offlineNewAmount.toFixed(2);
                    document.getElementById("toAmount").value = offlineConvertedAmount;
                    document.getElementById("loader-icon").style.display = "none";
                }
                else{
                    let errorMsg = document.getElementById("error-msg");
                    errorMsg.style.display = 'block';
                    errorMsg.innerHTML = "Ooops! Sorry. You can't perform that conversion offline yet! Try it out when you're online.";
                    document.getElementById("loader-icon").style.display = "none";
                }
            })
        });
    }
}
/**End of MyConverter Class */

//function to open the database
function openDatabase(){
    // If the browser doesn't support service worker,
    // then no need to have a database
    if (!navigator.serviceWorker) {
        return Promise.resolve();
    }
    
    return idb.open('currency-converter', 1, function(upgradeDb) {
        let currencyListStore = upgradeDb.createObjectStore('currency-list', {
        keyPath: 'id'
        });
        currencyListStore.createIndex('by-currencyName', 'currencyName');

        let rateListstore = upgradeDb.createObjectStore('rate-list', {
            keyPath: 'id'
        });
        rateListstore.createIndex('by-rateQuery', 'id')
    });
}


//Check if user is connected or not
window.addEventListener('offline', () => {
    document.getElementById("status").style.display = "block";
    document.getElementById("status").innerHTML = "You're Offline."
}, false);

window.addEventListener('offline', () => {
    document.getElementById("status").style.display = "none";
}, false);


//When Page Loads
window.addEventListener("load", (e) => {
    $('[data-toggle="tooltip"]').tooltip(); //initialize tool tip
    let myCurrencyConverter = new MyConverter();
    let errorMsg = document.getElementById("error-msg");

    //convertion event
    document.getElementById("convert").addEventListener("click", () => {
        const fromAmountFieldValue = document.getElementById("fromAmount").value;
        // If amount field is empty
        if (fromAmountFieldValue === "" || fromAmountFieldValue === null || isNaN(fromAmountFieldValue) || fromAmountFieldValue < 1) {
            errorMsg.style.display = 'block';
            errorMsg.innerHTML = "Invalid Amount entered!!";              
            return false;
        } 
        document.getElementById("loader-icon").style.display = "inline";
        let amount = document.getElementById("fromAmount").value,
        currencyFrom = document.getElementById("fromCurrency").value,
        currencyTo = document.getElementById("toCurrency").value;
        myCurrencyConverter.convertCurrency(amount, currencyFrom, currencyTo);

    });

    //refresh form
    document.getElementById("refresh").addEventListener("click", () => {
        document.getElementById("converter-form").reset();
        errorMsg.style.display = "none";
    })
});