
class MoonFadeFinishEvent extends egret.Event {
    public static MOON_FADE_FINISH: string = "MOON_FADE_FINISHED_EVENT";

    public m_target: egret.Bitmap;

    public constructor(type: string, bubbles: boolean= false, cancelable: boolean= false) {
        super(type, bubbles, cancelable);
    }
}