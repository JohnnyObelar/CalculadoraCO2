/*
  Main application bootstrap file for the CO2 calculator.
  Initializes UI helpers, handles form submission, and renders results.
*/

document.addEventListener("DOMContentLoaded", function() {
  // Initialize city autocomplete and distance autofill behavior.
  CONFIG.populateDatalist();
  CONFIG.setupDistanceAutofill();

  var calculatorForm = document.getElementById("calculator-form");

  if (!calculatorForm) {
    console.error("Form not found: calculator-form");
    return;
  }

  console.log("Calculadora Iniciada!");

  calculatorForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var originValue = document.getElementById("origin").value.trim();
    var destinationValue = document.getElementById("destination").value.trim();
    var distanceValue = parseFloat(document.getElementById("distance").value);
    var transportModeInput = document.querySelector("input[name='transport']:checked");
    var selectedTransportMode = transportModeInput ? transportModeInput.value : "car";

    if (!originValue || !destinationValue) {
      alert("Por favor, informe origem e destino.");
      return;
    }

    if (Number.isNaN(distanceValue) || distanceValue <= 0) {
      alert("Por favor, informe uma distância válida maior que zero.");
      return;
    }

    var submitButton = calculatorForm.querySelector("button[type='submit']");
    UI.showLoading(submitButton);

    UI.hideElement("results");
    UI.hideElement("comparison");
    UI.hideElement("carbon-credits");

    setTimeout(function() {
      try {
        var emissionValue = Calculator.calculateEmission(distanceValue, selectedTransportMode);
        var baselineCarEmission = Calculator.calculateEmission(distanceValue, "car");
        var savingsData = Calculator.calculateSavings(emissionValue, baselineCarEmission);
        var comparisonData = Calculator.calculateAllModes(distanceValue);
        var credits = Calculator.calculateCarbonCredits(emissionValue);
        var creditEstimate = Calculator.estimateCreditPrice(credits);

        var renderedResults = UI.renderResults({
          origin: originValue,
          destination: destinationValue,
          distance: distanceValue,
          emission: emissionValue,
          mode: selectedTransportMode,
          savings: savingsData
        });

        var renderedComparison = UI.renderComparison(comparisonData, selectedTransportMode);

        var renderedCredits = UI.renderCarbonCredits({
          credits: credits,
          price: creditEstimate
        });

        document.getElementById("results-content").innerHTML = renderedResults;
        document.getElementById("comparison-content").innerHTML = renderedComparison;
        document.getElementById("carbon-credts-content").innerHTML = renderedCredits;

        UI.showElement("results");
        UI.showElement("comparison");
        UI.showElement("carbon-credits");
        UI.scrollToElement("results");
      } catch (error) {
        console.error("Erro ao calcular emissões:", error);
        alert("Ocorreu um erro ao processar a calculadora. Tente novamente.");
      } finally {
        UI.hideLoading(submitButton);
      }
    }, 1500);
  });
});
