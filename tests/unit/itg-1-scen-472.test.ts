import { describe, it, expect } from '@jest/globals';
import { generateActivityPatternAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  it('SCEN-472: 営業活動ログが空の場合、エラーを返す', () => {
    const salesPersonId = 'SP-001';
    const emptyActivityLogs: never[] = [];

    expect(() => {
      generateActivityPatternAnalysisReport(salesPersonId, emptyActivityLogs);
    }).toThrow(/営業活動ログが存在しません/);
  });
});