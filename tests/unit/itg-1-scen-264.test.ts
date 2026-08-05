import { calculateDeviationScore, determinePriority } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-264
  test('行動パターン分析と改善指導優先順位判定機能 - 商談進捗が0件、提案内容が複数件、顧客接触頻度が複数件の組み合わせで乖離度が計算され、改善指導内容が判定される', () => {
    // テストデータ準備
    const salesPersonId = 'salesperson_A';
    const dealProgressCount = 0; // 商談進捗件数: 0件
    const proposalContentCount = 3; // 提案内容件数: 3件
    const customerContactFrequency = 5; // 顧客接触頻度: 5回/月
    const standardProcessStepCompletion = {
      firstContact: true,
      proposal: true,
      negotiation: false,
      closure: false,
    };

    // 乖離度計算ロジック実行
    const deviationScore = calculateDeviationScore({
      salesPersonId,
      dealProgressCount,
      proposalContentCount,
      customerContactFrequency,
      standardProcessStepCompletion,
    });

    // 乖離度スコア確認: 期待値は70以上
    expect(deviationScore).toBeGreaterThanOrEqual(70);
    expect(typeof deviationScore).toBe('number');
    expect(deviationScore).toBeLessThanOrEqual(100);

    // 改善指導優先順位判定機能実行
    const priorityResult = determinePriority({
      salesPersonId,
      deviationScore,
      dealProgressCount,
      proposalContentCount,
      customerContactFrequency,
    });

    // 改善指導優先順位が『高』と判定される
    expect(priorityResult.priority).toBe('high');

    // 改善指導内容に『クロージング技法研修』に関する内容が含まれる
    expect(priorityResult.guidanceContent).toMatch(/クロージング技法研修/);

    // 改善指導内容に『商談化へ繋げる』の概念が含まれる
    expect(priorityResult.guidanceContent).toMatch(/商談化/);

    // 改善指導内容は文字列型
    expect(typeof priorityResult.guidanceContent).toBe('string');

    // 改善指導内容の長さが妥当（空でなく、極端に長くない）
    expect(priorityResult.guidanceContent.length).toBeGreaterThan(0);
    expect(priorityResult.guidanceContent.length).toBeLessThan(500);

    // 優先順位判定結果に営業担当者IDが含まれている
    expect(priorityResult.salesPersonId).toBe(salesPersonId);
  });
});