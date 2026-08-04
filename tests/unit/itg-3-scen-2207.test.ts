import { evaluateContactSequenceDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨支援システム - 推奨根拠の可視化機能', () => {
  // SCEN-2207
  test('顧客対応の接触パターンが成功パターンと完全に逆順のとき、順序乖離スコアが最大値1.0で算出される', () => {
    const successful_contact_sequence = ['contact_1', 'contact_2', 'contact_3'];
    const customer_contact_sequence = ['contact_3', 'contact_2', 'contact_1'];

    const deviation_score = evaluateContactSequenceDeviation({
      successful_pattern: successful_contact_sequence,
      actual_sequence: customer_contact_sequence,
    });

    expect(deviation_score).toBe(1.0);
  });
});