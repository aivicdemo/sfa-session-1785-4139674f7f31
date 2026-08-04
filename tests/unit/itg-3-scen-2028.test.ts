import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2028
  test('経営層向け説得資料の自動生成機能 - 提案妥当性入力項目のうち実装難易度が欠落しているとき、その項目の寄与を0として計算される', () => {
    const proposalValidity = {
      customerChallenge: 85,
      solutionEffect: 90,
      implementationPeriod: 75,
      implementationDifficulty: undefined,
    };

    const dealConditions = {
      customerId: 'CUST-001',
      industryType: 'manufacturing',
      companyScale: 'mid-market',
      dealStage: 'proposal',
    };

    const successPatterns = [
      {
        patternId: 'SP-001',
        matchScore: 0.92,
        relevantFactors: ['customerChallenge', 'solutionEffect'],
      },
    ];

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        proposalValidity: {
          customerChallenge: 85,
          solutionEffect: 90,
          implementationPeriod: 75,
          implementationDifficulty: 0,
        },
        validityScore: 83.33,
        contributionDetails: [
          {
            factor: 'customerChallenge',
            weight: 0.3333,
            contribution: 28.33,
          },
          {
            factor: 'solutionEffect',
            weight: 0.3333,
            contribution: 30.0,
          },
          {
            factor: 'implementationPeriod',
            weight: 0.3334,
            contribution: 25.0,
          },
          {
            factor: 'implementationDifficulty',
            weight: 0.0,
            contribution: 0.0,
            status: 'notProvided',
          },
        ],
        rationale:
          '提案妥当性スコア83.33は、顧客課題（85点）、解決効果（90点）、実装期間（75点）から算出。実装難易度は未入力のため寄与度0として除外。',
      }),
    };

    const result = generateRecommendation(
      dealConditions,
      proposalValidity,
      successPatterns,
      mockAIEngine
    );

    expect(result.validityScore).toBe(83.33);
    expect(result.contributionDetails).toHaveLength(4);

    const implementationDifficultyContribution = result.contributionDetails.find(
      (detail) => detail.factor === 'implementationDifficulty'
    );
    expect(implementationDifficultyContribution).toBeDefined();
    expect(implementationDifficultyContribution?.weight).toBe(0.0);
    expect(implementationDifficultyContribution?.contribution).toBe(0.0);
    expect(implementationDifficultyContribution?.status).toBe('notProvided');

    const customerChallengeContribution = result.contributionDetails.find(
      (detail) => detail.factor === 'customerChallenge'
    );
    expect(customerChallengeContribution?.contribution).toBe(28.33);

    const solutionEffectContribution = result.contributionDetails.find(
      (detail) => detail.factor === 'solutionEffect'
    );
    expect(solutionEffectContribution?.contribution).toBe(30.0);

    const implementationPeriodContribution = result.contributionDetails.find(
      (detail) => detail.factor === 'implementationPeriod'
    );
    expect(implementationPeriodContribution?.contribution).toBe(25.0);

    expect(result.rationale).toContain('実装難易度は未入力のため寄与度0として除外');
    expect(result.rationale).not.toContain('実装難易度');
  });
});