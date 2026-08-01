import { checkFactorConsistency } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-719
  test('成功・失敗要因の抽出と承認基準判定機能 - 要因抽出の整合性チェックで相互矛盾が検出され警告フラグが立つ', () => {
    const testData = {
      salesCaseId: 'CASE-001',
      successFactors: ['顧客の予算確保'],
      failureFactors: ['顧客の予算不足'],
    };

    const result = checkFactorConsistency(testData);

    expect(result.warningFlag).toBe(true);
    expect(result.warningMessage).toBe(
      '成功要因「顧客の予算確保」と失敗要因「顧客の予算不足」が相互矛盾しています'
    );
    expect(result.contradictoryFactorPairs).toEqual([
      {
        successFactor: '顧客の予算確保',
        failureFactor: '顧客の予算不足',
      },
    ]);
  });
});