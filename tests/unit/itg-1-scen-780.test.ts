import { classifyProblemsWithSeverity } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-780: [normal] 問題検出結果の重要度・優先度分類機能 - 営業担当者の提案内容に関連する問題が適切に重要度で分類される
  test('提案内容から検出された問題が正確に重要度分類される', () => {
    // Arrange: テストデータセット準備
    const testProblems = [
      {
        problemId: 'prob_001',
        problemType: 'customer_requirement_unfulfilled',
        proposalContent: '顧客が要求した予算上限 5,000万円を超える提案内容（提案額 6,000万円）',
        detectionTimestamp: '2024-01-15T10:30:00Z',
      },
      {
        problemId: 'prob_002',
        problemType: 'proposal_inconsistency',
        proposalContent: '提案資料の1ページ目で「導入期間3ヶ月」と記載、3ページ目で「導入期間6ヶ月」と矛盾記載',
        detectionTimestamp: '2024-01-15T10:35:00Z',
      },
      {
        problemId: 'prob_003',
        problemType: 'proposal_format_defect',
        proposalContent: '提案資料に企業ロゴが欠落、規定のテンプレート形式に非準拠',
        detectionTimestamp: '2024-01-15T10:40:00Z',
      },
      {
        problemId: 'prob_004',
        problemType: 'customer_requirement_unfulfilled',
        proposalContent: '顧客が要求した機能「在庫管理モジュール」が提案から抜け落ち',
        detectionTimestamp: '2024-01-15T10:45:00Z',
      },
      {
        problemId: 'prob_005',
        problemType: 'proposal_inconsistency',
        proposalContent: '提案価格表で単価と合計が不一致（単価5万円×10個＝合計45万円と記載）',
        detectionTimestamp: '2024-01-15T10:50:00Z',
      },
    ];

    // Act: 問題検出エンジンで重要度分類を実行
    const classificationResult = classifyProblemsWithSeverity(testProblems);

    // Assert: 検出された問題オブジェクトの重要度フィールドを確認
    // 顧客要件未充足の問題 → 重要度『高』に分類
    const customerRequirementProblems = classificationResult.filter(
      (p: { problemType: string; severity: string }) =>
        p.problemType === 'customer_requirement_unfulfilled'
    );
    expect(customerRequirementProblems).toHaveLength(2);
    expect(customerRequirementProblems[0].severity).toBe('high');
    expect(customerRequirementProblems[1].severity).toBe('high');

    // 提案内容の矛盾・不整合 → 重要度『中』に分類
    const inconsistencyProblems = classificationResult.filter(
      (p: { problemType: string; severity: string }) =>
        p.problemType === 'proposal_inconsistency'
    );
    expect(inconsistencyProblems).toHaveLength(2);
    expect(inconsistencyProblems[0].severity).toBe('medium');
    expect(inconsistencyProblems[1].severity).toBe('medium');

    // 提案資料の形式不備 → 重要度『低』に分類
    const formatDefectProblems = classificationResult.filter(
      (p: { problemType: string; severity: string }) =>
        p.problemType === 'proposal_format_defect'
    );
    expect(formatDefectProblems).toHaveLength(1);
    expect(formatDefectProblems[0].severity).toBe('low');

    // 複数の異なる問題タイプを含むテストデータで同じ分類ルールが一貫して適用される検証
    expect(classificationResult).toHaveLength(5);
    const allProblems = classificationResult;
    expect(allProblems[0].severity).toBe('high'); // customer_requirement_unfulfilled
    expect(allProblems[1].severity).toBe('medium'); // proposal_inconsistency
    expect(allProblems[2].severity).toBe('low'); // proposal_format_defect
    expect(allProblems[3].severity).toBe('high'); // customer_requirement_unfulfilled（2番目）
    expect(allProblems[4].severity).toBe('medium'); // proposal_inconsistency（2番目）

    // 同じ問題タイプは常に同じ重要度値を保持することを確認
    const highSeverityProblems = allProblems.filter(
      (p: { severity: string }) => p.severity === 'high'
    );
    const mediumSeverityProblems = allProblems.filter(
      (p: { severity: string }) => p.severity === 'medium'
    );
    const lowSeverityProblems = allProblems.filter(
      (p: { severity: string }) => p.severity === 'low'
    );

    expect(highSeverityProblems).toHaveLength(2);
    expect(mediumSeverityProblems).toHaveLength(2);
    expect(lowSeverityProblems).toHaveLength(1);

    // 全ての問題が正確に『高』『中』『低』のいずれかに分類されていることを確認
    expect(
      allProblems.every(
        (p: { severity: string }) =>
          p.severity === 'high' || p.severity === 'medium' || p.severity === 'low'
      )
    ).toBe(true);

    // 各問題がproblemIdを保持し、分類後も追跡可能であることを確認
    expect(allProblems[0]).toHaveProperty('problemId', 'prob_001');
    expect(allProblems[1]).toHaveProperty('problemId', 'prob_002');
    expect(allProblems[2]).toHaveProperty('problemId', 'prob_003');
    expect(allProblems[3]).toHaveProperty('problemId', 'prob_004');
    expect(allProblems[4]).toHaveProperty('problemId', 'prob_005');
  });
});