import { convertProcessRequirementToSystemRequirement } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  // SCEN-199: [edge] 判定基準の精度が許容範囲下限値未満（例：-5.1%）のとき、要件として却下される
  test('判定基準精度が許容範囲下限値未満の場合、要件は却下状態に更新される', () => {
    // Arrange: 判定基準精度が -5.1% の要件オブジェクトを作成
    const processRequirement = {
      requirementId: 'REQ-2024-001',
      processStage: '初回接触',
      criteria: '顧客との初回接触は営業日以内に実施',
      criteriaAccuracy: -5.1,
      status: '承認待ち',
      rejectionReason: null,
    };

    // Act: システム要件変換機能を実行
    const result = convertProcessRequirementToSystemRequirement(
      processRequirement,
      -5.0, // 許容範囲下限値: -5.0%
    );

    // Assert: 要件のステータスが「却下」に変更され、却下理由が格納されていること
    expect(result.status).toBe('却下');
    expect(result.rejectionReason).toMatch(
      /判定基準精度が許容範囲下限値.*-5\.0%.*下回っています.*-5\.1%/,
    );
    // 要件は標準書に反映されていない（systemRequirementオブジェクトが生成されていない）
    expect(result.systemRequirement).toBeUndefined();
  });
});