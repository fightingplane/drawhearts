/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

class Main extends egret.DisplayObjectContainer{

    private loadingView:LoadingUI;
    private bgSound: egret.Sound;
    private m_score: number = 0;
    private m_scoreLabel: egret.TextField = null;
    private m_bestScore: number = 0;
    private m_bestScoreLabel: egret.TextField = null;
    private b_soundStarted: boolean;
    private m_drawLayer: DrawLayer = null;
    static ROUND_TIME : number = 10;//30;
    private m_timeLeft :number = 0;
    private m_timeLeftLabel :egret.TextField = null;
    private m_startBtn: egret.gui.Button = null;
    private m_currentMoon: egret.Bitmap = null;
    private m_uiStage:egret.gui.UIStage = null;
    public constructor()
    {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
    }

    private onAddToStage(event: egret.Event)
    {
        egret.Injector.mapClass("egret.gui.IAssetAdapter", AssetAdapter);
        egret.gui.Theme.load("resource/theme.thm");

        //设置加载进度界面
        this.loadingView  = new LoadingUI();
        this.stage.addChild(this.loadingView);
        this.stage.addEventListener(egret.Event.ACTIVATE, this.onBackFromBackground, this);
        this.stage.addEventListener(egret.Event.DEACTIVATE, this.onEnterIntoBackground, this);
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.loadConfig("resource/resource.json","resource/");
        RES.loadConfig("resource/theme_resource.json", "resource/");
    }

    private onTouchTap(event: egret.TouchEvent): void
    {
        console.log("touch tap");
        if (!this.b_soundStarted)
        {
            this.bgSound = RES.getRes("bgSound");
            if (this.bgSound)
            {
                this.bgSound.play();
                this.bgSound.addEventListener("ended", this.rePlay.bind(this));
                this.b_soundStarted = true;
            }
        }
    }
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    private onConfigComplete(event:RES.ResourceEvent):void{
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        RES.loadGroup("preload", 1);
        RES.loadGroup("theme_preload", 1);
        RES.loadGroup("soundload", 0);
    }
    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "soundload")
        {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    }

    private rePlay(): void
    {
        this.bgSound.load();
        this.bgSound.play();
    }
    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.loadingView.setProgress(event.itemsLoaded,event.itemsTotal);
        }
    }

    private m_tipTextContainer: egret.Sprite;
    private m_titleTextContainer: egret.Sprite;
    /**
     * 创建游戏场景
     */
    private createGameScene():void{

        var sky:egret.Bitmap = this.createBitmapByName("bgImage");
        this.addChild(sky);
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        var titleTextContainer: egret.Sprite = new egret.Sprite();
        titleTextContainer.anchorX = titleTextContainer.anchorY = 0.5;
        this.addChild(titleTextContainer);
        titleTextContainer.x = stageW / 2;
        titleTextContainer.y = stageH * 0.05;
        titleTextContainer.alpha = 0;
        this.m_titleTextContainer = titleTextContainer;

        var textContainer:egret.Sprite = new egret.Sprite();
        textContainer.anchorX = textContainer.anchorY = 0.5;
        this.addChild(textContainer);
        textContainer.x = stageW / 2;
        textContainer.y = stageH * 0.9;
        textContainer.alpha = 0;

        this.m_tipTextContainer = textContainer;

        this.m_uiStage = new egret.gui.UIStage;
        this.addChild(this.m_uiStage);
        //create three clouds
        this.createOneCloud();
        this.createOneCloud();
        this.createOneCloud();

        this.createRandomMoon();

        //Time left label
        var counterLabel: egret.TextField = new egret.TextField();
        this.addChildAt(counterLabel, 6);
        counterLabel.anchorX = 0;
        counterLabel.anchorY = 0.5;
        counterLabel.x = stageW * 0.08;
        counterLabel.y = stageH * 0.1;
        counterLabel.text = "倒计时: ";
        counterLabel.size = 20;

        var counterValueLabel: egret.TextField = new egret.TextField();
        this.addChildAt(counterValueLabel, 6);
        counterValueLabel.anchorX = 0;
        counterValueLabel.anchorY = 0.5;
        counterValueLabel.x = counterLabel.x + counterLabel.width;
        counterValueLabel.y = counterLabel.y;
        counterValueLabel.text = "0";
        counterValueLabel.size = 20;
        this.m_timeLeftLabel = counterValueLabel;

        //high score 
        var highScoreHeart: egret.Bitmap = this.createBitmapByName("heartImage");
        this.addChildAt(highScoreHeart, 6);
        highScoreHeart.scaleX = highScoreHeart.scaleY = 0.5;
        highScoreHeart.anchorX = highScoreHeart.anchorY = 0.5;
        highScoreHeart.x = stageW * 0.85;
        highScoreHeart.y = stageH * 0.1;

        var highScoreLabel: egret.TextField = new egret.TextField();
        this.addChildAt(highScoreLabel, 6);
        highScoreLabel.anchorX = 1;
        highScoreLabel.anchorY = 0.5;
        highScoreLabel.x = highScoreHeart.x - highScoreHeart.width * 0.25;
        highScoreLabel.y = highScoreHeart.y;
        highScoreLabel.text = "最高分";
        highScoreLabel.size = 20;

        var xLabel1: egret.TextField = new egret.TextField();
        this.addChildAt(xLabel1, 6);
        xLabel1.anchorX = 0;
        xLabel1.anchorY = 0.5;
        xLabel1.x = highScoreHeart.x + highScoreHeart.width * 0.25;
        xLabel1.y = highScoreHeart.y;
        xLabel1.text = "X";
        xLabel1.size = 10;

        var highScore: egret.TextField = new egret.TextField();
        this.addChildAt(highScore, 6);
        highScore.anchorX = 0;
        highScore.anchorY = 0.5;
        highScore.x = xLabel1.x + xLabel1.width * 1.2;
        highScore.y = xLabel1.y;
        this.m_bestScoreLabel = highScore;
        highScore.text = String(this.bestScore);
        highScore.size = 20;

        //current score
        var scoreHeart: egret.Bitmap = this.createBitmapByName("heartImage");
        this.addChildAt(scoreHeart, 6);
        scoreHeart.scaleX = scoreHeart.scaleY = 0.5;
        scoreHeart.anchorX = scoreHeart.anchorY = 0.5;
        scoreHeart.x = stageW * 0.85;
        scoreHeart.y = stageH * 0.15;

        var scoreLabel: egret.TextField = new egret.TextField();
        this.addChildAt(scoreLabel, 6);
        scoreLabel.anchorX = 1;
        scoreLabel.anchorY = 0.5;
        scoreLabel.x = scoreHeart.x - scoreHeart.width * 0.25;
        scoreLabel.y = scoreHeart.y;
        scoreLabel.text = "得分";
        scoreLabel.size = 20;

        var xLabel2: egret.TextField = new egret.TextField();
        this.addChildAt(xLabel2, 6);
        xLabel2.anchorX = 0;
        xLabel2.anchorY = 0.5;
        xLabel2.x = scoreHeart.x + scoreHeart.width * 0.25;
        xLabel2.y = scoreHeart.y;
        xLabel2.text = "X";
        xLabel2.size = 10;

        var score: egret.TextField = new egret.TextField();
        this.addChildAt(score, 6);
        score.anchorX = 0;
        score.anchorY = 0.5;
        score.x = xLabel2.x + xLabel2.width * 1.2;
        score.y = xLabel2.y;
        this.m_scoreLabel = score;
        score.text = "0";
        score.size = 20;

        this.m_drawLayer = new DrawLayer();
        this.m_drawLayer.width = stageW;
        this.m_drawLayer.height = stageH;
        this.m_drawLayer.anchorX = this.m_drawLayer.anchorY = 0.5;
        this.m_drawLayer.x = stageW / 2;
        this.m_drawLayer.y = stageH / 2;
        this.addChildAt(this.m_drawLayer, 7);
        this.m_drawLayer.touchEnabled = false;

        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        RES.getResAsync("description", this.startAnimation, this);
        this.touchEnabled = true;
        //create start game button
        var btn:egret.gui.Button = new egret.gui.Button();
        btn.label = "开始游戏";
        btn.anchorX = btn.anchorY = 0.5
        btn.x = stageW * 0.5;
        btn.y = stageH * 0.75;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartBtnTouched, this);
        this.m_startBtn = btn;
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    /**
     * 描述文件加载成功，开始播放动画
     */
    private startAnimation(result: Array<any>): void
    {
        var titleTextContainer: egret.Sprite = this.m_titleTextContainer;
        var tipTextContainer: egret.Sprite = this.m_tipTextContainer;
        var count:number = result.length;

        var titleStr = result[0];
        this.changeDescription(titleTextContainer, titleStr, 30, true);        
        titleTextContainer.alpha = 1;

        var tipStr = result[1];//Fixed
        this.changeDescription(tipTextContainer, tipStr);
        tipTextContainer.alpha = 1;//show the text
    }
    /**
     * 切换描述内容
     */
    private changeDescription(textContainer:egret.Sprite, lineArr:Array<any>, fontSize :number = 20, bBold:boolean = false):void {
        textContainer.removeChildren();
        var w:number = 0;
        for (var i:number = 0; i < lineArr.length; i++) {
            var info:any = lineArr[i];
            var colorLabel:egret.TextField = new egret.TextField();
            colorLabel.x = w;
            colorLabel.anchorX = colorLabel.anchorY = 0;
            colorLabel.textColor = parseInt(info["textColor"]);
            colorLabel.text = info["text"];
            colorLabel.bold = bBold;
            colorLabel.size = fontSize;
            textContainer.addChild(colorLabel);

            w += colorLabel.width;
        }
    }

    private createOneCloud(): void
    {
        var stageW: number = this.stage.stageWidth;
        var stageH: number = this.stage.stageHeight;

        var cloud: egret.Bitmap = this.createBitmapByName("cloudImage");
        cloud.anchorX = cloud.anchorY = 0.5;
        cloud.x = -cloud.width / 2;
        cloud.y = this.getRandomNum(stageH * 0.1, stageH * 0.7);
        this.addChildAt(cloud, 2);

        var moveStep = this.getRandomNum(0.5);
        var action: CloudAction = new CloudAction(cloud, moveStep, true);
        action.addEventListener(CloudMoveFinished.CLOUD_MOVE_DONE, this.onCloudOutOfWindow, this);
    }

    private onCloudOutOfWindow(event: CloudMoveFinished): void
    {
        //an cloud is out of window, remove it and create a new one
        var action = <CloudAction>event.target;
        if (action)
            action.removeEventListener(CloudMoveFinished.CLOUD_MOVE_DONE, this.onCloudOutOfWindow, this);
        if(event.m_target)
            this.removeChild(event.m_target);
        this.createOneCloud();
    }

    private createRandomMoon(): void
    {
        var stageW: number = this.stage.stageWidth;
        var stageH: number = this.stage.stageHeight;

        var moon: egret.Bitmap = this.createBitmapByName("moonImage");
        moon.anchorX = moon.anchorY = 0.5;
        moon.x = this.getRandomNum(stageW * 0.4, stageW * 0.8);
        moon.y = this.getRandomNum(stageH * 0.15, stageH * 0.4);
        this.addChildAt(moon, 5);
        this.m_currentMoon = moon;
        var moonAction = new MoonFadeAction(moon, 0.01, true);
        moonAction.addEventListener(MoonFadeFinishEvent.MOON_FADE_FINISH, this.onMoonFaded, this);
    }

    private onMoonFaded(event: MoonFadeFinishEvent): void
    {
        var action = <MoonFadeAction>event.target;
        if (action)
            action.removeEventListener(MoonFadeFinishEvent.MOON_FADE_FINISH, this.onMoonFaded, this);
        
        //check if scored and re-create moon
        var positionXList: Array<number> = this.m_drawLayer.positionXList;
        var positionYList: Array<number> = this.m_drawLayer.positionYList;
        this.checkScore(event.m_target, positionXList, positionYList);

        if (event.m_target != null)
            this.removeChild(event.m_target);
        this.m_drawLayer.clearTouchPoints(); 

        this.createRandomMoon();
    }

    private getRandomNum(min: number = 0, max: number = 1): number
    {
        var ret: number = Math.random() * (max - min) + min;
        return ret;
    }

    private checkScore(target: egret.Bitmap, positionX: Array<number>, positionY: Array<number>): void
    {
        if (positionX == null || positionY == null)
            return;
        if (positionX.length <= 3 || positionY.length <= 3)
            return;

        var minX: number = 0;
        var maxX: number = 0;
        var minY: number = 0;
        var maxY: number = 0;

        minX = maxX = positionX[0];
        minY = maxY = positionY[0];

        for (var i = 0; i < positionX.length; i++)
        {
            minX = Math.min(minX, positionX[i]);
            maxX = Math.max(maxX, positionX[i]); 
        }

        for (var i = 0; i < positionY.length; i++){
            minY = Math.min(minY, positionY[i]);
            maxY = Math.max(maxY, positionY[i]);
        }

        var area: number = (maxX - minX) * (maxY - minY);
        var targetArea: number = target.width * target.height;
        
        //center
        var targetPosX:number = target.x;
        var targetPosY: number = target.y;
        var centerX = (maxX + minX) / 2;
        var centerY = (minY + maxY) / 2;

        if (Math.abs(targetArea - area) < targetArea * 0.2 &&
            Math.abs(targetPosX - centerX) < 20 &&
            Math.abs(targetPosY - centerY) < 20)
        {
            egret.Logger.info("Got one score");
            //show an heart 
            this.addOneScore(targetPosX, targetPosY);
        }
    }

    private addOneScore(posX:number, posY:number): void
    {        
        //create a heart and move to score heart
        this.m_score = this.m_score + 1;//add the score and show it later
        var heart: egret.Bitmap = this.createBitmapByName("heartImage");
        this.addChildAt(heart, 6);
        heart.anchorX = heart.anchorY = 0.5;
        heart.x = posX;
        heart.y = posY;
        //run action
        var stageW: number = this.stage.stageWidth;
        var stageH: number = this.stage.stageHeight;
        var heartAction: HeartAction = new HeartAction(heart, stageW * 0.85, stageH * 0.15, 0.5, true);
        heartAction.addEventListener(HeartActionFinished.HEART_ACTION_DONE, this.onHeartMoveDone, this);
    }

    private onHeartMoveDone(evt: HeartActionFinished): void
    {
        var action = evt.target;
        if (action)
            action.removeEventListener(HeartActionFinished.HEART_ACTION_DONE, this.onHeartMoveDone, this);

        if (evt.m_target != null)
            this.removeChild(evt.m_target);
        
        this.m_scoreLabel.text = String(this.m_score);
        if (this.m_score > this.m_bestScore){
            egret.Logger.info("new record generates");
            this.m_bestScore = this.m_score;
            this.m_bestScoreLabel.text = String(this.m_bestScore);
            this.saveBestScore();
        }
    }

    public get bestScore(): number
    {
        //ready the score from the storage
        var bestScore: string = egret.localStorage.getItem("best_score");
        this.m_bestScore = parseInt(bestScore);
        if(isNaN(this.m_bestScore)) {
            this.m_bestScore = 0;
        }
        return this.m_bestScore;
    }

    private onStartBtnTouched(event:egret.Event):void
    {
        this.m_startBtn.enabled = false;
        this.m_startBtn.visible = false;
        this.startGame();
    }

    private onStartGameEvent(evt:RestartGameEvent) :void
    {
        egret.Logger.info("Got restart game event");
        //clean up current score
        this.m_score = 0;
        this.m_scoreLabel.text = "0";
        this.m_uiStage.removeEventListener(RestartGameEvent.RESTART_GAME_EVENT, this.onStartGameEvent, this);
        this.startGame();
    }

    private startGame() :void
    {
        //start timer
        this.m_drawLayer.touchEnabled = true;
        this.m_timeLeft = Main.ROUND_TIME;
        this.m_timeLeftLabel.text = String(this.m_timeLeft);
        var timer: egret.Timer = new egret.Timer(1000, Main.ROUND_TIME);
        timer.addEventListener(egret.TimerEvent.TIMER,this.onTimerEvent,this);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.onTimeUp,this);
        timer.start();
    }

    private saveBestScore(): void
    {
        //push the score to the storage
        egret.localStorage.setItem("best_score", String(this.m_bestScore).toString());
    } 

    private gameFinished(): void
    {
        this.m_drawLayer.touchEnabled = false;
        var result: ResultPanel = new ResultPanel(this.m_score);
        this.m_uiStage.addElement(result);
        result.addEventListener(RestartGameEvent.RESTART_GAME_EVENT, this.onStartGameEvent, this)
    }

    private onEnterIntoBackground(event: egret.Event): void
    {
        if (this.bgSound)
        {
            this.bgSound.pause();
        }
    }

    private onBackFromBackground(event: egret.Event): void
    {
        if (this.bgSound)
            this.bgSound.play();
    }

    private onTimerEvent(event:egret.TimerEvent):void
    {
        //update time left label
        this.m_timeLeft -= 1;
        if(this.m_timeLeft < 0)
            this.m_timeLeft = 0;

        this.m_timeLeftLabel.text = String(this.m_timeLeft);
    }

    private onTimeUp(event:egret.TimerEvent):void
    {
        //Game Over
        this.gameFinished();
    }
}
