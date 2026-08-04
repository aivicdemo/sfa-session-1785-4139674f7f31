import { validateProposalApproval } from '../../src/logic/it-1-br-3-1-1-1';

describe('提案妥当性判定機能', () => {
  // SCEN-1263
  test('顧客ニーズと営業プロセス両方が要件を満たす場合かつリスク要因が許容範囲の場合に承認判定される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: '既存システムの統合を軸とした段階的導入提案',
        confidence: 0.92,
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        processAlignmentScore: 0.85,
        isApplicable: true,
      }),
    };

    const mockRiskAssessment = {
      assessRisks: jest.fn().mockReturnValue([
        {
          riskFactor: '導入期間短縮の可能性',
          riskScore: 0.3,
          threshold: 0.5,
        },
      ]),
    };

    const proposalInput = {
      customerNeed: '既存システムの統合',
      businessProcess: '提案→ヒアリング→見積',
      detectedRisks: [
        {
          name: '導入期間短縮の可能性',
          score: 0.3,
        },
      ],
    };

    const result = validateProposalApproval(
      proposalInput,
      mockAIEngine,
      mockRiskAssessment,
    );

    expect(result.approvalStatus).toBe('APPROVED');
    expect(result.reason).toMatch(/顧客ニーズ/);
    expect(result.reason).toMatch(/営業プロセス/);
    expect(result.reason).toMatch(/リスク/);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
  });
});