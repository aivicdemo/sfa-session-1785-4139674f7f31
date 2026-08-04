import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去成功パターン抽出・新規案件への適用推奨機能', () => {
  // SCEN-1052
  test('1つの提案アプローチのみが返却される', async () => {
    // Arrange: 過去成功パターンが複数件登録された推奨パターンマスタを準備
    const pastPatterns = [
      {
        patternId: 'PAT001',
        industry: '製造業',
        companySize: '大企業',
        successRate: 0.85,
        approachName: '段階的導入プラン',
      },
      {
        patternId: 'PAT002',
        industry: '製造業',
        companySize: '大企業',
        successRate: 0.78,
        approachName: 'フル統合プラン',
      },
      {
        patternId: 'PAT003',
        industry: '製造業',
        companySize: '大企業',
        successRate: 0.72,
        approachName: 'カスタマイズプラン',
      },
    ];

    // AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approachId: 'APP001',
        approachName: '段階的導入プラン',
        rationale: '過去事例から最高の成功率を達成',
        score: 92,
      }),
    };

    // 新規案件の入力データ
    const newDealInput = {
      industry: '製造業',
      companySize: '大企業',
      challenge: '業務効率化',
      budget: '5000万円',
      timeline: '6ヶ月',
    };

    // Act: 推奨支援システムのメソッドを呼び出し
    const result = await generateRecommendation(newDealInput, mockAIEngine);

    // Assert: 戻り値が1件の提案アプローチオブジェクトのみを含むことを検証
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      approachId: 'APP001',
      approachName: '段階的導入プラン',
      rationale: '過去事例から最高の成功率を達成',
      score: 92,
    });
    expect(result[0].approachName).toBe('段階的導入プラン');
    expect(result[0].score).toBe(92);
  });
});