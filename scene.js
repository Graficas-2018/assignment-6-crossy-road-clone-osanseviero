let renderer = null;
let scene = null;
let camera = null;

let score = 0;
let player = null

function run() {
    requestAnimationFrame(function() { run(); });

    // Render the scene
    renderer.render(scene, camera);
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
    camera.position.set(0, 30, 30);
    camera.rotation.set(-Math.PI/3, 0, 0);
    scene.add(camera);

    // Create and add all the lights
    let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(directionalLight);
}

function createObjects() {
	// Create ground
    var map = new THREE.TextureLoader().load('../images/checker_large.gif');
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);
    var material = new THREE.MeshLambertMaterial({map: map});

    var ground = new THREE.PlaneGeometry(200, 200, 50, 50);
    var mesh = new THREE.Mesh(ground, material);
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    // Create player
    var geometry = new THREE.BoxGeometry(2, 2, 2);
    var material = new THREE.MeshBasicMaterial({color: 0xFF9900});
    var mesh = new THREE.Mesh(geometry, material);
    player = new THREE.Object3D();
    player.castShadow = true;
    player.add(mesh);
    player.position.set(1.5,2, 15);
    scene.add(player);
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

var fired = false;
function onKeyDown(event) {
	if(!fired) {
		fired = true;
		switch(event.keyCode) {
			// 'a'
			case 65: 
				player.position.x -= 1;
				camera.position.x -= 1;
				break;

			// w
			case 87: 
				player.position.z -= 1;
				camera.position.z -= 1;
				score++;
				$("#score").html("Score: " + score);
				break;

			// d
			case 68:
				player.position.x += 1;
				camera.position.x += 1;
				break;
		}
	}
}

function onKeyUp(event) {
    fired = false;
}
