-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 26/09/2025 às 12:21
-- Versão do servidor: 11.8.3-MariaDB-log
-- Versão do PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `u711845530_plataforma`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `acessos`
--

CREATE TABLE `acessos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `unidade_id` int(11) NOT NULL,
  `ip_address` varchar(255) NOT NULL,
  `user_agent` longtext DEFAULT NULL,
  `data_acesso` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `administracao`
--

CREATE TABLE `administracao` (
  `id` int(11) NOT NULL,
  `categoria` int(11) NOT NULL DEFAULT 1,
  `subcategoria_id` int(11) NOT NULL,
  `indicador_id` int(11) NOT NULL,
  `valoradm` varchar(45) DEFAULT NULL,
  `descricao_adm` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `local_adm` varchar(255) NOT NULL,
  `pesquisador` int(11) NOT NULL,
  `data_inicio` date NOT NULL,
  `data_final` date NOT NULL,
  `regional_id` int(11) NOT NULL,
  `programa_id` int(11) DEFAULT NULL,
  `transversal_id` int(11) DEFAULT NULL,
  `vinculado_projeto` varchar(3) NOT NULL,
  `projeto_id` int(11) DEFAULT NULL,
  `observacoes` varchar(255) NOT NULL,
  `quem_cadastrou` int(11) NOT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `ano_adm` int(4) DEFAULT NULL,
  `mes_adm` int(2) DEFAULT NULL,
  `quantidade` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `adm_replicacao`
--

CREATE TABLE `adm_replicacao` (
  `id` int(11) NOT NULL,
  `subcategoria_adm` int(11) DEFAULT NULL,
  `indicador_adm` int(11) DEFAULT NULL,
  `valor_adm` varchar(45) DEFAULT NULL,
  `unidade_adm` int(11) DEFAULT NULL,
  `competencia_adm` varchar(45) DEFAULT NULL,
  `pesquisador_adm` int(11) DEFAULT NULL,
  `situacao_adm` varchar(45) DEFAULT NULL,
  `validador_adm` varchar(45) DEFAULT NULL,
  `data_validacao` date DEFAULT NULL,
  `ano_adm` int(4) DEFAULT NULL,
  `projeto_id` int(11) NOT NULL,
  `justificativa` varchar(500) DEFAULT NULL,
  `email_adm` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `arquivo_administracao`
--

CREATE TABLE `arquivo_administracao` (
  `id` int(11) NOT NULL,
  `tipo` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `nome_arquivo` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `extensao` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `tamanho` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `path_servidor` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `projeto_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `arquivo_evento`
--

CREATE TABLE `arquivo_evento` (
  `id` int(11) NOT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  `nome_arquivo` varchar(255) DEFAULT NULL,
  `extensao` varchar(45) DEFAULT NULL,
  `tamanho` varchar(45) DEFAULT NULL,
  `path_servidor` varchar(255) DEFAULT NULL,
  `data_cadastro` timestamp NULL DEFAULT current_timestamp(),
  `eventos_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `arquivo_formacao`
--

CREATE TABLE `arquivo_formacao` (
  `id` int(11) NOT NULL,
  `tipo` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `nome_arquivo` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `extensao` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `tamanho` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `path_servidor` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `formacao_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `arquivo_preprojeto`
--

CREATE TABLE `arquivo_preprojeto` (
  `id` int(11) NOT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  `nome_arquivo` varchar(255) DEFAULT NULL,
  `extensao` varchar(45) DEFAULT NULL,
  `tamanho` varchar(45) DEFAULT NULL,
  `path_servidor` varchar(255) DEFAULT NULL,
  `data_cadastro` timestamp NULL DEFAULT current_timestamp(),
  `preprojeto_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `arquivo_projeto6`
--

CREATE TABLE `arquivo_projeto6` (
  `id` int(11) NOT NULL,
  `tipo` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `nome_arquivo` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `extensao` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `tamanho` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `path_servidor` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `projeto6` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `arquivo_projeto45`
--

CREATE TABLE `arquivo_projeto45` (
  `id` int(11) NOT NULL,
  `tipo` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `nome_arquivo` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `extensao` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `tamanho` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `path_servidor` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `projeto45` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `arquivo_publicacao`
--

CREATE TABLE `arquivo_publicacao` (
  `id` int(11) NOT NULL,
  `tipo` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `nome_arquivo` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `extensao` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `tamanho` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `path_servidor` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `publicacao_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `arquivo_relatorio`
--

CREATE TABLE `arquivo_relatorio` (
  `id` int(11) NOT NULL,
  `tipo` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `nome_arquivo` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `extensao` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `tamanho` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `path_servidor` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `projeto_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `arquivo_solicitacao`
--

CREATE TABLE `arquivo_solicitacao` (
  `id` int(11) NOT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  `nome_arquivo` varchar(255) DEFAULT NULL,
  `extensao` varchar(45) DEFAULT NULL,
  `tamanho` varchar(45) DEFAULT NULL,
  `path_servidor` varchar(255) DEFAULT NULL,
  `data_cadastro` timestamp NULL DEFAULT current_timestamp(),
  `solicitacao_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `arquivo_tecnologia`
--

CREATE TABLE `arquivo_tecnologia` (
  `id` int(11) NOT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  `nome_arquivo` varchar(255) DEFAULT NULL,
  `extensao` varchar(45) DEFAULT NULL,
  `tamanho` varchar(45) DEFAULT NULL,
  `path_servidor` varchar(255) DEFAULT NULL,
  `data_cadastro` timestamp NULL DEFAULT current_timestamp(),
  `tecnologia_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `atividade`
--

CREATE TABLE `atividade` (
  `atividade_id` int(11) NOT NULL,
  `categoria` int(11) NOT NULL,
  `subcategoria` int(11) NOT NULL,
  `indicador` int(11) NOT NULL,
  `valor` int(11) NOT NULL,
  `descricao` longtext DEFAULT NULL COMMENT 'Idem evento; idem título',
  `publicacao` longtext DEFAULT NULL,
  `local` longtext DEFAULT NULL,
  `dataini` date NOT NULL,
  `datafim` date NOT NULL,
  `pesquisador` varchar(11) NOT NULL,
  `unidade` int(11) NOT NULL,
  `programa` int(11) NOT NULL,
  `transversal` char(2) DEFAULT NULL,
  `publico` longtext DEFAULT NULL,
  `vinculo_projeto` int(11) DEFAULT NULL,
  `projeto` longtext DEFAULT NULL,
  `fonte` int(11) DEFAULT NULL,
  `recurso` decimal(10,2) DEFAULT NULL,
  `detalhamento` longtext DEFAULT NULL,
  `situacao` int(11) NOT NULL,
  `cadastro` date NOT NULL,
  `validador` int(11) DEFAULT NULL,
  `dt_validacao` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `auditoria`
--

CREATE TABLE `auditoria` (
  `id` int(11) NOT NULL,
  `descricao` longtext DEFAULT NULL,
  `pesquisador` int(11) DEFAULT NULL,
  `unidade` int(11) DEFAULT NULL,
  `quem_excluiu` int(11) DEFAULT NULL,
  `data` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `bolsa`
--

CREATE TABLE `bolsa` (
  `id` int(11) NOT NULL,
  `unidade` varchar(19) DEFAULT NULL,
  `unidade_id` int(11) DEFAULT NULL,
  `subprojeto` varchar(66) DEFAULT NULL,
  `projeto` varchar(452) DEFAULT NULL,
  `fonte` varchar(127) DEFAULT NULL,
  `agente` varchar(55) DEFAULT NULL,
  `fonte_id` int(11) DEFAULT NULL,
  `agente_id` int(11) DEFAULT NULL,
  `lotacao_bolsista` varchar(40) DEFAULT NULL,
  `lotacao_id` int(11) DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_final` date DEFAULT NULL,
  `valor_bolsa` varchar(14) DEFAULT NULL,
  `adicional_bancada` varchar(20) DEFAULT NULL,
  `observacao` longtext DEFAULT NULL,
  `bolsa_nova` varchar(10) DEFAULT NULL,
  `bolsa_renovacao` varchar(15) DEFAULT NULL,
  `bolsa_substituicao` varchar(18) DEFAULT NULL,
  `codigo_tipo` varchar(20) DEFAULT NULL,
  `codigo_situacao` varchar(18) DEFAULT NULL,
  `codigo_orientador` varchar(17) DEFAULT NULL,
  `orientador_id` int(11) DEFAULT NULL,
  `bolsista_id` int(11) DEFAULT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `nome_bolsista1` varchar(255) NOT NULL,
  `cpf_bolsista1` varchar(45) NOT NULL,
  `email_bolsista1` varchar(45) NOT NULL,
  `formacao_bolsista1` varchar(45) NOT NULL,
  `pos_bolsista1` varchar(11) NOT NULL,
  `coordenador_projeto` varchar(45) DEFAULT NULL,
  `coordenador_id` int(11) DEFAULT NULL,
  `coordenador_externo` varchar(255) DEFAULT NULL,
  `orientador_externo` varchar(255) DEFAULT NULL,
  `nascimento1` date DEFAULT NULL,
  `sexo1` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `bolsa_fonte`
--

CREATE TABLE `bolsa_fonte` (
  `id` int(11) NOT NULL,
  `nome_fonte` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `bolsa_situacao`
--

CREATE TABLE `bolsa_situacao` (
  `id` int(11) NOT NULL,
  `nome_situacao` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `bolsa_tipo`
--

CREATE TABLE `bolsa_tipo` (
  `id` int(11) NOT NULL,
  `tipo_bolsa` varchar(76) DEFAULT NULL,
  `valor_bolsa` varchar(14) DEFAULT NULL,
  `adicional` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `bolsista_cadastro`
--

CREATE TABLE `bolsista_cadastro` (
  `id` int(11) NOT NULL,
  `nome_bolsista` varchar(255) DEFAULT NULL,
  `cpf` varchar(45) DEFAULT NULL,
  `cpf_novo` varchar(20) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `formacao` varchar(255) DEFAULT NULL,
  `pos_graduacao` varchar(255) DEFAULT NULL,
  `nascimento` date DEFAULT NULL,
  `sexo` int(1) DEFAULT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `categoria`
--

CREATE TABLE `categoria` (
  `id` int(11) NOT NULL,
  `categoria` varchar(3) NOT NULL,
  `descricao` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `consulta_geral`
--

CREATE TABLE `consulta_geral` (
  `id` int(11) NOT NULL,
  `indicador_id` int(11) DEFAULT NULL,
  `valor` float DEFAULT NULL,
  `descricao_atividade` varchar(255) DEFAULT NULL,
  `data_inicial` date DEFAULT NULL,
  `data_final` date DEFAULT NULL,
  `pesquisador` int(11) DEFAULT NULL,
  `unidade` int(11) DEFAULT NULL,
  `programa_id` int(11) DEFAULT NULL,
  `vinculado_projeto` int(1) DEFAULT NULL,
  `projeto_id` int(11) DEFAULT NULL,
  `ano` int(4) DEFAULT NULL,
  `mes` int(2) DEFAULT NULL,
  `atividade_id` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `consulta_pr`
--

CREATE TABLE `consulta_pr` (
  `id` int(11) NOT NULL,
  `indicador_id` int(11) DEFAULT NULL,
  `valor` float DEFAULT NULL,
  `descricao_atividade` varchar(255) DEFAULT NULL,
  `titulo` longtext DEFAULT NULL,
  `pesquisador` int(11) DEFAULT NULL,
  `unidade` int(11) DEFAULT NULL,
  `programa_id` int(11) DEFAULT NULL,
  `projeto_id` int(11) DEFAULT NULL,
  `pr45_id` int(11) DEFAULT NULL,
  `pr6_id` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `consulta_validado`
--

CREATE TABLE `consulta_validado` (
  `id` int(11) NOT NULL,
  `indicador_id` int(11) DEFAULT NULL,
  `valor` float DEFAULT NULL,
  `descricao_atividade` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `data_inicial` date DEFAULT NULL,
  `data_final` date DEFAULT NULL,
  `pesquisador` int(11) DEFAULT NULL,
  `unidade` int(11) DEFAULT NULL,
  `programa_id` int(11) DEFAULT NULL,
  `vinculado_projeto` int(1) DEFAULT NULL,
  `projeto_id` int(11) DEFAULT NULL,
  `ano` int(4) DEFAULT NULL,
  `mes` int(2) DEFAULT NULL,
  `competencia` varchar(45) DEFAULT NULL,
  `situacao` varchar(45) DEFAULT NULL,
  `atividade_id` int(11) DEFAULT NULL,
  `replicacao_id` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `endogovernamental`
--

CREATE TABLE `endogovernamental` (
  `id` int(11) NOT NULL,
  `codigo` varchar(12) DEFAULT NULL,
  `titulo` varchar(167) NOT NULL,
  `coordenador_id` int(11) DEFAULT NULL,
  `programa_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `entrada_saida`
--

CREATE TABLE `entrada_saida` (
  `id` int(11) NOT NULL,
  `tipo` int(11) NOT NULL,
  `nome_completo` varchar(255) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `cpf` varchar(45) DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `programa_id` int(11) DEFAULT NULL,
  `data_final` date DEFAULT NULL,
  `pesquisador_id` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `alerta` int(11) NOT NULL DEFAULT 1,
  `unidade_id` int(11) NOT NULL,
  `quem_solicitou` int(11) NOT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `justificativa` longtext DEFAULT NULL,
  `quem_resposta` int(11) DEFAULT NULL,
  `data_resposta` date DEFAULT NULL,
  `unidade_destino` int(11) DEFAULT NULL,
  `portaria` varchar(255) DEFAULT NULL,
  `projeto_executado` int(11) DEFAULT NULL,
  `data_transferencia` date DEFAULT NULL,
  `data_aprovacao` date DEFAULT NULL,
  `quem_aprovacao` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `equipe`
--

CREATE TABLE `equipe` (
  `id` int(11) NOT NULL,
  `programa_novo` varchar(34) DEFAULT NULL,
  `programa_id` int(11) DEFAULT NULL,
  `codigo_categoria` varchar(14) DEFAULT NULL,
  `nome` varchar(19) DEFAULT NULL,
  `codigo_registro` varchar(17) DEFAULT NULL,
  `registro` varchar(42) DEFAULT NULL,
  `objetivo_projeto` varchar(402) DEFAULT NULL,
  `titulo` longtext DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_final` date DEFAULT NULL,
  `inicio` varchar(10) DEFAULT NULL,
  `final` varchar(11) DEFAULT NULL,
  `codigo_situacao1` varchar(23) DEFAULT NULL,
  `situacao_id` int(11) DEFAULT NULL,
  `situacao` varchar(23) DEFAULT NULL,
  `codigo_funcionario` varchar(32) DEFAULT NULL,
  `funcionario` varchar(49) DEFAULT NULL,
  `nome_funcionario` varchar(81) DEFAULT NULL,
  `pesquisador_id` int(11) DEFAULT NULL,
  `responsavel` varchar(10) DEFAULT NULL,
  `pr` varchar(45) DEFAULT NULL,
  `fonte_financiadora` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `equipes`
--

CREATE TABLE `equipes` (
  `id` int(11) NOT NULL,
  `subcategoria_equipe` int(11) DEFAULT NULL,
  `indicador_equipe` int(11) DEFAULT NULL,
  `valor_equipe` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `unidade_equipe` int(11) DEFAULT NULL,
  `competencia_equipe` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `pesquisador_equipe` int(11) DEFAULT NULL,
  `situacao_equipe` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `validador_equipe` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `data_validacao` date DEFAULT NULL,
  `ano_equipe` int(11) DEFAULT NULL,
  `responsavel` varchar(3) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `projeto_id` int(11) DEFAULT NULL,
  `descricao45` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `justificativa` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `coordenador_atual` int(11) DEFAULT NULL,
  `id_projeto45` int(11) DEFAULT NULL,
  `id_projeto6` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_polish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `equipes22092025`
--

CREATE TABLE `equipes22092025` (
  `id` int(11) NOT NULL,
  `subcategoria_equipe` int(11) DEFAULT NULL,
  `indicador_equipe` int(11) DEFAULT NULL,
  `valor_equipe` varchar(45) DEFAULT NULL,
  `unidade_equipe` int(11) DEFAULT NULL,
  `competencia_equipe` varchar(45) DEFAULT NULL,
  `pesquisador_equipe` int(11) DEFAULT NULL,
  `situacao_equipe` varchar(45) DEFAULT NULL,
  `validador_equipe` varchar(45) DEFAULT NULL,
  `data_validacao` date DEFAULT NULL,
  `ano_equipe` int(4) DEFAULT NULL,
  `responsavel` varchar(3) DEFAULT NULL,
  `projeto_id` int(11) DEFAULT NULL,
  `descricao45` longtext DEFAULT NULL,
  `justificativa` varchar(500) DEFAULT NULL,
  `coordenador_atual` int(11) DEFAULT NULL,
  `id_projeto45` int(11) DEFAULT NULL,
  `id_projeto6` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `equipes_periodo`
--

CREATE TABLE `equipes_periodo` (
  `id` int(11) NOT NULL,
  `pesquisador` int(11) NOT NULL,
  `projeto_id` int(11) NOT NULL,
  `data_inicial` date NOT NULL,
  `data_final` date NOT NULL,
  `quem_cadastrou` int(11) NOT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `eventos`
--

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `categoria` int(11) DEFAULT 3,
  `subcategoria_id` int(11) NOT NULL,
  `indicador_id` int(11) NOT NULL,
  `valor` varchar(45) NOT NULL,
  `descricao_eventos` longtext DEFAULT NULL COMMENT 'Idem evento; idem título',
  `publicacao` longtext DEFAULT NULL,
  `local` longtext DEFAULT NULL,
  `dataini` date NOT NULL,
  `datafim` date NOT NULL,
  `pesquisador` varchar(11) NOT NULL,
  `unidade` int(11) NOT NULL,
  `programa_id` int(11) NOT NULL,
  `transversal_id` char(2) DEFAULT NULL,
  `publico` longtext DEFAULT NULL,
  `vinculo_projeto` int(11) DEFAULT NULL,
  `projeto` longtext DEFAULT NULL,
  `detalhamento` longtext DEFAULT NULL,
  `situacao` int(11) NOT NULL,
  `cadastro` date NOT NULL,
  `validador` int(11) DEFAULT NULL,
  `dt_validacao` date DEFAULT NULL,
  `municipio_id` int(11) DEFAULT NULL,
  `outra_localidade` varchar(255) DEFAULT NULL,
  `numero_participante` int(45) DEFAULT NULL,
  `experimental_id` int(11) DEFAULT NULL,
  `ano_evento` int(4) DEFAULT NULL,
  `mes_evento` int(2) DEFAULT NULL,
  `coordenador_instrutor` varchar(45) NOT NULL,
  `justificativa` varchar(255) DEFAULT NULL,
  `quantidade` int(11) DEFAULT NULL,
  `data_evento` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `evento_replicacao`
--

CREATE TABLE `evento_replicacao` (
  `id` int(11) NOT NULL,
  `indicador_evento` int(11) DEFAULT NULL,
  `valor_evento` varchar(45) DEFAULT NULL,
  `unidade_evento` int(11) DEFAULT NULL,
  `competencia_evento` varchar(45) DEFAULT NULL,
  `pesquisador_evento` int(11) DEFAULT NULL,
  `situacao_evento` varchar(45) DEFAULT NULL,
  `validador_evento` varchar(45) DEFAULT NULL,
  `data_validacao` date DEFAULT NULL,
  `ano_evento` int(4) DEFAULT NULL,
  `eventos_id` int(11) NOT NULL,
  `justificativa` varchar(500) DEFAULT NULL,
  `programa_id` int(11) DEFAULT NULL,
  `vinculado_projeto` varchar(3) DEFAULT NULL,
  `projeto_id` int(11) DEFAULT NULL,
  `id_municipio` int(11) DEFAULT NULL,
  `email_eventos` int(11) DEFAULT NULL,
  `ciencia_status` int(11) DEFAULT NULL,
  `ciencia_data` date DEFAULT NULL,
  `plac` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `experimental`
--

CREATE TABLE `experimental` (
  `id` int(11) NOT NULL,
  `campo_experimental` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `experimento`
--

CREATE TABLE `experimento` (
  `id` int(4) NOT NULL,
  `projeto_id` int(4) DEFAULT NULL,
  `numero_experimento` varchar(14) DEFAULT NULL,
  `regional_id` int(3) DEFAULT NULL,
  `local_experimento` varchar(367) DEFAULT NULL,
  `situacao` int(2) DEFAULT NULL,
  `observacoes` varchar(407) DEFAULT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `usuario_id` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `extrato_orcamentario`
--

CREATE TABLE `extrato_orcamentario` (
  `id` int(11) NOT NULL,
  `valor_solicitado_real` varchar(45) DEFAULT NULL,
  `valor_solicitado_dolar` varchar(45) DEFAULT NULL,
  `valor_aprovado_real` varchar(45) DEFAULT NULL,
  `valor_aprovado_dolar` varchar(45) DEFAULT NULL,
  `contrapartida_epamig` varchar(45) DEFAULT NULL,
  `bolsa_proposto` varchar(45) DEFAULT NULL,
  `bolsa_aprovado` varchar(45) DEFAULT NULL,
  `material_consumo_proposto` varchar(45) DEFAULT NULL,
  `material_consumo_aprovado` varchar(45) DEFAULT NULL,
  `passagens_proposto` varchar(45) DEFAULT NULL,
  `material_bibliografico_proposto` varchar(45) DEFAULT NULL,
  `material_bibliografico_aprovado` varchar(45) DEFAULT NULL,
  `despesas_acessorios_proposto` varchar(45) DEFAULT NULL,
  `despesas_acessorios_aprovado` varchar(45) DEFAULT NULL,
  `servico_pessoafisica_aprovado` varchar(45) DEFAULT NULL,
  `servico_pessoajuridico_proposto` varchar(45) DEFAULT NULL,
  `servico_pessoajuridico_aprovado` varchar(45) DEFAULT NULL,
  `despesas_diversas_proposto` varchar(45) DEFAULT NULL,
  `despesas_diversas_aprovado` varchar(45) DEFAULT NULL,
  `despesas_operacionais_proposto` varchar(45) DEFAULT NULL,
  `despesas_operacionais_aprovado` varchar(45) DEFAULT NULL,
  `manut_equipamento_proposto` varchar(45) DEFAULT NULL,
  `manut_equipamento_aprovado` varchar(45) DEFAULT NULL,
  `material_permanente_proposto` varchar(45) DEFAULT NULL,
  `material_permanente_aprovado` varchar(45) DEFAULT NULL,
  `obras_proposto` varchar(45) DEFAULT NULL,
  `software_proposto` varchar(45) DEFAULT NULL,
  `software_aprovado` varchar(45) DEFAULT NULL,
  `matconsumo_importado_proposto` varchar(45) DEFAULT NULL,
  `matconsumo_importado_aprovado` varchar(45) DEFAULT NULL,
  `matpermanente_proposto` varchar(45) DEFAULT NULL,
  `matpermanente_aprovado` varchar(45) DEFAULT NULL,
  `outros_proposto` varchar(45) DEFAULT NULL,
  `outros_aprovado` varchar(45) DEFAULT NULL,
  `total_nacional_proposto` varchar(45) DEFAULT NULL,
  `total_nacional_aprovado` varchar(45) DEFAULT NULL,
  `valor_dolar` varchar(45) DEFAULT NULL,
  `matconsumo_dolar_proposto` varchar(45) DEFAULT NULL,
  `matconsumo_dolar_aprovado` varchar(45) DEFAULT NULL,
  `outrosimportados_dolar_proposto` varchar(45) DEFAULT NULL,
  `outrosimportados_dolar_aprovado` varchar(45) DEFAULT NULL,
  `data_cadastro` timestamp NULL DEFAULT current_timestamp(),
  `usuario_id` int(11) DEFAULT NULL,
  `cod_registro` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `fazenda`
--

CREATE TABLE `fazenda` (
  `id` int(11) NOT NULL,
  `nome_fazenda` varchar(255) NOT NULL,
  `sigla_fazenda` varchar(20) NOT NULL,
  `regional_id` int(11) NOT NULL,
  `status_fazenda` int(11) NOT NULL DEFAULT 1
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `fonte`
--

CREATE TABLE `fonte` (
  `id` int(11) NOT NULL,
  `sigla` varchar(10) NOT NULL,
  `fonte` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `formacao`
--

CREATE TABLE `formacao` (
  `id` int(11) NOT NULL,
  `categoria` int(11) NOT NULL DEFAULT 2,
  `subcategoria_id` int(11) NOT NULL,
  `indicador_id` int(11) NOT NULL,
  `valorforma` float DEFAULT NULL,
  `hora_aula` float DEFAULT NULL,
  `descricao_forma` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `local_forma` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `pesquisador` int(11) NOT NULL,
  `data_inicio` date NOT NULL,
  `data_final` date NOT NULL,
  `regional_id` int(11) NOT NULL,
  `programa_id` int(11) DEFAULT NULL,
  `transversal_id` int(11) DEFAULT NULL,
  `vinculado_projeto` varchar(3) NOT NULL,
  `projeto_id` int(11) DEFAULT NULL,
  `observacoes` varchar(255) NOT NULL,
  `quem_cadastrou` int(11) NOT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `ano_forma` int(4) DEFAULT NULL,
  `mes_forma` int(2) DEFAULT NULL,
  `bolsista_estagiario` int(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `formacao_replicacao`
--

CREATE TABLE `formacao_replicacao` (
  `id` int(11) NOT NULL,
  `subcategoria_forma` int(11) DEFAULT NULL,
  `indicador_forma` int(11) DEFAULT NULL,
  `valor_forma` varchar(45) DEFAULT NULL,
  `unidade_forma` int(11) DEFAULT NULL,
  `competencia_forma` varchar(45) DEFAULT NULL,
  `pesquisador_forma` int(11) DEFAULT NULL,
  `situacao_forma` varchar(45) DEFAULT NULL,
  `validador_forma` varchar(45) DEFAULT NULL,
  `data_validacao` date DEFAULT NULL,
  `ano_forma` int(4) DEFAULT NULL,
  `projeto_id` int(11) NOT NULL,
  `justificativa` varchar(500) DEFAULT NULL,
  `email_forma` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `historico_coordenador`
--

CREATE TABLE `historico_coordenador` (
  `id` int(11) NOT NULL,
  `projeto_id` int(11) DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_final` date DEFAULT NULL,
  `coordenador_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `historico_subcoordenador`
--

CREATE TABLE `historico_subcoordenador` (
  `id` int(11) NOT NULL,
  `projeto_id` int(11) DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_final` date DEFAULT NULL,
  `coordenador_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `indicador`
--

CREATE TABLE `indicador` (
  `id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `subcategoria_id` int(11) NOT NULL,
  `nome` longtext NOT NULL,
  `descricao` longtext NOT NULL,
  `valor` float NOT NULL,
  `status_indicador` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `item`
--

CREATE TABLE `item` (
  `id` int(11) NOT NULL,
  `projeto_id` int(5) DEFAULT NULL,
  `fonte_financiadora` varchar(191) DEFAULT NULL,
  `gestora` varchar(66) DEFAULT NULL,
  `contratada` varchar(46) DEFAULT NULL,
  `parceiros` varchar(240) DEFAULT NULL,
  `palavra_chave1` varchar(100) DEFAULT NULL,
  `palavra_chave2` varchar(100) DEFAULT NULL,
  `palavra_chave3` varchar(100) DEFAULT NULL,
  `palavra_chave4` varchar(100) DEFAULT NULL,
  `palavra_chave5` varchar(100) DEFAULT NULL,
  `palavra_chave6` varchar(100) DEFAULT NULL,
  `produtos_vendavel` varchar(10) DEFAULT NULL,
  `epamig_parceira` varchar(10) DEFAULT NULL,
  `produto1` varchar(100) DEFAULT NULL,
  `produto2` varchar(100) DEFAULT NULL,
  `produto3` varchar(100) DEFAULT NULL,
  `produto4` varchar(100) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `itens_registro`
--

CREATE TABLE `itens_registro` (
  `id` int(11) NOT NULL,
  `projeto_id` int(5) DEFAULT NULL,
  `registro` varchar(255) DEFAULT NULL,
  `fonte_financiadora` varchar(191) DEFAULT NULL,
  `gestora` varchar(66) DEFAULT NULL,
  `contratada` varchar(46) DEFAULT NULL,
  `parceiros` varchar(240) DEFAULT NULL,
  `palavra_chave1` varchar(100) DEFAULT NULL,
  `palavra_chave2` varchar(100) DEFAULT NULL,
  `palavra_chave3` varchar(100) DEFAULT NULL,
  `palavra_chave4` varchar(100) DEFAULT NULL,
  `palavra_chave5` varchar(100) DEFAULT NULL,
  `palavra_chave6` varchar(100) DEFAULT NULL,
  `produtos_vendavel` varchar(10) DEFAULT NULL,
  `epamig_parceira` varchar(10) DEFAULT NULL,
  `produto1` varchar(100) DEFAULT NULL,
  `produto2` varchar(100) DEFAULT NULL,
  `produto3` varchar(100) DEFAULT NULL,
  `produto4` varchar(100) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `jcr`
--

CREATE TABLE `jcr` (
  `id` int(11) NOT NULL,
  `rank` varchar(5) DEFAULT NULL,
  `full_jornal` varchar(123) DEFAULT NULL,
  `issn` varchar(255) DEFAULT NULL,
  `eissn` varchar(255) DEFAULT NULL,
  `category` longtext DEFAULT NULL,
  `citations` longtext DEFAULT NULL,
  `if_2022` longtext DEFAULT NULL,
  `jci` longtext DEFAULT NULL,
  `percentage` longtext DEFAULT NULL,
  `total_cites` varchar(11) DEFAULT NULL,
  `journal_impact` varchar(21) DEFAULT NULL,
  `eigenfactor` varchar(17) DEFAULT NULL,
  `status` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `membroeventos`
--

CREATE TABLE `membroeventos` (
  `id` int(11) NOT NULL,
  `eventos_id` int(11) NOT NULL,
  `pesquisador_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `membropublicacao`
--

CREATE TABLE `membropublicacao` (
  `id` int(11) NOT NULL,
  `publicacao_id` int(11) NOT NULL,
  `pesquisador_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `membrotecnologia`
--

CREATE TABLE `membrotecnologia` (
  `id` int(11) NOT NULL,
  `tecnologia_id` int(11) NOT NULL,
  `pesquisador_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `municipio`
--

CREATE TABLE `municipio` (
  `id` int(11) NOT NULL,
  `nome_municipio` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `orcamentario`
--

CREATE TABLE `orcamentario` (
  `id` int(11) NOT NULL,
  `codigo_orcamentario` varchar(17) DEFAULT NULL,
  `codigo_registro` varchar(17) DEFAULT NULL,
  `proposto1` varchar(9) DEFAULT NULL,
  `aprovado1` varchar(9) DEFAULT NULL,
  `proposto2` varchar(9) DEFAULT NULL,
  `aprovado2` varchar(9) DEFAULT NULL,
  `proposto3` varchar(9) DEFAULT NULL,
  `aprovado3` varchar(9) DEFAULT NULL,
  `proposto4` varchar(9) DEFAULT NULL,
  `aprovado4` varchar(9) DEFAULT NULL,
  `proposto5` varchar(9) DEFAULT NULL,
  `aprovado5` varchar(9) DEFAULT NULL,
  `proposto6` varchar(9) DEFAULT NULL,
  `aprovado6` varchar(9) DEFAULT NULL,
  `proposto7` varchar(9) DEFAULT NULL,
  `aprovado7` varchar(9) DEFAULT NULL,
  `proposto8` varchar(9) DEFAULT NULL,
  `aprovado8` varchar(9) DEFAULT NULL,
  `proposto9` varchar(9) DEFAULT NULL,
  `aprovado9` varchar(9) DEFAULT NULL,
  `proposto10` varchar(10) DEFAULT NULL,
  `aprovado10` varchar(10) DEFAULT NULL,
  `proposto11` varchar(10) DEFAULT NULL,
  `aprovado11` varchar(10) DEFAULT NULL,
  `proposto12` varchar(10) DEFAULT NULL,
  `aprovado12` varchar(10) DEFAULT NULL,
  `proposto13` varchar(10) DEFAULT NULL,
  `aprovado13` varchar(10) DEFAULT NULL,
  `proposto14` varchar(10) DEFAULT NULL,
  `aprovado14` varchar(10) DEFAULT NULL,
  `proposto15` varchar(10) DEFAULT NULL,
  `aprovado15` varchar(10) DEFAULT NULL,
  `proposto16` varchar(10) DEFAULT NULL,
  `aprovado16` varchar(10) DEFAULT NULL,
  `proposto17` varchar(10) DEFAULT NULL,
  `aprovado17` varchar(10) DEFAULT NULL,
  `proposto18` varchar(10) DEFAULT NULL,
  `aprovado18` varchar(10) DEFAULT NULL,
  `proposto19` varchar(10) DEFAULT NULL,
  `aprovado19` varchar(10) DEFAULT NULL,
  `proposto20` varchar(10) DEFAULT NULL,
  `aprovado20` varchar(10) DEFAULT NULL,
  `tipo_bolsa1` varchar(41) DEFAULT NULL,
  `quantidade1` varchar(7) DEFAULT NULL,
  `valor1` varchar(11) DEFAULT NULL,
  `meses1` varchar(6) DEFAULT NULL,
  `tipo_bolsa2` varchar(17) DEFAULT NULL,
  `valor2` varchar(7) DEFAULT NULL,
  `meses2` varchar(6) DEFAULT NULL,
  `quantidade2` varchar(6) DEFAULT NULL,
  `tipo_bolsa3` varchar(14) DEFAULT NULL,
  `valor3` varchar(7) DEFAULT NULL,
  `meses3` varchar(6) DEFAULT NULL,
  `quantidade3` varchar(6) DEFAULT NULL,
  `valor_dolar` varchar(14) DEFAULT NULL,
  `valor_solicitado_inicial` varchar(24) DEFAULT NULL,
  `valor_aprovado_inicial` varchar(22) DEFAULT NULL,
  `valor_contrapartida_inicial` varchar(27) DEFAULT NULL,
  `primeira_elaborada` varchar(21) DEFAULT NULL,
  `gestora` varchar(8) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `pontuacao_coordenador`
--

CREATE TABLE `pontuacao_coordenador` (
  `id` int(11) NOT NULL,
  `data_inicial` date NOT NULL,
  `data_final` date NOT NULL,
  `projeto_id` int(11) NOT NULL,
  `quem_atualizou` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `pre_projeto`
--

CREATE TABLE `pre_projeto` (
  `id` int(11) NOT NULL,
  `edital` varchar(255) NOT NULL,
  `objetivo` longtext NOT NULL,
  `justificativa` longtext NOT NULL,
  `resumo` longtext NOT NULL,
  `equipe` longtext NOT NULL,
  `custeio` decimal(15,2) DEFAULT NULL,
  `outros_gastos` decimal(15,2) DEFAULT NULL,
  `investimento` decimal(15,2) DEFAULT NULL,
  `contrapartida` decimal(15,2) DEFAULT NULL,
  `subtotal` decimal(15,2) DEFAULT NULL,
  `valor_total` decimal(15,2) DEFAULT NULL,
  `identificacao_equipamentos` longtext NOT NULL,
  `parceria` longtext NOT NULL,
  `local_execucao` varchar(255) NOT NULL,
  `coordenador_id` int(11) DEFAULT NULL,
  `coordenador_externo` varchar(255) DEFAULT NULL,
  `quem_cadastrou` int(11) NOT NULL,
  `unidade_id` int(11) NOT NULL,
  `lotacao_id` int(11) NOT NULL,
  `programa_id` int(11) NOT NULL,
  `local_id` int(11) DEFAULT NULL,
  `titulo` longtext NOT NULL,
  `prazo_execucao` varchar(255) NOT NULL,
  `data_cadastro` datetime NOT NULL,
  `validador_pep` int(11) DEFAULT NULL,
  `consideracao_pep` longtext DEFAULT NULL,
  `data_pep` datetime DEFAULT NULL,
  `validador_coge` int(11) DEFAULT NULL,
  `consideracao_coge` longtext DEFAULT NULL,
  `data_coge` datetime DEFAULT NULL,
  `aprovacao` int(11) DEFAULT NULL,
  `email` int(11) DEFAULT NULL,
  `questao1` int(1) DEFAULT NULL,
  `questao2` int(1) DEFAULT NULL,
  `questao3` int(1) DEFAULT NULL,
  `ciencia_status` int(11) DEFAULT NULL,
  `ciencia_data` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `programa`
--

CREATE TABLE `programa` (
  `id` int(11) NOT NULL,
  `nome` longtext NOT NULL,
  `descricao` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `projeto6`
--

CREATE TABLE `projeto6` (
  `id` int(11) NOT NULL,
  `subcategoria_id` int(11) NOT NULL,
  `indicador_id` int(11) NOT NULL,
  `valor` float NOT NULL,
  `titulo_projeto` varchar(255) NOT NULL,
  `nome_edital` longtext DEFAULT NULL,
  `fonte_recursos` varchar(255) NOT NULL,
  `data_submissao` date DEFAULT NULL,
  `unidade_id` int(11) NOT NULL,
  `pesquisador_id` int(11) NOT NULL,
  `competencia` varchar(45) DEFAULT NULL,
  `status` int(5) DEFAULT NULL,
  `data_cadastro` timestamp NULL DEFAULT current_timestamp(),
  `validador` int(11) DEFAULT NULL,
  `data_validacao` date DEFAULT NULL,
  `ano` int(4) DEFAULT NULL,
  `justificativa` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `projeto45`
--

CREATE TABLE `projeto45` (
  `id` int(11) NOT NULL,
  `subcategoria_id` int(11) NOT NULL,
  `indicador_id` int(11) NOT NULL,
  `valor` float NOT NULL,
  `titulo_projeto` varchar(255) NOT NULL,
  `fonte_recursos` varchar(255) NOT NULL,
  `data_referencia` date DEFAULT NULL,
  `valor_captado` decimal(15,2) NOT NULL,
  `unidade_id` int(11) NOT NULL,
  `pesquisador_id` int(11) NOT NULL,
  `competencia` varchar(45) DEFAULT NULL,
  `status` int(5) DEFAULT NULL,
  `data_cadastro` timestamp NULL DEFAULT current_timestamp(),
  `validador` int(11) DEFAULT NULL,
  `data_validacao` date DEFAULT NULL,
  `ano` int(4) DEFAULT NULL,
  `justificativa` varchar(500) DEFAULT NULL,
  `tipo` int(11) DEFAULT NULL,
  `endogovernamental_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `projetos`
--

CREATE TABLE `projetos` (
  `id` int(11) NOT NULL,
  `numero_edital` varchar(185) DEFAULT NULL,
  `epamig_associada` varchar(10) DEFAULT NULL,
  `registro` varchar(500) DEFAULT NULL,
  `objetivo_projeto` varchar(5000) DEFAULT NULL,
  `produto_disciplina` varchar(40) DEFAULT NULL,
  `objetivo` varchar(1565) DEFAULT NULL,
  `objetivo_especifico` varchar(5258) DEFAULT NULL,
  `modalidade` int(1) DEFAULT NULL,
  `unidade` int(11) DEFAULT NULL,
  `data_apresentado` date DEFAULT NULL,
  `inicio` date DEFAULT NULL,
  `final` date DEFAULT NULL,
  `ultima_data` date DEFAULT NULL,
  `projeto_antigo` varchar(10) DEFAULT NULL,
  `prorrogacao` varchar(10) DEFAULT NULL,
  `data_prorrogacao` date DEFAULT NULL,
  `execucao` varchar(9) DEFAULT NULL,
  `valor_solicitado` varchar(45) DEFAULT NULL,
  `valor_solicitado_dolar` varchar(45) DEFAULT NULL,
  `valor_aprovado` varchar(45) DEFAULT NULL,
  `valor_aprovado_dolar` varchar(45) DEFAULT NULL,
  `contrapartida` varchar(45) DEFAULT NULL,
  `contrapartida_financeira` varchar(45) DEFAULT NULL,
  `contrapartida_naofinanceira` varchar(45) DEFAULT NULL,
  `observacoes` varchar(588) DEFAULT NULL,
  `programa_transversal` varchar(10) DEFAULT NULL,
  `programa_transversalmeio` varchar(10) DEFAULT NULL,
  `codigo_categoria` int(1) DEFAULT NULL,
  `codigo_situacao` int(2) DEFAULT NULL,
  `codigo_programa` varchar(2) DEFAULT NULL,
  `programa_antigo` int(11) DEFAULT NULL,
  `codigo_envolvido` varchar(3) DEFAULT NULL,
  `codigo_funcionario` varchar(4) DEFAULT NULL,
  `responsavel` int(11) DEFAULT NULL,
  `coordenador_externo` varchar(255) DEFAULT NULL,
  `experimental_id` int(11) DEFAULT NULL,
  `codigo` int(3) DEFAULT NULL,
  `codigo_itens` varchar(3) DEFAULT NULL,
  `codigo_orcamentario` varchar(1) DEFAULT NULL,
  `codigo_experimento` varchar(1) DEFAULT NULL,
  `participacao` varchar(1) DEFAULT NULL,
  `codigo_subarea` varchar(3) DEFAULT NULL,
  `codigo_modalidade` varchar(3) DEFAULT NULL,
  `programa_novo` varchar(1) DEFAULT NULL,
  `quem_cadastrou` int(11) DEFAULT NULL,
  `ano_projeto` int(4) DEFAULT NULL,
  `mes_projeto` int(2) DEFAULT NULL,
  `fonte_financiadora` varchar(255) DEFAULT NULL,
  `responsavel_antigo` int(11) DEFAULT NULL,
  `data_coordenador` date DEFAULT NULL,
  `data_iniciohistorico` date DEFAULT NULL,
  `data_finalhistorico` date DEFAULT NULL,
  `tipo_projeto` int(1) DEFAULT NULL,
  `indicador_cadastrado` varchar(45) DEFAULT NULL,
  `endo` int(11) DEFAULT NULL,
  `teve_prorrogacao` int(11) DEFAULT NULL,
  `data_relatorio` date DEFAULT NULL,
  `subcoordenador` int(11) DEFAULT NULL,
  `subcoordenador1` int(11) DEFAULT NULL,
  `subcoordenador2` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `publicacao`
--

CREATE TABLE `publicacao` (
  `id` int(11) NOT NULL,
  `categoria` int(11) NOT NULL DEFAULT 5,
  `subcategoria_id` int(11) NOT NULL,
  `indicador_id` int(11) NOT NULL,
  `valor_publicacao` int(11) NOT NULL,
  `issn` varchar(255) DEFAULT NULL,
  `ranking` varchar(255) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `jcr_id` int(11) DEFAULT NULL,
  `ordem_autoria` varchar(255) NOT NULL,
  `titulo` longtext DEFAULT NULL COMMENT 'Idem evento; idem título',
  `nome_publicacao` longtext DEFAULT NULL,
  `data_publicacao` date NOT NULL,
  `data_final` date DEFAULT NULL,
  `competencia` varchar(45) NOT NULL,
  `usuario_id` varchar(11) NOT NULL,
  `regional_id` int(11) NOT NULL,
  `programa_id` int(11) NOT NULL,
  `transversal_id` int(11) DEFAULT NULL,
  `vinculado_projeto` int(11) DEFAULT NULL,
  `projeto` longtext DEFAULT NULL,
  `link_projeto` varchar(255) NOT NULL,
  `status_publicacao` varchar(45) NOT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `validador` int(11) DEFAULT NULL,
  `data_validador` date DEFAULT NULL,
  `ano_publicacao` int(4) DEFAULT NULL,
  `mes_publicacao` int(2) DEFAULT NULL,
  `observacao` varchar(500) DEFAULT NULL,
  `autor_principal` int(11) DEFAULT NULL,
  `unidade_principal` int(11) DEFAULT NULL,
  `principal_autor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `publicacao_replicacao`
--

CREATE TABLE `publicacao_replicacao` (
  `id` int(11) NOT NULL,
  `subcategoria_publicacao` int(11) DEFAULT NULL,
  `indicador_publicacao` int(11) DEFAULT NULL,
  `valor_publicacao` varchar(45) DEFAULT NULL,
  `unidade_publicacao` int(11) DEFAULT NULL,
  `competencia_publicacao` varchar(45) DEFAULT NULL,
  `pesquisador_publicacao` int(11) DEFAULT NULL,
  `situacao_publicacao` varchar(45) DEFAULT NULL,
  `validador_publicacao` varchar(45) DEFAULT NULL,
  `data_validacao` date DEFAULT NULL,
  `ano_publicacao` int(4) DEFAULT NULL,
  `projeto_id` int(11) NOT NULL,
  `justificativa` varchar(500) DEFAULT NULL,
  `email_publicacao` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `qualis`
--

CREATE TABLE `qualis` (
  `id` int(11) NOT NULL,
  `issn` varchar(255) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `area` varchar(255) NOT NULL,
  `ranking` varchar(255) NOT NULL,
  `status_qualis` varchar(20) NOT NULL DEFAULT 'Ativo'
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `regional`
--

CREATE TABLE `regional` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `endereco` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `sigla` varchar(10) DEFAULT NULL,
  `status` varchar(45) DEFAULT 'Ativo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `sintese_resultado`
--

CREATE TABLE `sintese_resultado` (
  `id` int(11) NOT NULL,
  `programa_disciplina` varchar(45) DEFAULT NULL,
  `resultado_relevante` longtext DEFAULT NULL,
  `producao_bibliografica` longtext DEFAULT NULL,
  `difusao_tecnologia` longtext DEFAULT NULL,
  `observacao` longtext DEFAULT NULL,
  `usuario_id` int(11) NOT NULL,
  `projeto_id` int(11) NOT NULL,
  `data_cadastro` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `solicitacao`
--

CREATE TABLE `solicitacao` (
  `id` int(11) NOT NULL,
  `observacao` varchar(255) DEFAULT NULL,
  `status_solicitacao` varchar(45) DEFAULT 'Pendente',
  `data_solicitacao` timestamp NULL DEFAULT current_timestamp(),
  `tipo_id` int(11) NOT NULL,
  `regional_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `data_resposta` date DEFAULT NULL,
  `resposta` varchar(255) DEFAULT NULL,
  `quem_resposta` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `subcategoria`
--

CREATE TABLE `subcategoria` (
  `id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `nome` longtext NOT NULL,
  `descricao` longtext NOT NULL,
  `status` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tecnologia`
--

CREATE TABLE `tecnologia` (
  `id` int(11) NOT NULL,
  `categoria` int(11) NOT NULL,
  `subcategoria_id` int(11) NOT NULL,
  `indicador_id` int(11) NOT NULL,
  `valor` int(11) NOT NULL,
  `descricao` longtext DEFAULT NULL COMMENT 'Idem evento; idem título',
  `publicacao` longtext DEFAULT NULL,
  `local` longtext DEFAULT NULL,
  `dataini` date NOT NULL,
  `datafim` date NOT NULL,
  `pesquisador` varchar(11) NOT NULL,
  `unidade` int(11) NOT NULL,
  `programa_id` int(11) NOT NULL,
  `transversal_id` char(2) DEFAULT NULL,
  `publico` longtext DEFAULT NULL,
  `vinculo_projeto` int(11) DEFAULT NULL,
  `projeto` longtext DEFAULT NULL,
  `fonte_id` int(11) DEFAULT NULL,
  `recurso` decimal(10,2) DEFAULT NULL,
  `detalhamento` longtext DEFAULT NULL,
  `situacao` int(11) NOT NULL,
  `cadastro` date NOT NULL,
  `validador` int(11) DEFAULT NULL,
  `dt_validacao` date DEFAULT NULL,
  `ano_tecnologia` int(4) DEFAULT NULL,
  `mes_tecnologia` int(2) DEFAULT NULL,
  `pratica_desenvolvida` int(11) DEFAULT NULL,
  `trl_id` int(11) DEFAULT NULL,
  `quantidade` int(10) DEFAULT NULL,
  `municipio_territorio` varchar(500) DEFAULT NULL,
  `tecnologia_produto` varchar(500) DEFAULT NULL,
  `classificacao_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tecnologiaclassificacao`
--

CREATE TABLE `tecnologiaclassificacao` (
  `id` int(11) NOT NULL,
  `indicador_id` int(11) NOT NULL,
  `nome_classificacao` varchar(255) NOT NULL,
  `status_classificacao` int(11) NOT NULL DEFAULT 1
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tecnologia_replicacao`
--

CREATE TABLE `tecnologia_replicacao` (
  `id` int(11) NOT NULL,
  `indicador_tecnologia` int(11) DEFAULT NULL,
  `valor_tecnologia` varchar(45) DEFAULT NULL,
  `unidade_tecnologia` int(11) DEFAULT NULL,
  `competencia` varchar(45) DEFAULT NULL,
  `pesquisador_tecnologia` int(11) DEFAULT NULL,
  `situacao_tecnologia` varchar(45) DEFAULT 'Pendente',
  `validador_tecnologia` varchar(45) DEFAULT NULL,
  `data_validacao` date DEFAULT NULL,
  `ano_tec` int(4) DEFAULT NULL,
  `tecnologia_id` int(11) NOT NULL,
  `justificativa` varchar(500) DEFAULT NULL,
  `email_tecnologia` int(11) DEFAULT NULL,
  `ciencia_status` int(11) DEFAULT NULL,
  `ciencia_data` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tipo`
--

CREATE TABLE `tipo` (
  `id` int(11) NOT NULL,
  `nome_tipo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `transversal`
--

CREATE TABLE `transversal` (
  `id` int(11) NOT NULL,
  `nome_transversal` longtext NOT NULL,
  `descricao_transversal` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `trl`
--

CREATE TABLE `trl` (
  `id` int(11) NOT NULL,
  `nome_trl` varchar(255) NOT NULL,
  `status_trl` int(11) NOT NULL DEFAULT 1
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `login` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `senha` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `tipo` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `endereco_cnpq` varchar(255) DEFAULT NULL,
  `titulacao` varchar(10) DEFAULT NULL,
  `linha_pesquisa` varchar(600) DEFAULT NULL,
  `area_atuacao` varchar(600) DEFAULT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `regional_id` int(11) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `email_institucional` varchar(255) DEFAULT NULL,
  `cpf` varchar(45) DEFAULT NULL,
  `efetivo` int(11) DEFAULT NULL,
  `fazenda_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `acessos`
--
ALTER TABLE `acessos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `administracao`
--
ALTER TABLE `administracao`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `adm_replicacao`
--
ALTER TABLE `adm_replicacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_equipe_administracao1_idx` (`projeto_id`);

--
-- Índices de tabela `arquivo_administracao`
--
ALTER TABLE `arquivo_administracao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_arquivo_publicacao_publicacao1_idx` (`projeto_id`);

--
-- Índices de tabela `arquivo_evento`
--
ALTER TABLE `arquivo_evento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_arquivo_evento_eventos1_idx` (`eventos_id`);

--
-- Índices de tabela `arquivo_formacao`
--
ALTER TABLE `arquivo_formacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_arquivo_publicacao_publicacao1_idx` (`formacao_id`);

--
-- Índices de tabela `arquivo_preprojeto`
--
ALTER TABLE `arquivo_preprojeto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_arquivo_evento_eventos1_idx` (`preprojeto_id`);

--
-- Índices de tabela `arquivo_projeto6`
--
ALTER TABLE `arquivo_projeto6`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_arquivo_publicacao_publicacao1_idx` (`projeto6`);

--
-- Índices de tabela `arquivo_projeto45`
--
ALTER TABLE `arquivo_projeto45`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_arquivo_publicacao_publicacao1_idx` (`projeto45`);

--
-- Índices de tabela `arquivo_publicacao`
--
ALTER TABLE `arquivo_publicacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_arquivo_publicacao_publicacao1_idx` (`publicacao_id`);

--
-- Índices de tabela `arquivo_relatorio`
--
ALTER TABLE `arquivo_relatorio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_arquivo_publicacao_publicacao1_idx` (`projeto_id`);

--
-- Índices de tabela `arquivo_solicitacao`
--
ALTER TABLE `arquivo_solicitacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_arquivo_evento_eventos1_idx` (`solicitacao_id`);

--
-- Índices de tabela `arquivo_tecnologia`
--
ALTER TABLE `arquivo_tecnologia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_arquivo_tecnologia_tecnologia1_idx` (`tecnologia_id`);

--
-- Índices de tabela `atividade`
--
ALTER TABLE `atividade`
  ADD PRIMARY KEY (`atividade_id`),
  ADD KEY `subcategoria` (`subcategoria`),
  ADD KEY `indicador` (`indicador`),
  ADD KEY `pesquisador` (`pesquisador`),
  ADD KEY `unidade` (`unidade`),
  ADD KEY `programa` (`programa`),
  ADD KEY `transversal` (`transversal`),
  ADD KEY `validador` (`validador`);

--
-- Índices de tabela `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `bolsa`
--
ALTER TABLE `bolsa`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `bolsa_fonte`
--
ALTER TABLE `bolsa_fonte`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `bolsa_situacao`
--
ALTER TABLE `bolsa_situacao`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `bolsa_tipo`
--
ALTER TABLE `bolsa_tipo`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `bolsista_cadastro`
--
ALTER TABLE `bolsista_cadastro`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `consulta_geral`
--
ALTER TABLE `consulta_geral`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `consulta_pr`
--
ALTER TABLE `consulta_pr`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `consulta_validado`
--
ALTER TABLE `consulta_validado`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `endogovernamental`
--
ALTER TABLE `endogovernamental`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `entrada_saida`
--
ALTER TABLE `entrada_saida`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `equipe`
--
ALTER TABLE `equipe`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `equipes`
--
ALTER TABLE `equipes`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `equipes22092025`
--
ALTER TABLE `equipes22092025`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `equipes_periodo`
--
ALTER TABLE `equipes_periodo`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subcategoria` (`subcategoria_id`),
  ADD KEY `indicador` (`indicador_id`),
  ADD KEY `pesquisador` (`pesquisador`),
  ADD KEY `unidade` (`unidade`),
  ADD KEY `programa` (`programa_id`),
  ADD KEY `transversal` (`transversal_id`),
  ADD KEY `validador` (`validador`),
  ADD KEY `fk_eventos_municipio1_idx` (`municipio_id`),
  ADD KEY `fk_eventos_experimental1_idx` (`experimental_id`);

--
-- Índices de tabela `evento_replicacao`
--
ALTER TABLE `evento_replicacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_evento_replicacao_eventos1_idx` (`eventos_id`);

--
-- Índices de tabela `experimental`
--
ALTER TABLE `experimental`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `experimento`
--
ALTER TABLE `experimento`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `extrato_orcamentario`
--
ALTER TABLE `extrato_orcamentario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_extrato_orcamentario_usuario1_idx` (`usuario_id`);

--
-- Índices de tabela `fazenda`
--
ALTER TABLE `fazenda`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `fonte`
--
ALTER TABLE `fonte`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_sigla` (`sigla`);

--
-- Índices de tabela `formacao`
--
ALTER TABLE `formacao`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `formacao_replicacao`
--
ALTER TABLE `formacao_replicacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_equipe_administracao1_idx` (`projeto_id`);

--
-- Índices de tabela `historico_coordenador`
--
ALTER TABLE `historico_coordenador`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `historico_subcoordenador`
--
ALTER TABLE `historico_subcoordenador`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `indicador`
--
ALTER TABLE `indicador`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria` (`categoria_id`),
  ADD KEY `subcategoria` (`subcategoria_id`);

--
-- Índices de tabela `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `itens_registro`
--
ALTER TABLE `itens_registro`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `jcr`
--
ALTER TABLE `jcr`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `membroeventos`
--
ALTER TABLE `membroeventos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `membropublicacao`
--
ALTER TABLE `membropublicacao`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `membrotecnologia`
--
ALTER TABLE `membrotecnologia`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `municipio`
--
ALTER TABLE `municipio`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `orcamentario`
--
ALTER TABLE `orcamentario`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `pontuacao_coordenador`
--
ALTER TABLE `pontuacao_coordenador`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `pre_projeto`
--
ALTER TABLE `pre_projeto`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `programa`
--
ALTER TABLE `programa`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `projeto6`
--
ALTER TABLE `projeto6`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `projeto45`
--
ALTER TABLE `projeto45`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `projetos`
--
ALTER TABLE `projetos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `publicacao`
--
ALTER TABLE `publicacao`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `publicacao_replicacao`
--
ALTER TABLE `publicacao_replicacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_equipe_administracao1_idx` (`projeto_id`);

--
-- Índices de tabela `qualis`
--
ALTER TABLE `qualis`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `regional`
--
ALTER TABLE `regional`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `sintese_resultado`
--
ALTER TABLE `sintese_resultado`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_sintese_resultado_usuario1_idx` (`usuario_id`),
  ADD KEY `fk_sintese_resultado_administracao1_idx` (`projeto_id`);

--
-- Índices de tabela `solicitacao`
--
ALTER TABLE `solicitacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_solicitacao_tipo_idx` (`tipo_id`),
  ADD KEY `fk_solicitacao_regional1_idx` (`regional_id`),
  ADD KEY `fk_solicitacao_usuario1_idx` (`usuario_id`);

--
-- Índices de tabela `subcategoria`
--
ALTER TABLE `subcategoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria` (`categoria_id`);

--
-- Índices de tabela `tecnologia`
--
ALTER TABLE `tecnologia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subcategoria` (`subcategoria_id`),
  ADD KEY `indicador` (`indicador_id`),
  ADD KEY `pesquisador` (`pesquisador`),
  ADD KEY `unidade` (`unidade`),
  ADD KEY `programa` (`programa_id`),
  ADD KEY `transversal` (`transversal_id`),
  ADD KEY `validador` (`validador`);

--
-- Índices de tabela `tecnologiaclassificacao`
--
ALTER TABLE `tecnologiaclassificacao`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `tecnologia_replicacao`
--
ALTER TABLE `tecnologia_replicacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tecnologia_replicacao_tecnologia1_idx` (`tecnologia_id`);

--
-- Índices de tabela `tipo`
--
ALTER TABLE `tipo`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `transversal`
--
ALTER TABLE `transversal`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `trl`
--
ALTER TABLE `trl`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login_UNIQUE` (`login`),
  ADD KEY `fk_usuario_regional_idx` (`regional_id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `acessos`
--
ALTER TABLE `acessos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `administracao`
--
ALTER TABLE `administracao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `adm_replicacao`
--
ALTER TABLE `adm_replicacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `arquivo_administracao`
--
ALTER TABLE `arquivo_administracao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `arquivo_evento`
--
ALTER TABLE `arquivo_evento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `arquivo_formacao`
--
ALTER TABLE `arquivo_formacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `arquivo_preprojeto`
--
ALTER TABLE `arquivo_preprojeto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `arquivo_projeto6`
--
ALTER TABLE `arquivo_projeto6`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `arquivo_projeto45`
--
ALTER TABLE `arquivo_projeto45`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `arquivo_publicacao`
--
ALTER TABLE `arquivo_publicacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `arquivo_relatorio`
--
ALTER TABLE `arquivo_relatorio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `arquivo_solicitacao`
--
ALTER TABLE `arquivo_solicitacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `arquivo_tecnologia`
--
ALTER TABLE `arquivo_tecnologia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `atividade`
--
ALTER TABLE `atividade`
  MODIFY `atividade_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `bolsa`
--
ALTER TABLE `bolsa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `bolsa_fonte`
--
ALTER TABLE `bolsa_fonte`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `bolsa_situacao`
--
ALTER TABLE `bolsa_situacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `bolsa_tipo`
--
ALTER TABLE `bolsa_tipo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `bolsista_cadastro`
--
ALTER TABLE `bolsista_cadastro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `consulta_geral`
--
ALTER TABLE `consulta_geral`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `consulta_pr`
--
ALTER TABLE `consulta_pr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `consulta_validado`
--
ALTER TABLE `consulta_validado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `endogovernamental`
--
ALTER TABLE `endogovernamental`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `entrada_saida`
--
ALTER TABLE `entrada_saida`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `equipe`
--
ALTER TABLE `equipe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `equipes`
--
ALTER TABLE `equipes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `equipes22092025`
--
ALTER TABLE `equipes22092025`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `equipes_periodo`
--
ALTER TABLE `equipes_periodo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `evento_replicacao`
--
ALTER TABLE `evento_replicacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `experimental`
--
ALTER TABLE `experimental`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `experimento`
--
ALTER TABLE `experimento`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `extrato_orcamentario`
--
ALTER TABLE `extrato_orcamentario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `fazenda`
--
ALTER TABLE `fazenda`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `formacao`
--
ALTER TABLE `formacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `formacao_replicacao`
--
ALTER TABLE `formacao_replicacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `historico_coordenador`
--
ALTER TABLE `historico_coordenador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `historico_subcoordenador`
--
ALTER TABLE `historico_subcoordenador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `indicador`
--
ALTER TABLE `indicador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `item`
--
ALTER TABLE `item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `itens_registro`
--
ALTER TABLE `itens_registro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `jcr`
--
ALTER TABLE `jcr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `membroeventos`
--
ALTER TABLE `membroeventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `membropublicacao`
--
ALTER TABLE `membropublicacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `membrotecnologia`
--
ALTER TABLE `membrotecnologia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `municipio`
--
ALTER TABLE `municipio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `orcamentario`
--
ALTER TABLE `orcamentario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `pontuacao_coordenador`
--
ALTER TABLE `pontuacao_coordenador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `pre_projeto`
--
ALTER TABLE `pre_projeto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `programa`
--
ALTER TABLE `programa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `projeto6`
--
ALTER TABLE `projeto6`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `projeto45`
--
ALTER TABLE `projeto45`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `projetos`
--
ALTER TABLE `projetos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `publicacao`
--
ALTER TABLE `publicacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `publicacao_replicacao`
--
ALTER TABLE `publicacao_replicacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `qualis`
--
ALTER TABLE `qualis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `regional`
--
ALTER TABLE `regional`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `sintese_resultado`
--
ALTER TABLE `sintese_resultado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `solicitacao`
--
ALTER TABLE `solicitacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `subcategoria`
--
ALTER TABLE `subcategoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tecnologia`
--
ALTER TABLE `tecnologia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tecnologiaclassificacao`
--
ALTER TABLE `tecnologiaclassificacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tecnologia_replicacao`
--
ALTER TABLE `tecnologia_replicacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tipo`
--
ALTER TABLE `tipo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `transversal`
--
ALTER TABLE `transversal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `trl`
--
ALTER TABLE `trl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
