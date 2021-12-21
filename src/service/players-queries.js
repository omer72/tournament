import { useQuery } from 'react-query';
import apiClient from './http-common';

const suspectsUrl = '/api/v1/players/suspects';

export function usePlayers(pageNumber, pageLength, playersLevel, searchText) {
  async function fetchPlayers() {
    let playersUrl = `api/v1/players?start=${pageNumber}&n=${pageLength}`;
    if (playersLevel !== 'none') playersUrl += `&level=${playersLevel}`;
    if (searchText !== '') playersUrl += `&search=${searchText}`;
    return (await apiClient.get(playersUrl));
  }
  return useQuery(['players', `list${pageNumber}-${pageLength}-${playersLevel}-${searchText}`], fetchPlayers);
}

export function useSuspects() {
  async function fetchSuspects() {
    return (await apiClient.get(suspectsUrl)).data;
  }
  return useQuery(['suspects'], fetchSuspects);
}
