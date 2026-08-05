import { validateGuidelineDistributionCompletion } from '../../src/logic/it-1-br-2-1-1';

describe('成功パターン適用ガイドライン周知完了判定機能', () => {
  // SCEN-1030
  test('営業チーム全体へのガイドライン配布完了フラグが欠落しているとき前提条件不満たしでエラーになること', () => {
    const guidelineId = 'GL-20240115-001';
    const announcementDateTime = new Date('2024-01-15T09:00:00Z');
    const salesTeamId = 'TEAM-sales-001';
    const guidelineDistributionCompletedFlag = null;

    expect(() => {
      validateGuidelineDistributionCompletion({
        guidelineId,
        announcementDateTime,
        salesTeamId,
        guidelineDistributionCompletedFlag,
      });
    }).toThrow(/営業チーム全体へのガイドライン配布完了フラグ/);
  });
});