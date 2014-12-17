class CloudAction extends egret.EventDispatcher {

    private _texture: egret.Bitmap;
    private _walkStep: number;

    public constructor(cloud:egret.Bitmap, walkStep:number, isAuto:boolean)
    {
        super();
        this._texture = cloud;
        this._walkStep = walkStep;
        if (isAuto) {
            this.startDrift();
        }
    }

    private startDrift(): void
    {
        this._texture.addEventListener(egret.Event.ENTER_FRAME, this.moveOneStep, this);
    }

    private moveOneStep(): void {
        this._texture.x += this._walkStep;
        var winSize = egret.StageDelegate.getInstance()._stageWidth;
        if (this._texture.x > winSize)
        {
            this._texture.removeEventListener(egret.Event.ENTER_FRAME, this.moveOneStep, this);
            this.onMoveOutofScreen();
        }
    }

    private onMoveOutofScreen(): void
    {
        var moveFinishedEvent: CloudMoveFinished = new CloudMoveFinished(CloudMoveFinished.CLOUD_MOVE_DONE);
        moveFinishedEvent.m_target = this._texture;
        this.dispatchEvent(moveFinishedEvent);
        //this.dispatchEventWith(moveFinishedEvent, false, this._texture);
        //this._texture = null;
    }
}
