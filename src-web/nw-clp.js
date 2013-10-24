var nw = new Object();

nw.clp = new function() {
 this.parseCombatLogEntry = function (log) {
   var timeEntry = log.split(/::/),
       timestamp = this.parseTimestamp(timeEntry[0]);
       tokens = timeEntry[1].split(/,/);
       owner = this.createActor(tokens[0], tokens[1]),
       source = this.createActor(tokens[2], tokens[3]),
       target = this.createActor(tokens[4], tokens[5]),
       event = this.createEvent(tokens[6], tokens[7], tokens[8], tokens[9], tokens[10], tokens[11]),
       log = this.createLog(timestamp, owner, source, target, event);
   return log;
 },

 this.createActor = function (name, id) {
   var actor = new Object();
   actor.name = name;
   actor.id = id;

   return actor;
 },

 this.createEvent = function (name, id, type, flags, value, baseValue) {
   var event = new Object();
   event.name = name;
   event.id = id;
   event.type = type;
   event.flags = flags.split('|').filter(function(flag) { return !(flag === "") });
   event.value = value;
   event.baseValue = baseValue;
   return event;
 },

 this.createLog = function (timestamp, owner, source, target, event) {
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

