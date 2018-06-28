class MainController{
    constructor(){ 
        this.dbPromise = openDatabase();
        this.registerServiceWorker();
    }

    static init(select1, select2, amountInput, amountOutput){
        const select1 = document.getElementById("fromCurrency");
        const select2 = document.getElementById("toCurrency");
        const amountInput = document.getElementById("fromAmount");
        const amountOutput = document.getElementById("toAmount");
        
            const currencyListUrl = "https://free.currencyconverterapi.com/api/v5/currencies";
            fetch(currencyListUrl)
            .then((resp) => resp.json()) // Transform the data into json
            .then(function(data){
                let currencies = data.results;
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
}

window.addEventListener("load", (e) => {
    MainController.init();
})