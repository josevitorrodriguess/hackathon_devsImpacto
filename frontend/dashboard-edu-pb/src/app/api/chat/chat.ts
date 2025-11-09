import axios from 'axios';
import * as fs from 'fs';


const dados = JSON.parse(fs.readFileSync('dados.json', 'utf8'));

async function perguntarParaGemini(pergunta: string): Promise<string> {
	const context = JSON.stringify(dados);
	const prompt = `Responda a pergunta com base nos dados a seguir:\n${context}\nPergunta: ${pergunta}\nResposta:`;

	try {
		const response = await axios.post(
			'https://api.gemini.com/v1/completions',
			{
				model: 'gemini-001',
				prompt: prompt,
				max_tokens: 100
			},
			{
				headers: {
					'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
				}
			}
		);

		return response.data.choices[0].text.trim();
	} catch (error) {
		console.error('Erro ao consultar Gemini:', error);
		return 'Desculpe, não consegui processar sua pergunta.';
	}
}