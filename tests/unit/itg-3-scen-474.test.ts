import { extractImprovementItems } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善対象項目抽出機能', () => {
  // SCEN-474
  test('複数エラータイプが混在する場合、全タイプが改善対象に含まれる', () => {
    const dealId = 'deal-001';
    const errorTypeA = {
      type: 'inappropriate_proposal',
      description: '提案内容の不適切さ',
      severity: 'high',
    };
    const errorTypeB = {
      type: 'insufficient_needs_understanding',
      description: '顧客ニーズ把握不足',
      severity: 'high',
    };
    const errorTypeC = {
      type: 'delayed_followup',
      description: 'フォローアップ対応の遅延',
      severity: 'medium',
    };

    const analysisResult = {
      dealId: dealId,
      errors: [errorTypeA, errorTypeB, errorTypeC],
      timestamp: '2024-01-15T10:00:00Z',
    };

    const mockAIEngine = {
      analyzeProposalQuality: jest
        .fn()
        .mockResolvedValue(analysisResult),
    };

    const dealData = {
      dealId: dealId,
      customerId: 'cust-001',
      proposalContent: 'sample proposal',
      needsUnderstanding: false,
      followupStatus: 'delayed',
      createdAt: '2024-01-15T09:00:00Z',
    };

    const result = extractImprovementItems(dealData, mockAIEngine);

    expect(result).toBeDefined();
    expect(result.improvementItems).toHaveLength(3);
    expect(result.improvementItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          errorType: 'inappropriate_proposal',
          errorDescription: '提案内容の不適切さ',
        }),
        expect.objectContaining({
          errorType: 'insufficient_needs_understanding',
          errorDescription: '顧客ニーズ把握不足',
        }),
        expect.objectContaining({
          errorType: 'delayed_followup',
          errorDescription: 'フォローアップ対応の遅延',
        }),
      ])
    );
    expect(result.improvementItems[0]).toHaveProperty('errorType');
    expect(result.improvementItems[0]).toHaveProperty('errorDescription');
    expect(result.improvementItems[1]).toHaveProperty('errorType');
    expect(result.improvementItems[1]).toHaveProperty('errorDescription');
    expect(result.improvementItems[2]).toHaveProperty('errorType');
    expect(result.improvementItems[2]).toHaveProperty('errorDescription');
  });
});