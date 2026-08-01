import { determineTeamGuidelineCompletionStatus } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-734
  test('成功パターン適用ガイドラインの周知完了判定機能 - チーム全体の周知完了判定フラグが正しく演算される', () => {
    const guidelineId = 'guideline-001';
    const teamMembers = [
      {
        memberId: 'memberA',
        guidelineId: guidelineId,
        completionFlag: true,
      },
      {
        memberId: 'memberB',
        guidelineId: guidelineId,
        completionFlag: true,
      },
      {
        memberId: 'memberC',
        guidelineId: guidelineId,
        completionFlag: false,
      },
    ];

    const result = determineTeamGuidelineCompletionStatus(
      guidelineId,
      teamMembers
    );

    expect(result.guidelineId).toBe('guideline-001');
    expect(result.isTeamComplete).toBe(false);
    expect(result.completionRatio).toBe(2 / 3);
    expect(result.totalMembers).toBe(3);
    expect(result.completedMembers).toBe(2);
  });
});