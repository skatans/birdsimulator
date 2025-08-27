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
    width: 800,
    height: 600,
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
    hyttyBlock = this.physics.add.staticGroup();
    hyttyBlock.create(80, 520).setScale(5).refreshBody();
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 580, 'ground').setScale(2).refreshBody();
    this.add.tileSprite(400, 550, 850, 64, 'grassLight');

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'birb');
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    this.add.tileSprite(400, 565, 800, 64, 'grass');

    // The mosquito and its settings
    hytty = this.physics.add.sprite(200, 150, 'hytty');
    hytty.allowGravity = false;
    hytty.setBounce(1);
    hytty.setCollideWorldBounds(true);
    hytty.setVelocity(Phaser.Math.Between(-200, 200), 200);

    // babbe birb
    babbe = this.physics.add.sprite(46, 520, 'babbe', 0);
    babbe.setCollideWorldBounds(true);

    this.add.tileSprite(400, 580, 800, 64, 'grassDark');

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

        // Mouse click triggers fly
    this.input.on('pointerdown', function (pointer) {
        // Store click coordinates for direction
        window.pointerClicked = true;
        window.pointerClickX = pointer.x;
        window.pointerClickY = pointer.y;
    });

    //  Texts on canvas
    titleText = this.add.text(16, 16, 'Bird Parent Simulator', { fontSize: '32px', fill: '#000' });
    scoreText = this.add.text(16, 575, 'Hyttys: 0', { fontSize: '16px', fill: '#fff' });
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