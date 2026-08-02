import { detectAndVisualizeDataQualityIssues } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 検出問題パターンの可視化', () => {
  test('SCEN-1191: 入力漏れエラーの件数がちょうど10件の場合、件数が正確に集計される', () => {
    // 準備: 入力漏れエラーが正確に10件含まれるサンプルデータセット
    const sampleDataset = [
      // 入力漏れエラー: 顧客名が空
      { customerId: 'C001', customerName: '', salesAmount: 100000, contactDate: '2024-01-15' },
      // 入力漏れエラー: 営業金額が空
      { customerId: 'C002', customerName: '顧客A', salesAmount: '', contactDate: '2024-01-16' },
      // 入力漏れエラー: 接触日が空
      { customerId: 'C003', customerName: '顧客B', salesAmount: 50000, contactDate: '' },
      // 入力漏れエラー: 顧客IDが空
      { customerId: '', customerName: '顧客C', salesAmount: 75000, contactDate: '2024-01-17' },
      // 入力漏れエラー: 複数フィールド欠損
      { customerId: 'C005', customerName: '', salesAmount: '', contactDate: '2024-01-18' },
      // 入力漏れエラー: 顧客名が空
      { customerId: 'C006', customerName: '', salesAmount: 120000, contactDate: '2024-01-19' },
      // 入力漏れエラー: 営業金額が空
      { customerId: 'C007', customerName: '顧客D', salesAmount: '', contactDate: '2024-01-20' },
      // 入力漏れエラー: 接触日が空
      { customerId: 'C008', customerName: '顧客E', salesAmount: 90000, contactDate: '' },
      // 入力漏れエラー: 顧客IDが空
      { customerId: '', customerName: '顧客F', salesAmount: 60000, contactDate: '2024-01-21' },
      // 入力漏れエラー: 顧客名が空
      { customerId: 'C010', customerName: '', salesAmount: 110000, contactDate: '2024-01-22' },
      // 正常データ
      { customerId: 'C011', customerName: '顧客G', salesAmount: 85000, contactDate: '2024-01-23' },
      // 正常データ
      { customerId: 'C012', customerName: '顧客H', salesAmount: 95000, contactDate: '2024-01-24' },
    ];

    // 実行: 検出問題パターンの可視化機能にデータセットを入力
    const result = detectAndVisualizeDataQualityIssues(sampleDataset);

    // 検証: 入力漏れエラーの件数が正確に10と表示される
    expect(result.missingFieldErrorCount).toBe(10);

    // 検証: 集計値がデータセット内の実際のエラー件数と一致する
    expect(result.missingFieldErrorCount).toEqual(10);

    // 検証: レポート内の不整合分類に入力漏れが含まれている
    expect(result.issuePatterns).toContain('missing_field');

    // 検証: 全体の問題件数が正確に集計されている（10件の入力漏れ + その他の問題）
    expect(result.totalIssueCount).toBeGreaterThanOrEqual(10);
  });
});