export const config = { runtime: 'edge' };

import { createDomainGateway, serverOptions } from '../../../server/gateway';
import { createScenarioServiceRoutes } from '../../../src/generated/server/cyberspace/scenario/v1/service_server';
import { scenarioHandler } from '../../../server/cyberspace/scenario/v1/handler';

export default createDomainGateway(
  createScenarioServiceRoutes(scenarioHandler, serverOptions),
);
