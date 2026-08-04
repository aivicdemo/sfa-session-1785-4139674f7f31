import { displayRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1774
  test('推奨根拠が複数件のとき根拠表示内容に全要素を含めて返す', () => {
    // Mock AIRecommendationEngine
    const mockFindSimilarPatterns = jest.fn().mockReturnValue([
      {
        patternId: 'PAT-001',
        relevanceScore: 0.95,
        description: 'テレコム業界向け提案パターン',
      },
      {
        patternId: 'PAT-002',
        relevanceScore: 0.87,
        description: '予算規模1000万円以上向けパターン',
      },
      {
        patternId: 'PAT-003',
        relevanceScore: 0.92,
        description: 'DX推進企業向けパターン',
      },
    ]);

    const mockExplainRecommendationReasoning = jest.fn().mockReturnValue([
      {
        patternId: 'PAT-001',
        relevanceScore: 0.95,
        reasoningText:
          '過去のテレコム業界3件の成約事例で共通する営業アプローチ。初回接触から提案までの期間は平均15日。',
        applicableConditions: [
          '業種: 通信・テレコム',
          '企業規模: 従業員500名以上',
          '導入予算: 500万円以上',
        ],
      },
      {
        patternId: 'PAT-003',
        relevanceScore: 0.92,
        reasoningText:
          'DX推進企業では経営層の関与が成約に必須。提案時に経営・現場の両層に対するアプローチが有効。',
        applicableConditions: [
          'DX推進企画部の立ち上げ完了',
          'IT予算の増額傾向',
          '過去12ヶ月の提案検討期間が3ヶ月以上',
        ],
      },
      {
        patternId: 'PAT-002',
        relevanceScore: 0.87,
        reasoningText:
          '予算規模1000万円以上の大型案件では競合出現率が高い。提案から決定までの期間は平均45日。',
        applicableConditions: [
          '導入予算: 1000万円以上',
          '購買決定者: 経営層',
          '導入タイムフレーム: 6ヶ月以内',
        ],
      },
    ]);

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: mockFindSimilarPatterns,
      explainRecommendationReasoning: mockExplainRecommendationReasoning,
      evaluatePatternRelevance: jest.fn(),
    };

    const inputRecommendationData = {
      customerId: 'CUST-12345',
      customerName: '株式会社テレコムシステム',
      industry: 'telecommunications',
      annualRevenue: 15000,
      recommendedApproachId: 'APPR-9876',
      recommendedApproachTitle: 'DX推進型テレコム企業への段階的提案',
      recommendedTiming: new Date('2024-02-15T10:30:00Z'),
      confidenceScore: 92,
      associatedPatternIds: ['PAT-001', 'PAT-003', 'PAT-002'],
    };

    const result = displayRecommendationReasoning(
      inputRecommendationData,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      customerId: 'CUST-12345',
      customerName: '株式会社テレコムシステム',
      recommendationTitle:
        'DX推進型テレコム企業への段階的提案',
      reasoningDetails: [
        {
          rank: 1,
          patternId: 'PAT-001',
          relevanceScore: 0.95,
          formattedReasoning:
            '過去のテレコム業界3件の成約事例で共通する営業アプローチ。初回接触から提案までの期間は平均15日。',
          applicableConditions: [
            '業種: 通信・テレコム',
            '企業規模: 従業員500名以上',
            '導入予算: 500万円以上',
          ],
        },
        {
          rank: 2,
          patternId: 'PAT-003',
          relevanceScore: 0.92,
          formattedReasoning:
            'DX推進企業では経営層の関与が成約に必須。提案時に経営・現場の両層に対するアプローチが有効。',
          applicableConditions: [
            'DX推進企画部の立ち上げ完了',
            'IT予算の増額傾向',
            '過去12ヶ月の提案検討期間が3ヶ月以上',
          ],
        },
        {
          rank: 3,
          patternId: 'PAT-002',
          relevanceScore: 0.87,
          formattedReasoning:
            '予算規模1000万円以上の大型案件では競合出現率が高い。提案から決定までの期間は平均45日。',
          applicableConditions: [
            '導入予算: 1000万円以上',
            '購買決定者: 経営層',
            '導入タイムフレーム: 6ヶ月以内',
          ],
        },
      ],
      overallConfidenceScore: 92,
      recommendationSummary:
        '複数の成功パターンから導出された推奨内容です。該当顧客はテレコム業界でのDX推進型企業に該当し、経営層と現場の両層へのアプローチが効果的です。',
    });

    expect(mockExplainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        associatedPatternIds: ['PAT-001', 'PAT-003', 'PAT-002'],
      })
    );
  });
});