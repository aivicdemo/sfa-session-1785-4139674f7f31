import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨内容の生成と説明 - 類似パターン抽出', () => {
  // SCEN-1062
  test('OpenAI API（findSimilarPatterns）が正常応答した場合、類似パターンがランク付けされて返却される', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PAT-001',
          patternName: '製造業・効率化・500名規模の成功パターン',
          similarityScore: 0.92,
          matchDescription: '顧客業種・規模・課題が完全に一致した過去事例',
        },
        {
          patternId: 'PAT-002',
          patternName: '製造業・効率化・300-700名規模の推奨アプローチ',
          similarityScore: 0.87,
          matchDescription: '業種と課題が一致し、規模が近い過去事例',
        },
        {
          patternId: 'PAT-003',
          patternName: '製造業・コスト削減・大規模企業の提案例',
          similarityScore: 0.78,
          matchDescription: '業種が同じで課題が類似した過去事例',
        },
      ]),
    };

    const input = {
      customerIndustry: '製造業',
      customerEmployeeCount: 500,
      issuePattern: '生産効率化',
      dealStage: '提案前',
    };

    const result = await findSimilarPatterns(
      input.customerIndustry,
      input.customerEmployeeCount,
      input.issuePattern,
      input.dealStage,
      mockAIRecommendationEngine
    );

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);

    expect(result[0].patternId).toBe('PAT-001');
    expect(result[0].similarityScore).toBe(0.92);
    expect(result[0].patternName).toBe(
      '製造業・効率化・500名規模の成功パターン'
    );

    expect(result[1].patternId).toBe('PAT-002');
    expect(result[1].similarityScore).toBe(0.87);
    expect(result[1].patternName).toBe(
      '製造業・効率化・300-700名規模の推奨アプローチ'
    );

    expect(result[2].patternId).toBe('PAT-003');
    expect(result[2].similarityScore).toBe(0.78);
    expect(result[2].patternName).toBe(
      '製造業・コスト削減・大規模企業の提案例'
    );

    expect(result[0].similarityScore).toBeGreaterThan(
      result[1].similarityScore
    );
    expect(result[1].similarityScore).toBeGreaterThan(
      result[2].similarityScore
    );

    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].similarityScore).toBeGreaterThan(
        result[i + 1].similarityScore
      );
    }

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      '製造業',
      500,
      '生産効率化',
      '提案前'
    );
  });
});