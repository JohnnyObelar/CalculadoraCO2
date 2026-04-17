/*
  RoutesDB is a global object containing a small database of Brazilian routes.
  - routes: array of route objects with origin, destination and distanceKM.
  - getAllCities(): returns a unique, alphabetically sorted array of all city names.
  - findDistance(origin, destination): searches both directions and returns the distance in km.
*/

var RoutesDB = {
  routes: [
    { origin: "São Paulo, SP", destination: "Rio de Janeiro, RJ", distanceKM: 430 },
    { origin: "São Paulo, SP", destination: "Brasília, DF", distanceKM: 1016 },
    { origin: "Rio de Janeiro, RJ", destination: "Brasília, DF", distanceKM: 1148 },
    { origin: "São Paulo, SP", destination: "Campinas, SP", distanceKM: 95 },
    { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", distanceKM: 13 },
    { origin: "Belo Horizonte, MG", destination: "Ouro Preto, MG", distanceKM: 100 },
    { origin: "Porto Alegre, RS", destination: "Caxias do Sul, RS", distanceKM: 120 },
    { origin: "Recife, PE", destination: "Olinda, PE", distanceKM: 9 },
    { origin: "Salvador, BA", destination: "Feira de Santana, BA", distanceKM: 108 },
    { origin: "Curitiba, PR", destination: "Londrina, PR", distanceKM: 383 },
    { origin: "Fortaleza, CE", destination: "Juazeiro do Norte, CE", distanceKM: 500 },
    { origin: "Manaus, AM", destination: "Belém, PA", distanceKM: 1618 },
    { origin: "Goiânia, GO", destination: "Brasília, DF", distanceKM: 209 },
    { origin: "Florianópolis, SC", destination: "Joinville, SC", distanceKM: 134 },
    { origin: "Vitória, ES", destination: "Belo Horizonte, MG", distanceKM: 529 },
    { origin: "Campo Grande, MS", destination: "Cuiabá, MT", distanceKM: 700 },
    { origin: "São Paulo, SP", destination: "Campina Grande, PB", distanceKM: 2480 },
    { origin: "Rio de Janeiro, RJ", destination: "Belo Horizonte, MG", distanceKM: 434 },
    { origin: "Salvador, BA", destination: "Fortaleza, CE", distanceKM: 1036 },
    { origin: "Recife, PE", destination: "Maceió, AL", distanceKM: 249 },
    { origin: "Belém, PA", destination: "São Luís, MA", distanceKM: 478 },
    { origin: "Natal, RN", destination: "João Pessoa, PB", distanceKM: 183 },
    { origin: "Porto Alegre, RS", destination: "Florianópolis, SC", distanceKM: 448 },
    { origin: "São Paulo, SP", destination: "Belo Horizonte, MG", distanceKM: 586 },
    { origin: "Rio de Janeiro, RJ", destination: "Vitória, ES", distanceKM: 520 },
    { origin: "Curitiba, PR", destination: "São Paulo, SP", distanceKM: 408 },
    { origin: "Manaus, AM", destination: "Rio Branco, AC", distanceKM: 1168 },
    { origin: "Cuiabá, MT", destination: "Brasília, DF", distanceKM: 856 },
    { origin: "Porto Velho, RO", destination: "Rio Branco, AC", distanceKM: 542 },
    { origin: "Maceió, AL", destination: "Aracaju, SE", distanceKM: 280 },
    { origin: "Teresina, PI", destination: "Fortaleza, CE", distanceKM: 520 },
    { origin: "Campo Grande, MS", destination: "São Paulo, SP", distanceKM: 1010 },
    { origin: "Belém, PA", destination: "Macapá, AP", distanceKM: 587 },
    { origin: "Salvador, BA", destination: "Belo Horizonte, MG", distanceKM: 1224 },
    { origin: "Natal, RN", destination: "Recife, PE", distanceKM: 299 },
    { origin: "Londrina, PR", destination: "São Paulo, SP", distanceKM: 507 },
    { origin: "Juazeiro do Norte, CE", destination: "Fortaleza, CE", distanceKM: 637 }
  ],

  getAllCities: function() {
    var cities = this.routes.reduce(function(acc, route) {
      acc.push(route.origin);
      acc.push(route.destination);
      return acc;
    }, []);

    var uniqueCities = cities.filter(function(city, index) {
      return cities.indexOf(city) === index;
    });

    return uniqueCities.sort(function(a, b) {
      return a.localeCompare(b, 'pt-BR');
    });
  },

  findDistance: function(origin, destination) {
    if (!origin || !destination) {
      return null;
    }

    var normalizedOrigin = origin.trim().toLowerCase();
    var normalizedDestination = destination.trim().toLowerCase();

    for (var i = 0; i < this.routes.length; i++) {
      var route = this.routes[i];
      var routeOrigin = route.origin.trim().toLowerCase();
      var routeDestination = route.destination.trim().toLowerCase();

      if (
        (routeOrigin === normalizedOrigin && routeDestination === normalizedDestination) ||
        (routeOrigin === normalizedDestination && routeDestination === normalizedOrigin)
      ) {
        return route.distanceKM;
      }
    }

    return null;
  }
};
