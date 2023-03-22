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
const inputHandler = (e) => {
  const keyName = e.key;
  const input = e.target;
  const regEx = /[0-9.,]|backspace/i;
  const regEx2 = /[.,]/i;

  // if entered character is valid (0 - 9 . , backspace)
  if (keyName.match(regEx)) {
    // correct input value
    inputBase.value = inputBase.value.replace(",", ".");
    inputOutput.value = inputOutput.value.replace(",", ".");
    inputBase.value = inputBase.value === "." ? "0." : inputBase.value;
    inputOutput.value = inputOutput.value === "." ? "0." : inputOutput.value;

    // check if there is already one dot char. then prevent action
    if (keyName.match(regEx2) && input.value.match(regEx2)) {
      e.preventDefault();
      return;
    }

    // on keyup calculate values
    if (e.type === "keyup") {
      if (input.closest("#baseCurrencyWrapper")) exchange();
      else exchange("output");
    }
    return;
  }
  // if entered char. don't match with valid chars.
  e.preventDefault();
};

[inputBase, inputOutput].forEach((input) => {
  // prevent action if there is an invalid value entered
  input.addEventListener("keydown", inputHandler);

  // call exchange function (calculate) on keyup event
  input.addEventListener("keyup", inputHandler);
});

/////////////////////////////////////////////////////////////
// function for fetch and calculate currency rates
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

      return;
    }
    // Fetch currency value based on base wrapper
    const request = await fetch(
      `https://api.exchangerate.host/latest?base=${activeBase}&symbols=${activeSymbol}`
    );

    const request2 = await fetch(
      `https://api.exchangerate.host/latest?base=${activeSymbol}&symbols=${activeBase}`
    );

    const response = await request.json();
    const response2 = await request2.json();

    // Calculate result and display output
    if (dir === "base") {
      // if request depends on base side
      inputOutput.value = (
        inputBase.value * response.rates[activeSymbol]
      ).toFixed(4);

      // show sub info  about rate
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
  } catch (err) {
    alert("Something went wrong. Please check your network and try again");
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
