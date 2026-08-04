import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨の同一入力再実行検証機能', () => {
  test('SCEN-1161: 同じ顧客・商談条件で推奨生成を2回実行したとき、両回とも同一の提案アプローチを返却する', () => {
    // Mock AIRecommendationEngine stub
    const mockApproachId = 'APPR-2024-0001';
    const mockApproachContent = 'クラウド基盤の段階的導入アプローチ';
    const mockReasoningContent = '過去の同規模IT企業での成功事例から、3ヶ月以内の導入を実現するには段階的導入が有効と判定';
    const mockConfidenceScore = 87;

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approachId: mockApproachId,
        approachContent: mockApproachContent,
        reasoningContent: mockReasoningContent,
        confidenceScore: mockConfidenceScore,
      }),
    };

    // Prepare test data: customer and deal conditions
    const customerInfo = {
      customerId: 'CUST-001',
      industry: 'IT',
      companySize: '中堅',
    };

    const dealConditions = {
      stage: '提案前',
      budget: 5000000,
      implementationTimeframe: '3ヶ月以内',
    };

    // Execute first recommendation generation
    return generateRecommendation(customerInfo, dealConditions, mockAIEngine)
      .then((responseA) => {
        // Execute second recommendation generation with identical conditions
        return generateRecommendation(customerInfo, dealConditions, mockAIEngine)
          .then((responseB) => {
            // Verify approachId is identical
            expect(responseA.approachId).toBe(responseB.approachId);
            expect(responseA.approachId).toBe(mockApproachId);

            // Verify approach content text is identical
            expect(responseA.approachContent).toBe(responseB.approachContent);
            expect(responseA.approachContent).toBe(mockApproachContent);

            // Verify reasoning explanation is identical
            expect(responseA.reasoningContent).toBe(responseB.reasoningContent);
            expect(responseA.reasoningContent).toBe(mockReasoningContent);

            // Verify confidence score is identical
            expect(responseA.confidenceScore).toBe(responseB.confidenceScore);
            expect(responseA.confidenceScore).toBe(mockConfidenceScore);

            // Verify determinism: all properties match exactly
            expect(responseA).toEqual(responseB);
          });
      });
  });
});