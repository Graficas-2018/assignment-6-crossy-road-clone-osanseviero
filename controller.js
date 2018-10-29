/*
 * Script that handles player movement
 */

let fired = false;

function onKeyDown(event) {
	if(!fired) {
		fired = true;
		switch(event.keyCode) {
			// 'a'
			case 65: 
				player.position.x -= 1;
				break;

			// w
			case 87: 
				player.position.z -= 2;
				score++;
				scoreHtml.html("Score: " + score);

				carCollision();
				winCondition();
				break;

			// d
			case 68:
				player.position.x += 1;
				break;
		}
	}
}

function onKeyUp(event) {
    fired = false;
}
