import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能 - AIRecommendationEngine呼び出し失敗時の代替推奨', () => {
  // SCEN-571
  test('AIRecommendationEngine呼び出しが3回再試行後も失敗するとき代替推奨が返される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('timeout exceeded 30s'))
        .mockRejectedValueOnce(new Error('timeout exceeded 30s'))
        .mockRejectedValueOnce(new Error('timeout exceeded 30s')),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newCaseInput = {
      customerId: 'CUST_20250115_001',
      customerIndustry: 'manufacturing',
      customerSize: 'large',
      dealAmount: 5000000,
      dealStage: 'initial_meeting',
      customerChallenges: ['cost_reduction', 'supply_chain_optimization'],
      proposalType: 'comprehensive_solution',
    };

    const startTime = Date.now();
    const result = await generateRecommendation(newCaseInput, mockAIEngine);
    const elapsedTime = Date.now() - startTime;

    // (1) ユーザー向けメッセージが正しく設定されている
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // (2) 推奨パターンマスタから統計的に上位の成功パターンが返却される（最大3件）
    expect(result.patterns).toBeDefined();
    expect(Array.isArray(result.patterns)).toBe(true);
    expect(result.patterns.length).toBeLessThanOrEqual(3);
    expect(result.patterns.length).toBeGreaterThan(0);

    // (3) 返却される推奨パターンは成約率・案件規模・業界等の統計順位に基づいてランク付けされている
    expect(result.patterns[0].rankScore).toBeGreaterThanOrEqual(
      result.patterns.length > 1 ? result.patterns[1].rankScore : 0
    );
    if (result.patterns.length > 1) {
      expect(result.patterns[1].rankScore).toBeGreaterThanOrEqual(
        result.patterns.length > 2 ? result.patterns[2].rankScore : 0
      );
    }

    // (4) 根拠説明は簡略版で提供される
    expect(result.reasoningSummary).toBeDefined();
    expect(typeof result.reasoningSummary).toBe('string');
    expect(result.reasoningSummary.length).toBeLessThan(200);

    // (5) レスポンスタイムは30秒以内である
    expect(elapsedTime).toBeLessThan(30000);

    // AIエージェントが正しく3回呼び出されていることを確認（初回1秒、2回目2秒、3回目4秒の指数バックオフ）
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: newCaseInput.customerId,
        customerIndustry: newCaseInput.customerIndustry,
      })
    );

    // 返却パターンの構造検証
    result.patterns.forEach((pattern) => {
      expect(pattern).toHaveProperty('patternId');
      expect(pattern).toHaveProperty('approachName');
      expect(pattern).toHaveProperty('successRate');
      expect(pattern).toHaveProperty('applicableIndustries');
      expect(pattern).toHaveProperty('rankScore');
      expect(typeof pattern.successRate).toBe('number');
      expect(pattern.successRate).toBeGreaterThanOrEqual(0);
      expect(pattern.successRate).toBeLessThanOrEqual(100);
      expect(typeof pattern.rankScore).toBe('number');
    });

    // フォールバック状態を示すフラグ
    expect(result.isUsingFallback).toBe(true);
  });
});