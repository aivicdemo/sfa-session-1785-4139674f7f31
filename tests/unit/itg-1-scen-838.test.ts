import { validateReviewDateTime } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-838: [error] 問題検出結果のレビュー・判定機能 - レビュー実施日時が有効な日時形式ではない場合にエラーになること
  test('レビュー実施日時が無効な日時形式の場合、バリデーションエラーを投げること', () => {
    const invalid_datetime_formats = [
      '2024-13-45',
      'abc',
      '2024/12/31 25:99:99',
      '2024-12-31 25:00:00',
      '2024-13-01 10:00:00',
      '2024-12-32 10:00:00',
      '2024-12-31 10:60:00',
      '2024-12-31 10:00:60',
      '',
      '2024-12-31',
      '10:00:00',
      'null',
      '2024-12-31T10:00:00Z',
      '31/12/2024 10:00:00',
    ];

    invalid_datetime_formats.forEach((invalid_format) => {
      expect(() => validateReviewDateTime(invalid_format)).toThrow(
        /日時形式/
      );
    });
  });
});