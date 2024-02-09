import {generateReportFromData} from '../helpers.js';
import { querySudo as query } from '@lblod/mu-auth-sudo';

export default {
  cronPattern: '0 5 22 15 * 6',
  name: 'bbcdrDossiers',
  execute: async () => {
    const reportData = {
      title: 'Totaal aantal BBC-DR Dossiers',
      description: 'Number of BBC-DR Dossiers',
      filePrefix: 'bbcdrDossiers'
    };
    console.log('Generate BBC-DR Dossiers Report');
    const queryString = `
      SELECT DISTINCT  (COUNT(?uri) AS ?bbcdrReportCount) WHERE {
        ?uri a <http://mu.semte.ch/vocabularies/ext/bbcdr/Report>
      }
    `;
    const queryResponse = await query(queryString);
    const data = queryResponse.results.bindings.map((row) => ({
      bbcdrReportCount: row.bbcdrReportCount.value,
    }));
    await generateReportFromData(data, ['bbcdrReportCount'], reportData);
  }
};
