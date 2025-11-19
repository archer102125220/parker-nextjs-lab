import { useMemo } from 'react';

import type { responseType } from '@/utils/request';
import { useGetRequest } from '@/hooks/useRequest';

export type gitHubUsersReposPayloadType = {
  token?: string;
  account?: string;
  page?: number;
};

export function useGitHubUsersRepos(
  payload: gitHubUsersReposPayloadType,
  handleInfinity: (response: responseType) => void
) {
  const { token, account, page = 1 } = payload;
  const { cancelRequest, response, isLoading, error, refresh, refetch } =
    useGetRequest(
      `https://api.github.com/users/${account}/repos`,
      {
        per_page: 10,
        page
      },
      null,
      {
        useServiceWorkerCache: false,
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseSetting: {
          returnRawResponse: true
        },
        handleInfinity
      }
    );

  const hasNext = useMemo(
    function () {
      const headersLink = response?.headers?.link || '';
      const newHasNext = headersLink
        .split(',')
        .some((linkString: string) => linkString.includes('rel="next"'));

      console.log({ headersLink, newHasNext });

      return newHasNext;
    },
    [response]
  );

  return {
    cancelRequest,
    response,
    isLoading,
    error,
    refresh,
    refetch,
    hasNext
  };
}
