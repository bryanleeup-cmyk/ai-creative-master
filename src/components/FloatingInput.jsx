import { ImagePlus, Link2, PauseCircle, PlayCircle, Send, X } from "lucide-react";
import { cn } from "../lib/cn";

export function FloatingInput({
  isVisible,
  onSubmit,
  onOpenMediaLibrary,
  onOpenUrlModal,
  mediaList = [],
  setMediaList,
  isChatMode = false,
  isPaused = false,
  currentStepLabel = "",
  onResume,
  reGenerateMode = false,
  onCancelReGenerate,
}) {
  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[90] w-[min(920px,calc(100vw-32px))] -translate-x-1/2">
      <div className="pointer-events-auto rounded-[28px] border border-white/60 bg-white/95 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl">
        {(isChatMode || reGenerateMode) && (
          <div className="mb-3 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  isPaused ? "bg-amber-400" : "bg-emerald-500 animate-pulse",
                )}
              />
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  {reGenerateMode ? "角色重绘模式" : "深度编排对话模式"}
                </div>
                <div className="text-xs text-slate-500">
                  {reGenerateMode
                    ? "提交后会替换当前角色头像。"
                    : currentStepLabel
                      ? `当前阶段：${currentStepLabel}`
                      : "你可以继续补充创意需求。"}
                </div>
              </div>
            </div>
            {isPaused ? (
              <button
                onClick={onResume}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
              >
                <PlayCircle className="h-4 w-4" />
                继续
              </button>
            ) : reGenerateMode ? (
              <button
                onClick={onCancelReGenerate}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-300"
              >
                <X className="h-4 w-4" />
                取消重绘
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600">
                <PauseCircle className="h-4 w-4" />
                实时同步中
              </div>
            )}
          </div>
        )}

        <textarea
          rows={3}
          placeholder="继续描述你的创意、镜头、风格和角色设定..."
          className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm text-slate-700 outline-none transition-all focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
          defaultValue={reGenerateMode ? "请参考当前角色，生成更贴近品牌调性的角色形象。" : ""}
          id="floating-input"
        />

        {mediaList.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {mediaList.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <img src={item.url} alt="" className="h-10 w-10 rounded-xl object-cover" />
                <span className="text-xs font-medium text-slate-600">{item.type || "image"}</span>
                <button
                  onClick={() => setMediaList?.(mediaList.filter((media) => media.id !== item.id))}
                  className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMediaLibrary}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <ImagePlus className="h-4 w-4" />
              素材库
            </button>
            <button
              onClick={onOpenUrlModal}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Link2 className="h-4 w-4" />
              链接
            </button>
          </div>

          <button
            onClick={() => {
              const textarea = document.getElementById("floating-input");
              const prompt = textarea?.value?.trim?.() || "";
              if (!prompt) return;
              onSubmit?.({ prompt, mediaList });
              if (textarea) textarea.value = "";
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800"
          >
            <Send className="h-4 w-4" />
            提交
          </button>
        </div>
      </div>
    </div>
  );
}
