import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate, useRouter } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Calendar, Users } from "lucide-react";

export function CharacterDetail() {
  const id = useParams({
    from: "/character/$id",
    select: (params) => params.id,
  });
  const router = useRouter();

  const {
    data: character,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["character", id],
    queryFn: () => api.getCharacter(Number(id)),
    enabled: !!id,
  });

  const { data: episodes, isLoading: episodesLoading } = useQuery({
    queryKey: ["episodes", character?.episode],
    queryFn: () => api.getMultipleEpisodes(character?.episode || []),
    enabled: !!character?.episode,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-destructive mb-4">
          Character Not Found
        </h2>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
        <Button onClick={() => router.navigate({ to: "/" })} variant="outline">
          Back to Characters
        </Button>
      </div>
    );
  }

  if (!character) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Alive":
        return "default";
      case "Dead":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.history.back()}
          className="hover-glow"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold bg-gradient-portal bg-clip-text text-transparent">
          {character.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="bg-card/50 backdrop-blur-sm border-border overflow-hidden py-0">
            <div className="aspect-square relative">
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <Badge
                  variant={getStatusColor(character.status)}
                  className="mb-2"
                >
                  {character.status}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                Character Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Species
                    </label>
                    <p className="text-foreground font-semibold">
                      {character.species}
                    </p>
                  </div>
                  {character.type && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Type
                      </label>
                      <p className="text-foreground font-semibold">
                        {character.type}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Gender
                    </label>
                    <p className="text-foreground font-semibold">
                      {character.gender}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      Origin
                    </label>
                    <p className="text-foreground font-semibold">
                      {character.origin.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      Last Known Location
                    </label>
                    <p className="text-foreground font-semibold">
                      {character.location.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      Created
                    </label>
                    <p className="text-foreground font-semibold">
                      {new Date(character.created).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Episodes ({character.episode.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {episodesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                  {episodes?.map((episode) => (
                    <div
                      key={episode.id}
                      className="p-3 rounded-md bg-muted/50 border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="font-semibold text-foreground text-sm">
                        {episode.episode}
                      </div>
                      <div className="text-foreground font-medium">
                        {episode.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {episode.air_date}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
