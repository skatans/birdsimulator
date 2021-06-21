// birb states

function fly()
{
    if (player.body.blocked.down)
    {
        player.setVelocityX(0);
        return idle;
    }
    if (Phaser.Input.Keyboard.JustDown(spaceBar))
    {   
        console.log("Flapping in air"); 
        flapWings(hasHytty);
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
    if (Phaser.Input.Keyboard.JustDown(spaceBar))
    {
        console.log("Transitioning to fly");
        flapWings(hasHytty);
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

    if (Phaser.Input.Keyboard.JustDown(spaceBar))
    {
        console.log("Transitioning to fly");
        flapWings(hasHytty);
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