var selected_obj_id = "triangulo";
var translation = 0.01;
var old_x = undefined, old_y = undefined;

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

function setEventListeners(){

    /* set btn for puzzle */
    $("#puzzle_success").hide();

    for(var i=0; i<puzzle_definition.puzzle_pieces.length; i++){
        var name = puzzle_definition.puzzle_pieces[i].name;
        var id = puzzle_definition.puzzle_pieces[i].id;

        if(i%2){
            $("#components").append('<button type="button" rel="id'+id+'" class="btn btn-sunny text-uppercase btn-sm">'+name+'</button>');
        }else{
            $("#components").append('<button type="button" rel="id'+id+'" class="btn btn-fresh text-uppercase btn-sm">'+name+'</button>');
        }
    }
    $("#components").append('<button type="button" class="btn btn-sky text-uppercase btn-sm">Board</button>');

    $('button[rel^="id"]').click(function () {
        selected_obj_id = $(this).attr('rel').replace("id", "");
        $('button[rel^="id"]').removeClass("active");
        $(this).addClass("active");
    });

    /* end set btn for puzzle */

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
        //console.info('x='+x+', y='+y);

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

        var ty = (coords.y - old_y)*speed;
        var tx = (coords.x - old_x)*speed;

        webgl.pieces[selected_obj_id].ty += ty;
        webgl.pieces[selected_obj_id].tx += tx;
        old_y = coords.y;
        old_x = coords.x;
        webgl.draw();

    })
    .mouseup(function() {
        old_y = undefined;
        old_x = undefined;
    });

    // SELECT COMPONENT WITH MOUSE


}