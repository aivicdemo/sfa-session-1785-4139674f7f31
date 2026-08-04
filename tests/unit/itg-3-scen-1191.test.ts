import { evaluateProposalRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1191
  test('複数件のリスク要因がある場合、各要因に対して妥当性スコアを算出し、統合判定結果を返却する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        riskAssessments: [
          { riskFactor: '予算不足', score: 0.35 },
          { riskFactor: '導入スケジュール遅延', score: 0.52 },
          { riskFactor: '既存システム連携困難', score: 0.41 },
        ],
        overallRelevanceScore: 0.43,
      }),
    };

    const input = {
      proposalId: 'TEST-SCEN-1191',
      customerIndustry: '小売',
      proposalContent: '在庫最適化システム導入',
      riskFactors: [
        { type: '予算不足', severity: 'HIGH' },
        { type: '導入スケジュール遅延', severity: 'MEDIUM' },
        { type: '既存システム連携困難', severity: 'HIGH' },
      ],
    };

    const result = evaluateProposalRelevance(input, mockAIEngine);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        riskFactorsCount: 3,
        riskFactors: input.riskFactors,
      })
    );

    expect(result).toEqual({
      proposalId: 'TEST-SCEN-1191',
      riskFactorsCount: 3,
      overallRelevanceScore: 0.43,
      riskAssessments: [
        { riskFactor: '予算不足', score: 0.35 },
        { riskFactor: '導入スケジュール遅延', score: 0.52 },
        { riskFactor: '既存システム連携困難', score: 0.41 },
      ],
      judgmentStatus: 'COMPLETED',
    });

    expect(result.riskFactorsCount).toBe(3);
    expect(result.judgmentStatus).toBe('COMPLETED');
    expect(result.riskAssessments).toHaveLength(3);
    expect(result.riskAssessments[0].riskFactor).toBe('予算不足');
    expect(result.riskAssessments[1].riskFactor).toBe('導入スケジュール遅延');
    expect(result.riskAssessments[2].riskFactor).toBe('既存システム連携困難');
    expect(result.overallRelevanceScore).toBeGreaterThanOrEqual(0.0);
    expect(result.overallRelevanceScore).toBeLessThanOrEqual(1.0);
  });
});