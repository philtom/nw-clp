function parseCombatLogEntry(log) {
  var timeEntry = log.split(/::/),
      timestamp = parseTimestamp(timeEntry[0]);
      tokens = timeEntry[1].split(/,/);
      owner = createActor(tokens[0], tokens[1]),
      source = createActor(tokens[2], tokens[3]),
      target = createActor(tokens[4], tokens[5]),
      event = createEvent(tokens[6], tokens[7], tokens[8], tokens[9], tokens[10]),
      log = createLog(timestamp, owner, source, target, event);
  return log;
}

function createActor(name, id) {
  var actor = new Object();
  actor.name = name;
  actor.id = id;
  return actor;
}

function createEvent(name, id, type, value, baseValue) {
  var event = new Object();
  event.name = name;
  event.id = id;
  event.type = type;
  event.value = value;
  event.baseValue = baseValue;
  return event;
}

function createLog(timestamp, owner, source, target, event) {
  var log = new Object();
  log.timestamp = timestamp;
  log.owner = owner;
  if (source.id == "*") {
    log.source = owner;
  } else {
    log.source = source;
  }
  if (target.id == "*") {
    log.target = owner;
  } else {
    log.target = target;
  }
  log.event = event;
  return log;
}

// convert the log timestamp format to ISO 8601
function parseTimestamp(logTime) {
  var tokens = logTime.split(/:/),
      year = tokens[0],
      month = tokens[1],
      day = tokens[2],
      hour = tokens[3],
      minute = tokens[4],
      second = tokens[5],
      timestamp = "20" + year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + "00";
  return new Date(timestamp);
}
