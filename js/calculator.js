/*
  Calculator is a global object with methods to compute CO2 emissions,
  compare transport modes, estimate savings, and calculate carbon credits.
*/

var Calculator = {
  calculateEmission: function(distanceKM, transportMode) {
    // Use the configured emission factor for the selected transport mode.
    var factor = CONFIG.EMISSION_FACTORS[transportMode];
    var emission = 0;

    if (typeof factor === "number" && typeof distanceKM === "number") {
      emission = distanceKM * factor;
    }

    // Round the result to two decimal places for display.
    return Math.round(emission * 100) / 100;
  },

  calculateAllModes: function(distanceKm) {
    var results = [];
    var carEmission = this.calculateEmission(distanceKm, "car");

    Object.keys(CONFIG.EMISSION_FACTORS).forEach(function(mode) {
      var emission = Calculator.calculateEmission(distanceKm, mode);
      var percentageVsCar = carEmission > 0 ? (emission / carEmission) * 100 : 0;

      results.push({
        mode: mode,
        emission: Math.round(emission * 100) / 100,
        percentageVsCar: Math.round(percentageVsCar * 100) / 100
      });
    });

    // Sort by emission ascending so the cleanest modes appear first.
    results.sort(function(a, b) {
      return a.emission - b.emission;
    });

    return results;
  },

  calculateSavings: function(emission, baselineEmission) {
    // Savings are the difference between baseline and chosen emission.
    var savedKg = 0;
    var percentage = 0;

    if (typeof emission === "number" && typeof baselineEmission === "number") {
      savedKg = baselineEmission - emission;
      percentage = baselineEmission > 0 ? (savedKg / baselineEmission) * 100 : 0;
    }

    return {
      savedKg: Math.round(savedKg * 100) / 100,
      percentage: Math.round(percentage * 100) / 100
    };
  },

  calculateCarbonCredits: function(emissionKg) {
    // Convert emitted kilograms to carbon credit units.
    var credits = 0;

    if (typeof emissionKg === "number") {
      credits = emissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT;
    }

    return Math.round(credits * 10000) / 10000;
  },

  estimateCreditPrice: function(credits) {
    // Estimate the price range for the calculated carbon credits.
    var minPrice = 0;
    var maxPrice = 0;
    var averagePrice = 0;

    if (typeof credits === "number") {
      minPrice = credits * CONFIG.CARBON_CREDIT.PRICE_MIN_BRL;
      maxPrice = credits * CONFIG.CARBON_CREDIT.PRICE_MAX_BRL;
      averagePrice = (minPrice + maxPrice) / 2;
    }

    return {
      min: Math.round(minPrice * 100) / 100,
      max: Math.round(maxPrice * 100) / 100,
      average: Math.round(averagePrice * 100) / 100
    };
  }
};
