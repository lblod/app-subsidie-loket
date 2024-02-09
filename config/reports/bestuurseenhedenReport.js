import {query} from 'mu';
import {generateReportFromData} from '../helpers.js';

export default {
  cronPattern: '0 10 22 * * 6',
  name: 'bestuurseenhedenReport',
  execute: async () => {
    const reportData = {
      title: 'Lijst van bestuurseenheden',
      description: 'All Bestuurseenheden',
      filePrefix: 'bestuurseenheden'
    };
    console.log('Generate Bestuurseenheden Report');
    const queryString = `
      PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
      PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      
      select distinct ?uri ?name ?kbonummer ?type ?province where {
        ?uri a besluit:Bestuurseenheid.
        OPTIONAL {
          ?uri skos:prefLabel ?name.
        }
        OPTIONAL {
          ?uri ext:kbonummer ?kbonummer.
        }
        OPTIONAL {
          ?uri ext:inProvincie ?provinceURI.
          ?provinceURI rdfs:label ?province.
        }
        OPTIONAL {
          ?uri besluit:classificatie ?typeURI.
          ?typeURI skos:prefLabel ?type .
        }
      }
    `;
    const queryResponse = await query(queryString);
    const data = queryResponse.results.bindings.map((bestuurseenheid) => ({
      uri: bestuurseenheid.uri.value,
      name: bestuurseenheid.name ? bestuurseenheid.name.value : '',
      type: bestuurseenheid.type ? bestuurseenheid.type.value : '',
      province: bestuurseenheid.province ? bestuurseenheid.province.value : '',
      kbonummer: bestuurseenheid.kbonummer ? bestuurseenheid.kbonummer.value: ''
    }));
    await generateReportFromData(data, ['uri', 'name', 'kbonummer', 'type', 'province'], reportData);
  }
};
