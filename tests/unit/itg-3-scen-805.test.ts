import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-805
  test('推奨内容と根拠の統合提示機能 - 顧客情報が根拠データに含まれて返却される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationId: 'REC-2024-001',
        proposalApproach: 'クラウド導入支援パッケージ',
        confidenceScore: 85,
        reasoningData: {
          customerId: 'CUST-12345',
          customerName: '株式会社テスト',
          industry: 'IT',
          employeeCount: 50,
          dealSize: 5000000,
          proposalCategory: 'クラウド導入',
          similarPatterns: [
            {
              pastCaseId: 'CASE-2023-045',
              matchScore: 0.92,
              successOutcome: true
            }
          ],
          successFactors: [
            '同業種での導入実績が豊富',
            '適切な予算規模での対応が可能'
          ]
        }
      })
    };

    const customerInput = {
      customerId: 'CUST-12345',
      customerName: '株式会社テスト',
      industry: 'IT',
      employeeCount: 50
    };

    const dealCondition = {
      dealSize: 5000000,
      proposalCategory: 'クラウド導入'
    };

    const result = generateRecommendationWithReasoning(
      customerInput,
      dealCondition,
      mockAIEngine
    );

    expect(result).toHaveProperty('recommendationId', 'REC-2024-001');
    expect(result).toHaveProperty('proposalApproach', 'クラウド導入支援パッケージ');
    expect(result).toHaveProperty('confidenceScore', 85);
    expect(result).toHaveProperty('reasoningData');
    
    const reasoningData = result.reasoningData;
    expect(reasoningData).toHaveProperty('customerId', 'CUST-12345');
    expect(reasoningData).toHaveProperty('customerName', '株式会社テスト');
    expect(reasoningData).toHaveProperty('industry', 'IT');
    expect(reasoningData).toHaveProperty('employeeCount', 50);
    expect(reasoningData).toHaveProperty('dealSize', 5000000);
    expect(reasoningData).toHaveProperty('proposalCategory', 'クラウド導入');
    
    expect(reasoningData.similarPatterns).toBeInstanceOf(Array);
    expect(reasoningData.similarPatterns.length).toBeGreaterThan(0);
    expect(reasoningData.similarPatterns[0]).toHaveProperty('pastCaseId', 'CASE-2023-045');
    expect(reasoningData.similarPatterns[0]).toHaveProperty('matchScore', 0.92);
    expect(reasoningData.similarPatterns[0]).toHaveProperty('successOutcome', true);
    
    expect(reasoningData.successFactors).toBeInstanceOf(Array);
    expect(reasoningData.successFactors).toContain('同業種での導入実績が豊富');
    expect(reasoningData.successFactors).toContain('適切な予算規模での対応が可能');
    
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      customerInput,
      dealCondition
    );
  });
});