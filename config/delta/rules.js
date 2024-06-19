
import deltaProducerPublicationGraphMaintainerSubsidies from './delta-producer-publication-graph-maintainer-subsidies';
import deltaProducerReportGenerator from './delta-producer-report-generator';
import jobsController from './jobs-controller';
import resource from './resource';

export default [
  ...deltaProducerPublicationGraphMaintainerSubsidies,
  ...deltaProducerReportGenerator,
  ...jobsController,
  ...resource
];
