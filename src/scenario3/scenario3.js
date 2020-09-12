function ready(fn) {
  // replaces $(document).ready() in jQuery
  if (document.readyState != 'loading'){

    setTimeout(fn, 0);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(fn, 0);
    });
  }
}

ready(function() {
  console.log( "DOM loaded" );

  var sceneRef = document.querySelector('a-scene');

});





