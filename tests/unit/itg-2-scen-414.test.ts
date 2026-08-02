import { detectDuplicateAndApplyNormalization } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複検出と統合判定機能 - 正規化ルール適用エラー時の統合判定スキップ', () => {
  // SCEN-414
  test('正規化ルール処理が失敗した場合、統合判定処理がスキップされる', () => {
    const duplicate_candidates = [
      {
        customer_id_1: 'C001',
        customer_id_2: 'C002',
        similarity_score: 0.95,
      },
    ];

    const result = detectDuplicateAndApplyNormalization(
      duplicate_candidates
    );

    expect(result).toEqual({
      normalization_succeeded: false,
      merge_judgment_executed: false,
      error_message: expect.stringMatching(/正規化ルール/),
    });
  });
});