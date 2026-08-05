import { determineInferenceExecutability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行可否判定機能', () => {
  // SCEN-157
  test('学習データの検証完了日が今日より前のとき検証済みとして判定される', () => {
    const today = new Date('2024-12-20T00:00:00Z');
    const validatedOnePastDay = new Date('2024-12-19T00:00:00Z');

    const result = determineInferenceExecutability({
      learningDataValidatedAt: validatedOnePastDay,
      currentDate: today,
    });

    expect(result.isValidated).toBe(true);
  });
});