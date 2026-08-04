import { calculateScore } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2406
  test('推論根拠データが空のとき、エラーが発生する', () => {
    const emptyReasoningData: Array<{
      patternId: string;
      matchScore: number;
      evidenceCount: number;
    }> = [];

    expect(() => calculateScore(emptyReasoningData)).toThrow(/推論根拠データ/);
  });
});