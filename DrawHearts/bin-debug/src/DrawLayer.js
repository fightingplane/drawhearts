var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DrawLayer = (function (_super) {
    __extends(DrawLayer, _super);
    function DrawLayer() {
        _super.call(this);
        this.m_clickX = new Array;
        this.m_clickY = new Array;
        this.m_clickDrag = new Array;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnded, this);
    }
    DrawLayer.prototype.onAddToStage = function (event) {
        this.touchEnabled = true;
    };
    DrawLayer.prototype.addTouchPoint = function (locationX, locationY, isDragging) {
        if (isDragging === void 0) { isDragging = false; }
        this.m_clickX.push(locationX);
        this.m_clickY.push(locationY);
        this.m_clickDrag.push(isDragging);
    };
    DrawLayer.prototype.redraw = function (renderContext) {
        var h5RenderContext = renderContext;
        //var context: egret.HTML5CanvasRenderer = this.m_h5Rendder;
        if (!h5RenderContext)
            return;
        var context2d = h5RenderContext.canvasContext;
        if (!context2d)
            return;
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        //context2d.clearRect(0, 0, stageW, stageH); // Clears the canvas
        context2d.strokeStyle = "#df4b26";
        context2d.lineJoin = "round";
        context2d.lineWidth = 5;
        for (var i = 0; i < this.m_clickX.length; i++) {
            context2d.beginPath();
            if (this.m_clickDrag[i] && i) {
                context2d.moveTo(this.m_clickX[i - 1], this.m_clickY[i - 1]);
            }
            else {
                context2d.moveTo(this.m_clickX[i] - 1, this.m_clickY[i]);
            }
            context2d.lineTo(this.m_clickX[i], this.m_clickY[i]);
            context2d.closePath();
            context2d.stroke();
        }
    };
    DrawLayer.prototype.clearTouchPoints = function () {
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
    };
    DrawLayer.prototype.onTouchBegin = function (event) {
        console.log("touch begins");
        this.b_paint = true;
        this.addTouchPoint(event.localX, event.localY);
        //this.redraw();
    };
    DrawLayer.prototype.onTouchMoved = function (event) {
        console.log("touch moved");
        if (this.b_paint) {
            this.addTouchPoint(event.localX, event.localY, true);
        }
    };
    DrawLayer.prototype.onTouchEnded = function (event) {
        console.log("touch ends");
        this.b_paint = false;
    };
    DrawLayer.prototype._draw = function (renderContext) {
        _super.prototype._draw.call(this, renderContext);
        this.redraw(renderContext);
    };
    return DrawLayer;
})(egret.Sprite);
//# sourceMappingURL=DrawLayer.js.map