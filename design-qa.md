# Image detail modal QA

- Source visual truth: `/var/folders/yz/293cr68j0lz62znpkylf7v3w0000gn/T/codex-clipboard-fe981ee5-f7f7-4b27-a0c7-07b3149c1658.png` (homepage detail) and `/var/folders/yz/293cr68j0lz62znpkylf7v3w0000gn/T/codex-clipboard-4c961494-2d7d-4c0f-86e8-3dd05de41a82.png` (generated-image detail / re-edit state).
- Implementation: `http://localhost:4173/`, in-app Browser runtime at the local preview viewport.
- State: homepage image selected → `一键同款` opens the inline super composer; generated image selected → full secondary editing actions remain available → `重新编辑` opens that same composer → send enters generation.

## Full-view comparison evidence

The comparison covers the Figma large detail overlay and the rendered modal states. The implementation preserves the app rail, uses a full-height overlay over the workspace, gives the image canvas the primary area, and uses a 437 px details rail. The supplied image content and its ratio are dynamic, so the source's 16:9 gift-box art is compared as an image-slot layout rather than as a literal asset match.

## Focused region comparison evidence

The right information rail and the re-edit composer were reviewed as the focused regions. Homepage detail exposes only the close action and the fixed blue-purple `一键同款` CTA, matching the first reference. Generated-image detail keeps its download, information, image-edit and `重新编辑` actions, matching the second reference. Both CTAs open the existing `InputComposer` beneath the shifted image rather than creating a duplicate input implementation.

## Findings

No actionable P0/P1/P2 findings remain.

- Accepted content variance: the local prototype intentionally displays its existing homepage images and generated creative description, not the Figma gift-box example.
- P3: At narrow mobile widths the overlay stacks the image and information rail vertically instead of preserving the desktop side-by-side composition. This prevents clipping and retains every action, which is preferable to shrinking the rail below usable width.

## Fidelity surfaces

- Fonts and typography: PingFang SC / Microsoft YaHei fallback and the existing app's 20 px modal heading, 14 px body text, and 12 px metadata hierarchy remain consistent with the reference.
- Spacing and layout rhythm: desktop detail rail is 437 px; the re-edit composer is constrained to 832 px and appears below the shifted image.
- Colors and visual tokens: white canvas and rail, light gray action surfaces, muted metadata chips, and the existing blue-violet composer accent match the source system.
- Image quality and asset fidelity: generated/homepage images remain raster `<img>` assets at their original ratio; no CSS-drawn image replacements were introduced.
- Copy and content: homepage uses `一键同款` as its sole detail CTA; generated-image detail uses `图片编辑` / `更多` / `重新编辑` / `再次生成`; the app’s existing generation settings stay visible in the real composer.

## Interaction checks

- Homepage `查看图片详情 1` opens the large in-place image detail overlay with exactly one `一键同款` CTA and no secondary edit actions.
- Generated-image `查看图片 1` exposes `去编辑器` and exactly one `重新编辑` action, without an `一键同款` CTA.
- Both `一键同款` and `重新编辑` reveal exactly one `image-detail-reedit-composer` with one editable textbox.
- Submitting an edited prompt closes the overlay and enters the existing generation state; no console warnings or errors were reported.
- The compact viewport keeps image detail content and controls accessible through a stacked, scrollable layout.

## Patches since the previous QA pass

- Connected homepage image cards to detail state and added accessible per-image labels.
- Split homepage and generated-image detail actions: homepage now has only `一键同款`; generated images retain their secondary editing actions.
- Reused `InputComposer` for both entry points and routed its submit to the existing generation flow.
- Kept the desktop app rail visible behind the workspace overlay and matched the 437 px Figma detail rail.
- Added a compact stacked layout to prevent the detail rail from clipping at mobile widths.

## Implementation checklist

- [x] Homepage images open the shared large detail modal.
- [x] Homepage `一键同款` and generated-image `重新编辑` both open the same in-modal composer and move the image upward.
- [x] Send submits through the existing generation workflow.
- [x] Production build and rendered interaction checks pass.

final result: passed
