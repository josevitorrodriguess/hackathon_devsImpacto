#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Paths (relative to repository root)
const escolasPath = path.resolve(__dirname, '..', 'frontend', 'dashboard-edu-pb', 'src', 'data', 'escolas.json');
const indicadoresDir = path.resolve(__dirname, '..', 'frontend', 'dashboard-edu-pb', 'src', 'data');

function safeString(v){
  if (v === undefined || v === null) return '';
  return String(v).trim();
}

function getInepFromEntry(entry){
  // Try common property names used in different indicator files
  const candidates = [
    'inep',
    'inep_id',
    'codigo_inep',
    'codigo_ibge',
    'codigo',
    'cod_inep',
    'INEP',
    'CODIGO_INEP'
  ];
  for (const c of candidates){
    if (Object.prototype.hasOwnProperty.call(entry, c)){
      return safeString(entry[c]);
    }
  }
  // Also try nested patterns (rare)
  for (const key of Object.keys(entry)){
    const val = entry[key];
    if (typeof val === 'object' && val !== null){
      if (Object.prototype.hasOwnProperty.call(val, 'inep')) return safeString(val.inep);
    }
  }
  return '';
}

function main(){
  if (!fs.existsSync(escolasPath)){
    console.error('Arquivo escolas.json não encontrado em:', escolasPath);
    process.exit(1);
  }

  const escolasRaw = fs.readFileSync(escolasPath, 'utf8');
  let escolas;
  try{
    escolas = JSON.parse(escolasRaw);
  } catch(e){
    console.error('Erro ao parsear escolas.json:', e.message);
    process.exit(1);
  }

  const inepSet = new Set(escolas.map(s => safeString(s.inep)));
  console.log(`Escolas carregadas: ${inepSet.size}`);

  if (!fs.existsSync(indicadoresDir)){
    console.error('Diretorio de indicadores nao existe:', indicadoresDir);
    process.exit(1);
  }

  const files = fs.readdirSync(indicadoresDir).filter(f => f.startsWith('indicador_') && f.endsWith('.json'));
  if (files.length === 0){
    console.log('Nenhum arquivo indicador_*.json encontrado em', indicadoresDir);
    return;
  }

  for (const file of files){
    const fullPath = path.join(indicadoresDir, file);
    console.log('\nProcessando', fullPath);
    const original = fs.readFileSync(fullPath, 'utf8');
    try{
      // backup
      fs.writeFileSync(fullPath + '.bak', original, 'utf8');
    } catch(e){
      console.warn('Falha ao criar backup para', file, e.message);
    }

    // sanitize NaN tokens to valid JSON: replace bare NaN with null
    const sanitized = original.replace(/\bNaN\b/g, 'null');

    let obj;
    try{
      obj = JSON.parse(sanitized);
    } catch(e){
      console.error('JSON.parse falhou para', file, ' — vou tentar heurística simples. Erro:', e.message);
      // try to be more aggressive: replace unquoted NaN-like tokens and trailing commas
      let alt = sanitized.replace(/\bNaN\b/g, 'null');
      alt = alt.replace(/,\s*\]/g, ']');
      try{
        obj = JSON.parse(alt);
      } catch(e2){
        console.error('Ainda falhou ao parsear', file, e2.message);
        continue;
      }
    }

    if (!obj || !Array.isArray(obj.escolas)){
      console.warn('Arquivo', file, 'não tem a propriedade "escolas" como array. Pulando.');
      continue;
    }

    const before = obj.escolas.length;
    const filtered = obj.escolas.filter(entry => {
      const code = getInepFromEntry(entry);
      return code && inepSet.has(String(code));
    });
    const after = filtered.length;
    obj.escolas = filtered;

    try{
      fs.writeFileSync(fullPath, JSON.stringify(obj, null, 2), 'utf8');
      console.log(`Gravado ${file}: antes=${before}, depois=${after}, removidos=${before - after}`);
    } catch(e){
      console.error('Erro ao gravar arquivo filtrado', fullPath, e.message);
    }
  }

  console.log('\nProcessamento concluído. Backups .bak criados ao lado dos arquivos originais.');
}

main();
