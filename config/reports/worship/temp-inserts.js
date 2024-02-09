import * as mas from '@lblod/mu-auth-sudo';
import * as queries from './queries';
import * as rst from 'rdf-string-ttl';
import { generateReportFromData } from '../../helpers';
import { SparqlJsonParser } from 'sparqljson-parse';
const sparqlJsonParser = new SparqlJsonParser();

const TEMP_INSERTS_GRAPH =
  'http://eredienst-mandatarissen-consumer/temp-inserts';

async function generate() {
  const collectQuery = queries.allFromGraph(TEMP_INSERTS_GRAPH);
  const collectResponse = await mas.querySudo(collectQuery);
  const collected = sparqlJsonParser
    .parseJsonResults(collectResponse)
    .map((c) => {
      return {
        subject: rst.termToString(c.s),
        predicate: rst.termToString(c.p),
        object: rst.termToString(c.o),
      };
    });
  await generateReportFromData(collected, ['subject', 'predicate', 'object'], {
    title: 'Eredienst Temporary Inserts Report',
    description:
      'All eredienst triples ready for dispatching to organisations.',
    filePrefix: 'eredienst-temp-inserts',
  });
}

export default {
  cronPattern: '0 1 * * *',
  name: 'eredienst-temp-inserts',
  execute: generate,
};
