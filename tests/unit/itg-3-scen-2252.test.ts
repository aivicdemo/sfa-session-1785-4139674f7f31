import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチマッチング機能 - 商談条件欠落時の正常処理', () => {
  // SCEN-2252
  test('新規案件の商談条件が導入時期と競合状況を欠落している場合、マッチング処理は正常に完了し、簡略版の根拠説明を含む推奨アプローチを返却する', () => {
    const mockAiEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: '段階的導入アプローチ',
        relevanceScore: 78,
        reasoning: '欠落情報に基づく推奨。顧客業種：製造業、予算規模：中堅企業向け。過去の類似事例から統計的に上位の成功パターンを適用しました。'
      })
    };

    const newDealData = {
      dealId: 'DEAL-20240115-001',
      customerIndustry: '製造業',
      budgetSize: '50M-100M',
      implementationTiming: null,
      competitiveStatus: null
    };

    const successPatternMaster = [
      {
        patternId: 'PATTERN-001',
        approach: '段階的導入アプローチ',
        applicableIndustries: ['製造業', '小売業'],
        budgetRange: { min: 50, max: 150 },
        frequency: 45
      },
      {
        patternId: 'PATTERN-002',
        approach: '包括導入アプローチ',
        applicableIndustries: ['製造業', 'IT'],
        budgetRange: { min: 100, max: 300 },
        frequency: 32
      }
    ];

    const result = generateRecommendation(
      newDealData,
      mockAiEngine,
      successPatternMaster
    );

    expect(result).toBeDefined();
    expect(result.approach).toBe('段階的導入アプローチ');
    expect(result.relevanceScore).toBe(78);
    expect(result.reasoning).toContain('欠落情報に基づく推奨');
    expect(result.reasoning.length).toBeLessThan(200);
  });
});