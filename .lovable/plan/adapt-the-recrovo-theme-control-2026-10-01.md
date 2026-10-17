# Adapt the Recrovo theme control

## What will change
- Replace the current single-icon theme menu trigger with the pasted compact sun/moon sliding toggle style.
- Keep the control at the far right of the header, before microphone and camera controls.
- Preserve all three existing choices: Light, Dark, and Default (device setting).
- Keep the existing saved preference and automatic device-theme updates.

## Interaction
- Clicking the slider switches directly between Light and Dark.
- A small adjacent menu affordance exposes Default without reintroducing the removed display-status control.
- Tooltips and accessible labels will clearly identify both actions.

## Technical details
- Add a reusable theme-control component under the existing UI component folder.
- Use the existing semantic color tokens, shadcn Button/menu primitives, and Lucide Sun/Moon icons.
- Avoid `next-themes`; the app’s current theme state remains authoritative.
- Verify Light, Dark, and Default in the live preview and confirm the fixed-height layout remains intact.
