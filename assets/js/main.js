class MainController{
    constructor(){ 
        this.dbPromise = openDatabase();
        this.registerServiceWorker();
    }

    static init(select1, select2){
        this.select1 = select1;
        this.select2 = select2;
        this.dbPromise = openDatabase();
        
        const currencyListUrl = "https://free.currencyconverterapi.com/api/v5/currencies";
        fetch(currencyListUrl)
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data){
            let currencies = data.results;
            this.dbPromise.then(function(db){
                
                if(!db) return;

                let tx = db.transaction('currencies', 'readwrite');
                let store = tx.objectStore('currencies');
                currencies.forEach(function(currency) {
                  store.put(currency);
                });
            });
            
            let currenciesArray = Object.values(currencies);
            currenciesArray.sort((a, b) => a.currencyName.localeCompare(b.currencyName)) //sort the surrencies in alphabetical order by currency Name
         
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
                
            });
    }

    static registerServiceWorker(){
        if(!navigator.serviceWorker) return;
        navigator.serviceWorker.register('/my-currency-converter/sw.js', {scope: '/my-currency-converter/'})
        .then( function(){
            console.log("Registered");
        })
        .catch( function(){
            console.log("Not registered");
        })
    }

    static openDatabase(){
        // If the browser doesn't support service worker,
        // then no need to have a database
        if (!navigator.serviceWorker) {
            return Promise.resolve();
        }
        
        return idb.open('currency-converter', 1, function(upgradeDb) {
            var store = upgradeDb.createObjectStore('currencies', {
            keyPath: 'id'
            });
            store.createIndex('by-currencyName', 'currencyName');
        });
        }
}

window.addEventListener("load", (e) => {
    const select1 = document.getElementById("fromCurrency");
    const select2 = document.getElementById("toCurrency");
    MainController.init(select1, select2);
    MainController.registerServiceWorker();
})