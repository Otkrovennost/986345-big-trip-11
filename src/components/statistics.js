import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AbstractSmartComponent from './abstract-smart-component.js';

const LegendName = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME: `TIME-SPENT`
};

const LabelName = {
  EURO: `€`,
  PIECES: `x`,
  HOURS: `H`
};

const transportTypes = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`
];

const generateChartData = (legendName, points) => {
  const labels = [
    ...new Set(points.map((point) => point.type))
  ];

  switch (legendName) {
    case LegendName.MONEY:
      return labels.map((label) => ({
        label, value: points
          .filter((point) => point.type === label)
          .reduce((acc, curr) => acc + Number(curr.price), 0)
      }))
      .filter((point) => point.value !== 0)
      .sort((a, b) => b.value - a.value);
    case LegendName.TRANSPORT:
      return transportTypes.map((label) => ({
        label, value: points.filter((point) => point.type.toLowerCase() === label).length
      }))
      .filter((point) => point.value !== 0)
      .sort((a, b) => b.value - a.value);

    case LegendName.TIME:
      return labels.map((label) => ({
        label, value: points.filter((point) => point.type === label)
        .reduce((acc, curr) => acc + Math.round(moment.duration(curr.end - curr.start, `milliseconds`) / (60 * 60 * 1000)), 0)
      }))
      .filter((point) => point.value !== 0)
      .sort((a, b) => b.value - a.value);
    default:
      return [];
  }
};

const renderChart = (ctx, data, label, legend) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: data.map((item) => item.label),
      datasets: [{
        data: data.map((item) => item.value),
        backgroundColor: `#00BFFF`,
        hoverBackgroundColor: `#87CEEB`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000080`,
          anchor: `end`,
          align: `start`,
          formatter(value) {
            return `${value}${label}`;
          }
        }
      },
      title: {
        display: true,
        text: legend,
        fontColor: `#000080`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000080`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>
      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>
      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>
      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._renderCharts = this._renderCharts.bind(this);
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  rerender() {
    super.rerender();
    this._renderCharts();
  }

  show() {
    super.show();
    this.rerender();
  }

  recoveryListeners() {}

  _renderCharts() {
    const element = this.getElement();
    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    const points = this._pointsModel.getPoints();

    this._moneyChart = renderChart(moneyCtx, generateChartData(`MONEY`, points), LabelName.EURO, LegendName.MONEY);

    this._transportChart = renderChart(transportCtx, generateChartData(`TRANSPORT`, points), LabelName.PIECES, LegendName.TRANSPORT);

    this._timeChart = renderChart(timeCtx, generateChartData(`TIME-SPENT`, points), LabelName.HOURS, LegendName.TIME);
  }

  _resetCharts() {
    this._resetChart(this._moneyChart);
    this._resetChart(this._transportChart);
    this._resetChart(this._timeChart);
  }

  _resetChart(chart) {
    if (chart) {
      chart.destroy();
      chart = null;
    }
  }
}
