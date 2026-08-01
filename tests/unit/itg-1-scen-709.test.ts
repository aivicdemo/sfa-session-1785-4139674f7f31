import { judgeApprovalCriteria } from "../../src/logic/it-1-br-2-1-1-1";

describe("成功・失敗要因の抽出と承認基準判定機能", () => {
  // SCEN-709
  test("複数件の成功要因と失敗要因が混在するとき、それぞれが独立して承認基準で判定される", () => {
    const successFactors = [
      {
        factorId: "SUC-001",
        factorType: "success",
        confidence: 0.85,
        description: "初回接触後24時間以内フォローアップ",
      },
      {
        factorId: "SUC-002",
        factorType: "success",
        confidence: 0.78,
        description: "提案資料カスタマイズ実施",
      },
      {
        factorId: "SUC-003",
        factorType: "success",
        confidence: 0.92,
        description: "顧客課題ヒアリング充実",
      },
    ];

    const failureFactors = [
      {
        factorId: "FAL-001",
        factorType: "failure",
        impactScore: 6,
        description: "提案内容が顧客ニーズ不一致",
      },
      {
        factorId: "FAL-002",
        factorType: "failure",
        impactScore: 3,
        description: "フォローアップ間隔が長すぎた",
      },
    ];

    const approvalCriteria = {
      successConfidenceThreshold: 0.8,
      failureImpactScoreThreshold: 5,
    };

    const result = judgeApprovalCriteria(
      [...successFactors, ...failureFactors],
      approvalCriteria
    );

    expect(result).toHaveLength(5);

    const suc001Result = result.find((r) => r.factorId === "SUC-001");
    expect(suc001Result).toEqual({
      factorId: "SUC-001",
      factorType: "success",
      status: "approved",
      confidence: 0.85,
      description: "初回接触後24時間以内フォローアップ",
    });

    const suc002Result = result.find((r) => r.factorId === "SUC-002");
    expect(suc002Result).toEqual({
      factorId: "SUC-002",
      factorType: "success",
      status: "not_approved",
      confidence: 0.78,
      description: "提案資料カスタマイズ実施",
    });

    const suc003Result = result.find((r) => r.factorId === "SUC-003");
    expect(suc003Result).toEqual({
      factorId: "SUC-003",
      factorType: "success",
      status: "approved",
      confidence: 0.92,
      description: "顧客課題ヒアリング充実",
    });

    const fal001Result = result.find((r) => r.factorId === "FAL-001");
    expect(fal001Result).toEqual({
      factorId: "FAL-001",
      factorType: "failure",
      status: "approved",
      impactScore: 6,
      description: "提案内容が顧客ニーズ不一致",
    });

    const fal002Result = result.find((r) => r.factorId === "FAL-002");
    expect(fal002Result).toEqual({
      factorId: "FAL-002",
      factorType: "failure",
      status: "not_approved",
      impactScore: 3,
      description: "フォローアップ間隔が長すぎた",
    });

    const approvedCount = result.filter(
      (r) => r.status === "approved"
    ).length;
    expect(approvedCount).toBe(3);

    const notApprovedCount = result.filter(
      (r) => r.status === "not_approved"
    ).length;
    expect(notApprovedCount).toBe(2);
  });
});