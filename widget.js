"use strict";

const CLOCK_HTML = `
<div id="clock">
  <div id="digits">
    <div class="cell">
      <div id="top-section-0" class="top-section"></div>
      <div id="0" class="special-content"></div>
    </div>
    <div class="cell">
      <div id="top-section-1" class="top-section"></div>
      <div id="1" class="digit-content"></div>
    </div>
    <div class="cell">
      <div id="top-section-2" class="top-section"></div>
      <div id="2" class="digit-content"></div>
    </div>
    <div class="cell">
      <div id="top-section-3" class="top-section"></div>
      <div id="3" class="digit-content"></div>
    </div>
    <div class="cell">
      <div id="top-section-4" class="top-section"></div>
      <div id="4" class="digit-content"></div>
    </div>
    <div class="cell">
      <div id="top-section-5" class="top-section"></div>
      <div id="5" class="digit-content"></div>
    </div>
    <div class="cell">
      <div id="top-section-6" class="top-section"></div>
      <div id="6" class="digit-content"></div>
    </div>
  </div>
</div>
`;

const OPTIONS = ["HEIGHT", "MOSCOWTIME", "BTCUSD", "SATUSD"];

const FETCH_INTERVAL = 10000;

const BTC_USD_HTML = `
  <div>
    <div class="special-upper">&nbsp;BTC&nbsp;</div>
    <div class="special-separator"></div>
    <div class="special-lower">&nbsp;USD&nbsp;</div>
  </div>
`;

const SAT_USD_HTML = `
  <div>
    <div class="special-upper">&nbsp;SATS&nbsp;</div>
    <div class="special-separator"></div>
    <div class="special-lower">&nbsp;USD&nbsp;</div>
  </div>
`;

const MOSCOW_TIME_HTML = `
  <div>
    <div class="special-upper-small">&nbsp;MOSCOW&nbsp;</div>
    <div class="special-separator"></div>
    <div class="special-lower-small">&nbsp;TIME&nbsp;</div>
  </div>
`;

const VALID_DISPLAY_OPTIONS = ["blockheight", "usdprice", "satsperdollar", "moscowtime"]

let displayOptions;
let activeOption;
let activeView;
let cycleInterval = 3000;

let priceUsd;
let blockHeight;
let satUsd;

// Sets the values of the top section of each cell
function setTopSections(values) {
  for (let i = 0; i < 7; i += 1) {
    document.getElementById(`top-section-${i}`).innerHTML = values[i] || "";
  }
}

function setDimensions() {
  const clockContainer = document.getElementById("blockclock-container");
  const clock = document.getElementById("clock");
  const digits = document.getElementById("digits");

  clockContainer.style.height = `${0.336 * clockContainer.clientWidth}px`;
  clock.style.height = `${0.336 * clockContainer.clientWidth}px`;
  digits.style.height = `${0.59 * clock.clientHeight}px`;

  Array.from(document.getElementsByClassName("digit-content")).forEach((el) => {
    el.style.fontSize = `${0.49 * clock.clientHeight}px`;
  });

  Array.from(document.getElementsByClassName("top-section")).forEach((el) => {
    el.style.fontSize = `${0.0225 * clock.clientHeight}px`;
  });

  Array.from(document.getElementsByClassName("special-content")).forEach(
    (el) => {
      el.style.fontSize = `${0.2 * clock.clientHeight}px`;
    }
  );

  Array.from(document.getElementsByClassName("special-upper-small")).forEach(
    (el) => {
      el.style.fontSize = `${0.1125 * clock.clientHeight}px`;
    }
  );
}

function cycleView() {
  if (activeOption === undefined || activeOption === displayOptions.length - 1) {
    activeOption = 0;
  } else {
    activeOption += 1;
  }

  activeView = displayOptions[activeOption];

  switch (activeView) {
    case "usdprice":
      setTopSections(["Market price of", "bitcoin"]);

      document.getElementById("0").innerHTML = BTC_USD_HTML;
      document.getElementById("1").innerHTML = "$";

      // Determine which format to use based on number of digits in price.
      switch (true) {
        case priceUsd.length > 6:
          document.getElementById("2").innerHTML = `${priceUsd[0]}.`;
          document.getElementById("3").innerHTML = priceUsd[1];
          document.getElementById("4").innerHTML = priceUsd[2];
          document.getElementById("5").innerHTML = priceUsd[3];
          document.getElementById("6").innerHTML = "M";
          break;
        case priceUsd.length > 5:
          document.getElementById("2").innerHTML = priceUsd[0];
          document.getElementById("3").innerHTML = priceUsd[1];
          document.getElementById("4").innerHTML = `${priceUsd[2]}.`;
          document.getElementById("5").innerHTML = priceUsd[3];
          document.getElementById("6").innerHTML = "K";
          break;
        default:
          for (let i = 2; i < 7; i += 1) {
            document.getElementById(i.toString()).innerHTML =
              priceUsd[priceUsd.length - 7 + i] || "";
          }
          break;
      }

      setDimensions();

      break;

    case "satsperdollar":
      document.getElementById("0").innerHTML = SAT_USD_HTML;

      setTopSections([]);

      // Set the digits.
      for (let i = 1; i < 7; i += 1) {
        document.getElementById(i.toString()).innerHTML =
          satUsd[satUsd.length - 7 + i] || "";
      }

      setDimensions();

      break;

    case "blockheight":
      for (let i = 0; i < 7; i += 1) {
        document.getElementById(i.toString()).innerHTML =
          blockHeight[blockHeight.length - 7 + i] || "";
      }

      setTopSections(["Number of blocks", "in the", "blockchain"]);
      
      setDimensions();
      
      break;

    case "moscowtime":
      document.getElementById("0").innerHTML = MOSCOW_TIME_HTML;

      setTopSections([]);

      // Set the digits.
      for (let i = 1; i < 7; i += 1) {
        document.getElementById(i.toString()).innerHTML =
          satUsd[satUsd.length - 7 + i] || "";
      }

      setDimensions();

      break;

    default:
      break;
  }
}

async function fetchData() {
  let priceUsdResponse = await (
    await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    )
  ).json();

  priceUsd = priceUsdResponse.bitcoin.usd.toString();
  satUsd = Math.round((1 / priceUsd) * 100000000).toString();

  let blockHeightResponse = await (
    await fetch("https://blockstream.info/api/blocks/tip/height")
  ).json();

  blockHeight = blockHeightResponse.toString();
}

setInterval(fetchData, FETCH_INTERVAL);

window.onload = () => {
  // Load CSS
  const link = document.createElement("link");
  link.href = "widget.css";
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);

  const clockContainer = document.getElementById("blockclock-container")

  const displayClasses = Array.from(clockContainer.classList)

  displayOptions = displayClasses.filter((className) => {
    return VALID_DISPLAY_OPTIONS.includes(className);
  });

  displayClasses.forEach((className) => {
    if (className.includes("interval-")) {

      const regexp = /^(interval-)(\d+)$/gi
      const matches = [...className.matchAll(regexp)]
      if (matches.length) {
        const intervalValue = parseInt(matches[0][2])
        if (typeof intervalValue === "number") cycleInterval = intervalValue
      }
    }
  })

  clockContainer.innerHTML = CLOCK_HTML;

  setDimensions();
  window.onresize = setDimensions;

  fetchData().then(() => {
    cycleView();
    setInterval(cycleView, cycleInterval);
  });
};
