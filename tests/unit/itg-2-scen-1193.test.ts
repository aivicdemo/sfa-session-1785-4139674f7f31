import { visualizeDetectedIssuePatterns } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-1193
  test('検出問題パターンの可視化 - 入力漏れエラーの件数が11件の場合、件数が正確に集計される', () => {
    const missing_field_errors = Array.from({ length: 11 }, (_, index) => ({
      error_id: `missing_field_${index + 1}`,
      error_type: 'missing_field',
      affected_record_id: `record_${index + 1}`,
      field_name: `field_${index + 1}`,
      detected_at: new Date('2024-01-15T10:00:00Z').toISOString(),
    }));

    const result = visualizeDetectedIssuePatterns(missing_field_errors);

    expect(result.pattern_summary).toEqual(
      expect.objectContaining({
        missing_field: 11,
      })
    );

    expect(result.visualization_data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          issue_type: 'missing_field',
          count: 11,
        }),
      ])
    );

    const missing_field_item = result.visualization_data.find(
      (item: { issue_type: string; count: number }) => item.issue_type === 'missing_field'
    );
    expect(missing_field_item?.count).toBe(11);
  });
});