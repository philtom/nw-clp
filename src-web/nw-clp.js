var nwclp = new Object();

nwclp.clp = new function() {
  var self = this;

  this.parseCombatLogEntry = function (log) {
    var timeEntry = log.split(/::/),
        timestamp = self.parseTimestamp(timeEntry[0]);
        tokens = timeEntry[1].split(/,/);
        owner = new nwclp.Actor(tokens[0], tokens[1]),
        source = new nwclp.Actor(tokens[2], tokens[3]),
        target = new nwclp.Actor(tokens[4], tokens[5]),
        event = new nwclp.Event(tokens[6], tokens[7], tokens[8], tokens[9], tokens[10], tokens[11]),
        log = new nwclp.Entry(timestamp, owner, source, target, event);
    return log;
  },

  // convert the log timestamp format to ISO 8601
  this.parseTimestamp = function (logTime) {
    var tokens = logTime.split(/:/),
        year = tokens[0],
        month = tokens[1],
        day = tokens[2],
        hour = tokens[3],
        minute = tokens[4],
        second = tokens[5],
        timestamp = "20" + year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + "00";
    return new Date(timestamp);
  };
}

nwclp.Entry = function (timestamp, owner, source, target, event) {
  this.timestamp = timestamp;
  this.owner = owner;
  this.source = source;
  this.target = target;
  this.event = event;

  if (this.source.id == "*") {
    this.source = owner;
  }

  if (this.target.id == "*") {
    this.target = owner;
  }
}

nwclp.Event = function (name, id, type, flags, value, baseValue) {
  this.name = name;
  this.id = id;
  this.type = type;
  this.flags = flags.split('|').filter(function(flag) { return !(flag === "") });
  this.value = value;
  this.baseValue = baseValue;

  if (this.baseValue == 0) {
    this.baseValue == value;
  }
}

nwclp.Actor = function (name, id) {
  this.name = name;
  this.id = id;
}