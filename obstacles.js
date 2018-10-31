let collisionObjects = [];
let waterLanes = []
let carGroup = null;


function animateHorizontalGroup(carGroup, speed, right) {
    let animator = new KF.KeyFrameAnimator;
    let x1, x2;
    if(right) {
        x1 = -100;
        x2 = 100;
    } else {
        x1 = 100;
        x2 = -100
    }
    animator.init({ 
        interps: [
            {
                keys: [0, 1],
                values:[
                        { x : x1 },
                        { x : x2}
                ],
                target: carGroup.position
            },
        ],
        loop: true,
        duration: 30000/speed
    });
    animator.start();
}

let carspeed = 1.5;
let lane = 10;
let carDirection = true;
function createVehicleRows(lanes) {
    for(let i=0; i<lanes; i++) {
        createVehicles(lane, carspeed, carDirection);
        carspeed += 0.10;
        lane -= 20;
    }   
}

function createVehicles(lane, speed, right) {
    let geometry = new THREE.BoxGeometry(3, 1, 2);
    let material = new THREE.MeshBasicMaterial({color: 0x159305});

    x = [-20, -10, 0, 5, 10, 15, 20, 30]
    let carGroup = new THREE.Object3D;
    carGroup.position.y = 2;
    carGroup.position.z = lane;
    for(let i=0; i<x.length; i++) {
        let car = new THREE.Mesh(geometry, material);
        car.position.x = x[i];
        collisionObjects.push(car);
        carGroup.add(car);
    }
    carDirection = !right;
    scene.add(carGroup);
    animateHorizontalGroup(carGroup, carspeed, right);
}

let logDirection = true;
let logspeed = 1;
function createWaterLane(lanes) {
    let geometry = new THREE.BoxGeometry(1000, 0.1, 2);
    let material = new THREE.MeshBasicMaterial({color: 0x18288f});
    let z = 0;
    for(let i=0; i<lanes; i++) {
        let waterLane = new THREE.Mesh(geometry, material);
        waterLane.position.z = z;
        scene.add(waterLane);
        createLogs(z, logspeed, logDirection);
        z-=20;
    }
}

function createLogs(lane, speed, right) {
    let geometry = new THREE.BoxGeometry(4, 0.5, 2);
    let material = new THREE.MeshBasicMaterial({color: 0x8e5727});
    x = [-20, -10, 0, 5, 10, 15, 20, 30]
    let logGroup = new THREE.Object3D;
    logGroup.position.y = 0;
    logGroup.position.z = lane;
    for(let i=0; i<x.length; i++) {
        let log = new THREE.Mesh(geometry, material);
        log.position.x = x[i];
        logGroup.add(log);
    }
    logDirection = !right;
    scene.add(logGroup);
    animateHorizontalGroup(logGroup, speed, right);
}

