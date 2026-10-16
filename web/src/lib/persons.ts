import { getHost } from './api';

export interface Person {
  id: string;
  downloads_count: string;
  name: string;
  pics_ext: string;
  annotation: string;
  added: string;
  updated: string;
  states_id: string;
  url: string | null;
  books_count: string;
  comments_count: string;
}

export interface PersonsResponse {
  success: boolean;
  data: Person[];
}

export const getPersons = async (
  table: 'authors' | 'dictors',
  sort: 'new' | 'popular' | 'recommend',
  filter?: string
): Promise<PersonsResponse> => {
  const params = new URLSearchParams({
    table,
    sort,
  });

  if (filter) {
    params.append('filter', filter);
  }

  const response = await fetch(`${getHost()}/srv/persons.php?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch persons');
  }

  return response.json();
};
