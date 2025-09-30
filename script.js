const BASE_URL = "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_SARvnyHWQhsgp3wR4GgDVk5y3dR35Xbz9X4NxxLI";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const fixedText = document.querySelector(".fixed-text");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    const option = document.createElement("option");
    option.value = currCode;
    option.textContent = currCode;
    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
      fixedText.textContent = currencySymbolMap[currCode]?.symbol || "";
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }
    select.append(option);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    if (evt.target.name === "from") {
      const newSymbol = currencySymbolMap[evt.target.value]?.symbol || "";
      fixedText.textContent = newSymbol;
    }
  });
}

const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  const img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  const amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || isNaN(amtVal) || amtVal <= 0) {
    alert("Amount must be a positive number!");
    amtVal = 1;
    amount.value = "1";
  }
  const URL = `${BASE_URL}&base_currency=${fromCurr.value}&currencies=${toCurr.value}`;
  const response = await fetch(URL);
  const data = await response.json();
  const rate = data.data[toCurr.value];
  const finalAmount = (amtVal * rate).toFixed(2);
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
});
