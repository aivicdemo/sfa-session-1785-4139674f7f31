import { analyzeSellingPersonBehaviorPattern } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-797
  test('営業担当者情報が欠落しているとき、エラーを発生させる', () => {
    expect(() => {
      analyzeSellingPersonBehaviorPattern({
        salespersonId: null as any,
        analysisStartDate: new Date('2024-01-01T00:00:00Z'),
        analysisEndDate: new Date('2024-01-31T23:59:59Z'),
        standardProcessDefinition: {
          stages: ['initial_contact', 'proposal', 'negotiation', 'contract'],
          kpiCriteria: {
            initial_contact: { minFrequency: 2 },
            proposal: { successRate: 0.5 },
            negotiation: { avgDuration: 5 },
            contract: { closureRate: 0.3 },
          },
        },
      });
    }).toThrow(/営業担当者情報/);
  });
});