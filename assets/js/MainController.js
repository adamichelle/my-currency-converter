export class MainController{
    constructor(){
        this.init();
        this.dbPromise = openDatabase();
        this.registerServiceWorker();
        
    }

    static init(){     
            const currencyListUrl = "https://free.currencyconverterapi.com/api/v5/currencies";
            fetch(currencyListUrl)
            .then((resp) => resp.json()) // Transform the data into json
            .then(function(data){
                let currencies = data.results;
                currenciesArray = Object.values(currencies);
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