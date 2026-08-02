import { detectDuplicatesAndMergeAssessment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-254
  test('重複候補データが重複を含むとき、重複データの統合判定が同じ結果になる', () => {
    const duplicate_candidate_data_1 = {
      id: 1,
      customer_name: '株式会社テスト',
      customer_kana: 'カブシキガイシャテスト',
      postal_code: '100-0001',
      prefecture: '東京都',
      city: '千代田区',
      street_address: '丸の内1-1-1',
      phone_number: '03-1234-5678',
      email: 'test@example.com',
    };

    const duplicate_candidate_data_2 = {
      id: 2,
      customer_name: '(株)テスト',
      customer_kana: 'カブシキガイシャテスト',
      postal_code: '100-0001',
      prefecture: '東京都',
      city: '千代田区',
      street_address: '丸の内1-1-1',
      phone_number: '03-1234-5678',
      email: 'test@example.com',
    };

    const duplicate_candidate_data_3 = {
      id: 3,
      customer_name: 'テスト株式会社',
      customer_kana: 'テストカブシキガイシャ',
      postal_code: '100-0001',
      prefecture: '東京都',
      city: '千代田区',
      street_address: '丸の内1丁目1番地1号',
      phone_number: '03-1234-5678',
      email: 'test@example.com',
    };

    const duplicate_candidate_group = [
      duplicate_candidate_data_1,
      duplicate_candidate_data_2,
      duplicate_candidate_data_3,
    ];

    const first_execution_result = detectDuplicatesAndMergeAssessment(
      duplicate_candidate_group
    );

    const second_execution_result = detectDuplicatesAndMergeAssessment(
      duplicate_candidate_group
    );

    expect(first_execution_result.is_duplicate).toBe(true);
    expect(first_execution_result.merge_target_record_ids).toEqual(
      new Set([1, 2, 3])
    );

    expect(second_execution_result.is_duplicate).toBe(true);
    expect(second_execution_result.merge_target_record_ids).toEqual(
      new Set([1, 2, 3])
    );

    expect(first_execution_result.is_duplicate).toBe(
      second_execution_result.is_duplicate
    );
    expect(
      Array.from(first_execution_result.merge_target_record_ids).sort(
        (a, b) => a - b
      )
    ).toEqual(
      Array.from(second_execution_result.merge_target_record_ids).sort(
        (a, b) => a - b
      )
    );
  });
});