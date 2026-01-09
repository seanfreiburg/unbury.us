// Graph Controller - manages chart rendering
import { responsiveChart } from './responsive-chart.js';

export const GraphController = {
  graph(results) {
    const data = this.getData(results);
    const graphDiv = $('#graph');
    if (!$('#myChart').length) {
      const title = "<h4 class='text-center'>Balance Remaining</h4>";
      const canvasHtml = '<canvas id="myChart" height="400"></canvas>';
      graphDiv.append(title + canvasHtml);
    }
    const steps = this.getSteps();
    responsiveChart($('#myChart'), data, false, steps, this.getStepWidth(results, steps));
  },

  getSteps() {
    return 20;
  },

  getStepWidth(results, steps) {
    let maxVal = 0;
    for (const i in results.loans) {
      for (let j = 0; j < results.loans[i].rows.length; j++) {
        if (maxVal < parseFloat(results.loans[i].rows[j].balance_remaining)) {
          maxVal = parseFloat(results.loans[i].rows[j].balance_remaining);
        }
      }
    }
    return Math.round(maxVal / steps);
  },

  getData(results) {
    let maxRowLength = 0;
    let maxRowIndex = 0;
    const numLabels = 20;
    let stepSize;
    const datasets = [];
    const keys = Object.keys(results.loans);
    keys.sort(function (a, b) {
      return results.loans[b].starting_balance - results.loans[a].starting_balance;
    });

    const labels = [];
    for (let i = 0; i < keys.length; i++) {
      const loanKey = keys[i];
      if (results.loans[loanKey].rows.length > maxRowLength) {
        maxRowLength = results.loans[loanKey].rows.length;
        maxRowIndex = loanKey;
      }
      if (results.loans[maxRowIndex].rows.length > numLabels) {
        stepSize = Math.floor(results.loans[maxRowIndex].rows.length / numLabels);
      } else {
        stepSize = 1;
      }
    }

    for (let i = 0; i < keys.length; i++) {
      const loanKey = keys[i];
      datasets[i] = this.getColorHash(loanKey);
      datasets[i].data = [];
      for (let j = 0; j < maxRowLength; j += stepSize) {
        if (results.loans[loanKey].rows[j]) {
          datasets[i].data.push(results.loans[loanKey].rows[j].balance_remaining);
        } else {
          datasets[i].data.push(0);
        }
      }
    }

    for (let i = 0; i < results.loans[maxRowIndex].rows.length; i += stepSize) {
      labels.push(results.loans[maxRowIndex].rows[i].date);
    }

    return {
      labels: labels,
      datasets: datasets,
    };
  },

  getColorHash(i) {
    i = parseInt(i);
    let colorHash = {};
    switch (i % 5) {
      case 0:
        colorHash = {
          fillColor: 'rgba(151,187,205,0.5)',
          strokeColor: 'rgba(151,187,205,1)',
          pointColor: 'rgba(151,187,205,1)',
          pointStrokeColor: '#fff',
        };
        break;
      case 1:
        colorHash = {
          fillColor: 'rgba(200,0,0,0.5)',
          strokeColor: 'rgba(200,0,0,1)',
          pointColor: 'rgba(200,0,0,1)',
          pointStrokeColor: '#fff',
        };
        break;
      case 2:
        colorHash = {
          fillColor: 'rgba(50,50,50,0.5)',
          strokeColor: 'rgba(50,50,50,1)',
          pointColor: 'rgba(50,50,50,1)',
          pointStrokeColor: '#fff',
        };
        break;
      case 3:
        colorHash = {
          fillColor: 'rgba(0,200,0,0.5)',
          strokeColor: 'rgba(0,200,0,1)',
          pointColor: 'rgba(0,200,0,1)',
          pointStrokeColor: '#fff',
        };
        break;
      case 4:
        colorHash = {
          fillColor: 'rgba(0,0,200,0.5)',
          strokeColor: 'rgba(0,0,200,1)',
          pointColor: 'rgba(0,0,200,1)',
          pointStrokeColor: '#fff',
        };
        break;
    }
    return colorHash;
  },
};

export default GraphController;
