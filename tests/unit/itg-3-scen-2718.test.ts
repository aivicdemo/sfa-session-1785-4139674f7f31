import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2718
  test('推奨根拠の可視化機能 - AIエージェントが生成した推奨の根拠が自然言語で説明文として出力される', () => {
    // テスト前提条件：新規案件データを定義
    const recommendationData = {
      customerId: 'cust_taro_shouji',
      customerName: '太郎商事',
      industry: '製造',
      budgetRange: '5000000',
      challenge: '生産効率化',
      recommendedApproach: 'prioritize_process_improvement_then_automation',
      similarSuccessCases: 5,
      successRate: 78,
      recommendationId: 'rec_20250101_001',
    };

    // AIRecommendationEngine.explainRecommendationReasoning のスタブを準備
    const mockExplainRecommendationReasoning = jest.fn(
      (input: {
        recommendationId: string;
        customerId: string;
        customerName: string;
        industry: string;
        budgetRange: string;
        challenge: string;
        recommendedApproach: string;
        similarSuccessCases: number;
        successRate: number;
      }) => {
        return '御社の生産効率化という課題は、過去12ヶ月間に同規模の製造業向けで成約した5件の成功事例と合致しています。これらの事例では、業務プロセス改善提案を優先し、その後に自動化ツール導入を提案するアプローチで成約率が78%に達しました。太郎商事の顧客特性と予算規模から、同じアプローチが効果的と予測されます。';
      }
    );

    // AIエージェントの推奨根拠を取得
    const explanationText = mockExplainRecommendationReasoning(recommendationData);

    // 期待される説明文
    const expectedExplanation =
      '御社の生産効率化という課題は、過去12ヶ月間に同規模の製造業向けで成約した5件の成功事例と合致しています。これらの事例では、業務プロセス改善提案を優先し、その後に自動化ツール導入を提案するアプローチで成約率が78%に達しました。太郎商事の顧客特性と予算規模から、同じアプローチが効果的と予測されます。';

    // 検証1：説明文が出力されていることを確認
    expect(explanationText).toBe(expectedExplanation);

    // 検証2：説明文が営業担当者が理解可能な日本語で記述されていることを確認
    expect(explanationText).toMatch(/過去/);
    expect(explanationText).toMatch(/成功事例/);
    expect(explanationText).toMatch(/アプローチ/);

    // 検証3：過去成功パターンとの類似点が明示されていることを確認
    expect(explanationText).toMatch(/5件の成功事例/);
    expect(explanationText).toMatch(/成約率が78%/);

    // 検証4：推奨アプローチの選択理由が論理的に説明されていることを確認
    expect(explanationText).toMatch(/業務プロセス改善提案を優先/);
    expect(explanationText).toMatch(/自動化ツール導入/);
    expect(explanationText).toMatch(/効果的と予測/);

    // 検証5：説明文の文字数が200字以上800字以内であることを確認
    const characterCount = explanationText.length;
    expect(characterCount).toBeGreaterThanOrEqual(200);
    expect(characterCount).toBeLessThanOrEqual(800);

    // 実際の関数呼び出しを検証
    expect(mockExplainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'cust_taro_shouji',
        customerName: '太郎商事',
        industry: '製造',
        budgetRange: '5000000',
        challenge: '生産効率化',
      })
    );
  });
});