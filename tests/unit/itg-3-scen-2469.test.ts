import { displayRecommendationRationale } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2469: 推奨内容が複数件存在するとき、各推奨に対応する根拠が正しく表示される", () => {
    // テストデータ: 複数の推奨内容を持つ商談シナリオ
    const deal_id = "DEAL-20240115-001";
    const customer_id = "CUST-00001";

    // AIRecommendationEngineのスタブ設定
    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendations: [
          {
            recommendation_id: "REC-A-001",
            recommendation_content: "提案A: 基幹システム導入パッケージ",
            confidence_score: 92,
          },
          {
            recommendation_id: "REC-B-002",
            recommendation_content: "提案B: クラウド移行コンサルティング",
            confidence_score: 87,
          },
          {
            recommendation_id: "REC-C-003",
            recommendation_content: "提案C: セキュリティ強化ソリューション",
            confidence_score: 73,
          },
        ],
      }),
      explainRecommendationReasoning: jest
        .fn()
        .mockImplementation((recommendation_id: string) => {
          const rationale_map: {
            [key: string]: string;
          } = {
            "REC-A-001":
              "過去12ヶ月の類似顧客5件中4件が当提案で成約。平均契約金額1,200万円",
            "REC-B-002":
              "顧客の業種別成功事例マッチ率87%。導入後平均3ヶ月で効果測定可能",
            "REC-C-003":
              "競合他社での同条件案件での採用率73%。顧客の予算レンジに最適",
          };
          return Promise.resolve({
            rationale_text: rationale_map[recommendation_id] || "",
          });
        }),
    };

    // 推奨内容の根拠表示機能を実行
    return displayRecommendationRationale(
      {
        deal_id,
        customer_id,
      },
      mock_ai_engine
    ).then((result) => {
      // 推奨A、推奨B、推奨Cが表示されていることを確認
      expect(result.recommendations).toHaveLength(3);

      // 推奨Aの内容と根拠を確認
      expect(result.recommendations[0].recommendation_id).toBe("REC-A-001");
      expect(result.recommendations[0].recommendation_content).toBe(
        "提案A: 基幹システム導入パッケージ"
      );
      expect(result.recommendations[0].rationale_text).toBe(
        "過去12ヶ月の類似顧客5件中4件が当提案で成約。平均契約金額1,200万円"
      );

      // 推奨Bの内容と根拠を確認
      expect(result.recommendations[1].recommendation_id).toBe("REC-B-002");
      expect(result.recommendations[1].recommendation_content).toBe(
        "提案B: クラウド移行コンサルティング"
      );
      expect(result.recommendations[1].rationale_text).toBe(
        "顧客の業種別成功事例マッチ率87%。導入後平均3ヶ月で効果測定可能"
      );

      // 推奨Cの内容と根拠を確認
      expect(result.recommendations[2].recommendation_id).toBe("REC-C-003");
      expect(result.recommendations[2].recommendation_content).toBe(
        "提案C: セキュリティ強化ソリューション"
      );
      expect(result.recommendations[2].rationale_text).toBe(
        "競合他社での同条件案件での採用率73%。顧客の予算レンジに最適"
      );

      // 推奨と根拠の対応関係が正しいことを確認
      expect(result.recommendations[0].rationale_text).not.toBe(
        result.recommendations[1].rationale_text
      );
      expect(result.recommendations[1].rationale_text).not.toBe(
        result.recommendations[2].rationale_text
      );
      expect(result.recommendations[0].rationale_text).not.toBe(
        result.recommendations[2].rationale_text
      );
    });
  });
});