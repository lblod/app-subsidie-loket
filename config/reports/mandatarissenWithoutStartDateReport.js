import {generateReportFromData} from '../helpers.js';
import { querySudo as query } from '@lblod/mu-auth-sudo';

export default {
  cronPattern: '0 45 22 * * *',
  name: 'mandatarissenWithoutStartDateReport',
  execute: async () => {
    const reportData = {
      title: 'List mandatarissen having no start date',
      description: 'Mandatarissen with their first name and last name, role and bestuurseenheid.',
      filePrefix: 'mandatarissenWithoutStartDate'
    };
    console.log('Generate mandatarissenWithoutStartDate Report');
    const queryString = `
      SELECT DISTINCT ?mandataris ?firstName ?lastName ?role ?bestuurseenheid
      WHERE {
        ?mandataris a <http://data.vlaanderen.be/ns/mandaat#Mandataris> ;
          <http://www.w3.org/ns/org#holds> ?mandate ;
          <http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan> ?person .
        ?person <http://data.vlaanderen.be/ns/persoon#gebruikteVoornaam> ?firstName ;
          <http://xmlns.com/foaf/0.1/familyName> ?lastName .
        ?mandate <http://www.w3.org/ns/org#role> ?roleUri .
        ?bestuursorgaanInTijd <http://www.w3.org/ns/org#hasPost> ?mandate ;
          <http://data.vlaanderen.be/ns/mandaat#isTijdspecialisatieVan> ?bestuursorgaan .
        ?bestuursorgaan <http://data.vlaanderen.be/ns/besluit#bestuurt> ?bestuurseenheidUri .
        ?bestuurseenheidUri skos:prefLabel ?bestuurseenheid .
        ?roleUri skos:prefLabel ?role .
        FILTER NOT EXISTS { ?mandataris <http://data.vlaanderen.be/ns/mandaat#start> ?startDate }
      }
      ORDER BY ?mandataris
    `;
    const queryResponse = await query(queryString);
    const data = queryResponse.results.bindings.map((result) => {
      return {
        mandataris: result.mandataris.value,
        firstName: result.firstName.value,
        lastName: result.lastName.value,
        role: result.role.value,
        bestuurseenheid: result.bestuurseenheid.value
      };
    });

    await generateReportFromData(data, ['mandataris', 'firstName', 'lastName', 'role', 'bestuurseenheid'], reportData);
  }
};
