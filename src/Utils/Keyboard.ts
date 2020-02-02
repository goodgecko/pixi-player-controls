export interface Key{
    keyID:string;
    isDown:boolean;
    isUp:boolean;
    press:any;
    release:any;
} 

export class Keyboard{

    private keyList:Key[] = [];
    
    /**
     * small class to abstract the use of keyboard inputs
     */
    constructor(){
        this.addEventListeners()
    }


    /**
     * creates listeners for when keyboard keys are pressed and released
     */
    public addEventListeners(){
        window.addEventListener("keydown", this.downHandler.bind(this), false);
        window.addEventListener("keyup", this.upHandler.bind(this), false);
    }

    /**
     * removes event listeners
     */
    public removeEventListeners(){
        window.removeEventListener("keydown", this.downHandler);
        window.removeEventListener("keyup", this.upHandler);
    }


    /**
     * add a keyboard button to listen out for, e.g "W" or "ArrowRight"
     * @param keyID key keyID
     * @param pressed function to call on key press
     * @param released function to call on key release
     */
    public addKey(keyID:string, pressed:()=>{} = undefined, released:()=>{} = undefined ) {
        let key:Key = {
            keyID:keyID,
            isDown:false,
            isUp:true,
            press:pressed,
            release:released
        };
        
        this.keyList.push(key);

        return key;
    }

    /**
     * removes a key from the listeners
     * @param keyID the key to remove
     */
    public removeKey(keyID:Key) {
        const index: number = this.keyList.indexOf(keyID);
        if (index !== -1) {
            this.keyList.splice(index, 1);
        }
    }


    /**
     * fires when any keyboard key is pressed, it checks if the key pressed is in the list and sets the appropriate flags 
     * @param event default pixi keyboard event
     */
    private downHandler(event:KeyboardEvent) {
        for(let i:number = 0; i < this.keyList.length; i++){
            let key:Key = this.keyList[i];

            if (event.key === key.keyID) {
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
                event.preventDefault();

                break;
            }
        }
    };

    /**
     * fires when any keyboard key is released, it checks if the key pressed is in the list and sets the appropriate flags 
     * @param event default pixi keyboard event
     */
    private upHandler(event:KeyboardEvent) {
        for(let i:number = 0; i < this.keyList.length; i++){
            let key:Key = this.keyList[i];

            if (event.key === key.keyID) {
                if (key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
                event.preventDefault();
                break;
            }
        }
    };
}