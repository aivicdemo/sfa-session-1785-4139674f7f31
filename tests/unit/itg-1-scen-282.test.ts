import { evaluateProposalApproachApplicability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-282
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 顧客規模が完全に一致する場合', () => {
    const successPatterns = [
      {
        id: 'pattern_001',
        customerSize: 'large_enterprise',
        customerSizeThreshold: 100000000000,
        salesMethod: '大規模案件向け提案',
        confidenceScore: 100,
        applicableCustomerSizeRangeMin: 100000000000,
        applicableCustomerSizeRangeMax: Number.MAX_SAFE_INTEGER,
      },
    ];

    const currentCustomer = {
      id: 'customer_abc',
      name: 'テスト大企業',
      annualRevenue: 100000000000,
      size: 'large_enterprise',
    };

    const result = evaluateProposalApproachApplicability(
      successPatterns,
      currentCustomer
    );

    expect(result.status).toBe('applicable');
    expect(result.applicablePatterns).toHaveLength(1);
    expect(result.applicablePatterns[0].patternId).toBe('pattern_001');
    expect(result.applicablePatterns[0].salesMethodName).toBe('大規模案件向け提案');
    expect(result.applicablePatterns[0].confidenceScore).toBe(100);
  });
});