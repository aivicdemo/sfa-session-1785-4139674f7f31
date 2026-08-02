import { detectDuplicateCustomersAndExecuteMergeJudgment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-441
  test('重複候補顧客が1件の場合、その顧客との重複判定が実行される', () => {
    const input_customer = {
      customer_id: 'CUST-001',
      customer_name: '山田太郎',
      email: 'yamada@example.com',
    };

    const duplicate_candidate = {
      customer_id: 'CUST-089',
      customer_name: '山田太郎',
      email: 'yamada.taro@example.com',
      similarity_score: 0.92,
    };

    const merge_judgment_call_log: Array<{
      target_customer_id: string;
      input_customer: typeof input_customer;
      candidate_customer: typeof duplicate_candidate;
    }> = [];

    const stub_detect_duplicates = jest.fn(
      (customer: typeof input_customer) => {
        if (customer.customer_id === 'CUST-001') {
          return [duplicate_candidate];
        }
        return [];
      }
    );

    const stub_execute_merge_judgment = jest.fn(
      (
        candidate_id: string,
        input_cust: typeof input_customer,
        candidate_cust: typeof duplicate_candidate
      ) => {
        merge_judgment_call_log.push({
          target_customer_id: candidate_id,
          input_customer: input_cust,
          candidate_customer: candidate_cust,
        });
        return {
          is_duplicate: true,
          judgment_reason_code: 'SIMILARITY_HIGH',
          similarity_score: 0.92,
        };
      }
    );

    const result = detectDuplicateCustomersAndExecuteMergeJudgment(
      input_customer,
      stub_detect_duplicates,
      stub_execute_merge_judgment
    );

    expect(stub_execute_merge_judgment).toHaveBeenCalledTimes(1);
    expect(stub_execute_merge_judgment).toHaveBeenCalledWith(
      'CUST-089',
      input_customer,
      duplicate_candidate
    );

    expect(merge_judgment_call_log).toHaveLength(1);
    expect(merge_judgment_call_log[0].target_customer_id).toBe('CUST-089');
    expect(merge_judgment_call_log[0].input_customer).toEqual(input_customer);
    expect(merge_judgment_call_log[0].candidate_customer).toEqual(
      duplicate_candidate
    );

    expect(result).toEqual({
      is_duplicate: true,
      judgment_reason_code: 'SIMILARITY_HIGH',
      similarity_score: 0.92,
    });
  });
});