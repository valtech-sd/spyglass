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

    var anchorRef = document.querySelector('a-marker');
    var boxRef = document.querySelector('a-box');

    function resetColor () {
        if (boxRef) {
            boxRef.setAttribute('color', 'green');
        }
    }

    var colorReset;

    anchorRef.addEventListener("markerFound", (e)=>{ // your code here}
        console.log("Found marker")
    })

    anchorRef.addEventListener("markerLost", (e)=>{ // your code here}
        console.log("Lost marker")
    })

    // anchorRef.addEventListener("tilt-side", (e)=>{ // your code here}
    //     boxRef.setAttribute('color', 'blue');
    //     if (colorReset) { clearInterval( colorReset )}
    //     colorReset = setInterval(resetColor, 500);
    // })

    // anchorRef.addEventListener("tilt-forward", (e)=>{ // your code here}
    //     boxRef.setAttribute('color', 'red');
    //     if (colorReset) { clearInterval( colorReset )}
    //     colorReset = setInterval(resetColor, 500);
    // })

    // More difficult to detect twist with other events
    anchorRef.addEventListener("twist", (e)=>{ // your code here}
        boxRef.setAttribute('color', 'purple');
        if (colorReset) { clearInterval( colorReset )}
        colorReset = setInterval(resetColor, 500);
    })
});





