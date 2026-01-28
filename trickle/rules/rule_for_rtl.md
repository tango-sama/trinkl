When building RTL websites
- Always add `dir="rtl"` to the `<html>` tag.
- Use `font-family: 'Cairo', sans-serif;` or similar Arabic-friendly fonts.
- Ensure margin and padding utilities in Tailwind utilize logical properties (ms-, me-, ps-, pe-) or are correctly flipped if using left/right (ml-, mr-).
- Icons that indicate direction (like arrows) might need to be flipped.