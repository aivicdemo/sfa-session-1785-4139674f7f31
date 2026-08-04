import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1162
  test('[edge] 推奨内容キャッシュ保有機能 - 過去推奨履歴がキャッシュに0件のとき、外部AIサービス呼び出しを直行実行する', () => {
    // キャッシュを初期化して過去推奨履歴が0件の状態を構築
    const emptyRecommendationCache: Array<{ customerId: string; dealStage: string; recommendation: string; reasoning: string }> = [];

    // AIRecommendationEngineのスタブを設定
    const stubAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: '顧客の予算制約を考慮した段階的提案アプローチ',
        reasoning: '500万円～1000万円の予算帯に対して、初期接触段階では導入効果と投資対効果を示す簡易提案から開始し、段階的にサービス利用範囲を提案することで、顧客の意思決定リスクを軽減できます。',
        confidence: 85,
      }),
    };

    // 新規案件データ
    const newDealInput = {
      customerId: 'CUST-001',
      dealStage: '初期接触',
      budgetMin: 5000000,
      budgetMax: 10000000,
    };

    // 推奨生成機能を実行
    const result = generateRecommendation(newDealInput, emptyRecommendationCache, stubAIEngine);

    // AIRecommendationEngineのgenerateRecommendationメソッドが呼び出されたことをスパイで検証
    expect(stubAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(stubAIEngine.generateRecommendation).toHaveBeenCalledWith({
      customerId: 'CUST-001',
      dealStage: '初期接触',
      budgetMin: 5000000,
      budgetMax: 10000000,
    });

    // スタブから返却された推奨内容と根拠がシステムに保持されていることを確認
    expect(result).toEqual({
      recommendation: '顧客の予算制約を考慮した段階的提案アプローチ',
      reasoning: '500万円～1000万円の予算帯に対して、初期接触段階では導入効果と投資対効果を示す簡易提案から開始し、段階的にサービス利用範囲を提案することで、顧客の意思決定リスクを軽減できます。',
      confidence: 85,
      source: 'external_ai',
      cachedResult: false,
    });

    // キャッシュ参照によって外部呼び出しが迂回されていないこと（即座の実行であること）を確認
    expect(result.cachedResult).toBe(false);
    expect(result.source).toBe('external_ai');
  });
});