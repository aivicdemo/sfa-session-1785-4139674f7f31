import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析指標自動選定機能', () => {
  // SCEN-1058
  test('[normal] 営業プロセス標準書と成約実績が存在する場合、フォローアップ間隔が指標リストに含まれる', () => {
    // セットアップ: 営業プロセス標準書が存在する状態
    const salesProcessStandardBook = {
      id: 'process_std_001',
      name: '営業プロセス標準書',
      stages: [
        {
          stage_name: '初回接触',
          key_activities: ['初回顧客訪問', '顧客ニーズヒアリング'],
        },
        {
          stage_name: '提案',
          key_activities: ['提案資料作成', '提案実施'],
        },
        {
          stage_name: '交渉',
          key_activities: ['価格交渉', '条件調整'],
        },
        {
          stage_name: '成約',
          key_activities: ['契約締結', '納品手配'],
        },
      ],
      created_at: new Date('2024-01-01T00:00:00Z'),
    };

    // セットアップ: 成約実績データが存在する状態
    const contract_results = [
      {
        id: 'contract_001',
        sales_rep_id: 'rep_001',
        customer_id: 'cust_001',
        initial_contact_date: new Date('2024-01-10T09:00:00Z'),
        proposal_date: new Date('2024-01-15T10:00:00Z'),
        negotiation_date: new Date('2024-01-20T14:00:00Z'),
        contract_date: new Date('2024-01-25T15:00:00Z'),
        contract_amount: 500000,
        status: 'completed',
      },
      {
        id: 'contract_002',
        sales_rep_id: 'rep_002',
        customer_id: 'cust_002',
        initial_contact_date: new Date('2024-01-08T09:00:00Z'),
        proposal_date: new Date('2024-01-12T11:00:00Z'),
        negotiation_date: new Date('2024-01-18T13:00:00Z'),
        contract_date: new Date('2024-01-22T16:00:00Z'),
        contract_amount: 750000,
        status: 'completed',
      },
    ];

    // 実行: 行動パターン分析指標自動選定機能を実行
    const result = selectAnalysisIndicators({
      sales_process_standard_book: salesProcessStandardBook,
      contract_results: contract_results,
    });

    // 検証: 返却される指標リストを取得
    expect(result).toBeDefined();
    expect(Array.isArray(result.indicators)).toBe(true);
    expect(result.indicators.length).toBeGreaterThan(0);

    // 検証: 指標リストにフォローアップ間隔が含まれているかを確認
    const follow_up_interval_indicator = result.indicators.find(
      (indicator: { name: string }) => indicator.name === 'フォローアップ間隔'
    );
    expect(follow_up_interval_indicator).toBeDefined();
    expect(follow_up_interval_indicator.name).toBe('フォローアップ間隔');
  });
});