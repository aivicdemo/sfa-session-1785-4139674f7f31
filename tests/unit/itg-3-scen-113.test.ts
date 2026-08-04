import { saveRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨支援システム - 推奨根拠の可視化機能', () => {
  // SCEN-113
  test('推奨内容が空のとき保存が拒否される', () => {
    const emptyRecommendationContent = '';
    const customerId = 'CUST-001';
    const dealId = 'DEAL-001';
    const recommendationId = 'REC-001';
    const timestamp = new Date('2024-01-15T10:00:00Z');

    const saveRequest = {
      recommendationId,
      customerId,
      dealId,
      recommendationContent: emptyRecommendationContent,
      reasoningBasis: {
        pastCasePatterns: ['pattern1', 'pattern2'],
        customerDataFactors: ['factor1'],
        successPatternMatch: 0.85,
        riskFactors: ['risk1']
      },
      createdAt: timestamp
    };

    expect(() => saveRecommendationReasoning(saveRequest)).toThrow(/推奨内容/);
  });
});