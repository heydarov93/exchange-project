"use strict";
const currencyCodesEl = document.querySelectorAll(".currency__codes");
const inputBase = document.querySelector("#baseInput");
const inputOutput = document.querySelector("#output");
const navLinksEl = document.querySelector(".nav__links");
const navLinks = navLinksEl.querySelectorAll("a");
const baseSubInfo = document.querySelector(".base__currency .sub__info");
const outputSubInfo = document.querySelector(".output__currency .sub__info");
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
[inputBase, inputOutput].forEach((input, i, arr) => {
  input.addEventListener("keyup", (e) => {
    const regEx = /[0-9.,]|backspace/i;
    const regEx2 = /[.,]/i;

    if (e.key.match(regEx)) {
      if (e.key.match(regEx2) && e.target.value.match(regEx2))
        e.preventDefault();

      if (e.target.closest("#baseCurrencyWrapper")) exchange();
      else exchange("output");
    } else {
      e.preventDefault();
    }
  });
});

async function exchange(dir = "base") {
  try {
    // select active currency code (base & output)
    const activeBase = document.querySelector(
      ".base__currency .code__active"
    ).textContent;
    const activeSymbol = document.querySelector(
      ".output__currency .code__active"
    ).textContent;

    if (activeBase === activeSymbol) {
      // don't send request if both currencies are the  same
      if (dir === "base") inputOutput.value = inputBase.value;
      else inputBase.value = inputOutput.value;

      baseSubInfo.innerHTML = `
      1 ${activeBase} = 1.0000 ${activeSymbol}
      `;
      outputSubInfo.innerHTML = `
    1 ${activeSymbol} = 1.0000 ${activeBase}
    `;
    } else {
      // Fetch currency value based on base wrapper

      const request = await fetch(
        `https://api.exchangerate.host/latest?base=${activeBase}&symbols=${activeSymbol}`
      );

      const request2 = await fetch(
        `https://api.exchangerate.host/latest?base=${activeSymbol}&symbols=${activeBase}`
      );

      const response = await request.json();
      const response2 = await request2.json();

      // correct input value
      inputBase.value = inputBase.value.replace(",", ".");
      inputOutput.value = inputOutput.value.replace(",", ".");
      inputBase.value = inputBase.value === "." ? "0." : inputBase.value;
      inputOutput.value = inputOutput.value === "." ? "0." : inputOutput.value;

      // Calculate result and display output
      if (dir === "base") {
        // if request depends on base side
        inputOutput.value = (
          inputBase.value * response.rates[activeSymbol]
        ).toFixed(4);

        // show sub infos  about rate
        baseSubInfo.innerHTML = `
        1 ${activeBase} = 
        ${response.rates[activeSymbol].toFixed(4)} ${activeSymbol}`;

        outputSubInfo.innerHTML = `
      1 ${activeSymbol} = 
      ${response2.rates[activeBase].toFixed(4)} ${activeBase}`;
      } else {
        // if request depends on output side
        inputBase.value = (
          inputOutput.value * response2.rates[activeBase]
        ).toFixed(4);

        // show sub infos  about rate
        baseSubInfo.innerHTML = `
      1 ${activeBase} = 
      ${response.rates[activeSymbol].toFixed(4)} ${activeSymbol}`;

        outputSubInfo.innerHTML = `
        1 ${activeSymbol} = 
        ${response2.rates[activeBase].toFixed(4)} ${activeBase}`;
      }
    }
  } catch (err) {
    alert("Xəta baş verdi");
  }
}

//////////////////////////////////////////////////////////////////////////
// hover effect for nav links
navLinksEl.addEventListener("mouseover", (e) => {
  [...navLinks].forEach((link) => {
    if (link !== e.target && e.target !== e.currentTarget) {
      document.querySelector(".nav__link__active a").style.color = "#959BA4";
      link.style.opacity = 0.5;
    }
  });
});

navLinksEl.addEventListener("mouseout", () => {
  document.querySelector(".nav__link__active a").style.color = "#000";
  [...navLinks].forEach((link) => {
    link.style.opacity = 1;
  });
});
