class DrawLayer extends egret.Sprite
{
    private b_paint: boolean;
    private m_clickX: Array<number>;
    private m_clickY: Array<number>;
    private m_clickDrag: Array<boolean>;
    private m_h5Rendder: egret.HTML5CanvasRenderer;
    private m_shap: egret.Shape;
    public constructor()
    {
        super();

        this.m_clickX = new Array;
        this.m_clickY = new Array;
        this.m_clickDrag = new Array;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnded, this);
    }

    private onAddToStage(event: egret.Event)
    {
        this.m_shap = new egret.Shape;
        this.addChild(this.m_shap);

        this.touchEnabled = true;
    }

    private addTouchPoint(locationX: number, locationY: number, isDragging: boolean = false): void
    {
        this.m_clickX.push(locationX);
        this.m_clickY.push(locationY);
        this.m_clickDrag.push(isDragging);
    }

    private redraw(renderContext: egret.RendererContext): void
    {
        var h5RenderContext = <egret.HTML5CanvasRenderer> renderContext;
        //var context: egret.HTML5CanvasRenderer = this.m_h5Rendder;
        if (!h5RenderContext)
            return;
        var context2d: CanvasRenderingContext2D = h5RenderContext.canvasContext;
        if (!context2d)
            return;

        var stageW: number = this.stage.stageWidth;
        var stageH: number = this.stage.stageHeight;

        this.m_shap.graphics.clear();
        this.m_shap.graphics.lineStyle(3, 0xff0000, 1, true, "", "", "round");

        for (var i = 0; i < this.m_clickX.length; i++)
        {
            if (this.m_clickDrag[i] && i)
            {
                this.m_shap.graphics.moveTo(this.m_clickX[i - 1], this.m_clickY[i - 1]);            
            } else
            {
                this.m_shap.graphics.moveTo(this.m_clickX[i] - 1, this.m_clickY[i]);
            }
            this.m_shap.graphics.lineTo(this.m_clickX[i], this.m_clickY[i]);
        }
        this.m_shap.graphics.endFill();              
    }

    public clearTouchPoints(): void
    {
        if (this.m_clickX)
            delete this.m_clickX;

        if (this.m_clickY)
            delete this.m_clickY;

        if (this.m_clickDrag)
            delete this.m_clickDrag;

        this.m_clickX = new Array;
        this.m_clickY = new Array;
        this.m_clickDrag = new Array;

        //this.redraw();
    }

    private onTouchBegin(event: egret.TouchEvent): void
    {
        console.log("touch begins");
        this.b_paint = true;
        this.addTouchPoint(event.localX, event.localY);
        //this.redraw();
    }

    private onTouchMoved(event: egret.TouchEvent): void{
        console.log("touch moved");
        if (this.b_paint){
            this.addTouchPoint(event.localX, event.localY, true);
            //this.redraw();
        }
    }

    private onTouchEnded(event: egret.TouchEvent): void{
        console.log("touch ends");
        this.b_paint = false;
    }
     
    public _draw(renderContext: egret.RendererContext): void
    {
        super._draw(renderContext);
        this.redraw(renderContext);
    }

    public get positionXList(): Array<number>{
        return this.m_clickX;
    }

    public get positionYList(): Array<number>{
        return this.m_clickY;
    }
} 