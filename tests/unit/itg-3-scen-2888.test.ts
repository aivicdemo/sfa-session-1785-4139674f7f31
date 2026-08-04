import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容検証判定機能 - 照合スコア範囲検証', () => {
  // SCEN-2888
  test('照合スコアが100を超える場合、SCORE_OUT_OF_RANGE エラーをスロー', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(101),
    };

    const input = {
      dealConditions: {
        customerId: 'cust-001',
        industryType: 'IT',
        companySize: 'large',
        budget: 5000000,
        timeline: '2024-Q2',
      },
      proposalContent: {
        productCategory: 'cloud_solution',
        proposedAmount: 4800000,
        implementationPeriod: 120,
      },
      aiEngine: mockAIEngine,
    };

    expect(() => {
      evaluatePatternRelevance(input);
    }).toThrow(/SCORE_OUT_OF_RANGE/);
  });
});