# exchange-project

### this is my course task project.Main goal in this project to show knowledge of async javascript, fetching data from exchange rate api

### What problems solves this project (brief overview)

We have static ui which is not so important.It is just for demonstration. But it had to be the same as the figma template I was given.And it is.
Main parts of this exchange project are two dynamic inputs.And above each input field are currency code buttons.When client click one of this buttons
it sends request to <a href="https://api.exchangerate.host/latest?base=USD&symbols=RUB">**Api**</a> with required currency codes - base currency and symbol currency.
When we type in input so on every change of input no matter which one of them they also send request to <a href="https://api.exchangerate.host/latest?base=USD&symbols=RUB">**Api**</a>.Finally it takes value of inputs and calculate output depending on rates which we recieved from **Api**.

### Features

1. Inputs only accept **_numbers, period, comma and backspace_**
2. When client types **_comma_** its automatically **_changes to dot_**
3. When client types **_dot_** as a first character then it dynamically changes to **"0."**
4. Each input can only accept one **_period_**
5. On every click to each button request and calculation happens depend on **_base input field_**
6. On every change of inputs request and calculation happens according to that input
7. If the currency codes are the same on both sides, **_no request is sent_**

[![Top Langs](https://github.com/heydarov93/exchange-project.git)]
[![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=heydarov93/exchange-project.git)](https://github.com/anuraghazra/github-readme-stats)
