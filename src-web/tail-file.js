$(document).ready(function() {
  $("#file").change(handleFileSelect);
});

var file = null;
var lastRead = 0;

function handleFileSelect(evt) {
  console.log(evt);
  var files = evt.target.files; // FileList object

  file = files[0];
  _.delay(updateSize, 1000);
}

function updateSize() {
  if (file != null) {
    $("#file_size").text(file.size);

    if (file.size > lastRead) {
      var end = Math.min(lastRead + 1024, file.size);
      var slice = file.slice(lastRead, end);
      var reader = new FileReader();
      reader.onload = function(evt) {
        $("#file_content").append(evt.target.result);
      }
      reader.readAsText(slice);
      lastRead = end;
    }

    var delay = 1000;
    if (lastRead < file.size) {
      delay = 0;
    }
    _.delay(updateSize, delay);
  }
}

