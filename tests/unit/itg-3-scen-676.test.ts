import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・推奨機能 - 外部AI失敗時の代替内部パターン推奨', () => {
  test('SCEN-676: 過去成功パターンが0件のとき、内部推奨パターンマスタから統計的上位パターンを推奨する', () => {
    // Arrange: AIRecommendationEngineのスタブ定義
    const stubAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]), // 過去成功パターン0件
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0), // 外部AI呼び出しの代替
      generateRecommendation: jest.fn().mockRejectedValue(new Error('API_TIMEOUT')),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
    };

    // 推奨パターンマスタの内部パターン（統計的に上位の3件）
    const internalPatternMaster = [
      {
        pattern_id: 'INTERNAL_001',
        customer_industry: 'IT',
        pattern_name: '段階的な導入提案',
        success_rank_score: 95,
        approach: '顧客の現状分析 → ROI試算 → 導入スケジュール提示',
        description: '中堅IT企業向けのデジタル変革案件での標準成功パターン',
      },
      {
        pattern_id: 'INTERNAL_002',
        customer_industry: 'IT',
        pattern_name: 'ROI即時計算モデルの提示',
        success_rank_score: 88,
        approach: '経営数値への直結訴求 → 経営層への説得資料生成',
        description: '予算意思決定が課題の案件での統計的推奨',
      },
      {
        pattern_id: 'INTERNAL_003',
        customer_industry: 'IT',
        pattern_name: 'トライアル提案からの段階導入',
        success_rank_score: 82,
        approach: '小規模トライアル → 成功実績共有 → 本格導入',
        description: 'リスク懸念が高い顧客への標準推奨',
      },
    ];

    // テスト用の新規案件データ
    const newDealData = {
      customer_industry: 'IT',
      deal_scale: 'mid_market',
      challenge_type: 'digital_transformation',
      customer_name: 'TestCorp IT',
      estimated_value: 2500000,
    };

    // Act: generateRecommendationメソッドを呼び出し
    const result = generateRecommendation(
      newDealData,
      stubAIEngine,
      internalPatternMaster,
    );

    // Assert: 期待結果の検証
    expect(result).toEqual({
      success: true,
      source: 'internal_pattern_master',
      recommended_patterns: [
        {
          pattern_id: 'INTERNAL_001',
          pattern_name: '段階的な導入提案',
          approach: '顧客の現状分析 → ROI試算 → 導入スケジュール提示',
          confidence_score: 95,
          reasoning_brief: '内部成功パターン、過去成功事例からの統計的推奨',
        },
        {
          pattern_id: 'INTERNAL_002',
          pattern_name: 'ROI即時計算モデルの提示',
          approach: '経営数値への直結訴求 → 経営層への説得資料生成',
          confidence_score: 88,
          reasoning_brief: '内部成功パターン、過去成功事例からの統計的推奨',
        },
        {
          pattern_id: 'INTERNAL_003',
          pattern_name: 'トライアル提案からの段階導入',
          approach: '小規模トライアル → 成功実績共有 → 本格導入',
          confidence_score: 82,
          reasoning_brief: '内部成功パターン、過去成功事例からの統計的推奨',
        },
      ],
      user_message: undefined,
    });

    // Assert: 外部AI APIが呼び出されたことをスパイで検証
    expect(stubAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealData);
    expect(stubAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);

    // Assert: 外部AI APIがスタブ経由で動作し、実APIへの通信が行われていないことを確認
    expect(stubAIEngine.generateRecommendation).toHaveBeenCalledTimes(0);
    expect(stubAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(0);
  });
});