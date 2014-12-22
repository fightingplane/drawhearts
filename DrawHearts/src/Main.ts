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

/*class FrameFinishedEvent extends egret.Event
{
    public static FRAME_FINISHED: string = "FRAME_FINISHED";

    public constructor(type: string, bubbles: boolean= false, cancelable: boolean= false)
    {
        super(type, bubbles, cancelable);
    }
}*/

class Main extends egret.DisplayObjectContainer{

    /**
     * 加载进度界面
     */
    private loadingView:LoadingUI;
    private bgSound: egret.Sound;
    private m_score: number;
    private m_bestScore: number;
    private b_soundStarted: boolean;
    private m_drawLayer: DrawLayer = null;

    public constructor()
    {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        //var timer: egret.Timer = new egret.Timer(10, Number.POSITIVE_INFINITY);
        //this.addEventListener(FrameFinishedEvent.FRAME_FINISHED, this.redraw, this);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
    }

    private onAddToStage(event: egret.Event)
    {
        //this.m_h5Rendder = <egret.HTML5CanvasRenderer>egret.MainContext.instance.rendererContext;  
        /*this.m_h5Rendder.onRenderFinish = function (): void
        {
            var frameFinished: FrameFinishedEvent = new FrameFinishedEvent(FrameFinishedEvent.FRAME_FINISHED);
            egret.MainContext.instance.dispatchEvent(frameFinished);
        }*/ 
        
        //设置加载进度界面
        this.loadingView  = new LoadingUI();
        this.stage.addChild(this.loadingView);
        this.stage.addEventListener(egret.Event.ACTIVATE, this.onBackFromBackground, this);
        this.stage.addEventListener(egret.Event.DEACTIVATE, this.onEnterIntoBackground, this);
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.loadConfig("resource/resource.json","resource/");
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

        var topMask:egret.Shape = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, stageH);
        topMask.graphics.endFill();
        topMask.width = stageW;
        topMask.height = stageH;
        this.addChild(topMask);

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

        //create three clouds
        this.createOneCloud();
        this.createOneCloud();
        this.createOneCloud();

        this.createRandomMoon();

        this.m_drawLayer = new DrawLayer();
        this.m_drawLayer.width = stageW;
        this.m_drawLayer.height = stageH;
        this.m_drawLayer.anchorX = this.m_drawLayer.anchorY = 0.5;
        this.m_drawLayer.x = stageW / 2;
        this.m_drawLayer.y = stageH / 2;
        this.addChildAt(this.m_drawLayer, 7);

        this.shareToWeiXinTimeLine();
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        RES.getResAsync("description", this.startAnimation, this)
        this.touchEnabled = true;
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
        this.changeDescription(titleTextContainer, titleStr);        
        titleTextContainer.alpha = 1;

        var tipStr = result[1];//Fixed
        this.changeDescription(tipTextContainer, tipStr);
        tipTextContainer.alpha = 1;//show the text
    }
    /**
     * 切换描述内容
     */
    private changeDescription(textContainer:egret.Sprite, lineArr:Array<any>):void {
        textContainer.removeChildren();
        var w:number = 0;
        for (var i:number = 0; i < lineArr.length; i++) {
            var info:any = lineArr[i];
            var colorLabel:egret.TextField = new egret.TextField();
            colorLabel.x = w;
            colorLabel.anchorX = colorLabel.anchorY = 0;
            colorLabel.textColor = parseInt(info["textColor"]);
            colorLabel.text = info["text"];
            colorLabel.size = 20;
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
        //an clould is out of window, remove it and create a new one
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
        this.addChildAt(moon, 6);

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

    private checkScore(target:egret.Bitmap, positionX:Array<number>, positionY:Array<number>): void
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
            minY = Math.min(minX, positionX[i]);
            maxY = Math.max(maxX, positionX[i]);
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
            this.addOneScore();
        }
    }

    private addOneScore(): void
    {
        this.m_score = this.m_score + 1;
        if (this.m_score > this.m_bestScore)
        {
            egret.Logger.info("new record generates");
            this.m_bestScore = this.m_score;
            this.saveBestScore();
        }
    }

    private get bestScore(): number
    {
        //ready the score from the storage
        var bestScore: string = egret.localStorage.getItem("best_score");
        this.m_bestScore = parseInt(bestScore);
        return this.m_bestScore;
    }

    private saveBestScore(): void
    {
        //push the score to the storage
        egret.localStorage.setItem("best_score", String(this.m_bestScore).toString());
    } 

    private gameFinished(): void
    {
        //show score and share btn
    }

    private shareToWeiXinTimeLine(): void
    {
        //TODO:
        WeixinApi.ready(function (api: WeixinApi)
        {
            alert("WeixinAPI Ready!!");

            var info: WeixinShareInfo = new WeixinShareInfo();
            info.title = "HelloEgret";
            info.desc = "欢迎使用Egret";
            info.link = "www.egret-labs.org";
            //info.imgUrl = "";
            api.shareToTimeline(info);
        })
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
}
