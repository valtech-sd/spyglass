$( document ).ready(function() {
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

    anchorRef.addEventListener("rotated-right", (e)=>{ // your code here}
        console.log("righty")
        boxRef.setAttribute('color', 'blue');

        if (colorReset) { clearInterval( colorReset )}
        colorReset = setInterval(resetColor, 1000);
    })

    anchorRef.addEventListener("rotated-left", (e)=>{ // your code here}
        boxRef.setAttribute('color', 'red');

        if (colorReset) { clearInterval( colorReset )}
        colorReset = setInterval(resetColor, 1000);
    })
});





