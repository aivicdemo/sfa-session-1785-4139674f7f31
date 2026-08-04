import { evaluateRecommendationRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 推奨スコア算出', () => {
  test('SCEN-1658: [error] 推奨スコア算出機能 - 提案内容に必須フィールド (商品カテゴリ) が欠けているとき、エラーが発生する', () => {
    const aiEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const incompleteProposal = {
      proposalId: 'PROP-001',
      customerId: 'CUST-001',
      proposalContent: 'Test proposal content',
      productCategory: null,
      proposalAmount: 500000,
      proposalDate: new Date('2024-01-15T11:00:00Z'),
    };

    expect(() =>
      evaluateRecommendationRelevance(incompleteProposal, aiEngineStub)
    ).toThrow(/商品カテゴリ/);
  });
});