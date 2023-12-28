document.addEventListener("DOMContentLoaded", function () {
	// Declare variables in a higher scope
	let lowNumberInputVal;
	let initialInvestment = 0;

	// Get references to the input and display elements
	const lowNumberInput = document.getElementById("lowNumberInput");
	const highNumberInput = document.getElementById("highNumberInput");
	const percentResult = document.getElementById("percentResult");
	const feesCost = document.getElementById("feesCost");
	const stepIncreaseNumberInput = document.getElementById("stepIncreaseNumberInput");
	const tradeAmount = document.getElementById("tradeAmount");
	const percentResultTable = document.getElementById("percentResultTable");

	// Add an input event listener to the step increase number input
	stepIncreaseNumberInput.addEventListener("input", function () {
		// Get the current values when the input changes
		lowNumberInputVal = parseFloat(lowNumberInput.value);
		const feesCostVal = parseFloat(feesCost.value);
		const stepIncreaseNumberInputVal = parseFloat(stepIncreaseNumberInput.value);

		// Calculate percentResults using the current values
		const percentResults = (stepIncreaseNumberInputVal / lowNumberInputVal) * 100;
		const percentResultsFixed = percentResults.toFixed(4);
		highNumberInput.value = lowNumberInputVal + stepIncreaseNumberInputVal;

		// Update the UI with the calculated values
		updateUI(lowNumberInputVal, percentResultsFixed, feesCostVal);

		// Get a reference to the button element
		const myButton = document.getElementById("myButton");

		// Add an event listener for the 'click' event
		myButton.addEventListener("click", function () {
			calculateAndDisplayTable();
		});
	});

	// Add input event listeners for lowNumberInput and tradeAmount
	lowNumberInput.addEventListener("input", function () {
		// Clear the value of highNumberInput when lowNumberInput changes
		highNumberInput.value = "";
		percentResult.style.display = "none";
	});

	tradeAmount.addEventListener("input", function () {
		// Clear the percentResultTable when tradeAmount changes
		percentResultTable.innerHTML = "";
	});

	// Function to update UI with calculated values
	function updateUI(lowNumberInputVal, percentResultsFixed, feesCostVal) {
		percentResult.style.display = "block";
		percentResult.innerHTML =
			"Percent result increment from " +
			lowNumberInputVal +
			" to " +
			"<span id='toNumber'>" + highNumberInput.value + "</span>" +
			":" +
			"<div style='margin-top: 20px' class='row'><div class='col s6'><div class='boxBottom'>" +
			"<p>Percent Increase: </p>" +
			"<span id='percResult'>" + percentResultsFixed + "</span>" +
			"%</div></div><div class='col s6'><div class='boxBottom'>" +
			"<p>Percent After Fees: </p>" +
			(percentResultsFixed - feesCostVal).toFixed(4) +
			"%</div></div></div>";
	}

	// Function to calculate and display the table
	function calculateAndDisplayTable() {
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

		// Loop to calculate values for the table
		for (let i = lowNumberInputVal; i <= highNumberInput.value; i += stepIncreaseNumberInput.value) {
			const plusOne = i + stepIncreaseNumberInput.value;
			const percentBetween = (stepIncreaseNumberInput.value / i) * 100;

			// sum them up
			const tradeAmountInc = (tradeAmountVal * percentBetween) / 100;
			const profitPerStep = tradeAmountVal + tradeAmountInc;

			totalProfit += tradeAmountInc;
			totalPlusOne += profitPerStep;

			// Build the table rows
			piano += "<tr><td> <i class='material-icons tiny light-green-text'>call_made</i>" +
				i + "</td><td class='center-align' onClick='getCellContent(this)'><i class='material-icons tiny red-text accent-3' style='transform: scaleX(-1)'>call_received</i>" +
				plusOne + "</td><td class='center-align white-text'>" +
				percentBetween.toFixed(2) +
				"%</td><td class='center-align white-text'>$" +
				tradeAmountInc.toFixed(2) +
				"</td><td class='right-align'>$" +
				profitPerStep.toFixed(2) +
				"</td></tr>";
			rows++;
		}

		// Calculate initial investment
		initialInvestment = rows * tradeAmountVal;

		// Build and append the table to the result table element
		piano += "</tbody><tfoot class='bg-black'><tr><td class=''>" +
			rows + " Entries</td>" +
			"<td colspan=2 class='center-align'>Initial Investment: $" +
			initialInvestment.toFixed(2) + "</td><td class='center-align'>$" +
			totalProfit.toFixed(2) + "</td><td class='right-align'>$" +
			totalPlusOne.toFixed(2) + "</td></tr></tfoot></table>";
		percentResultTable.innerHTML = piano;
	}

	// Function to show error message
	function showError(errorMessage) {
		// You can customize how you want to display the error to the user
		percentResultTable.innerHTML = "<div class='red-text accent-3'>" + (errorMessage) + "</div>";
	}

});
// Function to get cell content
function getCellContent(cell) {
	const cellContent = cell.innerText;
	const matches = cellContent.match(/\d+/);

	if (matches) {
		const newNumber = document.getElementById("toNumber");
		const percResult = document.getElementById("percResult");
		let numericValue = parseInt(matches[0]);
		let diffNumber = numericValue - lowNumberInputVal;
		let newPercent = (diffNumber / lowNumberInputVal) * 100;

		// Update UI with the numeric value
		percResult.innerText = newPercent.toFixed(2);
		newNumber.innerText = numericValue;
	} else {
		console.log("No numeric value found in the cell");
	}
}
