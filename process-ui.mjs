// 実ツールの最新UI(_ui_raw.html)をデモ用 index.html に変換する（再取り込み用）。
// - 画面遷移図の入力 details を除去
// - '/runs/' を相対 'runs/' に
// - 既存 index.html から shim+バナー ブロックを取り出して再注入
import { readFileSync, writeFileSync } from "node:fs";

const raw0 = readFileSync("_ui_raw.html", "utf8");
const cur = readFileSync("index.html", "utf8");

// 1) 既存 index.html から注入ブロック（shim + デモバナー）を抽出
const startMark = "<!-- ==== デモ(モック) shim";
const injectStart = cur.indexOf(startMark);
const headerIdx = cur.indexOf("<header>", injectStart);
if (injectStart < 0 || headerIdx < 0) { console.error("既存の shim ブロックが見つかりません"); process.exit(1); }
const injectBlock = cur.slice(injectStart, headerIdx); // shim script + banner div

// 2) 遷移図の入力 details を除去（summary をアンカーに details ブロックごと削除）
let raw = raw0;
const sumIdx = raw.indexOf("🗺 仕様の画面遷移図（Mermaid");
if (sumIdx >= 0) {
  const detStart = raw.lastIndexOf("<details>", sumIdx);
  const detEnd = raw.indexOf("</details>", sumIdx);
  if (detStart >= 0 && detEnd >= 0) raw = raw.slice(0, detStart) + raw.slice(detEnd + "</details>".length);
}

// 3) '/runs/' を相対に
raw = raw.split("withTok('/runs/").join("withTok('runs/");

// 4) </head><body> の直後に注入ブロックを挿入
const bodyMark = "</head><body>";
const bi = raw.indexOf(bodyMark);
if (bi < 0) { console.error("<body> が見つかりません"); process.exit(1); }
const out = raw.slice(0, bi + bodyMark.length) + "\n" + injectBlock + raw.slice(bi + bodyMark.length);

writeFileSync("index.html", out);
console.log("index.html を再生成しました（size=" + out.length + "）");
