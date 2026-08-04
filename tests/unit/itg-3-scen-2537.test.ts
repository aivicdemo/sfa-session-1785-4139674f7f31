import { extractAndStructureSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2537
  test('営業プロセスステップ数が業務上の最大規模のとき、すべてが構造化される', async () => {
    const MAX_STEPS = 50;
    const SLA_TIMEOUT_MS = 30000;

    // AIRecommendationEngineのスタブ作成
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 50ステップの成功パターンデータを生成
    const processSteps = Array.from({ length: MAX_STEPS }, (_, idx) => ({
      stepId: idx + 1,
      stepName: `Step ${idx + 1}`,
      actionType: idx % 3 === 0 ? 'discovery' : idx % 3 === 1 ? 'proposal' : 'negotiation',
      duration: 300 + idx * 10,
      owner: `Sales Rep ${(idx % 5) + 1}`,
      outcome: idx < MAX_STEPS - 1 ? 'completed' : 'closed_won',
      timestamp: new Date('2024-01-15T09:00:00Z').getTime() + idx * 3600000,
      description: `Action for step ${idx + 1}`,
      result: idx % 10 !== 0 ? 'success' : 'success_with_note',
    }));

    const inputData = {
      dealId: 'DEAL-2024-001',
      customerId: 'CUST-12345',
      customerIndustry: 'Technology',
      customerSize: 'Enterprise',
      productCategory: 'SaaS Platform',
      dealValue: 150000,
      processSteps: processSteps,
      dealOutcome: 'won',
      dealDuration: 180000,
      successIndicators: {
        stakeholderEngagement: 5,
        decisionMakerInvolvement: 4,
        CompetitivePosition: 3,
        PricingAlignment: 4,
      },
    };

    mockAIEngine.findSimilarPatterns.mockResolvedValue({
      patterns: [inputData],
      relevanceScores: [0.95],
    });

    // 処理実行時間を計測
    const startTime = performance.now();

    // 成功パターン抽出・構造化を実行
    const result = await extractAndStructureSuccessPatterns(inputData, mockAIEngine);

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    // 全50ステップが構造化されていることを確認
    expect(result.structuredSteps).toBeDefined();
    expect(result.structuredSteps).toHaveLength(MAX_STEPS);

    // 各ステップが正しいスキーマで構造化されていることを確認
    result.structuredSteps.forEach((step, index) => {
      expect(step.stepId).toBe(index + 1);
      expect(step.stepName).toBeDefined();
      expect(typeof step.stepName).toBe('string');
      expect(step.actionType).toBeDefined();
      expect(['discovery', 'proposal', 'negotiation']).toContain(step.actionType);
      expect(step.duration).toBeDefined();
      expect(typeof step.duration).toBe('number');
      expect(step.duration).toBeGreaterThan(0);
      expect(step.owner).toBeDefined();
      expect(typeof step.owner).toBe('string');
      expect(step.outcome).toBeDefined();
      expect(typeof step.outcome).toBe('string');
      expect(step.timestamp).toBeDefined();
      expect(typeof step.timestamp).toBe('number');
      expect(step.description).toBeDefined();
      expect(typeof step.description).toBe('string');
      expect(step.result).toBeDefined();
      expect(['success', 'success_with_note']).toContain(step.result);
    });

    // ステップIDが1～50で連続していることを確認
    const stepIds = result.structuredSteps.map(s => s.stepId);
    expect(stepIds).toEqual(Array.from({ length: MAX_STEPS }, (_, i) => i + 1));

    // 欠落がないことを確認（50ステップすべてが存在）
    expect(new Set(stepIds).size).toBe(MAX_STEPS);

    // 最初と最後のステップが正しいことを確認
    expect(result.structuredSteps[0].stepId).toBe(1);
    expect(result.structuredSteps[MAX_STEPS - 1].stepId).toBe(MAX_STEPS);

    // 処理完了時間がSLA内（30秒以内）であることを確認
    expect(executionTime).toBeLessThan(SLA_TIMEOUT_MS);

    // 出力フォーマットの完全性を確認
    expect(result).toHaveProperty('structuredSteps');
    expect(result).toHaveProperty('dealMetadata');
    expect(result.dealMetadata.dealId).toBe('DEAL-2024-001');
    expect(result.dealMetadata.customerId).toBe('CUST-12345');
    expect(result.dealMetadata.processStepCount).toBe(MAX_STEPS);
    expect(result.dealMetadata.dealOutcome).toBe('won');

    // マッピング検証：入力と出力のステップが正確に対応していることを確認
    inputData.processSteps.forEach((inputStep, index) => {
      const outputStep = result.structuredSteps[index];
      expect(outputStep.stepId).toBe(inputStep.stepId);
      expect(outputStep.duration).toBe(inputStep.duration);
      expect(outputStep.owner).toBe(inputStep.owner);
    });
  });
});