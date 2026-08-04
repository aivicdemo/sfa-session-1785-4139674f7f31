import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-392: [edge] 推論精度検証機能 - 推奨内容と実際の結果が一致したレコードが複数件のとき、合計数を精度計算に反映
  test('推論精度が複数件の一致レコードを基に正しく計算される', () => {
    const matchedRecords = [
      {
        recommendedContent: '提案A',
        actualResult: '提案A',
        matchedFlag: true,
      },
      {
        recommendedContent: '提案B',
        actualResult: '提案B',
        matchedFlag: true,
      },
      {
        recommendedContent: '提案C',
        actualResult: '提案C',
        matchedFlag: true,
      },
    ];

    const totalRecordCount = 4;

    const result = calculateInferenceAccuracy(matchedRecords, totalRecordCount);

    expect(result.accuracy).toBe(0.75);
    expect(result.matchedCount).toBe(3);
    expect(result.totalCount).toBe(4);
  });
});