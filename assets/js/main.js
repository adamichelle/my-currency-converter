class MainController{
    constructor(){ 
        this.dbPromise = openDatabase();
        this.registerServiceWorker();
        this.showCachedCurrencies().then(function() {
            onSocketOpen();
        });
    }

    onSocketOpen() {
        const currencyListUrl = "https://free.currencyconverterapi.com/api/v5/currencies";
        fetch(currencyListUrl)
        .then((resp) => resp.json()) // Transform the data into json
        .then((data) => {
            let currencies = data.results;
            let currenciesArray = Object.values(currencies);
            console.log(currenciesArray);
            currenciesArray.sort((a, b) => a.currencyName.localeCompare(b.currencyName)) //sort the surrencies in alphabetical order by currency Name

            this.dbPromise.then(function(db){
                
                if(!db) return;

                let tx = db.transaction('currency-list', 'readwrite');
                let store = tx.objectStore('currency-list');
                currenciesArray.forEach(function(currency) {
                  store.put(currency);
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

        return this._dbPromise.then(function(db) {
            // if we're already showing posts, eg shift-refresh
            // or the very first load, there's no point fetching
            // posts from IDB
            if (!db || (document.getElementById("fromCurrency").value == 0 && document.getElementById("toCurrency") == 0)) return;

            const index = db.transaction('currency-list')
            .objectStore('currency-list').index('currencyName');

            return index.getAll().then(function(currencies) {
            // indexController._postsView.addPosts(messages.reverse());
                MainController.displayCurrencyDropdown(currencies)
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
}

function openDatabase(){
    // If the browser doesn't support service worker,
    // then no need to have a database
    if (!navigator.serviceWorker) {
        return Promise.resolve();
    }
    
    return idb.open('currency-converter', 1, function(upgradeDb) {
        var store = upgradeDb.createObjectStore('currency-list', {
        keyPath: 'id'
        });
        store.createIndex('by-currencyName', 'currencyName');
    });
}




window.addEventListener("load", (e) => {
    let myCurrencyConverter = new MainController();
});