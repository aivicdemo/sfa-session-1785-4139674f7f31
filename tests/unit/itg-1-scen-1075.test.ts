import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeAndSelectSalesMetrics } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  let mockDb: {
    salesStaff: Array<{ id: number; name: string }>;
    analysisResults: Array<{ staffId: number; metrics: string[] }>;
  };

  beforeEach(() => {
    mockDb = {
      salesStaff: [
        { id: 1001, name: '田中太郎' },
        { id: 1002, name: '佐藤次郎' },
      ],
      analysisResults: [],
    };
  });

  afterEach(() => {
    mockDb.salesStaff = [];
    mockDb.analysisResults = [];
  });

  // SCEN-1075
  it('[error] 行動パターン分析指標自動選定機能 - 指定した営業担当者が営業担当者マスタに存在しない場合にエラーが発生する', () => {
    const nonExistentStaffId = 9999;
    const existingStaffIds = mockDb.salesStaff.map(staff => staff.id);

    expect(existingStaffIds).toContain(1001);
    expect(existingStaffIds).not.toContain(nonExistentStaffId);

    expect(() => {
      analyzeAndSelectSalesMetrics({
        staffId: nonExistentStaffId,
        staffRepository: mockDb.salesStaff,
        analysisRepository: mockDb.analysisResults,
      });
    }).toThrow(/営業担当者_not_found/);

    const error = (() => {
      try {
        analyzeAndSelectSalesMetrics({
          staffId: nonExistentStaffId,
          staffRepository: mockDb.salesStaff,
          analysisRepository: mockDb.analysisResults,
        });
      } catch (e: unknown) {
        return e as { code: string; message: string };
      }
    })();

    expect(error?.code).toBe('営業担当者_not_found');
    expect(error?.message).toMatch(/指定した営業担当者ID\(9999\)は営業担当者マスタに存在しません/);

    expect(mockDb.analysisResults).toHaveLength(0);
  });
});