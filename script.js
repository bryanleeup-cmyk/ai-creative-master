const navItems = document.querySelectorAll(".rail-item");
const miniItems = document.querySelectorAll(".mini-item");
const chips = document.querySelectorAll(".chip");
const featureCards = document.querySelectorAll(".feature-card");
const tabs = document.querySelectorAll(".tab");
const galleryPanel = document.getElementById("galleryPanel");
const resultPill = document.getElementById("resultPill");
const promptInput = document.getElementById("promptInput");
const sendButton = document.getElementById("sendButton");
const toast = document.getElementById("toast");

const tabCopy = {
  finished: "正在展示推荐成片",
  segment: "当前切换为片段内容",
  image: "当前切换为图片内容",
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((node) => node.classList.remove("is-active"));
    item.classList.add("is-active");
    showToast(`已切换到${item.textContent.trim()}`);
  });
});

miniItems.forEach((item) => {
  item.addEventListener("click", () => {
    showToast("该入口已接入交互占位");
  });
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chip.classList.toggle("is-active");
  });
});

featureCards.forEach((card) => {
  card.addEventListener("click", () => {
    featureCards.forEach((node) => node.classList.remove("is-selected"));
    card.classList.add("is-selected");
    showToast(`已选择${card.querySelector(".feature-name").textContent}`);
  });
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((node) => node.classList.remove("is-active"));
    tab.classList.add("is-active");
    const nextView = tab.dataset.tab;
    galleryPanel.dataset.view = nextView;
    resultPill.textContent = tabCopy[nextView];
  });
});

sendButton.addEventListener("click", () => {
  const message = promptInput.value.trim();
  if (!message) {
    promptInput.focus();
    showToast("先输入一句创意描述词");
    return;
  }

  resultPill.textContent = `已根据“${message.slice(0, 12)}${message.length > 12 ? "..." : ""}”生成预览`;
  showToast("已触发生成交互");
});
