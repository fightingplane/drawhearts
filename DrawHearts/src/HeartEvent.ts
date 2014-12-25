class HeartActionFinished extends egret.Event
{
    public static HEART_ACTION_DONE: string = "HEART_ACTION_EVENT";

    public m_target: egret.Bitmap;

    public constructor(type: string, bubbles: boolean= false, cancelable: boolean= false)
    {
        super(type, bubbles, cancelable);
    }
}
