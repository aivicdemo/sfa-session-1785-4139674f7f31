import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1903: 過去成功事例が複数件のときに全件が根拠として返却される', () => {
    // スタブ: AIRecommendationEngine のメソッド群
    const mockFindSimilarPatterns = jest.fn().mockReturnValue([
      {
        patternId: 'PATTERN-001',
        relevanceScore: 0.95,
        description: 'IT企業での大型案件で、段階的提案により6ヶ月で成約した事例',
        customerIndustry: 'IT',
        dealSize: 'Large',
        successOutcome: true,
      },
      {
        patternId: 'PATTERN-002',
        relevanceScore: 0.87,
        description: '製造業での中規模案件で、コスト削減ポイントを強調して3ヶ月で成約した事例',
        customerIndustry: 'Manufacturing',
        dealSize: 'Medium',
        successOutcome: true,
      },
      {
        patternId: 'PATTERN-003',
        relevanceScore: 0.82,
        description: 'サービス業での小規模案件で、迅速な導入支援により1ヶ月で成約した事例',
        customerIndustry: 'Service',
        dealSize: 'Small',
        successOutcome: true,
      },
    ]);

    const mockExplainRecommendationReasoning = jest.fn().mockReturnValue({
      reasoning: 'これまでの成功事例から、以下のパターンが該当します。',
      similarCasesArray: [
        {
          patternId: 'PATTERN-001',
          relevanceScore: 0.95,
          caseDescription: 'IT企業での大型案件で、段階的提案により6ヶ月で成約した事例',
        },
        {
          patternId: 'PATTERN-002',
          relevanceScore: 0.87,
          caseDescription: '製造業での中規模案件で、コスト削減ポイントを強調して3ヶ月で成約した事例',
        },
        {
          patternId: 'PATTERN-003',
          relevanceScore: 0.82,
          caseDescription: 'サービス業での小規模案件で、迅速な導入支援により1ヶ月で成約した事例',
        },
      ],
    });

    const mockAIEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      explainRecommendationReasoning: mockExplainRecommendationReasoning,
    };

    // 入力パラメータ: 新規案件の顧客情報・商談条件
    const inputCustomerInfo = {
      customerId: 'CUST-12345',
      industry: 'IT',
      companySize: 'Large',
      budget: 5000000,
      requiredDeliveryDate: '2025-06-30',
    };

    const inputDealCondition = {
      dealId: 'DEAL-67890',
      productType: 'Enterprise Software',
      proposalStage: 'InitialProposal',
      customerNeed: 'Process Automation',
    };

    // 関数を呼び出し
    const result = generateRecommendation(
      inputCustomerInfo,
      inputDealCondition,
      mockAIEngine
    );

    // 検証: 推奨結果の根拠フィールド内のsimilarCasesArray配列
    expect(result.reasoning).toBeDefined();
    expect(result.reasoning.similarCasesArray).toBeDefined();
    expect(Array.isArray(result.reasoning.similarCasesArray)).toBe(true);
    
    // 検証: 配列の長さが3であることを確認
    expect(result.reasoning.similarCasesArray.length).toBe(3);

    // 検証: 各事例がパターンID、関連性スコア、説明を持つオブジェクトとして格納されているか
    const firstCase = result.reasoning.similarCasesArray[0];
    expect(firstCase.patternId).toBe('PATTERN-001');
    expect(firstCase.relevanceScore).toBe(0.95);
    expect(firstCase.caseDescription).toBe('IT企業での大型案件で、段階的提案により6ヶ月で成約した事例');

    const secondCase = result.reasoning.similarCasesArray[1];
    expect(secondCase.patternId).toBe('PATTERN-002');
    expect(secondCase.relevanceScore).toBe(0.87);
    expect(secondCase.caseDescription).toBe('製造業での中規模案件で、コスト削減ポイントを強調して3ヶ月で成約した事例');

    const thirdCase = result.reasoning.similarCasesArray[2];
    expect(thirdCase.patternId).toBe('PATTERN-003');
    expect(thirdCase.relevanceScore).toBe(0.82);
    expect(thirdCase.caseDescription).toBe('サービス業での小規模案件で、迅速な導入支援により1ヶ月で成約した事例');
  });
});