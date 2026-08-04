import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2618
  test('推奨提案アプローチの根拠データから過去平均商談期間が計算され、その値が表示される', () => {
    const recommendationId = 'rec_20240115_001';
    const recommendationContent = {
      proposedApproach: '段階的なニーズヒアリングと段階提案アプローチ',
      targetCustomerType: '製造業_中堅企業',
      productCategory: 'ERP_導入支援',
      projectScale: 'medium',
      evidenceData: {
        similarPatternCount: 30,
        averageDealDurationDays: 45,
        successRate: 0.73,
        similarCaseReferences: [
          {
            caseId: 'case_2023_001',
            customerIndustry: '自動車部品製造',
            dealStartDate: '2023-01-10',
            dealCloseDate: '2023-02-24',
            dealDurationDays: 45,
          },
          {
            caseId: 'case_2023_002',
            customerIndustry: '機械装置製造',
            dealStartDate: '2023-02-05',
            dealCloseDate: '2023-03-22',
            dealDurationDays: 45,
          },
        ],
      },
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId,
        content: recommendationContent,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanationText:
          '本推奨は、過去30件の類似商談データに基づいています。対象顧客業種（製造業_中堅企業）および商品カテゴリ（ERP_導入支援）が一致する過去事例の平均商談期間は45日です。このタイムラインに基づいた段階的なニーズヒアリングと段階提案アプローチが推奨されています。',
        rationale: {
          averageDealDurationDays: 45,
          similarCaseCount: 30,
          applicableSuccessRate: 0.73,
        },
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = explainRecommendationReasoning(
      recommendationId,
      recommendationContent,
      mockAIEngine,
    );

    expect(result).toBeDefined();
    expect(result.explanationText).toContain('過去30件の類似商談');
    expect(result.explanationText).toContain('平均商談期間は45日');
    expect(result.rationale.averageDealDurationDays).toBe(45);
    expect(result.rationale.similarCaseCount).toBe(30);
    expect(result.rationale.applicableSuccessRate).toBe(0.73);
  });
});