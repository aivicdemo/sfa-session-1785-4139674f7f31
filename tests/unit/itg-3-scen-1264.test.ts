import { evaluateProposalFeasibility } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1264
  test('提案妥当性判定機能 - 顧客ニーズが要件を満たすが営業プロセスが満たさない場合に改善指摘が出力される', async () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn()
        .mockResolvedValueOnce({
          score: 0.95,
          category: 'customerNeeds'
        })
        .mockResolvedValueOnce({
          score: 0.45,
          category: 'salesProcess'
        }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn()
    };

    const proposalInput = {
      customerNeeds: 'コスト削減と業務効率化',
      requiredFeatures: '自動化ツール導入',
      budget: 5000000,
      implementationTimeline: '3ヶ月以内',
      customerNeedsScore: 0.95,
      salesProcessScore: 0.45
    };

    const result = await evaluateProposalFeasibility(
      proposalInput,
      mockAIRecommendationEngine
    );

    expect(result).toHaveProperty('feasibilityJudgment');
    expect(result.feasibilityJudgment).toBe('条件付き承認');
    
    expect(result).toHaveProperty('improvementGuidance');
    expect(Array.isArray(result.improvementGuidance)).toBe(true);
    expect(result.improvementGuidance.length).toBeGreaterThan(0);
    
    const processGuidance = result.improvementGuidance.find(
      (guidance: string) => guidance.includes('営業プロセス適合度')
    );
    expect(processGuidance).toBeDefined();
    expect(processGuidance).toMatch(/営業プロセス適合度が0\.45と低い/);
    expect(processGuidance).toMatch(/初回接触方法の見直し/);
    expect(processGuidance).toMatch(/顧客決定者の事前確認/);
    expect(processGuidance).toMatch(/複数回訪問スケジュール提案/);
  });
});