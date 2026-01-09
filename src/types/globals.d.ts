// Global type declarations for CDN libraries and app state

// Handlebars
declare const Handlebars: {
  compile: (template: string) => (context: unknown) => string;
  registerPartial: (name: string, partial: string) => void;
};

// Day.js
declare function dayjs(date?: string | Date): Dayjs;

interface Dayjs {
  startOf(unit: string): Dayjs;
  add(value: number, unit: string): Dayjs;
  format(format: string): string;
}

// Chart.js
declare class Chart {
  constructor(ctx: CanvasRenderingContext2D, config: ChartConfiguration);
  destroy(): void;
  resize(): void;
}

interface ChartConfiguration {
  type: string;
  data: {
    labels: string[];
    datasets: ChartDataset[];
  };
  options: ChartOptions;
}

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  fill?: boolean;
  tension?: number;
}

interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
    };
  };
  scales?: {
    y?: ChartScaleOptions;
    x?: ChartScaleOptions;
  };
  elements?: {
    point?: {
      radius?: number;
      borderWidth?: number;
    };
    line?: {
      borderWidth?: number;
    };
  };
  animation?: {
    duration?: number;
    easing?: string;
  };
}

interface ChartScaleOptions {
  beginAtZero?: boolean;
  max?: number;
  ticks?: {
    stepSize?: number;
    font?: {
      family?: string;
      size?: number;
    };
    color?: string;
  };
  grid?: {
    color?: string;
  };
}

// Extend String prototype
interface String {
  contains(searchString: string): boolean;
}
