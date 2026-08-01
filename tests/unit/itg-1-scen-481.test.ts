import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-481
  test('営業担当者の営業活動ログの訪問件数が分析される', () => {
    const sales_rep_id = 'SR001';
    const sales_rep_name = '田中太郎';
    const analysis_start_date = new Date('2024-11-15T00:00:00Z');
    const analysis_end_date = new Date('2024-12-15T00:00:00Z');

    const activity_logs = [
      {
        log_id: 'LOG001',
        sales_rep_id: sales_rep_id,
        activity_type: '訪問',
        activity_date: new Date('2024-12-10T09:00:00Z'),
        customer_id: 'CUST001',
        activity_details: '初回訪問'
      },
      {
        log_id: 'LOG002',
        sales_rep_id: sales_rep_id,
        activity_type: '訪問',
        activity_date: new Date('2024-12-09T10:30:00Z'),
        customer_id: 'CUST002',
        activity_details: 'フォローアップ訪問'
      },
      {
        log_id: 'LOG003',
        sales_rep_id: sales_rep_id,
        activity_type: '訪問',
        activity_date: new Date('2024-12-08T14:00:00Z'),
        customer_id: 'CUST003',
        activity_details: '提案訪問'
      },
      {
        log_id: 'LOG004',
        sales_rep_id: sales_rep_id,
        activity_type: '訪問',
        activity_date: new Date('2024-12-07T11:15:00Z'),
        customer_id: 'CUST004',
        activity_details: '契約確認訪問'
      },
      {
        log_id: 'LOG005',
        sales_rep_id: sales_rep_id,
        activity_type: '訪問',
        activity_date: new Date('2024-12-06T15:45:00Z'),
        customer_id: 'CUST005',
        activity_details: 'ニーズ確認訪問'
      },
      {
        log_id: 'LOG006',
        sales_rep_id: sales_rep_id,
        activity_type: '訪問',
        activity_date: new Date('2024-12-05T09:30:00Z'),
        customer_id: 'CUST006',
        activity_details: 'アフターサービス訪問'
      },
      {
        log_id: 'LOG007',
        sales_rep_id: sales_rep_id,
        activity_type: '訪問',
        activity_date: new Date('2024-12-04T13:00:00Z'),
        customer_id: 'CUST007',
        activity_details: '新規営業訪問'
      },
      {
        log_id: 'LOG008',
        sales_rep_id: sales_rep_id,
        activity_type: '訪問',
        activity_date: new Date('2024-12-03T10:45:00Z'),
        customer_id: 'CUST008',
        activity_details: '展示会フォローアップ訪問'
      },
      {
        log_id: 'LOG009',
        sales_rep_id: sales_rep_id,
        activity_type: '訪問',
        activity_date: new Date('2024-12-02T16:20:00Z'),
        customer_id: 'CUST009',
        activity_details: '競合対策訪問'
      },
      {
        log_id: 'LOG010',
        sales_rep_id: sales_rep_id,
        activity_type: '訪問',
        activity_date: new Date('2024-12-01T11:00:00Z'),
        customer_id: 'CUST010',
        activity_details: '決算前フォローアップ訪問'
      },
      {
        log_id: 'LOG011',
        sales_rep_id: sales_rep_id,
        activity_type: '電話',
        activity_date: new Date('2024-12-14T09:00:00Z'),
        customer_id: 'CUST011',
        activity_details: '受注確認電話'
      },
      {
        log_id: 'LOG012',
        sales_rep_id: sales_rep_id,
        activity_type: '電話',
        activity_date: new Date('2024-12-13T10:00:00Z'),
        customer_id: 'CUST012',
        activity_details: 'ニーズヒアリング電話'
      },
      {
        log_id: 'LOG013',
        sales_rep_id: sales_rep_id,
        activity_type: '電話',
        activity_date: new Date('2024-12-12T14:30:00Z'),
        customer_id: 'CUST013',
        activity_details: '提案内容確認電話'
      },
      {
        log_id: 'LOG014',
        sales_rep_id: sales_rep_id,
        activity_type: '電話',
        activity_date: new Date('2024-12-11T15:00:00Z'),
        customer_id: 'CUST014',
        activity_details: '進捗確認電話'
      },
      {
        log_id: 'LOG015',
        sales_rep_id: sales_rep_id,
        activity_type: '電話',
        activity_date: new Date('2024-11-30T10:15:00Z'),
        customer_id: 'CUST015',
        activity_details: 'リマインダー電話'
      },
      {
        log_id: 'LOG016',
        sales_rep_id: sales_rep_id,
        activity_type: 'メール',
        activity_date: new Date('2024-12-14T08:00:00Z'),
        customer_id: 'CUST016',
        activity_details: '提案資料送付メール'
      },
      {
        log_id: 'LOG017',
        sales_rep_id: sales_rep_id,
        activity_type: 'メール',
        activity_date: new Date('2024-12-13T09:30:00Z'),
        customer_id: 'CUST017',
        activity_details: 'お礼メール'
      },
      {
        log_id: 'LOG018',
        sales_rep_id: sales_rep_id,
        activity_type: 'メール',
        activity_date: new Date('2024-12-12T11:00:00Z'),
        customer_id: 'CUST018',
        activity_details: '見積依頼メール'
      },
      {
        log_id: 'LOG019',
        sales_rep_id: sales_rep_id,
        activity_type: 'メール',
        activity_date: new Date('2024-12-11T13:45:00Z'),
        customer_id: 'CUST019',
        activity_details: 'キャンペーン案内メール'
      },
      {
        log_id: 'LOG020',
        sales_rep_id: sales_rep_id,
        activity_type: 'メール',
        activity_date: new Date('2024-12-10T16:00:00Z'),
        customer_id: 'CUST020',
        activity_details: 'セミナー招待メール'
      },
      {
        log_id: 'LOG021',
        sales_rep_id: sales_rep_id,
        activity_type: 'メール',
        activity_date: new Date('2024-12-09T10:20:00Z'),
        customer_id: 'CUST021',
        activity_details: 'ニュースレターメール'
      },
      {
        log_id: 'LOG022',
        sales_rep_id: sales_rep_id,
        activity_type: 'メール',
        activity_date: new Date('2024-12-08T14:30:00Z'),
        customer_id: 'CUST022',
        activity_details: '納期確認メール'
      },
      {
        log_id: 'LOG023',
        sales_rep_id: sales_rep_id,
        activity_type: 'メール',
        activity_date: new Date('2024-12-07T15:15:00Z'),
        customer_id: 'CUST023',
        activity_details: '価格見積メール'
      }
    ];

    const report = generateBehaviorPatternAnalysisReport({
      sales_rep_id: sales_rep_id,
      sales_rep_name: sales_rep_name,
      analysis_start_date: analysis_start_date,
      analysis_end_date: analysis_end_date,
      activity_logs: activity_logs
    });

    expect(report.sales_rep_id).toBe(sales_rep_id);
    expect(report.sales_rep_name).toBe(sales_rep_name);
    expect(report.analysis_period_start).toEqual(analysis_start_date);
    expect(report.analysis_period_end).toEqual(analysis_end_date);
    expect(report.visit_count).toBe(10);
  });
});