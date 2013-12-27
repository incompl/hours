

window.hours = (function() {

  var dayNames = [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  ];

  function formatTime(time, timeZone) {
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
    var result = moment().tz(timeZone);
    result.hours(hours);
    result.minutes(minutes);
    return result.format('h:mm a');
  }

  function timeZoneDifference(now, timeZone) {
    var userOffset = now.zone();
    var ourOffset = now.tz(timeZone).zone();
    var difference = (ourOffset - userOffset) / 60

    var differenceText = null;
    if (ourOffset !== userOffset) {
      differenceText = 'We are in ' + timeZone + ' so ';
      if (difference > 0) {
        differenceText += 'we are ' + difference + ' hours behind you! ';
      }
      else {
        differenceText += 'we are ' + Math.abs(difference) + ' hours ahead of you! ';
      }
    }
    return differenceText;
  }

  function openOrNot(now, days, timeZone) {
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
      return 'Open right now, until ' + formatTime(until, timeZone);
    }
    else if (!open && until) {
      return 'Closed, will open at ' + formatTime(until, timeZone);
    }
    else if (open && !until) {
      return 'Open right now!';
    }
    else if (!open && !until) {
      return 'Currently Closed!';
    }
  }

  function hours(day, timeZone) {
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
      result += formatTime(day[i], timeZone);
      thru = !thru;
    }
    return result;
  }

  return {

    setup: function(element, timeZone, days) {

      var div;
      var now = moment();

      // Time zone difference
      var diff = timeZoneDifference(now, timeZone);
      if (diff) {
        div = document.createElement('div');
        div.id = 'hours-difference';
        div.innerText = diff;
        element.appendChild(div);
      }

      // Open or not
      div = document.createElement('div');
      div.id = 'hours-open';
      div.innerText = openOrNot(now, days, timeZone);
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
        div.innerText = dayNames[i] + ' ' + hours(days[i], timeZone);
        element.appendChild(div);
      }

    }

  };

})();