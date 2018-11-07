    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent:'main-scene',
        scene: {
            preload: preload,
            create: create
        }
    };

    var game = new Phaser.Game(config);

    var scene;

    function preload ()
    {
       this.load.image("hands", "/img/hand.jpg");
    }

    function create ()
    {
       this.add.image(400, 300, 'hands');
       this.add.image(0,0, 'hands');
       console.log(this);

       scene = this;
    }