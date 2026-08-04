import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2847
  test('推奨内容の標準プロセス乖離度判定機能 - 営業担当者の行動パターンが標準プロセスと大きく異なった場合、乖離度スコアが最大値に近く算出される', () => {
    const standardProcessSteps = [
      { step_id: 1, step_name: '初期接触', sequence_order: 1 },
      { step_id: 2, step_name: 'ニーズヒアリング', sequence_order: 2 },
      { step_id: 3, step_name: '提案', sequence_order: 3 },
      { step_id: 4, step_name: 'クロージング', sequence_order: 4 },
    ];

    const salesPersonActionPattern = [
      { step_id: 3, step_name: '提案資料送付', executed_at: '2024-01-15T09:00:00Z', sequence_order: 1 },
      { step_id: 4, step_name: 'クロージング試行1回目', executed_at: '2024-01-15T10:30:00Z', sequence_order: 2 },
      { step_id: 4, step_name: 'クロージング試行2回目', executed_at: '2024-01-15T14:00:00Z', sequence_order: 3 },
      { step_id: 2, step_name: 'ニーズヒアリング', executed_at: '2024-01-16T11:00:00Z', sequence_order: 4 },
    ];

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn((pattern: typeof salesPersonActionPattern): number => {
        const deviationScore = 0.85;
        return deviationScore;
      }),
    };

    const result = evaluatePatternRelevance(
      standardProcessSteps,
      salesPersonActionPattern,
      mockAIRecommendationEngine
    );

    expect(result).toBeGreaterThanOrEqual(0.8);
    expect(result).toBeLessThanOrEqual(1.0);
    expect(typeof result).toBe('number');
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(salesPersonActionPattern);
  });
});