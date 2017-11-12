var selected_obj_id = "triangulo";
var translation = 0.01;

function setEventListeners(){

    document.addEventListener("keydown", function(event){

        // Getting the pressed key

        // Updating rec. depth and drawing again

        var key = event.keyCode; // ASCII

        switch(key){
            case 38 : // up
                webgl.pieces[selected_obj_id].ty += translation;
                webgl.draw();
                break;
            case 40 : // down
                webgl.pieces[selected_obj_id].ty -= translation;
                webgl.draw();
                break;
            case 37: // left
                webgl.pieces[selected_obj_id].tx -= translation;
                webgl.draw();
                break;
            case 39: // right
                webgl.pieces[selected_obj_id].tx += translation;
                webgl.draw();
                break;
        }
    });


    // Button events

    document.getElementById("scale-up-button").onclick = function(){

        // Updating

        sx *= 1.1;

        sy *= 1.1;

        sz *= 1.1;

        // Render the viewport

        drawScene();
    };

    document.getElementById("scale-down-button").onclick = function(){

        // Updating

        sx *= 0.9;

        sy *= 0.9;

        sz *= 0.9;

        // Render the viewport

        drawScene();
    };

    document.getElementById("XX-rotate-CW-button").onclick = function(){

        // Updating

        angleXX -= 15.0;

        // Render the viewport

        drawScene();
    };

    document.getElementById("XX-rotate-CCW-button").onclick = function(){

        // Updating

        angleXX += 15.0;

        // Render the viewport

        drawScene();
    };

    document.getElementById("YY-rotate-CW-button").onclick = function(){

        // Updating

        angleYY -= 15.0;

        // Render the viewport

        drawScene();
    };

    document.getElementById("YY-rotate-CCW-button").onclick = function(){

        // Updating

        angleYY += 15.0;

        // Render the viewport

        drawScene();
    };

    document.getElementById("ZZ-rotate-CW-button").onclick = function(){

        // Updating

        angleZZ -= 15.0;

        // Render the viewport

        drawScene();
    };

    document.getElementById("ZZ-rotate-CCW-button").onclick = function(){

        // Updating

        angleZZ += 15.0;

        // Render the viewport

        drawScene();
    };

    document.getElementById("reset-button").onclick = function(){

        // The initial values

        tx = 0.0;

        ty = 0.0;

        tz = 0.0;

        angleXX = 0.0;

        angleYY = 0.0;

        angleZZ = 0.0;

        sx = 1.0;

        sy = 1.0;

        sz = 1.0;

        // Render the viewport

        drawScene();
    };
}