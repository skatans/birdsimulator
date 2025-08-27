var hyttyMovement;

function hyttyBusiness()
{
    hytty.anims.play('inin', true);
    hyttyMovement = Math.random();

    if (hyttyMovement > 0.7)
    {
        hytty.setVelocityY(Math.random()*(-200)+80);
        if (hyttyMovement > 0.9)
        {
            hytty.setVelocityX(Math.random()*1200-600);
            hytty.setVelocityY(Math.random()*(-300)+90);
        }
    }

    if (hytty.body.touching.down)
    {
        hytty.setVelocityY(Math.random()*(-300));
    }
}

function getHytty(player, hytty)
{
    if (!hasHytty)
    {
        console.log(hasHytty);
        hasHytty = true;
        player.anims.play('hyttyflap')
        console.log(hasHytty);
        hytty.visible = false;
        hyttyCollider.active = false;
    }
}

function feedBabbe()
{
    if (hasHytty)
    {
        player.anims.play('flap');
        babbe.anims.play('eating');
        babbeHunger = 0;
        score += 1;
        scoreText.setText('Hyttys: ' + score);
        
        // Make baby bird grow after eating animation completes
        babbe.on('animationcomplete', function(anim) {
            if (anim.key === 'eating') {
                babbeGrowth += 0.1; // Grow by 10% each feeding
                babbe.setScale(babbeGrowth);
                babbe.off('animationcomplete'); // Remove listener to avoid multiple triggers
            }
        });
        
        freeHytty();
    }
}

function freeHytty()
{
    hasHytty = false;
    hytty.visible = true;
    hyttyCollider.active = true;
}

function babbeBusiness()
{
    if (babbeHunger++ > 100)
    {
        babbe.anims.play('hungry', true);
    }
}