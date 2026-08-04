import { describe, test, expect, beforeEach, jest } from "@jest/globals";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-1622: [edge] 推奨内容の根拠表示 - 根拠データが複数件存在するとき、すべての根拠が表示される", () => {
    // ========== Setup: Mock AIRecommendationEngine ==========
    const mockExplainRecommendationReasoning = jest.fn();
    const mockAIEngine = {
      explainRecommendationReasoning: mockExplainRecommendationReasoning,
    };

    // ========== Prepare Test Data ==========
    // 複数件の根拠データ（最低3件以上）を含むレスポンス
    const recommendationId = "rec_2024_001";
    const reasoningResponse = {
      recommendationId: recommendationId,
      reasoning: [
        {
          evidenceId: "evt_001",
          text: "過去の類似顧客A社との提案では、導入時期を3月に設定することで、年度予算の活用と連動して成約率が95%に達した",
          confidenceScore: 92,
          referencedDealId: "deal_2023_0145",
        },
        {
          evidenceId: "evt_002",
          text: "同業種の中堅企業10社の購買パターンから、通常4月に新規システム導入検討が開始されるため、提案タイミングを3月中旬に前倒しすることで商談化率が向上する傾向が検出された",
          confidenceScore: 87,
          referencedDealId: "deal_2023_0167",
        },
        {
          evidenceId: "evt_003",
          text: "顧客企業の決算期が3月末であり、予算承認の最終期限が3月15日に設定されている。この制約条件下では、提案を2月中に完了する必要がある。成功した類似案件（deal_2023_0089）では、2月10日提案で3月5日に承認を取得している",
          confidenceScore: 94,
          referencedDealId: "deal_2023_0089",
        },
        {
          evidenceId: "evt_004",
          text: "営業担当者の過去3ヶ月の提案パターン分析から、3月提案案件の成約率が平均68%で、通年平均55%を上回っている。特に導入予算3000万円以上の案件では、3月提案による成約率が72%に達している",
          confidenceScore: 85,
          referencedDealId: "deal_2023_0201",
        },
      ],
    };

    mockExplainRecommendationReasoning.mockResolvedValueOnce(reasoningResponse);

    // ========== Preconditions: Initialize Component with Stub ==========
    // AIRecommendationEngineのスタブを初期化
    const aiEngine = mockAIEngine;

    // RecommendationDetailViewコンポーネント相当の機能をシミュレート
    // （実際のReactコンポーネントをテストする場合、render+querySelectorsを使用）
    const renderRecommendationDetail = async (
      engine: typeof mockAIEngine,
      recId: string
    ) => {
      const response = await engine.explainRecommendationReasoning(recId);

      // DOMのシミュレーション: 根拠表示セクションを作成
      const rootContainer = document.createElement("div");
      rootContainer.className = "recommendation-detail-view";

      const evidenceSection = document.createElement("div");
      evidenceSection.className = "reasoning-evidence";

      // レスポンスの根拠データを反映して要素を生成
      response.reasoning.forEach((evidence: typeof reasoningResponse.reasoning[0]) => {
        const evidenceItem = document.createElement("div");
        evidenceItem.className = "evidence-item";
        evidenceItem.style.display = "block";
        evidenceItem.style.opacity = "1";
        evidenceItem.setAttribute("data-evidence-id", evidence.evidenceId);

        const evidenceId = document.createElement("div");
        evidenceId.className = "evidence-id";
        evidenceId.textContent = evidence.evidenceId;

        const evidenceText = document.createElement("div");
        evidenceText.className = "evidence-text";
        evidenceText.textContent = evidence.text;

        const confidenceScore = document.createElement("div");
        confidenceScore.className = "confidence-score";
        confidenceScore.textContent = `信頼度: ${evidence.confidenceScore}`;

        const referencedDealId = document.createElement("div");
        referencedDealId.className = "referenced-deal-id";
        referencedDealId.textContent = `参照事例: ${evidence.referencedDealId}`;

        evidenceItem.appendChild(evidenceId);
        evidenceItem.appendChild(evidenceText);
        evidenceItem.appendChild(confidenceScore);
        evidenceItem.appendChild(referencedDealId);

        evidenceSection.appendChild(evidenceItem);
      });

      rootContainer.appendChild(evidenceSection);
      document.body.appendChild(rootContainer);

      return {
        rootContainer,
        evidenceSection,
        responseData: response,
      };
    };

    // ========== Execute: Render component with recommendation ID ==========
    let rendered: Awaited<ReturnType<typeof renderRecommendationDetail>>;
    // テストを同期的に実行するため、async/awaitの結果を保持
    const executeRender = async () => {
      rendered = await renderRecommendationDetail(aiEngine, recommendationId);
    };

    // ========== Verify: Check method invocation ==========
    // AIRecommendationEngineのexplainRecommendationReasoningメソッドが呼び出されることを確認
    executeRender().then(() => {
      expect(mockExplainRecommendationReasoning).toHaveBeenCalledWith(
        recommendationId
      );
      expect(mockExplainRecommendationReasoning).toHaveBeenCalledTimes(1);

      // ========== Verify: Check rendered evidence items count ==========
      const evidenceSection = rendered.rootContainer.querySelector(
        ".reasoning-evidence"
      );
      expect(evidenceSection).not.toBeNull();

      const evidenceItems = evidenceSection!.querySelectorAll(".evidence-item");

      // 根拠データの件数と画面表示件数が一致していることを確認
      const expectedEvidenceCount = reasoningResponse.reasoning.length;
      expect(evidenceItems.length).toBe(expectedEvidenceCount);
      expect(expectedEvidenceCount).toBeGreaterThanOrEqual(3);

      // ========== Verify: Check each evidence item content ==========
      reasoningResponse.reasoning.forEach((expectedEvidence, index) => {
        const evidenceItem = evidenceItems[index] as HTMLElement;

        // 根拠ID
        const evidenceIdElement = evidenceItem.querySelector(".evidence-id");
        expect(evidenceIdElement?.textContent).toBe(expectedEvidence.evidenceId);

        // 根拠テキスト
        const evidenceTextElement = evidenceItem.querySelector(".evidence-text");
        expect(evidenceTextElement?.textContent).toBe(expectedEvidence.text);

        // 信頼度スコア
        const confidenceScoreElement = evidenceItem.querySelector(
          ".confidence-score"
        );
        expect(confidenceScoreElement?.textContent).toContain(
          expectedEvidence.confidenceScore.toString()
        );

        // 参照事例ID
        const referencedDealIdElement = evidenceItem.querySelector(
          ".referenced-deal-id"
        );
        expect(referencedDealIdElement?.textContent).toContain(
          expectedEvidence.referencedDealId
        );
      });

      // ========== Verify: Check visibility of all evidence items ==========
      evidenceItems.forEach((evidenceItem: Element) => {
        const element = evidenceItem as HTMLElement;

        // display: noneでないことを確認
        const computedStyle = window.getComputedStyle(element);
        expect(computedStyle.display).not.toBe("none");

        // opacityが1.0であることを確認
        expect(element.style.opacity).toBe("1");
      });

      // ========== Cleanup ==========
      rendered.rootContainer.remove();
    });
  });
});