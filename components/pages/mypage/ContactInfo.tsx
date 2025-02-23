import React from 'react';
import { FiMail, FiGithub } from 'react-icons/fi';

interface ContactInfoProps {
  githubId: string;
}

const ContactInfo = ({ githubId }: ContactInfoProps) => (
  <section className="bg-white rounded-xl p-8 shadow-sm border border-blue-100">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">연락처 정보</h2>
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-100 rounded-lg">
          <FiMail className="w-5 h-5 text-gray-600 " />
        </div>
        <div className="w-full truncate">
          <p className="text-gray-900 font-medium mb-1 truncate">
            {githubId}@github.com
          </p>
          <p className="text-sm text-gray-500">이메일</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-100 rounded-lg">
          <FiGithub className="w-5 h-5 text-gray-600" />
        </div>
        <div className="w-full truncate">
          <p className="text-gray-900 font-medium mb-1 truncate">
            github.com/{githubId}
          </p>
          <p className="text-sm text-gray-500">GitHub</p>
        </div>
      </div>
    </div>
  </section>
);

export default ContactInfo;
