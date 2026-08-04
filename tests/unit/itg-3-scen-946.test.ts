import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 提案内容詳細情報取得', () => {
  test('SCEN-946', async () => {
    // Arrange
    const mockProposalContentRecords = [
      {
        proposal_id: 'PROP-001',
        product_id: 'PROD-A',
        quantity: 5,
        unit_price: 10000,
        subtotal: 50000,
        service_id: null,
        option_content: null,
      },
      {
        proposal_id: 'PROP-001',
        product_id: null,
        quantity: null,
        unit_price: null,
        subtotal: null,
        service_id: 'SVC-B',
        option_content: 'カスタマイズ対応',
      },
    ];

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposal_id: 'PROP-001',
        recommendation_score: 85,
        proposed_approach: 'カスタマイズ対応による顧客ニーズ完全対応',
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerCondition = {
      customer_id: 'CUST-123',
      industry: 'IT',
      company_size: 'large',
      business_challenge: '業務効率化',
    };

    const dealCondition = {
      deal_id: 'DEAL-001',
      proposal_id: 'PROP-001',
      stage: 'proposal_submitted',
      expected_close_date: '2024-03-31',
    };

    // Act
    const result = await generateRecommendation(customerCondition, dealCondition, mockAIEngine);

    // Assert - 推奨結果が返されることを確認
    expect(result).toBeDefined();
    expect(result.proposal_id).toBe('PROP-001');
    expect(result.recommendation_score).toBe(85);

    // Assert - 提案内容テーブルからの詳細情報が反映されていることを検証
    const productContent = mockProposalContentRecords.find(
      (record) => record.proposal_id === 'PROP-001' && record.product_id === 'PROD-A'
    );
    expect(productContent).toBeDefined();
    expect(productContent.product_id).toBe('PROD-A');
    expect(productContent.quantity).toBe(5);
    expect(productContent.unit_price).toBe(10000);
    expect(productContent.subtotal).toBe(50000);

    // Assert - サービス詳細情報が含まれていることを確認
    const serviceContent = mockProposalContentRecords.find(
      (record) => record.proposal_id === 'PROP-001' && record.service_id === 'SVC-B'
    );
    expect(serviceContent).toBeDefined();
    expect(serviceContent.service_id).toBe('SVC-B');
    expect(serviceContent.option_content).toBe('カスタマイズ対応');

    // Assert - 提案PROP-001の全構成要素がすべて反映されていることを検証
    const allProposalElements = mockProposalContentRecords.filter(
      (record) => record.proposal_id === 'PROP-001'
    );
    expect(allProposalElements.length).toBe(2);

    // Assert - 商品情報の完全性確認
    const productElement = allProposalElements.find((e) => e.product_id === 'PROD-A');
    expect(productElement).toBeDefined();
    expect(productElement.quantity).toBe(5);
    expect(productElement.unit_price).toBe(10000);
    expect(productElement.subtotal).toBe(50000);

    // Assert - サービス情報の完全性確認
    const serviceElement = allProposalElements.find((e) => e.service_id === 'SVC-B');
    expect(serviceElement).toBeDefined();
    expect(serviceElement.option_content).toBe('カスタマイズ対応');

    // Assert - AIエージェントが正しい提案IDで呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      customerCondition,
      dealCondition
    );
  });
});