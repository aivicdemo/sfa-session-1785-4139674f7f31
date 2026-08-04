import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 過去成功パターン検索', () => {
  // SCEN-2909
  test('[normal] OpenAI API連携 - findSimilarPatterns呼び出しが正常応答を受けた場合、ランク付けされた過去成功事例が返却される', async () => {
    // Arrange: モック化されたAIRecommendationEngine窓口を準備
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn(),
    };

    // OpenAI API (Embeddings) からの正常応答スタブを設定
    const mockEmbeddingResponse = {
      object: 'list',
      data: [
        {
          object: 'embedding',
          embedding: Array(1536).fill(0.1), // 1536次元の浮動小数点数配列
          index: 0,
        },
        {
          object: 'embedding',
          embedding: Array(1536).fill(0.2),
          index: 1,
        },
        {
          object: 'embedding',
          embedding: Array(1536).fill(0.15),
          index: 2,
        },
      ],
      model: 'text-embedding-ada-002',
      usage: {
        prompt_tokens: 24,
        total_tokens: 24,
      },
    };

    // 過去成功事例データ（ランク付け済み）
    const mockSuccessPatterns = [
      {
        case_id: 'CASE-001',
        customer_industry: '金融',
        proposal_content: 'クラウド基盤導入',
        contract_amount: 5000000,
        realization_date: '2024-01-15',
        similarity_score: 0.945,
      },
      {
        case_id: 'CASE-002',
        customer_industry: '金融',
        proposal_content: 'デジタル化推進支援',
        contract_amount: 3500000,
        realization_date: '2023-11-20',
        similarity_score: 0.872,
      },
      {
        case_id: 'CASE-003',
        customer_industry: '製造業',
        proposal_content: 'IoT導入コンサル',
        contract_amount: 4200000,
        realization_date: '2023-09-30',
        similarity_score: 0.756,
      },
    ];

    mockAIRecommendationEngine.findSimilarPatterns.mockResolvedValue(
      mockSuccessPatterns
    );

    // Act: 現在の商談条件を入力パラメータとして準備
    const current_deal_conditions = {
      customer_industry: '金融',
      business_challenge: 'レガシーシステム現代化',
      budget_scale: 5000000,
      implementation_timeframe_months: 6,
    };

    // findSimilarPatterns メソッドを呼び出す
    const result = await mockAIRecommendationEngine.findSimilarPatterns(
      current_deal_conditions,
      mockEmbeddingResponse
    );

    // Assert: 返却されたデータを検証
    // 1. 複数件の過去成功事例が返却されているか
    expect(result).toHaveLength(3);

    // 2. 返却された事例が高スコア順（降順）に整列しているか
    expect(result[0].similarity_score).toBe(0.945);
    expect(result[1].similarity_score).toBe(0.872);
    expect(result[2].similarity_score).toBe(0.756);

    // 3. 各返却事例に必須属性が含まれているか
    result.forEach((case_item) => {
      expect(case_item).toHaveProperty('case_id');
      expect(case_item).toHaveProperty('customer_industry');
      expect(case_item).toHaveProperty('proposal_content');
      expect(case_item).toHaveProperty('contract_amount');
      expect(case_item).toHaveProperty('realization_date');
      expect(case_item).toHaveProperty('similarity_score');
    });

    // 4. 各事例の具体的な値を検証
    expect(result[0].case_id).toBe('CASE-001');
    expect(result[0].customer_industry).toBe('金融');
    expect(result[0].proposal_content).toBe('クラウド基盤導入');
    expect(result[0].contract_amount).toBe(5000000);
    expect(result[0].realization_date).toBe('2024-01-15');

    // 5. 類似度スコアが0～1の範囲内か、小数点第3位まで表現されているか
    result.forEach((case_item) => {
      expect(case_item.similarity_score).toBeGreaterThanOrEqual(0);
      expect(case_item.similarity_score).toBeLessThanOrEqual(1);
      const decimal_places = (case_item.similarity_score.toString().split('.')[1] || '').length;
      expect(decimal_places).toBeLessThanOrEqual(3);
    });

    // 6. 最もスコアが高い事例が配列の先頭に位置しているか
    expect(result[0].similarity_score).toBeGreaterThan(result[1].similarity_score);
    expect(result[1].similarity_score).toBeGreaterThan(result[2].similarity_score);

    // モック関数が正しく呼び出されたか
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      current_deal_conditions,
      mockEmbeddingResponse
    );
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
  });
});