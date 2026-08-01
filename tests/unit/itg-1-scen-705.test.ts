import { extractAndApproveSuccessFactors } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-705
  test('成功・失敗要因の抽出と承認基準判定機能 - 承認基準として定義された必須キーワードが全て要因に含まれるとき、承認可能と判定される', () => {
    const required_keywords = ['顧客要望', '競合対策', '利益率向上'];
    const extracted_factors = [
      '顧客要望への対応',
      '競合製品との差別化',
      '粗利益20%以上確保'
    ];

    const result = extractAndApproveSuccessFactors(
      required_keywords,
      extracted_factors
    );

    expect(result.approval_status).toBe('承認可能');
    expect(result.matched_keywords).toHaveLength(3);
    expect(result.matched_keywords).toContain('顧客要望');
    expect(result.matched_keywords).toContain('競合対策');
    expect(result.matched_keywords).toContain('利益率向上');
  });
});