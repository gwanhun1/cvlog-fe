import React from 'react';
import { FiEdit3 } from 'react-icons/fi';

interface AboutSectionProps {
  description: string | null | undefined;
}

const AboutSection = ({ description }: AboutSectionProps) => (
  <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900">자기소개</h2>
      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
        <FiEdit3 className="w-5 h-5" />
      </button>
    </div>
    <p className="text-gray-600 whitespace-pre-line leading-relaxed">
      {description || '자기소개를 작성해주세요.'}
    </p>
  </section>
);

export default AboutSection;
