/* jshint node:true */

var moment = require('moment');
require('moment-timezone');
var hours = require('../hours.js');

module.exports = {

  formatTime: function(test){

    test.equals(hours._formatTime('0500', moment()), '5:00 am');
    test.equals(hours._formatTime('2900', moment()), '5:00 am');

    test.done();
  },

  getHours: function(test){

    test.equals(hours._getHours([], moment()),
                                'Closed');
    test.equals(hours._getHours([100, 200], moment()),
                                '1:00 am - 2:00 am');
    test.equals(hours._getHours([100, 200, 300, 400], moment()),
                                '1:00 am - 2:00 am, 3:00 am - 4:00 am');
    test.equals(hours._getHours([2300, 2500], moment()),
                                '11:00 pm - 1:00 am');
    test.equals(hours._getHours([1100, 2500], moment()),
                                '11:00 am - 1:00 am');

    test.done();
  },

  timeZoneDifference: function(test){

    var berlin = moment().tz('Europe/Berlin');
    var moscow = moment().tz('Europe/Moscow');

    test.equals(hours._timeZoneDifference(berlin, 'Europe/Berlin'), 0);
    test.equals(hours._timeZoneDifference(moscow, 'Europe/Berlin'), 3);

    test.done();
  },

  openOrNot: function(test) {

    var berlin = moment().tz('Europe/Berlin');
    berlin.year(2014);
    berlin.month(0);
    berlin.date(2);
    berlin.hours(11);
    berlin.minutes(30);
    berlin.seconds(0);

    var days = [
        [],
        [],
        [],
        [],
        [1200, 1300],
        [],
        [],
      ];

    test.equals(hours._openOrNot(berlin, days, berlin),
                'Closed, will open at 12:00 pm');

    berlin.hours(12);

    test.equals(hours._openOrNot(berlin, days, berlin),
                'Open right now, until 1:00 pm');

    berlin.hours(13);

    test.equals(hours._openOrNot(berlin, days, berlin),
                'Currently Closed!');

    test.done();
  }

};
