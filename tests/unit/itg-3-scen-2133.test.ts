import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への適用推奨', () => {
  // SCEN-2133
  test('生成された提案アプローチが null のとき、エラーハンドリング処理が発動する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue(null),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'pat-001',
          industryCode: 'IT',
          companySize: 'mid',
          successRate: 0.85,
          approach: '段階的導入を推奨',
          budget: 5000000,
          timeline: 90,
        },
        {
          patternId: 'pat-002',
          industryCode: 'IT',
          companySize: 'mid',
          successRate: 0.78,
          approach: 'スモールスタートモデル',
          budget: 5000000,
          timeline: 90,
        },
      ]),
    };

    const newProjectInput = {
      industryCode: 'IT',
      companySize: 'mid',
      budget: 5000000,
      timeline: 90,
    };

    const result = generateRecommendation(newProjectInput, mockAIEngine);

    expect(result).toEqual({
      status: 'fallback',
      message: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      approach: '段階的導入を推奨',
      successRate: 0.85,
      reasoning: '過去の成功パターンに基づいた簡略説明',
      similarPatterns: [
        {
          patternId: 'pat-001',
          approach: '段階的導入を推奨',
          successRate: 0.85,
        },
      ],
    });

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(newProjectInput);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newProjectInput);
  });
});