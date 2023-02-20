"use strict";
const baseCurrencyCode = 'USD';
const outputCurrencyCode = 'RUB';
const baseCurrencyValue = '2';



// https://api.exchangerate.host/latest?base=USD&symbols=RUB
async function fetchRate(base) {
  try {
    const request = await fetch(
      `https://api.exchangerate.host/latest?base=${base}&symbols=RUB,USD,EUR,GBP`
    );

    const response = await request.json();

    return response.rates;  

  } catch (err) {
    console.error('Algoritmika bank exchange error: \n', err);
  }
}

// fetchRate("USD", "RUB").then(data => console.log(data))

const ratesObj = fetchRate(baseCurrencyCode).then(data => data)


function calcOutputCurrency(baseValue, symbol) {
   return  ratesObj.then(data => +baseValue * data[symbol])
}

calcOutputCurrency(baseCurrencyValue, outputCurrencyCode)
.then(data => console.log(data))