import { describe, test, expect } from '@jest/globals';
import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析指標自動選定機能', () => {
  // SCEN-1067
  test('営業担当者IDが空文字の場合にエラーが発生する', () => {
    const input = {
      salesPersonId: '',
      processDefinitionId: 'PROC_001',
      periodStart: '2024-01-01T00:00:00Z',
      periodEnd: '2024-01-31T23:59:59Z',
    };

    expect(() => selectAnalysisIndicators(input)).toThrow(/営業担当者ID/);
  });
});