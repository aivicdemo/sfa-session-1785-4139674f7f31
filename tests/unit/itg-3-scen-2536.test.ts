import { generateSuccessPatternTemplate } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2536
  test('営業プロセスステップが複数件のとき、すべてのステップを含むテンプレートが生成される', () => {
    const pastDealData = {
      dealId: 'deal-12345',
      customerId: 'cust-001',
      processSteps: [
        {
          stepId: 'step-001',
          stepName: '顧客ヒアリング',
          executedBy: 'sales-rep-A',
          executedAt: '2024-01-15T09:00:00Z',
          successFactor: '顧客の経営課題を3点以上引き出した'
        },
        {
          stepId: 'step-002',
          stepName: '提案作成',
          executedBy: 'sales-rep-A',
          executedAt: '2024-01-15T14:00:00Z',
          successFactor: 'ROI試算を含めた提案書を作成した'
        },
        {
          stepId: 'step-003',
          stepName: '契約締結',
          executedBy: 'sales-manager-B',
          executedAt: '2024-01-17T11:00:00Z',
          successFactor: '経営層との合意を得て契約締結'
        }
      ],
      dealOutcome: 'won',
      dealValue: 5000000
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendedApproach: 'ヒアリング重視型提案',
        confidence: 85,
        processSteps: pastDealData.processSteps
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const generatedTemplate = generateSuccessPatternTemplate(
      pastDealData,
      mockAIRecommendationEngine
    );

    expect(generatedTemplate.processSteps).toHaveLength(3);
    expect(generatedTemplate.processSteps[0].stepName).toBe('顧客ヒアリング');
    expect(generatedTemplate.processSteps[0].executedBy).toBe('sales-rep-A');
    expect(generatedTemplate.processSteps[0].executedAt).toBe('2024-01-15T09:00:00Z');
    expect(generatedTemplate.processSteps[0].successFactor).toBe('顧客の経営課題を3点以上引き出した');

    expect(generatedTemplate.processSteps[1].stepName).toBe('提案作成');
    expect(generatedTemplate.processSteps[1].executedBy).toBe('sales-rep-A');
    expect(generatedTemplate.processSteps[1].executedAt).toBe('2024-01-15T14:00:00Z');
    expect(generatedTemplate.processSteps[1].successFactor).toBe('ROI試算を含めた提案書を作成した');

    expect(generatedTemplate.processSteps[2].stepName).toBe('契約締結');
    expect(generatedTemplate.processSteps[2].executedBy).toBe('sales-manager-B');
    expect(generatedTemplate.processSteps[2].executedAt).toBe('2024-01-17T11:00:00Z');
    expect(generatedTemplate.processSteps[2].successFactor).toBe('経営層との合意を得て契約締結');

    expect(generatedTemplate.templateId).toBeDefined();
    expect(generatedTemplate.createdAt).toBeDefined();
    expect(generatedTemplate.dealOutcome).toBe('won');
  });
});