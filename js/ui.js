/*
  UI is a global object for formatting values, rendering calculator output,
  and handling simple UI interactions like loading state and visibility.
*/

var UI = {
  formatNumber: function(number, decimals) {
    var value = Number(number);

    if (Number.isNaN(value)) {
      return "0";
    }

    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  formatCurrency: function(value) {
    var amount = Number(value);

    if (Number.isNaN(amount)) {
      amount = 0;
    }

    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  },

  showElement: function(elementId) {
    var element = document.getElementById(elementId);

    if (!element) {
      return;
    }

    element.classList.remove("hidden");
  },

  hideElement: function(elementId) {
    var element = document.getElementById(elementId);

    if (!element) {
      return;
    }

    element.classList.add("hidden");
  },

  scrollToElement: function(elementId) {
    var element = document.getElementById(elementId);

    if (!element || !element.scrollIntoView) {
      return;
    }

    element.scrollIntoView({ behavior: "smooth", block: "start" });
  },

  renderResults: function(data) {
    var mode = data.mode || "car";
    var modeMeta = CONFIG.TRANSPORT_MODES[mode] || { label: mode, color: "#10b981" };
    var savingsHtml = "";

    if (mode !== "car" && data.savings) {
      savingsHtml = "<div class=\"results_card results_card--savings\">" +
        "<strong>Economia</strong>" +
        "<p>" + UI.formatNumber(data.savings.savedKg, 2) + " kg CO2 salvos (" +
        UI.formatNumber(data.savings.percentage, 2) + "%)</p>" +
        "</div>";
    }

    return "<div class=\"results__grid\">" +
      "<div class=\"results_card results_card--route\">" +
        "<strong>Rota</strong>" +
        "<p>" + data.origin + " → " + data.destination + "</p>" +
      "</div>" +
      "<div class=\"results_card results_card--distance\">" +
        "<strong>Distância</strong>" +
        "<p>" + UI.formatNumber(data.distance, 0) + " km</p>" +
      "</div>" +
      "<div class=\"results_card results_card--emission\">" +
        "<strong>Emissão</strong>" +
        "<p>🍃 " + UI.formatNumber(data.emission, 2) + " kg CO2</p>" +
      "</div>" +
      "<div class=\"results_card results_card--transport\">" +
        "<strong>Transporte</strong>" +
        "<p style=\"color: " + modeMeta.color + ";\">" + modeMeta.label + "</p>" +
      "</div>" +
      savingsHtml +
    "</div>";
  },

  renderComparison: function(modesArray, selectedMode) {
    var maxEmission = modesArray.reduce(function(max, item) {
      return item.emission > max ? item.emission : max;
    }, 0) || 1;

    var itemsHtml = modesArray.map(function(item) {
      var meta = CONFIG.TRANSPORT_MODES[item.mode] || { label: item.mode, color: "#10b981" };
      var selectedClass = item.mode === selectedMode ? " comparison_item--selected" : "";
      var badgeHtml = item.mode === selectedMode ? "<span class=\"comparison_item__badge\">Selecionado</span>" : "";
      var percent = maxEmission > 0 ? (item.emission / maxEmission) * 100 : 0;
      var barColor = "#34d399";

      if (percent <= 25) {
        barColor = "#10b981";
      } else if (percent <= 75) {
        barColor = "#fbbf24";
      } else if (percent <= 100) {
        barColor = "#fb923c";
      } else {
        barColor = "#ef4444";
      }

      return "<div class=\"comparison_item" + selectedClass + "\">" +
        "<div class=\"comparison_item__header\">" +
          "<span class=\"comparison_item__icon\">" + (meta.icon || "🚗") + "</span>" +
          "<div>" +
            "<strong>" + meta.label + "</strong>" +
            "<p>" + UI.formatNumber(item.emission, 2) + " kg CO2</p>" +
          "</div>" +
          badgeHtml +
        "</div>" +
        "<div class=\"comparison_item__stats\">" +
          "<p>" + UI.formatNumber(item.percentageVsCar, 2) + "% vs carro</p>" +
          "<div class=\"comparison_item__bar\">" +
            "<div class=\"comparison_item__fill\" style=\"width: " + percent + "%; background: " + barColor + ";\"></div>" +
          "</div>" +
        "</div>" +
      "</div>";
    }).join("");

    var tipBox = "<div class=\"comparison_tip\">" +
      "<strong>Dica:</strong> Compare modos de transporte para entender a melhor escolha sustentável." +
    "</div>";

    return "<div class=\"comparison_list\">" + itemsHtml + "</div>" + tipBox;
  },

  renderCarbonCredits: function(creditsData) {
    var creditsText = UI.formatNumber(creditsData.credits, 4);
    var averagePrice = UI.formatCurrency(creditsData.price.average);
    var minPrice = UI.formatCurrency(creditsData.price.min);
    var maxPrice = UI.formatCurrency(creditsData.price.max);

    return "<div class=\"carbon-credits__grid\">" +
      "<div class=\"carbon-credits__card\">" +
        "<strong>Créditos necessários</strong>" +
        "<p class=\"carbon-credits__value\">" + creditsText + "</p>" +
        "<p class=\"carbon-credits__helper\">crédito = 1000 kg CO2</p>" +
      "</div>" +
      "<div class=\"carbon-credits__card\">" +
        "<strong>Preço estimado</strong>" +
        "<p class=\"carbon-credits__value\">" + averagePrice + "</p>" +
        "<p class=\"carbon-credits__helper\">Faixa: " + minPrice + " - " + maxPrice + "</p>" +
      "</div>" +
    "</div>" +
    "<div class=\"carbon-credits__info\">" +
      "Os créditos de carbono ajudam a compensar emissões investindo em projetos ambientais." +
    "</div>" +
    "<button class=\"carbon-credits__button\">Compensar Emissões</button>";
  },

  showLoading: function(buttonElement) {
    if (!buttonElement) {
      return;
    }

    buttonElement.dataset.originalText = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.innerHTML = "<span class=\"spinner\"></span> Calculando...";
  },

  hideLoading: function(buttonElement) {
    if (!buttonElement) {
      return;
    }

    buttonElement.disabled = false;

    if (buttonElement.dataset.originalText) {
      buttonElement.innerHTML = buttonElement.dataset.originalText;
      delete buttonElement.dataset.originalText;
    }
  }
};
