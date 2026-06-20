export const config = { runtime: 'edge' };

import { createDomainGateway, serverOptions } from '../../../server/gateway';
import { createThermalServiceRoutes } from '../../../src/generated/server/cyberspace/thermal/v1/service_server';
import { thermalHandler } from '../../../server/cyberspace/thermal/v1/handler';

export default createDomainGateway(
  createThermalServiceRoutes(thermalHandler, serverOptions),
);
