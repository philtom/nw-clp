window.onload = function() {
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
};

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  var reader = new FileReader();
  var clp = new nwclp.CombatLogParser()

  // If we use onloadend, we need to check the readyState.
  reader.onloadend = function(evt) {
    if (evt.target.readyState == FileReader.DONE) { // DONE == 2
      var text = evt.target.result;
      var logs = [];
      var lines = text.split(/[\r\n]+/g);
      lines.forEach(function(line) {
        if (line != "") {
          var log = clp.parseCombatLogEntry(line);
          logs.push(JSON.stringify(log));
        }
      });
      document.getElementById('file_content').innerHTML = logs.join("<hr>");
    }
  };

  reader.readAsText(files[0])
}

