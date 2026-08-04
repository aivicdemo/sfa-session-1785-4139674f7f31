import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンマッチング機能 - OpenAI APIフォールバック', () => {
  // SCEN-1294
  test('OpenAI APIが失敗した場合に内部推奨パターンマスタから統計上位パターンが代替返却される', async () => {
    // Setup: 推奨パターンマスタの統計上位3パターンをセットアップ
    const patternA = {
      patternId: 'pattern_001',
      name: 'SaaS_CostReduction_500emp',
      successRate: 85,
      occurrenceCount: 120,
      description: 'SaaS企業のコスト削減提案パターン（従業員500名規模）',
    };

    const patternB = {
      patternId: 'pattern_002',
      name: 'SaaS_Efficiency_500emp',
      successRate: 82,
      occurrenceCount: 95,
      description: 'SaaS企業の業務効率化提案パターン（従業員500名規模）',
    };

    const patternC = {
      patternId: 'pattern_003',
      name: 'SaaS_Growth_500emp',
      successRate: 78,
      occurrenceCount: 60,
      description: 'SaaS企業の成長支援提案パターン（従業員500名規模）',
    };

    // AIRecommendationEngineをモック化し、全メソッドがタイムアウト例外を発生させるよう設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(new Error('Timeout')),
      findSimilarPatterns: jest.fn().mockRejectedValue(new Error('Timeout')),
      explainRecommendationReasoning: jest.fn().mockRejectedValue(new Error('Timeout')),
      evaluatePatternRelevance: jest.fn().mockRejectedValue(new Error('Timeout')),
    };

    // 新規案件の条件データを入力
    const dealCondition = {
      industry: 'SaaS',
      companySize: 500,
      challenge: 'コスト削減',
      budget: 5000000,
      timeline: '2024-Q3',
    };

    // 推奨生成APIを呼び出す
    const result = await generateRecommendation(
      dealCondition,
      mockAIEngine,
      [patternA, patternB, patternC]
    );

    // 検証：OpenAI API呼び出しが失敗し、3回の指数バックオフ再試行が実行されたこと
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    // 検証：フォールバック処理により統計上位パターン（パターンA）が返却されること
    expect(result.selectedPattern.patternId).toBe('pattern_001');
    expect(result.selectedPattern.successRate).toBe(85);
    expect(result.selectedPattern.occurrenceCount).toBe(120);

    // 検証：簡略版の根拠説明が含まれること
    expect(result.reasoningExplanation).toBe(
      '過去120件の類似案件で最も高い成功率85%を記録したパターンです'
    );

    // 検証：ユーザーに対して表示されるメッセージが正しいこと
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // 検証：フォールバック状態フラグが設定されていること
    expect(result.isUsingFallback).toBe(true);
  });
});