var selected_obj_id = "triangulo";
var translation = 0.01;
var old_x = undefined, old_y = undefined;

function update_x(val) {
    $('#progress_bar_tx').css('width', val+'%').attr('aria-valuenow', val);
    $("#value_tx").html("tx: "+val+"%");
}

function update_y(val) {
    $('#progress_bar_ty').css('width', val+'%').attr('aria-valuenow', val);
    $("#value_ty").html("ty: "+val+"%");
}

function update_z(val) {
    $('#progress_bar_tz').css('width', val+'%').attr('aria-valuenow', val);
    $("#value_tz").html("tz: "+val+"%");
}

function verify_puzzle() {
    var success = true;

    for(var i=0; i<puzzle_definition.puzzle_pieces.length; i++){
        for(var z=i+1; z<puzzle_definition.puzzle_pieces.length; z++){
            // difference between puzzle definition and current puzzle pieces array
            // tx
            var definition = (parseFloat(puzzle_definition.puzzle_pieces[i].end.tx.toFixed(2))-parseFloat(puzzle_definition.puzzle_pieces[z].end.tx.toFixed(2))).toFixed(2);
            var current = (parseFloat(webgl.pieces[puzzle_definition.puzzle_pieces[i].id].tx.toFixed(2))-parseFloat(webgl.pieces[puzzle_definition.puzzle_pieces[z].id].tx.toFixed(2))).toFixed(2);

            if (definition!==current){
                success = false;
                console.log("tx:", definition, current);
                console.log("%", 100-((definition-current)*100)%100);
            }

            // difference between puzzle definition and current puzzle pieces array
            // ty
            definition = (parseFloat(puzzle_definition.puzzle_pieces[i].end.ty.toFixed(2))-parseFloat(puzzle_definition.puzzle_pieces[z].end.ty.toFixed(2))).toFixed(2);
            current = (parseFloat(webgl.pieces[puzzle_definition.puzzle_pieces[i].id].ty.toFixed(2))-parseFloat(webgl.pieces[puzzle_definition.puzzle_pieces[z].id].ty.toFixed(2))).toFixed(2);

            if (definition!==current){
                success = false;
                console.log("ty", definition, current);
            }

            // difference between puzzle definition and current puzzle pieces array
            // tz
            definition = (parseFloat(puzzle_definition.puzzle_pieces[i].end.tz.toFixed(2))-parseFloat(puzzle_definition.puzzle_pieces[z].end.tz.toFixed(2))).toFixed(2);
            current = (parseFloat(webgl.pieces[puzzle_definition.puzzle_pieces[i].id].tz.toFixed(2))-parseFloat(webgl.pieces[puzzle_definition.puzzle_pieces[z].id].tz.toFixed(2))).toFixed(2);

            if (definition!==current){
                success = false;
                console.log("tz", definition, current);
            }
            console.log("tz", definition, current);
        }
    }

    if(success){
        $("#puzzle_success").show();
    }else{
        $("#puzzle_success").hide();
    }

    /*
    for(var i=0; i<puzzle_definition.puzzle_pieces.length; i++){
        console.log(puzzle_definition.puzzle_pieces[i].id);
        console.log(webgl.pieces[puzzle_definition.puzzle_pieces[i].id].tx.toFixed(2));
        console.log(webgl.pieces[puzzle_definition.puzzle_pieces[i].id].ty.toFixed(2));
        console.log(webgl.pieces[puzzle_definition.puzzle_pieces[i].id].tz.toFixed(2));
    }
    */
}

$(document).ready(function () {
    verify_puzzle();
});

function setEventListeners(){

    /* set btn for puzzle */
    $("#puzzle_success").hide();

    for(var i=0; i<puzzle_definition.puzzle_pieces.length; i++){
        var name = puzzle_definition.puzzle_pieces[i].name;
        var id = puzzle_definition.puzzle_pieces[i].id;

        if(i%2){
            $("#components").append('<li class="nav-item"><a rel="id'+id+'" class="btn btn-sunny text-uppercase btn-sm">'+(i+1)+': '+name+'</a></li>');
        }else{
            $("#components").append('<li class="nav-item"><a rel="id'+id+'" class="btn btn-fresh text-uppercase btn-sm">'+(i+1)+': '+name+'</a></li>');
        }
    }
    $("#components").append('<a rel="idboard" class="btn btn-sky text-uppercase btn-sm">Board</a>');

    $('a[rel^="id"]').click(function () {
        selected_obj_id = $(this).attr('rel').replace("id", "");
        $('a[rel^="id"]').removeClass("active");
        $(this).addClass("active");
    });

    /* end set btn for puzzle */

    var map = {37: false, // left key
        38: false, // up key
        39: false, // right key
        40: false, // down key
        90: false // z key
    };

    $(document).keydown(function(event){

        if(selected_obj_id==="board"){
            return;
        }
        
        var key = event.keyCode; // ASCII
        map[key] = true;

        if (event.keyCode in map ) {
            if (map[90] && map[38]) {
                webgl.pieces[selected_obj_id].tz += translation;
                webgl.draw();
                return false;
            } else if (map[90] && map[40]) {
                webgl.pieces[selected_obj_id].tz -= translation;
                webgl.draw();
                return false;
            }else if (map[38]){
                webgl.pieces[selected_obj_id].ty += translation;
                webgl.draw();
                return false;
            }else if(map[40]){
                webgl.pieces[selected_obj_id].ty -= translation;
                webgl.draw();
                return false;
            }else if(map[37]){
                webgl.pieces[selected_obj_id].tx -= translation;
                webgl.draw();
                return false;
            }else if(map[39]){
                webgl.pieces[selected_obj_id].tx += translation;
                webgl.draw();
                return false;
            }
        }
    }).keyup(function(e) {
        if (e.keyCode in map) {
            map[e.keyCode] = false;
        }
    });

    function get2DCoords(ev){
        var c_height = $("#webgl-id").height();
        var x, y, top = 0, left = 0, obj = webgl.canvas;

        while (obj && obj.tagName !== 'BODY') {
            top += obj.offsetTop;
            left += obj.offsetLeft;
            obj = obj.offsetParent;
        }

        left += window.pageXOffset;
        top -= window.pageYOffset;

        // return relative mouse position
        x = ev.clientX - left;
        y = c_height - (ev.clientY - top); //c_height is a global variable that we maintain in codeview.js
        //this variable contains the height of the canvas and it updates dynamically
        //as we resize the browser window.
        return {x:x,y:y};
    }

    // MOVE COMPONENT WITH MOUSE
    $("#webgl-id").mousedown(function (e) {
        var coords = get2DCoords(e);

        if(old_x==undefined || old_y==undefined){
            old_y = coords.y;
            old_x = coords.x;
        }
    })
    .mousemove(function (e) {
        if(old_x==undefined || old_y==undefined){
            return;
        }
        var coords = get2DCoords(e);

        var speed = $("#speed").val();

        var delta_y = coords.y - old_y;
        var delta_x = coords.x - old_x;

        if(selected_obj_id!=="board"){
            var ty = delta_y*speed;
            var tx = delta_x*speed;

            webgl.pieces[selected_obj_id].ty += ty;
            webgl.pieces[selected_obj_id].tx += tx;
        }else{
            for(var piece in webgl.pieces) {
                webgl.pieces[piece].globalAngleXX += radians(10 * delta_x);
                webgl.pieces[piece].globalAngleYY += radians(10 * delta_y);
            }

            webgl.background.globalAngleXX += radians( 10 * delta_x);
            webgl.background.globalAngleYY += radians( 10 * delta_y);
        }

        old_y = coords.y;
        old_x = coords.x;
        webgl.draw();

    })
    .mouseup(function() {
        old_y = undefined;
        old_x = undefined;
    });

    document.getElementById("XX-rotate-CW-button").onclick = function(){
        webgl.pieces[selected_obj_id].angleXX += 15.0;
        webgl.draw();
    };

    document.getElementById("XX-rotate-CCW-button").onclick = function(){
        webgl.pieces[selected_obj_id].angleXX -= 15.0;
        webgl.draw();
    };

    document.getElementById("YY-rotate-CW-button").onclick = function(){
        webgl.pieces[selected_obj_id].angleYY -= 15.0;
        webgl.draw();
    };

    document.getElementById("YY-rotate-CCW-button").onclick = function(){
        webgl.pieces[selected_obj_id].angleYY += 15.0;
        webgl.draw();
    };

    document.getElementById("ZZ-rotate-CW-button").onclick = function(){
        webgl.pieces[selected_obj_id].angleZZ -= 15.0;
        webgl.draw();
    };

    document.getElementById("ZZ-rotate-CCW-button").onclick = function(){
        webgl.pieces[selected_obj_id].angleZZ += 15.0;
        webgl.draw();
    };

    document.getElementById("scale-up-button").onclick = function(){
        webgl.sx *= 1.1;
        webgl.sy *= 1.1;
        webgl.sz *= 1.1;
        webgl.draw();
    };

    document.getElementById("scale-down-button").onclick = function(){
        webgl.sx *= 0.9;
        webgl.sy *= 0.9;
        webgl.sz *= 0.9;
        webgl.draw();
    };


}