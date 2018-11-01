/*
 * Crossy Road Clone game creator.
 */

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
    waterCollision();
}

/*
 * Reset score and positions
 */
function reset() {
    // Stop animations if currently playing to avoid weird conditions
    player.upAnimation.stop();
    camera.animation.stop();

    // Reset to initial positions
    player.position.set(1.5, 0, 20);
    camera.position.set(1.5, 30, 30);

    // Reset score
    score = 0;
    scoreHtml.html("Score: " + score);
}

/*
 * Build the scene
 */
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
    camera.position.set(1.5, 30, 30);
    camera.rotation.set(-Math.PI/3, 0, 0);
    scene.add(camera);

    // Create and add all the lights
    let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(directionalLight);

    // Load html element once
    scoreHtml = $("#score");
}

/*
 * Create all the objects in the scene
 *
 * This function adds the ground, the player, and the different lanes. The
 * lanes can be cars, which kill the player when touched; water with logs in
 * which the player can float, and trees, which block the player.
 */
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
    player.add(mesh);
    player.position.set(1.5,0, 20);
    setAnimations();
    scene.add(player);

    // Create vehicle, water and forest lanes
    createVehicleRows(10);
    createWaterLane(10);
    createForestRows(10);

}

/*
 * Check if the player is colliding with any car
 */
function carCollision() {
    let playerbox = new THREE.Box3().setFromObject(player);
    for(carObject of cars) {
        // Get collision boxes
        let objectbox = new THREE.Box3().setFromObject(carObject);
        if(playerbox.intersectsBox(objectbox)){
            reset();
        }
    }
}

/*
 * Check if the player is in the water
 *
 * This function check if the user is in a water lane. If it is, it checks
 * if the player is on a log. If the player is on the log, it will keep moving
 * with it.
 */
function waterCollision() {
    let playerbox = new THREE.Box3().setFromObject(player);
    for(lane of waterLanes) {
        // Check if touching water
        if(playerbox.intersectsBox(lane.box)){
            // Check if touching log
            if(!onLog()) {
                reset();
            }
        }
    }
}

/*
 * Check if the player is on a log.
 *
 * The function also checks if the player is going outside the screen so it
 * resets the game.
 */
let inLog = false;
function onLog() {
    let playerbox = new THREE.Box3().setFromObject(player);
    for(logObject of logs) {
        let logbox = new THREE.Box3().setFromObject(logObject);
        if(playerbox.intersectsBox(logbox)){
            // Weird condition where logbox is NaN
            if(logbox.max.x) {
                inLog = true;
                player.position.x = logObject.position.x;

                // Check if player still in log when going out of the screen
                if(player.position.x > 18 || player.position.x < -15) {
                    reset();
                }
                return true;
            }
        }
    }
    inLog = false;
    return false;
}


function main(canvas) {
    // create the scene
    createScene(canvas);

    // create objects
    createObjects()

    // create controller events
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    // Run the run loop
    run();
}

