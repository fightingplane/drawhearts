class MoonFadeAction extends egret.EventDispatcher {

    private _texture: egret.Bitmap;
    private _walkStep: number;
    private _fading: boolean = false;
    public constructor(cloud: egret.Bitmap, walkStep: number, isAuto: boolean) {
        super();
        this._texture = cloud;
        this._walkStep = walkStep;
        if (isAuto) {
            this.startFade();
        }
    }

    private startFade(): void {
        this._texture.alpha = 0;
        this._fading = false;
        var timer: egret.Timer = new egret.Timer(40, 50);
        timer.addEventListener(egret.TimerEvent.TIMER, this.onTimerEvent, this);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimeUp, this);
        timer.start();

       // this._texture.addEventListener(egret.Event.ENTER_FRAME, this.show, this);      
    }

    private onTimerEvent(evt: egret.TimerEvent): void
    {
        if (!this._fading)
{
            this._texture.alpha += this._walkStep;

            if (this._texture.alpha >= 1)
            {
                this._fading = true;
            }
        } else
        {
            this._texture.alpha -= this._walkStep;
        }
    }

    private onTimeUp(evt: egret.TimerEvent): void
    {
        this.onActionDone();
    }

    private show(): void
    {
        this._texture.alpha += this._walkStep;

        if (this._texture.alpha >= 1)
        {
            this._texture.removeEventListener(egret.Event.ENTER_FRAME, this.show, this);
            this._texture.addEventListener(egret.Event.ENTER_FRAME, this.fade, this);
        }
    }

    private fade(): void {

        this._texture.alpha -= this._walkStep;
        
        if (this._texture.alpha <= 0)
        {
            this._texture.removeEventListener(egret.Event.ENTER_FRAME, this.fade, this);
            this.onActionDone();
        }
    }

    private onActionDone(): void
    {
        var fadeFinishedEvent: MoonFadeFinishEvent = new MoonFadeFinishEvent(MoonFadeFinishEvent.MOON_FADE_FINISH);
        fadeFinishedEvent.m_target = this._texture;
        this.dispatchEvent(fadeFinishedEvent);
        //this.dispatchEventWith(moveFinishedEvent, false, this._texture);
        //this._texture = null;
    }
}
