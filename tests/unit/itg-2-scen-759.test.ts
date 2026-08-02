import { generateSignalDetectionBasis } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-759
  test('信号検出根拠生成機能 - 反応パターンが1件のとき、根拠に具体的なパターンが記載される', () => {
    const reaction_patterns = [
      {
        pattern_id: 'PATTERN-001',
        pattern_name: '大口顧客の急激な購買増加',
        detection_rule: '月間購買額が前月比150%以上'
      }
    ];

    const basis = generateSignalDetectionBasis(reaction_patterns);

    expect(basis).toContain('PATTERN-001');
    expect(basis).toContain('大口顧客の急激な購買増加');
    expect(basis).toContain('月間購買額が前月比150%以上');
  });
});