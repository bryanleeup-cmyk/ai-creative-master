import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

const mockCharacters = [
  {
    id: "c1",
    name: "知性讲师",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    id: "c2",
    name: "职场男士",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    id: "c3",
    name: "活力女孩",
    avatar:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop",
  },
  {
    id: "c4",
    name: "成熟顾问",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
  },
];

export function CharacterLibraryModal({ isOpen, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/40 p-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">角色库</h3>
                <p className="mt-1 text-sm text-slate-500">选择一个角色替换当前角色。</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
              {mockCharacters.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onConfirm?.(item);
                    onClose?.();
                  }}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition-all hover:border-violet-300 hover:bg-white hover:shadow-lg hover:shadow-violet-500/10"
                >
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="mb-4 aspect-square w-full rounded-2xl object-cover"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">{item.name}</span>
                    <CheckCircle2 className="h-4 w-4 text-slate-300 transition-colors group-hover:text-violet-500" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
