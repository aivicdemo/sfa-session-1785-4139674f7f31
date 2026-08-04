import { validateLearningDataAndGenerateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 学習データ検証と推論実行制御', () => {
  // SCEN-097
  test('学習データ件数が0件のとき推論実行が拒否される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newProjectInput = {
      customer_name: '新規顧客A',
      industry: 'IT',
      company_size: 100,
      deal_amount: 5000000,
      deal_stage: '初期接触',
    };

    const learning_data_count = 0;

    const result = validateLearningDataAndGenerateRecommendation(
      newProjectInput,
      learning_data_count,
      mockAIEngine
    );

    expect(result.status_code).toBe(400);
    expect(result.error_message).toMatch(/学習データが不足しています/);
    expect(result.error_message).toMatch(/推奨の生成には過去の商談データが必要です/);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});