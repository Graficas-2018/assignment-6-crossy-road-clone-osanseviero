/*
 * Crossy Road Clone obstacles generator
 *
 * This script has helper functions to create all the lanes, including
 * the cars, logs, water, and trees. It is reusable to generate as many
 * lanes as needed, with the restriction that the order is always the same:
 * TREE -> VEHICLES -> WATER -> TREE.
 *
 * Every lane of the same type moves faster. This means that cars and logs
 * move faster and faster. Additionally, the direction of this objects
 * alternate with every case of the same type.
 */

// Arrays that contain the objects
let cars = [];
let waterLanes = [];
let logs = [];
let trees = [];


/*
 * Creates the specified number of lanes of cars.
 */
function createVehicleRows(lanes) {
    // Variables that change for each car lane
    let carSpeed = 1;         // Speed of the cars
    let carLane = 10;           // The position in z of the lane
    let carDirection = true;    // True for going from left to right.

    for(let i=0; i<lanes; i++) {
        createVehicles(carLane, carSpeed, carDirection);

        // Increase speed
        carSpeed += 0.25;

        // Next lane position in z
        carLane -= 15;

        // Alternate direction
        carDirection = !carDirection;
    }   
}

/*
 * Create the cars of the lane with the animators
 */
function createVehicles(lane, speed, right) {
    let geometry = new THREE.BoxGeometry(3, 1, 2);
    let material = new THREE.MeshBasicMaterial({color: 0x159305});

    // Relative initial and ending positions
    x = [0, 15, 35, 45, 55, 75];
    for(let i=0; i<x.length; i++) {
        // Create car object
        let car = new THREE.Mesh(geometry, material);
        car.position.z = lane;  

        // Create car animator depending on the direction
        car.animator = new KF.KeyFrameAnimator;
        if(right) {
            car.min = -25-x[i];
            car.max = 110-x[i];
        } else {
            car.min = 110-x[i];
            car.max = -25-x[i];
        }

        car.animator.init({ 
            interps: [
                {
                    keys: [0, 1],
                    values:[
                            { x : car.min },
                            { x : car.max}
                    ],
                    target: car.position
                },
            ],
            loop: true,
            duration: 10000/speed
        });

        cars.push(car);
        car.animator.start();
        scene.add(car);
    }
}



/*
 * Creates the specified number of lanes of cars.
 */
function createWaterLane(lanes) {
    // Variables that change for each water lane
    let logSpeed = 1;           // Speed of the logs
    let lane = 0;               // The position in z of the lane
    let logDirection = true;    // Direction of the logs

    // Create water object
    let geometry = new THREE.BoxGeometry(1000, 0.1, 2);
    let material = new THREE.MeshBasicMaterial({color: 0x18288f});
    for(let i=0; i<lanes; i++) {
        // Create lane
        let waterLane = new THREE.Mesh(geometry, material);
        waterLane.position.z = lane;

        // Get box for collision (it is fixed for water)
        waterLane.box = new THREE.Box3().setFromObject(waterLane);

        // Add lane to scene
        scene.add(waterLane);

        // Create the logs
        createLogs(lane, logSpeed, logDirection);

        // Increase speed
        logSpeed += 0.25;

        // Update position in z
        lane -= 15;

        // Alternate direction of lanes
        logDirection = !logDirection;
        
        waterLanes.push(waterLane);
        
    }
}

/*
 * Creates the logs of a specific lane.
 */
function createLogs(lane, speed, right) {
    let geometry = new THREE.BoxGeometry(4, 0.5, 2);
    let material = new THREE.MeshBasicMaterial({color: 0x8e5727});

    // Relative initial and ending positions
    x = [0, 5, 15, 25, 35, 50, 70];
    for(let i=0; i<20; i++) {
        // Create log object
        let log = new THREE.Mesh(geometry, material);
        log.position.z = lane;  
        log.position.y = 0.1

        // Create log animator depending on the direction
        log.animator = new KF.KeyFrameAnimator;
        if(right) {
            log.min = -25-x[i];
            log.max = 110-x[i];
        } else {
            log.min = 110-x[i];
            log.max = -25-x[i];
        }
        
        log.animator.init({ 
            interps: [
                {
                    keys: [0, 1],
                    values:[
                            { x : log.min },
                            { x : log.max}
                    ],
                    target: log.position
                },
            ],
            loop: true,
            duration: 10000/speed
        });

        logs.push(log);
        log.animator.start();
        scene.add(log);
    }
}


/*
 * Creates the specified number of lanes of cars.
 */
function createForestRows(lanes) {
    // Variables that change for each forest lane
    let lane = 5;  // Position in z
    let treeCount = 3   // Number of trees in the lane

    // Create tree object
    let geometry = new THREE.BoxGeometry(2, 4, 2);
    let material = new THREE.MeshBasicMaterial({color: 0x633e1d});
    
    for(let i=0; i<lanes; i++) {
        let treePositions = availablePositions.slice();
        for(let j=0; j<treeCount; j++) {
            // Create tree object
            let tree = new THREE.Mesh(geometry, material);
            tree.position.z = lane;  
            tree.position.x = treePositions[Math.floor(Math.random()*(8-j))];
            tree.position.y = 0;
            tree.box = new THREE.Box3().setFromObject(tree);

            // Remove element from available positions for this lane
            treePositions.splice(treePositions.indexOf(tree.position.x), 1);

            scene.add(tree);
            trees.push(tree);
        }
        // Next lane position in z
        lane -= 15;

        // Increase difficulty as game advances
        if(i == 1) {
            treeCount = 4;
        }
        else if(i == 3) {
            treeCount = 5;
        }
    }   
}
