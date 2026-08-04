import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-756: [edge] 顧客データ完全性・妥当性判定機能 - 参照可能な商談条件マスタが1件のとき、入力値が照合でき推奨生成可能と判定される', () => {
    // テスト用の商談条件マスタを1件のみ登録
    const dealConditionMasters = [
      {
        id: 'master_001',
        industry: '製造業',
        enterpriseScale: '中堅企業',
        budgetScale: '1000万円以上',
        createdAt: '2024-01-15T00:00:00Z'
      }
    ];

    // 入力値として、登録済みの商談条件マスタと完全に一致する顧客データを準備
    const customerInput = {
      customerId: 'cust_001',
      industry: '製造業',
      enterpriseScale: '中堅企業',
      budgetScale: '1000万円以上',
      inputTimestamp: '2024-01-15T11:00:00Z'
    };

    // AIRecommendationEngineのスタブを準備
    const aiEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec_001',
        approachContent: '提案アプローチ案',
        rationale: [
          {
            evidenceType: '成功パターン',
            reference: '過去事例001',
            relevanceScore: 85
          }
        ],
        confidenceScore: 85,
        generatedAt: '2024-01-15T11:05:00Z'
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // 顧客データ完全性・妥当性判定機能に入力値を渡す
    const result = validateCustomerDataCompleteness(
      customerInput,
      dealConditionMasters,
      aiEngineStub
    );

    // 期待結果の検証
    // 1. 判定結果が『推奨生成可能』の状態で返却される
    expect(result.isRecommendationGenerationReady).toBe(true);

    // 2. 商談条件マスタとの照合を実行したことを確認
    expect(result.dealConditionMasterCount).toBe(1);

    // 3. 入力値とマスタ項目の完全一致を検証した結果を確認
    expect(result.matchStatus).toBe('完全一致');

    // 4. 推奨生成処理へ進行するための承認フラグが立っていることを確認
    expect(result.approvalFlagForGeneration).toBe(true);

    // 5. 照合結果の詳細が記録されていることを確認
    expect(result.matchedMasterId).toBe('master_001');
    expect(result.matchedFields).toEqual({
      industry: true,
      enterpriseScale: true,
      budgetScale: true
    });

    // 6. AIエンジンの呼び出しが可能な状態であることを確認
    expect(result.aiEngineReadyForCalling).toBe(true);

    // 7. 推奨エンジンへの呼び出しが期待通り実行されたことを確認
    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'cust_001',
        industry: '製造業',
        enterpriseScale: '中堅企業',
        budgetScale: '1000万円以上'
      })
    );
  });
});