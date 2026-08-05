import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { generateActionPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1121
  it('[error] 営業担当者が営業プロセス定義と異なる組織に属しているとき、処理がエラーになること', () => {
    const salesPersonOrgId = 'ORG-001';
    const processDefinitionOrgId = 'ORG-002';
    
    const reportInput = {
      salesPersonId: 'SP-001',
      salesPersonOrgId: salesPersonOrgId,
      salesPersonName: '田中太郎',
      processDefinitionId: 'PD-001',
      processDefinitionOrgId: processDefinitionOrgId,
      analysisMonth: '2024-01',
      reportGeneratedAt: new Date('2024-01-15T10:00:00Z')
    };

    expect(() => {
      generateActionPatternAnalysisReport(reportInput);
    }).toThrow(/組織/);
  });
});