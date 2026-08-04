import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-2331
  test('OpenAI API呼び出しで過去成功パターンから類似パターンが正常に検索される', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          index: 0,
          relevanceScore: 0.92,
          embedding: new Array(1536).fill(0.0023064255),
          pastCase: {
            customerIndustry: 'IT',
            dealAmount: 5000000,
            closurePeriodDays: 92,
            adoptedProposalApproach: 'クラウド基盤構築支援パッケージ'
          }
        },
        {
          index: 1,
          relevanceScore: 0.87,
          embedding: new Array(1536).fill(-0.008815289),
          pastCase: {
            customerIndustry: 'IT',
            dealAmount: 4500000,
            closurePeriodDays: 78,
            adoptedProposalApproach: 'DX推進コンサルティング'
          }
        },
        {
          index: 2,
          relevanceScore: 0.81,
          embedding: new Array(1536).fill(0.0015234567),
          pastCase: {
            customerIndustry: 'IT',
            dealAmount: 5200000,
            closurePeriodDays: 105,
            adoptedProposalApproach: 'セキュリティソリューション導入'
          }
        }
      ])
    };

    const dealCondition = {
      industry: 'IT',
      budgetAmount: 5000000,
      decisionDeadlineDays: 90
    };

    const result = await findSimilarPatterns(dealCondition, mockAIEngine);

    expect(result).toBeDefined();
    expect(result.length).toBe(3);

    expect(result[0].relevanceScore).toBe(0.92);
    expect(result[1].relevanceScore).toBe(0.87);
    expect(result[2].relevanceScore).toBe(0.81);

    expect(result[0].pastCase.customerIndustry).toBe('IT');
    expect(result[0].pastCase.dealAmount).toBe(5000000);
    expect(result[0].pastCase.closurePeriodDays).toBe(92);
    expect(result[0].pastCase.adoptedProposalApproach).toBe('クラウド基盤構築支援パッケージ');

    expect(result[1].pastCase.adoptedProposalApproach).toBe('DX推進コンサルティング');
    expect(result[2].pastCase.adoptedProposalApproach).toBe('セキュリティソリューション導入');

    expect(result[0].index).toBe(0);
    expect(result[0].embedding).toHaveLength(1536);
    expect(typeof result[0].embedding[0]).toBe('number');

    expect(result[1].index).toBe(1);
    expect(result[2].index).toBe(2);
  });
});