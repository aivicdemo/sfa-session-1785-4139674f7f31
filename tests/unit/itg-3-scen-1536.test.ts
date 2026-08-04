import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-1536
  test('推奨根拠が営業担当者向けに可視化されること', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: '顧客の課題に基づいた段階的提案アプローチ',
        confidence: 0.87,
        reasoning: {
          customerProfile: {
            industry: '製造業',
            employeeCount: 500,
            annualRevenue: 5000000000,
          },
          dealCondition: {
            stageName: '商談初期',
            productCategory: 'ERP',
            budgetRange: [50000000, 100000000],
          },
          matchedPatterns: [
            {
              patternId: 'PAT-001',
              successRate: 0.92,
              timeToClose: 120,
            },
            {
              patternId: 'PAT-002',
              successRate: 0.85,
              timeToClose: 90,
            },
          ],
        },
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          caseId: 'CASE-A001',
          customerIndustry: '製造業',
          dealValue: 75000000,
          closedDays: 115,
          result: 'won',
        },
        {
          caseId: 'CASE-A002',
          customerIndustry: '製造業',
          dealValue: 80000000,
          closedDays: 95,
          result: 'won',
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        '本推奨は、貴社の営業データから抽出した過去の成功パターンに基づいています。' +
        '同様の顧客属性（製造業、従業員数500名程度）と商談条件（ERP導入、予算5千万～1億円）を持つ案件では、' +
        '段階的提案アプローチにより87%の確度で成約に至っています。' +
        '類似成功事例の平均クロージング期間は105日であり、今月中の初期接触を推奨します。'
      ),
      evaluatePatternRelevance: jest.fn()
        .mockResolvedValueOnce(0.92)
        .mockResolvedValueOnce(0.85),
    };

    const newDealData = {
      customerId: 'CUST-NEW-001',
      customerName: '新規製造業A社',
      industry: '製造業',
      employeeCount: 520,
      annualRevenue: 5200000000,
      dealStage: '商談初期',
      productCategory: 'ERP',
      estimatedBudget: 75000000,
    };

    const result = await explainRecommendationReasoning(
      newDealData,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.reasoningText).toBe(
      '本推奨は、貴社の営業データから抽出した過去の成功パターンに基づいています。' +
      '同様の顧客属性（製造業、従業員数500名程度）と商談条件（ERP導入、予算5千万～1億円）を持つ案件では、' +
      '段階的提案アプローチにより87%の確度で成約に至っています。' +
      '類似成功事例の平均クロージング期間は105日であり、今月中の初期接触を推奨します。'
    );

    expect(result.similarCases).toHaveLength(2);
    expect(result.similarCases[0]).toEqual({
      caseId: 'CASE-A001',
      customerIndustry: '製造業',
      dealValue: 75000000,
      closedDays: 115,
      result: 'won',
      relevanceScore: 0.92,
    });
    expect(result.similarCases[1]).toEqual({
      caseId: 'CASE-A002',
      customerIndustry: '製造業',
      dealValue: 80000000,
      closedDays: 95,
      result: 'won',
      relevanceScore: 0.85,
    });

    expect(result.htmlMarkup).toContain('<div class="reasoning-container">');
    expect(result.htmlMarkup).toContain('<p class="reasoning-text">');
    expect(result.htmlMarkup).toContain(
      '本推奨は、貴社の営業データから抽出した過去の成功パターンに基づいています。'
    );
    expect(result.htmlMarkup).toContain('<ul class="similar-cases-list">');
    expect(result.htmlMarkup).toContain('<li class="case-item">');
    expect(result.htmlMarkup).toContain('CASE-A001');
    expect(result.htmlMarkup).toContain('92%');
    expect(result.htmlMarkup).toContain('CASE-A002');
    expect(result.htmlMarkup).toContain('85%');
    expect(result.htmlMarkup).toContain('</div>');

    expect(result.detailFormat).toEqual({
      reasoningSections: ['根拠説明', '類似成功事例'],
      bulletPointCount: expect.any(Number),
      hasStructuredLayout: true,
    });

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      newDealData
    );
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealData);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(2);
  });
});