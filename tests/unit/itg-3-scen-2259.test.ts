import { detectAnomalousPatterns } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2259
  test('顧客対応記録が空のとき、異常パターン検出処理がエラーになる', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const emptyCustomerInteractionRecords = [];

    const proposalContent = {
      proposalId: 'PROP-001',
      customerId: 'CUST-001',
      content: 'サンプル提案内容',
      createdAt: new Date('2024-01-15T10:00:00Z'),
    };

    expect(() => {
      detectAnomalousPatterns(
        emptyCustomerInteractionRecords,
        proposalContent,
        mockAIEngine
      );
    }).toThrow(/顧客対応記録が空/);
  });
});