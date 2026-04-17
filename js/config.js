/*
  CONFIG is a global object for emission factors, transport metadata and app setup helpers.
  - EMISSION_FACTORS: kg CO2 per km for each transport mode.
  - TRANSPORT_MODES: UI metadata for each transport mode.
  - CARBON_CREDIT: carbon credit constants.
  - populateDatalist(): fills the city datalist from RoutesDB.
  - setupDistanceAutofill(): handles route lookup and manual distance toggling.
*/

var CONFIG = {
  EMISSION_FACTORS: {
    bicycle: 0,
    car: 0.12,
    bus: 0.089,
    truck: 0.96
  },

  TRANSPORT_MODES: {
    bicycle: {
      label: "Bicicleta",
      color: "#10b981"
    },
    car: {
      label: "Carro",
      color: "#059669"
    },
    bus: {
      label: "Ônibus",
      color: "#34d399"
    },
    truck: {
      label: "Caminhão",
      color: "#3b8216"
    }
  },

  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000,
    PRICE_MIN_BRL: 50,
    PRICE_MAX_BRL: 150
  },

  populateDatalist: function() {
    var cities = [];

    if (typeof RoutesDB === "undefined" || !RoutesDB.getAllCities) {
      return;
    }

    cities = RoutesDB.getAllCities();
    var datalist = document.getElementById("cities-list");

    if (!datalist) {
      return;
    }

    datalist.innerHTML = "";

    cities.forEach(function(city) {
      var option = document.createElement("option");
      option.value = city;
      datalist.appendChild(option);
    });
  },

  setupDistanceAutofill: function() {
    var originInput = document.getElementById("origin");
    var destinationInput = document.getElementById("destination");
    var distanceInput = document.getElementById("distance");
    var manualCheckbox = document.getElementById("manual-distance");
    var helperText = null;

    if (!originInput || !destinationInput || !distanceInput || !manualCheckbox) {
      return;
    }

    helperText = distanceInput.nextElementSibling;

    function updateHelperText(text, isSuccess) {
      if (!helperText) {
        return;
      }

      helperText.textContent = text;
      helperText.style.color = isSuccess ? "var(--primary)" : "var(--text-light)";
    }

    function lookupRoute() {
      var originValue = originInput.value.trim();
      var destinationValue = destinationInput.value.trim();

      if (!originValue || !destinationValue) {
        distanceInput.value = "";
        distanceInput.readOnly = true;
        updateHelperText("A distância será preenchida automaticamente", false);
        return;
      }

      var distance = null;

      if (typeof RoutesDB !== "undefined" && RoutesDB.findDistance) {
        distance = RoutesDB.findDistance(originValue, destinationValue);
      }

      if (distance !== null && !manualCheckbox.checked) {
        distanceInput.value = distance;
        distanceInput.readOnly = true;
        updateHelperText("Distância encontrada automaticamente.", true);
      } else {
        distanceInput.value = "";
        distanceInput.readOnly = !manualCheckbox.checked;
        updateHelperText("Rota não encontrada. Marque inserir distância manualmente para preencher no campo.", false);
      }
    }

    originInput.addEventListener("change", function() {
      if (!manualCheckbox.checked) {
        lookupRoute();
      }
    });

    destinationInput.addEventListener("change", function() {
      if (!manualCheckbox.checked) {
        lookupRoute();
      }
    });

    manualCheckbox.addEventListener("change", function() {
      if (manualCheckbox.checked) {
        distanceInput.readOnly = false;
        updateHelperText("Preencha a distância manualmente.", false);
      } else {
        lookupRoute();
      }
    });
  }
};
