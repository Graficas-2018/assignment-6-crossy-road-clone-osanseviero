let renderer = null;
let scene = null;
let camera = null;

let score = 0;
let scoreHtml = null
let player = null;
let tree = null;


function run() {
    requestAnimationFrame(function() { run(); });

    // Render the scene
    renderer.render(scene, camera);

    // Update the animations
    KF.update();

    // Check for collisions
    carCollision();
}

function reset() {
	player.position.set(1.5, 2, 20);
	score = 0;
	scoreHtml.html("Score: " + score);
}

function createScene(canvas) {
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true });

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.15, 0.1, 0.3);

    // Add a camera so we can view the scene
    camera = new THREE.PerspectiveCamera(45, canvas.width/canvas.height, 1, 4000 );
    camera.position.set(0, 30, 10);
    camera.rotation.set(-Math.PI/3, 0, 0);

    // Create and add all the lights
    let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(directionalLight);

    // Load html element once
    scoreHtml = $("#score");
}

function loadTree() {
	let loader = new THREE.FBXLoader();
    loader.load( '../models/tree/lowpolytree.fbx', function ( object )
    {
        tree = object;
        tree.position.x = 0;
        tree.position.y = -4;
        tree.position.z = 0;
    } );

    scene.add(tree);
}

function createObjects() {
	// Create ground
    let map = new THREE.TextureLoader().load('../images/checker_large.gif');
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);
    let material = new THREE.MeshLambertMaterial({map: map});

    let ground = new THREE.PlaneGeometry(200, 200, 50, 50);
    let mesh = new THREE.Mesh(ground, material);
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    // Create player
    let geometry = new THREE.BoxGeometry(2, 2, 2);
    material = new THREE.MeshBasicMaterial({color: 0xFF9900});
    mesh = new THREE.Mesh(geometry, material);
    player = new THREE.Object3D();
    player.castShadow = true;
    player.add(mesh);
    player.position.set(1.5,2, 20);
    player.add(camera);
    setAnimations();
    scene.add(player);

    createVehicleRows(3);
    createWaterLane(2);

}

function main(canvas) {
    // create the scene
    createScene(canvas);

    // create objects
    createObjects()

    // create controller
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    // Run the run loop
    run();
}

function carCollision() {
	for(object of collisionObjects) {
		let playerbox = new THREE.Box3().setFromObject(player);
        let objectbox = new THREE.Box3().setFromObject(object);
        if(playerbox.intersectsBox(objectbox)){
            reset();
        }
	}
}

function winCondition() {
	if(score == 15) {
		reset();
	}
}

