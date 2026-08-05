import { calculateAiInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-768
  test('[edge] AIエージェント推論精度評価機能 - 営業担当者の行動パターン分析対象データに重複が含まれるとき、重複排除後に精度スコアが算出される', () => {
    // 重複を含むサンプルデータセット（10件）
    // 同一の顧客訪問記録が3件、同一の提案内容が2件含まれる
    const duplicateDataset = [
      {
        id: 'activity_1',
        salesRepId: 'rep_001',
        customerId: 'cust_A',
        activityType: 'visit',
        activityDate: '2024-01-15',
        proposalContent: 'product_X_proposal_v1',
        outcome: 'success'
      },
      {
        id: 'activity_2',
        salesRepId: 'rep_001',
        customerId: 'cust_A',
        activityType: 'visit',
        activityDate: '2024-01-15',
        proposalContent: 'product_X_proposal_v1',
        outcome: 'success'
      },
      {
        id: 'activity_3',
        salesRepId: 'rep_001',
        customerId: 'cust_A',
        activityType: 'visit',
        activityDate: '2024-01-15',
        proposalContent: 'product_X_proposal_v1',
        outcome: 'success'
      },
      {
        id: 'activity_4',
        salesRepId: 'rep_001',
        customerId: 'cust_B',
        activityType: 'call',
        activityDate: '2024-01-16',
        proposalContent: 'product_Y_proposal',
        outcome: 'pending'
      },
      {
        id: 'activity_5',
        salesRepId: 'rep_001',
        customerId: 'cust_C',
        activityType: 'email',
        activityDate: '2024-01-17',
        proposalContent: 'product_Z_proposal',
        outcome: 'failure'
      },
      {
        id: 'activity_6',
        salesRepId: 'rep_001',
        customerId: 'cust_B',
        activityType: 'call',
        activityDate: '2024-01-16',
        proposalContent: 'product_Y_proposal',
        outcome: 'pending'
      },
      {
        id: 'activity_7',
        salesRepId: 'rep_002',
        customerId: 'cust_D',
        activityType: 'visit',
        activityDate: '2024-01-18',
        proposalContent: 'product_X_proposal_v1',
        outcome: 'success'
      },
      {
        id: 'activity_8',
        salesRepId: 'rep_002',
        customerId: 'cust_E',
        activityType: 'email',
        activityDate: '2024-01-19',
        proposalContent: 'product_W_proposal',
        outcome: 'success'
      },
      {
        id: 'activity_9',
        salesRepId: 'rep_002',
        customerId: 'cust_F',
        activityType: 'visit',
        activityDate: '2024-01-20',
        proposalContent: 'product_V_proposal',
        outcome: 'pending'
      },
      {
        id: 'activity_10',
        salesRepId: 'rep_001',
        customerId: 'cust_C',
        activityType: 'email',
        activityDate: '2024-01-17',
        proposalContent: 'product_Z_proposal',
        outcome: 'failure'
      }
    ];

    // 精度スコア算出関数に入力
    const accuracyScoreWithDuplicates = calculateAiInferenceAccuracyScore(duplicateDataset);

    // 重複排除後のデータセット（期待値: 5件）
    const deduplicatedDataset = [
      {
        id: 'activity_1',
        salesRepId: 'rep_001',
        customerId: 'cust_A',
        activityType: 'visit',
        activityDate: '2024-01-15',
        proposalContent: 'product_X_proposal_v1',
        outcome: 'success'
      },
      {
        id: 'activity_4',
        salesRepId: 'rep_001',
        customerId: 'cust_B',
        activityType: 'call',
        activityDate: '2024-01-16',
        proposalContent: 'product_Y_proposal',
        outcome: 'pending'
      },
      {
        id: 'activity_5',
        salesRepId: 'rep_001',
        customerId: 'cust_C',
        activityType: 'email',
        activityDate: '2024-01-17',
        proposalContent: 'product_Z_proposal',
        outcome: 'failure'
      },
      {
        id: 'activity_7',
        salesRepId: 'rep_002',
        customerId: 'cust_D',
        activityType: 'visit',
        activityDate: '2024-01-18',
        proposalContent: 'product_X_proposal_v1',
        outcome: 'success'
      },
      {
        id: 'activity_8',
        salesRepId: 'rep_002',
        customerId: 'cust_E',
        activityType: 'email',
        activityDate: '2024-01-19',
        proposalContent: 'product_W_proposal',
        outcome: 'success'
      }
    ];

    // 重複排除後のデータセットに対して精度スコアを算出
    const accuracyScoreWithoutDuplicates = calculateAiInferenceAccuracyScore(deduplicatedDataset);

    // 検証: 算出された精度スコアが0～100の数値範囲内であることを確認
    expect(typeof accuracyScoreWithDuplicates).toBe('number');
    expect(accuracyScoreWithDuplicates).toBeGreaterThanOrEqual(0);
    expect(accuracyScoreWithDuplicates).toBeLessThanOrEqual(100);

    expect(typeof accuracyScoreWithoutDuplicates).toBe('number');
    expect(accuracyScoreWithoutDuplicates).toBeGreaterThanOrEqual(0);
    expect(accuracyScoreWithoutDuplicates).toBeLessThanOrEqual(100);

    // 検証: 重複排除前のデータセットに基づく精度スコアと重複排除後のスコアが異なることを確認
    expect(accuracyScoreWithDuplicates).not.toBe(accuracyScoreWithoutDuplicates);

    // 検証: 重複排除後のスコアが具体的な値（期待値: 87.5）であることを確認
    expect(accuracyScoreWithoutDuplicates).toBe(87.5);
  });
});