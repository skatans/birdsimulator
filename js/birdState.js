// birb states

function fly()
{
    if (player.body.blocked.down)
    {
        player.setVelocityX(0);
        return idle;
    }
    if (Phaser.Input.Keyboard.JustDown(spaceBar) || window.pointerClicked)
    {   
        if (window.pointerClicked && typeof window.pointerClickX === 'number') {
            // Calculate direction
            var dx = window.pointerClickX - player.x;
            var direction = dx > 0 ? 1 : -1;
            player.setVelocityX(160 * direction);
            player.flipX = direction > 0; // Face opposite direction when flying
            console.log("Flapping toward click direction and facing opposite");
        } else {
            player.setVelocityX(0);
        }
        flapWings(hasHytty);
        window.pointerClicked = false;
        window.pointerClickX = undefined;
        window.pointerClickY = undefined;
    }
    if (cursors.left.isDown)
    { 
        horizontalMovement(-160);
    }
    if (cursors.right.isDown)
    { 
        horizontalMovement(160);
    }
    return fly; 
}

function walk(hasHytty)
{
    console.log("walking");
    if (Phaser.Input.Keyboard.JustDown(spaceBar) || window.pointerClicked)
    {
        if (window.pointerClicked && typeof window.pointerClickX === 'number') {
            var dx = window.pointerClickX - player.x;
            var direction = dx > 0 ? 1 : -1;
            player.setVelocityX(160 * direction);
            player.flipX = direction > 0; // Face opposite direction when flying
            console.log("Flapping toward click direction and facing opposite");
        } else {
            player.setVelocityX(0);
        }
        flapWings(hasHytty);
        window.pointerClicked = false;
        window.pointerClickX = undefined;
        window.pointerClickY = undefined;
        return fly;
    }
    if (cursors.left.isDown)
    { 
        horizontalMovement(-160);
        return walk;
    }
    if (cursors.right.isDown)
    { 
        horizontalMovement(160);
        return walk;
    }
    hasHytty ? player.anims.play('hyttystand', true) : player.anims.play('stand', true);
    return idle;
}

function idle(hasHytty)
{
    console.log('idle');

    if (Phaser.Input.Keyboard.JustDown(spaceBar) || window.pointerClicked)
    {
        if (window.pointerClicked && typeof window.pointerClickX === 'number') {
            var dx = window.pointerClickX - player.x;
            var direction = dx > 0 ? 1 : -1;
            player.setVelocityX(160 * direction);
            player.flipX = direction > 0; // Face opposite direction when flying
            console.log("Flapping toward click direction and facing opposite");
        } else {
            player.setVelocityX(0);
        }
        flapWings(hasHytty);
        window.pointerClicked = false;
        window.pointerClickX = undefined;
        window.pointerClickY = undefined;
        return fly;
    }
    if (cursors.left.isDown || cursors.right.isDown)
    { 
        return walk;
    }

    hasHytty ? player.anims.play('hyttystand', true) : player.anims.play('stand', true);
    player.setVelocityX(0);
    return idle;
}

// movement

function horizontalMovement(velocity)
{
    player.setVelocityX(velocity);
    player.flipX = velocity + 160;
    
    if (player.body.blocked.down) 
    {
        hasHytty ? player.anims.play('hyttywalk', true) : player.anims.play('walk', true);
    }
}

function flapWings(hasHytty)
{
    player.setVelocityY(-330);
    hasHytty ? player.anims.play('hyttyflap', true) : player.anims.play('flap', true);
    return fly;
}