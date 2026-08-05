import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesActivityAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-550
  test('営業活動ログの担当者IDが欠落している場合、エラーが返却される', () => {
    // Arrange
    const incompleteActivityLog = {
      sales_rep_id: null,
      activity_datetime: new Date('2024-01-15T10:30:00Z'),
      activity_type: 'visit',
      customer_id: 'CUST-001',
      duration_minutes: 45,
      notes: 'Initial contact'
    };

    // Act & Assert
    expect(() => generateSalesActivityAnalysisReport([incompleteActivityLog])).toThrow(/営業担当者ID/);
  });
});