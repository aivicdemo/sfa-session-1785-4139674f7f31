import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2390
  test('[error] 推論精度スコア算出機能 - 問題検出結果が空のとき、エラーが発生する', () => {
    const problemDetectionStub = jest.fn().mockReturnValue([]);

    expect(() => {
      calculateInferenceAccuracyScore(
        {
          salesDataInputs: [
            {
              customerId: 'CUST001',
              industryType: 'manufacturing',
              companySize: 500,
              challenges: ['cost_reduction', 'efficiency'],
              purchaseHistory: [
                {
                  productId: 'PROD001',
                  purchaseDate: '2024-01-15',
                  quantity: 100,
                },
              ],
            },
          ],
          proposalContents: [
            {
              proposalId: 'PROP001',
              productId: 'PROD001',
              recommendedQuantity: 150,
              recommendedTiming: '2024-02-15',
              rationale: 'Based on historical purchase patterns',
            },
          ],
          standardProcessTemplate: {
            stepName: 'proposal_generation',
            expectedBehaviors: ['customer_analysis', 'pattern_matching'],
            successCriteria: {
              adoptionRate: 0.6,
              minimumConfidenceScore: 75,
            },
          },
        },
        problemDetectionStub
      );
    }).toThrow(/問題検出結果が空/);

    try {
      calculateInferenceAccuracyScore(
        {
          salesDataInputs: [
            {
              customerId: 'CUST001',
              industryType: 'manufacturing',
              companySize: 500,
              challenges: ['cost_reduction', 'efficiency'],
              purchaseHistory: [
                {
                  productId: 'PROD001',
                  purchaseDate: '2024-01-15',
                  quantity: 100,
                },
              ],
            },
          ],
          proposalContents: [
            {
              proposalId: 'PROP001',
              productId: 'PROD001',
              recommendedQuantity: 150,
              recommendedTiming: '2024-02-15',
              rationale: 'Based on historical purchase patterns',
            },
          ],
          standardProcessTemplate: {
            stepName: 'proposal_generation',
            expectedBehaviors: ['customer_analysis', 'pattern_matching'],
            successCriteria: {
              adoptionRate: 0.6,
              minimumConfidenceScore: 75,
            },
          },
        },
        problemDetectionStub
      );
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error) {
        expect((error as Error & { code: string }).code).toBe(
          'EMPTY_DETECTION_RESULT'
        );
      }
    }
  });
});