import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1395
  test('提案内容と顧客制約条件の自動照合機能 - 顧客の経営目標が複数件のとき、すべてが照合対象に含まれる', () => {
    const capturedInputs: Array<{
      customerConstraints: {
        managementObjectives: string[];
        budgetLimit: number;
        scheduleConstraint: string;
      };
    }> = [];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn((input: any) => {
        capturedInputs.push({
          customerConstraints: {
            managementObjectives: input.customerConstraints.managementObjectives,
            budgetLimit: input.customerConstraints.budgetLimit,
            scheduleConstraint: input.customerConstraints.scheduleConstraint,
          },
        });
        return {
          proposalApproach: 'standard approach',
          confidenceScore: 85,
          rationale: 'Based on customer objectives',
        };
      }),
      findSimilarPatterns: jest.fn(() => []),
      explainRecommendationReasoning: jest.fn(() => 'explanation'),
      evaluatePatternRelevance: jest.fn(() => 0.9),
    };

    const customerData = {
      customerId: 'CUST-001',
      companyName: 'Test Corporation',
      industryType: 'Manufacturing',
      companySize: 'Large',
      managementObjectives: [
        'Sales growth 20%',
        'Cost reduction 15%',
        'Customer satisfaction improvement',
      ],
      budgetLimit: 5000000,
      scheduleConstraint: '2024-12-31',
    };

    const proposalContent = {
      proposalId: 'PROP-001',
      productCategory: 'Digital Transformation',
      proposedValue: 'Implementation of AI-driven analytics platform',
      estimatedROI: 35,
      implementationPeriod: 6,
    };

    generateRecommendation(
      customerData,
      proposalContent,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalled();
    expect(capturedInputs).toHaveLength(1);

    const capturedConstraints = capturedInputs[0].customerConstraints;
    expect(capturedConstraints.managementObjectives).toHaveLength(3);

    expect(capturedConstraints.managementObjectives).toContain(
      'Sales growth 20%'
    );
    expect(capturedConstraints.managementObjectives).toContain(
      'Cost reduction 15%'
    );
    expect(capturedConstraints.managementObjectives).toContain(
      'Customer satisfaction improvement'
    );

    expect(capturedConstraints.managementObjectives[0]).toBe(
      'Sales growth 20%'
    );
    expect(capturedConstraints.managementObjectives[1]).toBe(
      'Cost reduction 15%'
    );
    expect(capturedConstraints.managementObjectives[2]).toBe(
      'Customer satisfaction improvement'
    );

    expect(capturedConstraints.budgetLimit).toBe(5000000);
    expect(capturedConstraints.scheduleConstraint).toBe('2024-12-31');
  });
});