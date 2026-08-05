import { calculateDivergenceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-255: [edge] 乖離パターン判定機能 - 同一営業担当者の重複した商談記録を含むとき乖離度が正しく計算される
  test('should correctly calculate divergence score for duplicate deal records from same sales rep', () => {
    // Arrange: 同一営業担当者による重複した商談記録を準備
    const salesRepId = 'SA001';
    const customerId = 'C100';
    const dealAmount = 1000000;
    const expectedContractDate = new Date('2024-03-31T00:00:00Z');

    const duplicateDealRecords = [
      {
        deal_id: 'D001',
        sales_rep_id: salesRepId,
        customer_id: customerId,
        deal_amount: dealAmount,
        expected_contract_date: expectedContractDate,
        created_at: new Date('2024-03-15T09:00:00Z'),
      },
      {
        deal_id: 'D002',
        sales_rep_id: salesRepId,
        customer_id: customerId,
        deal_amount: dealAmount,
        expected_contract_date: expectedContractDate,
        created_at: new Date('2024-03-15T10:30:00Z'),
      },
    ];

    // Act: 乖離度計算エンジンに重複商談記録を入力して計算処理を実行
    const result = calculateDivergenceScore(duplicateDealRecords);

    // Assert: 計算結果の乖離度スコアと判定パターンを検証
    // 乖離度スコアが0.85以上0.95以下の範囲で計算されることを確認
    expect(result.divergence_score).toBeGreaterThanOrEqual(0.85);
    expect(result.divergence_score).toBeLessThanOrEqual(0.95);

    // 判定パターンが「重複記録_同一営業」と判定されることを確認
    expect(result.divergence_pattern).toBe('重複記録_同一営業');

    // 重複の原因メッセージが正しく生成されることを確認
    expect(result.duplicate_reason).toMatch(/D001/);
    expect(result.duplicate_reason).toMatch(/D002/);
    expect(result.duplicate_reason).toMatch(/同一顧客/);
    expect(result.duplicate_reason).toMatch(/同一金額/);
    expect(result.duplicate_reason).toMatch(/同一契約予定日/);

    // 重複商談IDのリストが正しく識別されることを確認
    expect(result.duplicate_deal_ids).toContain('D001');
    expect(result.duplicate_deal_ids).toContain('D002');
    expect(result.duplicate_deal_ids).toHaveLength(2);

    // 同一営業担当者IDが正しく記録されることを確認
    expect(result.sales_rep_id).toBe(salesRepId);

    // 同一顧客IDが正しく記録されることを確認
    expect(result.customer_id).toBe(customerId);
  });
});