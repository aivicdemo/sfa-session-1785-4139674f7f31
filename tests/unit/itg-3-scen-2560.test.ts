import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2560
  test('推奨生成日が月末のとき、根拠に記録される', () => {
    // モック時刻を月末日に設定
    const mockEndOfMonthDate = new Date('2026-08-31T23:59:59Z');
    jest.useFakeTimers();
    jest.setSystemTime(mockEndOfMonthDate);

    // AIRecommendationEngineのスタブ
    const stubAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'REC-202608-001',
        proposal_approach: '製造業向けの予防保全ソリューション提案',
        confidence_score: 85,
        reasoning_base: {
          generated_date: '2026-08-31',
          generated_datetime_iso: '2026-08-31T23:59:59Z',
          explanation: '2026年8月31日時点で、顧客Aの過去購買パターンと現在の需要信号が一致しており、提案タイミングが最適です。',
        },
        reasoning_metadata: {
          generated_date: '2026-08-31T23:59:59Z',
          similar_case_count: 3,
          success_pattern_match_ratio: 0.92,
        },
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 新規案件データ
    const newDeal = {
      customer_name: 'テスト顧客A',
      deal_amount_yen: 5000000,
      industry: '製造業',
    };

    // 推奨生成APIを呼び出す
    const result = generateRecommendationWithReasoning(newDeal, stubAIEngine);

    // 推奨オブジェクトをキャプチャして検証
    expect(result).toBeDefined();
    expect(result.reasoning_base).toBeDefined();
    expect(result.reasoning_base.generated_date).toBe('2026-08-31');
    expect(result.reasoning_base.generated_datetime_iso).toBe('2026-08-31T23:59:59Z');
    expect(result.reasoning_base.explanation).toMatch(/2026年8月31日時点/);
    expect(result.reasoning_metadata.generated_date).toBe('2026-08-31T23:59:59Z');

    jest.useRealTimers();
  });
});