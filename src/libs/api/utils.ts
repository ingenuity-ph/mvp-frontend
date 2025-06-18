import { z } from "zod";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "./constants";

export const toPaginatedResponse = <Data extends z.ZodTypeAny>(data: Data) => {
  return z.object({
    data: z.array(data),
    total_records: z.number().catch(0),
    total_pages: z.number().catch(0),
    current_page: z.number().catch(1),
    records_per_page: z.number().catch(0),
  });
};

export const paginatedPayloadSchema = z.object({
  page: z.number().optional().default(DEFAULT_PAGE),
  perPage: z.number().optional().default(DEFAULT_PAGE_SIZE),
});

type FormDataContentValue = number | string | boolean | File | Blob;
export const toFormData = (
  content: Record<string, FormDataContentValue | Array<FormDataContentValue>>
) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(content)) {
    if (Array.isArray(value)) {
      // Handle array values by appending each item with the same key
      value.forEach((item, index) => {
        // Handle array of files
        if (item instanceof Blob) {
          formData.append(`${key}[${index}]`, item);
        } else {
          // Handle array of primitives
          formData.append(`${key}[${index}]`, String(item));
        }
      });
    } else if (value instanceof Blob) {
      // Handle single file
      formData.append(key, value);
    } else {
      // Handle primitive values
      formData.append(key, String(value));
    }
  }

  return formData;
};
