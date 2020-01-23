import * as PIXI from 'pixi.js';
import { LoadingScreen } from './LoadingScreen';
import { GameScreen } from './GameScreen';


export class GameBoot{
    private app:PIXI.Application;

    /**
     * entrance point into the game code
     * creates the pixi instance, starts the loading screen, on complete start the game screen
     */
    constructor(){
        this.app = new PIXI.Application({ width:window.innerWidth, height:window.innerHeight });

        document.body.appendChild(this.app.view);

        this.startLoadingScreen();
    }

    startLoadingScreen(){
        new LoadingScreen(this.app, this.startGameScreen.bind(this)); 
    }

    startGameScreen(){
        new GameScreen(this.app);
    }
}

window.onload = function () {
    new GameBoot();
}

window.PIXI = PIXI;