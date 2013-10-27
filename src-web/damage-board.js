nwclp.DamageBoard = function(el, file) {
  var self = this;

  this.el = el,
  this.file = file,
  this.lastRead = 0,
  this.leftOver = "",
  this.clp = new nwclp.CombatLogParser(),
  this.actionMap = new nwclp.ActionMap(),
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
      //var row = self.getOrCreateRow(self.el, owner);
      //var damageDoneCell = $(row).children(".damage-done")[0];
      //var healsDoneCell = $(row).children(".heals-done")[0];

      entries.forEach(self.actionMap.addEvent);
      self.repaintGroup(owner);
      //self.getOrCreateGroup(owner);
      //$(damageDoneCell).text(parseInt(self.actionMap.damageForOwner(id)));

      //$(healsDoneCell).text(parseInt(self.actionMap.healsForOwner(id)));
    }
  },

  this.hideRow = function(id) {
    var group = self.getGroup(id),
        row = self.getRow(group, "owner");
    if (row != null) {
      $(row).css('display', 'none');
    }
  },

  this.repaint = function() {
    var owners,
        sources,
        powers,
        row;

    owners = self.actionMap.owners();
    _.each(owners, function(owner) {
      // draw owner row
      console.log(owner);
      sources = self.actionMap.sources(owner.id);
      _.each(sources, function(source) {
        // draw source row
        console.log(source);
        powers = self.actionMap.powers(owner.id, source.id);
        _.each(powers, function(power) {
          // draw power row
          console.log(power);
        });
      });
    });
  },

  this.repaintGroup = function(actor) {
    var group = self.getOrCreateGroup(actor),
        ownerRow;
    ownerRow = self.getOrCreateRow(group, actor);
    var damageDoneCell = $(ownerRow).children(".damage-done")[0];
    var healsDoneCell = $(ownerRow).children(".heals-done")[0];

    $(damageDoneCell).text(parseInt(self.actionMap.damageForOwner(actor.id)));

    $(healsDoneCell).text(parseInt(self.actionMap.healsForOwner(actor.id)));

  },

  this.getOrCreateGroup = function(actor) {
    var group = self.getGroup(actor.id);
    if (group == null) {
      group = self.createGroup(actor)
    }
    return group;
  },

  this.getGroup = function(id) {
    var divId = "#" + self.idToHtmlId(id),
        groups = $(self.el).children(divId);
    if (groups.length == 0) {
      return null;
    } else {
      return groups[0];
    }
  },

  this.createGroup = function(actor) {
    var div = document.createElement("div");
    $(div).attr("id", self.idToHtmlId(actor.id));
    $(div).addClass("group");
    $(self.el).append(div);
    return div;
  },

  this.getOrCreateRow = function(parent, actor) {
    var row = self.getRow(parent, "owner");
    if (row == null) {
      row = self.createRow(parent, "owner", actor.id, actor.name, 0, 0);
    }
    return row;
  },

  this.getRow = function(parent, type) {
    var rows = $(parent).children("." + type);
    if (rows.length == 0) {
      return null;
    } else {
      return rows[0];
    }
  },

  this.idToHtmlId = function(id) {
    return id.replace(/[^a-zA-Z0-9_:.-]/g, '_');
  },

  this.createRow = function(parent, type, id, name, damageDone, healsDone) {
    var row = document.createElement("div");
    $(row).addClass("row");
    $(row).addClass(type);
    $(row).attr("name", name);
    $(row).append(self.createCell(name, "name"));
    $(row).append(self.createCell(parseInt(damageDone), "damage-done"));
    $(row).append(self.createCell(parseInt(healsDone), "heals-done"));
    $(row).append(self.createCell("<a href=\"javascript:void(0);\" onclick=\"hide('" + id +"')\">hide</a>", "hide"));
    $(parent).append(row)

//    $(self.el).children().sort(function(a,b) {
//      var keyA = $(a).attr('name').toLowerCase();
//      var keyB = $(b).attr('name').toLowerCase();
//      return keyA < keyB ? -1 : 1;
//    }).appendTo(self.el);

    return row;
  },

  this.createCell = function(text, type) {
    var cell = document.createElement("div");
    $(cell).addClass("cell");
    $(cell).addClass(type);
    $(cell).html(text);
    return cell;
  };
}

nwclp.ActionMap = function() {
  var self = this;
  // outcomeStore[ownerId][sourceId][powerId] = [outcomes]
  this.outcomesStore = {},
  this.actorsById = {},
  this.powersById = {},
  this.addEvent = function(event) {
    var bySource,
        byPower,
        outcomes,
        power;

    bySource = self.outcomesStore[event.owner.id];
    if (bySource == null) {
      bySource = {};
      self.outcomesStore[event.owner.id] = bySource;
    }

    byPower = bySource[event.source.id];
    if (byPower == null) {
      byPower = {};
      bySource[event.source.id] = byPower;
    }

    outcomes = byPower[event.power.id];
    if (outcomes == null) {
      outcomes = [];
      byPower[event.power.id] = outcomes;
    }

    outcomes.push(event.outcome);

    self.actorsById[event.owner.id] = event.owner;
    self.actorsById[event.source.id] = event.source;
    power = self.powersById[event.power.id];
    if (!power || power.name.length == 0) {
      self.powersById[event.power.id] = event.power;
    }
  },

  this.owners = function() {
    return _.map(_.keys(self.outcomesStore), function(ownerId) {
      return self.actorsById[ownerId];
    });
  },

  this.sources = function(ownerId) {
    var bySource = self.outcomesStore[ownerId];
    if (bySource) {
      return _.map(_.keys(bySource), function(sourceId) {
        return self.actorsById[sourceId];
      });
    } else {
      return [];
    }
  },

  this.powers = function(ownerId, sourceId) {
    return _.map(_.keys(self.outcomesStore[ownerId][sourceId]), function(powerId) {
      return self.powersById[powerId];
    });
  },

  this.damageForOwner = function(id) {
    return self.metricForOwner(id, function(outcome) {
      if (outcome.value > 0) {
        return outcome.value;
      } else {
        return 0;
      }
    });
  },

  this.healsForOwner = function(id) {
    return self.metricForOwner(id, function(outcome) {
      if (outcome.value < 0) {
        return -outcome.value;
      } else {
        return 0;
      }
    });
  },

  this.metricForOwner = function(id, metric) {
    var bySource = self.outcomesStore[id];
    return _.reduce(_.values(bySource), function(total, powers) {
      return _.reduce(_.values(powers), function(powerTotal, outcomes) {
        return _.reduce(outcomes, function(outcomesTotal, outcome) {
          return outcomesTotal + parseFloat(metric(outcome));
        }, powerTotal);
      }, total);
    }, 0);
  };
}
