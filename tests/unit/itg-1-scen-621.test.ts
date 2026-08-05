import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-621
  test('顧客対応パターンのタイムスタンプが無効な値のときエラーになる', () => {
    // Arrange
    const { analyzeCustomerInteractionPatterns } = require('../../src/logic/it-1-br-2-1-1');

    const invalidPatterns = [
      {
        recordId: 'CUST-001',
        salesPersonId: 'SP-001',
        customerId: 'C-001',
        interactionTimestamp: 'invalid-date',
        interactionType: 'call',
        proposalContent: 'Product A',
        customerResponse: 'interested',
        followUpScheduled: true,
      },
      {
        recordId: 'CUST-002',
        salesPersonId: 'SP-001',
        customerId: 'C-001',
        interactionTimestamp: '9999-99-99T99:99:99Z',
        interactionType: 'email',
        proposalContent: 'Product B',
        customerResponse: 'pending',
        followUpScheduled: false,
      },
      {
        recordId: 'CUST-003',
        salesPersonId: 'SP-001',
        customerId: 'C-001',
        interactionTimestamp: null,
        interactionType: 'visit',
        proposalContent: 'Product C',
        customerResponse: 'declined',
        followUpScheduled: false,
      },
      {
        recordId: 'CUST-004',
        salesPersonId: 'SP-001',
        customerId: 'C-001',
        interactionTimestamp: undefined,
        interactionType: 'call',
        proposalContent: 'Product D',
        customerResponse: 'interested',
        followUpScheduled: true,
      },
    ];

    const analysisInput = {
      periodStartDate: '2024-01-01',
      periodEndDate: '2024-01-31',
      salesPersonId: 'SP-001',
      customerInteractionPatterns: invalidPatterns,
    };

    // Act & Assert
    expect(() => {
      analyzeCustomerInteractionPatterns(analysisInput);
    }).toThrow(/タイムスタンプが無効/);
  });
});