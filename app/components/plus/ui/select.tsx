"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowDown2, TickCircle } from "iconsax-react";
import { cx } from "./vita";

export type SelectOption<T extends string> = { value: T; label: string };

/**
 * Themed dropdown used everywhere instead of the native <select> (WebKit ignores most <select>/<option>
 * styling, so its menu stayed white in dark mode). A button + listbox popover drawn with the theme tokens:
 * same look in light and dark, flat underline field, keyboard support (arrows, Home/End, Enter, Escape, type-ahead).
 */
export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  placeholder,
  testId,
  compact = false,
  style,
}: {
  label?: string;
  value: T | "";
  options: Array<SelectOption<T>>;
  onChange: (value: T) => void;
  placeholder?: string;
  testId?: string;
  /** No label row, for inline use next to another field. */
  compact?: boolean;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [up, setUp] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const baseId = useId();
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const current = options.find((o) => o.value === value);

  const close = useCallback((focus = true) => {
    setOpen(false);
    if (focus) button.current?.focus();
  }, []);

  const openMenu = () => {
    const rect = wrap.current?.getBoundingClientRect();
    setUp(!!rect && window.innerHeight - rect.bottom < 260 && rect.top > 260);
    setActive(selectedIndex);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent | TouchEvent) => {
      if (wrap.current && !wrap.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    list.current?.focus();
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const pick = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    close();
  };

  const onListKey = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") setActive((i) => Math.min(options.length - 1, i + 1));
    else if (event.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
    else if (event.key === "Home") setActive(0);
    else if (event.key === "End") setActive(options.length - 1);
    else if (event.key === "Enter" || event.key === " ") pick(active);
    else if (event.key === "Escape" || event.key === "Tab") close(event.key === "Escape");
    else if (event.key.length === 1) {
      const now = Date.now();
      typed.current = { text: (now - typed.current.at < 700 ? typed.current.text : "") + event.key.toLowerCase(), at: now };
      const hit = options.findIndex((o) => o.label.toLowerCase().startsWith(typed.current.text));
      if (hit >= 0) setActive(hit);
      return;
    } else return;
    event.preventDefault();
  };

  return (
    <div ref={wrap} className={cx("vita-select", open && "open", compact && "compact")} style={style}>
      <button
        ref={button}
        type="button"
        className="vita-select-field"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${baseId}-list`}
        aria-label={label}
        data-testid={testId}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={(event) => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            openMenu();
          }
        }}
      >
        <span className="vita-select-text">
          {label && !compact ? <span className="vita-select-label">{label}</span> : null}
          <span className={cx("vita-select-value", !current && "empty")}>{current?.label ?? placeholder ?? "—"}</span>
        </span>
        <ArrowDown2 size={18} color="currentColor" className="vita-select-chev" />
      </button>
      {open ? (
        <ul
          ref={list}
          id={`${baseId}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${baseId}-opt-${active}`}
          className={cx("vita-select-menu", up && "up")}
          onKeyDown={onListKey}
        >
          {options.map((option, index) => {
            const selected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${baseId}-opt-${index}`}
                role="option"
                aria-selected={selected}
                data-index={index}
                className={cx("vita-select-option", selected && "selected", index === active && "active")}
                onMouseEnter={() => setActive(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pick(index)}
              >
                <span>{option.label}</span>
                {selected ? <TickCircle size={18} variant="Bold" color="currentColor" /> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
