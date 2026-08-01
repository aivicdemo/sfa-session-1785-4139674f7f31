import { transformProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-129
  test('プロセス標準書のシステム要件変換機能 - 判定基準が1件の場合、1件分がシステム仕様に変換される', () => {
    const processStandard = {
      processStandardId: 'PS-001',
      processName: '営業プロセス標準',
      judgmentCriteria: [
        {
          judgmentCriteriaId: 'JDG-001',
          criteriaName: '売上目標達成率',
          judgmentLogic: '達成率≧100%',
          importance: '必須',
        },
      ],
    };

    const result = transformProcessStandardToSystemRequirements(processStandard);

    expect(result).toEqual({
      systemRequirements: [
        {
          specificationId: 'SYS-JDG-001',
          specificationName: '売上目標達成率チェック',
          specificationDescription: '達成率が100%以上であることを判定する',
          priority: '1',
          validationMethod: '自動検証',
          status: '新規作成',
        },
      ],
    });
  });
});