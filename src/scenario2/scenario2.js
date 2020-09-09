
import fontImg from './assets/din_ot.png'
import fontFile from './assets/din_ot.fnt'

// Also have to do the icons?

function ready(fn) {
  // replaces $(document).ready() in jQuery
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function() {
  console.log( "DOM loaded" );
});





