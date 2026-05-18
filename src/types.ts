export interface SubjectResult {
  code: string;
  name: string;
  internal: number;
  external: number;
  total: number;
  status: "Pass" | "Fail" | "Absent";
}

export interface StudentResult {
  rollNo: string;
  regNo: string;
  name: string;
  parentage: string;
  session: string;
  course: string;
  branch: string;
  semester: string;
  college: string;
  subjects: SubjectResult[];
  grandTotal: number;
  resultStatus: string;
}
