import { validateSuccessFailureFactors } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-702
  test('[error] 成功・失敗要因の抽出と承認基準判定機能 - 要因テキストが空文字列のとき、承認基準判定で不適切と判定される', () => {
    const salesCaseId = 'CASE-20240115-001';
    const factorCategory = 'success_approach';
    const factorText = '';
    const extractedAt = new Date('2024-01-15T10:30:00Z');

    const result = validateSuccessFailureFactors({
      salesCaseId,
      factorCategory,
      factorText,
      extractedAt,
    });

    expect(result.isApproved).toBe(false);
    expect(result.reason).toMatch(/要因テキスト/);
  });
});