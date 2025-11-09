export interface Chamados {
	id: string;
	inep: number;
	titulo: string;
	descricao: string;
	dataCriacao: string;
	tipo: TipoChamado;
	prioridade: "Baixa" | "Média" | "Alta" | "Urgente";
	status: "Em andamento" | "Rejeitado" | "Concluído" | "Aguardando Confirmação da Escola";

}

export const tiposChamados = [
	"Infraestrutura",
	"Material Didático",
	"Recursos Humanos",
	"Tecnologia",
	"Transporte Escolar",
	"Alimentação Escolar",
	"Segurança",
	"Limpeza e Manutenção",
	"Gestão e Administração",
	"Acessibilidade",
	"Energia e Iluminação",
	"Saneamento e Água",
	"Comunicação e Internet",
	"Outros"
] as const;

export type TipoChamado = typeof tiposChamados[number];