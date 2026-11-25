"use client";

import { Fragment } from "react";

/** Enough Markdown for the two legal documents (MarkdownBody in Flutter): headings, bold, italics, links, lists, paragraphs. */
function inline(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\)|\*[^*\s][^*]*\*|_[^_\s][^_]*_)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const token = match[0];
    const k = `${key}-${i++}`;
    if (token.startsWith("**")) out.push(<strong key={k}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith("[")) {
      const m = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token);
      const href = m?.[2] ?? "";
      const safe = /^(https?:|mailto:|tel:)/i.test(href) ? href : undefined;
      out.push(
        <a key={k} href={safe} target="_blank" rel="noopener noreferrer" style={{ color: "var(--vc-teal-ink, var(--vc-navy))", fontWeight: 600 }}>
          {m?.[1] ?? token}
        </a>,
      );
    } else out.push(<em key={k}>{token.slice(1, -1)}</em>);
    last = match.index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function splitMarkdownTitle(markdown: string, fallback: string): { title: string; body: string } {
  const text = markdown.trimStart();
  const end = text.indexOf("\n");
  const first = (end < 0 ? text : text.slice(0, end)).trim();
  const heading = /^(?:#{1,6}\s+(.+)|\*\*(.+)\*\*)$/.exec(first);
  if (!heading) return { title: fallback, body: markdown };
  return { title: (heading[1] ?? heading[2]).trim(), body: end < 0 ? "" : text.slice(end + 1).trimStart() };
}

export function Markdown({ source }: { source: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = source.replace(/\r/g, "").split("\n");
  let sec = 0;
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flushPara = () => {
    if (para.length) {
      const k = `p${blocks.length}`;
      blocks.push(
        <p key={k} className="md-p">
          {para.map((line, i) => (
            <Fragment key={i}>
              {i > 0 ? <br /> : null}
              {inline(line.trim(), `${k}-${i}`)}
            </Fragment>
          ))}
        </p>,
      );
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      const k = `l${blocks.length}`;
      const Tag = list.ordered ? "ol" : "ul";
      blocks.push(
        <Tag key={k} className="md-list">
          {list.items.map((item, i) => (
            <li key={i}>{inline(item, `${k}-${i}`)}</li>
          ))}
        </Tag>,
      );
      list = null;
    }
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    const h = /^(#{1,6})\s+(.*)$/.exec(line.trim());
    const rule = /^\s*([-*_])\1{2,}\s*$/.test(line);
    const bullet = /^\s*[-*+]\s+(.*)$/.exec(line);
    const numbered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    if (!line.trim()) {
      flushPara();
      flushList();
    } else if (rule) {
      flushPara();
      flushList();
      blocks.push(<hr key={`r${blocks.length}`} className="md-rule" />);
    } else if (h) {
      flushPara();
      flushList();
      const level = h[1].length;
      const num = level === 2 ? /^(\d+)\.\s+(.*)$/.exec(h[2]) : null;
      blocks.push(
        <div key={`h${blocks.length}`} className={`md-h md-h${Math.min(level, 4)}`} {...(level === 2 ? { "data-sec": sec++ } : {})}>
          {num ? <span className="md-num">{num[1]}</span> : null}
          <span>{inline(num ? num[2] : h[2], `h${blocks.length}`)}</span>
        </div>,
      );
    } else if (bullet || numbered) {
      flushPara();
      const ordered = Boolean(numbered);
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push((bullet ?? numbered)![1]);
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return <div className="vita-md">{blocks}</div>;
}

/** Level-2 headings of a Markdown document, in order (for the legal dialog's contents list). */
export function markdownSections(markdown: string): string[] {
  return markdown
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => /^##\s+(.*)$/.exec(l.trim())?.[1])
    .filter((x): x is string => Boolean(x))
    .map((x) => x.replace(/\*\*/g, ""));
}
