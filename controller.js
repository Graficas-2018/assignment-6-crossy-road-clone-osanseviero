/*
 * Script that handles player movement
 */

let fired = false;

function setAnimations() {
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
    upAnimator.onEnd = winCondition
    player.upAnimation = upAnimator;

    let leftAnimator = new KF.KeyFrameAnimator;
    leftAnimator.init({ 
        interps: [
            {
                keys: [0, 1],
                values: [
                	{x:0, y:0, z: 0}, 
                	{x:-5, y:0, z:0}],
                target: player.position,
                relative: true
            }
        ],
        duration:300,
    });
    player.leftAnimation = leftAnimator;

    let rightAnimator = new KF.KeyFrameAnimator;
    rightAnimator.init({ 
        interps: [
            {
                keys: [0,  1],
                values: [
                	{x:0, y:0, z: 0}, 
                	{x:5.0, y:0, z:0}],
                target: player.position,
                relative: true
            }
        ],
        duration:300,
    });
    player.rightAnimation = rightAnimator;

}

function onKeyDown(event) {
	if(!fired) {
		fired = true;
		switch(event.keyCode) {
			// 'a'
			case 37:
			case 65: 
				player.leftAnimation.start();
				break;

			// w
			case 38:
			case 87: 
				player.upAnimation.start();
				score++;
				scoreHtml.html("Score: " + score);
				break;

			// d or ->
			case 39:
			case 68:
				player.rightAnimation.start();
				break;
		}
	}
}

function onKeyUp(event) {
    fired = false;
}
