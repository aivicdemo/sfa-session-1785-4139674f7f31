import { calculateStandardProcessComplianceScore } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-290: [error] 標準プロセス遵守度スコア計算 - 初回接触ステップの日付が空値のとき、スコア計算がエラーになる
  test('初回接触ステップの日付が null のとき、ValidationError をスロー', () => {
    const sales_record = {
      sales_representative_id: 'SR001',
      customer_id: 'CUST001',
      contact_start_date: null,
      proposal_date: new Date('2024-01-20T10:00:00Z'),
      negotiation_date: new Date('2024-02-01T14:00:00Z'),
      contract_date: new Date('2024-02-15T09:00:00Z'),
    };

    expect(() => calculateStandardProcessComplianceScore(sales_record)).toThrow(
      /初回接触ステップの日付/
    );
  });

  test('初回接触ステップの日付が空文字列のとき、ValidationError をスロー', () => {
    const sales_record = {
      sales_representative_id: 'SR002',
      customer_id: 'CUST002',
      contact_start_date: '',
      proposal_date: new Date('2024-01-20T10:00:00Z'),
      negotiation_date: new Date('2024-02-01T14:00:00Z'),
      contract_date: new Date('2024-02-15T09:00:00Z'),
    };

    expect(() => calculateStandardProcessComplianceScore(sales_record)).toThrow(
      /初回接触ステップの日付/
    );
  });
});