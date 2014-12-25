class RestartGameEvent extends egret.Event
{
    public static RESTART_GAME_EVENT: string = "RESTART_GAME_EVENT";
    public constructor(type: string, bubbles: boolean= false, cancelable: boolean= false) {
        super(type, bubbles, cancelable);
    }
}

class ResultPanel extends egret.gui.Group
{
    private panel: egret.gui.Panel;
    private m_score: number = 0;
    private m_bestScore: number = 0;
    public constructor(score:number, bestScore:number)
    {
        super();
        this.m_score = score;
        this.m_bestScore = bestScore;
    }

    public createChildren(): void
    {
        super.createChildren();
        this.panel = new egret.gui.Panel();
        this.panel.title = "游戏结果";
        this.panel.width = 400;
        this.panel.height = 400;

        var scoreLabel: egret.gui.Label = new egret.gui.Label();
        this.panel.addElement(scoreLabel);
        scoreLabel.anchorX = 0.5;
        scoreLabel.anchorY = 0.5;
        scoreLabel.x = this.panel.width * 0.5;
        scoreLabel.y = this.panel.height * 0.3;
        scoreLabel.text = "恭喜您获得" + String(this.m_score) + "个心";
        scoreLabel.size = 20;
        scoreLabel.textColor = 0x000000;//black

        var winTip: egret.gui.Label = new egret.gui.Label();
        this.panel.addElement(winTip);
        winTip.anchorX = 0.5;
        winTip.anchorY = 0.5;
        winTip.x = this.panel.width * 0.5;
        winTip.y = this.panel.height * 0.4;
        winTip.text = "秀战绩, 获得门票的概率翻倍哦";
        winTip.size = 20;
        winTip.textColor = 0x000000;//black

        var winTip: egret.gui.Label = new egret.gui.Label();
        this.panel.addElement(winTip);
        winTip.anchorX = 0.5;
        winTip.anchorY = 0.5;
        winTip.x = this.panel.width * 0.5;
        winTip.y = this.panel.height * 0.5;
        winTip.text = "点击右上角菜单, 赶快分享游戏呼叫小伙伴~~";
        winTip.size = 20;
        winTip.textColor = 0x000000;//black

        var shareBtn: egret.gui.Button = new egret.gui.Button();
        shareBtn.label = "秀战绩";
        shareBtn.anchorX = shareBtn.anchorY = 0.5;
        shareBtn.x = this.panel.width * 0.3;
        shareBtn.y = this.panel.height * 0.75;
        shareBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShareEvent, this);

        var tryAgainBtn: egret.gui.Button = new egret.gui.Button();
        tryAgainBtn.label = "再来一次";
        tryAgainBtn.anchorX = tryAgainBtn.anchorY = 0.5;
        tryAgainBtn.x = this.panel.width * 0.7;
        tryAgainBtn.y = this.panel.height * 0.75;
        tryAgainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTryAgainEvent, this);

        this.panel.addElement(shareBtn);
        this.panel.addElement(tryAgainBtn);
        //this.panel.layout
        egret.gui.PopUpManager.addPopUp(this.panel, true, true);
    }

    private onShareEvent(evt: egret.TouchEvent): void
    {
        egret.Logger.info("On share button touched");
        var redirectUrl: string = "http://club.ixibo.cn/club/gyh/start.htm?score=" + String(this.m_bestScore);
        window.location.replace(redirectUrl);
    }

    private onTryAgainEvent(evt: egret.TouchEvent):void
    {
        egret.Logger.info("On Try again touched");
        egret.gui.PopUpManager.removePopUp(this.panel);
        var startEvt : RestartGameEvent = new RestartGameEvent(RestartGameEvent.RESTART_GAME_EVENT);
        this.dispatchEvent(startEvt);
    }
}
