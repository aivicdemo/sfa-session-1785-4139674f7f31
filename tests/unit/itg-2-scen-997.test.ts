import { validateProposalAndContactRecord } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 提案・顧客対応記録の必須項目検証', () => {
  // SCEN-997
  test('提案・顧客対応記録の必須項目検証 - すべての必須項目が充足している場合に記録がシステムに保存される', () => {
    const proposal_contact_record = {
      customer_name: '山田太郎',
      proposal_content: 'システム導入支援',
      contact_datetime: '2024-01-15T10:00:00Z',
      assigned_staff: '鈴木花子',
      status: '進行中'
    };

    const validation_result = validateProposalAndContactRecord(proposal_contact_record);

    expect(validation_result.is_valid).toBe(true);
    expect(validation_result.saved_record).toEqual({
      record_id: expect.any(Number),
      customer_name: '山田太郎',
      proposal_content: 'システム導入支援',
      contact_datetime: '2024-01-15T10:00:00Z',
      assigned_staff: '鈴木花子',
      status: '進行中'
    });
    expect(validation_result.saved_record.record_id).toBeGreaterThan(0);
  });
});