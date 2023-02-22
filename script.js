"use strict";
const currencyCodesEl = document.querySelectorAll(".currency__codes");
const inputBase = document.querySelector("#baseInput");
const inputOutput = document.querySelector("#output");

////////////////////////////////////////////////////////////////////////
// Default value for inputs
inputBase.value = 1;
exchange();

////////////////////////////////////////////////////////////////////////
// Click event for each currency code (remove & add "code__active" class)
currencyCodesEl.forEach((curCode) => {
  curCode.addEventListener("click", (e) => {
    [...curCode.children].forEach((el) => el.classList.remove("code__active"));

    e.target.classList.add("code__active");

    exchange()
  });
});


// https://api.exchangerate.host/latest?base=USD&symbols=RUB
async function exchange() {
  try {
    // select active currency code (base & output)
    const activeBaseCode = document.querySelector(
      ".base__currency .code__active"
    ).textContent;
    const activeOutputCode = document.querySelector(
      ".output__currency .code__active"
    ).textContent;

    // Fetch currency value
    const request = await fetch(
      `https://api.exchangerate.host/latest?base=${activeBaseCode}&symbols=${activeOutputCode}`
    );

    const response = await request.json();

    // Calculate result and display output
      inputOutput.value = (inputBase.value * response.rates[activeOutputCode]).toFixed(4);

      document.querySelector(".base__currency .sub__info").innerHTML = `
      1 ${activeBaseCode} = ${response.rates[activeOutputCode].toFixed(4)}
      `;
      // document.querySelector(".output__currency .sub__info").innerHTML = `
      // 1 ${activeOutputCode} = ${response.rates[activeBaseCode].toFixed(4)}
      // `;
    
  } catch (err) {
    console.error("Algoritmika bank exchange error: \n", err);
  }
}

// const ratesObj = exchange(baseCurrencyCode).then((data) => data);

// function calcOutputCurrency(baseValue, symbol) {
//   return ratesObj.then((data) => +baseValue * data[symbol]);
// }

// calcOutputCurrency(baseCurrencyValue, outputCurrencyCode).then((data) =>
//   console.log(data)
// );
