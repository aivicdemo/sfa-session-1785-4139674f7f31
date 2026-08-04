import { explainRecommendationReasoningWithPermission } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2139
  test('推奨根拠の自然言語説明生成 - 営業担当者の権限が推奨説明の詳細度を制限する場合、簡略説明が生成される', async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        simplifiedExplanation: '顧客のIT導入課題に対し、過去成功事例に基づいた段階的提案アプローチを推奨します',
        detailedExplanation: null,
      }),
    };

    const userPermission = {
      roleId: 'sales_associate',
      accessLevel: 'basic',
      canViewDetailedExplanation: false,
    };

    const dealData = {
      customerId: 'cust_12345',
      customerIndustry: 'IT',
      contractSize: 5000000,
      dealStage: 'pre_proposal',
      dealId: 'deal_67890',
    };

    const result = await explainRecommendationReasoningWithPermission(
      dealData,
      userPermission,
      mockAIEngine,
    );

    expect(result.explanation).toBeDefined();
    expect(result.explanation.length).toBeLessThanOrEqual(300);
    expect(result.explanation).toMatch(/顧客のIT導入課題/);
    expect(result.explanation).toMatch(/過去成功事例/);
    expect(result.explanation).toMatch(/段階的提案/);
    expect(result.explanation).not.toMatch(/\d+\.?\d*%/);
    expect(result.explanation).not.toMatch(/スコア/);
    expect(result.explanation).not.toMatch(/KPI/);
    expect(result.explanation).not.toMatch(/類似パターン/);
    expect(result.isDetailedView).toBe(false);
  });
});