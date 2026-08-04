import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("AIエージェント推奨支援システム - 成功パターンからの提案アプローチ抽出", () => {
  // SCEN-943
  test("成功パターンから複数の提案アプローチが候補として抽出される場合、スコア値によるランキング順序が降順で返却される", () => {
    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproaches: [
          {
            id: "approach_a",
            name: "パターンA",
            score: 0.92,
            description: "高スコア提案アプローチ",
          },
          {
            id: "approach_b",
            name: "パターンB",
            score: 0.87,
            description: "中スコア提案アプローチ",
          },
          {
            id: "approach_c",
            name: "パターンC",
            score: 0.75,
            description: "低スコア提案アプローチ",
          },
        ],
      }),
    };

    const input_conditions = {
      industry: "IT業界",
      dealStage: "提案段階",
      projectSize: "1000万円以上",
    };

    return generateRecommendation(input_conditions, mock_ai_engine).then(
      (result) => {
        expect(mock_ai_engine.generateRecommendation).toHaveBeenCalledWith(
          input_conditions
        );

        expect(result.recommendedApproaches).toHaveLength(3);

        expect(result.recommendedApproaches[0].score).toBe(0.92);
        expect(result.recommendedApproaches[0].name).toBe("パターンA");

        expect(result.recommendedApproaches[1].score).toBe(0.87);
        expect(result.recommendedApproaches[1].name).toBe("パターンB");

        expect(result.recommendedApproaches[2].score).toBe(0.75);
        expect(result.recommendedApproaches[2].name).toBe("パターンC");

        for (let i = 0; i < result.recommendedApproaches.length - 1; i++) {
          expect(
            result.recommendedApproaches[i].score
          ).toBeGreaterThanOrEqual(
            result.recommendedApproaches[i + 1].score
          );
        }
      }
    );
  });
});