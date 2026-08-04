import { generateRecommendationWithProposal } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-347: [normal] 推奨精度検証機能 - 改善提案が生成される際、改善項目がない場合、改善提案は生成されない
  test('改善項目がない場合、改善提案は生成されない', () => {
    // テスト対象: 推奨生成処理
    const newProjectData = {
      customerId: 'CUST-001',
      customerName: 'テスト顧客',
      industry: 'IT',
      scale: 'large',
      dealCondition: {
        stage: 'proposal',
        budget: 5000000,
        timeline: '2024-Q2'
      }
    };

    // AIRecommendationEngineのスタブ設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'デジタルトランスフォーメーション支援提案',
        confidenceScore: 85,
        improvementItems: [], // 改善項目が空
        reasoning: '顧客の業種がIT、規模がlargeであり、過去の類似案件で成功率が高い',
        successPatterns: [
          {
            patternId: 'SP-001',
            description: '大規模IT企業向けDX支援',
            relevanceScore: 0.88
          }
        ]
      })
    };

    // 推奨生成処理を実行
    const result = generateRecommendationWithProposal(
      newProjectData,
      mockAIEngine
    );

    // 戻り値の改善提案フィールドを確認
    expect(result.recommendationProposal).toBe(null);
    expect(result.generated).toBe(false);
    expect(result.recommendedApproach).toBe('デジタルトランスフォーメーション支援提案');
    expect(result.confidenceScore).toBe(85);
    expect(result.improvementItems).toEqual([]);
    expect(result.log).toMatch(/改善項目がないため改善提案の生成をスキップ/);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      newProjectData
    );
  });
});