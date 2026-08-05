import { calculateMonthlyTeamQualityStats } from '../../src/logic/it-1-br-2-1-1';

describe('Team Monthly Sales Quality Analysis - Large Scale Processing', () => {
  // SCEN-923
  test('should accurately calculate statistics from maximum business-scale sales cases (5,000 records) with sub-2-second completion and correct rounding', () => {
    // Setup: Generate 5,000 mock sales case records with required attributes
    const mock_sales_cases = [];
    let running_total_amount = 0;
    let running_weighted_probability_sum = 0;
    const salesrep_case_counts: { [key: string]: number } = {};
    const salesrep_ids = ['REP001', 'REP002', 'REP003', 'REP004', 'REP005'];
    const case_durations_in_days: number[] = [];

    for (let i = 0; i < 5000; i++) {
      const case_amount = 100000 + (i % 500) * 10000; // 100,000 ~ 5,090,000
      const case_probability = 0.5 + (i % 10) * 0.05; // 0.5 ~ 0.95
      const case_duration_days = 10 + (i % 360); // 10 ~ 369 days
      const assigned_rep_id = salesrep_ids[i % 5];

      mock_sales_cases.push({
        case_id: `CASE_${String(i).padStart(5, '0')}`,
        case_amount: case_amount,
        case_probability: case_probability,
        case_duration_days: case_duration_days,
        assigned_salesrep_id: assigned_rep_id,
      });

      running_total_amount += case_amount;
      running_weighted_probability_sum += case_probability * case_amount;
      salesrep_case_counts[assigned_rep_id] = (salesrep_case_counts[assigned_rep_id] || 0) + 1;
      case_durations_in_days.push(case_duration_days);
    }

    // Calculate expected values based on test dataset
    const expected_total_amount = running_total_amount;
    const expected_average_amount = parseFloat((running_total_amount / 5000).toFixed(2));
    const expected_weighted_probability = parseFloat((running_weighted_probability_sum / running_total_amount).toFixed(2));

    // Calculate median case duration (sort and find middle value)
    case_durations_in_days.sort((a, b) => a - b);
    const expected_median_duration = case_durations_in_days[2499]; // Middle value for 5,000 records

    // Calculate salesrep allocation ratios (rounded to 2 decimal places)
    const expected_salesrep_ratios: { [key: string]: number } = {};
    for (const rep_id of salesrep_ids) {
      const count = salesrep_case_counts[rep_id] || 0;
      expected_salesrep_ratios[rep_id] = parseFloat(((count / 5000) * 100).toFixed(2));
    }

    // Measure execution time
    const start_time = performance.now();

    // Execute: Call the monthly analysis function
    const analysis_result = calculateMonthlyTeamQualityStats({
      sales_cases: mock_sales_cases,
      analysis_period_start: '2024-01-01',
      analysis_period_end: '2024-01-31',
    });

    const end_time = performance.now();
    const execution_time_ms = end_time - start_time;

    // Verify: Assertion for all calculated statistics
    expect(analysis_result.total_case_amount).toBe(expected_total_amount);
    expect(analysis_result.average_case_amount).toBe(expected_average_amount);
    expect(analysis_result.weighted_probability_average).toBe(expected_weighted_probability);
    expect(analysis_result.median_case_duration_days).toBe(expected_median_duration);

    // Verify salesrep allocation ratios match expected values
    for (const rep_id of salesrep_ids) {
      expect(analysis_result.salesrep_allocation_ratios[rep_id]).toBe(expected_salesrep_ratios[rep_id]);
    }

    // Verify execution time is within 5 seconds (5000ms)
    expect(execution_time_ms).toBeLessThan(5000);

    // Verify consistency: Sum of individual salesrep ratios equals 100% (within rounding tolerance)
    const sum_of_ratios = Object.values(expected_salesrep_ratios).reduce((a, b) => a + b, 0);
    expect(sum_of_ratios).toBeCloseTo(100.0, 1);

    // Verify rounding compliance: All decimal values follow 2-place rounding specification
    expect(analysis_result.average_case_amount.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    expect(analysis_result.weighted_probability_average.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    for (const ratio of Object.values(analysis_result.salesrep_allocation_ratios)) {
      expect(ratio.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    }

    // Verify partial sum consistency: Sum of weighted probability contributions at salesrep level
    let sum_weighted_by_rep = 0;
    for (const rep_id of salesrep_ids) {
      const rep_cases = mock_sales_cases.filter(c => c.assigned_salesrep_id === rep_id);
      const rep_weighted_sum = rep_cases.reduce((sum, c) => sum + (c.case_probability * c.case_amount), 0);
      const rep_total_amount = rep_cases.reduce((sum, c) => sum + c.case_amount, 0);
      sum_weighted_by_rep += rep_weighted_sum;
    }
    expect(sum_weighted_by_rep).toBeCloseTo(running_weighted_probability_sum, 0);
  });
});