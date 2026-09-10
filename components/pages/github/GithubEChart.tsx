import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { HeatmapChart } from 'echarts/charts';
import {
  AriaComponent,
  CalendarComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import {
  CONTRIBUTION_COLORS,
  type ContributionDay,
} from 'utils/githubContributions';

echarts.use([
  HeatmapChart,
  CalendarComponent,
  TooltipComponent,
  VisualMapComponent,
  AriaComponent,
  SVGRenderer,
]);

interface Props {
  variant: 'calendar';
  days: ContributionDay[];
  onSelect?: (date: string) => void;
}

export default function GithubEChart({ days, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current || !days.length) return;
    const chart = echarts.init(containerRef.current, undefined, {
      renderer: 'svg',
    });
    chart.setOption({
      animation: false,
      aria: {
        enabled: true,
        label: {
          description:
            'GitHub 일별 기여 캘린더입니다. 아래 날짜 입력과 일별 표에서도 같은 기록을 확인할 수 있습니다.',
        },
      },
      tooltip: {
        trigger: 'item',
        renderMode: 'richText',
        backgroundColor: '#0f172a',
        borderWidth: 0,
        textStyle: { color: '#fff', fontSize: 12 },
        formatter: (params: { value: [string, number] }) =>
          `${params.value[0]}\n기여 ${params.value[1].toLocaleString()}회`,
      },
      // Use GitHub's categorical level; normalizing counts against a peak washed out active days.
      visualMap: {
        type: 'piecewise',
        dimension: 2,
        show: false,
        pieces: CONTRIBUTION_COLORS.map((color, value) => ({ value, color })),
      },
      calendar: {
        top: 28,
        left: 36,
        right: 18,
        bottom: 12,
        range: [days[0].date, days[days.length - 1].date],
        cellSize: ['auto', 16],
        splitLine: { show: false },
        itemStyle: { borderWidth: 3, borderColor: '#fff' },
        yearLabel: { show: false },
        monthLabel: { color: '#475569', fontSize: 11, margin: 12 },
        dayLabel: {
          color: '#475569',
          fontSize: 10,
          firstDay: 0,
          nameMap: ['일', '월', '화', '수', '목', '금', '토'],
        },
      },
      series: [
        {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: days.map(day => [day.date, day.count, day.level]),
          emphasis: { itemStyle: { borderColor: '#0f172a', borderWidth: 2 } },
        },
      ],
    });
    chart.on('click', (params: any) => {
      if (Array.isArray(params.value)) onSelect?.(params.value[0]);
    });
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, [days, onSelect]);
  return <div ref={containerRef} className="h-[210px] w-full min-w-[760px]" />;
}
