import React from 'react';
import { FiGithub, FiUser } from 'react-icons/fi';

interface ContactInfoProps {
  /** 표시용 핸들 (provider 무관) */
  displayName: string;
  /** GitHub 연동된 경우에만 존재하는 실제 GitHub login */
  githubId: string | null | undefined;
}

/**
 * 예전에는 `{github_id}@github.com`을 이메일처럼 보여줬는데,
 * 실재하지 않는 주소인 데다 소셜 유저에서는 "null@github.com"이 된다.
 * 핸들과 GitHub 연동 상태만 보여준다.
 */
const ContactInfo = ({ displayName, githubId }: ContactInfoProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 flex-shrink-0">
        <FiUser className="w-4 h-4 text-gray-400" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-800 truncate">
          {displayName}
        </div>
        <div className="text-xs text-gray-400">사용자 이름</div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 flex-shrink-0">
        <FiGithub className="w-4 h-4 text-gray-400" />
      </div>
      <div className="min-w-0">
        {githubId ? (
          <a
            href={`https://github.com/${githubId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm font-medium text-gray-800 truncate hover:text-ftBlue transition-colors"
          >
            github.com/{githubId}
          </a>
        ) : (
          <div className="text-sm font-medium text-gray-400 truncate">
            연동되지 않음
          </div>
        )}
        <div className="text-xs text-gray-400">GitHub</div>
      </div>
    </div>
  </div>
);

export default ContactInfo;
