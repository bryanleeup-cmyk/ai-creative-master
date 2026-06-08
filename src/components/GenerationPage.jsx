import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Archive,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  Edit,
  Edit3,
  FileText,
  Film,
  GripVertical,
  Layout,
  LogOut,
  Maximize2,
  MoreHorizontal,
  Music,
  Palette,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Send,
  Sparkles,
  Trash2,
  Upload,
  User,
  Video,
  Volume2,
  Wand2,
  X,
  ZoomIn,
} from "lucide-react";
import { CharacterLibraryModal } from "./CharacterLibraryModal";
import { FloatingInput } from "./FloatingInput";
import { cn } from "../lib/cn";

function AgentConfirmationForm({ job, onConfirm }) {
  const [businessPoint, setBusinessPoint] = useState("雅思培训高分速成");
  const [style, setStyle] = useState("写实风");
  const [audience, setAudience] = useState("大学生群体");
  const [videoType, setVideoType] = useState("智能匹配");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const RadioGroup = ({ label, options, value, onChange, index }) => (
    <div className="flex flex-col gap-3">
      <div className="text-[15px] font-bold text-slate-800">
        {index}. {label}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {options.map((opt) => {
          const isSelected = value === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors",
                isSelected
                  ? "border-transparent bg-indigo-50 text-indigo-600"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              )}
            >
              <div
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full",
                  isSelected
                    ? "border-[4.5px] border-indigo-500 bg-white"
                    : "border border-slate-300",
                )}
              />
              <span className="text-sm">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[15px] text-slate-700">
        为了更好地完成 {job.prompt} 的制作，请你确认以下信息：
      </p>

      <div className="flex flex-col gap-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Edit3 className="h-5 w-5" />
            {job.prompt}营销视频需求确认
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
            <ChevronUp className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-8">
          <RadioGroup
            index={1}
            label="视频风格"
            value={style}
            onChange={setStyle}
            options={["写实风", "动漫风", "3D动画", "像素风"]}
          />
          <RadioGroup
            index={2}
            label="目标受众"
            value={audience}
            onChange={setAudience}
            options={["大学生群体", "职场人士", "通用受众"]}
          />
          <RadioGroup
            index={3}
            label="视频类型"
            value={videoType}
            onChange={setVideoType}
            options={["智能匹配", "数字人混剪", "剧情混剪"]}
          />

          <div className="flex flex-col gap-3">
            <div className="text-[15px] font-bold text-slate-800">4. 补充信息（选填）</div>
            <input
              type="text"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="请输入其他要求或补充说明"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          <button
            onClick={() =>
              onConfirm?.(job.id, {
                businessPoint,
                style,
                audience,
                videoType,
                additionalInfo,
              })
            }
            className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-white transition-colors hover:bg-slate-800"
          >
            <span className="font-medium">提交</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function AgentPlanningPanel({
  job,
  currentStep,
  setCurrentStep,
  maxStepReached,
  setMaxStepReached,
  onConfirm,
  onCancel,
  onUpdate,
  onReGenerateCharacter,
  characters,
  setCharacters,
}) {
  const [hoveredCharIndex, setHoveredCharIndex] = useState(null);
  const [lastUpdatedIndex, setLastUpdatedIndex] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [updatingCharIndex, setUpdatingCharIndex] = useState(null);
  const [activeGlobalSettingModal, setActiveGlobalSettingModal] = useState(null);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [showBgmToggle, setShowBgmToggle] = useState(true);
  const [activeStoryboard, setActiveStoryboard] = useState(0);
  const prevCharsRef = useRef(characters);

  useEffect(() => {
    const changedIndex = characters.findIndex(
      (char, i) => char.avatar !== prevCharsRef.current[i]?.avatar,
    );
    if (changedIndex !== -1) {
      setLastUpdatedIndex(changedIndex);
      const timer = setTimeout(() => setLastUpdatedIndex(null), 1800);
      prevCharsRef.current = characters;
      return () => clearTimeout(timer);
    }
    prevCharsRef.current = characters;
    return undefined;
  }, [characters]);

  const [businessInfo, setBusinessInfo] = useState(
    job.agentPlan?.businessInfo ?? {
      businessPoint: job.prompt || "雅思培训高分速成",
      style: "写实风",
      audience: "大学生群体",
      videoType: "智能匹配",
      additionalInfo: "",
    },
  );

  const [theme, setTheme] = useState(job.agentPlan?.title ?? `${job.prompt}的宣传视频`);

  const [scriptOutline, setScriptOutline] = useState(
    job.agentPlan?.scriptOutline ?? [
      {
        title: "开场：痛点共鸣",
        desc: "展示家长面对孩子雅思成绩单的焦虑神情，背景是杂乱的辅导书。",
        chars: [0, 1],
      },
      {
        title: "引入：专业方案",
        desc: "资深教师登场，通过简洁白板演示，指出备考核心误区。",
        chars: [0],
      },
      {
        title: "高潮：方法展示",
        desc: "快速剪辑学员使用新方法练习的画面，配以节奏感强的音乐。",
        chars: [2],
      },
      {
        title: "结尾：转化引导",
        desc: "教师与学员共同微笑面对镜头，屏幕出现课程链接和限时优惠。",
        chars: [0, 2],
      },
    ],
  );

  const [activeTraitSelector, setActiveTraitSelector] = useState(null);
  const [traitSelectorRect, setTraitSelectorRect] = useState(null);
  const [storyboards] = useState([
    { id: 1, prompt: "博主展示妆容灵感图", bgm: "轻快钢琴", subtitle: "今天教大家一个雅思备考小技巧", post: "柔光滤镜" },
    { id: 2, prompt: "博主在书房开始分享", bgm: "轻快钢琴", subtitle: "首先，我们要明确目标", post: "柔光滤镜" },
    { id: 3, prompt: "展示雅思教材", bgm: "轻快钢琴", subtitle: "这几本书是必读的", post: "锐化" },
    { id: 4, prompt: "博主总结", bgm: "轻快钢琴", subtitle: "加油，你一定可以的！", post: "柔光滤镜" },
  ]);
  const traitOptions = ["专业", "亲和", "真实", "共情", "自信", "阳光", "幽默", "严谨", "活泼", "沉稳", "知性", "干练", "温柔", "热情", "冷静"];

  useEffect(() => {
    onUpdate?.({
      currentStep,
      maxStepReached,
      businessInfo,
      title: theme,
      scriptOutline,
      characters,
    });
  }, [currentStep, maxStepReached, businessInfo, theme, scriptOutline, characters, onUpdate]);

  const updateCharacter = (index, key, value) => {
    const next = [...characters];
    next[index] = { ...next[index], [key]: value };
    setCharacters(next);
  };

  const updateScriptItem = (index, key, value) => {
    const next = [...scriptOutline];
    next[index] = { ...next[index], [key]: value };
    setScriptOutline(next);
  };

  const addCharacter = () => {
    setCharacters([
      ...characters,
      {
        name: "新角色",
        trait: "描述性格特征",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
      },
    ]);
  };

  const removeCharacter = (index) => {
    setCharacters(characters.filter((_, i) => i !== index));
  };

  const handleNextStep = (step) => {
    setCurrentStep(step);
    if (step > maxStepReached) setMaxStepReached(step);
  };

  const renderStepProgress = () => (
    <div className="sticky top-0 z-20 flex h-[60px] shrink-0 items-center justify-between overflow-x-auto border-b border-slate-100 bg-white px-8 shadow-sm scrollbar-hide">
      <div className="w-[140px] shrink-0" />
      <div className="mx-auto flex min-w-max items-center gap-6 px-12">
        {[
          { title: "创意解析", icon: Wand2 },
          { title: "方案规划", icon: Layout },
          { title: "分镜设计", icon: FileText },
          { title: "后期合成", icon: CheckCircle2 },
        ].map((step, idx) => {
          const isPast = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isLocked = idx > maxStepReached;

          return (
            <div key={step.title} className="flex items-center gap-6">
              <button
                onClick={() => !isLocked && setCurrentStep(idx)}
                disabled={isLocked}
                className={cn(
                  "group flex items-center gap-2 transition-all",
                  isLocked ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                    isPast
                      ? "bg-[#7641FB] text-white"
                      : isCurrent
                        ? "bg-[#7641FB] text-white ring-4 ring-[#7641FB]/10"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200",
                  )}
                >
                  {isPast ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <span
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-wider",
                      isCurrent ? "text-[#7641FB]" : "text-slate-400",
                    )}
                  >
                    步骤 {idx + 1}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-bold",
                      isCurrent ? "text-slate-800" : "text-slate-400",
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              </button>
              {idx < 3 ? (
                <div
                  className={cn(
                    "h-[1px] w-8 rounded-full",
                    isPast ? "bg-[#7641FB]" : "bg-slate-200",
                  )}
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <button
        onClick={() => onCancel?.(job.id, { currentStep, maxStepReached })}
        className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#7641FB]"
      >
        <LogOut className="h-4 w-4" />
        <span className="text-xs font-bold">退出深度编排模式</span>
      </button>
    </div>
  );

  const renderStep1 = () => (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-white p-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-3 text-xl font-bold text-slate-800">
            <div className="h-6 w-1.5 rounded-full bg-[#7641FB]" />
            创意解析报告
          </h3>
          <span className="flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
            <CheckCircle2 className="h-3 w-3" /> 已自动提取
          </span>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <User className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">业务背景</span>
            </div>
            <div className="grid gap-3">
              {[
                { key: "businessPoint", label: "业务点信息", value: businessInfo.businessPoint, icon: Wand2 },
                { key: "style", label: "视频风格", value: businessInfo.style, icon: Palette },
                { key: "audience", label: "目标受众", value: businessInfo.audience, icon: User },
                { key: "videoType", label: "视频类型", value: businessInfo.videoType, icon: Video },
                { key: "additionalInfo", label: "补充信息", value: businessInfo.additionalInfo, icon: FileText },
              ].map((item) => (
                <div
                  key={item.key}
                  className="group relative flex cursor-pointer items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all hover:border-[#7641FB]/30 hover:bg-white"
                >
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-400 transition-colors group-hover:text-[#7641FB]">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-[10px] font-bold uppercase text-slate-400">{item.label}</span>
                      <input
                        value={item.value}
                        onChange={(e) =>
                          setBusinessInfo((prev) => ({ ...prev, [item.key]: e.target.value }))
                        }
                        className="w-full border-none bg-transparent text-sm font-bold text-slate-800 outline-none transition-colors focus:text-[#7641FB]"
                      />
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 opacity-0 transition-all hover:text-[#7641FB] group-hover:opacity-100">
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="pt-4">
          <button
            onClick={() => handleNextStep(1)}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#7641FB] py-5 text-lg font-bold text-white shadow-xl shadow-[#7641FB]/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            确认信息并生成方案 <ChevronRight className="h-6 w-6" />
          </button>
          <p className="mt-4 text-center text-xs text-slate-400">确认后 AI 将为您规划剧本和大纲</p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-slate-50/50 p-8" onScroll={() => setActiveTraitSelector(null)}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <section
          onClick={() => document.getElementById("theme-input")?.focus()}
          className="group relative cursor-text rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-[#7641FB]/30"
        >
          <h3 className="mb-2 text-sm font-medium text-slate-500">创意主题</h3>
          <input
            id="theme-input"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full border-none bg-transparent text-xl font-bold text-slate-800 outline-none transition-colors focus:text-[#7641FB]"
          />
          <button className="absolute right-6 top-6 text-slate-400 opacity-0 transition-all hover:text-[#7641FB] group-hover:opacity-100">
            <Edit3 className="h-4 w-4" />
          </button>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-bold text-slate-800">角色列表</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {characters.map((char, i) => (
              <div
                key={`${char.name}-${i}`}
                className="group relative min-w-[200px] overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-[#7641FB] hover:shadow-lg hover:shadow-[#7641FB]/5"
                onMouseEnter={() => setHoveredCharIndex(i)}
                onMouseLeave={() => setHoveredCharIndex(null)}
              >
                <AnimatePresence>
                  {lastUpdatedIndex === i ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-emerald-500/10 backdrop-blur-[1px]"
                    >
                      <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="rounded-full bg-white p-2 shadow-lg">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {hoveredCharIndex === i ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 rounded-xl bg-white/90 p-4 backdrop-blur-[2px]"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReGenerateCharacter?.(char.avatar, i);
                        }}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#7641FB] py-2.5 text-[11px] font-bold text-white shadow-lg shadow-[#7641FB]/20 transition-all hover:scale-[1.05] active:scale-[0.95]"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> 带入输入框重绘
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUpdatingCharIndex(i);
                          setShowLibrary(true);
                        }}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2.5 text-[11px] font-bold text-slate-600 transition-all hover:bg-slate-200"
                      >
                        <Archive className="h-3.5 w-3.5" /> 从角色库选择
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <button
                  onClick={() => removeCharacter(i)}
                  className="absolute right-2 top-2 z-20 p-1 text-slate-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>

                <div className="flex flex-col items-center gap-4">
                  <img src={char.avatar} alt={char.name} className="h-32 w-32 rounded-full border-2 border-[#7641FB]/10 object-cover shadow-md" />
                  <div className="relative w-full space-y-1 text-center">
                    <input
                      value={char.name}
                      onChange={(e) => updateCharacter(i, "name", e.target.value)}
                      className="w-full border-none bg-transparent text-center text-sm font-bold text-slate-800 outline-none focus:text-[#7641FB]"
                    />
                    <div
                      className="group/trait relative cursor-pointer"
                      onClick={(e) => {
                        if (activeTraitSelector === i) {
                          setActiveTraitSelector(null);
                        } else {
                          setTraitSelectorRect(e.currentTarget.getBoundingClientRect());
                          setActiveTraitSelector(i);
                        }
                      }}
                    >
                      <div
                        className={cn(
                          "truncate px-2 text-center text-[10px] transition-colors",
                          char.trait ? "text-slate-500 group-hover/trait:text-[#7641FB]" : "text-[#7641FB] opacity-70",
                        )}
                      >
                        {char.trait || "描述性格特征"}
                      </div>

                      {activeTraitSelector === i && traitSelectorRect ? (
                        <div
                          className="fixed z-[100] w-48 rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
                          style={{
                            top: traitSelectorRect.bottom + 8,
                            left: traitSelectorRect.left + traitSelectorRect.width / 2,
                            transform: "translateX(-50%)",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="mb-2 text-left text-xs font-bold text-slate-800">选择性格特征</div>
                          <div className="flex flex-wrap gap-1.5">
                            {traitOptions.map((opt) => {
                              const currentTraits = char.trait ? char.trait.split("、") : [];
                              const isSelected = currentTraits.includes(opt);
                              return (
                                <button
                                  key={opt}
                                  onClick={() => {
                                    const next = isSelected
                                      ? currentTraits.filter((t) => t !== opt)
                                      : [...currentTraits, opt];
                                    updateCharacter(i, "trait", next.join("、"));
                                  }}
                                  className={cn(
                                    "rounded-md border px-2 py-1 text-[10px] font-medium transition-colors",
                                    isSelected
                                      ? "border-[#7641FB]/20 bg-[#7641FB]/10 text-[#7641FB]"
                                      : "border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200",
                                  )}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addCharacter}
              className="flex min-w-[200px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-white/50 text-slate-400 transition-colors hover:border-[#7641FB] hover:text-[#7641FB]"
            >
              <Plus className="h-6 w-6" />
              <span className="text-xs font-bold">添加角色</span>
            </button>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">剧本大纲</h3>
            <button className="flex items-center gap-1 text-xs font-bold text-[#7641FB] hover:underline">
              <RotateCcw className="h-3 w-3" /> 重新生成
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {scriptOutline.map((item, i) => (
              <div
                key={item.title}
                onClick={() => document.getElementById(`script-desc-${i}`)?.focus()}
                className="group relative cursor-text rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-[#7641FB]/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7641FB]/10 text-xs font-bold text-[#7641FB]">
                        {i + 1}
                      </span>
                      <input
                        id={`script-title-${i}`}
                        value={item.title}
                        onChange={(e) => updateScriptItem(i, "title", e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 border-none bg-transparent font-bold text-slate-800 outline-none transition-colors focus:text-[#7641FB]"
                      />
                    </div>
                    <textarea
                      id={`script-desc-${i}`}
                      value={item.desc}
                      onChange={(e) => updateScriptItem(i, "desc", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      rows={2}
                      className="w-full resize-none border-none bg-transparent text-sm leading-relaxed text-slate-500 outline-none transition-colors focus:text-slate-800"
                    />
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex -space-x-2">
                      {item.chars.map((idx) =>
                        characters[idx] ? (
                          <img key={idx} src={characters[idx].avatar} className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-sm" alt="" />
                        ) : null,
                      )}
                    </div>
                    <button className="text-slate-400 opacity-0 transition-all hover:text-[#7641FB] group-hover:opacity-100">
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => handleNextStep(2)}
          className="flex items-center gap-2 rounded-xl bg-[#7641FB] px-8 py-3 font-bold text-white shadow-lg shadow-[#7641FB]/20 transition-colors hover:bg-[#6534e3]"
        >
          确认剧本并生成分镜 <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-slate-50">
      <div className="flex flex-1 flex-col gap-6 overflow-hidden p-6 lg:flex-row">
        <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[360px]">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Film className="h-5 w-5 text-slate-800" />
              <h3 className="truncate text-base font-bold text-slate-800">{theme}分镜视觉</h3>
            </div>
            <span className="whitespace-nowrap text-[10px] text-slate-400">已保存 14:00</span>
          </div>

          <div className="flex flex-1 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
            <div className="relative aspect-[9/16] h-full overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-black/5">
              <img src={`https://picsum.photos/seed/story${activeStoryboard}/1080/1920`} className="h-full w-full object-cover" alt="预览" />
              <div className="group absolute inset-0 flex items-center justify-center bg-black/10">
                <button className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white opacity-0 backdrop-blur-xl transition-all hover:scale-110 group-hover:opacity-100">
                  <Play className="ml-1 h-7 w-7 fill-white" />
                </button>
              </div>
              <div className="absolute bottom-8 left-0 right-0 px-6 text-center">
                <p className="rounded-full bg-black/40 py-2 text-xs font-medium text-white drop-shadow-lg backdrop-blur-md">
                  {storyboards[activeStoryboard].subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6">
          <div className="flex shrink-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex shrink-0 border-b border-slate-100">
              <button className="border-b-2 border-[#7641FB] px-6 py-4 text-xs font-bold text-[#7641FB] transition-all">
                分镜提示词
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-4">
                <div className="min-h-[120px] rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm leading-relaxed text-slate-700">
                    <span className="font-bold text-[#7641FB]">资深女性教师</span> 站在简洁的白板前，
                    <span className="font-bold text-[#7641FB]">面带微笑</span> 地看向镜头。背景是柔和的
                    <span className="font-bold text-[#7641FB]">暖色调灯光</span>，营造出一种
                    <span className="font-bold text-[#7641FB]">专业且亲切</span> 的氛围。
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600">重置</button>
                  <button className="rounded-xl bg-[#7641FB] px-6 py-2 text-xs font-bold text-white shadow-md shadow-[#7641FB]/20">保存修改</button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden" />
        </div>
      </div>

      <div className="flex shrink-0 flex-col border-t border-slate-100 bg-white">
        <div className="flex h-14 items-center justify-between border-b border-slate-50 bg-slate-50/50 px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">全部分镜</span>
              <div className="mx-1 h-3 w-px bg-slate-200" />
              <span className="font-mono text-xs text-slate-400">0:00 / 02:00</span>
            </div>
            <button className="rounded-lg p-1.5 transition-colors hover:bg-slate-100">
              <Play className="h-4 w-4 fill-current" />
            </button>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveGlobalSettingModal("voiceover")}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 transition-colors hover:text-[#7641FB]"
              >
                台词
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">字幕</span>
                <button
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={cn("relative h-4 w-8 rounded-full transition-colors", showSubtitles ? "bg-[#7641FB]" : "bg-slate-200")}
                >
                  <div
                    className={cn("absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-all", showSubtitles ? "right-1" : "left-1")}
                  />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">背景音乐</span>
                <button
                  onClick={() => setShowBgmToggle(!showBgmToggle)}
                  className={cn("relative h-4 w-8 rounded-full transition-colors", showBgmToggle ? "bg-[#7641FB]" : "bg-slate-200")}
                >
                  <div
                    className={cn("absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-all", showBgmToggle ? "right-1" : "left-1")}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={() => setActiveGlobalSettingModal("post")}
              className="group flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors hover:bg-slate-100"
            >
              <Film className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#7641FB]" />
              <span className="text-xs font-bold text-slate-400 group-hover:text-slate-800">后期</span>
            </button>
            <button
              onClick={() => setActiveGlobalSettingModal("bgm")}
              className="rounded-lg p-2 transition-colors hover:bg-slate-100"
            >
              <Music className="h-4 w-4 text-slate-400" />
            </button>
            <button
              onClick={() => handleNextStep(3)}
              className="flex items-center gap-2 rounded-xl bg-[#7641FB] px-6 py-2 text-xs font-bold text-white shadow-lg shadow-[#7641FB]/20 transition-all hover:scale-[1.05] active:scale-[0.95]"
            >
              确认分镜并开始合成 <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex h-[160px] items-center gap-4 overflow-x-auto px-8 p-4 scrollbar-hide">
          {storyboards.map((sb, i) => (
            <button
              key={sb.id}
              onClick={() => setActiveStoryboard(i)}
              className={cn(
                "group relative h-full min-w-[180px] shrink-0 overflow-hidden rounded-2xl border-2 transition-all",
                activeStoryboard === i
                  ? "scale-[1.02] border-[#7641FB] shadow-lg shadow-[#7641FB]/10"
                  : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <img src={`https://picsum.photos/seed/story${i}/320/180`} className="h-full w-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute left-3 top-3 rounded-lg bg-black/40 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                分镜{i + 1}
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-center text-[11px] font-medium text-white">
                0:{i * 2 < 10 ? `0${i * 2}` : i * 2}-0:{(i + 1) * 2 < 10 ? `0${(i + 1) * 2}` : (i + 1) * 2}
              </div>
            </button>
          ))}
          <button className="flex h-full min-w-[180px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 transition-all hover:border-[#7641FB] hover:bg-[#7641FB]/5 hover:text-[#7641FB]">
            <Plus className="h-8 w-8" />
            <span className="text-sm font-bold">添加分镜</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {activeGlobalSettingModal ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-slate-100 p-6">
                <h3 className="text-lg font-bold">全局设置</h3>
                <button onClick={() => setActiveGlobalSettingModal(null)} className="rounded-full p-2 transition-colors hover:bg-slate-100">
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <div className="flex shrink-0 border-b border-slate-100">
                {[
                  { id: "subtitle", label: "字幕" },
                  { id: "voiceover", label: "配音" },
                  { id: "bgm", label: "音乐" },
                  { id: "post", label: "后期" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveGlobalSettingModal(tab.id)}
                    className={cn(
                      "flex-1 border-b-2 py-4 text-sm font-bold transition-all",
                      activeGlobalSettingModal === tab.id
                        ? "border-[#7641FB] text-[#7641FB]"
                        : "border-transparent text-slate-400 hover:text-slate-600",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {activeGlobalSettingModal === "bgm" ? (
                  <div className="flex flex-col gap-6">
                    <button className="flex items-center gap-2 self-start rounded-xl bg-[#7641FB] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#7641FB]/20 transition-transform hover:scale-[1.02]">
                      <Upload className="h-3.5 w-3.5" /> 上传音乐
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: "泥泞的脚", time: "1:57" },
                        { name: "苹果和树莓", time: "2:04" },
                        { name: "慢慢地它", time: "2:18" },
                        { name: "景观", time: "2:00" },
                      ].map((music) => (
                        <div key={music.name} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition-all hover:border-[#7641FB]/30">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-400">
                            <Music className="h-4 w-4" />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-xs font-medium">{music.name}</span>
                            <span className="text-[10px] text-slate-400">{music.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {activeGlobalSettingModal === "voiceover" ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "张玲医生", avatar: "https://picsum.photos/seed/v3/100/100" },
                      { name: "三品润-老头", avatar: "https://picsum.photos/seed/v4/100/100" },
                      { name: "唐毅实音", avatar: "https://picsum.photos/seed/v6/100/100" },
                      { name: "口播测试", avatar: "https://picsum.photos/seed/v7/100/100" },
                    ].map((voice) => (
                      <div key={voice.name} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition-all hover:border-[#7641FB]/30">
                        <img src={voice.avatar} alt={voice.name} className="h-8 w-8 rounded-full object-cover" />
                        <span className="min-w-0 flex-1 truncate text-xs font-medium">{voice.name}</span>
                        <Volume2 className="h-3.5 w-3.5 text-slate-300" />
                      </div>
                    ))}
                  </div>
                ) : null}

                {activeGlobalSettingModal === "subtitle" ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-800">字幕内容</span>
                    <textarea
                      className="h-24 w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed outline-none ring-[#7641FB]/20 focus:ring-2"
                      defaultValue={storyboards[activeStoryboard].subtitle}
                    />
                  </div>
                ) : null}

                {activeGlobalSettingModal === "post" ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "雪花", icon: "❄️" },
                      { name: "下雨", icon: "🌧️" },
                      { name: "落叶", icon: "🍂" },
                      { name: "樱花", icon: "🌸" },
                    ].map((effect) => (
                      <div key={effect.name} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition-all hover:border-[#7641FB]/30">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm">
                          {effect.icon}
                        </div>
                        <span className="truncate text-xs font-medium">{effect.name}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex shrink-0 justify-end gap-3 border-t border-slate-100 bg-white p-6">
                <button onClick={() => setActiveGlobalSettingModal(null)} className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600">
                  取消
                </button>
                <button
                  onClick={() => setActiveGlobalSettingModal(null)}
                  className="rounded-xl bg-[#7641FB] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[#7641FB]/20 transition-transform hover:scale-[1.02]"
                >
                  确认应用
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );

  const renderStep4 = () => (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-[#0F172A] lg:flex-row">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-2">
        <div className="relative aspect-[9/16] h-full max-h-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
          <img src="https://picsum.photos/seed/final/1080/1920" className="h-full w-full object-cover" alt="最终效果" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30 text-white shadow-2xl backdrop-blur-xl">
              <Play className="ml-1 h-7 w-7 fill-white" />
            </button>
          </div>
          <div className="absolute bottom-8 left-0 right-0 px-6">
            <div className="h-1 overflow-hidden rounded-full bg-white/30">
              <div className="h-full w-1/3 bg-white" />
            </div>
            <div className="mt-1.5 flex justify-between text-[8px] font-medium text-white">
              <span>00:10</span>
              <span>00:30</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex shrink-0 gap-3">
          <button className="rounded-full bg-white p-2 shadow-sm transition-colors hover:bg-slate-100">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button className="rounded-full bg-white p-2 shadow-sm transition-colors hover:bg-slate-100">
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex w-full flex-col overflow-hidden border-l border-slate-200 bg-white lg:w-[280px]">
        <div className="flex flex-1 flex-col justify-end overflow-y-auto p-6">
          <section className="pt-4">
            <button
              onClick={() => onConfirm?.(job.id, { title: theme, outline: scriptOutline })}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7641FB] to-[#9F75FF] py-4 text-base font-bold text-white shadow-xl shadow-[#7641FB]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="h-4 w-4" /> 合成并导出视频
            </button>
            <p className="mt-3 text-center text-[9px] text-slate-400">预计合成时间：1分30秒</p>
          </section>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col bg-white">
      {renderStepProgress()}
      {currentStep === 0 ? renderStep1() : null}
      {currentStep === 1 ? renderStep2() : null}
      {currentStep === 2 ? renderStep3() : null}
      {currentStep === 3 ? renderStep4() : null}

      <CharacterLibraryModal
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        onConfirm={(selectedChar) => {
          if (updatingCharIndex === null) return;
          const next = [...characters];
          next[updatingCharIndex] = {
            ...next[updatingCharIndex],
            name: selectedChar.name,
            avatar: selectedChar.avatar,
          };
          setCharacters(next);
        }}
      />
    </div>
  );
}

export function GenerationPage({
  jobs,
  onImageClick,
  onGenerate,
  onReEdit,
  onGenerateAgain,
  onGenerateSimilar,
  onBatchDelete,
  onBatchDownload,
  onBatchSave,
  onConfirmAgent,
  onConfirmPlanning,
  onCancelPlanning,
  onResumePlanning,
  onUpdatePlanningState,
  showFloatingInput = true,
  mediaList = [],
  setMediaList = () => {},
  reEditData,
  setShowImageLibrary = () => {},
  setShowUrlModal = () => {},
  setEditingMedia = () => {},
}) {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const prevJobsLength = useRef(jobs.length);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [reGeneratingCharacter, setReGeneratingCharacter] = useState(null);
  const [leftWidth, setLeftWidth] = useState(36);
  const [isResizing, setIsResizing] = useState(false);
  const planningJob = jobs.find((j) => j.status === "planning" || j.status === "paused_planning");
  const [currentStep, setCurrentStep] = useState(planningJob?.agentPlan?.currentStep ?? 1);
  const [maxStepReached, setMaxStepReached] = useState(planningJob?.agentPlan?.maxStepReached ?? 1);
  const [characters, setCharacters] = useState([
    {
      name: "资深女性教师",
      trait: "专业、亲和",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      name: "焦虑家长",
      trait: "真实、共情",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      name: "成功学员",
      trait: "自信、阳光",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
    },
  ]);

  useEffect(() => {
    if (!planningJob) return;
    setCurrentStep(planningJob.agentPlan?.currentStep ?? 1);
    setMaxStepReached(planningJob.agentPlan?.maxStepReached ?? 1);
  }, [planningJob?.id]);

  const handleConfirmPlanning = useCallback(
    (jobId, plan) => onConfirmPlanning?.(jobId, plan),
    [onConfirmPlanning],
  );

  const handleCancelPlanning = useCallback(
    (jobId, state) => onCancelPlanning?.(jobId, state),
    [onCancelPlanning],
  );

  const handleUpdatePlanningState = useCallback(
    (state) => {
      if (planningJob) onUpdatePlanningState?.(planningJob.id, state);
    },
    [planningJob, onUpdatePlanningState],
  );

  const handleReGenerateCharacter = useCallback(
    (avatar, index) => {
      setReGeneratingCharacter({ index, avatar });
      setMediaList([
        {
          id: Date.now().toString(),
          url: avatar,
          type: "image",
        },
      ]);
    },
    [setMediaList],
  );

  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e) => {
      if (!isResizing || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newLeftWidthPx = e.clientX - rect.left;
      const newLeftWidthPercent = (newLeftWidthPx / rect.width) * 100;
      const minLeftPx = 320;
      const minRightPx = 500;
      const maxLeftPx = rect.width - minRightPx;
      if (newLeftWidthPx >= minLeftPx && newLeftWidthPx <= maxLeftPx) {
        setLeftWidth(newLeftWidthPercent);
      }
    },
    [isResizing],
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, resize, stopResizing]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    if (jobs.length > prevJobsLength.current) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    } else {
      const threshold = 150;
      const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + threshold;
      if (isNearBottom || jobs.length === 1) {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    }
    prevJobsLength.current = jobs.length;
  }, [jobs]);

  const allImages = jobs.flatMap((job) => job.resultImages || []);
  const isAllSelected = selectedImages.size === allImages.length && allImages.length > 0;

  const toggleSelect = (url) => {
    const next = new Set(selectedImages);
    if (next.has(url)) next.delete(url);
    else next.add(url);
    setSelectedImages(next);
  };

  const handleSelectAll = () => {
    setSelectedImages(isAllSelected ? new Set() : new Set(allImages));
  };

  const groupedJobs = jobs.reduce((acc, job) => {
    const date = job.date || "今天";
    acc[date] ??= [];
    acc[date].push(job);
    return acc;
  }, {});

  return (
    <div ref={containerRef} className="relative flex h-full w-full flex-row overflow-hidden bg-white">
      <motion.div
        initial={false}
        animate={{ width: planningJob ? `${leftWidth}%` : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative flex h-full shrink-0 flex-col overflow-hidden"
      >
        <AnimatePresence>
          {planningJob ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 56, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute left-0 right-0 top-0 z-20 flex shrink-0 items-center justify-between overflow-hidden border-b border-slate-100 bg-white/90 px-8 backdrop-blur-md"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-[#7641FB] animate-pulse" />
                <span className="text-sm font-bold text-slate-800">正在进行 Agent 深度编排</span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div ref={scrollRef} className={cn("flex-1 overflow-y-auto bg-white", planningJob && "pt-14")}>
          <div className="mx-auto flex max-w-[1000px] flex-col gap-12 px-8 py-10 pb-40">
            {Object.entries(groupedJobs).map(([date, dateJobs]) => (
              <div key={date} className="flex flex-col gap-8">
                <h2 className="text-xl font-bold text-slate-800">{date}</h2>

                <div className="flex flex-col gap-12">
                  {dateJobs.map((job) => (
                    <div key={job.id} className="flex flex-col gap-4">
                      <div className="flex items-start gap-3">
                        <p className="flex-1 text-[15px] leading-relaxed text-slate-700">
                          {job.prompt}
                          {job.genType !== "Agent 模式" ? (
                            <span className="ml-3 text-sm font-normal text-slate-400">
                              {job.imageRatio} | {job.imageResolution} | {job.imageCount}张
                              {job.isThinking ? " | 深度思考" : ""}
                            </span>
                          ) : (
                            <span className="ml-3 inline-flex items-center gap-1.5 rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                              <Sparkles className="h-3 w-3" /> Agent 模式
                            </span>
                          )}
                        </p>
                      </div>

                      {job.status === "confirming" ? (
                        <div className="flex flex-col gap-6">
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 font-medium text-emerald-600">
                                <CheckCircle2 className="h-5 w-5" />
                                <span>工具调用</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span>1 项已完成</span>
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                          <AgentConfirmationForm job={job} onConfirm={onConfirmAgent} />
                        </div>
                      ) : null}

                      {job.status === "generating" ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-100 bg-slate-50 py-12">
                          <div className="relative">
                            <div className="h-12 w-12 rounded-full border-4 border-slate-200" />
                            <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" style={{ animationDuration: "1.5s" }} />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">{job.progress}%</span>
                            </div>
                          </div>
                          <p className="mt-4 text-sm font-medium text-slate-600">AI 正在施展魔法...</p>
                          <p className="mt-1 text-xs text-slate-400">预计需要 1-2 分钟</p>
                        </div>
                      ) : null}

                      {job.status === "done" ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                          {job.resultImages.map((img, idx) => {
                            const isSelected = selectedImages.has(img);
                            return (
                              <div
                                key={idx}
                                className={cn(
                                  "group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-xl border bg-slate-100 shadow-sm transition-all duration-300",
                                  isSelected
                                    ? "border-blue-500 ring-2 ring-blue-500/20"
                                    : "border-slate-200/50 hover:shadow-md",
                                )}
                              >
                                <img
                                  src={img}
                                  alt="Result"
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  referrerPolicy="no-referrer"
                                  onClick={() => onImageClick?.(img)}
                                />

                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSelect(img);
                                  }}
                                  className={cn(
                                    "absolute right-2 top-2 z-30 flex h-5 w-5 items-center justify-center rounded border transition-all",
                                    isSelected
                                      ? "border-blue-500 bg-blue-500"
                                      : "border-white/40 bg-white/20 opacity-0 backdrop-blur-md group-hover:opacity-100",
                                  )}
                                >
                                  {isSelected ? <Check className="h-3.5 w-3.5 stroke-[3px] text-white" /> : null}
                                </div>

                                <div className="pointer-events-none absolute left-2 top-2 z-10 rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-[10px] font-medium text-white/90 backdrop-blur-md">
                                  AI生成
                                </div>

                                <div className="absolute right-10 top-2 z-20 flex translate-y-[-8px] items-center gap-0.5 rounded-2xl border border-white/10 bg-black/40 p-1 opacity-0 backdrop-blur-xl transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                  <button className="rounded-xl p-1.5 text-white transition-all hover:bg-white/20 active:scale-90">
                                    <Wand2 className="h-4 w-4" />
                                  </button>
                                  <button className="rounded-xl p-1.5 text-white transition-all hover:bg-white/20 active:scale-90">
                                    <Save className="h-4 w-4" />
                                  </button>
                                  <button
                                    className="rounded-xl p-1.5 text-white transition-all hover:bg-white/20 active:scale-90"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onImageClick?.(img);
                                    }}
                                  >
                                    <ZoomIn className="h-4 w-4" />
                                  </button>
                                  <button className="rounded-xl p-1.5 text-white transition-all hover:bg-white/20 active:scale-90">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                </div>

                                <div className="absolute bottom-3 left-2 right-2 z-20 flex items-center overflow-hidden rounded-2xl border border-white/10 bg-black/60 opacity-0 shadow-2xl backdrop-blur-2xl transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onGenerateSimilar?.(img);
                                    }}
                                    className="flex-1 whitespace-nowrap py-2.5 text-[11px] font-medium text-white transition-colors hover:bg-white/10 active:bg-white/20 sm:text-[12px]"
                                  >
                                    生同款
                                  </button>
                                  <div className="h-3 w-px shrink-0 bg-white/20" />
                                  <button className="flex-1 whitespace-nowrap py-2.5 text-[11px] font-medium text-white transition-colors hover:bg-white/10 active:bg-white/20 sm:text-[12px]">
                                    生视频
                                  </button>
                                  <div className="h-3 w-px shrink-0 bg-white/20" />
                                  <button className="flex-1 whitespace-nowrap py-2.5 text-[11px] font-medium text-white transition-colors hover:bg-white/10 active:bg-white/20 sm:text-[12px]">
                                    扩图
                                  </button>
                                  <div className="h-3 w-px shrink-0 bg-white/20" />
                                  <button className="flex-1 whitespace-nowrap py-2.5 text-[11px] font-medium text-white transition-colors hover:bg-white/10 active:bg-white/20 sm:text-[12px]">
                                    抠图
                                  </button>
                                </div>

                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                              </div>
                            );
                          })}
                        </div>
                      ) : null}

                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onReEdit?.(job)}
                            className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                          >
                            <Edit className="h-4 w-4" /> 重新编辑
                          </button>
                          <button
                            onClick={() => onGenerateAgain?.(job)}
                            className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                          >
                            <RefreshCw className="h-4 w-4" /> 再次生成
                          </button>
                          <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedImages.size > 0 ? (
          <div className="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
            <button
              onClick={handleSelectAll}
              className="group flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 transition-colors hover:bg-blue-100"
            >
              <div
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded border transition-all",
                  isAllSelected ? "border-blue-500 bg-blue-500" : "border-blue-200 bg-white",
                )}
              >
                {isAllSelected ? <Check className="h-3 w-3 stroke-[3px] text-white" /> : null}
              </div>
              <span className="text-sm font-bold text-blue-600">
                全选 (已选 {selectedImages.size}/{allImages.length})
              </span>
            </button>

            <div className="mx-1 h-6 w-px bg-slate-100" />

            <button
              onClick={() => {
                onBatchSave?.(Array.from(selectedImages), "raw");
                setSelectedImages(new Set());
              }}
              className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-100"
            >
              <Archive className="h-4 w-4" /> 保存到原料库
            </button>

            <button
              onClick={() => {
                onBatchSave?.(Array.from(selectedImages), "placement");
                setSelectedImages(new Set());
              }}
              className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-100"
            >
              <Send className="h-4 w-4" /> 保存到投放库
            </button>

            <button
              onClick={() => onBatchDownload?.(Array.from(selectedImages))}
              className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-100"
            >
              <Download className="h-4 w-4" /> 下载
            </button>

            <button
              onClick={() => {
                onBatchDelete?.(Array.from(selectedImages));
                setSelectedImages(new Set());
              }}
              className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" /> 删除
            </button>
          </div>
        ) : null}

        <FloatingInput
          isVisible={showFloatingInput}
          onSubmit={(data) => {
            if (reGeneratingCharacter) {
              const portraits = [
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
                "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop",
              ];
              const newAvatar = portraits[Math.floor(Math.random() * portraits.length)];
              const next = [...characters];
              next[reGeneratingCharacter.index] = {
                ...next[reGeneratingCharacter.index],
                avatar: newAvatar,
              };
              setCharacters(next);
              setToast("已根据输入重绘角色形象");
              setReGeneratingCharacter(null);
              setMediaList([]);
            } else {
              onGenerate?.(data);
              setToast("已把你的输入送进生成队列");
            }
          }}
          onOpenMediaLibrary={() => setShowImageLibrary?.(true)}
          onOpenUrlModal={() => setShowUrlModal?.(true)}
          onEditImage={setEditingMedia}
          mediaList={mediaList}
          setMediaList={setMediaList}
          reEditData={reEditData}
          isChatMode={!!planningJob}
          isPaused={planningJob?.status === "paused_planning"}
          currentStepLabel={
            planningJob?.agentPlan?.currentStep === 0
              ? "创意解析"
              : planningJob?.agentPlan?.currentStep === 1
                ? "方案规划"
                : planningJob?.agentPlan?.currentStep === 2
                  ? "分镜脚本"
                  : planningJob?.agentPlan?.currentStep === 3
                    ? "后期合成"
                    : ""
          }
          onResume={() => planningJob && onResumePlanning?.(planningJob.id)}
          reGenerateMode={!!reGeneratingCharacter}
          onCancelReGenerate={() => {
            setReGeneratingCharacter(null);
            setMediaList([]);
          }}
        />
      </motion.div>

      {planningJob ? (
        <div
          onMouseDown={startResizing}
          className={cn(
            "group absolute bottom-0 top-0 z-50 w-1.5 cursor-col-resize transition-all",
            isResizing ? "bg-[#7641FB]" : "bg-slate-100 hover:bg-[#7641FB]/20",
          )}
          style={{ left: `${leftWidth}%`, transform: "translateX(-50%)" }}
        >
          <div
            className={cn(
              "absolute left-1/2 top-1/2 flex h-8 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-sm transition-all",
              isResizing
                ? "scale-110 border-[#7641FB]"
                : "border-slate-200 group-hover:border-[#7641FB]/40",
            )}
          >
            <GripVertical
              className={cn(
                "h-3 w-3 transition-colors",
                isResizing ? "text-[#7641FB]" : "text-slate-300 group-hover:text-[#7641FB]/40",
              )}
            />
          </div>
        </div>
      ) : null}

      <AnimatePresence>
        {planningJob ? (
          <motion.div
            key="drawer"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: `${100 - leftWidth}%`, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="z-10 h-full shrink-0 overflow-hidden border-l border-slate-200 bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.02)]"
          >
            <div className="h-full w-full">
              <AgentPlanningPanel
                key={planningJob.id}
                job={planningJob}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                maxStepReached={maxStepReached}
                setMaxStepReached={setMaxStepReached}
                onConfirm={handleConfirmPlanning}
                onCancel={handleCancelPlanning}
                onUpdate={handleUpdatePlanningState}
                characters={characters}
                setCharacters={setCharacters}
                onReGenerateCharacter={handleReGenerateCharacter}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-32 left-1/2 z-[100] flex items-center gap-2 rounded-2xl bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-2xl"
            onAnimationComplete={() => {
              window.clearTimeout(window.__codexToastTimer);
              window.__codexToastTimer = window.setTimeout(() => setToast(null), 1800);
            }}
          >
            <Sparkles className="h-4 w-4 text-blue-400" />
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
