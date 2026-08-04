import { validateRecommendationAccuracyPeriod } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-374
  test('検証対象期間の開始日が終了日より後のとき、精度検証がエラーになる', () => {
    const start_date = new Date('2026-12-31T00:00:00Z');
    const end_date = new Date('2026-12-01T00:00:00Z');

    expect(() => {
      validateRecommendationAccuracyPeriod(start_date, end_date);
    }).toThrow(/検証対象期間の開始日は終了日より前の日付/);
  });
});