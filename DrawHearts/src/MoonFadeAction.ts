class MoonFadeAction extends egret.EventDispatcher {

    private _texture: egret.Bitmap;
    private _walkStep: number;

    public constructor(cloud: egret.Bitmap, walkStep: number, isAuto: boolean) {
        super();
        this._texture = cloud;
        this._walkStep = walkStep;
        if (isAuto) {
            this.startFade();
        }
    }

    private startFade(): void {
        this._texture.addEventListener(egret.Event.ENTER_FRAME, this.fade, this);
    }

    private fade(): void {
        this._texture.alpha -= this._walkStep;
        
        if (this._texture.alpha <= 0) {
            this._texture.removeEventListener(egret.Event.ENTER_FRAME, this.fade, this);
            this.onFaded();
        }
    }

    private onFaded(): void {
        var fadeFinishedEvent: MoonFadeFinishEvent = new MoonFadeFinishEvent(MoonFadeFinishEvent.MOON_FADE_FINISH);
        fadeFinishedEvent.m_target = this._texture;
        this.dispatchEvent(fadeFinishedEvent);
        //this.dispatchEventWith(moveFinishedEvent, false, this._texture);
        //this._texture = null;
    }
}
