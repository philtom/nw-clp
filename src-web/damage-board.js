nwclp.DamageBoard = function(el, file) {
  var self = this;

  this.el = el,
  this.file = file,
  this.lastRead = 0,
  this.leftOver = "",
  this.incrementalRead = function() {
    var endByte = Math.min(self.lastRead + 1048576, file.size),
        chunk = null,
        reader = null;
    console.log("start: " + self.lastRead + " end: " + endByte);
    chunk = file.slice(self.lastRead, endByte);
    reader = new FileReader();
    reader.onload = function(evt) {
      self.parseResult(evt.target.result);
    };

    self.lastRead = endByte;
    reader.readAsText(chunk);
  },

  this.parseResult = function(text) {
    text = self.leftOver + text;
    self.leftOver = "";
    if (text.length > 0) {
      var isNewLineEnd = Math.max(text.lastIndexOf("\n"), text.lastIndexOf("\r")) == (text.length - 1)
      var lines = text.split(/[\r\n]+/g);
      self.parseLines(_.initial(lines));
      if (!isNewLineEnd) {
        self.leftOver = _.last(lines);
      }
    }

    var delay = 1000;
    if (self.lastRead < file.size) {
      delay = 0;
    }
    _.delay(self.incrementalRead, delay);
  },

  this.parseLines = function(lines) {
    lines.forEach(function(line) {
      var entry = nwclp.clp.parseCombatLogEntry(line);
      self.addEntry(entry);
    });
  },

  this.addEntry = function(entry) {
    $(self.el).append(JSON.stringify(entry) + "<hr>")
  };


}