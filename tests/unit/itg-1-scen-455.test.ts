import { analyzeProposalQuality } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  test("SCEN-455: 提案内容の項目が1つ欠けている場合、欠けている項目を検出して異常として可視化される", () => {
    const proposal_id = "PROP-20240115-001";
    const customer_name = "A株式会社";
    const proposal_date = "2024-01-15";
    const amount = 500000;
    const proposal_background = "顧客の業務効率化要件";
    const proposal_content = "システム導入による自動化";
    const implementation_effect = "";
    const delivery_schedule = "2024-03-31";

    const result = analyzeProposalQuality({
      proposal_id,
      customer_name,
      proposal_date,
      amount,
      proposal_background,
      proposal_content,
      implementation_effect,
      delivery_schedule,
    });

    expect(result.data_quality_warning).toBe(true);
    expect(result.missing_fields).toEqual(["導入効果"]);
    expect(result.severity).toBe("高");
    expect(result.validation_status).toBe("失敗");
    expect(result.error_message).toBe(
      '提案プロセスの完全性チェック失敗 - 必須項目「導入効果」が入力されていません'
    );
    expect(result.visual_indicator).toBe("⚠ 項目不足");
    expect(result.background_highlight_color).toBe("red");
  });
});