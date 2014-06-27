var app = {};
$(document).ready(function(){
    initScene();
//    addAxes();
    addBoard();

    appendRenderer($('#board'));
    render();
});

function initScene(){
    var scene = new THREE.Scene();
    var window_width = window.innerWidth;
    var window_height = window.innerHeight;
    var camera = new THREE.PerspectiveCamera(100, window_width/window_height, 0.1, 1000);
//    var camera = new THREE.OrthographicCamera(-window_width/2, window_width/2, window_width/2, -window_height/2, 0.1, 200);

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xEEEEEE);
    renderer.setSize(window_width, window_height);

    camera.position.x = 0;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);

    app.camera = camera;
    app.renderer = renderer;
    app.scene = scene;
}

function addAxes(){
    var axes = new THREE.AxisHelper( 20 );
    app.scene.add(axes);
}

function addBoard(){
    var planeGeometry = new THREE.PlaneGeometry(80, 80, 1,1);
    var planeMaterial = new THREE.MeshBasicMaterial({color: '#cccccc'});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x=-0.5*Math.PI;
    plane.position.x=0;
    plane.position.y=0;
    plane.position.z=0;

    app.scene.add(plane);

    app.plane = plane;

//    addCells();
}

function addCells(){
    hasFields = true;
    var count_horizontal = 8;
    var count_vertical = 8;
    var geometry = app.plane.geometry;
    geometry.computeBoundingBox();
    var bound = geometry.boundingBox;

    var width_cell = geometry.parameters.width / count_horizontal;
    var height_cell = geometry.parameters.height / count_vertical;

    var min_x = bound.min.x;
    var min_z = bound.min.y;
    var max_x = bound.max.x;
    var max_z = bound.max.y;

    var current_x = min_x;
    var current_z = min_z;
    var even = 0;
    for (var i = 0; i < count_horizontal; i++) {
        even++;
        console.log('Add row: ' + i);
        for (var j = 0; j < count_vertical; j++) {
            var cellGeometry = new THREE.BoxGeometry(width_cell, 2, height_cell);
            var cellMaterial = new THREE.MeshBasicMaterial({wireframe: false});
            if(even%2 == 0){
                cellMaterial.color.setHex(0x000000);
            }
            else{
                cellMaterial.color.setHex(0xffffff);
            }

            var cell = new THREE.Mesh(cellGeometry, cellMaterial);
            cell.name = "cell-" + i + '_' + j;

            if(current_x < max_x){
                cell.position.x = current_x;
                cell.position.y = 10;
                cell.position.z = current_z;


                current_x += width_cell;
                app.scene.add(cell);
                console.log('Add cell: ' + i + '_' + j);

            }

            if(current_x >= max_x){
                if(current_z < max_z){
                    current_z += height_cell;
                    current_x = min_x;
                }
                else{
                    break;
                }
            }
            even++;
        }
    }
}

function appendRenderer($el){
    $el.append(app.renderer.domElement);
}

var hasFields = false;
function render(){
    requestAnimationFrame(render);
    app.renderer.render(app.scene, app.camera);
    if(!hasFields){
        addCells();
    }
}