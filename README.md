# Auto-test-tool デモ（モック）

**Auto-test-tool**（N vs N+1 回帰比較ツール）の **実UIをそのまま動かす**静的デモです。
サーバ処理（捜索・再実行・比較・レビュー）は、下記 normal/patched 比較用に用意した**固定データ**に差し替えています（API・ブラウザ自動化・課金なし）。画面も操作の流れも本物と同一です。

## 対象アプリ
同じ ToDo アプリの「正常版」と「セキュリティパッチで不具合が混入した版」を比較します。
- 修正前 N（正常版）: https://uedakazuki-plainliving.github.io/auto-test-site-demo/normal/
- 修正後 N+1（パッチ版・不具合入り）: https://uedakazuki-plainliving.github.io/auto-test-site-demo/patched/

## 操作の流れ（本物と同じ）
1. **① 捜索してテストケース生成** … N（正常版）を走査し、テストケースを生成＋ベースライン取得。
2. **② 妥当性レビュー** … 生成テストの信頼性・観点網羅・逆生成した機能一覧・**画面遷移図（走査で生成）**を表示。AIレビュー（4観点＋合議）も実行可（固定応答）。
3. **③ テストケース管理** … 業務領域＞機能のフォルダ構成でケースを一覧・編集。
4. **⑤ N+1を実行して比較** … パッチ版で再実行し、保存済みNと比較。完了すると**ダッシュボードが自動で開き**、ケース別の差分・網羅・遷移図を表示。

パッチ版で混入した3つの回帰を検出します（全10ケース中 7 PASS / 3 DIFF・一致率70%）：
1. **未完了フィルタの反転**（不具合3）
2. **記号除去でアポストロフィが消える**（不具合1）
3. **二重エスケープで `&amp;` が露出**（不具合2）

## 構成
- `index.html` … 実ツールのUIをそのまま埋め込み、`fetch('/api/*')` を canned データに差し替える shim を先頭に注入。
- `data/` … 固定データ（`suite.json`／`spec.json`／`review.html`／`aireview.json`／`summary.json`）。**実ツールのレンダラで生成**。
- `runs/demo-cmp/` … 比較ダッシュボード（`dashboard.html`／`report.html`／`testcases.xlsx`）。**実ツールのレンダラで生成**。

固定データは本体リポジトリの `scripts/build-demo-mock.ts` で再生成できます（実ツールの `compare()`／`renderDashboard()`／`renderReview()` を使用）。

## 使い方 / 公開
- ローカル: `python -m http.server` などで配信して `index.html` を開く（`file://` 直開きは fetch 制約のため不可）。
- GitHub Pages: 本リポジトリを push し、Settings → Pages でルート公開。

## 注意
- **デモ用モック**です。結果は上記比較に合わせた固定データで、実際に対象サイトへアクセスしたり AI を呼び出したりはしません。
- 本体ツール（実際に走査・比較・LLMレビューを行う版）は別リポジトリです。
