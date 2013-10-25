$(document).ready(function() {
  $("#files").change(handleFileSelect);
});

function handleFileSelect(evt) {
  $("#players").empty();
  // TOOD need to close the previous damage board file reader loop
  nwclp.board = new nwclp.DamageBoard($("#players"), evt.target.files[0]);
  nwclp.board.incrementalRead(nwclp.board);
}
