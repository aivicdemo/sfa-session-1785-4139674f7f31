import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2410
  test('推論精度スコア算出機能 - 精度スコアの型がnumberでないとき、エラーが発生する', () => {
    const invalidAccuracyScore = '85.5';

    expect(() => {
      calculateInferenceAccuracyScore(invalidAccuracyScore as any);
    }).toThrow(/精度スコア/);

    try {
      calculateInferenceAccuracyScore(invalidAccuracyScore as any);
    } catch (error: any) {
      expect(error.name).toBe('TypeError');
      expect(error.message).toContain('精度スコアはnumber型である必要があります');
    }
  });
});