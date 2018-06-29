class MainController{
    constructor(){ 
        this.dbPromise = openDatabase();
        this.registerServiceWorker();
        this.onSocketOpen()
        .then( () => {console.log("Retriving currencies from api!"); return;})
        .catch( () => {
            console.log("Retriving currencies from IndexDB!");
            this.showCachedCurrencies();
        });

    }

    onSocketOpen() {
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

    showCachedCurrencies(){
        let MainController = this;

        return this.dbPromise.then(function(db) {
            // if we're already showing posts, eg shift-refresh
            // or the very first load, there's no point fetching
            // posts from IDB
            // if (!db || MainController) return;

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
        let revertedQuery = `${this.currencyTo}_${this.currencyFrom}`
        let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query},${revertedQuery}`;
        console.log(url);
        return fetch(url).then((response) => response.json())
        .then((data) => {
            let rates = data.results;       
            let ratesArray = Object.values(rates);

            // console.log(ratesArray);
            this.dbPromise.then(function(db){
                if(!db) return;

                let tx = db.transaction('rate-list', 'readwrite');
                let rateListStore = tx.objectStore('rate-list');
                ratesArray.forEach(function(rate) {
                  rateListStore.put(rate);
                });
            });

            let result;
            let newAmount, convertedAmount, rateConversionName;
            
            let resultEntry = ratesArray.find(rate => rate.id === query);
            if (resultEntry) {
                conversionRate = resultEntry.val;
                console(conversionRate);
            }

            /* let resultObj = ratesArray.filter(rate => rate.id == query);
            console.log(resultObj);
            if (resultObj) {
                result = resultObj.val;
                console.log(result);
            }
 */
            /* result = resultObj.val;
            console.log(result); */
            /* newAmount = this.amount * result;
            convertedAmount = newAmount.toFixed(2);
            document.getElementById("toAmount").value = convertedAmount; */
        })
    }
}

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




window.addEventListener("load", (e) => {
    let myCurrencyConverter = new MainController();
    
    document.getElementById("convert").addEventListener("click", () => {
        let amount = document.getElementById("fromAmount").value,
        currencyFrom = document.getElementById("fromCurrency").value,
        currencyTo = document.getElementById("toCurrency").value;
        myCurrencyConverter.convertCurrency(amount, currencyFrom, currencyTo);

    });
});