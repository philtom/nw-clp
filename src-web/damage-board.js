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
    //$(self.el).append(JSON.stringify(entry) + "<hr>")
    // TODO cache log entries
    //nw.logs.push(log);
    if (entry.owner.id.indexOf('P') == 0) {
      var row = self.getOrCreateRow(entry.owner);
      var damageDone = $(row).children(".damage-done")[0];
      $(damageDone).text(parseFloat($(damageDone).text()) + parseFloat(self.damage(entry)));
      var healsDone = $(row).children(".heals-done")[0];
      $(healsDone).text(parseFloat($(healsDone).text()) + parseFloat(self.heals(entry)));
    }
  },

  this.getOrCreateRow = function(actor) {
    var divId = "#" + self.idToHtmlId(actor.id);
    if ($(self.el).children(divId).length == 0) {
      return self.createRow(actor.id, actor.name, 0, 0);
    } else {
      return $(self.el).children(divId)[0];
    }
  },

  this.idToHtmlId = function(id) {
    return id.replace(/[^a-zA-Z0-9_:.-]/g, '_');
  },

  this.createRow = function(id, name, damageDone, healsDone) {
    var row = document.createElement("div");
    $(row).attr("id", self.idToHtmlId(id))
    $(row).addClass("row");
    $(row).append(self.createCell(name, "name"));
    $(row).append(self.createCell(parseInt(damageDone), "damage-done"));
    $(row).append(self.createCell(parseInt(healsDone), "heals-done"));
    $(self.el).append(row)
    return row;
  },

  this.createCell = function(text, type) {
    var cell = document.createElement("div");
    $(cell).addClass("cell");
    $(cell).addClass(type);
    $(cell).text(text);
    return cell;
  },

  this.damage = function(entry) {
    if (entry.event.value > 0) {
      return entry.event.value;
    } else {
      return 0;
    }
  },

  this.heals = function(entry) {
    if (entry.event.value < 0) {
      return -entry.event.value;
    } else {
      return 0;
    }
  };

}
