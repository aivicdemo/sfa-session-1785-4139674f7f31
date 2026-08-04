import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AI推奨支援システム - 過去成功パターン抽出・新規案件への適用推奨機能', () => {
  test('SCEN-1049: 新規案件の顧客条件が完全に入力された状態で推奨内容が生成される', () => {
    // Arrange: 新規案件データの準備
    const new_deal_data = {
      customer_name: 'ABC株式会社',
      industry: '製造業',
      employee_count: 500,
      business_challenge: '生産効率化',
      budget: 10000000,
      decision_maker: '工場長',
      desired_implementation_quarter: '2026-Q2'
    };

    // AIRecommendationEngineスタブの準備
    const mock_similar_cases = [
      {
        case_id: 'CASE-2024-0001',
        contract_value: 9500000,
        implementation_days: 90,
        industry: '製造業',
        customer_size: '450名'
      },
      {
        case_id: 'CASE-2024-0002',
        contract_value: 10200000,
        implementation_days: 85,
        industry: '製造業',
        customer_size: '520名'
      },
      {
        case_id: 'CASE-2024-0003',
        contract_value: 9800000,
        implementation_days: 95,
        industry: '製造業',
        customer_size: '480名'
      }
    ];

    const mock_reasoning = 'ABC株式会社と同規模の製造業3社で同じアプローチにより平均成約率78%を達成。貴社の生産効率化課題は事例Aの工場と98%合致しており、同じアプローチで最短3ヶ月での導入が見込めます';

    const stubbed_ai_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'PAT-2025-0847',
        approach_description: '導入前の工程改善ヒアリング→ROI試算提示→段階導入プラン',
        confidence_score: 0.89,
        similar_cases: mock_similar_cases,
        reasoning: mock_reasoning,
        generated_at: '2026-01-15T11:00:00Z'
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        { case_id: 'CASE-2024-0001', relevance_score: 0.92 },
        { case_id: 'CASE-2024-0002', relevance_score: 0.87 },
        { case_id: 'CASE-2024-0003', relevance_score: 0.81 }
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(mock_reasoning)
    };

    // Act: 推奨生成API呼び出し
    const result = generateRecommendation(new_deal_data, stubbed_ai_engine);

    // Assert: 戻り値オブジェクトの構造確認
    expect(result).toHaveProperty('recommendation_id');
    expect(result).toHaveProperty('approach_description');
    expect(result).toHaveProperty('confidence_score');
    expect(result).toHaveProperty('similar_cases');
    expect(result).toHaveProperty('reasoning');
    expect(result).toHaveProperty('generated_at');

    // 推奨パターンIDの確認
    expect(result.recommendation_id).toBe('PAT-2025-0847');

    // 推奨提案アプローチの内容確認
    expect(result.approach_description).toBe('導入前の工程改善ヒアリング→ROI試算提示→段階導入プラン');

    // 信頼度スコアの確認（0～1の数値、0.89）
    expect(typeof result.confidence_score).toBe('number');
    expect(result.confidence_score).toBeGreaterThanOrEqual(0);
    expect(result.confidence_score).toBeLessThanOrEqual(1);
    expect(result.confidence_score).toBe(0.89);

    // 過去成功事例の確認（3件以上）
    expect(Array.isArray(result.similar_cases)).toBe(true);
    expect(result.similar_cases.length).toBeGreaterThanOrEqual(3);

    // 各事例の必須フィールド確認
    result.similar_cases.forEach((case_item) => {
      expect(case_item).toHaveProperty('case_id');
      expect(case_item).toHaveProperty('contract_value');
      expect(case_item).toHaveProperty('implementation_days');
      expect(case_item).toHaveProperty('industry');
      expect(case_item).toHaveProperty('customer_size');
    });

    // 根拠説明テキストの確認
    expect(typeof result.reasoning).toBe('string');
    expect(result.reasoning).toBe(mock_reasoning);
    expect(result.reasoning).toContain('ABC株式会社');
    expect(result.reasoning).toContain('同規模');
    expect(result.reasoning).toContain('成約率');
    expect(result.reasoning).toContain('導入期間');

    // 生成タイムスタンプの確認（ISO8601形式、現在時刻の±5秒以内）
    const timestamp = new Date(result.generated_at);
    const expected_timestamp = new Date('2026-01-15T11:00:00Z');
    const timestamp_diff_ms = Math.abs(timestamp.getTime() - expected_timestamp.getTime());
    expect(timestamp_diff_ms).toBeLessThanOrEqual(5000);

    // スタブ呼び出し回数の確認（1回のみ）
    expect(stubbed_ai_engine.generateRecommendation).toHaveBeenCalledTimes(1);
  });
});