import { calculateDepartmentHeadReportTargets } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-811
  test('問題検出結果が0件のとき、営業部長報告対象が空の配列として返される', () => {
    const detectedIssues: any[] = [];

    const result = calculateDepartmentHeadReportTargets(detectedIssues);

    expect(result.departmentHeadReportTargets).toEqual([]);
  });
});