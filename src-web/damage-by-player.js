window.onload = function() {
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
};

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  var reader = new FileReader();

  // If we use onloadend, we need to check the readyState.
  reader.onloadend = function(evt) {
    if (evt.target.readyState == FileReader.DONE) { // DONE == 2
      var text = evt.target.result;
      var logs = [];
      var lines = text.split(/[\r\n]+/g);
      lines.forEach(function(line) {
        if (line != "") {
          var log = parseCombatLogEntry(line);
          logs.push(log);
        }
      });
      clp.logs = logs;

      var playerSourceEvents = _.groupBy(clp.logs.filter(function(log) { return log.source.id.indexOf('P') == 0 }), function(log) { return log.source.id });
      var rows = _.map(Object.keys(playerSourceEvents), function(id) {
        return createRow(id, playerSourceEvents[id]);
      });
      document.getElementById('players').innerHTML = rows.join("\n")
    }
  };

  reader.readAsText(files[0])
}

function createRow(id, events) {
  var name = idToName(id),
      damage = calcDamage(events),
      heal = calcHeal(events);
  return "<div class=\"row\"><div class=\"cell\">" + name + "</div><div class=\"cell\">" + parseInt(damage) + "</div><div class=\"cell\">" + parseInt(heal) + "</div></div>";
}

function idToName(id) {
  return _.find(clp.logs, function(log) {
    return log.source.id == id
  }).source.name;
}

function calcDamage(events) {
  return _.reduce(events, totalDamage, 0);
}

function totalDamage(total, event) {
  return parseFloat(total) + parseFloat(damage(event));
}

function damage(event) {
  if (event.event.value > 0) {
    return event.event.value;
  } else {
    return 0;
  }
}

function calcHeal(events) {
  return _.reduce(events, totalHeal, 0);
}

function totalHeal(total, event) {
  return parseFloat(total) + parseFloat(heal(event));
}

function heal(event) {
  if (event.event.value < 0) {
    return -event.event.value;
  } else {
    return 0;
  }
}