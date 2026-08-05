import { determineProposalApproach } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-382
  test('成功パターンマッチング・提案アプローチ判定機能 - 同一入力で2回実行したとき、同じ提案アプローチが特定される', () => {
    // 提案アプローチ判定機能を初期化する
    const testInputData = {
      customerSegment: 'large_manufacturing',
      budgetRange: 50000000,
      decisionTimeframe: 90,
    };

    // 1回目の実行：上記入力データを提案アプローチ判定機能に投入し、判定結果を変数 result1 に格納する
    const result1 = determineProposalApproach(testInputData);

    // 2回目の実行：同一の入力データを提案アプローチ判定機能に投入し、判定結果を変数 result2 に格納する
    const result2 = determineProposalApproach(testInputData);

    // result1 と result2 の提案アプローチコード（例：'strategic_partnership'）が完全に一致することを検証する
    expect(result1.approachCode).toBe('strategic_partnership');
    expect(result2.approachCode).toBe('strategic_partnership');
    expect(result1.approachCode).toEqual(result2.approachCode);

    // result1 と result2 の詳細パラメータ（提案資料タイプ、初期接触手段、フォローアップ頻度）が完全に一致することを検証する
    expect(result1.proposalMaterialType).toBe('whitepaper_and_case_study');
    expect(result2.proposalMaterialType).toBe('whitepaper_and_case_study');
    expect(result1.proposalMaterialType).toEqual(result2.proposalMaterialType);

    expect(result1.initialContactMethod).toBe('executive_briefing');
    expect(result2.initialContactMethod).toBe('executive_briefing');
    expect(result1.initialContactMethod).toEqual(result2.initialContactMethod);

    expect(result1.followUpFrequency).toBe('weekly');
    expect(result2.followUpFrequency).toBe('weekly');
    expect(result1.followUpFrequency).toEqual(result2.followUpFrequency);

    // 判定結果全体が完全に一致することを検証する
    expect(result1).toEqual(result2);
  });
});