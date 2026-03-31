// Continent :  East Asia, Africa, North America, South America, Antarctica, Europe, and Australia
// Coordinate reference: https://www.latlong.net/
define(function(require, exports, module) {
  const MapData = {};
  // TODO: Fix to precise capitals
  const capitals =
    ['Vienna', 'New York', 'Sydney', 'London', 'Paris', 'Amsterdam', 'Tokyo', 'Madrid', 'Rome',
      'Berlin', 'Lisbon', 'Quebec'];
  const data = [
    {
      city: 'Vienna',
      country: 'Austria',
      continent: 'EUROPE',
      latitude: 48.2081743,
      longitude: 16.37381890000006,
    },
    {
      city: 'New York',
      country: 'USA',
      continent: 'NORTH AMERICA',
      latitude: 40.700001,
      longitude: -74.000000,
    },
    {
      city: 'Edinburgh',
      country: 'UK',
      continent: 'EUROPE',
      latitude: 55.953421,
      longitude: -3.175711,
    },
    {
      city: 'Sydney',
      country: 'Australia',
      continent: 'AUSTRALIA',
      latitude: -33.8674869,
      longitude: 151.20699020000006,
    },
    {
      city: 'London',
      country: 'UK',
      continent: 'EUROPE',
      latitude: 51.5073509,
      longitude: -0.12775829999998223,
    },
    {
      city: 'Paris',
      country: 'France',
      continent: 'EUROPE',
      latitude: 48.856614,
      longitude: 2.3522219000000177,
    },
    {
      city: 'Venice',
      country: 'Italy',
      continent: 'EUROPE',
      latitude: 45.4408474,
      longitude: 12.31551509999997,
    },
    {
      city: 'Amsterdam',
      country: 'Netherlands',
      continent: 'EUROPE',
      latitude: 52.3702157,
      longitude: 4.895167899999933,
    },
    {
      city: 'Tokyo',
      country: 'Japan',
      continent: 'EAST ASIA',
      latitude: 35.6894875,
      longitude: 139.69170639999993,
    },
    {
      city: 'Barcelona',
      country: 'Spain',
      continent: 'EUROPE',
      latitude: 41.3902,
      longitude: 2.1540,
    },
    {
      city: 'Madrid',
      country: 'Spain',
      continent: 'EUROPE',
      latitude: 40.4167,
      longitude: -3.7037,
    },
    {
      city: 'Rome',
      country: 'Italy',
      continent: 'EUROPE',
      latitude: 41.8723889,
      longitude: 12.48018019999995,
    },
    {
      city: 'Lisbon',
      country: 'Portugal',
      continent: 'EUROPE',
      latitude: 38.7222,
      longitude: -9.1393,
    },
    {
      city: 'Berlin',
      country: 'Germany',
      continent: 'EUROPE',
      latitude: 52.52000659999999,
      longitude: 13.404953999999975,
    },
    {
      city: 'Hawaii',
      country: 'USA',
      continent: 'NORTH AMERICA',
      latitude: 19.8967662,
      longitude: -155.58278180000002,
    },
    {
      city: 'Rio de janeiro',
      country: 'Brazil',
      continent: 'SOUTH AMERICA',
      latitude: -22.900000,
      longitude: -43.183334,
    },
    {
      city: 'Buenos aires',
      country: 'Argentina',
      continent: 'SOUTH AMERICA',
      latitude: -34.599998,
      longitude: -58.366669,
    },
    {
      city: 'Frankfurt',
      country: 'Germany',
      continent: 'EUROPE',
      latitude: 50.110645,
      longitude: 8.671583,
    },
    {
      city: 'Bern',
      country: 'Switzerland',
      continent: 'EUROPE',
      latitude: 46.773699,
      longitude: 7.455167,
    },
    {
      city: 'Munich',
      country: 'Germany',
      continent: 'EUROPE',
      latitude: 48.1371,
      longitude: 11.5761,
    },
    {
      city: 'Quebec',
      country: 'Canada',
      continent: 'NORTH AMERICA',
      latitude: 46.8139,
      longitude: -71.2080,
    },
    {
      city: 'Toronto',
      country: 'Canada',
      continent: 'NORTH AMERICA',
      latitude: 43.6532,
      longitude: -79.3832,
    },
    {
      city: 'Vancouver',
      country: 'Canada',
      continent: 'NORTH AMERICA',
      latitude: 49.2462,
      longitude: -123.1162,
    },
    {
      city: 'San Francisco',
      country: 'USA',
      continent: 'NORTH AMERICA',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    {
      city: 'Nice',
      country: 'France',
      continent: 'EUROPE',
      latitude: 43.6758,
      longitude: 7.2894,
    },
    {
      city: 'Lyon',
      country: 'France',
      continent: 'EUROPE',
      latitude: 45.7634,
      longitude: 4.8342,
    },
    {
      city: 'Seoul',
      country: 'South Korea',
      continent: 'EAST ASIA',
      latitude: 37.5326,
      longitude: 127.0246,
    },
    {
      city: 'Brisbane',
      country: 'Australia',
      continent: 'AUSTRALIA',
      latitude: -27.4701,
      longitude: 153.0210,
    },
    {
      city: 'Melbourne',
      country: 'Australia',
      continent: 'AUSTRALIA',
      latitude: -37.8409,
      longitude: 144.9464,
    },
  ];

  MapData.getInfo = (index) => {
    return data[index];
  };

  MapData.getCityLatLong = (cityString) => {
    for (let i=0; i < data.length; i++) {
      if (data[i].city === cityString)
        return [data[i].latitude, data[i].longitude];
    }
  };

  MapData.getSize = () => {
    return data.length;
  };

  MapData.isCapital = (cityString) => {
    return capitals.includes(cityString) ? true : false;
  };

  module.exports = MapData;
});
