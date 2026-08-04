import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2835
  test('推奨内容の根拠表示・検証機能 - 営業担当者の成約実績が複数件の場合、推奨内容の根拠が複数の成功パターンから統計的に集約されて説明される', () => {
    const salesRepId = 'sales_rep_001';
    const currentDealConditions = {
      customerIndustry: 'manufacturing',
      proposedProduct: 'cloud_erp',
      dealDurationDays: 60,
      customerSize: 'large'
    };

    const successPatterns = [
      {
        patternId: 'pattern_001',
        industryMatches: ['manufacturing', 'automotive'],
        productMatches: ['cloud_erp', 'cloud_accounting'],
        averageDealDuration: 45,
        successCount: 2,
        similarityScore: 0.88,
        applicabilityScore: 0.82,
        commonCharacteristics: [
          '初期接触から成約まで平均45日',
          '事前調査の充実度が重要',
          '顧客担当者との信頼構築が成功要因'
        ]
      },
      {
        patternId: 'pattern_002',
        industryMatches: ['manufacturing', 'electronics'],
        productMatches: ['cloud_erp'],
        averageDealDuration: 52,
        successCount: 3,
        similarityScore: 0.81,
        applicabilityScore: 0.75,
        commonCharacteristics: [
          '大規模顧客向け提案が得意',
          '複数部門の調整が必須',
          '導入予算の事前確保が成功条件'
        ]
      },
      {
        patternId: 'pattern_003',
        industryMatches: ['manufacturing'],
        productMatches: ['cloud_erp', 'cloud_analytics'],
        averageDealDuration: 58,
        successCount: 2,
        similarityScore: 0.79,
        applicabilityScore: 0.78,
        commonCharacteristics: [
          'ROI説明資料の充実度が高い',
          'C層との直接提案が効果的',
          '競合分析の緻密さが差別化要因'
        ]
      }
    ];

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue(successPatterns),
      evaluatePatternRelevance: jest.fn((pattern) => ({
        patternId: pattern.patternId,
        relevanceScore: pattern.applicabilityScore
      })),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        basedOnMultiplePatterns: true,
        detectedPatternCount: 3,
        patternDetails: [
          {
            patternId: 'pattern_001',
            similarityScore: 88,
            applicabilityScore: 0.82,
            historicalSuccessCount: 2,
            commonCharacteristics: '初期接触から成約まで平均45日'
          },
          {
            patternId: 'pattern_002',
            similarityScore: 81,
            applicabilityScore: 0.75,
            historicalSuccessCount: 3,
            commonCharacteristics: '大規模顧客向け提案が得意'
          },
          {
            patternId: 'pattern_003',
            similarityScore: 79,
            applicabilityScore: 0.78,
            historicalSuccessCount: 2,
            commonCharacteristics: 'ROI説明資料の充実度が高い'
          }
        ],
        aggregatedStatistics: {
          averageSuccessRate: 0.72,
          commonElements: [
            '事前調査の充実度',
            '顧客担当者との信頼構築',
            'ROI説明資料の準備'
          ]
        },
        reasoningText: '過去の成約実績から統計的に集約された複数の成功パターンに基づいています。検出された成功パターン数は3つです。パターン1（類似度88%、適用可能性スコア：0.82）は同様の業界・商品組合せで過去2件の成約実績があり、共通特性は「初期接触から成約まで平均45日」です。パターン2（類似度81%、適用可能性スコア：0.75）では過去3件の成約実績で共通特性は「大規模顧客向け提案が得意」です。パターン3（類似度79%、適用可能性スコア：0.78）では過去2件の成約実績で共通特性は「ROI説明資料の充実度が高い」です。複数パターンの統計集約結果として、平均成約率は72%であり、共通要素は事前調査の充実度、顧客担当者との信頼構築、ROI説明資料の準備です。'
      })
    };

    const result = explainRecommendationReasoning(
      salesRepId,
      currentDealConditions,
      mockAIRecommendationEngine
    );

    expect(result).toBeDefined();
    expect(result.basedOnMultiplePatterns).toBe(true);
    expect(result.detectedPatternCount).toBe(3);
    expect(result.patternDetails).toHaveLength(3);

    expect(result.patternDetails[0]).toEqual({
      patternId: 'pattern_001',
      similarityScore: 88,
      applicabilityScore: 0.82,
      historicalSuccessCount: 2,
      commonCharacteristics: '初期接触から成約まで平均45日'
    });

    expect(result.patternDetails[1]).toEqual({
      patternId: 'pattern_002',
      similarityScore: 81,
      applicabilityScore: 0.75,
      historicalSuccessCount: 3,
      commonCharacteristics: '大規模顧客向け提案が得意'
    });

    expect(result.patternDetails[2]).toEqual({
      patternId: 'pattern_003',
      similarityScore: 79,
      applicabilityScore: 0.78,
      historicalSuccessCount: 2,
      commonCharacteristics: 'ROI説明資料の充実度が高い'
    });

    expect(result.aggregatedStatistics).toEqual({
      averageSuccessRate: 0.72,
      commonElements: [
        '事前調査の充実度',
        '顧客担当者との信頼構築',
        'ROI説明資料の準備'
      ]
    });

    expect(result.reasoningText).toContain('過去の成約実績から統計的に集約された複数の成功パターンに基づいています');
    expect(result.reasoningText).toContain('検出された成功パターン数は3つです');
    expect(result.reasoningText).toContain('類似度88%');
    expect(result.reasoningText).toContain('適用可能性スコア：0.82');
    expect(result.reasoningText).toContain('過去2件の成約実績');
    expect(result.reasoningText).toContain('初期接触から成約まで平均45日');
    expect(result.reasoningText).toContain('平均成約率は72%');
    expect(result.reasoningText).toContain('事前調査の充実度');
    expect(result.reasoningText).toContain('顧客担当者との信頼構築');
  });
});