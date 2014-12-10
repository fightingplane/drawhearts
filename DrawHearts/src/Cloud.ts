class Cloud extends egret.EventDispatcher {

    private _texture: egret.Bitmap;

    public constructor(spriteName:string, isAuto:boolean=true)
    {
        super();
        this._texture = RES.getRes(spriteName);
        if (isAuto) {
            this.startDrift();
        }
    }

    public startDrift(): void
    {
        this._texture.addEventListener(egret.Event.ENTER_FRAME, this.moveOneStep, this);
    }

    private moveOneStep(): void {
        this._texture.x += 1;
        var winSize = egret.StageDelegate.getInstance()._stageWidth;
        if (this._texture.x > winSize)
        {
            this._texture.removeEventListener(egret.Event.ENTER_FRAME, this.moveOneStep, this);
            this.onMoveOutofScreen();
        }
    }

    private onMoveOutofScreen(): void
    {
        this.dispatchEventWith(egret.Event.COMPLETE, false, this._texture);
        this._texture = null;
    }
}
