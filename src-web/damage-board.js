nwclp.DamageBoard = function(el, file) {
  var self = this;

  this.el = el,
  this.file = file,
  this.lastRead = 0,
  this.leftOver = "",
  this.clp = new nwclp.CombatLogParser(),
  this.incrementalRead = function() {
    // reading at most 1 MB into memory at a time.  might need to optimise this buffer size.
    var endByte = Math.min(self.lastRead + 1048576, file.size),
        chunk = null,
        reader = null;
    //console.log("start: " + self.lastRead + " end: " + endByte);
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
    var entries = _.map(lines, self.clp.parseCombatLogEntry);

    var entriesByOwner = _.groupBy(entries, function(entry) {
      return entry.owner.id;
    });

    _.each(entriesByOwner, self.addEntries);
  },

  this.addEntries = function(entries, id) {
    if (id.indexOf('P') == 0 && entries.length > 0) {
      var owner = entries[0].owner;
      var row = self.getOrCreateRow(owner);
      var damageDoneCell = $(row).children(".damage-done")[0];
      var damageDone = parseFloat($(damageDoneCell).attr("value"));
      var healsDoneCell = $(row).children(".heals-done")[0];
      var healsDone = parseFloat($(healsDoneCell).attr("value"));
      entries.forEach(function(entry) {
        damageDone = damageDone + parseFloat(self.damage(entry));
        healsDone = healsDone + parseFloat(self.heals(entry));
      });

      $(damageDoneCell).text(parseInt(damageDone));
      $(damageDoneCell).attr("value", damageDone);

      $(healsDoneCell).text(parseInt(healsDone));
      $(healsDoneCell).attr("value", healsDone);
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
    $(row).attr("name", name);
    $(row).append(self.createCell(name, name, "name"));
    $(row).append(self.createCell(parseInt(damageDone), damageDone, "damage-done"));
    $(row).append(self.createCell(parseInt(healsDone), healsDone, "heals-done"));
    $(self.el).append(row)

    $(self.el).children().sort(function(a,b) {
      var keyA = $(a).attr('name').toLowerCase();
      var keyB = $(b).attr('name').toLowerCase();
      return keyA < keyB ? -1 : 1;
    }).appendTo(self.el);

    return row;
  },

  this.createCell = function(text, value, type) {
    var cell = document.createElement("div");
    $(cell).addClass("cell");
    $(cell).addClass(type);
    $(cell).text(text);
    $(cell).attr("value", value);
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
