import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1375
  test('過去商談データが0件のとき成功パターンが抽出できない場合、代替推奨を返却する', () => {
    const customerInfo = {
      industry: '製造業',
      companySize: 'large',
      annualRevenue: 50000000,
    };

    const dealCondition = {
      productCategory: 'システム導入',
      budget: 5000000,
      targetClosureDate: '2024-06-30',
    };

    const recommendationEngineStub = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn().mockRejectedValue(
        new Error('過去商談データが不足しています')
      ),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const masterPatternStub = [
      {
        id: 'pattern_001',
        name: '段階的導入アプローチ',
        description: '初期導入から段階的な拡大を進める提案パターン',
        applicableIndustries: ['製造業', '流通'],
        successRate: 0.85,
      },
      {
        id: 'pattern_002',
        name: 'ROI重視の提案',
        description: '投資対効果を前面に出した提案パターン',
        applicableIndustries: ['製造業'],
        successRate: 0.78,
      },
      {
        id: 'pattern_003',
        name: '業界標準機能搭載',
        description: '業界標準機能を標準搭載した提案パターン',
        applicableIndustries: ['製造業', '建設'],
        successRate: 0.72,
      },
    ];

    const result = generateRecommendation(
      customerInfo,
      dealCondition,
      recommendationEngineStub,
      masterPatternStub
    );

    expect(result).toEqual({
      status: 'fallback',
      message: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      recommendations: [
        {
          id: 'pattern_001',
          name: '段階的導入アプローチ',
          description: '初期導入から段階的な拡大を進める提案パターン',
          successRate: 0.85,
          reasoning: '段階的導入で導入リスクを低減できるため、お勧めします。',
        },
        {
          id: 'pattern_002',
          name: 'ROI重視の提案',
          description: '投資対効果を前面に出した提案パターン',
          successRate: 0.78,
          reasoning: '投資対効果を訴求することが有効なパターンです。',
        },
        {
          id: 'pattern_003',
          name: '業界標準機能搭載',
          description: '業界標準機能を標準搭載した提案パターン',
          successRate: 0.72,
          reasoning: '業界標準機能への適合性が高いパターンです。',
        },
      ],
      errorLog: '過去商談データ0件のため、マスタパターンから代替推奨を返却',
    });

    expect(recommendationEngineStub.findSimilarPatterns).toHaveBeenCalledWith(
      customerInfo,
      dealCondition
    );

    expect(recommendationEngineStub.generateRecommendation).toHaveBeenCalledWith(
      customerInfo,
      dealCondition
    );
  });
});