import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexFill,
  ApexTooltip,
  ApexMarkers,
  ApexDataLabels,
  ApexResponsive,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis[];
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  markers: ApexMarkers;
  dataLabels: ApexDataLabels;
  responsive?: ApexResponsive[];
};

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule, HttpClientModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  public chartOptions: ChartOptions;
  public positiveRate = 0;
  private userId: string = '';

  constructor(private http: HttpClient, private router: Router) {
    this.chartOptions = {
      series: [],
      chart: {
        width: '100%',
        height: 400,
        type: 'area',
        toolbar: { show: true },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 300,
              offsetX: 10,
            },
            xaxis: {
              labels: {
                rotate: -45,
                style: {
                  fontSize: '11px',
                },
              },
              tickAmount: 7,
            },
          },
        },
      ],
      xaxis: {
        categories: [],
        labels: { trim: false },
      },
      yaxis: [
        {
          title: { text: 'Emotions' },
          min: -0.9,
          max: 3,
          tickAmount: 4,
          labels: {
            formatter: (val) => {
              const uniqueEmotions = ['sadness', 'anger', 'love', 'joy'];
              return uniqueEmotions[Math.round(val)] || '';
            },
            style: {
              colors: ['#2c3e50'],
              fontSize: '14px',
              fontWeight: 600,
            },
          },
        },
      ],
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: ['#ff5e62'],
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0.1,
          stops: [0, 90, 100],
          gradientToColors: ['#ffb09c'],
        },
        colors: ['#80D0D0'],
      },
      markers: {
        size: 0,
        colors: ['#f39c12'],
        strokeColors: '#ffffff',
        strokeWidth: 3,
        shape: 'square',
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (_, opts) {
            const d = opts.w.config.series[0].data[opts.dataPointIndex];
            return `${d.emoji} ${d.emotion}`;
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (_, opts) => {
          const d = opts.w.config.series[0].data[opts.dataPointIndex];
          return d?.emoji || '';
        },
        offsetX: 3,
        style: {
          fontSize: '30px',
          fontWeight: 'normal',
          colors: ['#000'],
        },
        background: {
          enabled: false,
        },
      },
    };
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.userId = localStorage.getItem('user_id') || '';
    }

    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.refreshData();
  }

  public refreshData(): void {
    this.http
      .get<any[]>(`http://127.0.0.1:5000/weekly-emotions/${this.userId}`)
      .subscribe((data) => {
        const uniqueEmotions = ['sadness', 'anger', 'love', 'joy'];
        const positiveEmotions = ['joy', 'love'];

        const today = new Date();
        const day = today.getDay();
        const diffToMonday = day === 0 ? 6 : day - 1;
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - diffToMonday);

        const formatShortDate = (d: Date): string =>
          `${d.getFullYear()}-${(d.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

        const validDates = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(startOfWeek);
          d.setDate(d.getDate() + i);
          return formatShortDate(d);
        });

        const currentWeekData = data.filter((d) => validDates.includes(d.date));
        const categories: string[] = validDates;

        const seriesData = categories.map((label) => {
          const entry = currentWeekData.find((d) => d.date === label);
          return entry
            ? {
                x: label,
                y: uniqueEmotions.indexOf(entry.emotion),
                emotion: entry.emotion,
                emoji: entry.emoji,
              }
            : { x: label, y: -0.5, emotion: 'None', emoji: '' };
        });

        this.chartOptions.series = [
          {
            name: 'Dominant Emotion',
            type: 'area',
            data: seriesData,
          },
        ];
        this.chartOptions.xaxis.categories = categories;

        const total = currentWeekData.length;
        const countPositive = currentWeekData.filter((d) =>
          positiveEmotions.includes(d.emotion)
        ).length;
        this.positiveRate =
          total > 0 ? Math.round((countPositive / total) * 100) : 0;
      });
  }

  goToChatbot(): void {
    let userId = '';
    if (typeof window !== 'undefined') {
      userId = localStorage.getItem('user_id') || '';
    }
    this.router.navigate([`/home/${userId}`]);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
