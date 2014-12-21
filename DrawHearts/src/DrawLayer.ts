class DrawLayer extends egret.Sprite
{
    private b_paint: boolean;
    private m_clickX: Array<number>;
    private m_clickY: Array<number>;
    private m_clickDrag: Array<boolean>;
    private m_h5Rendder: egret.HTML5CanvasRenderer;

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
        //context2d.clearRect(0, 0, stageW, stageH); // Clears the canvas

        context2d.strokeStyle = "#df4b26";
        context2d.lineJoin = "round";
        context2d.lineWidth = 5;

        for (var i = 0; i < this.m_clickX.length; i++)
        {
            context2d.beginPath();
            if (this.m_clickDrag[i] && i)
            {
                context2d.moveTo(this.m_clickX[i - 1], this.m_clickY[i - 1]);
            } else
            {
                context2d.moveTo(this.m_clickX[i] - 1, this.m_clickY[i]);
            }
            context2d.lineTo(this.m_clickX[i], this.m_clickY[i]);
            context2d.closePath();
            context2d.stroke();
        }
    }

    private clearTouchPoints(): void
    {
        //TODO:
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
     
    public _draw(renderContext: egret.RendererContext): void{
        super._draw(renderContext);
        this.redraw(renderContext);
    }
} 