/** W30 API calls: read a device photo, then save the member-confirmed reading. */
import { mobileRequest } from "./client/api";
import { parsePhotoRead, type PhotoReadType } from "./photo-read-logic";
import { prepareImageForUpload } from "./upload-image";

export * from "./photo-read-logic";

export async function readDevicePhoto(type: PhotoReadType, file: File) {
  const form = new FormData();
  form.append("type", type);
  form.append("image", await prepareImageForUpload(file));
  return parsePhotoRead(await mobileRequest(`/api/v1/mobile/observations/photo-read`, { method: "POST", form }));
}

export async function saveConfirmedReading(body: Record<string, unknown>) {
  return mobileRequest(`/api/v1/mobile/observations`, { method: "POST", body });
}
