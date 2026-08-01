import { assessSuccessPatternApplicability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-257
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 購買金額下限が顧客予算と完全一致する場合、適用可能と判定される', () => {
    const successPatternId = 'pattern_001';
    const successPatterns = [
      {
        id: successPatternId,
        minPurchaseAmount: 50000,
        industry: '製造業',
        companySize: '中堅企業'
      }
    ];

    const customerInfo = {
      industry: '製造業',
      companySize: '中堅企業',
      budget: 50000
    };

    const result = assessSuccessPatternApplicability(
      customerInfo,
      successPatterns
    );

    expect(result.assessment).toBe('APPLICABLE');
    expect(result.matchedPatternId).toBe(successPatternId);
  });
});