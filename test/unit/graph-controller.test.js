/**
 * Graph Controller Unit Tests
 * Tests for chart data generation logic - must pass before and after Chart.js migration
 */
import { describe, test, expect } from 'vitest';

// Mock the GraphController functions for testing
const GraphController = {
  get_steps: function() {
    return 20;
  },

  get_step_width: function(results, steps) {
    let max_val = 0;
    for (const i in results.loans) {
      for (let j = 0; j < results.loans[i].rows.length; j++) {
        if (max_val < parseFloat(results.loans[i].rows[j].balance_remaining)) {
          max_val = parseFloat(results.loans[i].rows[j].balance_remaining);
        }
      }
    }
    return Math.round(max_val / steps);
  },

  get_color_hash: function(i) {
    i = parseInt(i);
    let color_hash = {};
    switch (i % 5) {
      case 0:
        color_hash = {
          fillColor: "rgba(151,187,205,0.5)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff"
        };
        break;
      case 1:
        color_hash = {
          fillColor: "rgba(200,0,0,0.5)",
          strokeColor: "rgba(200,0,0,1)",
          pointColor: "rgba(200,0,0,1)",
          pointStrokeColor: "#fff"
        };
        break;
      case 2:
        color_hash = {
          fillColor: "rgba(50,50,50,0.5)",
          strokeColor: "rgba(50,50,50,1)",
          pointColor: "rgba(50,50,50,1)",
          pointStrokeColor: "#fff"
        };
        break;
      case 3:
        color_hash = {
          fillColor: "rgba(0,200,0,0.5)",
          strokeColor: "rgba(0,200,0,1)",
          pointColor: "rgba(0,200,0,1)",
          pointStrokeColor: "#fff"
        };
        break;
      case 4:
        color_hash = {
          fillColor: "rgba(0,0,200,0.5)",
          strokeColor: "rgba(0,0,200,1)",
          pointColor: "rgba(0,0,200,1)",
          pointStrokeColor: "#fff"
        };
        break;
    }
    return color_hash;
  },

  get_data: function(results) {
    let max_row_length = 0;
    let max_row_index = 0;
    const num_labels = 20;
    let step_size;
    const datasets = [];
    const keys = Object.keys(results.loans);
    keys.sort(function(a, b) {
      return results.loans[b].starting_balance - results.loans[a].starting_balance;
    });

    const labels = [];
    for (let i = 0; i < keys.length; i++) {
      const loan_key = keys[i];
      if (results.loans[loan_key].rows.length > max_row_length) {
        max_row_length = results.loans[loan_key].rows.length;
        max_row_index = loan_key;
      }
      if (results.loans[max_row_index].rows.length > num_labels) {
        step_size = Math.floor(results.loans[max_row_index].rows.length / num_labels);
      } else {
        step_size = 1;
      }
    }
    for (let i = 0; i < keys.length; i++) {
      const loan_key = keys[i];
      datasets[i] = GraphController.get_color_hash(loan_key);
      datasets[i].data = [];
      for (let j = 0; j < max_row_length; j += step_size) {
        if (results.loans[loan_key].rows[j]) {
          datasets[i].data.push(results.loans[loan_key].rows[j].balance_remaining);
        } else {
          datasets[i].data.push(0);
        }
      }
    }

    for (let i = 0; i < results.loans[max_row_index].rows.length; i += step_size) {
      labels.push(results.loans[max_row_index].rows[i].date);
    }

    return {
      labels: labels,
      datasets: datasets
    };
  }
};

describe('GraphController', () => {
  describe('get_steps', () => {
    test('returns 20 steps', () => {
      expect(GraphController.get_steps()).toBe(20);
    });
  });

  describe('get_step_width', () => {
    test('calculates step width from max balance', () => {
      const results = {
        loans: {
          '0': {
            rows: [
              { balance_remaining: 10000 },
              { balance_remaining: 8000 },
              { balance_remaining: 5000 }
            ]
          }
        }
      };
      const stepWidth = GraphController.get_step_width(results, 20);
      expect(stepWidth).toBe(500); // 10000 / 20 = 500
    });

    test('finds max across multiple loans', () => {
      const results = {
        loans: {
          '0': {
            rows: [{ balance_remaining: 5000 }]
          },
          '1': {
            rows: [{ balance_remaining: 15000 }]
          }
        }
      };
      const stepWidth = GraphController.get_step_width(results, 20);
      expect(stepWidth).toBe(750); // 15000 / 20 = 750
    });
  });

  describe('get_color_hash', () => {
    test('returns blue color for index 0', () => {
      const color = GraphController.get_color_hash(0);
      expect(color.fillColor).toBe("rgba(151,187,205,0.5)");
      expect(color.strokeColor).toBe("rgba(151,187,205,1)");
    });

    test('returns red color for index 1', () => {
      const color = GraphController.get_color_hash(1);
      expect(color.fillColor).toBe("rgba(200,0,0,0.5)");
    });

    test('cycles colors after 5', () => {
      const color0 = GraphController.get_color_hash(0);
      const color5 = GraphController.get_color_hash(5);
      expect(color0.fillColor).toBe(color5.fillColor);
    });

    test('handles string input', () => {
      const color = GraphController.get_color_hash('2');
      expect(color.fillColor).toBe("rgba(50,50,50,0.5)");
    });
  });

  describe('get_data', () => {
    test('generates chart data structure', () => {
      const results = {
        loans: {
          '0': {
            starting_balance: 10000,
            rows: [
              { date: 'January 2024', balance_remaining: 10000 },
              { date: 'February 2024', balance_remaining: 9500 },
              { date: 'March 2024', balance_remaining: 9000 }
            ]
          }
        }
      };

      const data = GraphController.get_data(results);

      expect(data.labels).toBeDefined();
      expect(data.datasets).toBeDefined();
      expect(data.labels.length).toBeGreaterThan(0);
      expect(data.datasets.length).toBe(1);
    });

    test('includes balance data points', () => {
      const results = {
        loans: {
          '0': {
            starting_balance: 5000,
            rows: [
              { date: 'Jan 2024', balance_remaining: 5000 },
              { date: 'Feb 2024', balance_remaining: 4000 }
            ]
          }
        }
      };

      const data = GraphController.get_data(results);
      expect(data.datasets[0].data).toContain(5000);
      expect(data.datasets[0].data).toContain(4000);
    });

    test('sorts loans by starting balance (highest first)', () => {
      const results = {
        loans: {
          '0': {
            starting_balance: 5000,
            rows: [{ date: 'Jan 2024', balance_remaining: 5000 }]
          },
          '1': {
            starting_balance: 10000,
            rows: [{ date: 'Jan 2024', balance_remaining: 10000 }]
          }
        }
      };

      const data = GraphController.get_data(results);
      // First dataset should be the higher balance loan
      expect(data.datasets[0].data[0]).toBe(10000);
    });

    test('pads shorter loans with zeros', () => {
      const results = {
        loans: {
          '0': {
            starting_balance: 10000,
            rows: [
              { date: 'Jan 2024', balance_remaining: 10000 },
              { date: 'Feb 2024', balance_remaining: 9000 },
              { date: 'Mar 2024', balance_remaining: 8000 }
            ]
          },
          '1': {
            starting_balance: 2000,
            rows: [
              { date: 'Jan 2024', balance_remaining: 2000 }
            ]
          }
        }
      };

      const data = GraphController.get_data(results);
      // Shorter loan should have zeros for missing months
      const smallerLoanData = data.datasets.find(d => d.data[0] === 2000);
      expect(smallerLoanData.data.length).toBe(3);
      expect(smallerLoanData.data[1]).toBe(0);
      expect(smallerLoanData.data[2]).toBe(0);
    });

    test('generates labels from longest loan', () => {
      const results = {
        loans: {
          '0': {
            starting_balance: 10000,
            rows: [
              { date: 'January 2024', balance_remaining: 10000 },
              { date: 'February 2024', balance_remaining: 9000 },
              { date: 'March 2024', balance_remaining: 8000 }
            ]
          }
        }
      };

      const data = GraphController.get_data(results);
      expect(data.labels).toContain('January 2024');
      expect(data.labels).toContain('February 2024');
      expect(data.labels).toContain('March 2024');
    });
  });
});

describe('Chart Data Contract', () => {
  // These tests verify the data contract that must be maintained after migration

  test('data structure has labels array', () => {
    const results = {
      loans: {
        '0': {
          starting_balance: 1000,
          rows: [{ date: 'Jan 2024', balance_remaining: 1000 }]
        }
      }
    };
    const data = GraphController.get_data(results);
    expect(Array.isArray(data.labels)).toBe(true);
  });

  test('data structure has datasets array', () => {
    const results = {
      loans: {
        '0': {
          starting_balance: 1000,
          rows: [{ date: 'Jan 2024', balance_remaining: 1000 }]
        }
      }
    };
    const data = GraphController.get_data(results);
    expect(Array.isArray(data.datasets)).toBe(true);
  });

  test('each dataset has data array with numeric values', () => {
    const results = {
      loans: {
        '0': {
          starting_balance: 1000,
          rows: [{ date: 'Jan 2024', balance_remaining: 1000 }]
        }
      }
    };
    const data = GraphController.get_data(results);
    expect(Array.isArray(data.datasets[0].data)).toBe(true);
    expect(typeof data.datasets[0].data[0]).toBe('number');
  });

  test('labels and data arrays have same length', () => {
    const results = {
      loans: {
        '0': {
          starting_balance: 5000,
          rows: [
            { date: 'Jan 2024', balance_remaining: 5000 },
            { date: 'Feb 2024', balance_remaining: 4000 },
            { date: 'Mar 2024', balance_remaining: 3000 }
          ]
        }
      }
    };
    const data = GraphController.get_data(results);
    expect(data.labels.length).toBe(data.datasets[0].data.length);
  });
});
