/* jshint browser:true, node:true */
/* global moment */

var hours = (function() {

  var dayNames = [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  ];

  return {

    _formatTime: function(time, m) {
      var result = m || moment();
      var hours;
      var minutes;
      time = String(time);
      if (time.length === 4) {
        hours = time.substr(0, 2);
        minutes = time.substr(2, 2);
      }
      else if (time.length === 3) {
        hours = time.substr(0, 1);
        minutes = time.substr(1, 2);
      }
      result.hours(hours);
      result.minutes(minutes);
      return result.format('h:mm a');
    },

    _timeZoneDifference: function(now, timeZone) {
      var userOffset = now.zone();
      var ourOffset = now.tz(timeZone).zone();
      var difference = (ourOffset - userOffset) / 60;
      return difference;
    },

    _timeZoneDifferenceString: function(now, timeZone) {
      var difference = hours._timeZoneDifference(now, timeZone);
      var differenceText = null;
      if (difference !== 0) {
        differenceText = 'We are in ' + timeZone + ' so ';
        if (difference > 0) {
          differenceText += 'we are ' + difference + ' hours behind you! ';
        }
        else {
          differenceText += 'we are ' + Math.abs(difference) + ' hours ahead of you! ';
        }
      }
      return differenceText;
    },

    _getHours: function(day, m) {
      var result = '';
      var thru = false;
      if (day.length < 1) {
        return 'Closed';
      }
      for (var i = 0; i < day.length; i++) {
        if (thru) {
          result += ' - ';
        }
        else if (i > 0) {
          result += ', ';
        }
        result += hours._formatTime(day[i], m);
        thru = !thru;
      }
      return result;
    },

    _openOrNot: function(now, days, m) {
      m = m || moment();
      var hoursToday = days[now.day()];
      var currentTime = now.hour() * 100 + now.minute();
      var open = false;
      var nextTimeIsOpeningTime = true;
      var findingNextEvent = currentTime < hoursToday[0];
      var until = null;

      for (var i = 0; i < hoursToday.length; i++) {
        if (findingNextEvent) {
          until = hoursToday[i];
          break;
        }
        if (currentTime >= hoursToday[i]) {
          open = !open;
          if (hoursToday[i + 1] && currentTime < hoursToday[i + 1]) {
            findingNextEvent = true;
          }
        }
        nextTimeIsOpeningTime = !nextTimeIsOpeningTime;
      }

      if (open && until) {
        return 'Open right now, until ' + hours._formatTime(until, m);
      }
      else if (!open && until) {
        return 'Closed, will open at ' + hours._formatTime(until, m);
      }
      else if (open && !until) {
        return 'Open right now!';
      }
      else if (!open && !until) {
        return 'Currently Closed!';
      }
    },

    setup: function(element, timeZone, days, m) {

      var div;
      var now = m || moment();

      // Time zone difference
      var diff = hours._timeZoneDifferenceString(now, timeZone);
      if (diff) {
        div = document.createElement('div');
        div.id = 'hours-difference';
        div.innerText = diff;
        element.appendChild(div);
      }

      // Open or not
      div = document.createElement('div');
      div.id = 'hours-open';
      div.innerText = hours._openOrNot(now, days);
      element.appendChild(div);

      // Hours
      for (var i = 0; i < days.length; i++) {
        div = document.createElement('div');
        div.id = 'hours-' + dayNames[i];
        if (now.day() === i) {
          div.className = 'hours-day hours-today';
        }
        else {
          div.className = 'hours-day';
        }
        div.innerText = dayNames[i] + ' ' + hours._getHours(days[i], m);
        element.appendChild(div);
      }

    }

  };

})();

if (typeof module !== 'undefined') {
  module.exports = hours;
}
