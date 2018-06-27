const select1 = document.getElementById("fromCurrency");
const select2 = document.getElementById("toCurrency");
const amountInput = document.getElementById("fromAmount");
const amountOutput = document.getElementById("toAmount");

window.addEventListener("load", e => {
    getAllCurrencies();

    document.getElementById("convert").addEventListener("click", function convertCurrency(amount, currencyFrom, currencyTo) {
    amount = amountInput.value;
    currencyFrom = select1.value;
    currencyTo = select2.value;
    let query = `${currencyFrom}_${currencyTo}`;
    let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`;
    
    fetch(url).then((response) => response.json())
    .then(function(data){
        let resultObj = data;
        for(const key in resultObj){
            result = resultObj[key];               
        }
        // console.log(result);
        newAmount = amount * result;
        convertedAmount = newAmount.toFixed(2);
        amountOutput.value = convertedAmount;
    });
    });

    registerServiceWorker();
});

//to get the list of all currencies for the drop down
function getAllCurrencies() {
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

function registerServiceWorker() {
    if(!navigator.serviceWorker) return;
    navigator.serviceWorker.register('/{repository}/sw.js', {scope: '/{repository}/'})
    .then( function(){
        console.log("Registered");
    })
    .catch( function(){
        console.log("Not registered");
    })
}