import { Application, Container, Texture, Sprite, Point } from 'pixi.js'
import { PlayerMovementControl } from './PlayerMovementControl';

export class GameScreen {

    private mapWidth:number;
    private mapHeight:number;

    private mapContainer:PIXI.Container;
    private playerContainer:PIXI.Container;

    private playerMoveController:PlayerMovementControl;

    private player:PIXI.Sprite;

    /**
     * main game class, creates two maps and two players then starts the gameLoop
     * @param app pixi application
     */
    constructor(private app:Application){
        //make the map larger than the screen otherwiise you will not see the fancy screen tracing
        this.mapWidth = app.screen.width * 2.5;
        this.mapHeight = app.screen.height * 2.5;

        //create maps for player
        this.mapContainer = this.createMap();
        this.app.stage.addChild(this.mapContainer);
        
        //create player sprites and add them to their player container
        this.playerContainer = this.createPlayer();
        this.app.stage.addChild(this.playerContainer);

        let demoKeys:PIXI.Sprite = this.createDemoKeys();
        this.playerMoveController = new PlayerMovementControl(this.app, this.player, new PIXI.Rectangle(0,0,this.mapWidth, this.mapHeight), ["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"], demoKeys);

        app.ticker.add(delta => this.gameLoop(delta));

        window.addEventListener('resize', this.resize.bind(this));
        this.resize();
    }


    /**
     * creates the map, adds a simple sprite to a container.
     */
    private createMap():PIXI.Container{
        let mapContainer:PIXI.Container = new Container();

        let mapBG:PIXI.Sprite = new PIXI.Sprite(Texture.from("field"));
        mapBG.width = this.mapWidth;
        mapBG.height = this.mapHeight;
        mapContainer.addChild(mapBG);

        //ADD MORE MAP ITEMS HERE

        return mapContainer;
    }


    /**
     * creates the player, adds a simple sprite to a container and adds it the the center of the screen
     */
    private createPlayer():PIXI.Container{
        let playerContainer:PIXI.Container = new Container();

        this.player = new PIXI.Sprite(Texture.from("player1"));
        this.player.anchor.set(.5, .5);
        this.player.x = this.app.screen.width * .45;
        this.player.y = this.app.screen.height * .5;
        playerContainer.addChild(this.player);

        return playerContainer;
    }


    private createDemoKeys():PIXI.Sprite{
        let playerArrow:PIXI.Sprite = new PIXI.Sprite(Texture.from("playerArrow"));
        playerArrow.width = this.app.screen.width * .2;
        playerArrow.scale.y = playerArrow.scale.x;
        playerArrow.x = 20;
        playerArrow.y = this.app.screen.height - playerArrow.height - 20;
        this.app.stage.addChild(playerArrow);

        return playerArrow;
    }

    
    private gameLoop(delta:number){
        //update the player movement 
        this.playerMoveController.gameLoop(delta);

        //find each players position relative to their map, then find the center point between both players
        let playerLocal:PIXI.Point = this.playerMoveController.getPlayerPosition();

        let screenCenter:PIXI.Point = new PIXI.Point(this.app.screen.width * .5, this.app.screen.height * .5);        
        
        //the maps are anchored to the top left
        //so minus playerCenter would put the playerCenter in the top left of screen + half the screen width / height to focues the playerCenter in the center of the screen
        let newMapPos:PIXI.Point = new Point(-playerLocal.x + screenCenter.x, -playerLocal.y + screenCenter.y);
        
        //this is a quick check to make sure the final map positions don't reveal the edge of the map
        //it just checks the calculated map positions witht he screen boundary
        if(newMapPos.x < -this.mapWidth+this.app.screen.width){
            newMapPos.x = -this.mapWidth+this.app.screen.width;
        }
        if(newMapPos.x > 0){
            newMapPos.x = 0;
        }
        if(newMapPos.y < -this.mapHeight+this.app.screen.height){
            newMapPos.y = -this.mapHeight+this.app.screen.height;
        }
        if(newMapPos.y > 0){
            newMapPos.y = 0;
        }

        //and apply the calculated map positions to the map and player containers 
        this.mapContainer.x = newMapPos.x;
        this.mapContainer.y = newMapPos.y;
        this.playerContainer.x = newMapPos.x;
        this.playerContainer.y = newMapPos.y;
    }

    // Resize function window
    private resize() {
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
    }
}