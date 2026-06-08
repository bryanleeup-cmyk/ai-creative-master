# Codex Project Guide

This file is the stable working guide for Codex in this repo. Prefer these rules over re-discovering product decisions from chat history.

## Project Shape

- This is an AI video creation workspace centered on the "AI 创编大师" flow.
- The main implemented experience is the deep creation flow: creative collection, plan design, storyboard design, and final video settings.
- Most current UI and interaction logic lives in `src/App.jsx`.
- The homepage input box is already confirmed/finalized. Do not redesign or materially alter it unless the user explicitly asks.

## Commands

- Start local dev server: `npm run dev`.
- Production build check: `npm run build`.
- The local dev port may move if a previous Vite process is still alive. Check the actual running port before telling the user what to open.
- In recent sessions the working URL has often been `http://localhost:4174/`.

## Product Vocabulary

- Use "角色" for people/personas in the product.
- Use "角色库", not "数字人库".
- Do not introduce new user-facing copy that says "数字人" when the concept is a role/persona.
- If existing legacy copy says "数字人", prefer migrating it toward "角色" when touching that area.

## Confirmed Interaction Rules

- Step 2 role changes do not immediately mutate the script outline.
- When roles change, the script outline should remain on the last synced version and show a pending sync state.
- The user must click "同步剧本" before script outline role chips and related content update.
- Script outline text and role chips should update together, not partially.
- Empty "新增分镜" slots must have a cancel path.
- Empty storyboard slots should not show decorative or duplicate icons that do not perform an action.
- A page or work area should avoid repeated titles; keep one clear title and use badges for current context such as current shot.

## Storyboard Rules

- In Step 3, "出场角色" belongs above "画面描述" and "分镜脚本".
- `@角色` suggestions inside the storyboard description/script may only include roles selected in the current shot's "出场角色".
- If a role is removed from the current shot, any invalid `@角色` references to that role should be removed from that shot's description/script.
- Default examples may include `@角色` mentions, but only when those roles are already selected for that shot.
- Adding a new storyboard slot should preserve numbering and allow the user to cancel before generating/importing content.

## Overlay Positioning

- Logo overlays should be draggable in the preview and persist per storyboard shot.
- Character picture-in-picture overlays should be draggable in the preview and persist per storyboard shot.
- Prompt text overlays should also be draggable and persist per storyboard shot.
- When an overlay can appear on the video canvas, prefer direct manipulation on the canvas over hidden-only controls.

## Modal And UI Style

- Use the "当前分镜提示语" modal as the canonical modal style unless a newer explicit reference is provided.
- Modal style: large rounded container, white header, light content background, white inner cards, fixed bottom action bar.
- Modal close buttons should match the established rounded square/button style rather than plain floating icons.
- Primary action buttons use the blue/purple gradient family already in the app.
- Secondary action buttons use the light gray style already in the app.
- Avoid nested card-on-card designs unless the inner card is a true repeated item or form group.
- Avoid adding icons that do not clarify or trigger a real action.

## Figma References

- Role library reference: `https://www.figma.com/design/WmrEX44j5u9KxZuuBD083h/codex%E6%93%8E%E8%88%B5-3.0?node-id=105-58225`.
- The Figma role library source is a drawer, but in this app it should be implemented as a modal while keeping the internal grid/filter/card style.

## Implementation Habits

- Read existing code before editing and follow local patterns.
- Prefer scoped changes in `src/App.jsx` for the current prototype unless the user asks for extraction/refactor.
- Use `apply_patch` for manual edits.
- Do not revert user changes or unrelated work.
- After UI/code changes, run `npm run build` and report whether it passed.
- If the browser cannot open localhost, first check whether the dev server port changed before assuming the app is broken.

