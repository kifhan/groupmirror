(function() {
    // Client name
    var clientName;

    var ct = document.getElementById("editor"),
        cv = ct.textContent || ct.innerText;
    var editor = CodeMirror(function(node) {
      ct.parentNode.replaceChild(node, ct);
    }, {
      //value: cv,
      mode:  "javascript",
      theme: "ambiance",
      lineNumbers: true,
      lineWrapping: true
    });

    var socket = io.connect();
    clientName = socket.id;

    socket.emit('user_conect', {});

    socket.on('editorUpdate', function (data) {
      editor.setByAPI = true;
      editor.setValue(data.contents);
      //editor.clearSelection();
      editor.setByAPI = false;
    });

    // Track user changes to the editor
    editor.on('change', function() {
        if (!editor.setByAPI) {
            socket.emit('editorUpdate', {
                contents:editor.getValue()
            });
        }
    });
})();
