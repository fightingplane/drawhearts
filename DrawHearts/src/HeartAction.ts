class HeartAction extends egret.EventDispatcher
{
    static WALK_STEP: number = 1;
    static SCALE_STEP: number = 0.01;
    private _texture: egret.Bitmap;
    private _targetPosX: number;
    private _targetPosY: number;
    private _targetScale: number;
    public constructor(heart: egret.Bitmap, targetX:number, targetY:number, targetScale:number, isAuto: boolean = true){
        super();
        this._texture = heart;
        this._targetPosX = targetX;
        this._targetPosY = targetY;
        this._targetScale = targetScale;
        if (isAuto)
            this.startDrift();
    }

    private startDrift(): void{
        this._texture.addEventListener(egret.Event.ENTER_FRAME, this.moveOneStep, this);
    }

    private moveOneStep(): void
    {
        if (this._texture.x < this._targetPosX){
            this._texture.x += HeartAction.WALK_STEP;
            if (this._texture.x > this._targetPosX)
                this._texture.x = this._targetPosX;
        } else if (this._texture.x > this._targetPosX){
            this._texture.x -= HeartAction.WALK_STEP;
            if (this._texture.x < this._targetPosX)
                this._texture.x = this._targetPosX;
        }

        if (this._texture.y < this._targetPosY)
        {
            this._texture.y += HeartAction.WALK_STEP;
            if (this._texture.y > this._targetPosY)
                this._texture.y = this._targetPosY;
        } else if (this._texture.y > this._targetPosY)
        {
            this._texture.y -= HeartAction.WALK_STEP;
            if (this._texture.y < this._targetPosY)
                this._texture.y = this._targetPosY;
        }

        if (this._texture.scaleX < this._targetScale){
            this._texture.scaleX += HeartAction.SCALE_STEP;
            if (this._texture.scaleX > this._targetScale)
                this._texture.scaleX = this._targetScale;

            this._texture.scaleY = this._texture.scaleX; 
        } else if(this._texture.scaleX > this._targetScale){
            this._texture.scaleX -= HeartAction.SCALE_STEP;
            if (this._texture.scaleX < this._targetScale)
                this._texture.scaleX = this._targetScale;

            this._texture.scaleY = this._texture.scaleX;
        }

        if (this._texture.x == this._targetPosX &&
            this._texture.y == this._targetPosY)
        {
            this._texture.removeEventListener(egret.Event.ENTER_FRAME, this.moveOneStep, this);
            this.onMoveOutofScreen();
        }
    }

    private onMoveOutofScreen(): void{
        var moveFinishedEvent: HeartActionFinished = new HeartActionFinished(HeartActionFinished.HEART_ACTION_DONE);
        moveFinishedEvent.m_target = this._texture;
        this.dispatchEvent(moveFinishedEvent);
    }
}
