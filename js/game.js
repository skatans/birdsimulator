var player;
var hasHytty = false;
var babbeHunger = 100;
var birbState = idle;
var platforms;
var cursors;
var spaceBar;
var score = 0;
var gameOver = false;
var scoreText;

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Handle window resize
window.addEventListener('resize', function() {
    if (game && game.scale) {
        game.scale.resize(window.innerWidth, window.innerHeight);
    }
});


function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('grass', 'assets/nurtsi.png');
    this.load.image('grassLight', 'assets/nurtsiLight.png');
    this.load.image('grassDark', 'assets/nurtsiDark.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('birb', 'assets/birb_64.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('hyttybirb', 'assets/hyttybirb_64.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('babbe', 'assets/baby_32.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('hytty', 'assets/hytty_32.png', { frameWidth: 32, frameHeight: 32 });
    this.load.animation('anims', 'assets/anims.json');
}

function create ()
{
    var width = this.sys.game.config.width;
    var height = this.sys.game.config.height;
    
    hyttyBlock = this.physics.add.staticGroup();
    hyttyBlock.create(80, height - 80).setScale(5).refreshBody();
    
    // Scale sky to fill the viewport
    var sky = this.add.image(width / 2, height / 2, 'sky');
    sky.setDisplaySize(width, height);

    platforms = this.physics.add.staticGroup();
    platforms.create(width / 2, height - 20, 'ground').setScale(width / 400, 1).refreshBody();
    this.add.tileSprite(width / 2, height - 50, width, 64, 'grassLight');

    // The player and its settings
    player = this.physics.add.sprite(100, height - 150, 'birb');
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    this.add.tileSprite(width / 2, height - 35, width, 64, 'grass');

    // The mosquito and its settings
    hytty = this.physics.add.sprite(200, 150, 'hytty');
    hytty.allowGravity = false;
    hytty.setBounce(1);
    hytty.setCollideWorldBounds(true);
    hytty.setVelocity(Phaser.Math.Between(-200, 200), 200);

    // babbe birb
    babbe = this.physics.add.sprite(46, height - 80, 'babbe', 0);
    babbe.setCollideWorldBounds(true);

    this.add.tileSprite(width / 2, height - 20, width, 64, 'grassDark');

    //  Colliders
    this.physics.add.collider(babbe, platforms);
    this.physics.add.collider(hytty, platforms);
    this.physics.add.collider(hytty, hyttyBlock);
    this.physics.add.collider(player, platforms);

    hyttyCollider = this.physics.add.collider(player, hytty, getHytty, null, this);
    babbeCollider = this.physics.add.collider(player, babbe, feedBabbe, null, this);

    hyttyCollider.overlapOnly = true;
    babbeCollider.overlapOnly = true;

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Mouse input for movement and flying
    this.input.on('pointerdown', function (pointer) {
        // Calculate direction from bird to click position
        var dx = pointer.x - player.x;
        window.mouseDirection = dx > 0 ? 'right' : 'left';
        window.mousePressed = true;
        window.mouseDownTime = Date.now(); // Record when mouse was pressed
        window.pointerClicked = false; // Don't trigger immediate fly
    });

    this.input.on('pointerup', function (pointer) {
        // Only trigger fly if mouse was held down for less than 200 milliseconds
        var holdDuration = Date.now() - window.mouseDownTime;
        if (holdDuration < 200) {
            window.pointerClicked = true;
            window.pointerClickX = pointer.x;
            window.pointerClickY = pointer.y;
        }
        window.mousePressed = false;
        window.mouseDirection = null;
        window.mouseDownTime = null;
    });

    //  Texts on canvas
    titleText = this.add.text(16, 16, 'Bird Parent Simulator', { fontSize: '32px', fill: '#000' });
    scoreText = this.add.text(16, height - 25, 'Hyttys: 0', { fontSize: '16px', fill: '#fff' });
}

function update ()
{
    birbState = birbState(hasHytty);

    hyttyBusiness();
    babbeBusiness();

    if (gameOver)
    {
        return;
    }
}