class CloudMoveFinished extends egret.Event
{
    public static CLOUD_MOVE_DONE: string = "CLOUD_MOVE_FINISHED_EVENT";

    public m_target: egret.Bitmap;

    public constructor(type: string, bubbles: boolean= false, cancelable: boolean= false) {
        super(type, bubbles, cancelable);
    }
}
