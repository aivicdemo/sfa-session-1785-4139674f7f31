import { validateProposalSchemaAndConfirm } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 提案妥当性確認判定', () => {
  test('SCEN-1234: [error] 提案妥当性確認判定機能 - 提案内容データが不正なスキーマのとき、エラーを返す', () => {
    // Arrange
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const invalidProposalData = {
      proposalId: 'PROP-001',
      // customerName は欠落（必須）
      dealAmount: 1000000,
    };

    // Act & Assert
    expect(() => {
      validateProposalSchemaAndConfirm(
        invalidProposalData,
        mockAIRecommendationEngine,
      );
    }).toThrow(/提案内容のスキーマが不正です/);

    expect(() => {
      validateProposalSchemaAndConfirm(
        invalidProposalData,
        mockAIRecommendationEngine,
      );
    }).toThrow(/INVALID_PROPOSAL_SCHEMA/);

    // AIRecommendationEngine のメソッドが呼び出されていないことを検証
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});