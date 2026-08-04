import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1058
  test("推奨内容の根拠表示機能 - 複数の推奨内容それぞれに対応する根拠が個別に表示される", async () => {
    // テスト用スタブデータ設定
    const stub_aiRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendations: [
          {
            recommendationId: "rec_001",
            proposalApproach: "顧客の過去購買パターンに最適化された提案",
            confidenceScore: 95,
          },
          {
            recommendationId: "rec_002",
            proposalApproach: "業界別成功事例に基づく提案戦略",
            confidenceScore: 88,
          },
          {
            recommendationId: "rec_003",
            proposalApproach: "営業担当者のスタイルに適合した提案内容",
            confidenceScore: 92,
          },
        ],
      }),
      explainRecommendationReasoning: jest
        .fn()
        .mockImplementation((recommendationId: string) => {
          const explanations: Record<string, string> = {
            rec_001:
              "過去購買履歴における顧客とのパターンマッチ度が95%です。同業他社での成功事例と照合した結果、本提案内容は高い成約確度が期待できます",
            rec_002:
              "業界別成功事例データベースとの類似度分析により、88%の適合度が確認されました。特に顧客の課題分野では過去3年間で同様のアプローチで8件の成約実績があります",
            rec_003:
              "営業担当者の商談スタイル分析から、提案内容との適合度は92%です。過去の同担当者による類似案件での成約率は73%です",
          };
          return Promise.resolve({
            recommendationId,
            explanation: explanations[recommendationId] || "",
          });
        }),
    };

    // テスト入力データ
    const test_newCase = {
      customerName: "サンプル企業A",
      budget: "500万円",
      industry: "製造業",
    };

    // テスト対象関数を呼び出し
    // 推奨1の根拠説明を取得
    const result_rec001 = await explainRecommendationReasoning(
      "rec_001",
      stub_aiRecommendationEngine
    );

    // 推奨2の根拠説明を取得
    const result_rec002 = await explainRecommendationReasoning(
      "rec_002",
      stub_aiRecommendationEngine
    );

    // 推奨3の根拠説明を取得
    const result_rec003 = await explainRecommendationReasoning(
      "rec_003",
      stub_aiRecommendationEngine
    );

    // 期待結果の検証
    expect(result_rec001.explanation).toBe(
      "過去購買履歴における顧客とのパターンマッチ度が95%です。同業他社での成功事例と照合した結果、本提案内容は高い成約確度が期待できます"
    );

    expect(result_rec002.explanation).toBe(
      "業界別成功事例データベースとの類似度分析により、88%の適合度が確認されました。特に顧客の課題分野では過去3年間で同様のアプローチで8件の成約実績があります"
    );

    expect(result_rec003.explanation).toBe(
      "営業担当者の商談スタイル分析から、提案内容との適合度は92%です。過去の同担当者による類似案件での成約率は73%です"
    );

    // 3つの根拠説明が互いに異なることを確認
    expect(result_rec001.explanation).not.toBe(result_rec002.explanation);
    expect(result_rec002.explanation).not.toBe(result_rec003.explanation);
    expect(result_rec001.explanation).not.toBe(result_rec003.explanation);

    // 各推奨IDが正しく保持されていることを確認
    expect(result_rec001.recommendationId).toBe("rec_001");
    expect(result_rec002.recommendationId).toBe("rec_002");
    expect(result_rec003.recommendationId).toBe("rec_003");
  });
});