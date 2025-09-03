export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface CharactersResponse {
  info: Info;
  results: Character[];
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export const api = {
  async getCharacters(
    page: number = 1,
    name?: string
  ): Promise<CharactersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
    });

    if (name) {
      params.append("name", name);
    }

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/character?${params}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async getCharacter(id: number): Promise<Character> {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/character/${id}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async getEpisode(id: number): Promise<Episode> {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/episode/${id}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async getMultipleEpisodes(urls: string[]): Promise<Episode[]> {
    if (urls.length === 0) return [];

    const ids = urls.map((url) => url.split("/").pop()).join(",");
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/episode/${ids}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  },
};
