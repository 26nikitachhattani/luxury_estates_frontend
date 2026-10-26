
import api from "./axios";

export const submitInquiry = (propertyId, data) =>
  api.post(`/properties/${propertyId}/inquiries/`, data);

export const getInquiries = () =>
  api.get("/inquiries/");
