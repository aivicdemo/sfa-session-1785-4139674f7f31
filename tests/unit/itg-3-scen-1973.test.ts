import { generatePersuasionMaterial } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能 - 経営層向け説得資料自動生成", () => {
  test("SCEN-1973: 生成された説得資料にリスク要因が正確に含まれる", () => {
    // テスト用顧客情報
    const customer_info = {
      industry: "金融サービス",
      company_size: "1000名以上",
      current_challenges: ["デジタル化推進", "顧客データ管理"],
      budget_constraint: 5000000,
    };

    // テスト用提案内容
    const proposal_content = {
      product_name: "クラウドベースデータ管理プラットフォーム",
      overview: "セキュアで拡張性の高いデータ管理基盤",
      expected_effects: [
        "顧客データ一元管理による業務効率化",
        "リアルタイム分析能力の向上",
      ],
    };

    // AIRecommendationEngine のスタブ
    const mock_ai_engine = {
      generateRecommendation: jest.fn(() => ({
        recommended_approach: "段階的なパイロット導入",
        reasoning_basis: {
          similar_cases: [
            {
              case_id: "CASE-2023-001",
              industry: "金融サービス",
              company_size: "1000名以上",
              success_outcome: true,
            },
            {
              case_id: "CASE-2023-015",
              industry: "金融サービス",
              company_size: "1000名以上",
              success_outcome: true,
            },
          ],
          pattern_master: {
            technical_risk: "既存システムとの統合複雑性",
            market_risk: "市場での類似ソリューション増加傾向",
            competitive_risk: "競合ベンダーの機能拡張動向",
            operational_risk: "運用チーム技術スキルの学習曲線",
            regulatory_risk: "金融規制への継続的対応要件",
          },
        },
      })),
    };

    // 説得資料自動生成機能を実行
    const generated_material = generatePersuasionMaterial(
      customer_info,
      proposal_content,
      mock_ai_engine
    );

    // 生成された資料のコンテンツをパース
    expect(generated_material).toBeDefined();
    expect(generated_material.material_type).toBe("executive_persuasion");

    // リスク要因セクションを抽出
    const risk_section = generated_material.sections.find(
      (section) => section.type === "risk_factors"
    );
    expect(risk_section).toBeDefined();
    expect(risk_section.content).toBeDefined();

    // 5つのリスク要因がすべて含まれていることを確認
    const risk_content = risk_section.content;
    expect(risk_content).toMatch(/技術的リスク/);
    expect(risk_content).toMatch(/市場環境リスク/);
    expect(risk_content).toMatch(/競合動向リスク/);
    expect(risk_content).toMatch(/運用リスク/);
    expect(risk_content).toMatch(/規制リスク/);

    // 各リスク要因が事例データベースの推奨パターンマスタから参照された内容と一致
    expect(generated_material.risk_factors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          risk_type: "technical",
          description: expect.stringContaining("既存システムとの統合複雑性"),
          evidence_source: "pattern_master",
        }),
        expect.objectContaining({
          risk_type: "market",
          description: expect.stringContaining("市場での類似ソリューション増加傾向"),
          evidence_source: "pattern_master",
        }),
        expect.objectContaining({
          risk_type: "competitive",
          description: expect.stringContaining("競合ベンダーの機能拡張動向"),
          evidence_source: "pattern_master",
        }),
        expect.objectContaining({
          risk_type: "operational",
          description: expect.stringContaining(
            "運用チーム技術スキルの学習曲線"
          ),
          evidence_source: "pattern_master",
        }),
        expect.objectContaining({
          risk_type: "regulatory",
          description: expect.stringContaining("金融規制への継続的対応要件"),
          evidence_source: "pattern_master",
        }),
      ])
    );

    // AIエージェントが生成資料内のリスク要因の根拠を過去成功事例に基づいて記述していることを確認
    generated_material.risk_factors.forEach((risk_factor) => {
      expect(risk_factor.reasoning_base).toBeDefined();
      expect(risk_factor.reasoning_base.type).toMatch(
        /past_success_case|similar_failure_case/
      );
      expect(risk_factor.reasoning_base.case_reference).toBeDefined();
      expect(risk_factor.reasoning_base.case_reference).toMatch(/CASE-\d{4}-\d{3}/);
    });

    // 検証：AIRecommendationEngine が正しく呼び出されたことを確認
    expect(mock_ai_engine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: "金融サービス",
        company_size: "1000名以上",
      }),
      expect.objectContaining({
        product_name: "クラウドベースデータ管理プラットフォーム",
      })
    );

    // 検証：リスク要因の総数が5であること
    expect(generated_material.risk_factors).toHaveLength(5);

    // 検証：すべてのリスク要因に根拠が存在すること
    generated_material.risk_factors.forEach((risk_factor) => {
      expect(risk_factor.reasoning_base).not.toBeNull();
      expect(risk_factor.reasoning_base.evidence).not.toBe("");
    });
  });
});