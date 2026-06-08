import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  History,
  Info,
  MonitorSmartphone,
  RefreshCcw,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

const ONE_CLICK_STYLE_OPTIONS = [
  {
    id: "portrait",
    label: "人像摄影",
    image: "https://www.figma.com/api/mcp/asset/812407df-3b5e-49a4-8245-cf4074556296",
  },
  {
    id: "ink",
    label: "古风水墨",
    image: "https://www.figma.com/api/mcp/asset/4313bde1-6eca-40ba-b284-89a1e947ac98",
  },
  {
    id: "3d",
    label: "3D建模",
    image: "https://www.figma.com/api/mcp/asset/c86b2a61-3f0e-489f-ab37-2198b789bf07",
  },
  {
    id: "home",
    label: "家居摄影",
    image: "https://www.figma.com/api/mcp/asset/188e735d-d44e-4c06-bfbd-57202e9e1514",
  },
];

const ONE_CLICK_TEMPLATE_CARDS = [
  {
    id: "tpl-1",
    title: "教育招生模版",
    desc: "主标题 + 卖点 + 按钮区",
    image: "https://www.figma.com/api/mcp/asset/f0242976-d457-488b-97a2-7a4e328a3108",
  },
  {
    id: "tpl-2",
    title: "国风海报模版",
    desc: "竖版信息流投放",
    image: "https://www.figma.com/api/mcp/asset/5ddb1724-c8ed-4af5-9483-edc8e8dbff4c",
  },
  {
    id: "tpl-3",
    title: "活动促销模版",
    desc: "电商促销与利益点强化",
    image: "https://www.figma.com/api/mcp/asset/ecf08812-b7f5-4054-bb88-7b89b475f62c",
  },
];

const ONE_CLICK_INSPIRATIONS = [
  "https://www.figma.com/api/mcp/asset/6ae59f72-f02b-4406-9dcc-5b32326c5ea3",
  "https://www.figma.com/api/mcp/asset/3c0b4baa-38f3-4bad-8271-1c3832793b76",
  "https://www.figma.com/api/mcp/asset/f35247c4-bb35-4e05-ad69-5981b2eddb5b",
  "https://www.figma.com/api/mcp/asset/da089d84-d10c-4362-95d5-9025aa0d063b",
  "https://www.figma.com/api/mcp/asset/db628158-1925-4394-b9b1-3957aeaaac74",
  "https://www.figma.com/api/mcp/asset/eae13ed4-c00f-41cc-a4c4-2384a0f03a98",
  "https://www.figma.com/api/mcp/asset/be8d595e-6274-4ded-a8cf-1801ba7fbc0e",
  "https://www.figma.com/api/mcp/asset/e731d5a6-d16a-4216-8899-02bf45d293e9",
];

const ONE_CLICK_RESULT_LIBRARY = [
  {
    id: "seed-1",
    count: 2,
    ratio: "1:1",
    subtitle: "卡通风格",
    prompt: "神农尝百草，日遇七十二毒，得茶而解之。",
    images: [
      "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=900&h=900&fit=crop",
    ],
  },
  {
    id: "seed-2",
    count: 4,
    ratio: "4:3",
    subtitle: "国风海报",
    prompt: "神农尝百草，日遇七十二毒，得茶而解之，茶最早作为药用被发现。",
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1200&fit=crop",
    ],
  },
];

function WorkbenchSelect({ icon: Icon, value, className, compact = false }) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-2 rounded-[10px] border border-[#ebeff6] bg-[#f5f8fe] px-3 text-left text-[14px] text-[#191b1e] transition-colors hover:border-[#d7e5ff]",
        compact ? "h-[40px]" : "h-[44px]",
        className,
      )}
    >
      {Icon ? <Icon className="h-4 w-4 text-[#6f7786]" strokeWidth={2} /> : null}
      <span className="min-w-0 flex-1 truncate">{value}</span>
      <ChevronDown className="h-4 w-4 text-[#8b94a5]" strokeWidth={2} />
    </button>
  );
}

function ResultGroup({ group, selectedKey, onSelect, isGenerating }) {
  const gridClass =
    group.images.length === 2
      ? "grid-cols-2"
      : group.images.length === 1
        ? "grid-cols-1"
        : "grid-cols-2 xl:grid-cols-4";

  return (
    <div className="rounded-[20px] border border-[#edf1f6] bg-white p-5 shadow-[0_10px_28px_rgba(112,130,168,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#7d8696]">
            <span className="text-[15px] font-semibold text-[#191b1e]">已为您生成{group.count}张底图</span>
            <span className="rounded-[6px] bg-[#f4f6fb] px-2 py-0.5 text-[12px] text-[#5c6575]">{group.ratio}</span>
            <span>{group.timeLabel}</span>
          </div>
          <div className="mt-2 text-[13px] text-[#8b93a3]">{group.subtitle}</div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-[10px] px-2 py-1 text-[14px] font-medium text-[#5e89ff] transition-colors hover:bg-[#f5f8ff]"
        >
          <History className="h-4 w-4" strokeWidth={2} />
          重新生成
        </button>
      </div>
      <div className="mt-3 rounded-[12px] bg-[#fbfcff] px-3 py-2 text-[13px] leading-5 text-[#5f6778]">
        {group.prompt}
      </div>
      <div className={cn("mt-4 grid gap-[2px]", gridClass)}>
        {group.images.map((image, index) => {
          const imageKey = `${group.id}-${index}`;
          const selected = selectedKey === imageKey;
          return (
            <button
              type="button"
              key={imageKey}
              onClick={() => onSelect(imageKey)}
              className={cn(
                "group relative overflow-hidden rounded-[2px] bg-[linear-gradient(135deg,#f4f8ff_0%,#f7f4ff_100%)] text-left",
                group.images.length === 2 ? "aspect-[16/11]" : "aspect-[3/4]",
                selected && "ring-2 ring-[#6a8dff] ring-offset-2 ring-offset-white",
              )}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
              {selected ? (
                <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-[8px] border border-[#7aa0ff] bg-white text-[#5d89ff] shadow-[0_8px_16px_rgba(78,113,206,0.18)]">
                  <div className="h-4 w-4 rounded-[4px] border-2 border-current" />
                </div>
              ) : null}
              {isGenerating ? (
                <div className="absolute inset-x-0 top-4 flex justify-center">
                  <span className="rounded-full bg-white/92 px-5 py-2 text-[14px] font-semibold text-[#4f6bff] shadow-[0_8px_18px_rgba(123,140,180,0.08)]">
                    生成中99%
                  </span>
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InspirationRail() {
  return (
    <aside className="hidden h-[780px] rounded-[20px] bg-white p-4 shadow-[0_16px_36px_rgba(115,134,174,0.08)] xl:flex xl:w-[125px] xl:flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[14px] font-semibold text-[#191b1e]">图片灵感</div>
        <SlidersHorizontal className="h-4 w-4 text-[#7f8797]" strokeWidth={2} />
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="space-y-[2px] overflow-hidden">
          {ONE_CLICK_INSPIRATIONS.map((image, index) => (
            <div key={image + index} className="overflow-hidden rounded-[4px]">
              <img src={image} alt="" className={cn("w-full object-cover", index % 3 === 1 ? "h-[52px]" : "h-[93px]")} />
            </div>
          ))}
        </div>
        <div className="absolute left-[-10px] top-1/2 flex h-[59px] w-5 -translate-y-1/2 items-center justify-center rounded-[6px] border border-[rgba(102,146,222,0.15)] bg-white shadow-[0_8px_18px_rgba(120,136,176,0.08)]">
          <ChevronLeft className="h-4 w-4 text-[#7b8392]" strokeWidth={2} />
        </div>
      </div>
    </aside>
  );
}

function OneClickImageWorkbench({ tool, onBack }) {
  const timerRef = useRef(null);
  const [prompt, setPrompt] = useState("身穿着正装的亚洲年轻女性律师，手持法典，微笑自信，办公室背景，五官精致，专业风格，全身照，超高清");
  const [ratio, setRatio] = useState("16:9");
  const [resolution, setResolution] = useState("1920*1080");
  const [count, setCount] = useState("4");
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [referenceUploaded, setReferenceUploaded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedResultKey, setSelectedResultKey] = useState("seed-1-0");
  const [resultGroups, setResultGroups] = useState(() => {
    const now = new Date();
    return ONE_CLICK_RESULT_LIBRARY.map((group, index) => ({
      ...group,
      timeLabel: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(16 + index).padStart(2, "0")}:${index === 0 ? "51" : "37"}`,
    }));
  });

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const charCount = prompt.trim().length;
  const canGenerate = Boolean(prompt.trim()) && !isGenerating;
  const currentTemplateCards = useMemo(
    () => ONE_CLICK_TEMPLATE_CARDS.map((item, index) => ({ ...item, active: index === selectedStyle % ONE_CLICK_TEMPLATE_CARDS.length })),
    [selectedStyle],
  );

  const handleGenerate = () => {
    if (!canGenerate) return;
    window.clearTimeout(timerRef.current);
    setIsGenerating(true);
    timerRef.current = window.setTimeout(() => {
      const base = ONE_CLICK_RESULT_LIBRARY[(selectedStyle + resultGroups.length) % ONE_CLICK_RESULT_LIBRARY.length];
      const nextStamp = new Date();
      const nextGroup = {
        ...base,
        id: `generated-${Date.now()}`,
        ratio,
        count: Number(count),
        subtitle: ONE_CLICK_STYLE_OPTIONS[selectedStyle]?.label || base.subtitle,
        prompt,
        timeLabel: `${nextStamp.getFullYear()}-${String(nextStamp.getMonth() + 1).padStart(2, "0")}-${String(nextStamp.getDate()).padStart(2, "0")} ${String(nextStamp.getHours()).padStart(2, "0")}:${String(nextStamp.getMinutes()).padStart(2, "0")}`,
      };
      setResultGroups((prev) => [nextGroup, ...prev]);
      setSelectedResultKey(`${nextGroup.id}-0`);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="h-full overflow-y-auto pb-10 pt-[80px] scrollbar-hide">
      <div className="mx-auto max-w-[1392px] px-6">
        <div className="grid gap-4 xl:grid-cols-[420px_minmax(0,1fr)_125px]">
          <div className="xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,#f3f8ff_0%,#f9f8ff_100%)] p-4 shadow-[0_18px_42px_rgba(123,140,180,0.09)]">
              <div className="mb-4 flex h-8 items-center gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex h-5 w-5 items-center justify-center text-[#191b1e]"
                  aria-label="返回工具列表"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
                </button>
                <div className="h-4 w-px bg-[#d3d9e6]" />
                <div className="text-[18px] font-medium leading-[26px] text-[#191b1e]">{tool?.title || "一键出图"}</div>
              </div>

              <div className="space-y-3">
                <div className="rounded-[14px] bg-white p-4 shadow-[0_10px_24px_rgba(117,135,170,0.05)]">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[16px] font-medium text-black">
                      <span>图片生成</span>
                      <span className="text-[#d9150b]">*</span>
                    </div>
                    <ChevronDown className="h-[18px] w-[18px] text-[#6b7484]" strokeWidth={2} />
                  </div>

                  <div className="mb-3">
                    <div className="mb-2 flex items-center gap-1 text-[14px] text-[#191b1e]">
                      <span>创意描述</span>
                      <Info className="h-4 w-4 text-[#b3bac8]" strokeWidth={2} />
                    </div>
                    <div className="rounded-[6px] bg-[rgba(110,160,247,0.07)] px-3 py-2">
                      <textarea
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        className="h-[132px] w-full resize-none border-none bg-transparent p-0 text-[14px] leading-5 text-[rgba(80,90,107,0.95)] outline-none placeholder:text-[rgba(80,90,107,0.75)]"
                        placeholder="请尝试分别描述画面上想要出现的主体及场景"
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-full bg-[linear-gradient(95deg,#efe8ff_0%,#e5fcff_100%)] px-2.5 py-1 text-[12px] font-medium text-[#3a5bfd]"
                        >
                          <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                          AI扩写
                        </button>
                        <div className="flex items-center gap-3 text-[14px] text-[#848b99]">
                          <span>{charCount}/200</span>
                          <button type="button" onClick={() => setPrompt("")} className="text-[#3a5bfd]">
                            清空
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="mb-2 flex items-center gap-1 text-[14px] text-[#191b1e]">
                      <span>参考图</span>
                      <Info className="h-4 w-4 text-[#b3bac8]" strokeWidth={2} />
                    </div>
                    {referenceUploaded ? (
                      <div className="flex items-center justify-between rounded-[6px] bg-[rgba(110,160,247,0.07)] p-2">
                        <div className="flex items-center gap-3">
                          <div className="h-16 w-16 overflow-hidden rounded-[4px] bg-[#dfe7f7]">
                            <img src={ONE_CLICK_STYLE_OPTIONS[selectedStyle].image} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white px-2 py-1 text-[12px] text-[#4b6bff]">
                              <span>参考整体</span>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-[12px] text-[#6d7585]">
                              <span>强度</span>
                              <div className="h-1.5 w-24 rounded-full bg-[#dfe7f5]">
                                <div className="h-full w-1/2 rounded-full bg-[#5e8fff]" />
                              </div>
                              <span>中</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-[#4b6bff]">
                          <button type="button" className="rounded-full bg-white p-2 shadow-[0_6px_14px_rgba(123,140,180,0.08)]">
                            <Sparkles className="h-4 w-4" strokeWidth={2} />
                          </button>
                          <button type="button" className="rounded-full bg-white p-2 shadow-[0_6px_14px_rgba(123,140,180,0.08)]">
                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setReferenceUploaded(true)}
                        className="flex h-14 w-full items-center justify-center gap-2 rounded-[6px] border border-dashed border-[#5e99ff] bg-[rgba(110,160,247,0.07)] text-[14px] text-[#0054e6]"
                      >
                        <CirclePlus className="h-4 w-4" strokeWidth={2} />
                        上传图片
                      </button>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="mb-2 flex items-center justify-between text-[14px] text-[#191b1e]">
                      <span>创意风格</span>
                      <button type="button" className="text-[12px] text-[#d2d8e4]">
                        扣取文字
                      </button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                      {ONE_CLICK_STYLE_OPTIONS.map((style, index) => (
                        <button
                          type="button"
                          key={style.id}
                          onClick={() => setSelectedStyle(index)}
                          className={cn(
                            "relative h-[74px] w-[74px] shrink-0 overflow-hidden rounded-[6px]",
                            index === selectedStyle && "ring-2 ring-[#6a90ff] ring-offset-2 ring-offset-white",
                          )}
                        >
                          <img src={style.image} alt="" className="h-full w-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_100%)] px-1.5 pb-2 pt-5 text-center text-[12px] font-semibold text-white">
                            {style.label}
                          </div>
                        </button>
                      ))}
                      <button
                        type="button"
                        className="flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-[6px] bg-[rgba(110,160,247,0.07)] text-[12px] text-[#3a5bfd]"
                      >
                        更多风格
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="mb-2 text-[14px] text-[#191b1e]">比例尺寸</div>
                    <div className="grid grid-cols-2 gap-3">
                      <WorkbenchSelect icon={MonitorSmartphone} value={ratio} compact />
                      <WorkbenchSelect value={resolution} compact />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setReferenceUploaded(false);
                          setPrompt("");
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[rgba(110,160,247,0.07)] text-[#6d7585]"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                      </button>
                      <WorkbenchSelect value={count} compact className="w-[62px] bg-[#f5f8fe]" />
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={!canGenerate}
                      className={cn(
                        "inline-flex h-10 w-[140px] items-center justify-center gap-2 rounded-[6px] px-4 text-[14px] font-medium text-white transition-all",
                        canGenerate
                          ? "bg-[linear-gradient(90deg,#9d6dff_0%,#5f82ff_49%,#67a4ff_100%)] shadow-[0_10px_20px_rgba(103,133,255,0.2)]"
                          : "bg-[linear-gradient(90deg,#d9e1f0_0%,#cbd4e6_50%,#dae2f1_100%)] text-white/85",
                      )}
                    >
                      <Sparkles className={cn("h-4 w-4", !canGenerate && "opacity-60")} strokeWidth={2} />
                      {isGenerating ? "生成中..." : "开始生成"}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="flex h-[54px] w-full items-center justify-between rounded-[12px] bg-white px-4 text-[16px] font-medium text-[#191b1e] shadow-[0_10px_24px_rgba(117,135,170,0.05)]"
                >
                  <span>模板添加</span>
                  <ChevronRight className="h-[18px] w-[18px] text-[#6d7585]" strokeWidth={2} />
                </button>

                <div className="grid grid-cols-3 gap-3 rounded-[12px] bg-white p-4 shadow-[0_10px_24px_rgba(117,135,170,0.05)]">
                  {currentTemplateCards.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={cn(
                        "overflow-hidden rounded-[10px] border bg-[#fbfcff] text-left transition-all",
                        item.active ? "border-[#bfd0ff] shadow-[0_8px_18px_rgba(95,130,255,0.12)]" : "border-[#eef2f7]",
                      )}
                    >
                      <div className="aspect-[16/9] overflow-hidden">
                        <img src={item.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="p-2">
                        <div className="text-[12px] font-medium text-[#191b1e]">{item.title}</div>
                        <div className="mt-1 text-[11px] leading-4 text-[#8a93a3]">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <section className="rounded-[24px] bg-white p-4 shadow-[0_18px_42px_rgba(123,140,180,0.08)]">
            <div className="flex items-center justify-between border-b border-[#eef2f8] pb-4">
              <div className="text-[18px] font-semibold text-[#191b1e]">生成结果</div>
              <button type="button" className="inline-flex items-center gap-2 text-[14px] font-medium text-[#5e89ff]">
                <History className="h-4 w-4" strokeWidth={2} />
                生成历史
              </button>
            </div>
            <div className="space-y-6 pt-5">
              {resultGroups.map((group, index) => (
                <ResultGroup
                  key={group.id}
                  group={group}
                  selectedKey={selectedResultKey}
                  onSelect={setSelectedResultKey}
                  isGenerating={isGenerating && index === 0}
                />
              ))}
            </div>
            <div className="pt-5 text-center text-[12px] leading-5 text-[#9aa2b2]">
              您所提交的内容应合法合规，且不得侵犯百度或第三人合法权益。您在本平台生成的内容仅限于平台内推广设置时使用。
            </div>
          </section>

          <InspirationRail />
        </div>
      </div>
    </div>
  );
}

function PlaceholderWorkbench({ tool, onBack }) {
  return (
    <div className="h-full overflow-y-auto pb-10 pt-[80px] scrollbar-hide">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="rounded-[28px] border border-white/70 bg-white/80 p-8 shadow-[0_18px_42px_rgba(123,140,180,0.08)] backdrop-blur">
          <div className="mb-8 flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f8ff] text-[#202634]"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
            </button>
            <div>
              <div className="text-[24px] font-semibold text-[#202634]">{tool?.title}</div>
              <div className="mt-1 text-[14px] text-[#8b93a3]">这个工具页建议接入统一 ToolWorkbench 壳层，沿用左参数区 + 中结果区 + 右参考区结构。</div>
            </div>
          </div>
          <div className="rounded-[22px] border border-dashed border-[#dbe4f6] bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)] px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#eef2ff_0%,#e6fbff_100%)] text-[#5f82ff]">
              <Upload className="h-7 w-7" strokeWidth={2} />
            </div>
            <div className="mt-4 text-[18px] font-semibold text-[#202634]">先保留现有业务逻辑，外面统一套壳</div>
            <div className="mt-2 text-[14px] leading-6 text-[#7d8696]">
              后续如果你确认这条方向，我可以继续把「智能扩图 / 智能抠图 / 模板制图」按同样的骨架一批批接进来。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ToolWorkbenchPage({ tool, onBack }) {
  if (tool?.id === "tool-image-one-click") {
    return <OneClickImageWorkbench tool={tool} onBack={onBack} />;
  }

  return <PlaceholderWorkbench tool={tool} onBack={onBack} />;
}
