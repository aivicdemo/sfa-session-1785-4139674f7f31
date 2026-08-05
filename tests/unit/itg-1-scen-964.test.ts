import { normalizeSuccessFactors } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-964: [normal] 成功要因・失敗要因の抽出と承認基準検証 - 抽出された成功要因が言語化基準を満たすテキストフォーマットで正規化される
  test('should normalize success factors to meet linguistic standards (noun+predicate, 20-100 chars, no special chars)', () => {
    // 入力: 前後に空白を含むテキスト、既に基準を満たすテキスト、複合的な表現
    const input_1_with_whitespace = '  顧客ニーズを事前ヒアリングして提案書に反映させた  ';
    const input_2_already_valid = '提案資料のビジュアル強化';
    const input_3_compound_expression = '営業担当者による定期的なフォローアップ体制の構築';

    // 正規化処理実行
    const normalized_1 = normalizeSuccessFactors(input_1_with_whitespace);
    const normalized_2 = normalizeSuccessFactors(input_2_already_valid);
    const normalized_3 = normalizeSuccessFactors(input_3_compound_expression);

    // 期待結果1: 前後の空白が除去されたテキスト
    expect(normalized_1).toBe('顧客ニーズを事前ヒアリングして提案書に反映させた');

    // 期待結果2: 既に基準を満たすテキストは変わらない
    expect(normalized_2).toBe('提案資料のビジュアル強化');

    // 期待結果3: 複合表現が基準を満たす形で保持される
    expect(normalized_3).toBe('営業担当者による定期的なフォローアップ体制の構築');

    // 言語化基準の検証: 文字数範囲（20-100文字）
    expect(normalized_1.length).toBeGreaterThanOrEqual(20);
    expect(normalized_1.length).toBeLessThanOrEqual(100);
    expect(normalized_2.length).toBeGreaterThanOrEqual(20);
    expect(normalized_2.length).toBeLessThanOrEqual(100);
    expect(normalized_3.length).toBeGreaterThanOrEqual(20);
    expect(normalized_3.length).toBeLessThanOrEqual(100);

    // 言語化基準の検証: 名詞+述語形式（特殊文字なし、ひらがな/カタカナ/漢字/数字のみ）
    const linguistic_format_pattern = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF0-9ぁ-んァ-ヴー一-龯々々、。！？]*$/;
    expect(linguistic_format_pattern.test(normalized_1)).toBe(true);
    expect(linguistic_format_pattern.test(normalized_2)).toBe(true);
    expect(linguistic_format_pattern.test(normalized_3)).toBe(true);

    // 言語化基準の検証: 前後の空白が完全に除去されたことを確認
    expect(normalized_1).not.toMatch(/^\s/);
    expect(normalized_1).not.toMatch(/\s$/);
  });
});