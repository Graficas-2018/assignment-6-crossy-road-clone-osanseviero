/*
 * Crossy Road Clone general controller
 */

// Available positions in x
let availablePositions = [-10.5, -7.5, -4.5, -1.5, 1.5, 4.5, 7.5, 10.5];

/*
 * Updates the score and checks if the user won.
 */
function increaseScore() {
    score++;
    scoreHtml.html("Score: " + score);

    if(score == 20) {
        reset();
    }

    // When jumping from the log, put again in a column
    if(inLog) {
        fixPositionInX();
    }
}

/*
 * Check if there is a tree where the player wants to move
 */
function canMove(playerbox) {
    for(tree of trees) {
        if(playerbox.intersectsBox(tree.box)){
            return false;
        }
    }
    return true;
}

function fixPositionInX() {
    console.log('jumping from log')
    let closest = 0;
    let shortest_distance = 100;
    for(x of availablePositions) {
        let distance = Math.abs(x-player.position.x)
        if(distance < shortest_distance) {
            closest = x;
            shortest_distance = distance 
        }
    }
    player.position.x = closest;
}

/*
 * Sets up user and camera animation
 *
 * The user can move to the right, to the left, and up. This animations
 * are relative. The camera does not move in x, but it moves in y at
 * the same time than the user.
 */
function setAnimations() {
    // Player animation configuration
    let upAnimator = new KF.KeyFrameAnimator;
    upAnimator.init({ 
        interps: [
            {
                keys: [0, 1],
                values: [
                    {x:0, y:0, z: 0}, 
                    {x:0, y:0, z:-5.0}],
                target: player.position,
                relative: true
            }
        ],
        duration:300,
    });
    upAnimator.onEnd = increaseScore;
    player.upAnimation = upAnimator;

    let leftAnimator = new KF.KeyFrameAnimator;
    leftAnimator.init({ 
        interps: [
            {
                keys: [0, 1],
                values: [
                    {x:0, y:0, z: 0}, 
                    {x:-3, y:0, z:0}],
                target: player.position,
                relative: true
            }
        ],
        duration:150,
    });
    player.leftAnimation = leftAnimator;

    let rightAnimator = new KF.KeyFrameAnimator;
    rightAnimator.init({ 
        interps: [
            {
                keys: [0,  1],
                values: [
                    {x:0, y:0, z: 0}, 
                    {x:3, y:0, z:0}],
                target: player.position,
                relative: true
            }
        ],
        duration:150,
    });
    player.rightAnimation = rightAnimator;

    // Camera animation configuration
    let cameraAnimator = new KF.KeyFrameAnimator;
    cameraAnimator.init({ 
        interps: [
            {
                keys: [0, 1],
                values: [
                    {x:0, y:0, z: 0}, 
                    {x:0, y:0, z:-5.0}],
                target: camera.position,
                relative: true
            }
        ],
        duration:300,
    });
    camera.animation = cameraAnimator;

}

// Flag to check if the user pressed a key so it's only counted once
let fired = false;

/*
 * Event handler to move to the right, left, and up.
 * 
 * User can move with arrows and with awsd.
 */
function onKeyDown(event) {
    if(!fired) {
        fired = true;
        switch(event.keyCode) {
            // 'a' or <-
            case 37:
            case 65: 
                if(player.position.x > -9) {
                    var playerbox = new THREE.Box3().setFromObject(player);
                    playerbox.min.x -= 3;
                    playerbox.max.x -= 3;
                    if(canMove(playerbox)) {
                        player.leftAnimation.start();
                    }
                }
                break;

            // w or ^
            case 38:
            case 87: 
                var playerbox = new THREE.Box3().setFromObject(player);
                playerbox.min.z -= 5;
                playerbox.max.z -= 5;
                if(canMove(playerbox)) {
                    // Animate player and camera
                    player.upAnimation.start();
                    camera.animation.start();                    
                }
                break;

            // d or ->
            case 39:
            case 68:   
                if(player.position.x < 9) {
                    var playerbox = new THREE.Box3().setFromObject(player);
                    playerbox.min.x += 3;
                    playerbox.max.x += 3;
                    if(canMove(playerbox)) {
                        player.rightAnimation.start();
                    }
                }
                break;
        }
    }
}

function onKeyUp(event) {
    fired = false;
}
