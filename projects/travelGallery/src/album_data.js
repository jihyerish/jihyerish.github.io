// Continent :  East Asia, Africa, North America, South America, Antarctica, Europe, and Australia

define(function(require, exports, module) {
  const AlbumData = {};
  const data = [
    {
      city: 'Vienna',
      country: 'Austria',
      continent: 'EUROPE',
      year: '2014',
      month: 'May',
      imageNumber: 20,
    },
    {
      city: 'New York',
      country: 'USA',
      continent: 'NORTH AMERICA',
      year: '2010',
      month: 'September',
      imageNumber: 18,
    },
    {
      city: 'Sydney',
      country: 'Australia',
      continent: 'AUSTRALIA',
      year: '2016',
      month: 'February',
      imageNumber: 15,
    },
    {
      city: 'Berlin',
      country: 'Germany',
      continent: 'EUROPE',
      year: '2018',
      month: 'April',
      imageNumber: 22,
    },
    {
      city: 'London',
      country: 'UK',
      continent: 'EUROPE',
      year: '2008',
      month: 'January',
      imageNumber: 16,
    },
    {
      city: 'Paris',
      country: 'France',
      continent: 'EUROPE',
      year: '2016',
      month: 'July',
      imageNumber: 22,
    },
    {
      city: 'Venice',
      country: 'Italy',
      continent: 'EUROPE',
      year: '2014',
      month: 'June',
      imageNumber: 15,
    },
    {
      city: 'Seoul',
      country: 'South Korea',
      continent: 'EAST ASIA',
      year: '2020',
      month: 'January',
      imageNumber: 13,
    },
    {
      city: 'Quebec',
      country: 'Canada',
      continent: 'NORTH AMERICA',
      year: '2017',
      month: 'May',
      imageNumber: 16,
    },
    {
      city: 'Rome',
      country: 'Italy',
      continent: 'EUROPE',
      year: '2014',
      month: 'May',
      imageNumber: 16,
    },
    {
      city: 'Nice',
      country: 'France',
      continent: 'EUROPE',
      year: '2017',
      month: 'July',
      imageNumber: 7,
    },
    {
      city: 'Amsterdam',
      country: 'Netherlands',
      continent: 'EUROPE',
      year: '2014',
      month: 'June',
      imageNumber: 16,
    },
    {
      city: 'Toronto',
      country: 'Canada',
      continent: 'NORTH AMERICA',
      year: '2019',
      month: 'June',
      imageNumber: 10,
    },
    {
      city: 'Barcelona',
      country: 'Spain',
      continent: 'EUROPE',
      year: '2016',
      month: 'September',
      imageNumber: 10,
    },
    {
      city: 'Tokyo',
      country: 'Japan',
      continent: 'EAST ASIA',
      year: '2018',
      month: 'March',
      imageNumber: 18,
    },
  ];

  AlbumData.getInfo = function(index) {
    return data[index];
  };

  AlbumData.getTopN = function(num) {
    let result = [];
    for (let i = 0; i < num; i++) {
      result.push(data[i]);
    }
    return result;
  }

  AlbumData.getInfoByCity = function(cityString) {
    for (let i=0; i < data.length; i++) {
      if (data[i].city === cityString)  return data[i];
    }
  };

  AlbumData.getInfoByCountry = function(countryString) {
    let result = [];
    for (let i=0; i < data.length; i++) {
      if (data[i].country === countryString)  result.push(data[i]);
    }
    return result;
  };

  AlbumData.getSize = function() {
    return data.length;
  };

  module.exports = AlbumData;
});
