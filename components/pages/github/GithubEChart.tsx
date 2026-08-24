import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { HeatmapChart, TreemapChart } from 'echarts/charts';
import {
  CalendarComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';

echarts.use([
  HeatmapChart,
  TreemapChart,
  CalendarComponent,
  TooltipComponent,
  VisualMapComponent,
  SVGRenderer,
]);

type ContributionDay = { date: string; count: number; level: number };
type RepoPoint = {
  name: string;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  size: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
};

type Props =
  | { variant: 'calendar'; days: ContributionDay[] }
  | { variant: 'repos'; repos: RepoPoint[] };

const GithubEChart = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = echarts.init(containerRef.current, undefined, { renderer: 'svg' });

    if (props.variant === 'calendar') {
      const max = Math.max(1, ...props.days.map(day => day.count));
      chart.setOption({
        animationDuration: 700,
        tooltip: {
          trigger: 'item',
          backgroundColor: '#0f172a',
          borderWidth: 0,
          textStyle: { color: '#fff', fontSize: 12 },
          formatter: (params: { value: [string, number] }) =>
            `<b>${params.value[0]}</b><br/>${params.value[1].toLocaleString()} contributions`,
        },
        visualMap: {
          min: 0,
          max,
          show: false,
          inRange: { color: ['#eef2f7', '#bfdbfe', '#60a5fa', '#2563eb', '#22d3ee'] },
        },
        calendar: {
          top: 28,
          left: 36,
          right: 18,
          bottom: 12,
          range: [props.days[0]?.date, props.days.at(-1)?.date],
          cellSize: ['auto', 16],
          splitLine: { show: false },
          itemStyle: { borderWidth: 3, borderColor: '#fff', borderRadius: 3 },
          yearLabel: { show: false },
          monthLabel: { color: '#64748b', fontSize: 11, margin: 12 },
          dayLabel: { color: '#94a3b8', fontSize: 10, firstDay: 0, nameMap: ['S', 'M', 'T', 'W', 'T', 'F', 'S'] },
        },
        series: [{
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: props.days.map(day => [day.date, day.count]),
          emphasis: { itemStyle: { borderColor: '#0f172a', borderWidth: 2, shadowBlur: 8, shadowColor: 'rgba(37,99,235,.28)' } },
        }],
      });
    } else {
      const repos = props.repos
        .filter(repo => !repo.fork && !repo.archived)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 40);
      const languages = Array.from(new Set(repos.map(repo => repo.language || 'Other')));
      const colors = ['#2563eb', '#22d3ee', '#8b5cf6', '#f59e0b', '#10b981', '#f43f5e', '#64748b'];
      const colorByLanguage = new Map(languages.map((language, index) => [language, colors[index % colors.length]]));

      const treeData = languages.map(language => ({
        name: language,
        itemStyle: { color: colorByLanguage.get(language) },
        children: repos
          .filter(repo => (repo.language || 'Other') === language)
          .map(repo => ({
            name: repo.name,
            value: Math.max(
              1,
              Math.round(
                Math.log10(repo.stargazers_count + 1) * 34 +
                Math.log10(repo.forks_count + 1) * 18 +
                Math.log10(repo.size + 1) * 8,
              ),
            ),
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            size: repo.size,
            pushedAt: repo.pushed_at,
            language,
          })),
      }));

      chart.setOption({
        animationDuration: 750,
        animationEasing: 'cubicInOut',
        tooltip: {
          trigger: 'item',
          backgroundColor: '#0f172a',
          borderWidth: 0,
          textStyle: { color: '#fff', fontSize: 12 },
          formatter: (params: { data: { name: string; language?: string; stars?: number; forks?: number; size?: number; pushedAt?: string } }) => {
            const item = params.data;
            if (item.stars === undefined) return `<b>${item.name}</b><br/>클릭해서 저장소를 펼쳐보세요.`;
            return [
              `<b>${item.name}</b> · ${item.language}`,
              `★ ${item.stars.toLocaleString()} · Fork ${item.forks?.toLocaleString()}`,
              `Code ${(item.size || 0).toLocaleString()} KB`,
              `Updated ${item.pushedAt ? new Date(item.pushedAt).toLocaleDateString('ko-KR') : '-'}`,
            ].join('<br/>');
          },
        },
        series: [{
          type: 'treemap',
          data: treeData,
          top: 8,
          left: 0,
          right: 0,
          bottom: 22,
          roam: false,
          nodeClick: 'zoomToNode',
          leafDepth: 2,
          breadcrumb: {
            show: true,
            bottom: 0,
            height: 18,
            itemStyle: { color: '#f1f5f9', borderColor: '#e2e8f0', textStyle: { color: '#475569', fontSize: 10 } },
          },
          label: { show: true, color: '#fff', fontSize: 12, fontWeight: 700, formatter: '{b}' },
          upperLabel: { show: true, height: 26, color: '#fff', fontSize: 12, fontWeight: 800 },
          itemStyle: { borderColor: '#fff', borderWidth: 2, gapWidth: 2, borderRadius: 7 },
          levels: [
            { itemStyle: { borderWidth: 0, gapWidth: 4 } },
            { colorSaturation: [.42, .72], itemStyle: { borderColorSaturation: .7, gapWidth: 3, borderWidth: 2 }, upperLabel: { show: true } },
            { colorSaturation: [.3, .62], itemStyle: { gapWidth: 1, borderWidth: 1 } },
          ],
          emphasis: { focus: 'descendant', itemStyle: { shadowBlur: 14, shadowColor: 'rgba(15,23,42,.25)' } },
        }],
      });
    }

    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(containerRef.current);
    return () => { observer.disconnect(); chart.dispose(); };
  }, [props]);

  return <div ref={containerRef} className={props.variant === 'calendar' ? 'h-[210px] w-full min-w-[760px]' : 'h-[330px] w-full'} />;
};

export default GithubEChart;
