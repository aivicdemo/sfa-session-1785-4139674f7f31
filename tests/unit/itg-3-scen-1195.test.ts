import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 提案妥当性判定', () => {
  test('SCEN-1195: 顧客ニーズ適合スコアが閾値未満の場合に適合と判定される', () => {
    // Arrange
    const scoreThreshold = 0.5;
    const customerNeedsScore = 0.45;
    
    const dealConditionWithLowScore = {
      dealId: 'DEAL-001',
      customerId: 'CUST-001',
      customerIndustry: 'manufacturing',
      customerScale: 'large',
      proposalContent: 'ERP implementation project',
      customerNeedsMatchScore: customerNeedsScore,
      scoreThreshold: scoreThreshold,
      evaluatedAt: new Date('2024-11-15T10:30:00Z'),
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: customerNeedsScore,
        sourcePattern: 'PATTERN-MFGSCALE-001',
      }),
    };

    // Act
    const validityResult = evaluateProposalValidity(
      dealConditionWithLowScore,
      mockAIEngine,
    );

    // Assert
    expect(validityResult.isValid).toBe(true);
    expect(validityResult.validityStatus).toBe('適合（適用可能）');
    expect(validityResult.score).toBe(0.45);
    expect(validityResult.scoreBelowThreshold).toBe(true);
    expect(validityResult.reasoningBasis).toEqual({
      scoreValue: 0.45,
      selectedPatternId: 'PATTERN-MFGSCALE-001',
      sourceRepository: '推奨パターンマスタ',
    });
    expect(validityResult.judgedAt).toEqual(new Date('2024-11-15T10:30:00Z'));
  });
});