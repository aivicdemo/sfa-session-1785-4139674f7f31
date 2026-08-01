import { validateGuidelineCompletionSubmissions } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-739: 成功パターン適用ガイドラインの周知完了判定機能 - 提出日時が欠落している営業担当者レコードが存在するときエラーが発生する', () => {
    const salesRepRecords = [
      {
        sales_rep_id: 'REP001',
        sales_rep_name: '営業担当者A',
        submission_datetime: new Date('2024-01-15T10:30:00Z'),
        completion_status: 'COMPLETED',
      },
      {
        sales_rep_id: 'REP002',
        sales_rep_name: '営業担当者B',
        submission_datetime: new Date('2024-01-15T11:00:00Z'),
        completion_status: 'COMPLETED',
      },
      {
        sales_rep_id: 'REP003',
        sales_rep_name: '営業担当者C',
        submission_datetime: null,
        completion_status: 'PENDING',
      },
      {
        sales_rep_id: 'REP004',
        sales_rep_name: '営業担当者D',
        submission_datetime: new Date('2024-01-15T09:45:00Z'),
        completion_status: 'COMPLETED',
      },
      {
        sales_rep_id: 'REP005',
        sales_rep_name: '営業担当者E',
        submission_datetime: new Date('2024-01-15T14:20:00Z'),
        completion_status: 'COMPLETED',
      },
      {
        sales_rep_id: 'REP006',
        sales_rep_name: '営業担当者F',
        submission_datetime: undefined,
        completion_status: 'PENDING',
      },
      {
        sales_rep_id: 'REP007',
        sales_rep_name: '営業担当者G',
        submission_datetime: new Date('2024-01-15T13:15:00Z'),
        completion_status: 'COMPLETED',
      },
      {
        sales_rep_id: 'REP008',
        sales_rep_name: '営業担当者H',
        submission_datetime: new Date('2024-01-15T12:00:00Z'),
        completion_status: 'COMPLETED',
      },
      {
        sales_rep_id: 'REP009',
        sales_rep_name: '営業担当者I',
        submission_datetime: null,
        completion_status: 'PENDING',
      },
      {
        sales_rep_id: 'REP010',
        sales_rep_name: '営業担当者J',
        submission_datetime: new Date('2024-01-15T15:30:00Z'),
        completion_status: 'COMPLETED',
      },
    ];

    expect(() => {
      validateGuidelineCompletionSubmissions(salesRepRecords);
    }).toThrow(/SUBMISSION_DATETIME_MISSING/);

    expect(() => {
      validateGuidelineCompletionSubmissions(salesRepRecords);
    }).toThrow(/REP003/);
  });
});