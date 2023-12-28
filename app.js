
document.addEventListener("DOMContentLoaded", function () {
	let lowNumberInputVal; // Declare lowNumberInputVal in a higher scope
	// Get references to the input and display elements
	const lowNumberInput = document.getElementById("lowNumberInput");
	const highNumberInput = document.getElementById("highNumberInput");
	const percentResult = document.getElementById("percentResult");
	const feesCost = document.getElementById("feesCost");
	const stepIncreaseNumberInput = document.getElementById("stepIncreaseNumberInput");
	const tradeAmount = document.getElementById("tradeAmount");
	const percentResultTable = document.getElementById("percentResultTable"); // Assuming you have an element with id="percentResultTable"


	// Add an input event listener to the text input
	let initialInvestment = 0;
	stepIncreaseNumberInput.addEventListener("input", function () {
		// Get the current values when the input changes
		const lowNumberInputVal = parseFloat(lowNumberInput.value);
		const feesCostVal = parseFloat(feesCost.value);
		const stepIncreaseNumberInputVal = parseFloat(stepIncreaseNumberInput.value);


		// Calculate percentResults using the current values
		const percentResults = (stepIncreaseNumberInputVal / lowNumberInputVal) * 100;
		const percentResultsFixed = percentResults.toFixed(4);
		highNumberInput.value = lowNumberInputVal + stepIncreaseNumberInputVal;

		percentResult.style.display = "grid";

		percentResult.innerHTML =
			"<div class='span-2 percres'>Percent result increment from " +
			lowNumberInputVal +
			" to " + "<span id='toNumber'>" +
			highNumberInput.value + "</span>" +
			":</div>" +
			"<div class='boxBottom'>" +
			"<p>Percent Increase</p>" +
			"<span id='percResult'>" + percentResultsFixed + "</span>" +
			"%</div><div class='boxBottom'>" +
			"<p>Percent After Fees</p>" +
			(percentResultsFixed - feesCostVal).toFixed(4) +
			"%</div>";

		// Get a reference to the button element
		const myButton = document.getElementById("myButton");

		// Add an event listener for the 'click' event
		myButton.addEventListener("click", function () {
			let piano = "<table class='striped' id='showTable'><thead><tr><th>Buy at: </th><th class='center-align'>Sell at:</th><th class='center-align'>Percent</th><th class='center-align'>Profit:</th><th class='right-align'>Total:</th></tr></thead><tbody>";
			let rows = 0;
			let totalProfit = 0;
			let totalPlusOne = 0;
			const tradeAmountVal = parseFloat(tradeAmount.value);

			// Check if tradeAmountVal is a valid number
			if (isNaN(tradeAmountVal)) {
				// Display an error message to the user
				showError("Trade amount is not a valid number");
				return;
			}


			for (let i = lowNumberInputVal; i <= highNumberInput.value; i += stepIncreaseNumberInputVal) {
				const plusOne = i + stepIncreaseNumberInputVal;
				const percentBetween = (stepIncreaseNumberInputVal / i) * 100;

				// sum them up
				const tradeAmountInc = (tradeAmountVal * percentBetween) / 100;
				const profitPerStep = tradeAmountVal + tradeAmountInc;

				totalProfit += tradeAmountInc;
				totalPlusOne += profitPerStep;



				piano += "<tr><td> <i class='material-icons tiny light-green-text'>call_made</i>" +
					i + "</td><td class='center-align dotted' onClick='getCellContent(this)'><i class='material-icons tiny red-text accent-3' style='transform: scaleX(-1)'>call_received</i>" +
					plusOne + "</td><td class='center-align white-text'>" +
					percentBetween.toFixed(2) +
					"%</td><td class='center-align white-text'>$" +
					tradeAmountInc.toFixed(2) +
					"</td><td class='right-align'>$" +
					profitPerStep.toFixed(2) +
					"</td></tr>";
				rows++;
			}


			initialInvestment = rows * tradeAmountVal;

			piano += "</tbody><tfoot class='bg-black'><tr><td class=''>" +
				rows + " Entries</td>" +
				"<td colspan=2 class='center-align'>Initial Investment: $" +
				initialInvestment.toFixed(2) + "</td><td class='center-align'>$" +
				totalProfit.toFixed(2) + "</td><td class='right-align'>$" +
				totalPlusOne.toFixed(2) +
				"</td></tr></tfoot></table>";
			percentResultTable.innerHTML = piano;



		});
	});

	lowNumberInput.addEventListener("input", function () {
		// Clear the value of highNumberInput when lowNumberInput changes
		highNumberInput.value = "";
		percentResult.style.display = "none";
	});
	stepIncreaseNumberInput.addEventListener("input", function () {
		percentResultTable.innerHTML = "";
	});
	tradeAmount.addEventListener("input", function () {
		percentResultTable.innerHTML = "";
	});
	function showError(errorMessage) {
		// You can customize how you want to display the error to the user
		percentResultTable.innerHTML = "<div class='red-text accent-3'>" + (errorMessage) + "</div>";
	}


});
function getCellContent(cell) {
	const lowNumberInput = document.getElementById("lowNumberInput");
	const lowNumberInputVal = parseFloat(lowNumberInput.value);

	// Get the content of the clicked cell
	let cellContent = cell.innerText;
	// Convert the content to a number
	let matches = cellContent.match(/\d+/);

	if (matches) {
		const newNumber = document.getElementById("toNumber");
		const percResult = document.getElementById("percResult");
		// Convert the matched string to a number
		let numericValue = parseInt(matches[0]);
		let diffNumber = numericValue - lowNumberInputVal
		let newPercent = (diffNumber / lowNumberInputVal) * 100
		// Do something with the numeric value
		percResult.innerText = newPercent.toFixed(2);
		newNumber.innerText = numericValue;
		// You can perform any other operations with the numeric value here
	} else {
		// Handle the case where no numeric value is found
		console.log("No numeric value found in the cell");
	}
}

// const binanceWebSocket = new WebSocket("wss://ws-api.binance.com:443/ws-api/v3/btc@trade");
// console.log(binanceWebSocket);
// binanceWebSocket.onmessage = function (event) {
// 	console.log(event.data);

// }
// const WebSocket = require('ws');

// Binance WebSocket endpoint for live trade data (replace SYMBOL with the desired trading pair)
const wsEndpoint = 'wss://stream.binance.com:9443/ws/SYMBOL@trade';

// Replace 'SYMBOL' with the trading pair you are interested in (e.g., 'btcusdt' for Bitcoin/USDT)
const tradingPair = 'btcusdt';
const wsUrl = wsEndpoint.replace('SYMBOL', tradingPair);

const ws = new WebSocket(wsUrl);

ws.on('open', () => {
	console.log(`Connected to Binance WebSocket for ${tradingPair} trade data`);
});

ws.on('message', (data) => {
	const trade = JSON.parse(data);
	console.log(`Trade Update - Symbol: ${trade.s}, Price: ${trade.p}, Quantity: ${trade.q}`);
	// Add your logic to process the live trade data here
});

ws.on('error', (error) => {
	console.error('WebSocket Error:', error);
});

ws.on('close', (code, reason) => {
	console.log(`WebSocket closed - Code: ${code}, Reason: ${reason}`);
});

// Gracefully handle process exit
process.on('SIGINT', () => {
	ws.close();
	console.log('WebSocket connection closed due to process termination');
	process.exit();
});