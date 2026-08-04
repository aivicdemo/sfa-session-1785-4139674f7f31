import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推論精度スコア算出機能 - 顧客条件が空のエラーハンドリング', () => {
  // SCEN-2400
  test('顧客条件が空のオブジェクトのとき、EMPTY_CUSTOMER_CONDITIONS エラーが発生する', () => {
    const newDealData = {
      dealId: 'DEAL-20240115-001',
      customerConditions: {},
      proposalContent: {
        productCategory: 'software',
        targetBudget: 500000,
        implementationSchedule: '2024-02-28',
      },
      dealStage: 'initial_contact',
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() => {
      evaluatePatternRelevance(newDealData, mockAIEngine);
    }).toThrow(/顧客条件/);
  });
});