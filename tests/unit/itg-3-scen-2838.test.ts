import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・提案アプローチ推奨機能', () => {
  // SCEN-2838
  test('過去商談から抽出された成功パターンが複数件の場合、マッチング度の高い順にランク付けされた提案アプローチが推奨される', async () => {
    const mockSimilarPatterns = [
      {
        patternId: 'pattern-a',
        patternName: 'パターンA',
        matchingScore: 0.95,
        industryType: 'IT',
        companySize: '中堅',
        challengeArea: 'デジタル化推進',
      },
      {
        patternId: 'pattern-b',
        patternName: 'パターンB',
        matchingScore: 0.78,
        industryType: 'IT',
        companySize: '中堅',
        challengeArea: 'デジタル化推進',
      },
      {
        patternId: 'pattern-c',
        patternName: 'パターンC',
        matchingScore: 0.82,
        industryType: 'IT',
        companySize: '中堅',
        challengeArea: 'デジタル化推進',
      },
      {
        patternId: 'pattern-d',
        patternName: 'パターンD',
        matchingScore: 0.65,
        industryType: 'IT',
        companySize: '中堅',
        challengeArea: 'デジタル化推進',
      },
    ];

    const mockRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(mockSimilarPatterns),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproaches: [
          {
            approachId: 'approach-1',
            approachName: '推奨アプローチ1',
            matchingScore: 0.95,
            patternName: 'パターンA',
            rationale: 'パターンAが最も高いマッチング度を示しています',
            applicableReasons: ['顧客業種がIT', '企業規模が中堅', '課題領域がデジタル化推進'],
          },
          {
            approachId: 'approach-2',
            approachName: '推奨アプローチ2',
            matchingScore: 0.82,
            patternName: 'パターンC',
            rationale: 'パターンCは2番目に高いマッチング度を示しています',
            applicableReasons: ['顧客業種がIT', '企業規模が中堅', '課題領域がデジタル化推進'],
          },
          {
            approachId: 'approach-3',
            approachName: '推奨アプローチ3',
            matchingScore: 0.78,
            patternName: 'パターンB',
            rationale: 'パターンBは3番目に高いマッチング度を示しています',
            applicableReasons: ['顧客業種がIT', '企業規模が中堅', '課題領域がデジタル化推進'],
          },
          {
            approachId: 'approach-4',
            approachName: '推奨アプローチ4',
            matchingScore: 0.65,
            patternName: 'パターンD',
            rationale: 'パターンDは最も低いマッチング度を示しています',
            applicableReasons: ['顧客業種がIT', '企業規模が中堅', '課題領域がデジタル化推進'],
          },
        ],
      }),
    };

    const newCaseCondition = {
      industryType: 'IT',
      companySize: '中堅',
      challengeArea: 'デジタル化推進',
    };

    const result = await generateRecommendation(
      newCaseCondition,
      mockRecommendationEngine
    );

    expect(result.recommendedApproaches).toHaveLength(4);

    expect(result.recommendedApproaches[0].matchingScore).toBe(0.95);
    expect(result.recommendedApproaches[0].patternName).toBe('パターンA');
    expect(result.recommendedApproaches[0].approachName).toBe('推奨アプローチ1');

    expect(result.recommendedApproaches[1].matchingScore).toBe(0.82);
    expect(result.recommendedApproaches[1].patternName).toBe('パターンC');
    expect(result.recommendedApproaches[1].approachName).toBe('推奨アプローチ2');

    expect(result.recommendedApproaches[2].matchingScore).toBe(0.78);
    expect(result.recommendedApproaches[2].patternName).toBe('パターンB');
    expect(result.recommendedApproaches[2].approachName).toBe('推奨アプローチ3');

    expect(result.recommendedApproaches[3].matchingScore).toBe(0.65);
    expect(result.recommendedApproaches[3].patternName).toBe('パターンD');
    expect(result.recommendedApproaches[3].approachName).toBe('推奨アプローチ4');

    for (let i = 0; i < result.recommendedApproaches.length; i++) {
      const approach = result.recommendedApproaches[i];
      expect(approach.rationale).toBeDefined();
      expect(approach.applicableReasons).toBeDefined();
      expect(Array.isArray(approach.applicableReasons)).toBe(true);
      expect(approach.applicableReasons.length).toBeGreaterThan(0);
    }

    for (let i = 0; i < result.recommendedApproaches.length - 1; i++) {
      expect(result.recommendedApproaches[i].matchingScore).toBeGreaterThanOrEqual(
        result.recommendedApproaches[i + 1].matchingScore
      );
    }
  });
});