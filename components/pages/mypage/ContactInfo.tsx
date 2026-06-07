import React from 'react';
import { FiMail, FiGithub } from 'react-icons/fi';

interface ContactInfoProps {
  githubId: string | null | undefined;
}

const ContactInfo = ({ githubId }: ContactInfoProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 flex-shrink-0">
        <FiMail className="w-4 h-4 text-gray-400" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-800 truncate">{githubId}@github.com</div>
        <div className="text-xs text-gray-400">이메일</div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 flex-shrink-0">
        <FiGithub className="w-4 h-4 text-gray-400" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-800 truncate">github.com/{githubId}</div>
        <div className="text-xs text-gray-400">GitHub</div>
      </div>
    </div>
  </div>
);

export default ContactInfo;
