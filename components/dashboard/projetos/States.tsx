'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map(i => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ErrorState({ error }: { error: string }) {
  return (
    <Card className="border-red-200">
      <CardContent className="pt-6">
        <div className="text-red-600 text-center">
          <p className="font-semibold">Erro ao carregar dashboard</p>
          <p className="text-sm">{error}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptyState() {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-center text-gray-500">Nenhum dado encontrado</p>
      </CardContent>
    </Card>
  );
}