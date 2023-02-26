"use strict";
const currencyCodesEl = document.querySelectorAll(".currency__codes");
const inputBase = document.querySelector("#baseInput");
const inputOutput = document.querySelector("#output");

///////////////////////////////////////////////////////////
// Default value for inputs
inputBase.value = 1;
exchange();

///////////////////////////////////////////////////////////
// Click event for each currency code (remove & add "code__active" class)
currencyCodesEl.forEach((curCode) => {
  curCode.addEventListener("click", (e) => {
    [...curCode.children].forEach((el) => el.classList.remove("code__active"));

    e.target.classList.add("code__active");
    exchange();
  });
});

///////////////////////////////////////////////////////////
// fetch and calc data while typing into input field
[inputBase, inputOutput].forEach((input) => {
  input.addEventListener("keydown", (e) => {
    const regEx = /[0-9.,]|backspace/i;
    const regEx2 = /[.,]/i;
    // console.log(e);
    if (e.key.match(regEx)) {
      if (e.key.match(regEx2) && e.target.value.match(regEx2)) {
        e.preventDefault();
      }
      if (e.target.closest("#baseCurrencyWrapper")) exchange();
      else if (e.target.closest("#outputCurrencyWrapper")) exchange("output");
    } else {
      e.preventDefault();
    }
  });
});

async function exchange(dir = "base") {
  try {
    // select active currency code (base & output)
    const activeBaseCode = document.querySelector(
      ".base__currency .code__active"
    ).textContent;
    const activeOutputCode = document.querySelector(
      ".output__currency .code__active"
    ).textContent;

    let base, symbol;

    if (dir === "base") {
      base = activeBaseCode;
      symbol = activeOutputCode;
    } else {
      base = activeOutputCode;
      symbol = activeBaseCode;
    }

    if (base === symbol) {
      inputOutput.value = inputBase.value;
      document.querySelector(".base__currency .sub__info").innerHTML = `
      1 ${base} = 1.0000 ${symbol}
      `;
      document.querySelector(".output__currency .sub__info").innerHTML = `
    1 ${symbol} = 1.0000 ${base}
    `;
    } else {
      // Fetch currency value based on base wrapper
      const request = await fetch(
        `https://api.exchangerate.host/latest?base=${base}&symbols=${symbol}`
      );

      const response = await request.json();

      // Calculate result and display output
      inputBase.value = inputBase.value.replace(",", ".");
      inputOutput.value = inputOutput.value.replace(",", ".");

      if (dir === "base") {
        inputOutput.value = (inputBase.value * response.rates[symbol]).toFixed(
          4
        );
      } else {
        inputBase.value = (inputOutput.value * response.rates[symbol]).toFixed(
          4
        );

        // [base, symbol] = [symbol, base];
      }

      document.querySelector(".base__currency .sub__info").innerHTML = `
      1 ${activeBaseCode} = ${response.rates[activeOutputCode].toFixed(
        4
      )} ${activeOutputCode}
      `;
      document.querySelector(".output__currency .sub__info").innerHTML = `
    1 ${activeOutputCode} = ${(1 / response.rates[activeOutputCode]).toFixed(
        4
      )} ${activeBaseCode}
    `;
    }
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
