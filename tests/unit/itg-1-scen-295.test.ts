import { recordCustomerResponse } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-295
  test('顧客反応記録・標準化機能 - 提案への反応を標準分類パターンに従って記録される', () => {
    const proposal_id = 'PROP-001';
    const classification_pattern = '積極的検討';
    const classification_code = 'RC-003';
    const reaction_content = '予算確保の目処が立ったため、次回打ち合わせを希望';
    const recorded_at = '2024-01-15T11:00:00Z';
    const status = '記録完了';

    const input = {
      proposal_id,
      classification_pattern,
      reaction_content,
      recorded_at,
    };

    const result = recordCustomerResponse(input);

    expect(result).toEqual({
      proposal_id: 'PROP-001',
      classification_pattern: '積極的検討',
      classification_code: 'RC-003',
      reaction_content: '予算確保の目処が立ったため、次回打ち合わせを希望',
      recorded_at: '2024-01-15T11:00:00Z',
      status: '記録完了',
    });
  });
});