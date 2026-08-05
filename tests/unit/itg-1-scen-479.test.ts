import { generateBehaviorPatternReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-479: [error] 営業担当者ごとの行動パターン分析レポート生成機能 - 営業プロセス実行状況データが欠落している場合、エラーを返す
  test('営業プロセス実行状況データが欠落している場合、エラーレスポンスを返す', () => {
    const sales_id = 'sales_001';
    const incomplete_process_data = {
      sales_id: sales_id,
      customer_contact_datetime: null,
      proposal_content: 'テスト提案',
      contract_status: 'completed',
    };

    expect(() =>
      generateBehaviorPatternReport({
        sales_id: sales_id,
        process_execution_data: incomplete_process_data,
      })
    ).toThrow(/営業プロセス実行状況データが不完全です/);
  });
});