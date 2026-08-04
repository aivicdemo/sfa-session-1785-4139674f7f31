import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2735
  test('OpenAI API呼び出しが失敗したとき内部推奨パターンマスタから統計的上位パターンが返却される', async () => {
    // ============================================
    // 入力条件
    // ============================================
    const inputBusinessCondition = {
      industry: 'IT',
      budget: 5000000,
      decisionTimeline: 'within_3_months',
    };

    // ============================================
    // スタブの定義：OpenAI API呼び出しを3回失敗させる
    // ============================================
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockImplementation(async () => {
        throw new Error('API timeout exceeded 30 seconds');
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // ============================================
    // 実行：内部推奨パターンマスタからのフォールバック処理
    // ============================================
    const result = await generateRecommendation(inputBusinessCondition, mockAIRecommendationEngine);

    // ============================================
    // 期待値：統計的上位3件の成功パターン
    // ============================================
    expect(result).toEqual({
      isSuccessful: true,
      isFromFallback: true,
      userMessage: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      recommendedPatterns: [
        {
          rank: 1,
          patternId: 'pattern_001',
          successCount: 48,
          adoptionRate: 0.85,
          reasoning: '過去同条件案件で成約率85%の実績あり',
        },
        {
          rank: 2,
          patternId: 'pattern_002',
          successCount: 35,
          adoptionRate: 0.75,
          reasoning: '同業種案件で平均契約金額が目標予算と一致',
        },
        {
          rank: 3,
          patternId: 'pattern_003',
          successCount: 28,
          adoptionRate: 0.68,
          reasoning: '3ヶ月以内の決定を要する案件の成功例多数',
        },
      ],
      errorFlag: false,
    });

    // ============================================
    // 検証：再試行ロジックが呼び出されたこと
    // ============================================
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    // ============================================
    // 検証：返却パターンの構造
    // ============================================
    expect(result.recommendedPatterns).toHaveLength(3);
    expect(result.recommendedPatterns[0]).toHaveProperty('rank');
    expect(result.recommendedPatterns[0]).toHaveProperty('patternId');
    expect(result.recommendedPatterns[0]).toHaveProperty('successCount');
    expect(result.recommendedPatterns[0]).toHaveProperty('adoptionRate');
    expect(result.recommendedPatterns[0]).toHaveProperty('reasoning');

    // ============================================
    // 検証：各パターンのデータ型と値の妥当性
    // ============================================
    result.recommendedPatterns.forEach((pattern) => {
      expect(typeof pattern.rank).toBe('number');
      expect(typeof pattern.patternId).toBe('string');
      expect(typeof pattern.successCount).toBe('number');
      expect(typeof pattern.adoptionRate).toBe('number');
      expect(typeof pattern.reasoning).toBe('string');
      expect(pattern.successCount).toBeGreaterThanOrEqual(0);
      expect(pattern.adoptionRate).toBeGreaterThanOrEqual(0);
      expect(pattern.adoptionRate).toBeLessThanOrEqual(1);
      expect(pattern.reasoning).not.toMatch(/^この/);
    });

    // ============================================
    // 検証：ユーザー向けメッセージが簡潔版であること
    // ============================================
    expect(result.userMessage).toBe('推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します');
    expect(result.userMessage).not.toContain('詳細');
    expect(result.userMessage).not.toContain('技術的');

    // ============================================
    // 検証：エラーフラグが立っていないこと
    // ============================================
    expect(result.errorFlag).toBe(false);

    // ============================================
    // 検証：フォールバックフラグが立っていること
    // ============================================
    expect(result.isFromFallback).toBe(true);

    // ============================================
    // 検証：根拠説明がテンプレート化されていること（生成AI版ではないこと）
    // ============================================
    result.recommendedPatterns.forEach((pattern) => {
      expect(pattern.reasoning).toMatch(/実績|一致|例/);
      expect(pattern.reasoning).not.toMatch(/AIが判断|考えられます|可能性|推定/);
    });
  });
});