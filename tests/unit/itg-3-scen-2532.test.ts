import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2532
  test('失敗要因リストが逆順で入力されるとき、正しい順序で構造化される', () => {
    const reverseOrderedFailureFactors = ['要因C', '要因B', '要因A'];
    const mockAIRecommendationEngine = {
      extractSuccessPatterns: jest.fn().mockReturnValue({
        failureFactorsOrdered: ['要因A', '要因B', '要因C'],
        successCriteria: [
          {
            stage: '初期接触',
            condition: '顧客からのレスポンス24時間以内',
            weight: 0.3,
          },
          {
            stage: '提案',
            condition: '予算確保状況の事前確認',
            weight: 0.5,
          },
          {
            stage: 'クローズ',
            condition: '経営層の承認取得',
            weight: 0.2,
          },
        ],
        applicabilityScore: 0.87,
      }),
    };

    const result = mockAIRecommendationEngine.extractSuccessPatterns(
      reverseOrderedFailureFactors,
    );

    expect(result.failureFactorsOrdered).toEqual([
      '要因A',
      '要因B',
      '要因C',
    ]);
    expect(result.failureFactorsOrdered).not.toEqual(reverseOrderedFailureFactors);
    expect(result.successCriteria).toHaveLength(3);
    expect(result.successCriteria[0].stage).toBe('初期接触');
    expect(result.successCriteria[1].stage).toBe('提案');
    expect(result.successCriteria[2].stage).toBe('クローズ');
    expect(result.applicabilityScore).toBe(0.87);
  });
});