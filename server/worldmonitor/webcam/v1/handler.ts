import type { WebcamServiceHandler } from '../../../../src/generated/server/cyberspace/webcam/v1/service_server';
import { listWebcams } from './list-webcams';
import { getWebcamImage } from './get-webcam-image';

export const webcamHandler: WebcamServiceHandler = {
  listWebcams,
  getWebcamImage,
};
