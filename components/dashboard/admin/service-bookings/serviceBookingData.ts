export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export type ServiceBooking = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  service: string;
  requestedDate: string;
  submittedAt: string;
  status: BookingStatus;
  propertyAddress: string;
  notes: string;
};

export const serviceBookings: ServiceBooking[] = [
  {
    id: "SB-2026-1042",
    customerName: "Ayesha Rahman",
    email: "ayesha.rahman@example.com",
    phone: "+880 1712-345678",
    service: "Roof Waterproofing",
    requestedDate: "2026-11-05T10:00:00+06:00",
    submittedAt: "2026-10-25T09:42:00+06:00",
    status: "Pending",
    propertyAddress: "House 18, Road 7, Dhanmondi, Dhaka",
    notes: "Recurring water seepage near the rooftop stairwell.",
  },
  {
    id: "SB-2026-1041",
    customerName: "Mahmud Hasan",
    email: "mahmud.hasan@example.com",
    phone: "+880 1811-234567",
    service: "Epoxy Flooring",
    requestedDate: "2026-11-07T14:00:00+06:00",
    submittedAt: "2026-10-24T16:18:00+06:00",
    status: "Confirmed",
    propertyAddress: "Plot 42, Block C, Bashundhara R/A, Dhaka",
    notes: "Commercial showroom floor assessment requested.",
  },
  {
    id: "SB-2026-1040",
    customerName: "Nusrat Jahan",
    email: "nusrat.jahan@example.com",
    phone: "+880 1913-456789",
    service: "Basement Waterproofing",
    requestedDate: "2026-10-22T11:30:00+06:00",
    submittedAt: "2026-10-18T10:05:00+06:00",
    status: "Completed",
    propertyAddress: "Road 3, Sector 11, Uttara, Dhaka",
    notes: "Inspection and treatment for damp basement walls.",
  },
  {
    id: "SB-2026-1039",
    customerName: "Imran Chowdhury",
    email: "imran.c@example.com",
    phone: "+880 1614-567890",
    service: "Heat Proofing",
    requestedDate: "2026-11-09T09:00:00+06:00",
    submittedAt: "2026-10-23T13:27:00+06:00",
    status: "Pending",
    propertyAddress: "House 6, Road 12, Banani, Dhaka",
    notes: "Wants an assessment before the next dry season.",
  },
  {
    id: "SB-2026-1038",
    customerName: "Farzana Akter",
    email: "farzana.akter@example.com",
    phone: "+880 1715-678901",
    service: "Injection Grouting",
    requestedDate: "2026-10-30T15:00:00+06:00",
    submittedAt: "2026-10-21T11:52:00+06:00",
    status: "Confirmed",
    propertyAddress: "Flat 4B, Road 2, Mohammadpur, Dhaka",
    notes: "Cracks observed along a retaining wall.",
  },
  {
    id: "SB-2026-1037",
    customerName: "Tanvir Ahmed",
    email: "tanvir.ahmed@example.com",
    phone: "+880 1816-789012",
    service: "PU Flooring",
    requestedDate: "2026-10-28T10:30:00+06:00",
    submittedAt: "2026-10-19T08:35:00+06:00",
    status: "Cancelled",
    propertyAddress: "Factory 12, BSCIC Industrial Estate, Tongi",
    notes: "Customer requested to postpone the site visit.",
  },
  {
    id: "SB-2026-1036",
    customerName: "Sadia Islam",
    email: "sadia.islam@example.com",
    phone: "+880 1917-890123",
    service: "Expansion Joint Sealing",
    requestedDate: "2026-11-03T13:00:00+06:00",
    submittedAt: "2026-10-20T15:44:00+06:00",
    status: "Pending",
    propertyAddress: "Building 5, Road 90, Gulshan 2, Dhaka",
    notes: "Joint sealant replacement for a multi-storey building.",
  },
  {
    id: "SB-2026-1035",
    customerName: "Rafiq Uddin",
    email: "rafiq.uddin@example.com",
    phone: "+880 1618-901234",
    service: "Sports Flooring",
    requestedDate: "2026-10-16T09:30:00+06:00",
    submittedAt: "2026-10-10T12:11:00+06:00",
    status: "Completed",
    propertyAddress: "Community Sports Complex, Savar, Dhaka",
    notes: "Court surface review and maintenance consultation.",
  },
  {
    id: "SB-2026-1034",
    customerName: "Jannatul Ferdous",
    email: "jannatul.f@example.com",
    phone: "+880 1719-012345",
    service: "Polished Concrete",
    requestedDate: "2026-11-12T11:00:00+06:00",
    submittedAt: "2026-10-26T17:03:00+06:00",
    status: "Pending",
    propertyAddress: "Road 10, Sector 4, Uttara, Dhaka",
    notes: "New office fit-out; requested floor finish options.",
  },
  {
    id: "SB-2026-1033",
    customerName: "Shahriar Kabir",
    email: "shahriar.kabir@example.com",
    phone: "+880 1820-123456",
    service: "ETP Protective Coating",
    requestedDate: "2026-10-20T14:30:00+06:00",
    submittedAt: "2026-10-08T09:19:00+06:00",
    status: "Completed",
    propertyAddress: "Unit 7, DEPZ, Ashulia, Dhaka",
    notes: "Protective coating follow-up inspection.",
  },
];
