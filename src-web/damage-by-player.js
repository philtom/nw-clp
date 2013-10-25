$(document).ready(function() {
  $("#files").change(asdf);
});

function asdf(evt) {
  $("#players").empty();
  // TOOD need to close the previous damage board file reader loop
  nwclp.board = new nwclp.DamageBoard($("#players"), evt.target.files[0]);
  nwclp.board.incrementalRead(nwclp.board);
}

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
          var log = nwclp.clp.parseCombatLogEntry(line);
          logs.push(log);
        }
      });
      nwclp.logs = logs;

      $("#players").empty();
      var playerSourceEvents = _.groupBy(nwclp.logs.filter(function(log) { return log.source.id.indexOf('P') == 0 }), function(log) { return log.source.id });
      Object.keys(playerSourceEvents).forEach(function(id) {
        $("#players").append(createRow(id, playerSourceEvents[id]))
      });
    }
  };

  reader.readAsText(files[0])
}

function createRow(id, events) {
  var name = idToName(id),
      damage = calcDamage(events),
      heal = calcHeal(events),
      row = document.createElement("div");
  $(row).addClass("row");
  $(row).append(createCell(name));
  $(row).append(createCell(parseInt(damage)));
  $(row).append(createCell(parseInt(heal)));
  return row;
}

function createCell(text) {
  var cell = document.createElement("div");
  $(cell).addClass("cell");
  $(cell).text(text);
  return cell;
}

function idToName(id) {
  return _.find(nwclp.logs, function(log) {
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