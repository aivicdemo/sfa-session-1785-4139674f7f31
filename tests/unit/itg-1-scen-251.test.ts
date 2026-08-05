import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { calculateMonthlyProcessComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  // SCEN-251: [edge] 標準プロセス遵守度スコア計算機能 - 営業担当者の商談記録が月初日に入力されたとき正しく集計される
  test('should calculate monthly process compliance score of 100.0 when all 3 required items are completed on first day of month', () => {
    // Arrange: 月初日（1月1日）の日時をモック設定
    const monthStartDate = new Date('2024-01-01T00:00:00Z');
    jest.setSystemTime(monthStartDate);

    // 営業担当者IDを「SALES-001」とした商談記録を作成
    // プロセス遵守項目「初回接触記録・商品説明・次回予定記載」（3項目すべて完了）
    const dealRecord = {
      sales_person_id: 'SALES-001',
      deal_description: '新規顧客提案',
      deal_date: '2024-01-01T09:30:00Z',
      first_contact_recorded: true,
      product_explanation_completed: true,
      next_meeting_scheduled: true,
    };

    // Act: 標準プロセス遵守度スコア計算機能を実行
    const result = calculateMonthlyProcessComplianceScore({
      sales_person_id: dealRecord.sales_person_id,
      target_year: 2024,
      target_month: 1,
      deal_records: [dealRecord],
    });

    // Assert: SALES-001の1月度標準プロセス遵守度スコアが100.0（3/3項目達成）と計算される
    expect(result.compliance_score).toBe(100.0);

    // 商談記録1件が当月分の集計に含まれる
    expect(result.deal_count).toBe(1);

    // 内訳として「初回接触記録：完了」「商品説明：完了」「次回予定記載：完了」と記録される
    expect(result.process_items_breakdown).toEqual({
      first_contact_recorded: {
        status: '完了',
        completed_count: 1,
      },
      product_explanation_completed: {
        status: '完了',
        completed_count: 1,
      },
      next_meeting_scheduled: {
        status: '完了',
        completed_count: 1,
      },
    });

    // 対象月が1月であることを確認
    expect(result.target_year).toBe(2024);
    expect(result.target_month).toBe(1);
    expect(result.sales_person_id).toBe('SALES-001');
  });
});