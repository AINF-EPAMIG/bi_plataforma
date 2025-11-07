'use client';

import React from 'react';
import { ProjetosData } from './types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface KPIsProps {
  data: ProjetosData;
  anoSelecionado: number;
  valorAno: number;
  projetosAno: number;
}

export default function KPIs({ data, anoSelecionado, valorAno, projetosAno }: KPIsProps) {
  const totalProjetos = data?.totais_gerais?.total_projetos_geral ?? 0;
  const valorTotal = data?.totais_gerais?.valor_total_geral ?? 0;
  const projetosAnoValue = anoSelecionado === 0 ? (data?.totais_gerais?.projetos_ano_vigente ?? 0) : (projetosAno ?? 0);
  const valorAnoValue = anoSelecionado === 0 ? (data?.totais_gerais?.valor_ano_vigente ?? 0) : (valorAno ?? 0);

  return (
    <Box>
      {/* Linha 1: dois cards principais */}
      <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ mb: 2 }}>
        <Card elevation={3} sx={{ borderRadius: 2, flex: 1 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ letterSpacing: 0.4 }}>
                  TOTAL DE PROJETOS
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700, mt: 0.5, color: 'primary.main' }}>
                  {totalProjetos.toLocaleString('pt-BR')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Projetos cadastrados no sistema
                </Typography>
              </Box>
              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <FolderOpenIcon fontSize="medium" />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={3} sx={{ borderRadius: 2, flex: 1 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ letterSpacing: 0.4 }}>
                  VALOR TOTAL APROVADO
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700, mt: 0.5, color: 'primary.main' }}>
                  R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Valor total aprovado em projetos
                </Typography>
              </Box>
              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 2, bgcolor: 'success.main', color: 'success.contrastText' }}>
                <AttachMoneyIcon fontSize="medium" />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* Linha 2: dois cards auxiliares */}
      <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
        <Card variant="outlined" sx={{ borderRadius: 2, flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">Projetos (Ano)</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>{projetosAnoValue.toLocaleString('pt-BR')}</Typography>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2, flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">Valor (Ano)</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>R$ {valorAnoValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}