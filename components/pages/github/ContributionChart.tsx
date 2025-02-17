import React from 'react';

interface ContributionChartProps {
  githubId: string;
}

const ContributionChart = ({ githubId }: ContributionChartProps) => (
  <div className="bg-white/5 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
    <h2 className="text-xl font-semibold text-ftBlue mb-2">연간 기여 그래프</h2>
    <p className="text-gray-400 text-sm mb-3">
      1년 동안의 GitHub 활동을 한눈에 확인할 수 있습니다.
    </p>
    <img
      src={`https://ghchart.rshah.org/2657A6/${githubId}`}
      alt={`${githubId}의 GitHub 연간 기여 그래프`}
      className="w-full rounded-md"
    />
  </div>
);

export default ContributionChart;
